'use client';

import React from 'react';
import { Flame, Compass, Sparkles, Bookmark, Vote, Calendar } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { soundEngine } from '@/utils/audioEngine';

export const MobileTabBar: React.FC = () => {
  const { language } = useLanguage();
  const activeNavTab = useItineraryStore((state) => state.activeNavTab);
  const setActiveNavTab = useItineraryStore((state) => state.setActiveNavTab);
  const currentItinerary = useItineraryStore((state) => state.currentItinerary);
  const setWizardStep = useItineraryStore((state) => state.setWizardStep);

  const handleCenterPlanClick = () => {
    soundEngine.playClick();
    if (currentItinerary) {
      setActiveNavTab('timeline');
    } else {
      setWizardStep(0);
      setActiveNavTab('quick-plan');
    }
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-abyss-950/95 backdrop-blur-2xl border-t border-white/10 pb-[env(safe-area-inset-bottom)] shadow-2xl touch-manipulation select-none">
      <div className="grid grid-cols-5 h-16 items-center px-1 max-w-lg mx-auto">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setActiveNavTab('home');
          }}
          className={`min-h-[44px] relative flex flex-col items-center justify-center h-full transition-all cursor-pointer ${
            activeNavTab === 'home' ? 'text-coral-400 font-extrabold' : 'text-pearl-muted hover:text-pearl'
          }`}
        >
          <Flame className={`w-5 h-5 transition-transform ${activeNavTab === 'home' ? 'scale-110 text-coral-400' : 'text-pearl-muted'}`} />
          <span className="text-[10px] mt-1 font-bold truncate">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </span>
          {activeNavTab === 'home' && (
            <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-coral-400 shadow-glow-coral" />
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
            activeNavTab === 'explore' ? 'text-teal-300 font-extrabold' : 'text-pearl-muted hover:text-pearl'
          }`}
        >
          <Compass className={`w-5 h-5 transition-transform ${activeNavTab === 'explore' ? 'scale-110 text-teal-300' : 'text-pearl-muted'}`} />
          <span className="text-[10px] mt-1 font-bold truncate">
            {language === 'ar' ? 'استكشف' : 'Explore'}
          </span>
          {activeNavTab === 'explore' && (
            <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-teal-300 shadow-glow-teal" />
          )}
        </button>

        {/* 3. Center Elevated Action Button: Plan (Glowing Coral Pulse) */}
        <div className="relative flex items-center justify-center -top-3">
          <button
            type="button"
            onClick={handleCenterPlanClick}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-coral-600 via-coral-500 to-gold-400 text-white flex items-center justify-center shadow-glow-coral border-2 border-abyss-950 hover:scale-105 active:scale-95 transition-all cursor-pointer relative group"
            title="اصنع خطتك أو افتح الجدول"
          >
            {/* Ambient Pulse Ring */}
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral-400 opacity-30 pointer-events-none" />
            <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
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
            activeNavTab === 'curated' ? 'text-gold-400 font-extrabold' : 'text-pearl-muted hover:text-pearl'
          }`}
        >
          <Bookmark className={`w-5 h-5 transition-transform ${activeNavTab === 'curated' ? 'scale-110 text-gold-400' : 'text-pearl-muted'}`} />
          <span className="text-[10px] mt-1 font-bold truncate">
            {language === 'ar' ? 'المقترحة' : 'Saved'}
          </span>
          {activeNavTab === 'curated' && (
            <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-gold-400 shadow-glow-gold" />
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
            activeNavTab === 'timeline' ? 'text-coral-400 font-extrabold' : 'text-pearl-muted hover:text-pearl'
          }`}
        >
          <div className="relative">
            <Calendar className={`w-5 h-5 transition-transform ${activeNavTab === 'timeline' ? 'scale-110 text-coral-400' : 'text-pearl-muted'}`} />
            {currentItinerary && (
              <span className="absolute -top-1.5 -end-2 w-4 h-4 rounded-full bg-coral-500 text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                {currentItinerary.stops.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-bold truncate">
            {language === 'ar' ? 'المسار' : 'Itinerary'}
          </span>
          {activeNavTab === 'timeline' && (
            <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-coral-400" />
          )}
        </button>
      </div>
    </nav>
  );
};

export const MobileNav = MobileTabBar;
