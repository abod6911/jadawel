'use client';

import React from 'react';
import AnimatedPathText from '@/components/fancy/text/text-along-path';
import { useLanguage } from '@/hooks/useLanguage';

export const RedSeaWaveRibbon: React.FC = () => {
  const { language } = useLanguage();

  // Mobile wave path (viewBox 0 0 700 70)
  const mobileWavePath =
    'M -120 35 C 60 15, 220 55, 400 35 C 580 15, 740 55, 920 35';

  // Desktop wave path (viewBox 0 0 1600 70)
  const desktopWavePath =
    'M -150 35 C 200 12, 450 58, 750 35 C 1050 12, 1300 58, 1600 35 C 1850 12, 2000 50, 2250 35';

  const textAr =
    '✦ جـداول جـدة • عـروس الـبـحـر الأحـمـر • مـسـارك الـمـتـكـامـل ✦ شـواطـئ أبـحـر الـفـارهـة ✦ رواشـيـن وتـراث الـبـلـد ✦ مـحـامـص الـروضـة الـعـصـريـة ✦ كـورنـيـش جـدة الـسـاحـر ✦ جـداول جـدة • عـروس الـبـحـر الأحـمـر • مـسـارك الـمـتـكـامـل ✦ شـواطـئ أبـحـر الـفـارهـة ✦ رواشـيـن وتـراث الـبـلـد ✦ ';

  const textEn =
    '✦ JADAWEL JEDDAH • BRIDE OF THE RED SEA • YOUR BESPOKE OUTING ✦ OBHUR YACHT CLUBS ✦ HISTORIC AL-BALAD ✦ RAWDAH CAFES ✦ RED SEA CORNICHE ✦ JADAWEL JEDDAH • BRIDE OF THE RED SEA ✦ OBHUR YACHTS ✦ HISTORIC AL-BALAD ✦ ';

  const displayText = language === 'ar' ? textAr : textEn;

  return (
    <section aria-label="Red Sea Animated Ribbon" className="relative w-full overflow-hidden select-none py-2 my-2 sm:my-5">
      {/* Subtle Ambient Radial Glow Behind Ribbon */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-20 bg-gradient-to-r from-transparent via-[#E5C378]/15 to-transparent blur-2xl pointer-events-none" />

      {/* Decorative Wave Stroke Line - Mobile */}
      <div className="block md:hidden relative w-full h-16">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
          viewBox="0 0 700 70"
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
          viewBox="0 0 700 70"
          preserveAspectRatio="none"
          text={displayText}
          textClassName="text-[13px] font-black fill-[#F5E2B3] drop-shadow-[0_2px_8px_rgba(229,195,120,0.7)]"
          duration={20}
          repeatCount="indefinite"
          textAnchor="start"
          svgClassName="w-full h-full"
        />
      </div>

      {/* Decorative Wave Stroke Line - Desktop */}
      <div className="hidden md:block relative w-full h-20">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
          viewBox="0 0 1600 70"
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
          viewBox="0 0 1600 70"
          preserveAspectRatio="none"
          text={displayText}
          textClassName="text-[14px] font-black fill-[#F5E2B3] drop-shadow-[0_2px_12px_rgba(229,195,120,0.6)]"
          duration={24}
          repeatCount="indefinite"
          textAnchor="start"
          svgClassName="w-full h-full"
        />
      </div>
    </section>
  );
};

export default RedSeaWaveRibbon;
