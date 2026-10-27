'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useJeddahWeather } from '@/hooks/useJeddahWeather';

interface WeatherBadgeProps {
  className?: string;
}

export const WeatherBadge: React.FC<WeatherBadgeProps> = ({ className = '' }) => {
  const { language } = useLanguage();
  const { weather, isLoading } = useJeddahWeather();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Skeleton state: Identical footprint to prevent layout shift (CLS = 0)
  if (!isClient || (isLoading && !weather)) {
    return (
      <div
        className={`hidden xl:flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs shadow-inner shrink-0 animate-pulse select-none ${className}`}
        style={{ minWidth: '124px', height: '26px' }}
        aria-label="Loading Jeddah weather"
      >
        <span className="w-2 h-2 rounded-full bg-white/20 shrink-0" />
        <span className="w-7 h-3 rounded bg-white/10 shrink-0" />
        <span className="text-white/20 select-none">•</span>
        <span className="w-10 h-3 rounded bg-white/10 shrink-0" />
      </div>
    );
  }

  const { classification, temperatureC, humidity, windSpeed } = weather;

  const tooltipText =
    language === 'ar'
      ? `طقس جدة المباشر: ${temperatureC}°C (${classification.labelAr}) • الرطوبة: ${humidity}% • الرياح: ${windSpeed} كم/س`
      : `Jeddah Live Weather: ${temperatureC}°C (${classification.labelEn}) • Humidity: ${humidity}% • Wind: ${windSpeed} km/h`;

  return (
    <div
      className={`hidden xl:flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/15 text-xs shadow-inner shrink-0 transition-colors select-none cursor-default group ${className}`}
      title={tooltipText}
    >
      {/* 1. Dynamic Status Dot with Pulsing Glow */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
          style={{ backgroundColor: classification.dotColor }}
        />
        <span
          className="relative inline-flex rounded-full h-2 w-2"
          style={{
            backgroundColor: classification.dotColor,
            boxShadow: `0 0 8px ${classification.glowColor}`,
          }}
        />
      </span>

      {/* 2. Live Measured Temperature in °C */}
      <span className="text-[11px] font-mono text-slate-200 font-bold" dir="ltr">
        {temperatureC}°C
      </span>

      {/* 3. Dot Separator */}
      <span className="text-white/20 select-none">•</span>

      {/* 4. Authentic Jeddah Climate Classifier Label */}
      <span className="text-[11px] font-medium text-slate-300 group-hover:text-white transition-colors">
        {language === 'ar' ? classification.labelAr : classification.labelEn}
      </span>
    </div>
  );
};
