'use client';

import React from 'react';
import { Car, Footprints, Navigation } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface TransitData {
  drivingMinutes: number;
  distanceKm: number;
  estimatedUberSAR: number;
  transitMode?: string;
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
  estimatedUberSAR = transit?.estimatedUberSAR ?? 18,
}) => {
  const { language } = useLanguage();
  const isWalking = transit?.transitMode === 'walking' || estimatedUberSAR === 0;

  return (
    <div className="relative py-2.5 ps-8 sm:ps-12 flex items-center gap-3 select-none text-start">
      {/* Dashed vertical connector line */}
      <div className="absolute top-0 bottom-0 start-4 sm:start-6 w-0.5 border-s-2 border-dashed border-[var(--border-gold)] opacity-70" />

      {/* Transit indicator badge */}
      <div className="relative z-10 flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-xl card-surface border border-[var(--border-subtle)] text-xs text-slate-300 shadow-sm">
        <div className="flex items-center gap-1.5 text-[var(--accent-gold)] font-bold">
          {isWalking ? (
            <Footprints className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Car className="w-3.5 h-3.5" />
          )}
          <span>
            {isWalking
              ? `~${drivingMinutes} ${language === 'ar' ? 'دقيقة كعابي (المشي)' : 'mins walk'}`
              : `~${drivingMinutes} ${language === 'ar' ? 'دقيقة مشوار' : 'mins drive'}`}
          </span>
        </div>

        <span className="text-white/20">•</span>

        <div className="flex items-center gap-1 text-slate-400">
          <Navigation className="w-3 h-3 text-teal-400" />
          <span>
            {distanceKm} {language === 'ar' ? 'كم' : 'km'}
          </span>
        </div>

        <span className="text-white/20">•</span>

        <div className="text-teal-300 font-bold font-mono">
          <span>
            {isWalking
              ? language === 'ar'
                ? '0 ر.س (كعابي)'
                : '0 SAR (Free)'
              : `~${estimatedUberSAR} ${language === 'ar' ? 'ر.س (أوبر)' : 'SAR (Uber)'}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransitConnector;
