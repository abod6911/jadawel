'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { JadawelIntro } from '@/components/ui/JadawelIntro';
import { JadawelKineticHero } from '@/components/hero/JadawelKineticHero';
import { SocialProofBar } from '@/components/home/SocialProofBar';
import { BentoMoodGrid } from '@/components/home/BentoMoodGrid';
import { CuratedReadyPlans } from '@/components/home/CuratedReadyPlans';
import { PlanGeneratorWizard } from '@/components/planner/PlanGeneratorWizard';
import { PlanResultsView } from '@/components/timeline/PlanResultsView';
import { ExploreDirectory } from '@/components/explore/ExploreDirectory';
import { useItineraryStore } from '@/store/useItineraryStore';

export const PageOrchestrator: React.FC = () => {
  const [introDone, setIntroDone] = useState(false);
  const activeNavTab = useItineraryStore((state) => state.activeNavTab);

  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-[#090B0E] text-pearl selection:bg-gold-500/30 selection:text-gold-300 overflow-x-hidden">
      {/* 1. BULLETPROOF PRELOADER ENGINE (GPU-Accelerated 60fps & Failsafe Unlocked) */}
      <JadawelIntro onComplete={() => setIntroDone(true)} />

      {/* 2. PERSISTENT APP SHELL */}
      <motion.div
        className="flex-1 flex flex-col w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Application Content Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 mb-20 md:mb-10">
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
                {/* 1. Cinematic Luxury Kinetic Constellation Hero */}
                <JadawelKineticHero />

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
