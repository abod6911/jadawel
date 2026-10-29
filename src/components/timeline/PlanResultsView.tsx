'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
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
  Plus,
  Footprints,
  X,
  Info,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { TimelineCard } from './TimelineCard';
import { TransitConnector } from './TransitConnector';
// Aggressive On-Demand Code Splitting for Heavy Interactive Modals & Visualizations
const BudgetDonutChart = dynamic(() => import('./BudgetDonutChart').then((m) => m.BudgetDonutChart), { ssr: false });
const SwapPlaceModal = dynamic(() => import('./SwapPlaceModal').then((m) => m.SwapPlaceModal), { ssr: false });
const AddStopModal = dynamic(() => import('./AddStopModal').then((m) => m.AddStopModal), { ssr: false });
const ExportHubModal = dynamic(() => import('@/components/export/ExportHubModal').then((m) => m.ExportHubModal), { ssr: false });
const LiveOutingModal = dynamic(() => import('@/components/modals/LiveOutingModal').then((m) => m.LiveOutingModal), { ssr: false });
const SplitBillModal = dynamic(() => import('@/components/modals/SplitBillModal').then((m) => m.SplitBillModal), { ssr: false });
const GroupVotingModal = dynamic(() => import('@/components/modals/GroupVotingModal').then((m) => m.GroupVotingModal), { ssr: false });
const StoryPassModal = dynamic(() => import('@/components/modals/StoryPassModal').then((m) => m.StoryPassModal), { ssr: false });
const SavedPlansModal = dynamic(() => import('@/components/saved/SavedPlansModal').then((m) => m.SavedPlansModal), { ssr: false });
const InteractiveMap = dynamic(() => import('@/components/map/InteractiveMap').then((m) => m.InteractiveMap), { ssr: false });
import { BorderBeam } from '@/components/fancy/BorderBeam';
import { soundEngine } from '@/utils/audioEngine';
import { PlanVariant, ItineraryStop } from '@/types';

