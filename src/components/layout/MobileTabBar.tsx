'use client';

import React from 'react';
import { Flame, Compass, Navigation, Bookmark, Calendar } from 'lucide-react';
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
      setWizardStep(1);
      setActiveNavTab('quick-plan');
    }
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#0B0D12]/95 backdrop-blur-2xl border-t border-[#E5C378]/30 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_32px_rgba(0,0,0,0.85)] touch-manipulation select-none">
      <div className="grid grid-cols-5 h-16 items-center px-1 max-w-lg mx-auto">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setActiveNavTab('home');
          }}
          className={`min-h-[44px] relative flex flex-col items-center justify-center h-full transition-all cursor-pointer ${
            activeNavTab === 'home' ? 'text-[#E5C378] font-extrabold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Flame className={`w-5 h-5 transition-transform ${activeNavTab === 'home' ? 'scale-110 text-[#E5C378]' : 'text-slate-400'}`} />
          <span className="text-[10px] mt-1 font-bold truncate">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </span>
          {activeNavTab === 'home' && (
            <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-[#E5C378] shadow-[0_0_10px_rgba(229,195,120,0.6)]" />
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
            activeNavTab === 'explore' ? 'text-teal-300 font-extrabold' : 'text-slate-400 hover:text-white'
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
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#DF9F3D] via-[#E5C378] to-[#C8A452] text-[#0B0D12] flex items-center justify-center shadow-[0_0_25px_rgba(229,195,120,0.5)] border-2 border-[#0B0D12] hover:scale-105 active:scale-95 transition-all cursor-pointer relative group"
            title="اصنع خطتك أو افتح الجدول"
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5C378] opacity-25 pointer-events-none" />
            <Navigation className="w-6 h-6 text-[#0B0D12] group-hover:rotate-12 transition-transform" />
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
            activeNavTab === 'curated' ? 'text-[#E5C378] font-extrabold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bookmark className={`w-5 h-5 transition-transform ${activeNavTab === 'curated' ? 'scale-110 text-[#E5C378]' : 'text-slate-400'}`} />
          <span className="text-[10px] mt-1 font-bold truncate">
            {language === 'ar' ? 'المقترحة' : 'Curated'}
          </span>
          {activeNavTab === 'curated' && (
            <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-[#E5C378] shadow-[0_0_10px_rgba(229,195,120,0.6)]" />
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
            activeNavTab === 'timeline' ? 'text-[#E5C378] font-extrabold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <Calendar className={`w-5 h-5 transition-transform ${activeNavTab === 'timeline' ? 'scale-110 text-[#E5C378]' : 'text-slate-400'}`} />
            {currentItinerary && (
              <span className="absolute -top-1.5 -end-2 w-4 h-4 rounded-full bg-[#E5C378] text-[#0B0D12] text-[9px] font-black flex items-center justify-center shadow-sm">
                {currentItinerary.stops.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-bold truncate">
            {language === 'ar' ? 'المسار' : 'Itinerary'}
          </span>
          {activeNavTab === 'timeline' && (
            <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-[#E5C378] shadow-[0_0_10px_rgba(229,195,120,0.6)]" />
          )}
        </button>
      </div>
    </nav>
  );
};

export const MobileNav = MobileTabBar;
export default MobileTabBar;
