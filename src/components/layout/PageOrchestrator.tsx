'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { HeroSection } from '@/components/hero/HeroSection';
import { CuratedReadyPlans } from '@/components/home/CuratedReadyPlans';
import { PlanGeneratorWizard } from '@/components/planner/PlanGeneratorWizard';
import { PlanResultsView } from '@/components/timeline/PlanResultsView';
import { ExploreDirectory } from '@/components/explore/ExploreDirectory';
import { CursorGlow } from '@/components/ui/CursorGlow';
import { Toast } from '@/components/ui/Toast';
import { RegisterSW } from '@/components/pwa/RegisterSW';
import { OfflineIndicator } from '@/components/pwa/OfflineIndicator';
import { SavedPlansModal } from '@/components/saved/SavedPlansModal';
import { reconstructPlanFromUrl } from '@/services/shareService';
import { useItineraryStore } from '@/store/useItineraryStore';

// Easing Wizard (https://easingwizard.com/) Spring Physics for Seamless Tab Transitions
const pageMotionVariants = {
  initial: { opacity: 0, y: 14, scale: 0.995 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 340,
      damping: 30,
      mass: 0.85,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.995,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
};

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

      {/* Ultra-Luxury Ambient Mesh Gradients (Slow-Floating Metallic Gold & Red Sea Teal/Cyan) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="absolute -top-[10%] -start-[10%] w-[55vw] h-[55vw] max-w-[680px] max-h-[680px] rounded-full bg-gradient-to-br from-[#D4AF37]/16 to-[#F5D07A]/04 blur-[130px] animate-ambient-orb-1" />
        <div className="absolute top-[35%] -end-[10%] w-[50vw] h-[50vw] max-w-[620px] max-h-[620px] rounded-full bg-gradient-to-tl from-[#0EA5E9]/12 to-[#10B981]/05 blur-[140px] animate-ambient-orb-2" />
      </div>

      {/* PERSISTENT APP SHELL */}
      <div className="flex-1 flex flex-col w-full relative z-10">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Application Content Container */}
        <main className="flex-1 w-full mx-auto py-2 sm:py-4 pb-32 md:pb-12">
          <AnimatePresence mode="wait">
            {/* TAB 1: Home Screen */}
            {activeNavTab === 'home' && (
              <motion.div
                key="home"
                variants={pageMotionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-10 sm:space-y-24 lg:space-y-32"
              >
                {/* 1. Grand Widescreen Atmospheric Hero */}
                <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6">
                  <HeroSection />
                </div>
              </motion.div>
            )}

            {/* TAB 2: 7-Step Lightning Smart Wizard */}
            {activeNavTab === 'quick-plan' && (
              <motion.div
                key="quick-plan"
                variants={pageMotionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8"
              >
                <PlanGeneratorWizard />
              </motion.div>
            )}

            {/* TAB 3: 3-Plan Results Timeline & Budget Matrix */}
            {activeNavTab === 'timeline' && (
              <motion.div
                key="timeline"
                variants={pageMotionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8"
              >
                <PlanResultsView />
              </motion.div>
            )}

            {/* TAB 4: Explore Jeddah Catalog & Interactive Map */}
            {activeNavTab === 'explore' && (
              <motion.div
                key="explore"
                variants={pageMotionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8"
              >
                <ExploreDirectory />
              </motion.div>
            )}

            {/* TAB 5: Curated Guides */}
            {activeNavTab === 'curated' && (
              <motion.div
                key="curated"
                variants={pageMotionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8"
              >
                <CuratedReadyPlans />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Global Modals & Notifications */}
        <SavedPlansModal />
        <Toast />
        <OfflineIndicator />
        <RegisterSW />

        {/* Footer (Hidden on Home screen for an ultra-clean, minimalist landing interface) */}
        {(activeNavTab === 'explore' || activeNavTab === 'curated') && <Footer />}

        {/* Mobile Bottom Dock Navigation */}
        <MobileNav />
      </div>
    </div>
  );
};

export default PageOrchestrator;
