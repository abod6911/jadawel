'use client';

import React from 'react';
import {
  Compass,
  Calendar,
  Sparkles,
  Globe,
  Bookmark,
  Flame,
  Radio,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { soundEngine } from '@/utils/audioEngine';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();
  const activeNavTab = useItineraryStore((state) => state.activeNavTab);
  const setActiveNavTab = useItineraryStore((state) => state.setActiveNavTab);
  const currentItinerary = useItineraryStore((state) => state.currentItinerary);

  const navItems = [
    { id: 'home' as const, labelAr: 'الرئيسية', labelEn: 'Home', icon: Flame },
    { id: 'quick-plan' as const, labelAr: 'صانع الجداول', labelEn: 'Smart Wizard', icon: Sparkles },
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
    <header className="sticky top-0 z-40 w-full bg-abyss-900/90 backdrop-blur-2xl border-b border-gold-500/25 transition-all">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-14 sm:h-20 flex items-center justify-between">
        {/* Brand Logo & Slogan */}
        <div
          onClick={() => {
            soundEngine.playClick();
            setActiveNavTab('home');
          }}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl overflow-hidden bg-abyss-950 border border-gold-500/40 p-0.5 flex items-center justify-center shadow-glow-gold group-hover:scale-105 transition-transform shrink-0">
            <img
              src="/images/brand/jadawel-logo.jpg"
              alt="Jadawel Logo"
              className="w-full h-full object-cover rounded-[10px] sm:rounded-[14px]"
            />
          </div>

          <div className="text-start">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-2xl font-black tracking-tight text-pearl drop-shadow-sm">
                {language === 'ar' ? 'جداول' : 'Jadawel'}
              </span>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-coral-500/20 text-coral-400 font-extrabold border border-coral-500/40">
                {language === 'ar' ? 'جدة' : 'Jeddah'}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-pearl-muted hidden sm:block font-medium">
              {language === 'ar' ? 'المخطط الذكي لرحلات عروس البحر' : 'Smart Itinerary Planner for Jeddah'}
            </span>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 bg-abyss-800/90 p-1.5 rounded-2xl border border-white/10">
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
                className={`relative px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-abyss-700 text-gold-400 border border-gold-500/40 shadow-glow-gold'
                    : 'text-pearl-muted hover:text-pearl hover:bg-abyss-700/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-teal-400'}`} />
                <span>{language === 'ar' ? item.labelAr : item.labelEn}</span>
                {item.badge !== undefined && (
                  <span className="w-5 h-5 rounded-full bg-coral-500 text-white text-[10px] font-black flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Utilities: Language Switcher with Safe 44x44px touch area on mobile */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              toggleLanguage();
            }}
            className="min-h-[44px] px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-abyss-800 hover:bg-abyss-700 border border-white/10 text-xs font-bold text-pearl-muted hover:text-gold-400 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm touch-manipulation"
            title="تبديل اللغة / Switch Language"
          >
            <Globe className="w-4 h-4 text-teal-400" />
            <span className="text-[11px] sm:text-xs">{language === 'ar' ? 'English' : 'عربي'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
