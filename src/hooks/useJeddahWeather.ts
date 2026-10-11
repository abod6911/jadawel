'use client';

import { useState, useEffect } from 'react';
import { fetchJeddahWeather, LiveWeatherData } from '@/services/weatherService';
import { getJeddahAtmosphere, JeddahAtmosphere, AtmospherePhase } from '@/utils/atmosphereEngine';

export function useJeddahWeather(forcedPhase?: AtmospherePhase | 'auto') {
  const [atmosphere, setAtmosphere] = useState<JeddahAtmosphere>(() => getJeddahAtmosphere(forcedPhase));
  const [liveWeather, setLiveWeather] = useState<LiveWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Update atmosphere on phase change
  useEffect(() => {
    const base = getJeddahAtmosphere(forcedPhase);
    if (liveWeather) {
      setAtmosphere({
        ...base,
        temperatureC: liveWeather.temperatureC,
        temperatureTextAr: `${liveWeather.temperatureC}°C`,
        temperatureTextEn: `${liveWeather.temperatureC}°C`,
        weatherConditionAr: liveWeather.conditionAr,
        weatherConditionEn: liveWeather.conditionEn,
      });
    } else {
      setAtmosphere(base);
    }
  }, [forcedPhase, liveWeather]);

  // Fetch live weather on mount
  useEffect(() => {
    let isMounted = true;

    async function loadWeather() {
      setIsLoading(true);
      const data = await fetchJeddahWeather();
      if (isMounted && data) {
        setLiveWeather(data);
        const base = getJeddahAtmosphere(forcedPhase);
        setAtmosphere({
          ...base,
          temperatureC: data.temperatureC,
          temperatureTextAr: `${data.temperatureC}°C`,
          temperatureTextEn: `${data.temperatureC}°C`,
          weatherConditionAr: data.conditionAr,
          weatherConditionEn: data.conditionEn,
        });
      }
      if (isMounted) {
        setIsLoading(false);
      }
    }

    loadWeather();

    return () => {
      isMounted = false;
    };
  }, [forcedPhase]);

  return {
    atmosphere,
    liveWeather,
    isLoading,
  };
}
