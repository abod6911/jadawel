'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { HeroSection } from '@/components/hero/HeroSection';
import { SocialProofBar } from '@/components/home/SocialProofBar';
import { BentoMoodGrid } from '@/components/home/BentoMoodGrid';
import { CuratedReadyPlans } from '@/components/home/CuratedReadyPlans';
import { PlanGeneratorWizard } from '@/components/planner/PlanGeneratorWizard';
import { PlanResultsView } from '@/components/timeline/PlanResultsView';
import { ExploreDirectory } from '@/components/explore/ExploreDirectory';
import { useItineraryStore } from '@/store/useItineraryStore';
import { useLanguage } from '@/hooks/useLanguage';

const JEDDAH_SNAPS = [
  { url: '/images/realms/obhur-marina.jpg', label: 'واجهة ومارينا أبحر', en: 'Obhur Marina' },
  { url: '/images/realms/albalad-heritage.jpg', label: 'رواشين البلد التاريخية', en: 'Al-Balad Heritage' },
  { url: '/images/realms/alrawdah-coffee.jpg', label: 'كافيهات الروضة المختصة', en: 'Al-Rawdah Coffee' },
];

export const PageOrchestrator: React.FC = () => {
  const [stage, setStage] = useState<'PRELOADING' | 'REVEALING' | 'COMPLETE'>('PRELOADING');
  const [count, setCount] = useState(1);
  const [cardIdx, setCardIdx] = useState(0);

  const activeNavTab = useItineraryStore((state) => state.activeNavTab);
  const { isRTL } = useLanguage();

  useEffect(() => {
    // Check if user already saw intro this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('jadawel_intro_seen')) {
      setStage('COMPLETE');
      return;
    }

    // Lock body scroll during preloader without jump
    document.body.style.overflow = 'hidden';

    const duration = 2200; // 2.2s total count
    const startTime = Date.now();

    const ticker = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Decelerating progression
      const easeProgress = 1 - Math.pow(1 - progress, 2.5);
      const val = Math.floor(easeProgress * 100);
      setCount(Math.max(1, Math.min(100, val)));

      if (progress >= 1) {
        clearInterval(ticker);
        setCount(100);
        setStage('REVEALING');

        setTimeout(() => {
          setStage('COMPLETE');
          document.body.style.overflow = '';
          try {
            sessionStorage.setItem('jadawel_intro_seen', 'true');
          } catch (e) {
            // Ignore storage errors
          }
        }, 900);
      }
    }, 20);

    const shuffler = setInterval(() => {
      setCardIdx((prev) => (prev + 1) % JEDDAH_SNAPS.length);
    }, 260);

    return () => {
      clearInterval(ticker);
      clearInterval(shuffler);
      document.body.style.overflow = '';
    };
  }, []);

  const isHeroVisible = stage === 'REVEALING' || stage === 'COMPLETE';

  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-[#081B26] text-pearl selection:bg-gold-500/30 selection:text-gold-300 overflow-x-hidden">
      {/* 1. CINEMATIC SYNCHRONIZED PRELOADER OVERLAY */}
      <AnimatePresence>
        {stage !== 'COMPLETE' && (
          <motion.div
            key="preloader-curtain"
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#081B26] select-none"
            initial={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
            exit={{
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
              transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
            }}
          >
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 bg-mesh-abyss opacity-60 pointer-events-none" />
            <div className="absolute inset-0 rawashin-lattice opacity-[0.03] pointer-events-none" />

            {/* Card Deck with Expansion */}
            <motion.div
              className="relative flex items-center justify-center w-[300px] h-[400px] sm:w-[340px] sm:h-[460px]"
              animate={
                stage === 'REVEALING'
                  ? { scale: 1.9, opacity: 0, filter: 'blur(12px)' }
                  : { scale: 1, opacity: 1 }
              }
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            >
              {JEDDAH_SNAPS.map((snap, idx) => {
                const isTop = cardIdx === idx;
                const angle = idx % 2 === 0 ? -9 : 9;

                return (
                  <motion.div
                    key={idx}
                    className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-abyss-900"
                    animate={{
                      scale: isTop ? 1.05 : 0.95,
                      rotate: isTop ? 0 : angle,
                      zIndex: isTop ? 10 : idx,
                      opacity: isTop ? 1 : 0.4,
                      y: isTop ? 0 : idx * 4,
                    }}
                    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                  >
                    <img
                      src={snap.url}
                      alt={snap.label}
                      className="w-full h-full object-cover brightness-[0.9] contrast-[1.1]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                    <div className="absolute bottom-4 inset-x-0 text-center px-2">
                      <span className="text-xs sm:text-sm font-black text-pearl block drop-shadow-md">
                        {snap.label}
                      </span>
                      <span className="text-[10px] text-gold-400 font-bold tracking-wider uppercase block mt-0.5">
                        {snap.en}
                      </span>
                    </div>
                  </motion.div>
                );
              })}

              {/* Monolithic Logo Badge & Ticker */}
              <div className="absolute z-20 flex flex-col items-center justify-center px-7 py-4 backdrop-blur-2xl bg-black/60 border border-white/25 rounded-3xl shadow-glow-gold min-w-[240px]">
                <div className="flex items-center gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-pearl tracking-tight drop-shadow-md">
                    جداول
                  </span>
                  <span className="bg-[#F46F52] text-white text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-lg tracking-widest uppercase shadow-glow-coral">
                    JADAWEL
                  </span>
                </div>
                <div className="flex items-center justify-between w-full mt-3.5 pt-2.5 border-t border-white/15">
                  <span className="text-[10px] sm:text-xs text-pearl-muted font-medium">
                    {stage === 'REVEALING' ? '✨ اكتملت خطط جدة' : 'جاري تجهيز المسار'}
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-black text-[#F6C77A]">
                    {String(count).padStart(3, '0')}%
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. PERSISTENT APP SHELL (Seamless Cascading Animation with Zero Layout Shift) */}
      <motion.div
        className="flex-1 flex flex-col w-full"
        initial="hidden"
        animate={isHeroVisible ? 'visible' : 'hidden'}
        variants={{
          hidden: { opacity: 0, scale: 0.98, y: 20 },
          visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
              staggerChildren: 0.12,
              delayChildren: 0.1,
            },
          },
        }}
      >
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Application Content Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 mb-20 md:mb-10">
          <AnimatePresence mode="wait">
            {/* TAB 1: Home Screen */}
            {activeNavTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-12"
              >
                {/* 1. Cinematic Full-Bleed 3-Way Hero & Quick Planner Dock */}
                <HeroSection />

                {/* 2. Live Social Proof Bar */}
                <SocialProofBar />

                {/* 3. Bento Mood Grid */}
                <BentoMoodGrid />

                {/* 4. Curated Ready Plans & Exclusive Partner Deals */}
                <CuratedReadyPlans />
              </motion.div>
            )}

            {/* TAB 2: 7-Step Lightning Smart Wizard */}
            {activeNavTab === 'quick-plan' && (
              <motion.div
                key="quick-plan"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <PlanGeneratorWizard />
              </motion.div>
            )}

            {/* TAB 3: 3-Plan Results Timeline & Budget Matrix */}
            {activeNavTab === 'timeline' && (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <PlanResultsView />
              </motion.div>
            )}

            {/* TAB 4: Explore Jeddah Catalog & Interactive Map */}
            {activeNavTab === 'explore' && (
              <motion.div
                key="explore"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <ExploreDirectory />
              </motion.div>
            )}

            {/* TAB 5: Curated Guides */}
            {activeNavTab === 'curated' && (
              <motion.div
                key="curated"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <CuratedReadyPlans />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <Footer />

        {/* Mobile Bottom Dock Navigation */}
        <MobileNav />
      </motion.div>
    </div>
  );
};

export default PageOrchestrator;
