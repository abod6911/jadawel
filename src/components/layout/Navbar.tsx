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
  Sun,
  Moon,
  Sparkles,
  Waves,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { soundEngine } from '@/utils/audioEngine';
import { JadawelLogo } from '@/components/ui/JadawelLogo';
import { useJeddahWeather } from '@/hooks/useJeddahWeather';
import { BorderBeam } from '@/components/fancy/BorderBeam';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();
  const activeNavTab = useItineraryStore((state) => state.activeNavTab);
  const setActiveNavTab = useItineraryStore((state) => state.setActiveNavTab);
  const currentItinerary = useItineraryStore((state) => state.currentItinerary);
  const atmospherePhase = useItineraryStore((state) => state.atmospherePhase);
  const setAtmospherePhase = useItineraryStore((state) => state.setAtmospherePhase);
  const [isMuted, setIsMuted] = useState(soundEngine.isSoundMuted());
  const { atmosphere } = useJeddahWeather(atmospherePhase);

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
      {/* Sleek Translucent Dark Glass (Smoky Glassmorphism 70% opacity) with 1px Metallic Champagne Gold Border */}
      <div className="relative glass-specular backdrop-blur-2xl bg-[#0B0D12]/70 border border-[#E5C378]/35 shadow-[0_16px_50px_rgba(0,0,0,0.85)] rounded-full px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4 overflow-hidden">
        {/* Razor-thin 1px metallic champagne gold specular highlight */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-[#E5C378]/60 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-[#E5C378]/25 to-transparent pointer-events-none" />
        
        {/* 1. BRAND LOGO & JEWEL IDENTITY */}
        <div
          onClick={() => {
            soundEngine.playClick();
            setActiveNavTab('home');
          }}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <JadawelLogo className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-[0_0_15px_rgba(229,195,120,0.5)]" />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-base sm:text-xl font-bold text-white group-hover:text-[#F3DA9C] transition-colors">
              {language === 'ar' ? 'جداول' : 'Jadawel'}
            </span>
            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-[#E5C378]/15 text-[#F5E2B3] font-bold border border-[#E5C378]/40 shadow-[0_0_12px_rgba(229,195,120,0.25)]">
              {language === 'ar' ? 'جدة' : 'Jeddah'}
            </span>
          </div>
        </div>

        {/* 2. LIVE JEDDAH TIME MACHINE & AMBIENT STATUS PILL (Interactive Day / Sunset / Night Controller) */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs shadow-inner relative overflow-hidden">
          <BorderBeam size={110} duration={8} borderWidth={1} colorFrom="#E5C378" colorTo="#F3DA9C" />
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[11px] font-bold text-white/90">
              {atmosphere.phaseNameAr}
            </span>
            <span className="text-[10px] font-mono text-gold-400/90 font-bold" dir="ltr">
              {atmosphere.temperatureC}°C
            </span>
          </div>

          <span className="w-1 h-1 rounded-full bg-white/20" />

          {/* Interactive Time Machine Modes Pill */}
          <div className="flex items-center gap-1 bg-[#090D14]/80 p-0.5 rounded-full border border-white/[0.06]">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setAtmospherePhase('golden_hour');
              }}
              title="أجواء الغروب الذهبي (Golden Hour)"
              className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                atmosphere.phase === 'golden_hour' && atmospherePhase === 'golden_hour'
                  ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Sunset className="w-3 h-3 text-amber-400" />
              <span>غروب</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setAtmospherePhase('nightlife');
              }}
              title="أجواء سهرة الليل (Nightlife)"
              className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                atmosphere.phase === 'nightlife' && atmospherePhase === 'nightlife'
                  ? 'bg-blue-500/30 text-blue-300 border border-blue-500/40 shadow-[0_0_8px_rgba(59,130,246,0.3)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Moon className="w-3 h-3 text-blue-400" />
              <span>سهرة</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setAtmospherePhase('daytime');
              }}
              title="أجواء بحرية نهارية (Daytime)"
              className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                atmosphere.phase === 'daytime' && atmospherePhase === 'daytime'
                  ? 'bg-teal-500/30 text-teal-300 border border-teal-500/40 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Sun className="w-3 h-3 text-cyan-400" />
              <span>نهار</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setAtmospherePhase('auto');
              }}
              title="مباشر بحسب توقيت جدة الفعلي (Live Sync)"
              className={`px-1.5 py-0.5 rounded-full text-[9px] font-black transition-all cursor-pointer ${
                atmospherePhase === 'auto'
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              حي
            </button>
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

        {/* 3. DESKTOP NAVIGATION TABS (Smoky Obsidian Glass & Champagne Gold Fluid Indicator) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#12151C]/80 p-1 rounded-full border border-[#E5C378]/25 shadow-inner">
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
                className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer z-10 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {/* Fluid layoutId Pill Background */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavTabIndicator"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#E5C378]/30 via-[#F3DA9C]/20 to-[#C8A452]/20 border border-[#E5C378]/60 shadow-[0_0_18px_rgba(229,195,120,0.35)] -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}

                <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-[#E5C378]' : 'text-slate-400'}`} />
                <span>{language === 'ar' ? item.labelAr : item.labelEn}</span>
                {item.badge !== undefined && (
                  <span className="w-4 h-4 rounded-full bg-[#E5C378] text-[#0B0D12] text-[9px] font-black flex items-center justify-center shadow-sm">
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
