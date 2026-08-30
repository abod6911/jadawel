'use client';

import React, { useState, useEffect } from 'react';
import { Waves, Sunset, Navigation, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { getJeddahAtmosphere, JeddahAtmosphere } from '@/utils/atmosphereEngine';
import { soundEngine } from '@/utils/audioEngine';

export const HeroStatusBar: React.FC = () => {
  const { language } = useLanguage();
  const [atmosphere, setAtmosphere] = useState<JeddahAtmosphere>(getJeddahAtmosphere());
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAtmosphere(getJeddahAtmosphere());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundEngine.playClick();
    }
  };

  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-2 p-2.5 sm:px-4 rounded-2xl bg-navy-800/90 backdrop-blur-xl border border-white/10 shadow-lg text-xs font-bold text-text-lightPrimary">
      {/* Dynamic Status Badges */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-start">
        {/* 1. Coastal Weather with explicit LTR temperature rendering */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-teal-500/15 text-teal-300">
          <Waves className="w-3.5 h-3.5 shrink-0" />
          <span className="flex items-center gap-1">
            <span>{language === 'ar' ? 'الكورنيش:' : 'Corniche:'}</span>
            <bdo dir="ltr" className="inline-block font-sans font-black">
              {atmosphere.temperatureC}°C
            </bdo>
            <span className="text-[11px] text-teal-200">
              • {language === 'ar' ? atmosphere.weatherConditionAr : atmosphere.weatherConditionEn}
            </span>
          </span>
        </div>

        {/* 2. Live Sunset Countdown */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gold-500/15 text-gold-400">
          <Sunset className="w-3.5 h-3.5 shrink-0" />
          <span>
            {language === 'ar'
              ? atmosphere.sunsetCountdownTextAr
              : atmosphere.sunsetCountdownTextEn}
          </span>
        </div>

        {/* 3. Traffic Status */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-status-success/20 text-emerald-300">
          <Navigation className="w-3.5 h-3.5 shrink-0" />
          <span>
            {language === 'ar' ? 'حركة الطرق: انسيابية 🟢' : 'Traffic: Smooth Flow 🟢'}
          </span>
        </div>
      </div>

      {/* Tactile Audio Sound Toggle */}
      <button
        type="button"
        onClick={handleToggleSound}
        className="px-2.5 py-1 rounded-xl bg-navy-700 hover:bg-navy-600 border border-white/10 text-slate-300 hover:text-gold-400 transition-colors flex items-center gap-1.5 cursor-pointer text-[11px] shrink-0"
        title={isMuted ? 'تفعيل المؤثرات الصوتية' : 'كتم المؤثرات الصوتية'}
      >
        {isMuted ? (
          <>
            <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            <span>{language === 'ar' ? 'صامت' : 'Muted'}</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5 text-coral-400 animate-pulse" />
            <span>{language === 'ar' ? 'مؤثرات صوتية' : 'Sound FX'}</span>
          </>
        )}
      </button>
    </div>
  );
};
