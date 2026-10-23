'use client';

import React, { useRef, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useItineraryStore } from '@/store/useItineraryStore';
import { useLanguage } from '@/hooks/useLanguage';
import { soundEngine } from '@/utils/audioEngine';
import { getAssetUrl } from '@/utils/paths';
import { getJeddahAtmosphere } from '@/utils/atmosphereEngine';
import { RawashinPattern } from '@/components/ui/RawashinPattern';

export const HeroSection: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Store bindings
  const updateWizardPreferences = useItineraryStore((state) => state.updateWizardPreferences);
  const generatePlanFromPreferences = useItineraryStore((state) => state.generatePlanFromPreferences);
  const isGeneratingPlan = useItineraryStore((state) => state.isGeneratingPlan);
  const atmospherePhase = useItineraryStore((state) => state.atmospherePhase);
  const atmosphere = getJeddahAtmosphere(atmospherePhase);

  // HTML5 Video Autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }, []);

  // Trigger Plan Generation
  const handleGeneratePlan = () => {
    soundEngine.playClick();
    updateWizardPreferences({
      startingDistrict: 'all_jeddah',
      companions: 'friends',
      budgetTier: 'moderate',
      duration: '4_to_6h',
      vibe: 'beach_sunset',
    });
    generatePlanFromPreferences();
  };

  return (
    <section className="relative w-full rounded-[2.5rem] overflow-hidden bg-[#06090F] border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.9)] select-none">
      
      {/* 1. BACKGROUND CINEMATIC VIDEO & ATMOSPHERIC LAYERS */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src={getAssetUrl('/videos/jeddah-corniche.mp4?v=20261012b')}
          className="w-full h-full object-cover brightness-[0.38] contrast-[1.15] saturate-[0.85] transition-opacity duration-1000"
        />

        {/* Subtle Rawashin Historical Motif Background */}
        <div className="absolute inset-0 opacity-[0.045] pointer-events-none">
          <RawashinPattern className="text-[#D4AF37]" opacity={0.045} />
        </div>

        {/* Ambient Dark Gradient Layering */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06090F] via-[#06090F]/60 to-[#06090F]/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_0%,rgba(212,175,55,0.14),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#06090F] to-transparent" />
      </div>

      {/* 2. FOREGROUND CONTENT: Clean Headline + Direct Curate Action */}
      <div className="relative z-10 w-full px-3.5 sm:px-8 lg:px-12 pt-10 pb-16 sm:py-24 lg:py-28 flex flex-col items-center">
        
        {/* EDITORIAL HERO HEADER */}
        <div className="w-full max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
          
          {/* Eyebrow Capsule */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] border-t-white/20 backdrop-blur-md text-[#F5D07A] text-xs font-semibold tracking-wide shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>
              {language === 'ar'
                ? `✦ المنصة المعتمدة لطلعات جدة • ${atmosphere.phaseNameAr} (${atmosphere.temperatureC}°C)`
                : `✦ Curated Red Sea Bride • ${atmosphere.phaseNameEn} (${atmosphere.temperatureC}°C)`}
            </span>
          </div>

          {/* Master Headline with Metallic Shimmer */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.4rem] font-black tracking-tight leading-[1.18] max-w-4xl mx-auto drop-shadow-md">
            {language === 'ar' ? (
              <>
                <span className="block bg-gradient-to-r from-white via-[#FFF8E7] to-[#F5D07A] bg-clip-text text-transparent">
                  جدة.. كما لم تعشها من قبل
                </span>
                <span className="block mt-2 sm:mt-3 text-2xl sm:text-4xl md:text-5xl font-bold font-sans">
                  <span className="text-slate-300">مسارك اليومي </span>
                  <span className="text-shimmer-champagne">بدقة استثنائية</span>
                </span>
              </>
            ) : (
              <>
                <span className="block bg-gradient-to-r from-white via-[#FFF8E7] to-[#F5D07A] bg-clip-text text-transparent">
                  Jeddah.. Curated Like Never Before
                </span>
                <span className="block mt-2 sm:mt-3 text-2xl sm:text-4xl md:text-5xl font-bold">
                  <span className="text-slate-300">Bespoke Itineraries </span>
                  <span className="text-shimmer-champagne">At Your Fingertips</span>
                </span>
              </>
            )}
          </h1>
        </div>

        {/* 3. PRIMARY ACTION: Ultra-Clean Direct Curate Button */}
        <div className="w-full max-w-md mx-auto mt-8 sm:mt-12 flex justify-center">
          <button
            type="button"
            onClick={handleGeneratePlan}
            disabled={isGeneratingPlan}
            className="h-13 sm:h-14 px-8 sm:px-12 rounded-full bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] hover:opacity-95 text-[#0B0E14] font-black text-sm sm:text-base flex items-center justify-center gap-2.5 active:scale-95 transition-all shadow-[0_8px_30px_rgba(223,159,61,0.35)] cursor-pointer disabled:opacity-50"
          >
            {isGeneratingPlan ? (
              <div className="w-5 h-5 border-2 border-[#0B0E14] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#0B0E14]" />
                <span>{language === 'ar' ? 'صمّم مسار طلعتي' : 'Curate My Route'}</span>
                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
