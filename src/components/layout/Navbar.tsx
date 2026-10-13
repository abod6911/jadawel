'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  Calendar,
  Navigation,
  Globe,
  Bookmark,
  Flame,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { soundEngine } from '@/utils/audioEngine';
import { JadawelLogo } from '@/components/ui/JadawelLogo';
import { useJeddahWeather } from '@/hooks/useJeddahWeather';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();
  const activeNavTab = useItineraryStore((state) => state.activeNavTab);
  const setActiveNavTab = useItineraryStore((state) => state.setActiveNavTab);
  const currentItinerary = useItineraryStore((state) => state.currentItinerary);
  const atmospherePhase = useItineraryStore((state) => state.atmospherePhase);
  const theme = useItineraryStore((state) => state.theme);
  const toggleTheme = useItineraryStore((state) => state.toggleTheme);
  const { atmosphere } = useJeddahWeather(atmospherePhase);

  const [jeddahTime, setJeddahTime] = React.useState<string>('');

  React.useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
          timeZone: 'Asia/Riyadh',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
        setJeddahTime(formatter.format(now));
      } catch (e) {
        setJeddahTime('');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [language]);

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

  return (
    <header className="sticky top-3 sm:top-5 z-50 w-full max-w-7xl mx-auto px-3 sm:px-6 transition-all duration-300">
      {/* Sleek Translucent Dark Glass - Minimalist Luxury with Specular Rim Light */}
      <div className="relative backdrop-blur-2xl bg-[#080B11]/90 border border-white/10 border-t-white/25 shadow-[0_12px_44px_rgba(0,0,0,0.75)] rounded-full px-3.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* 1. BRAND LOGO & IDENTITY */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            onClick={() => {
              soundEngine.playClick();
              setActiveNavTab('home');
            }}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <JadawelLogo className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black text-white group-hover:text-[#F3DA9C] transition-colors tracking-tight">
                {language === 'ar' ? 'جداول' : 'Jadawel'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E5C378]/15 text-[#F5E2B3] font-black border border-[#E5C378]/30 shadow-sm">
                {language === 'ar' ? 'جدة' : 'Jeddah'}
              </span>
            </div>
          </div>

          {/* Discreet Weather & Real-time Live Clock Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[11px] font-medium text-slate-300">
              {language === 'ar' ? atmosphere.phaseNameAr : atmosphere.phaseNameEn}
            </span>
            <span className="text-white/20">•</span>
            <span className="text-[11px] font-mono text-slate-300 font-bold" dir="ltr">
              {atmosphere.temperatureC}°C
            </span>
            {jeddahTime && (
              <>
                <span className="text-white/20">•</span>
                <span className="text-[11px] font-semibold text-[#E5C378]">
                  {language === 'ar' ? `توقيت جدة: ${jeddahTime}` : `Jeddah: ${jeddahTime}`}
                </span>
              </>
            )}
          </div>
        </div>

        {/* 2. CENTER NAVIGATION TABS */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-white/[0.06]">
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
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer z-10 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {/* Clean Subtle Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavTabIndicator"
                    className="absolute inset-0 rounded-full bg-white/[0.1] border border-white/15 shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}

                <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-[#E5C378]' : 'text-slate-500'}`} />
                <span>{language === 'ar' ? item.labelAr : item.labelEn}</span>
                {item.badge !== undefined && (
                  <span className="w-4 h-4 rounded-full bg-[#E5C378] text-[#0B0D12] text-[9px] font-black flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* 3. UTILITIES (Planner CTA, Theme & Language) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quick CTA to Planner */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setActiveNavTab('quick-plan');
            }}
            className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E5C378]/15 hover:bg-[#E5C378]/25 border border-[#E5C378]/30 text-[#F5E2B3] text-xs font-bold transition-all shadow-sm cursor-pointer select-none"
          >
            <span>{language === 'ar' ? 'صانع الجداول ✦' : 'Plan Trip ✦'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              toggleTheme();
            }}
            className="p-2 sm:p-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/80 hover:text-white transition-colors flex items-center justify-center cursor-pointer touch-manipulation"
            title={theme === 'dark' ? (language === 'ar' ? 'التحويل إلى وضع رمل وبحر (فاتح)' : 'Switch to Sand & Sea (Light)') : (language === 'ar' ? 'التحويل إلى وضع ليل جدة (داكن)' : 'Switch to Golden Jeddah Night (Dark)')}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-blue-400" />
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
