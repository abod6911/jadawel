'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useItineraryStore } from '@/store/useItineraryStore';
import { useLanguage } from '@/hooks/useLanguage';
import { soundEngine } from '@/utils/audioEngine';
import { getAssetUrl } from '@/utils/paths';
import { RawashinPattern } from '@/components/ui/RawashinPattern';
import { LayoutGroup, motion } from 'framer-motion';
import TextRotate from '@/components/fancy/text/text-rotate';

// Module-level flag: persists during client SPA tab switching, resets upon entering/reloading the site
let hasInitialEntered = false;

export const HeroSection: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isTextVisible, setIsTextVisible] = useState<boolean>(hasInitialEntered);

  // 2-second entry delay for the hero editorial headline & CTA
  useEffect(() => {
    if (hasInitialEntered) {
      setIsTextVisible(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsTextVisible(true);
      hasInitialEntered = true;
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Store bindings
  const updateWizardPreferences = useItineraryStore((state) => state.updateWizardPreferences);
  const generatePlanFromPreferences = useItineraryStore((state) => state.generatePlanFromPreferences);
  const isGeneratingPlan = useItineraryStore((state) => state.isGeneratingPlan);

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
    <section className="relative w-full min-h-[560px] sm:min-h-[640px] lg:min-h-[720px] rounded-[2.5rem] overflow-hidden bg-[#06090F] border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.9)] select-none flex flex-col justify-center">
      
      {/* 1. BACKGROUND CINEMATIC VIDEO & ATMOSPHERIC LAYERS */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={getAssetUrl('/images/places/north-corniche.jpg')}
          src={getAssetUrl('/videos/jeddah-corniche.mp4?v=20261012b')}
          className="w-full h-full object-cover opacity-60 transition-opacity duration-1000"
        />

        {/* Subtle Rawashin Historical Motif Background */}
        <div className="absolute inset-0 opacity-[0.045] pointer-events-none">
          <RawashinPattern className="text-[#D4AF37]" opacity={0.045} />
        </div>

        {/* Ambient Dark Gradient Layering (Zero-Cost GPU Composite) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06090F] via-[#06090F]/75 to-[#06090F]/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_0%,rgba(212,175,55,0.14),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#06090F] to-transparent" />
      </div>

      {/* 2. FOREGROUND CONTENT: Clean Headline + Direct Curate Action with 2s entrance delay */}
      <motion.div
        initial={hasInitialEntered ? false : { opacity: 0, y: 20 }}
        animate={
          isTextVisible
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 20 }
        }
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`relative z-10 w-full px-3.5 sm:px-8 lg:px-12 pt-12 pb-24 sm:pt-24 sm:pb-36 lg:pt-28 lg:pb-44 flex flex-col items-center ${
          isTextVisible ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        
        {/* EDITORIAL HERO HEADER */}
        <div className="w-full max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
          

          {/* Master Headline with Metallic Shimmer */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.4rem] font-bold tracking-normal leading-[1.3] sm:leading-[1.35] max-w-4xl mx-auto drop-shadow-md py-1">
            {language === 'ar' ? (
              <>
                <span className="block bg-gradient-to-r from-white via-[#FFF8E7] to-[#F5D07A] bg-clip-text text-transparent py-1.5 sm:py-2 px-1">
                  جدة.. كما لم تعشها من قبل
                </span>
                <LayoutGroup>
                  <motion.div
                    className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mt-2 sm:mt-3 text-2xl sm:text-4xl md:text-5xl font-bold font-heading py-1"
                    layout
                  >
                    <motion.span
                      className="text-slate-300"
                      layout
                      transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                    >
                      مسارك اليومي
                    </motion.span>
                    <TextRotate
                      as="span"
                      texts={[
                        'بدقة استثنائية',
                        'بين أزقة البلد',
                        'على بحر أبحر',
                        'في مقاهي الروضة',
                        'على كورنيش الحمراء',
                        'على مودك وميزانيتك',
                      ]}
                      splitBy="words"
                      staggerFrom="last"
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '-120%' }}
                      staggerDuration={0.025}
                      splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                      transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                      rotationInterval={2400}
                      mainClassName="text-[#F5D07A] px-3.5 sm:px-5 py-0.5 sm:py-1 rounded-2xl bg-[#0B111E]/90 backdrop-blur-md border border-[#D4AF37]/40 shadow-[0_4px_25px_rgba(212,175,55,0.22)] drop-shadow-[0_0_12px_rgba(245,208,122,0.4)] overflow-hidden justify-center items-center inline-flex"
                    />
                  </motion.div>
                </LayoutGroup>
              </>
            ) : (
              <>
                <span className="block bg-gradient-to-r from-white via-[#FFF8E7] to-[#F5D07A] bg-clip-text text-transparent py-1.5 sm:py-2 px-1">
                  Jeddah.. Curated Like Never Before
                </span>
                <LayoutGroup>
                  <motion.div
                    className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mt-2 sm:mt-3 text-2xl sm:text-4xl md:text-5xl font-bold font-heading py-1"
                    layout
                  >
                    <motion.span
                      className="text-slate-300"
                      layout
                      transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                    >
                      Bespoke Itineraries
                    </motion.span>
                    <TextRotate
                      as="span"
                      texts={[
                        'At Your Fingertips',
                        'Along Obhur Coast',
                        'Through Al-Balad Alleys',
                        'Across Al-Rawdah Cafés',
                        'By King Fahd Fountain',
                        'Tailored To Your Budget',
                      ]}
                      splitBy="words"
                      staggerFrom="last"
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '-120%' }}
                      staggerDuration={0.025}
                      splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                      transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                      rotationInterval={2400}
                      mainClassName="text-[#F5D07A] px-3.5 sm:px-5 py-0.5 sm:py-1 rounded-2xl bg-[#0B111E]/90 backdrop-blur-md border border-[#D4AF37]/40 shadow-[0_4px_25px_rgba(212,175,55,0.22)] drop-shadow-[0_0_12px_rgba(245,208,122,0.4)] overflow-hidden justify-center items-center inline-flex"
                    />
                  </motion.div>
                </LayoutGroup>
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
            className="h-13 sm:h-14 px-8 sm:px-12 rounded-full bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] hover:opacity-95 text-[#0B0E14] font-black text-sm sm:text-base flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-95 transition-all duration-300 ease-spring-snappy shadow-[0_8px_30px_rgba(223,159,61,0.35)] cursor-pointer disabled:opacity-50"
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

      </motion.div>
    </section>
  );
};

export default HeroSection;
