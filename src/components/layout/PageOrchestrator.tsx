'use client';

import React, { useEffect } from 'react';
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
import { JeddahRouteStudio } from '@/components/home/JeddahRouteStudio';
import { CursorGlow } from '@/components/ui/CursorGlow';
import { SavedPlansModal } from '@/components/saved/SavedPlansModal';
import { reconstructPlanFromUrl } from '@/services/shareService';
import { useItineraryStore } from '@/store/useItineraryStore';

export const PageOrchestrator: React.FC = () => {
  const activeNavTab = useItineraryStore((state) => state.activeNavTab);
  const theme = useItineraryStore((state) => state.theme);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('dark', 'light');
      root.classList.add(theme);
      root.setAttribute('data-theme', theme);
      root.style.colorScheme = theme;
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const search = window.location.search;
    if (!search) return;

    try {
      const params = new URLSearchParams(search);
      if (params.has('stops') || params.has('share')) {
        const reconstructed = reconstructPlanFromUrl(params);
        if (reconstructed) {
          useItineraryStore.setState({
            currentItinerary: reconstructed.itinerary,
            wizardPreferences: reconstructed.preferences,
            activeVariant: 'balanced',
            activeNavTab: 'timeline',
          });
        }
      }
    } catch (e) {
      console.warn('Failed to parse shared plan URL:', e);
    }
  }, []);

  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-[var(--bg-base)] text-[var(--text-heading)] selection:bg-[#E5C378]/30 selection:text-[#E5C378] overflow-x-hidden transition-colors duration-300">
      {/* LUXURY FLUID CURSOR SPOTLIGHT AMBIENT TRAIL */}
      <CursorGlow />

      {/* PERSISTENT APP SHELL - ZERO DELAY FIRST RENDER */}
      <div className="flex-1 flex flex-col w-full relative z-10">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Application Content Container */}
        <main className="flex-1 w-full mx-auto py-2 sm:py-4 mb-20 md:mb-10">
          <AnimatePresence mode="wait">
            {/* TAB 1: Home Screen */}
            {activeNavTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-12 sm:space-y-16"
              >
                {/* 1. Grand Widescreen Atmospheric Hero */}
                <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6">
                  <HeroSection />
                </div>

                {/* 2. Main Content Sections */}
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
                  {/* Live Social Proof Marquee Bar */}
                  <SocialProofBar />

                  {/* 3D Interactive Route Canvas / Dark Obsidian Route Studio */}
                  <JeddahRouteStudio />

                  {/* Asymmetrical 3D Bento Mood Grid */}
                  <BentoMoodGrid />

                  {/* Curated Ready Plans & Exclusive Partner Deals */}
                  <CuratedReadyPlans />
                </div>
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
                className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8"
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
                className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8"
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
                className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8"
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
                className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8"
              >
                <CuratedReadyPlans />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Global Modals */}
        <SavedPlansModal />

        {/* Footer */}
        <Footer />

        {/* Mobile Bottom Dock Navigation */}
        <MobileNav />
      </div>
    </div>
  );
};

export default PageOrchestrator;
