'use client';

import { useState, useEffect } from 'react';
import { getLiveJeddahWeather, LiveWeatherData } from '@/services/weatherService';
import { getJeddahAtmosphere, JeddahAtmosphere, AtmospherePhase } from '@/utils/atmosphereEngine';
import { JeddahWeatherResponse, JEDDAH_FALLBACK_WEATHER } from '@/utils/weatherUtils';

export function useJeddahWeather(forcedPhase?: AtmospherePhase | 'auto') {
  const [atmosphere, setAtmosphere] = useState<JeddahAtmosphere>(() => getJeddahAtmosphere(forcedPhase));
  const [weather, setWeather] = useState<JeddahWeatherResponse | null>(null);
  const [liveWeather, setLiveWeather] = useState<LiveWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Synchronize atmosphere whenever phase or live weather changes
  useEffect(() => {
    const base = getJeddahAtmosphere(forcedPhase);
    if (weather) {
      setAtmosphere({
        ...base,
        temperatureC: weather.temperatureC,
        temperatureTextAr: `${weather.temperatureC}°C`,
        temperatureTextEn: `${weather.temperatureC}°C`,
        weatherConditionAr: weather.classification.labelAr,
        weatherConditionEn: weather.classification.labelEn,
      });
    } else {
      setAtmosphere(base);
    }
  }, [forcedPhase, weather]);

  // Fetch real-time weather with auto-refresh every 30 minutes
  useEffect(() => {
    let isMounted = true;

    async function loadWeather() {
      try {
        const data = await getLiveJeddahWeather();
        if (isMounted && data) {
          setWeather(data);
          setLiveWeather({
            temperatureC: data.temperatureC,
            conditionAr: data.classification.labelAr,
            conditionEn: data.classification.labelEn,
            isDay: true,
            humidity: data.humidity,
            lastUpdated: data.lastUpdated,
          });

          const base = getJeddahAtmosphere(forcedPhase);
          setAtmosphere({
            ...base,
            temperatureC: data.temperatureC,
            temperatureTextAr: `${data.temperatureC}°C`,
            temperatureTextEn: `${data.temperatureC}°C`,
            weatherConditionAr: data.classification.labelAr,
            weatherConditionEn: data.classification.labelEn,
          });
        }
      } catch (err) {
        console.warn('[useJeddahWeather] Error loading live weather:', err);
        if (isMounted) {
          setWeather(JEDDAH_FALLBACK_WEATHER);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadWeather();

    // Re-fetch every 30 minutes to match server cache TTL
    const intervalId = setInterval(loadWeather, 30 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [forcedPhase]);

  return {
    weather: weather || JEDDAH_FALLBACK_WEATHER,
    atmosphere,
    liveWeather,
    isLoading,
  };
}
