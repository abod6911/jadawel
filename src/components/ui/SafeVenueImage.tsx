'use client';

import React, { useState } from 'react';
import {
  Coffee,
  Waves,
  UtensilsCrossed,
  Landmark,
  Sparkles,
  Compass,
  MapPin,
  Trees,
} from 'lucide-react';
import { getAssetUrl } from '@/utils/paths';

interface SafeVenueImageProps {
  src?: string | null;
  alt: string;
  category?: string;
  className?: string;
  fallbackIconClassName?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
}

function getCategoryTheme(category?: string) {
  const cat = (category || '').toLowerCase();

  if (cat.includes('cafe') || cat.includes('coffee')) {
    return {
      gradient: 'from-[#2A1E14] via-[#1A130C] to-[#0A0704]',
      icon: Coffee,
      iconColor: 'text-amber-400',
      labelAr: 'كافيه ومشروبات',
      labelEn: 'Specialty Cafe',
    };
  }

  if (cat.includes('beach') || cat.includes('waterfront') || cat.includes('sea')) {
    return {
      gradient: 'from-[#0A2633] via-[#061822] to-[#030C12]',
      icon: Waves,
      iconColor: 'text-teal-400',
      labelAr: 'إطلالة بحرية',
      labelEn: 'Waterfront',
    };
  }

  if (cat.includes('restaurant') || cat.includes('culinary') || cat.includes('food')) {
    return {
      gradient: 'from-[#2B170F] via-[#1A0D08] to-[#0A0503]',
      icon: UtensilsCrossed,
      iconColor: 'text-[#E5C378]',
      labelAr: 'مطعم وتذوق',
      labelEn: 'Dining Experience',
    };
  }

  if (cat.includes('heritage') || cat.includes('cultural') || cat.includes('museum')) {
    return {
      gradient: 'from-[#241B0E] via-[#171108] to-[#0A0703]',
      icon: Landmark,
      iconColor: 'text-[#F5D07A]',
      labelAr: 'تراث وثقافة',
      labelEn: 'Cultural Heritage',
    };
  }

  if (cat.includes('activity') || cat.includes('entertainment') || cat.includes('arts')) {
    return {
      gradient: 'from-[#21112D] via-[#140A1C] to-[#08040C]',
      icon: Sparkles,
      iconColor: 'text-purple-400',
      labelAr: 'فعالية وتجارب',
      labelEn: 'Activity & Arts',
    };
  }

  if (cat.includes('park') || cat.includes('nature')) {
    return {
      gradient: 'from-[#0E2416] via-[#09170E] to-[#040A06]',
      icon: Trees,
      iconColor: 'text-emerald-400',
      labelAr: 'ممشى وطبيعة',
      labelEn: 'Park & Walkway',
    };
  }

  return {
    gradient: 'from-[#141A26] via-[#0C1019] to-[#06090F]',
    icon: Compass,
    iconColor: 'text-[#E5C378]',
    labelAr: 'معلم سياحي',
    labelEn: 'Jeddah Landmark',
  };
}

export const SafeVenueImage: React.FC<SafeVenueImageProps> = ({
  src,
  alt,
  category,
  className = 'w-full h-full object-cover',
  fallbackIconClassName = 'w-8 h-8',
  loading = 'lazy',
  decoding = 'async',
}) => {
  const [hasError, setHasError] = useState<boolean>(!src);
  const theme = getCategoryTheme(category);
  const Icon = theme.icon;

  if (hasError || !src) {
    return (
      <div
        className={`w-full h-full relative flex flex-col items-center justify-center p-4 bg-gradient-to-br ${theme.gradient} select-none overflow-hidden`}
        role="img"
        aria-label={alt}
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12)_0%,transparent_70%)] pointer-events-none" />

        {/* Thematic Icon Container */}
        <div className="relative z-10 w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shadow-lg backdrop-blur-md mb-2">
          <Icon className={`${fallbackIconClassName} ${theme.iconColor} stroke-[1.75]`} />
        </div>

        {/* Subtle Venue Badge */}
        <span className="relative z-10 text-[11px] font-bold text-slate-300/80 tracking-wide">
          {alt || theme.labelAr}
        </span>
      </div>
    );
  }

  const resolvedUrl = src.startsWith('http') || src.startsWith('data:') ? src : getAssetUrl(src);

  return (
    <img
      src={resolvedUrl}
      alt={alt}
      loading={loading}
      decoding={decoding}
      onError={() => setHasError(true)}
      className={className}
    />
  );
};

export default SafeVenueImage;
