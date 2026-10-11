'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
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
  Clock,
  Car,
  Utensils,
  Ticket,
  Map as MapIcon,
  Coins,
  ShieldCheck,
  Split,
  Download,
  MapPin,
  Bookmark,
  FolderHeart,
  Sparkles,
  X,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { TimelineCard } from './TimelineCard';
import { TransitConnector } from './TransitConnector';
import { BudgetDonutChart } from './BudgetDonutChart';
import { SwapPlaceModal } from './SwapPlaceModal';
import { ExportHubModal } from '@/components/export/ExportHubModal';
import { LiveOutingModal } from '@/components/modals/LiveOutingModal';
import { SplitBillModal } from '@/components/modals/SplitBillModal';
import { GroupVotingModal } from '@/components/modals/GroupVotingModal';
import { StoryPassModal } from '@/components/modals/StoryPassModal';
import { SavedPlansModal } from '@/components/saved/SavedPlansModal';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { BorderBeam } from '@/components/fancy/BorderBeam';
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
  const saveCurrentPlan = useItineraryStore((state) => state.saveCurrentPlan);
  const setIsSavedPlansModalOpen = useItineraryStore((state) => state.setIsSavedPlansModalOpen);
  const savedPlans = useItineraryStore((state) => state.savedPlans);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isStoryPassOpen, setIsStoryPassOpen] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState<'timeline' | 'map'>('timeline');
  const [saveToast, setSaveToast] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [showCelebrationBanner, setShowCelebrationBanner] = useState(true);

  // Soft celebratory gold confetti burst upon unveiling
  useEffect(() => {
    if (hasCelebrated) return;
    setHasCelebrated(true);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    if (!prefersReducedMotion) {
      try {
        confetti({
          particleCount: 42,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#E5C378', '#F5E2B3', '#DF9F3D', '#FFFFFF', '#2DD4BF'],
          disableForReducedMotion: true,
        });
      } catch (e) {
        // graceful fallback if canvas blocked
      }
    }
  }, [hasCelebrated]);

  const handleSavePlan = () => {
    soundEngine.playSuccess();
    saveCurrentPlan();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  if (!currentItinerary) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-5 select-none">
        <div className="w-20 h-20 rounded-3xl bg-gold-500/15 text-gold-400 mx-auto flex items-center justify-center border border-gold-500/30 shadow-glow-gold">
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
            setWizardStep(1);
            setActiveNavTab('quick-plan');
          }}
          className="min-h-[48px] px-8 py-4 rounded-2xl bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-black text-sm shadow-glow-coral cursor-pointer transition-all active:scale-95"
        >
          {language === 'ar' ? 'اصنع خطتك الآن' : 'Create Your Plan'}
        </button>
      </div>
    );
  }

  const { variants } = currentItinerary;
  const currentVariantData: PlanVariant =
    (variants as any)[activeVariant] ||
    (activeVariant === 'free' ? variants.free : undefined) ||
    variants.balanced ||
    variants.fastest;

  const isThirdFree = !!variants.free;
  const thirdVariantObj = variants.free || variants.luxury;

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
      title: thirdVariantObj?.titleAr || 'التجربة الفخمة VIP',
      titleEn: thirdVariantObj?.titleEn || 'VIP Luxury Signature',
      badge: thirdVariantObj?.badgeAr || 'VIP',
      badgeEn: thirdVariantObj?.badgeEn || 'VIP',
      icon: isThirdFree ? Compass : Crown,
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
    <div className="space-y-6 sm:space-y-8 my-2 sm:my-4 pb-20 lg:pb-8 text-start select-none">
      {/* 0. Celebration Announcement Banner */}
      <AnimatePresence>
        {showCelebrationBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[var(--accent-gold)]/15 via-[var(--accent-teal)]/10 to-transparent border border-[var(--border-gold)] flex items-center justify-between gap-3 shadow-lg"
          >
            <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-white">
              <div className="w-8 h-8 rounded-xl bg-[var(--accent-gold)]/20 border border-[var(--border-gold)] flex items-center justify-center text-[var(--accent-gold)] shrink-0 shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>
                {language === 'ar'
                  ? 'تم تفصيل خطتكم السينمائية بنجاح! 3 مسارات متناسقة جاهزة لطلعتكم.'
                  : 'Your cinematic outing is ready! 3 balanced itineraries tailored for you.'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowCelebrationBanner(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header & 3-Variant Switcher */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] sm:text-xs font-bold text-[#E5C378] uppercase flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[#E5C378]" />
              <span>{language === 'ar' ? '3 خطط ذكية جاهزة لطلعتكم' : '3 Generated Outing Plans'}</span>
            </span>
            <h2 className="text-xl sm:text-3xl font-bold text-white mt-1">
              {language === 'ar' ? currentItinerary.titleAr : currentItinerary.titleEn}
            </h2>
          </div>

          {/* Quick Reconfigure Button */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setWizardStep(1);
              setActiveNavTab('quick-plan');
            }}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#131722] hover:bg-[#1A1F2C] border border-white/10 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 touch-manipulation self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#E5C378]" />
            <span>{language === 'ar' ? 'تعديل المعايير' : 'Edit Criteria'}</span>
          </button>
        </div>

        {/* 3 Variant Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
          {variantTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeVariant === tab.id;
            const variantData = (variants as any)[tab.id];

            return (
              <div
                key={tab.id}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveVariant(tab.id);
                }}
                className={`min-h-[44px] p-3.5 sm:p-5 rounded-2xl border text-start cursor-pointer transition-all duration-200 touch-manipulation active:scale-[0.98] ${
                  isActive
                    ? 'border-[#E5C378] ring-2 ring-[#E5C378]/40 bg-[#12151C] shadow-2xl scale-[1.01]'
                    : 'bg-[#0E1118]/80 border-white/[0.08] hover:border-[#E5C378]/30 text-white hover:bg-[#131722]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-[#E5C378]' : tab.color}`} />
                    <h3 className="text-xs sm:text-sm font-black text-white">
                      {language === 'ar' ? tab.title : tab.titleEn}
                    </h3>
                  </div>
                  <span className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-bold border ${isActive ? 'bg-[#E5C378]/20 text-[#F5E2B3] border-[#E5C378]/40' : 'bg-white/5 text-slate-400 border-white/10'}`}>
                    {language === 'ar' ? tab.badge : tab.badgeEn}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 font-medium pt-0.5 sm:pt-1">
                  <span>~{variantData?.financials?.totalPerPersonSAR ?? 0} ر.س / شخص</span>
                  <span>~{variantData?.totalTransitMinutes ?? 15} د مشاوير</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Action Toolbar */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0E1118]/90 backdrop-blur-xl border border-[#E5C378]/30 shadow-2xl flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
        {/* Left Action: Start Live Outing */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              openLiveOuting();
            }}
            className="flex-1 sm:flex-initial min-h-[48px] px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] text-[#0B0D12] font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(229,195,120,0.45)] flex items-center justify-center gap-2 transition-all cursor-pointer touch-manipulation active:scale-95"
          >
            <Play className="w-4 h-4 fill-[#0B0D12]" />
            <span>{language === 'ar' ? 'بدء الطلعة (Live Mode)' : 'Start Live Outing'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setIsStoryPassOpen(true);
            }}
            className="min-h-[48px] px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#131722] hover:bg-[#1A1F2C] border border-[#E5C378]/40 text-[#E5C378] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer touch-manipulation active:scale-95 shrink-0"
          >
            <Ticket className="w-4 h-4" />
            <span>{language === 'ar' ? 'بطاقة 9:16' : 'Pass 9:16'}</span>
          </button>
        </div>

        {/* Right Actions: Save, Saved List, Split Bill, Group Vote, Export */}
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap justify-between sm:justify-start">
          {/* Save Current Plan Button */}
          <button
            type="button"
            onClick={handleSavePlan}
            className="min-h-[44px] flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl bg-[#131722] hover:bg-[#1A1F2C] border border-[#E5C378]/40 text-white hover:text-[#E5C378] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer touch-manipulation active:scale-95"
            title="احفظ هذه الخطة في جهازك"
          >
            <Bookmark className="w-4 h-4 text-[#E5C378]" />
            <span>{language === 'ar' ? 'احفظ خطتي' : 'Save Plan'}</span>
          </button>

          {/* View Saved Plans Button */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setIsSavedPlansModalOpen(true);
            }}
            className="min-h-[44px] flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl bg-[#131722] hover:bg-[#1A1F2C] border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer touch-manipulation"
            title="استعراض الخطط المحفوظة"
          >
            <FolderHeart className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">{language === 'ar' ? 'المحفوظات' : 'Saved'}</span>
            {savedPlans.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#E5C378]/20 text-[#E5C378] border border-[#E5C378]/40 font-black">
                {savedPlans.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setIsSplitBillOpen(true);
            }}
            className="min-h-[44px] flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl bg-[#131722] hover:bg-[#1A1F2C] border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer touch-manipulation"
            title="حاسبة تقسيم الفاتورة"
          >
            <Coins className="w-4 h-4 text-[#E5C378]" />
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

      {/* Save Success Toast */}
      <AnimatePresence>
        {saveToast && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="p-3 sm:p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{language === 'ar' ? 'تم حفظ الخطة في جهازك بنجاح! يمكنك الرجوع إليها بأي وقت بدون إنترنت.' : 'Plan saved to your device! Available offline anytime.'}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsSavedPlansModalOpen(true)}
              className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-black shrink-0 transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'عرض المحفوظات' : 'View Saved'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. High-Performance SVG Budget Donut Chart */}
      <BudgetDonutChart
        totalPerPersonSAR={totalPerPerson}
        foodShareSAR={foodShare}
        ticketsShareSAR={ticketsShare}
        transitShareSAR={uberShare}
      />

      {/* 4. Mobile Segmented Control (Zero Emojis, Pure Lucide SVGs) */}
      <div className="lg:hidden flex items-center p-1.5 rounded-2xl bg-[#080B11]/90 border border-[var(--border-subtle)] shadow-inner">
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setMobileViewMode('timeline');
          }}
          className={`flex-1 min-h-[44px] py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer touch-manipulation ${
            mobileViewMode === 'timeline'
              ? 'bg-[#12151C] text-[var(--accent-gold)] border border-[var(--border-gold)] shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4 text-[var(--accent-gold)]" />
          <span>{language === 'ar' ? 'الجدول الزمني' : 'Timeline Stream'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setMobileViewMode('map');
          }}
          className={`flex-1 min-h-[44px] py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer touch-manipulation ${
            mobileViewMode === 'map'
              ? 'bg-[#12151C] text-teal-300 border border-teal-400/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MapIcon className="w-4 h-4 text-teal-400" />
          <span>{language === 'ar' ? 'الخريطة التفاعلية' : 'Interactive Map'}</span>
        </button>
      </div>

      {/* 5. Desktop 50/50 Map-Split Screen Layout & Mobile Segment Views */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Timeline Column */}
        <div className={`lg:col-span-7 space-y-6 ${mobileViewMode === 'map' ? 'hidden lg:block' : 'block'}`}>
          <div className="relative">
            {/* Vertical Glowing Timeline Line */}
            <div className="absolute top-6 bottom-6 start-4 sm:start-6 -translate-x-1/2 rtl:translate-x-1/2 w-0.5 bg-gradient-to-b from-[#E5C378] via-[#2DD4BF] to-[#DF9F3D] z-0 opacity-70" />

            <div className="space-y-6 relative z-10">
              {currentVariantData?.stops?.map((stop, index) => {
                const isFirst = index === 0;
                const isLast = index === currentVariantData.stops.length - 1;

                return (
                  <React.Fragment key={stop.id}>
                    {/* Transit Connector between stops */}
                    {index > 0 && stop.transitFromPrevious && (
                      <TransitConnector transit={stop.transitFromPrevious} />
                    )}

                    {/* Timeline Card */}
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

        {/* Interactive Map Column */}
        <div className={`lg:col-span-5 lg:sticky lg:top-24 space-y-4 ${mobileViewMode === 'timeline' ? 'hidden lg:block' : 'block'}`}>
          <div className="rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-[var(--border-subtle)] shadow-cinematic bg-[#070B14] min-h-[420px] sm:min-h-[480px] lg:min-h-[580px] relative">
            <BorderBeam size={280} duration={14} borderWidth={1.5} colorFrom="#F59E0B" colorTo="#06B6D4" />
            <InteractiveMap
              stops={currentVariantData?.stops || []}
              className="w-full h-full min-h-[420px] sm:min-h-[480px] lg:min-h-[580px]"
            />
          </div>

          {/* Mobile Swipeable Stop Cards below map in map mode */}
          <div className="lg:hidden snap-x snap-mandatory flex overflow-x-auto gap-3 pb-2 scrollbar-none">
            {currentVariantData?.stops?.map((stop, idx) => (
              <div
                key={stop.id}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedPlaceForModal(stop.place);
                }}
                className="snap-center shrink-0 w-[280px] p-3.5 rounded-2xl card-surface border border-[var(--border-subtle)] text-start cursor-pointer space-y-2 shadow-md active:scale-98 transition-transform"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-lg bg-[var(--accent-gold)] text-[#080B11] font-black">
                    #{idx + 1} • {stop.timeSlot}
                  </span>
                  <span className="text-teal-300 font-bold">
                    {stop.place.averageCostSAR > 0
                      ? `${stop.place.averageCostSAR} ر.س`
                      : language === 'ar'
                      ? 'مجاني'
                      : 'Free'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white truncate">
                  {language === 'ar' ? stop.place.nameAr : stop.place.nameEn}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1">
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

export default PlanResultsView;
