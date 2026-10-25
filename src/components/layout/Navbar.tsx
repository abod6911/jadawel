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

  const [isScrolled, setIsScrolled] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home' as const, labelAr: 'الرئيسية', shortLabelAr: 'الرئيسية', labelEn: 'Home', shortLabelEn: 'Home', icon: Flame },
    { id: 'quick-plan' as const, labelAr: 'صانع الجداول', shortLabelAr: 'الخطة', labelEn: 'Planner', shortLabelEn: 'Plan', icon: Navigation },
    {
      id: 'timeline' as const,
      labelAr: 'مسار الخطة',
      shortLabelAr: 'المسار',
      labelEn: 'Itinerary',
      shortLabelEn: 'Route',
      icon: Calendar,
      badge: currentItinerary ? currentItinerary.stops.length : undefined,
    },
    { id: 'explore' as const, labelAr: 'استكشف جدة', shortLabelAr: 'استكشف', labelEn: 'Explore', shortLabelEn: 'Explore', icon: Compass },
    { id: 'curated' as const, labelAr: 'جداول جاهزة', shortLabelAr: 'المقترحة', labelEn: 'Curated', shortLabelEn: 'Curated', icon: Bookmark },
  ];

  return (
    <header className="sticky top-[12px] z-50 w-full max-w-7xl mx-auto px-3 sm:px-6 transition-all duration-300">
      {/* Floating Pill Navbar - Ultra-Luxury Red Sea Night Palette with Specular Rim */}
      <div className={`relative backdrop-blur-2xl rounded-full px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4 md:gap-6 border transition-all duration-300 ${
        isScrolled
          ? 'bg-[#06090F]/94 border-[rgba(212,175,55,0.35)] shadow-[0_16px_40px_-10px_rgba(0,0,0,0.9),0_0_25px_rgba(212,175,55,0.18)]'
          : 'bg-[#06090F]/85 border-white/10 border-t-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.75)]'
      }`}>
        
        {/* 1. BRAND LOGO & IDENTITY */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            onClick={() => {
              soundEngine.playClick();
              setActiveNavTab('home');
            }}
            className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <JadawelLogo className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black text-white group-hover:text-[#F5D07A] transition-colors tracking-tight">
                {language === 'ar' ? 'جداول' : 'Jadawel'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#F5D07A] font-black border border-[#D4AF37]/35 shadow-sm">
                {language === 'ar' ? 'جدة' : 'Jeddah'}
              </span>
            </div>
          </div>

          {/* Discreet Weather Status Pill */}
          <div className="hidden xl:flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs shadow-inner shrink-0">
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
          </div>
        </div>

        {/* 2. CENTER NAVIGATION TABS */}
        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 bg-white/[0.03] p-1 rounded-full border border-white/[0.06] backdrop-blur-md">
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
                className={`relative px-2.5 sm:px-3 xl:px-4 py-1.5 sm:py-2 rounded-full text-xs xl:text-[13px] font-semibold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer z-10 whitespace-nowrap shrink-0 select-none ${
                  isActive
                    ? 'text-[#F5D07A] font-bold drop-shadow-[0_1px_4px_rgba(245,208,122,0.25)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {/* Clean Luxury Active Pill Indicator (No Bottom Line) */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavTabIndicator"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#D4AF37]/20 via-[#F5D07A]/22 to-[#D4AF37]/20 border border-[#D4AF37]/50 shadow-[0_2px_14px_rgba(212,175,55,0.25),inset_0_1px_1px_rgba(255,255,255,0.18)] -z-10"
                    transition={{ type: 'spring', stiffness: 480, damping: 34 }}
                  />
                )}

                <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-[#F5D07A]' : 'text-slate-400'}`} />
                <span className="hidden xl:inline">{language === 'ar' ? item.labelAr : item.labelEn}</span>
                <span className="xl:hidden">{language === 'ar' ? item.shortLabelAr : item.shortLabelEn}</span>
                {item.badge !== undefined && (
                  <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-[#06090F] text-[9px] font-black flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* 3. UTILITIES (Theme & Language) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
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
