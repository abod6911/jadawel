'use client';

import React from 'react';
import { Flame, Compass, Navigation, Bookmark, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { soundEngine } from '@/utils/audioEngine';

export const MobileTabBar: React.FC = () => {
  const { language } = useLanguage();
  const activeNavTab = useItineraryStore((state) => state.activeNavTab);
  const setActiveNavTab = useItineraryStore((state) => state.setActiveNavTab);
  const currentItinerary = useItineraryStore((state) => state.currentItinerary);
  const wizardStep = useItineraryStore((state) => state.wizardStep) || 1;
  const setWizardStep = useItineraryStore((state) => state.setWizardStep);
  const generatePlanFromPreferences = useItineraryStore((state) => state.generatePlanFromPreferences);

  // WIZARD CONTROLLER MODE ON MOBILE
  if (activeNavTab === 'quick-plan') {
    const isRTL = language === 'ar';

    const handlePrev = () => {
      soundEngine.playClick();
      if (wizardStep > 1) {
        setWizardStep(wizardStep - 1);
      } else {
        setActiveNavTab('home');
      }
    };

    const handleNext = () => {
      soundEngine.playClick();
      if (wizardStep < 4) {
        setWizardStep(wizardStep + 1);
      } else {
        generatePlanFromPreferences();
      }
    };

    return (
      <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#090D14]/95 backdrop-blur-2xl border-t border-white/10 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_32px_rgba(0,0,0,0.8)] touch-manipulation select-none">
        <div className="flex items-center justify-between gap-3 h-16 px-4 max-w-lg mx-auto">
          {/* Back / Cancel Button */}
          <button
            type="button"
            onClick={handlePrev}
            className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-white/10 text-white border border-white/10 active:scale-95 transition-all cursor-pointer"
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{wizardStep === 1 ? (language === 'ar' ? 'إلغاء' : 'Cancel') : (language === 'ar' ? 'السابق' : 'Back')}</span>
          </button>

          {/* Step Indicator */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-slate-300">
              {language === 'ar' ? `خطوة ${wizardStep} من 4` : `Step ${wizardStep} of 4`}
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((step) => (
                <span
                  key={step}
                  className={`h-1.5 rounded-full transition-all ${
                    step === wizardStep
                      ? 'w-6 bg-[#E5C378]'
                      : step < wizardStep
                      ? 'w-2 bg-[#E5C378]/50'
                      : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Next / Generate Button */}
          <button
            type="button"
            onClick={handleNext}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] text-[#080B11] text-xs font-black flex items-center gap-1.5 shadow-[0_0_20px_rgba(229,195,120,0.4)] active:scale-95 transition-all cursor-pointer"
          >
            <span>
              {wizardStep === 4
                ? language === 'ar'
                  ? 'ابتكر خطتي ✨'
                  : 'Generate ✨'
                : language === 'ar'
                ? 'التالي'
                : 'Next'}
            </span>
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </nav>
    );
  }

  const handleCenterPlanClick = () => {
    soundEngine.playClick();
    if (currentItinerary) {
      setActiveNavTab('timeline');
    } else {
      setWizardStep(1);
      setActiveNavTab('quick-plan');
    }
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden glass-dock border-t border-[var(--border-subtle)] pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_32px_rgba(0,0,0,0.5)] touch-manipulation select-none">
      <div className="grid grid-cols-5 h-16 items-center px-1 max-w-lg mx-auto">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setActiveNavTab('home');
          }}
          className={`min-h-[44px] relative flex flex-col items-center justify-center h-full transition-all cursor-pointer ${
            activeNavTab === 'home' ? 'text-[var(--accent-gold)] font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Flame className={`w-5 h-5 transition-transform ${activeNavTab === 'home' ? 'scale-110 text-[var(--accent-gold)]' : 'text-slate-400'}`} />
          <span className="text-[10px] mt-1 font-bold truncate">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </span>
          {activeNavTab === 'home' && (
            <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-[var(--accent-gold)] shadow-[0_0_10px_rgba(229,195,120,0.6)]" />
          )}
        </button>

        {/* 2. Explore */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setActiveNavTab('explore');
          }}
          className={`min-h-[44px] relative flex flex-col items-center justify-center h-full transition-all cursor-pointer ${
            activeNavTab === 'explore' ? 'text-teal-300 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className={`w-5 h-5 transition-transform ${activeNavTab === 'explore' ? 'scale-110 text-teal-300' : 'text-slate-400'}`} />
          <span className="text-[10px] mt-1 font-bold truncate">
            {language === 'ar' ? 'استكشف' : 'Explore'}
          </span>
          {activeNavTab === 'explore' && (
            <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-teal-300 shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
          )}
        </button>

        {/* 3. Center Elevated Action Button: Plan */}
        <div className="relative flex items-center justify-center -top-3">
          <button
            type="button"
            onClick={handleCenterPlanClick}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#DF9F3D] via-[#E5C378] to-[#C8A452] text-[#080B11] flex items-center justify-center shadow-[0_0_25px_rgba(229,195,120,0.5)] border-2 border-[var(--bg-base)] hover:scale-105 active:scale-95 transition-all cursor-pointer relative group"
            title="اصنع خطتك أو افتح الجدول"
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5C378] opacity-25 pointer-events-none" />
            <Navigation className="w-6 h-6 text-[#080B11] group-hover:rotate-12 transition-transform" />
          </button>
        </div>

        {/* 4. Curated / Saved */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setActiveNavTab('curated');
          }}
          className={`min-h-[44px] relative flex flex-col items-center justify-center h-full transition-all cursor-pointer ${
            activeNavTab === 'curated' ? 'text-[var(--accent-gold)] font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bookmark className={`w-5 h-5 transition-transform ${activeNavTab === 'curated' ? 'scale-110 text-[var(--accent-gold)]' : 'text-slate-400'}`} />
          <span className="text-[10px] mt-1 font-bold truncate">
            {language === 'ar' ? 'المقترحة' : 'Curated'}
          </span>
          {activeNavTab === 'curated' && (
            <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-[var(--accent-gold)] shadow-[0_0_10px_rgba(229,195,120,0.6)]" />
          )}
        </button>

        {/* 5. Itinerary Timeline */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setActiveNavTab('timeline');
          }}
          className={`min-h-[44px] relative flex flex-col items-center justify-center h-full transition-all cursor-pointer ${
            activeNavTab === 'timeline' ? 'text-[var(--accent-gold)] font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <Calendar className={`w-5 h-5 transition-transform ${activeNavTab === 'timeline' ? 'scale-110 text-[var(--accent-gold)]' : 'text-slate-400'}`} />
            {currentItinerary && (
              <span className="absolute -top-1.5 -end-2 w-4 h-4 rounded-full bg-[var(--accent-gold)] text-[#080B11] text-[9px] font-black flex items-center justify-center shadow-sm">
                {currentItinerary.stops.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-bold truncate">
            {language === 'ar' ? 'المسار' : 'Itinerary'}
          </span>
          {activeNavTab === 'timeline' && (
            <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-[var(--accent-gold)] shadow-[0_0_10px_rgba(229,195,120,0.6)]" />
          )}
        </button>
      </div>
    </nav>
  );
};

export const MobileNav = MobileTabBar;
export default MobileTabBar;
