'use client';

import React, { useState } from 'react';
import {
  Navigation,
  CheckCircle,
  SkipForward,
  RefreshCw,
  ExternalLink,
  MapPin,
  Clock,
  Sparkles,
  Trophy,
  Ticket,
  Home,
  Car,
  Coins,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { Modal } from '@/components/ui/Modal';
import { soundEngine } from '@/utils/audioEngine';
import { getAssetUrl } from '@/utils/paths';
import { calculateTransitTotals } from '@/utils/plannerEngine';
import { SafeVenueImage } from '@/components/ui/SafeVenueImage';
import { generateUberDeepLink, generateMapsNavigationLink } from '@/utils/navigationDeepLink';

export const LiveOutingModal: React.FC = () => {
  const { language } = useLanguage();
  const isLiveOutingOpen = useItineraryStore((state) => state.isLiveOutingOpen);
  const closeLiveOuting = useItineraryStore((state) => state.closeLiveOuting);
  const activeLiveStopIndex = useItineraryStore((state) => state.activeLiveStopIndex);
  const markStopStatus = useItineraryStore((state) => state.markStopStatus);
  const nextLiveStop = useItineraryStore((state) => state.nextLiveStop);
  const openSwapModal = useItineraryStore((state) => state.openSwapModal);
  const currentItinerary = useItineraryStore((state) => state.currentItinerary);
  const setIsStoryPassOpen = useItineraryStore((state) => state.setIsStoryPassOpen);
  const setActiveNavTab = useItineraryStore((state) => state.setActiveNavTab);
  const showToast = useItineraryStore((state) => state.showToast);
  const openReportModal = useItineraryStore((state) => state.openReportModal);

  const [isCompleted, setIsCompleted] = useState(false);

  if (!isLiveOutingOpen || !currentItinerary) return null;

  const stops = currentItinerary.stops || [];
  const currentStop = stops[activeLiveStopIndex];
  const place = currentStop?.place;
  const isLast = activeLiveStopIndex === stops.length - 1;

  const handleClose = () => {
    setIsCompleted(false);
    closeLiveOuting();
  };

  const handleArrived = () => {
    if (!currentStop) return;

    if (isLast) {
      soundEngine.playSuccess();
      markStopStatus(currentStop.id, 'arrived');

      // Celebration Confetti Explosion (Loaded On-Demand)
      import('canvas-confetti')
        .then((m) => {
          const confetti = m.default;
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.55 },
            zIndex: 9999,
            colors: ['#E5C378', '#2DD4BF', '#DF9F3D', '#FFFFFF', '#F59E0B'],
          });
        })
        .catch(() => {});

      setIsCompleted(true);
    } else {
      soundEngine.playClick();
      markStopStatus(currentStop.id, 'arrived');
      nextLiveStop();
    }
  };

  const handleSkip = () => {
    soundEngine.playClick();
    if (currentStop) {
      markStopStatus(currentStop.id, 'skipped');
      if (!isLast) {
        nextLiveStop();
      } else {
        setIsCompleted(true);
      }
    }
  };

  const handleSwap = () => {
    soundEngine.playClick();
    if (currentStop) {
      openSwapModal(currentStop);
    }
  };

  const handleOpenStoryPass = () => {
    soundEngine.playClick();
    handleClose();
    setIsStoryPassOpen(true);
  };

  const handleFinishAndHome = () => {
    soundEngine.playClick();
    handleClose();
    setActiveNavTab('home');
    showToast('عاش يا بطل! نتمنى لك أوقاتاً ممتعة دائماً في جدة 🌊☕', 'success');
  };

  // Completed Outing Stats
  const transitTotals = calculateTransitTotals(stops);
  const totalDwellMinutes = stops.reduce((acc, s) => acc + (s.place.dwellTimeMinutes || 60), 0);
  const totalHoursEstimated = Math.max(1.5, Math.round(((totalDwellMinutes + transitTotals.minutes) / 60) * 10) / 10);
  const completedStopsCount = stops.filter((s) => s.status === 'arrived' || s.status === 'completed').length || stops.length;
  const totalSpendSAR = currentItinerary.financials?.totalPerPersonSAR || 0;

  return (
    <Modal
      isOpen={isLiveOutingOpen}
      onClose={handleClose}
      title={
        isCompleted ? (
          <div className="flex items-center gap-2 text-start">
            <span className="p-1.5 rounded-xl bg-[#E5C378]/20 border border-[#E5C378]/40 text-[#E5C378]">
              <Trophy className="w-5 h-5" />
            </span>
            <span className="text-base sm:text-lg font-black text-white">
              {language === 'ar' ? 'اكتملت الجولة بنجاح' : 'Outing Completed!'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-start">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="text-base sm:text-lg font-black text-pearl">
              {language === 'ar' ? 'وضع الطلعة المباشر (Live Mode)' : 'Live Outing Mode'}
            </span>
          </div>
        )
      }
      subtitle={
        isCompleted
          ? (language === 'ar' ? 'مبروك إتمام كافة محطات الخطة!' : 'Congratulations on finishing the tour!')
          : (language === 'ar'
              ? `المحطة ${activeLiveStopIndex + 1} من ${stops.length}`
              : `Stop ${activeLiveStopIndex + 1} of ${stops.length}`)
      }
      maxWidth="xl"
    >
      {/* 1. COMPLETION SCREEN */}
      {isCompleted ? (
        <div className="space-y-6 pt-2 text-center">
          {/* Hero Celebration Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#172033] via-[#0D121D] to-[#0A0D14] border border-[#E5C378]/30 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -start-12 w-36 h-36 rounded-full bg-[#E5C378]/15 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -end-12 w-36 h-36 rounded-full bg-[#2DD4BF]/15 blur-2xl pointer-events-none" />

            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#DF9F3D] to-[#E5C378] p-0.5 shadow-[0_0_30px_rgba(229,195,120,0.4)] flex items-center justify-center mb-4">
              <div className="w-full h-full bg-[#0A0D14] rounded-[14px] flex items-center justify-center text-[#E5C378]">
                <Sparkles className="w-8 h-8" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
              {language === 'ar' ? 'عاش يا بطل! كملت طلعتك بنجاح 🎉🌊' : 'Way to go! Outing Completed 🎉🌊'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              {language === 'ar'
                ? 'استمتعت بجولة استثنائية في عروس البحر الأحمر.. جمعت الذكريات وعشت تفاصيل جدة بأحلى صورة.'
                : 'You explored the jewel of the Red Sea, gathered memorable moments, and experienced Jeddah to the fullest.'}
            </p>
          </div>

          {/* Quick Statistics Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-[#0D1017] border border-white/10 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'ar' ? 'المحطات' : 'Stops'}</span>
              </div>
              <span className="text-lg font-black text-white font-mono">
                {completedStopsCount} / {stops.length}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0D1017] border border-white/10 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
                <Car className="w-3.5 h-3.5 text-teal-400" />
                <span>{language === 'ar' ? 'المسافة' : 'Distance'}</span>
              </div>
              <span className="text-lg font-black text-teal-300 font-mono">
                ~{transitTotals.km} {language === 'ar' ? 'كم' : 'km'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0D1017] border border-white/10 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
                <Coins className="w-3.5 h-3.5 text-[#E5C378]" />
                <span>{language === 'ar' ? 'المصروف' : 'Spend'}</span>
              </div>
              <span className="text-lg font-black text-[#E5C378] font-mono">
                ~{totalSpendSAR} {language === 'ar' ? 'ر.س' : 'SAR'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleOpenStoryPass}
              className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] text-[#0A0D12] font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(229,195,120,0.35)] hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>
                {language === 'ar' ? 'مشاركة بوستر الطلعة كـ Story (9:16) 📸' : 'Share Outing Story Pass (9:16) 📸'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleFinishAndHome}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#121622] hover:bg-[#181E2E] text-slate-300 hover:text-white border border-white/10 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>{language === 'ar' ? 'إنهاء والعودة للرئيسية' : 'Finish & Return Home'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* 2. ACTIVE STOP VIEW */
        place && (
          <div className="space-y-6 pt-1 text-start">
            {/* Active Place Preview Banner */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-abyss-950 border border-white/10 shadow-lg">
              <SafeVenueImage
                src={place.imageUrl}
                alt={place.nameEn}
                category={place.category}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-abyss-950 via-abyss-950/40 to-transparent" />

              <div className="absolute top-3 end-3">
                <span className="px-3 py-1 rounded-xl bg-abyss-900/90 backdrop-blur-md text-gold-400 text-xs font-black border border-gold-500/40 shadow-sm">
                  {currentStop.timeSlot}
                </span>
              </div>

              <div className="absolute bottom-4 inset-x-4 text-pearl space-y-1">
                <div className="flex items-center gap-2 text-xs text-teal-300 font-bold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? place.districtNameAr : place.districtNameEn}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-pearl">
                  {language === 'ar' ? place.nameAr : place.nameEn}
                </h3>
              </div>
            </div>

            {/* Dwell time & Transit */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-abyss-900 border border-white/10 flex items-center justify-between">
                <span className="text-pearl-muted font-medium">
                  {language === 'ar' ? 'مدة الجلسة:' : 'Duration:'}
                </span>
                <span className="font-bold text-pearl">
                  ~{place.dwellTimeMinutes || 60} {language === 'ar' ? 'دقيقة' : 'mins'}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-abyss-900 border border-white/10 flex items-center justify-between">
                <span className="text-pearl-muted font-medium">
                  {language === 'ar' ? 'التكلفة المقدرة:' : 'Est. Cost:'}
                </span>
                <span className="font-bold text-gold-400">
                  {place.averageCostSAR > 0
                    ? `${place.averageCostSAR} ر.س`
                    : (language === 'ar' ? 'مجاني' : 'Free')}
                </span>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              {/* Arrived / Finish Button */}
              <button
                type="button"
                onClick={handleArrived}
                className="py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-abyss-950 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <CheckCircle className="w-4 h-4" />
                <span>
                  {isLast
                    ? (language === 'ar' ? 'إنهاء الطلعة ✅' : 'Finish Outing ✅')
                    : (language === 'ar' ? 'وصلت المكان ✅' : 'I Arrived ✅')}
                </span>
              </button>

              {/* Skip Button */}
              <button
                type="button"
                onClick={handleSkip}
                className="py-3.5 px-4 rounded-2xl bg-abyss-800 hover:bg-abyss-700 text-pearl-muted hover:text-pearl border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <SkipForward className="w-4 h-4" />
                <span>{language === 'ar' ? 'تخطي المحطة' : 'Skip Stop'}</span>
              </button>

              {/* Closed / Swap Alternative */}
              <button
                type="button"
                onClick={handleSwap}
                className="py-3.5 px-4 rounded-2xl bg-abyss-800 hover:bg-abyss-700 text-gold-400 border border-gold-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{language === 'ar' ? 'المكان مغلق؟ بديل' : 'Suggest Alternative'}</span>
              </button>
            </div>

            {/* Smart Field Mobility: Uber & Turn-by-Turn Navigation */}
            <div className="pt-3 border-t border-white/10 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Uber Direct Launcher */}
                <a
                  href={generateUberDeepLink(place.coordinates.lat, place.coordinates.lng, place.nameAr)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-4 rounded-2xl bg-black hover:bg-neutral-900 border border-white/20 text-white hover:text-[#F5D07A] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all"
                  title="طلب سيارة أوبر مباشرة إلى هذه الوجهة"
                >
                  <Car className="w-4 h-4 text-[#F5D07A]" />
                  <span>{language === 'ar' ? 'انطلق مع Uber 🚗' : 'Ride with Uber 🚗'}</span>
                </a>

                {/* Smart Navigation (Apple/Google) */}
                <a
                  href={generateMapsNavigationLink(place.coordinates.lat, place.coordinates.lng, place.nameAr)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-abyss-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-glow-gold hover:scale-[1.01] active:scale-[0.98] transition-all"
                  title="بدء الملاحة الذكية في خرائط الجوال"
                >
                  <Navigation className="w-4 h-4" />
                  <span>
                    {language === 'ar' ? 'الملاحة بالخرائط 🗺️' : 'Start Navigation 🗺️'}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>

              {/* Feedback Button */}
              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    openReportModal(place);
                  }}
                  className="text-xs text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer py-1"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>{language === 'ar' ? 'معلومة غير دقيقة في المكان؟ بلّغنا 📝' : 'Inaccurate place details? Report 📝'}</span>
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </Modal>
  );
};
