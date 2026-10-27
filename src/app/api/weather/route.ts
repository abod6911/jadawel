import { NextResponse } from 'next/server';
import {
  classifyJeddahWeather,
  JEDDAH_FALLBACK_WEATHER,
  JeddahWeatherResponse,
  RawWeatherData,
} from '@/utils/weatherUtils';
import {
  weatherApiRateLimiter,
  getClientIp,
  createRateLimitResponse,
  RateLimitResult,
} from '@/lib/rateLimit';

export const revalidate = 1800; // 30-minute ISR / Edge Cache

const OPEN_METEO_JEDDAH_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=21.5433&longitude=39.1728&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Asia%2FRiyadh';

// Cache TTL configurations (in milliseconds)
const FRESH_CACHE_TTL_MS = 1800 * 1000; // 30 minutes fresh
const STALE_TOLERANCE_MS = 3600 * 1000; // 60 minutes stale tolerance

interface ServerWeatherCache {
  data: JeddahWeatherResponse;
  timestamp: number;
}

// Module-level in-memory cache across server/worker invocations
let memoryCache: ServerWeatherCache | null = null;

// In-flight promise tracker for Request Coalescing (Singleflight pattern)
let inFlightWeatherPromise: Promise<JeddahWeatherResponse> | null = null;

/**
 * Performs upstream fetch to Open-Meteo with network timeout
 */
async function fetchUpstreamWeather(): Promise<JeddahWeatherResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

  try {
    const res = await fetch(OPEN_METEO_JEDDAH_URL, {
      signal: controller.signal,
      next: { revalidate: 1800 },
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Open-Meteo returned status ${res.status}`);
    }

    const json = await res.json();
    const current = json.current;

    if (!current) {
      throw new Error('Invalid Open-Meteo payload structure');
    }

    const rawData: RawWeatherData = {
      temperature_2m: Number(current.temperature_2m),
      relative_humidity_2m: Number(current.relative_humidity_2m),
      apparent_temperature: Number(current.apparent_temperature),
      weather_code: Number(current.weather_code),
      wind_speed_10m: Number(current.wind_speed_10m),
    };

    const classification = classifyJeddahWeather(rawData);

    const payload: JeddahWeatherResponse = {
      temperatureC: Math.round(rawData.temperature_2m),
      apparentTemperatureC: Math.round(rawData.apparent_temperature),
      humidity: Math.round(rawData.relative_humidity_2m),
      windSpeed: Math.round(rawData.wind_speed_10m),
      weatherCode: rawData.weather_code,
      classification,
      lastUpdated: current.time || new Date().toISOString(),
      isFallback: false,
    };

    return payload;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Coalesces concurrent calls so that only 1 external HTTP request is made
 * regardless of whether 100 or 10,000 simultaneous clients query the endpoint.
 */
async function getShieldedJeddahWeather(): Promise<{ data: JeddahWeatherResponse; cacheStatus: string }> {
  const now = Date.now();

  // 1. FRESH CACHE HIT: 0ms response, 0 external network requests
  if (memoryCache && now - memoryCache.timestamp < FRESH_CACHE_TTL_MS) {
    return { data: memoryCache.data, cacheStatus: 'HIT' };
  }

  // 2. STALE-WHILE-REVALIDATE: Serve stale data immediately, trigger background refresh
  if (memoryCache && now - memoryCache.timestamp < STALE_TOLERANCE_MS) {
    const staleData = memoryCache.data;

    if (!inFlightWeatherPromise) {
      inFlightWeatherPromise = fetchUpstreamWeather()
        .then((fresh) => {
          memoryCache = { data: fresh, timestamp: Date.now() };
          return fresh;
        })
        .catch((err) => {
          console.warn('[Weather Background Revalidation Warning]:', err);
          return staleData;
        })
        .finally(() => {
          inFlightWeatherPromise = null;
        });
    }

    return { data: staleData, cacheStatus: 'STALE' };
  }

  // 3. CACHE MISS / EXPIRED: Request Coalescing (All concurrent callers await the same in-flight Promise)
  if (!inFlightWeatherPromise) {
    inFlightWeatherPromise = fetchUpstreamWeather()
      .then((fresh) => {
        memoryCache = { data: fresh, timestamp: Date.now() };
        return fresh;
      })
      .catch((err) => {
        console.error('[Weather Upstream Fetch Error]:', err);
        return memoryCache ? memoryCache.data : JEDDAH_FALLBACK_WEATHER;
      })
      .finally(() => {
        inFlightWeatherPromise = null;
      });
  }

  const result = await inFlightWeatherPromise;
  return { data: result, cacheStatus: 'MISS' };
}

export async function GET(request: Request) {
  // During static export build phase, skip inspecting dynamic request.headers to allow prerendering
  const isStaticBuild = process.env.NEXT_PHASE === 'phase-production-build';

  let rateLimitResult: RateLimitResult | null = null;

  if (!isStaticBuild) {
    try {
      const clientIp = getClientIp(request);
      rateLimitResult = weatherApiRateLimiter.check(clientIp);

      if (!rateLimitResult.allowed) {
        return createRateLimitResponse(rateLimitResult);
      }
    } catch {
      // Fail-open for rate limiter inspection errors
    }
  }

  try {
    // 2. Coalesced Shielded Fetch
    const { data, cacheStatus } = await getShieldedJeddahWeather();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
        'CDN-Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
        'X-Cache-Status': cacheStatus,
        ...(rateLimitResult
          ? {
              'X-RateLimit-Limit': String(rateLimitResult.limit),
              'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            }
          : {}),
      },
    });
  } catch (error) {
    console.error('[Weather API Route Fatal Error]:', error);

    return NextResponse.json(
      {
        ...JEDDAH_FALLBACK_WEATHER,
        isFallback: true,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'X-Cache-Status': 'FALLBACK',
        },
      }
    );
  }
}
