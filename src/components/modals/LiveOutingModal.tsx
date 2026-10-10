'use client';

import React from 'react';
import {
  Navigation,
  CheckCircle,
  SkipForward,
  RefreshCw,
  ExternalLink,
  MapPin,
  Clock,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { Modal } from '@/components/ui/Modal';
import { soundEngine } from '@/utils/audioEngine';
import { getAssetUrl } from '@/utils/paths';

export const LiveOutingModal: React.FC = () => {
  const { language } = useLanguage();
  const isLiveOutingOpen = useItineraryStore((state) => state.isLiveOutingOpen);
  const closeLiveOuting = useItineraryStore((state) => state.closeLiveOuting);
  const activeLiveStopIndex = useItineraryStore((state) => state.activeLiveStopIndex);
  const markStopStatus = useItineraryStore((state) => state.markStopStatus);
  const nextLiveStop = useItineraryStore((state) => state.nextLiveStop);
  const openSwapModal = useItineraryStore((state) => state.openSwapModal);
  const currentItinerary = useItineraryStore((state) => state.currentItinerary);

  if (!isLiveOutingOpen || !currentItinerary) return null;

  const currentStop = currentItinerary.stops[activeLiveStopIndex];
  const place = currentStop?.place;
  const isLast = activeLiveStopIndex === currentItinerary.stops.length - 1;

  const handleArrived = () => {
    soundEngine.playClick();
    if (currentStop) {
      markStopStatus(currentStop.id, 'arrived');
      if (!isLast) nextLiveStop();
    }
  };

  const handleSkip = () => {
    soundEngine.playClick();
    if (currentStop) {
      markStopStatus(currentStop.id, 'skipped');
      if (!isLast) nextLiveStop();
    }
  };

  const handleSwap = () => {
    soundEngine.playClick();
    if (currentStop) {
      openSwapModal(currentStop);
    }
  };

  return (
    <Modal
      isOpen={isLiveOutingOpen}
      onClose={closeLiveOuting}
      title={
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <span className="text-base sm:text-lg font-black text-pearl">
            {language === 'ar' ? 'وضع الطلعة المباشر (Live Mode)' : 'Live Outing Mode'}
          </span>
        </div>
      }
      subtitle={
        language === 'ar'
          ? `المحطة ${activeLiveStopIndex + 1} من ${currentItinerary.stops.length}`
          : `Stop ${activeLiveStopIndex + 1} of ${currentItinerary.stops.length}`
      }
      maxWidth="xl"
    >
      {place && (
        <div className="space-y-6 pt-1 text-start">
          {/* Active Place Preview Banner */}
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-abyss-950 border border-white/10 shadow-lg">
            <img
              src={getAssetUrl(place.imageUrl)}
              alt={place.nameEn}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getAssetUrl('/images/places/placeholder.jpg');
              }}
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
              <span className="text-pearl-muted font-medium">{language === 'ar' ? 'مدة الجلسة:' : 'Duration:'}</span>
              <span className="font-bold text-pearl">~{place.dwellTimeMinutes} {language === 'ar' ? 'دقيقة' : 'mins'}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-abyss-900 border border-white/10 flex items-center justify-between">
              <span className="text-pearl-muted font-medium">{language === 'ar' ? 'التكلفة المقدرة:' : 'Est. Cost:'}</span>
              <span className="font-bold text-gold-400">
                {place.averageCostSAR > 0 ? `${place.averageCostSAR} ر.س` : (language === 'ar' ? 'مجاني' : 'Free')}
              </span>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            {/* Arrived Button */}
            <button
              type="button"
              onClick={handleArrived}
              className="py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-abyss-950 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{language === 'ar' ? 'وصلت المكان ✅' : 'I Arrived'}</span>
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

          {/* Direct Google Maps Navigation */}
          <div className="pt-3 border-t border-white/10">
            <a
              href={place.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-abyss-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-glow-gold hover:scale-[1.01] transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>{language === 'ar' ? 'بدء التوجيه في خرائط Google 🗺️' : 'Start Google Maps Navigation'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </Modal>
  );
};
