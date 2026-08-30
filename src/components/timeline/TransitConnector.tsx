'use client';

import React from 'react';
import { Car, Navigation } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface TransitData {
  drivingMinutes: number;
  distanceKm: number;
  estimatedUberSAR: number;
}

interface TransitConnectorProps {
  transit?: TransitData;
  drivingMinutes?: number;
  distanceKm?: number;
  estimatedUberSAR?: number;
}

export const TransitConnector: React.FC<TransitConnectorProps> = ({
  transit,
  drivingMinutes = transit?.drivingMinutes || 10,
  distanceKm = transit?.distanceKm || 3.5,
  estimatedUberSAR = transit?.estimatedUberSAR || 18,
}) => {
  const { language } = useLanguage();

  return (
    <div className="relative py-2.5 ps-8 sm:ps-12 flex items-center gap-3 select-none">
      {/* Dashed vertical connector line */}
      <div className="absolute top-0 bottom-0 start-4 sm:start-6 w-0.5 border-s-2 border-dashed border-gold-500/40" />

      {/* Transit indicator badge */}
      <div className="relative z-10 flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-xl bg-canvas-surface border border-canvas-border text-xs text-text-muted shadow-sm">
        <div className="flex items-center gap-1.5 text-gold-400 font-bold">
          <Car className="w-3.5 h-3.5" />
          <span>
            ~{drivingMinutes} {language === 'ar' ? 'دقيقة مشوار' : 'mins drive'}
          </span>
        </div>

        <span className="text-canvas-border">•</span>

        <div className="flex items-center gap-1 text-text-muted">
          <Navigation className="w-3 h-3 text-teal-400" />
          <span>
            {distanceKm} {language === 'ar' ? 'كم' : 'km'}
          </span>
        </div>

        <span className="text-canvas-border">•</span>

        <div className="text-teal-400 font-bold">
          <span>
            ~{estimatedUberSAR} {language === 'ar' ? 'ر.س (أوبر)' : 'SAR (Uber)'}
          </span>
        </div>
      </div>
    </div>
  );
};
