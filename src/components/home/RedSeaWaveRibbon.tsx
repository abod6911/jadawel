'use client';

import React from 'react';
import { AnimatedPathText } from '@/components/fancy/AnimatedPathText';
import { useLanguage } from '@/hooks/useLanguage';

export const RedSeaWaveRibbon: React.FC = () => {
  const { language } = useLanguage();

  // Mobile path (viewBox 0 0 460 52)
  const mobileWavePath =
    'M -80 26 C 35 10, 150 42, 265 26 C 380 10, 495 42, 600 26';

  // Desktop path (viewBox 0 0 1440 64)
  const desktopWavePath =
    'M -120 32 C 180 12, 420 52, 720 32 C 1020 12, 1260 52, 1560 32';

  const textAr =
    '✦ جـداول جـدة • عـروس الـبـحـر الأحـمـر • مـسـارك الـمـتـكـامـل ✦ شـواطـئ أبـحـر الـفـارهـة ✦ رواشـيـن وتـراث الـبـلـد ✦ مـحـامـص الـروضـة ✦ كـورنـيـش جـدة الـسـاحـر ✦ جـداول جـدة • عـروس الـبـحـر الأحـمـر • مـسـارك الـمـتـكـامـل ✦ شـواطـئ أبـحـر ✦ رواشـيـن وتـراث الـبـلـد ✦ ';

  const textEn =
    '✦ JADAWEL JEDDAH • BRIDE OF THE RED SEA • YOUR BESPOKE OUTING ✦ OBHUR YACHT CLUBS ✦ HISTORIC AL-BALAD ✦ RAWDAH CAFES ✦ RED SEA CORNICHE ✦ JADAWEL JEDDAH • BRIDE OF THE RED SEA ✦ OBHUR YACHTS ✦ HISTORIC AL-BALAD ✦ ';

  const displayText = language === 'ar' ? textAr : textEn;

  return (
    <section aria-label="Red Sea Animated Ribbon" className="relative w-full overflow-hidden select-none py-3 my-2 sm:my-4">
      {/* Subtle Ambient Radial Glow Behind Ribbon */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-16 bg-gradient-to-r from-transparent via-[#E5C378]/15 to-transparent blur-xl pointer-events-none" />

      {/* Decorative Wave Stroke Line - Mobile */}
      <div className="block md:hidden relative w-full h-12">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
          viewBox="0 0 460 52"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={mobileWavePath}
            stroke="url(#waveStrokeGlowMobile)"
            strokeWidth="1.5"
            fill="none"
          />
          <defs>
            <linearGradient id="waveStrokeGlowMobile" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E5C378" stopOpacity="0" />
              <stop offset="25%" stopColor="#E5C378" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#2DD4BF" stopOpacity="0.9" />
              <stop offset="75%" stopColor="#E5C378" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#E5C378" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <AnimatedPathText
          path={mobileWavePath}
          pathId="red-sea-wavy-ribbon-mobile"
          viewBox="0 0 460 52"
          preserveAspectRatio="none"
          text={displayText}
          textClassName="text-[12px] font-black tracking-wider fill-[#F5E2B3] drop-shadow-[0_2px_8px_rgba(229,195,120,0.7)]"
          duration={18}
          repeatCount="indefinite"
          textAnchor="start"
          svgClassName="w-full h-full"
        />
      </div>

      {/* Decorative Wave Stroke Line - Desktop */}
      <div className="hidden md:block relative w-full h-16">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
          viewBox="0 0 1440 64"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={desktopWavePath}
            stroke="url(#waveStrokeGlowDesktop)"
            strokeWidth="1.5"
            fill="none"
          />
          <defs>
            <linearGradient id="waveStrokeGlowDesktop" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E5C378" stopOpacity="0" />
              <stop offset="20%" stopColor="#E5C378" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#2DD4BF" stopOpacity="0.9" />
              <stop offset="80%" stopColor="#E5C378" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#E5C378" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <AnimatedPathText
          path={desktopWavePath}
          pathId="red-sea-wavy-ribbon-desktop"
          viewBox="0 0 1440 64"
          preserveAspectRatio="none"
          text={displayText}
          textClassName="text-[14px] font-black tracking-widest fill-[#F5E2B3] drop-shadow-[0_2px_12px_rgba(229,195,120,0.6)]"
          duration={22}
          repeatCount="indefinite"
          textAnchor="start"
          svgClassName="w-full h-full"
        />
      </div>
    </section>
  );
};

export default RedSeaWaveRibbon;
