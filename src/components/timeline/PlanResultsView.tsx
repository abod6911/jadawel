'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Scale,
  Crown,
  Share2,
  Calendar,
  DollarSign,
  Vote,
  Compass,
  Play,
  RotateCcw,
  Plus,
  Clock,
  Car,
  Utensils,
  Ticket,
  Smartphone,
  LayoutList,
  Map as MapIcon,
  Sparkles,
  Coins,
  ShieldCheck,
  Split,
  Download,
  MapPin,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { TimelineCard } from './TimelineCard';
import { TransitConnector } from './TransitConnector';
import { SwapPlaceModal } from './SwapPlaceModal';
import { ExportHubModal } from '@/components/export/ExportHubModal';
import { LiveOutingModal } from '@/components/modals/LiveOutingModal';
import { SplitBillModal } from '@/components/modals/SplitBillModal';
import { GroupVotingModal } from '@/components/modals/GroupVotingModal';
import { StoryPassModal } from '@/components/modals/StoryPassModal';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { soundEngine } from '@/utils/audioEngine';

import { PlanVariant, ItineraryStop } from '@/types';

export const PlanResultsView: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const currentItinerary = useItineraryStore((state) => state.currentItinerary);
  const activeVariant = useItineraryStore((state) => state.activeVariant);
  const setActiveVariant = useItineraryStore((state) => state.setActiveVariant);
  const openLiveOuting = useItineraryStore((state) => state.openLiveOuting);
  const setIsSplitBillOpen = useItineraryStore((state) => state.setIsSplitBillOpen);
  const setIsVotingModalOpen = useItineraryStore((state) => state.setIsVotingModalOpen);
  const setWizardStep = useItineraryStore((state) => state.setWizardStep);
  const setActiveNavTab = useItineraryStore((state) => state.setActiveNavTab);
  const setSelectedPlaceForModal = useItineraryStore((state) => state.setSelectedPlaceForModal);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isStoryPassOpen, setIsStoryPassOpen] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState<'timeline' | 'map'>('timeline');

  if (!currentItinerary) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-gold-500/20 text-gold-400 mx-auto flex items-center justify-center border border-gold-500/30 shadow-glow-gold">
          <Compass className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-pearl">
          {language === 'ar' ? 'لم يتم توليد خطة بعد' : 'No Itinerary Generated Yet'}
        </h3>
        <p className="text-sm text-pearl-muted font-medium leading-relaxed">
          {language === 'ar'
            ? 'ابدأ باختيار تفضيلاتك في صانع الجداول وسنولد لك 3 مسارات ذكية متناسقة.'
            : 'Start by choosing your preferences and we will generate 3 smart balanced plans.'}
        </p>
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setWizardStep(0);
            setActiveNavTab('quick-plan');
          }}
          className="min-h-[48px] px-8 py-4 rounded-2xl bg-coral-500 hover:bg-coral-600 text-white font-black text-sm shadow-glow-coral cursor-pointer transition-all"
        >
          {language === 'ar' ? '🚀 اصنع خطتك الآن' : 'Create Your Plan'}
        </button>
      </div>
    );
  }

  const { variants } = currentItinerary;
  const currentVariantData: PlanVariant = (variants as any)[activeVariant] || variants.balanced;
  const thirdVariantObj = variants.free || variants.luxury;
  const isThirdFree = !!variants.free;

  const variantTabs = [
    {
      id: 'fastest' as const,
      title: variants.fastest.titleAr,
      titleEn: variants.fastest.titleEn,
      badge: variants.fastest.badgeAr,
      badgeEn: variants.fastest.badgeEn,
      icon: Zap,
      color: 'text-teal-400',
      activeBorder: 'border-teal-400 ring-2 ring-teal-400/40 bg-abyss-800',
    },
    {
      id: 'balanced' as const,
      title: variants.balanced.titleAr,
      titleEn: variants.balanced.titleEn,
      badge: variants.balanced.badgeAr,
      badgeEn: variants.balanced.badgeEn,
      icon: Scale,
      color: 'text-gold-400',
      activeBorder: 'border-gold-400 ring-2 ring-gold-400/40 bg-abyss-800',
    },
    {
      id: (isThirdFree ? 'free' : 'luxury') as any,
      title: thirdVariantObj.titleAr,
      titleEn: thirdVariantObj.titleEn,
      badge: thirdVariantObj.badgeAr,
      badgeEn: thirdVariantObj.badgeEn,
      icon: isThirdFree ? Sparkles : Crown,
      color: isThirdFree ? 'text-teal-300' : 'text-coral-400',
      activeBorder: isThirdFree
        ? 'border-teal-400 ring-2 ring-teal-400/40 bg-abyss-800'
        : 'border-coral-400 ring-2 ring-coral-400/40 bg-abyss-800',
    },
  ];

  // Budget calculations
  const totalPerPerson = currentVariantData?.financials?.totalPerPersonSAR || 0;
  const isFreePlan = totalPerPerson === 0;
  const foodShare = isFreePlan ? 0 : Math.round(totalPerPerson * 0.65);
  const ticketsShare = isFreePlan ? 0 : Math.round(totalPerPerson * 0.22);
  const uberShare = isFreePlan
    ? (currentVariantData?.financials?.estimatedTransitSAR || 0)
    : Math.max(15, totalPerPerson - foodShare - ticketsShare);

  return (
    <div className="space-y-6 sm:space-y-8 my-2 sm:my-4 pb-20 lg:pb-8">
      {/* 1. Header & 3-Variant Switcher */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-start">
          <div>
            <span className="text-[11px] sm:text-xs font-black text-gold-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-coral-400" />
              <span>{language === 'ar' ? '3 خطط ذكية جاهزة لطلعتكم' : '3 Generated Outing Plans'}</span>
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-pearl tracking-tight mt-1">
              {language === 'ar' ? currentItinerary.titleAr : currentItinerary.titleEn}
            </h2>
          </div>

          {/* Quick Reconfigure Button */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setWizardStep(0);
              setActiveNavTab('quick-plan');
            }}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-abyss-800 hover:bg-abyss-700 border border-white/10 text-xs font-bold text-pearl-muted hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 touch-manipulation self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gold-400" />
            <span>{language === 'ar' ? 'تعديل المعايير' : 'Edit Criteria'}</span>
          </button>
        </div>

        {/* 3 Variant Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
          {variantTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeVariant === tab.id;

            return (
              <div
                key={tab.id}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveVariant(tab.id);
                }}
                className={`min-h-[44px] p-3.5 sm:p-5 rounded-2xl border text-start cursor-pointer transition-all duration-200 touch-manipulation active:scale-[0.98] ${
                  isActive
                    ? `${tab.activeBorder} shadow-cinematic scale-[1.01]`
                    : 'bg-abyss-950/80 border-white/10 hover:border-gold-400/40 text-pearl hover:bg-abyss-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${tab.color}`} />
                    <h3 className="text-xs sm:text-sm font-black text-pearl">
                      {language === 'ar' ? tab.title : tab.titleEn}
                    </h3>
                  </div>
                  <span className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-bold border ${isActive ? 'bg-gold-500/20 text-gold-300 border-gold-400/40' : 'bg-white/5 text-pearl-muted border-white/10'}`}>
                    {language === 'ar' ? tab.badge : tab.badgeEn}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] sm:text-xs text-pearl-muted font-medium pt-0.5 sm:pt-1">
                  <span>~{(variants as any)[tab.id]?.financials?.totalPerPersonSAR ?? 0} ر.س / شخص</span>
                  <span>~{(variants as any)[tab.id]?.totalTransitMinutes ?? 15} د مشاوير</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Action Toolbar */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-abyss-900/90 backdrop-blur-xl border border-gold-500/25 shadow-cinematic flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
        {/* Left Action: Start Live Outing */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              openLiveOuting();
            }}
            className="flex-1 sm:flex-initial min-h-[48px] px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-coral-500 hover:bg-coral-600 active:bg-coral-700 text-white font-black text-xs sm:text-sm shadow-glow-coral flex items-center justify-center gap-2 transition-all cursor-pointer touch-manipulation active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{language === 'ar' ? 'بدء الطلعة (Live Mode)' : 'Start Live Outing'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setIsStoryPassOpen(true);
            }}
            className="min-h-[48px] px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-abyss-800 hover:bg-abyss-700 border border-gold-500/40 text-gold-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer touch-manipulation active:scale-95 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'ar' ? 'بطاقة 9:16' : 'Pass 9:16'}</span>
          </button>
        </div>

        {/* Right Actions: Split Bill, Group Vote, Export */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setIsSplitBillOpen(true);
            }}
            className="min-h-[44px] flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl bg-abyss-800 hover:bg-abyss-700 border border-white/10 text-pearl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer touch-manipulation"
            title="حاسبة تقسيم الفاتورة"
          >
            <Coins className="w-4 h-4 text-gold-400" />
            <span>{language === 'ar' ? 'حسبة القطة' : 'Split Bill'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setIsVotingModalOpen(true);
            }}
            className="min-h-[44px] flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl bg-abyss-800 hover:bg-abyss-700 border border-white/10 text-pearl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer touch-manipulation"
            title="تصويت الشلة"
          >
            <Vote className="w-4 h-4 text-teal-400" />
            <span>{language === 'ar' ? 'تصويت الشلة' : 'Group Poll'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setIsExportModalOpen(true);
            }}
            className="min-h-[44px] px-3 sm:px-3.5 py-2 rounded-xl bg-abyss-800 hover:bg-abyss-700 border border-white/10 text-pearl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer touch-manipulation"
            title="مشاركة وتصدير"
          >
            <Share2 className="w-4 h-4 text-coral-400" />
            <span className="hidden sm:inline">{language === 'ar' ? 'مشاركة وتصدير' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* 3. Financial Summary Bar */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-abyss-900/90 border border-white/10 shadow-md">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-start">
          <div className="p-2.5 sm:p-3 rounded-xl bg-abyss-950/80 border border-white/5 space-y-0.5 sm:space-y-1">
            <span className="text-[10px] sm:text-[11px] text-pearl-muted font-bold flex items-center gap-1">
              <Utensils className="w-3.5 h-3.5 text-gold-400" />
              <span>{language === 'ar' ? 'الأكل والمقاهي' : 'Food & Coffee'}</span>
            </span>
            <span className="text-xs sm:text-base font-black text-pearl block">~{foodShare} ر.س</span>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-abyss-950/80 border border-white/5 space-y-0.5 sm:space-y-1">
            <span className="text-[10px] sm:text-[11px] text-pearl-muted font-bold flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5 text-coral-400" />
              <span>{language === 'ar' ? 'التذاكر والأنشطة' : 'Tickets & Activities'}</span>
            </span>
            <span className="text-xs sm:text-base font-black text-pearl block">~{ticketsShare} ر.س</span>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-abyss-950/80 border border-white/5 space-y-0.5 sm:space-y-1">
            <span className="text-[10px] sm:text-[11px] text-pearl-muted font-bold flex items-center gap-1">
              <Car className="w-3.5 h-3.5 text-teal-400" />
              <span>{language === 'ar' ? 'مشاوير أوبر' : 'Uber Transit'}</span>
            </span>
            <span className="text-xs sm:text-base font-black text-pearl block">~{uberShare} ر.س</span>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-gold-500/15 border border-gold-500/40 space-y-0.5 sm:space-y-1">
            <span className="text-[10px] sm:text-[11px] text-gold-400 font-bold flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'المجموع / شخص' : 'Total / Person'}</span>
            </span>
            <span className="text-xs sm:text-base font-black text-gold-300 block">~{totalPerPerson} ر.س</span>
          </div>
        </div>
      </div>

      {/* 4. Mobile Segmented Control: [ ⏱️ الجدول الزمني | 🗺️ الخريطة التفاعلية ] */}
      <div className="lg:hidden flex items-center p-1.5 rounded-2xl bg-abyss-950 border border-white/10 shadow-inner">
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setMobileViewMode('timeline');
          }}
          className={`flex-1 min-h-[44px] py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer touch-manipulation ${
            mobileViewMode === 'timeline'
              ? 'bg-abyss-800 text-gold-400 border border-gold-500/40 shadow-glow-gold'
              : 'text-pearl-muted hover:text-pearl'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{language === 'ar' ? '⏱️ الجدول الزمني' : '⏱️ Timeline Stream'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setMobileViewMode('map');
          }}
          className={`flex-1 min-h-[44px] py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer touch-manipulation ${
            mobileViewMode === 'map'
              ? 'bg-abyss-800 text-teal-300 border border-teal-400/40 shadow-glow-teal'
              : 'text-pearl-muted hover:text-pearl'
          }`}
        >
          <MapIcon className="w-4 h-4" />
          <span>{language === 'ar' ? '🗺️ الخريطة التفاعلية' : '🗺️ Interactive Map'}</span>
        </button>
      </div>

      {/* 5. Desktop 50/50 Map-Split Screen Layout & Mobile Segment Views */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Timeline Column (Visible on desktop or when mobileViewMode === 'timeline') */}
        <div className={`lg:col-span-7 space-y-6 ${mobileViewMode === 'map' ? 'hidden lg:block' : 'block'}`}>
          <div className="relative">
            {/* Vertical Glowing Timeline Line */}
            <div className="absolute top-6 bottom-6 start-4 sm:start-6 -translate-x-1/2 rtl:translate-x-1/2 w-0.5 bg-gradient-to-b from-teal-400 via-gold-400 to-coral-400 z-0 opacity-70" />

            <div className="space-y-6 relative z-10">
              {currentVariantData.stops.map((stop, index) => {
                const isFirst = index === 0;
                const isLast = index === currentVariantData.stops.length - 1;

                return (
                  <React.Fragment key={stop.id}>
                    {/* Transit Connector between stops */}
                    {index > 0 && stop.transitFromPrevious && (
                      <TransitConnector transit={stop.transitFromPrevious} />
                    )}

                    {/* The Timeline Card */}
                    <TimelineCard
                      stop={stop}
                      isFirst={isFirst}
                      isLast={isLast}
                    />
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Interactive Map Column (Visible on desktop or when mobileViewMode === 'map') */}
        <div className={`lg:col-span-5 lg:sticky lg:top-24 space-y-4 ${mobileViewMode === 'timeline' ? 'hidden lg:block' : 'block'}`}>
          <div className="rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-gold-500/30 shadow-cinematic bg-abyss-950 min-h-[420px] sm:min-h-[480px] lg:min-h-[580px]">
            <InteractiveMap
              stops={currentVariantData.stops}
              className="w-full h-full min-h-[420px] sm:min-h-[480px] lg:min-h-[580px]"
            />
          </div>

          {/* Mobile Swipeable Stop Cards below map in map mode */}
          <div className="lg:hidden snap-x snap-mandatory flex overflow-x-auto gap-3 pb-2 scrollbar-none">
            {currentVariantData.stops.map((stop, idx) => (
              <div
                key={stop.id}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedPlaceForModal(stop.place);
                }}
                className="snap-center shrink-0 w-[280px] p-3.5 rounded-2xl bg-abyss-900 border border-white/15 text-start cursor-pointer space-y-2 shadow-md active:scale-98 transition-transform"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-lg bg-gold-500 text-abyss-950 font-black">
                    #{idx + 1} • {stop.timeSlot}
                  </span>
                  <span className="text-teal-300 font-bold">
                    {stop.place.averageCostSAR > 0 ? `${stop.place.averageCostSAR} ر.س` : (language === 'ar' ? 'مجاني' : 'Free')}
                  </span>
                </div>
                <h4 className="text-sm font-black text-pearl truncate">
                  {language === 'ar' ? stop.place.nameAr : stop.place.nameEn}
                </h4>
                <p className="text-[11px] text-pearl-muted line-clamp-1">
                  {language === 'ar' ? stop.place.districtNameAr : stop.place.districtNameEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals Suite */}
      <SwapPlaceModal />
      <ExportHubModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        itinerary={currentItinerary}
      />
      <StoryPassModal
        isOpen={isStoryPassOpen}
        onClose={() => setIsStoryPassOpen(false)}
        itinerary={currentItinerary}
        activeVariant={activeVariant}
      />
      <SplitBillModal />
      <GroupVotingModal />
      <LiveOutingModal />
    </div>
  );
};
