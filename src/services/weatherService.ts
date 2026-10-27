/**
 * Weather Service for Jeddah using Open-Meteo API & Next.js Cached Route Handler
 * Coordinates: Latitude 21.5433, Longitude 39.1728 (Jeddah, Saudi Arabia)
 */

import {
  JeddahWeatherResponse,
  classifyJeddahWeather,
  JEDDAH_FALLBACK_WEATHER,
  RawWeatherData,
} from '@/utils/weatherUtils';

export interface LiveWeatherData {
  temperatureC: number;
  conditionAr: string;
  conditionEn: string;
  isDay: boolean;
  humidity: number;
  lastUpdated: string;
}

const CACHE_KEY = 'jadawel_jeddah_weather_cache_v3';
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes (matches Next.js revalidation)

const OPEN_METEO_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=21.5433&longitude=39.1728&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&timezone=Asia%2FRiyadh';

/**
 * Fetches real-time Jeddah weather with multi-tier resilience:
 * 1. Session Cache (instant client navigation)
 * 2. Next.js Internal Route Handler (/api/weather with next: { revalidate: 1800 })
 * 3. Direct Open-Meteo API fallback (if static CDN or API route unreachable)
 * 4. Jeddah safe meteorological baseline fallback (offline resilience)
 */
export async function getLiveJeddahWeather(): Promise<JeddahWeatherResponse> {
  if (typeof window === 'undefined') {
    return JEDDAH_FALLBACK_WEATHER;
  }

  // 1. Try reading valid cache from sessionStorage
  try {
    const cachedRaw = sessionStorage.getItem(CACHE_KEY);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      if (
        Date.now() - cached.timestamp < CACHE_DURATION_MS &&
        cached.data &&
        typeof cached.data.temperatureC === 'number' &&
        cached.data.classification
      ) {
        return cached.data as JeddahWeatherResponse;
      }
    }
  } catch {
    // Ignore storage parse errors
  }

  // 2. Try fetching from internal Next.js Route Handler
  try {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const apiRouteUrl = `${basePath}/api/weather`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(apiRouteUrl, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data: JeddahWeatherResponse = await res.json();
      if (data && typeof data.temperatureC === 'number' && data.classification) {
        saveToCache(data);
        return data;
      }
    }
  } catch {
    // Failover to direct Open-Meteo
  }

  // 3. Failover: Direct client-side fetch to Open-Meteo API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(OPEN_METEO_URL, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      const current = json.current;

      if (current) {
        const rawData: RawWeatherData = {
          temperature_2m: Number(current.temperature_2m),
          relative_humidity_2m: Number(current.relative_humidity_2m),
          apparent_temperature: Number(current.apparent_temperature),
          weather_code: Number(current.weather_code),
          wind_speed_10m: Number(current.wind_speed_10m),
        };

        const classification = classifyJeddahWeather(rawData);

        const weatherData: JeddahWeatherResponse = {
          temperatureC: Math.round(rawData.temperature_2m),
          apparentTemperatureC: Math.round(rawData.apparent_temperature),
          humidity: Math.round(rawData.relative_humidity_2m),
          windSpeed: Math.round(rawData.wind_speed_10m),
          weatherCode: rawData.weather_code,
          classification,
          lastUpdated: current.time || new Date().toISOString(),
          isFallback: false,
        };

        saveToCache(weatherData);
        return weatherData;
      }
    }
  } catch (err) {
    console.warn('[Jadawel Weather] Live fetch failed, using safe fallback:', err);
  }

  // 4. Safe Default Fallback
  return JEDDAH_FALLBACK_WEATHER;
}

/**
 * Backward compatibility wrapper for existing consumers
 */
export async function fetchJeddahWeather(): Promise<LiveWeatherData | null> {
  const data = await getLiveJeddahWeather();
  return {
    temperatureC: data.temperatureC,
    conditionAr: data.classification.labelAr,
    conditionEn: data.classification.labelEn,
    isDay: true,
    humidity: data.humidity,
    lastUpdated: data.lastUpdated,
  };
}

function saveToCache(data: JeddahWeatherResponse) {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), data })
    );
  } catch {
    // Ignore storage quota errors
  }
}
