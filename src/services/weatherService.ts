/**
 * Weather Service for Jeddah using Open-Meteo Free Public API
 * Coordinates: Latitude 21.5433, Longitude 39.1728 (Jeddah, Saudi Arabia)
 */

export interface LiveWeatherData {
  temperatureC: number;
  conditionAr: string;
  conditionEn: string;
  isDay: boolean;
  humidity: number;
  lastUpdated: string;
}

const CACHE_KEY = 'jadawel_jeddah_weather_cache';
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Maps WMO Weather Interpretation Codes to Arabic & English descriptions
 */
function mapWmoCodeToCondition(code: number, isDay: boolean): { ar: string; en: string } {
  if (code === 0) {
    return isDay
      ? { ar: 'سماء صافية ومشمسة ☀️', en: 'Clear & Sunny ☀️' }
      : { ar: 'سماء صافية وهادئة 🌙', en: 'Clear Night 🌙' };
  }
  if (code === 1 || code === 2) {
    return { ar: 'غيوم متفرقة ونسيم عليل 🌤️', en: 'Partly Cloudy 🌤️' };
  }
  if (code === 3) {
    return { ar: 'غائم جزئياً ☁️', en: 'Overcast ☁️' };
  }
  if (code >= 45 && code <= 48) {
    return { ar: 'ضباب خفيف ورطوبة بحرية 🌫️', en: 'Coastal Mist 🌫️' };
  }
  if (code >= 51 && code <= 67) {
    return { ar: 'أمطار خفيفة منعشة 🌧️', en: 'Light Rain 🌧️' };
  }
  if (code >= 80 && code <= 82) {
    return { ar: 'زخات مطر بحرية 🌦️', en: 'Passing Showers 🌦️' };
  }
  if (code >= 95) {
    return { ar: 'عواصف رعدية ⚡', en: 'Thunderstorm ⚡' };
  }
  return isDay
    ? { ar: 'أجواء بحرية معتدلة 🌊', en: 'Pleasant Coastal Weather 🌊' }
    : { ar: 'سهرة بحرية عليلة 🌙', en: 'Pleasant Coastal Evening 🌙' };
}

/**
 * Fetches real-time Jeddah weather from Open-Meteo with caching and fallback
 */
export async function fetchJeddahWeather(): Promise<LiveWeatherData | null> {
  if (typeof window === 'undefined') return null;

  // 1. Try reading valid cache from sessionStorage
  try {
    const cachedRaw = sessionStorage.getItem(CACHE_KEY);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      if (Date.now() - cached.timestamp < CACHE_DURATION_MS) {
        return cached.data;
      }
    }
  } catch {
    // Ignore cache parse errors
  }

  // 2. Fetch from Open-Meteo API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const url = 'https://api.open-meteo.com/v1/forecast?latitude=21.5433&longitude=39.1728&current=temperature_2m,relative_humidity_2m,weather_code,is_day&timezone=Asia%2FRiyadh';
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP error ${response.status}`);

    const json = await response.json();
    const current = json.current;

    const isDay = current.is_day === 1;
    const { ar, en } = mapWmoCodeToCondition(current.weather_code, isDay);

    const weatherData: LiveWeatherData = {
      temperatureC: Math.round(current.temperature_2m),
      conditionAr: ar,
      conditionEn: en,
      isDay,
      humidity: Math.round(current.relative_humidity_2m || 60),
      lastUpdated: current.time || new Date().toISOString(),
    };

    // Cache the result
    try {
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ timestamp: Date.now(), data: weatherData })
      );
    } catch {
      // Ignore quota errors
    }

    return weatherData;
  } catch (error) {
    console.warn('[Jadawel Weather] Open-Meteo fetch failed or timed out, using fallback.', error);
    return null;
  }
}