const cleanEmoji = (text?: string): string => {
  if (!text) return '';
  return text
    .replace(/[⚡⚖️💎⭐🆓]/g, '')
    .replace(/[�-�][�-�]/g, '')
    .replace(/[☀-➿]/g, '')
    .trim();
};

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
  const setIsAddStopModalOpen = useItineraryStore((state) => state.setIsAddStopModalOpen);
  const savedPlans = useItineraryStore((state) => state.savedPlans);

  const isStoryPassOpen = useItineraryStore((state) => state.isStoryPassOpen);
  const setIsStoryPassOpen = useItineraryStore((state) => state.setIsStoryPassOpen);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
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
      const timer = setTimeout(() => {
        import('canvas-confetti')
          .then((m) => {
            const confetti = m.default;
            confetti({
              particleCount: 36,
              spread: 60,
              origin: { y: 0.65 },
              colors: ['#E5C378', '#F5E2B3', '#DF9F3D', '#FFFFFF', '#2DD4BF'],
              disableForReducedMotion: true,
            });
          })
          .catch(() => {});
      }, 150);
      return () => clearTimeout(timer);
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
      icon: isThirdFree ? Footprints : Crown,
      color: isThirdFree ? 'text-teal-300' : 'text-coral-400',
      activeBorder: isThirdFree
        ? 'border-teal-400 ring-2 ring-teal-400/40 bg-abyss-800'
        : 'border-coral-400 ring-2 ring-coral-400/40 bg-abyss-800',
    },
  ];

  // Budget calculations
  const rawTotalPerPerson = currentVariantData?.financials?.totalPerPersonSAR || 0;
  const transitCost = currentVariantData?.financials?.estimatedTransitSAR || 0;
  const rawFood = currentVariantData?.financials?.foodAndBeverageSAR || 0;
  const rawTickets = currentVariantData?.financials?.activitiesAndTicketsSAR || 0;

  // Exact total per person: includes transit even when activities/food are free
  const totalPerPerson = rawTotalPerPerson > 0 ? rawTotalPerPerson : (rawFood + rawTickets + transitCost);
  const isFreePlan = totalPerPerson === 0;
  const foodShare = isFreePlan ? 0 : rawFood > 0 ? rawFood : Math.round((totalPerPerson - transitCost) * 0.75);
  const ticketsShare = isFreePlan ? 0 : rawTickets > 0 ? rawTickets : Math.max(0, totalPerPerson - transitCost - foodShare);
  const uberShare = isFreePlan ? 0 : transitCost > 0 ? transitCost : Math.max(0, totalPerPerson - foodShare - ticketsShare);

  return (
    <div className="space-y-6 sm:space-y-8 my-2 sm:my-4 pb-32 lg:pb-12 text-start select-none pb-safe">
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

        {/* Mobile Variant Segmented Selector (sm:hidden) */}
        <div className="flex sm:hidden items-center p-1 bg-[#0A0D14] rounded-2xl border border-white/10 gap-1 shadow-inner">
          {variantTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeVariant === tab.id;
            const variantData = (variants as any)[tab.id];

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setActiveVariant(tab.id);
                }}
                className={`flex-1 py-2 px-1.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 text-center cursor-pointer touch-manipulation ${
                  isActive
                    ? 'bg-gradient-to-r from-[#DF9F3D] to-[#E5C378] text-[#0A0D12] shadow-lg font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0A0D12]' : tab.color}`} />
                  <span className="truncate max-w-[85px]">{cleanEmoji(language === 'ar' ? tab.title : tab.titleEn)}</span>
                </div>
                <div className={`text-[10px] flex items-center gap-1 font-mono ${isActive ? 'text-[#0A0D12]/90 font-black' : 'text-slate-400 font-medium'}`}>
                  <span dir="ltr">~{variantData?.financials?.totalPerPersonSAR ?? 0}</span>
                  <span>{language === 'ar' ? 'ر.س' : 'SAR'}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Desktop 3 Variant Cards Grid (hidden sm:grid) */}
        <div className="hidden sm:grid grid-cols-3 gap-3.5">
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
                      {cleanEmoji(language === 'ar' ? tab.title : tab.titleEn)}
                    </h3>
                  </div>
                  <span className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-bold border ${isActive ? 'bg-[#E5C378]/20 text-[#F5E2B3] border-[#E5C378]/40' : 'bg-white/5 text-slate-400 border-white/10'}`}>
                    {cleanEmoji(language === 'ar' ? tab.badge : tab.badgeEn)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 font-medium pt-0.5 sm:pt-1">
                  <span className="flex items-center gap-1 font-mono">
                    <span dir="ltr">~{variantData?.financials?.totalPerPersonSAR ?? 0}</span>
                    <span>{language === 'ar' ? 'ر.س / شخص' : 'SAR / person'}</span>
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <span dir="ltr">~{variantData?.totalTransitMinutes ?? 15}</span>
                    <span>{language === 'ar' ? 'د مشاوير' : 'min rides'}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Action Toolbar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-[#0E1118]/90 backdrop-blur-xl border border-[#E5C378]/30 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
        {/* Primary Row: Start Live Outing + Story Pass */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              openLiveOuting();
            }}
            className="flex-1 sm:flex-initial min-h-[46px] sm:min-h-[48px] px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] text-[#0B0D12] font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(229,195,120,0.45)] flex items-center justify-center gap-2 transition-all cursor-pointer touch-manipulation active:scale-95"
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
            className="min-h-[46px] sm:min-h-[48px] px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#131722] hover:bg-[#1A1F2C] border border-[#E5C378]/40 text-[#E5C378] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer touch-manipulation active:scale-95 shrink-0"
          >
            <Ticket className="w-4 h-4" />
            <span>{language === 'ar' ? 'بطاقة 9:16' : 'Pass 9:16'}</span>
          </button>
        </div>

        {/* Secondary Utility Actions (5-column compact grid on mobile, flex row on desktop) */}
        <div className="grid grid-cols-5 sm:flex sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          {/* Save Current Plan Button */}
          <button
            type="button"
            onClick={handleSavePlan}
            className="min-h-[42px] sm:min-h-[44px] py-2 px-1 sm:px-3 rounded-xl bg-[#131722] hover:bg-[#1A1F2C] border border-[#E5C378]/40 text-white hover:text-[#E5C378] font-bold text-[11px] sm:text-xs flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer touch-manipulation active:scale-95"
            title="احفظ هذه الخطة في جهازك"
          >
            <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E5C378]" />
            <span>{language === 'ar' ? 'حفظ' : 'Save'}</span>
          </button>

          {/* View Saved Plans Button */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setIsSavedPlansModalOpen(true);
            }}
            className="relative min-h-[42px] sm:min-h-[44px] py-2 px-1 sm:px-3 rounded-xl bg-[#131722] hover:bg-[#1A1F2C] border border-white/10 text-white font-bold text-[11px] sm:text-xs flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer touch-manipulation"
            title="استعراض الخطط المحفوظة"
          >
            <FolderHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
            <span>{language === 'ar' ? 'محفوظات' : 'Saved'}</span>
            {savedPlans.length > 0 && (
              <span className="absolute -top-1 -right-1 text-[9px] px-1.5 py-0.2 rounded-full bg-[#E5C378] text-[#0A0D12] font-black">
                {savedPlans.length}
              </span>
            )}
          </button>

          {/* Split Bill Button */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setIsSplitBillOpen(true);
            }}
            className="min-h-[42px] sm:min-h-[44px] py-2 px-1 sm:px-3 rounded-xl bg-[#131722] hover:bg-[#1A1F2C] border border-white/10 text-white font-bold text-[11px] sm:text-xs flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer touch-manipulation"
            title="حاسبة تقسيم الفاتورة"
          >
            <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E5C378]" />
            <span>{language === 'ar' ? 'القطة' : 'Split'}</span>
          </button>

          {/* Group Poll Button */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setIsVotingModalOpen(true);
            }}
            className="min-h-[42px] sm:min-h-[44px] py-2 px-1 sm:px-3 rounded-xl bg-[#131722] hover:bg-[#1A1F2C] border border-white/10 text-white font-bold text-[11px] sm:text-xs flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer touch-manipulation"
            title="تصويت الشلة"
          >
            <Vote className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400" />
            <span>{language === 'ar' ? 'تصويت' : 'Poll'}</span>
          </button>

          {/* Export / Share Button */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setIsExportModalOpen(true);
            }}
            className="min-h-[42px] sm:min-h-[44px] py-2 px-1 sm:px-3 rounded-xl bg-[#131722] hover:bg-[#1A1F2C] border border-white/10 text-white font-bold text-[11px] sm:text-xs flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer touch-manipulation"
            title="مشاركة وتصدير"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-coral-400" />
            <span>{language === 'ar' ? 'مشاركة' : 'Share'}</span>
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

      {/* Field Realism & Transparency Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-[#12151C]/70 border border-white/[0.06] flex items-center gap-3 text-xs text-slate-400 shadow-sm backdrop-blur-sm">
        <div className="w-7 h-7 rounded-lg bg-[#E5C378]/10 border border-[#E5C378]/20 flex items-center justify-center shrink-0">
          <Info className="w-4 h-4 text-[#E5C378]" />
        </div>
        <p className="leading-relaxed">
          {language === 'ar'
            ? 'الأسعار ومواعيد العمل وأوقات القيادة هي تقديرات ذكية قابلة للتغير بناءً على سياسات المنشآت وحركة السير في جدة.'
            : 'Prices, opening hours, and transit times are smart estimates subject to venue policies and real-time traffic in Jeddah.'}
        </p>
      </div>

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

              {/* Add Stop to Plan Button with Max 4 Constraint */}
              {(() => {
                const stopCount = currentVariantData?.stops?.length || 0;
                const isMaxReached = stopCount >= 4;

                return (
                  <div className="pt-2 ps-6 sm:ps-8">
                    <button
                      type="button"
                      disabled={isMaxReached}
                      onClick={() => {
                        soundEngine.playClick();
                        setIsAddStopModalOpen(true);
                      }}
                      className={`w-full py-3.5 px-4 rounded-2xl border text-center transition-all flex items-center justify-center gap-2.5 font-black text-xs sm:text-sm group ${
                        isMaxReached
                          ? 'bg-[#0E1118]/50 border-white/5 text-slate-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#121622]/90 to-[#181D2B]/90 hover:from-[#171D2E] hover:to-[#1E2538] border-dashed border-[#E5C378]/30 hover:border-[#E5C378]/60 text-[#E5C378] hover:text-[#F5E2B3] cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(229,195,120,0.15)] active:scale-[0.99]'
                      }`}
                      title={
                        isMaxReached
                          ? 'الحد الأقصى للخطة هو 4 محطات لضمان جدول واقعي ومريح'
                          : 'إضافة محطة جديدة للخطة'
                      }
                    >
                      <span
                        className={`p-1 rounded-xl border transition-transform duration-300 ${
                          isMaxReached
                            ? 'bg-white/5 border-white/10 text-slate-500'
                            : 'bg-[#E5C378]/10 border-[#E5C378]/30 text-[#E5C378] group-hover:scale-110'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </span>
                      <span>
                        {isMaxReached
                          ? (language === 'ar'
                              ? 'تم الوصول للحد الأقصى (4/4 محطات)'
                              : 'Maximum Reached (4/4 Stops)')
                          : (language === 'ar'
                              ? 'إضافة محطة للخطة +'
                              : 'Add Stop to Plan +')}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ms-auto font-mono ${
                          isMaxReached
                            ? 'bg-white/5 text-slate-500 border-white/10'
                            : 'bg-[#E5C378]/15 text-[#E5C378] border-[#E5C378]/30'
                        }`}
                      >
                        {stopCount}/4
                      </span>
                    </button>
                    {isMaxReached && (
                      <p className="text-[11px] text-slate-400 mt-1.5 text-center font-medium">
                        {language === 'ar'
                          ? '✨ تم تحديد 4 محطات كحد أقصى لضمان تجربة مريحة وأوقات كافية بين المواقع.'
                          : '✨ Capped at 4 stops to guarantee optimal pacing and realistic travel times.'}
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Interactive Map Column */}
        <div className={`lg:col-span-5 lg:sticky lg:top-24 space-y-4 ${mobileViewMode === 'timeline' ? 'hidden lg:block' : 'block'}`}>
          <div className="rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-[var(--border-subtle)] shadow-cinematic bg-[#070B14] h-[480px] sm:h-[540px] lg:h-[620px] min-h-[440px] relative">
            <BorderBeam size={280} duration={14} borderWidth={1.5} colorFrom="#F59E0B" colorTo="#06B6D4" />
            <InteractiveMap
              stops={currentVariantData?.stops || []}
              className="w-full h-full min-h-[440px]"
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
      <AddStopModal />
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
