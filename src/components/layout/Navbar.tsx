'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  Calendar,
  Navigation,
  Globe,
  Bookmark,
  Flame,
  Volume2,
  VolumeX,
  Sunset,
  Waves,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { soundEngine } from '@/utils/audioEngine';
import { JadawelLogo } from '@/components/ui/JadawelLogo';
import { getJeddahAtmosphere } from '@/utils/atmosphereEngine';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();
  const activeNavTab = useItineraryStore((state) => state.activeNavTab);
  const setActiveNavTab = useItineraryStore((state) => state.setActiveNavTab);
  const currentItinerary = useItineraryStore((state) => state.currentItinerary);
  const [isMuted, setIsMuted] = useState(soundEngine.isSoundMuted());
  const [atmosphere] = useState(getJeddahAtmosphere());

  const navItems = [
    { id: 'home' as const, labelAr: 'الرئيسية', labelEn: 'Home', icon: Flame },
    { id: 'quick-plan' as const, labelAr: 'صانع الجداول', labelEn: 'Planner', icon: Navigation },
    {
      id: 'timeline' as const,
      labelAr: 'مسار الخطة',
      labelEn: 'Itinerary',
      icon: Calendar,
      badge: currentItinerary ? currentItinerary.stops.length : undefined,
    },
    { id: 'explore' as const, labelAr: 'استكشف جدة', labelEn: 'Explore', icon: Compass },
    { id: 'curated' as const, labelAr: 'جداول جاهزة', labelEn: 'Curated', icon: Bookmark },
  ];

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundEngine.playClick();
    }
  };

  return (
    <header className="sticky top-3 sm:top-5 z-50 w-full max-w-7xl mx-auto px-3 sm:px-6 transition-all duration-300">
      {/* Detached Glass Floating Pill Container */}
      <div className="relative glass-specular backdrop-blur-2xl bg-[#0B0F15]/80 border border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.65)] rounded-full px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* 1. BRAND LOGO & JEWEL IDENTITY */}
        <div
          onClick={() => {
            soundEngine.playClick();
            setActiveNavTab('home');
          }}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <JadawelLogo className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-[0_0_12px_rgba(229,169,98,0.35)]" />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-base sm:text-xl font-black tracking-tight text-white group-hover:text-gold-300 transition-colors">
              {language === 'ar' ? 'جداول' : 'Jadawel'}
            </span>
            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-gold-500/15 text-gold-400 font-black border border-gold-500/30 shadow-[0_0_10px_rgba(229,169,98,0.2)]">
              {language === 'ar' ? 'جدة' : 'Jeddah'}
            </span>
          </div>
        </div>

        {/* 2. LIVE JEDDAH AMBIENT STATUS PILL (Apple-tier micro indicator) */}
        <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[11px] font-bold text-emerald-300/90">
              {language === 'ar' ? 'جدة الآن' : 'Jeddah Live'}
            </span>
          </div>

          <span className="w-1 h-1 rounded-full bg-white/20" />

          {/* Temperature & Atmosphere */}
          <div className="flex items-center gap-1.5 text-white/90 font-mono font-bold text-[11px]">
            <Sunset className="w-3.5 h-3.5 text-gold-400" />
            <span dir="ltr">{atmosphere.temperatureC}°C</span>
          </div>

          <span className="w-1 h-1 rounded-full bg-white/20" />

          {/* Interactive Audio Wave Equalizer (Reacts when sound is enabled) */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="flex items-center gap-1 text-[11px] font-bold text-pearl-muted hover:text-gold-300 transition-colors cursor-pointer"
            title={isMuted ? 'تفعيل المؤثرات الصوتية' : 'كتم المؤثرات الصوتية'}
          >
            <div className="flex items-end gap-[2px] h-3 w-3.5 px-[1px]">
              <span className={`w-[2px] rounded-full bg-gold-400 transition-all duration-300 ${isMuted ? 'h-1 opacity-40' : 'h-3 animate-pulse'}`} />
              <span className={`w-[2px] rounded-full bg-gold-400 transition-all duration-300 ${isMuted ? 'h-1 opacity-40' : 'h-2 animate-bounce'}`} />
              <span className={`w-[2px] rounded-full bg-gold-400 transition-all duration-300 ${isMuted ? 'h-1 opacity-40' : 'h-3.5 animate-pulse'}`} />
            </div>
            <span className="text-[10px]">{isMuted ? (language === 'ar' ? 'صامت' : 'Muted') : (language === 'ar' ? 'حي' : 'Audio')}</span>
          </button>
        </div>

        {/* 3. DESKTOP NAVIGATION TABS (Fluid Framer Motion layoutId) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#131922]/60 p-1 rounded-full border border-white/[0.06] shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNavTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setActiveNavTab(item.id);
                }}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-black transition-colors flex items-center gap-1.5 cursor-pointer z-10 ${
                  isActive
                    ? 'text-white'
                    : 'text-white/60 hover:text-white/90'
                }`}
              >
                {/* Fluid layoutId Pill Background */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavTabIndicator"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-500/25 via-gold-400/20 to-amber-500/20 border border-gold-500/40 shadow-[0_0_16px_rgba(229,169,98,0.25)] -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}

                <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-gold-400' : 'text-teal-400/80'}`} />
                <span>{language === 'ar' ? item.labelAr : item.labelEn}</span>
                {item.badge !== undefined && (
                  <span className="w-4 h-4 rounded-full bg-coral-500 text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* 4. UTILITIES (Sound & Language Switcher) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound Toggle (Mobile / Compact) */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="p-2 sm:p-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 hover:text-gold-400 transition-colors flex items-center justify-center cursor-pointer touch-manipulation"
            title={isMuted ? 'تفعيل الصوت' : 'كتم الصوت'}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-white/40" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-gold-400" />
            )}
          </button>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              toggleLanguage();
            }}
            className="px-3 py-1.5 sm:py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-bold text-white/80 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer touch-manipulation"
            title="تبديل اللغة / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-[11px] sm:text-xs font-black">{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
