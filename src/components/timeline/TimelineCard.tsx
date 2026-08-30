'use client';

import React from 'react';
import {
  Clock,
  Star,
  MapPin,
  RefreshCw,
  Trash2,
  ArrowUp,
  ArrowDown,
  Info,
  ExternalLink,
  Sun,
  Sparkles,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { ItineraryStop } from '@/types';
import { soundEngine } from '@/utils/audioEngine';

interface TimelineCardProps {
  stop: ItineraryStop;
  isFirst: boolean;
  isLast: boolean;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({
  stop,
  isFirst,
  isLast,
}) => {
  const { language } = useLanguage();
  const setSelectedPlaceForModal = useItineraryStore((state) => state.setSelectedPlaceForModal);
  const openSwapModal = useItineraryStore((state) => state.openSwapModal);
  const removeStop = useItineraryStore((state) => state.removeStop);
  const moveStopUp = useItineraryStore((state) => state.moveStopUp);
  const moveStopDown = useItineraryStore((state) => state.moveStopDown);

  const place = stop.place;

  return (
    <div className="relative group text-start">
      {/* Node pin circle on glowing timeline */}
      <div className="absolute top-6 start-4 sm:start-6 -translate-x-1/2 rtl:translate-x-1/2 w-9 h-9 rounded-full bg-gold-500 text-abyss-950 font-black text-xs sm:text-sm flex items-center justify-center shadow-glow-gold z-20 border-2 border-abyss-950">
        {stop.order}
      </div>

      {/* Card Body */}
      <div className="ms-10 sm:ms-14 bg-abyss-900/90 backdrop-blur-xl rounded-[2rem] p-5 sm:p-7 border border-white/10 shadow-cinematic hover:border-gold-500/50 transition-all duration-300">
        {/* Top Header Bar: Time Slot, District, & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/40 text-xs font-black flex items-center gap-1.5 shadow-sm">
              <Clock className="w-3.5 h-3.5" />
              <span>{stop.timeSlot}</span>
            </span>

            <span className="px-2.5 py-1 rounded-xl bg-teal-500/15 text-teal-300 border border-teal-400/30 text-xs font-bold flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{language === 'ar' ? place.districtNameAr : place.districtNameEn}</span>
            </span>

            <span className="text-xs text-pearl-muted font-medium">
              ({place.dwellTimeMinutes} {language === 'ar' ? 'دقيقة جلسة' : 'mins'})
            </span>
          </div>

          {/* Quick Stop Order & Swap Controls */}
          <div className="flex items-center gap-1 bg-abyss-950/80 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                moveStopUp(stop.id);
              }}
              disabled={isFirst}
              className="p-1.5 rounded-lg text-pearl-muted hover:text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/10 transition-colors cursor-pointer"
              title="Move Up"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                moveStopDown(stop.id);
              }}
              disabled={isLast}
              className="p-1.5 rounded-lg text-pearl-muted hover:text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/10 transition-colors cursor-pointer"
              title="Move Down"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                openSwapModal(stop);
              }}
              className="p-1.5 rounded-lg text-gold-400 hover:text-gold-300 hover:bg-white/10 transition-colors cursor-pointer"
              title="🔄 تبديل المكان ببديل قريب"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                removeStop(stop.id);
              }}
              className="p-1.5 rounded-lg text-red-400/80 hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer"
              title="حذف المحطة"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Place Main Information */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* 4K Visual Thumbnail */}
          <div className="md:col-span-4 relative aspect-[16/11] rounded-2xl overflow-hidden bg-abyss-950 border border-white/10 group-hover:border-gold-500/30 transition-colors">
            <img
              src={place.imageUrl}
              alt={place.nameEn}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-abyss-950/80 via-transparent to-transparent pointer-events-none" />

            {/* Price Badge */}
            <div className="absolute top-2.5 start-2.5">
              <span className="px-3 py-1 rounded-xl bg-abyss-950/90 backdrop-blur-md text-gold-400 font-black text-xs border border-gold-500/40 shadow-md">
                {place.averageCostSAR > 0 ? `${place.averageCostSAR} ر.س` : (language === 'ar' ? 'مجاني' : 'Free')}
              </span>
            </div>

            {/* Open Status Badge */}
            <div className="absolute bottom-2.5 start-2.5">
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 backdrop-blur-md text-emerald-300 font-bold text-[11px] border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{language === 'ar' ? 'مفتوح' : 'Open'}</span>
              </span>
            </div>
          </div>

          {/* Details & AI Rationale */}
          <div className="md:col-span-8 space-y-3 text-start">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-xs text-gold-400 font-black">
                <Star className="w-4 h-4 fill-gold-400" />
                <span>{place.rating}</span>
                <span className="text-[11px] text-pearl-muted font-normal">
                  ({place.reviewsCount.toLocaleString()})
                </span>
              </div>

              <div className="text-[11px] text-pearl-muted font-semibold">
                <span>{language === 'ar' ? place.openingHoursAr : place.openingHoursEn}</span>
              </div>
            </div>

            <h3
              onClick={() => {
                soundEngine.playClick();
                setSelectedPlaceForModal(place);
              }}
              className="text-lg sm:text-xl font-black text-pearl hover:text-gold-400 transition-colors cursor-pointer leading-snug"
            >
              {language === 'ar' ? place.nameAr : place.nameEn}
            </h3>

            <p className="text-xs sm:text-sm text-pearl-muted leading-relaxed line-clamp-2 font-medium">
              {language === 'ar' ? place.descriptionAr : place.descriptionEn}
            </p>

            {/* "لماذا اقترحنا هذا المكان؟" (AI Rationale) */}
            <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-400/20 text-xs font-semibold text-teal-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[11px] font-black text-gold-400 block">
                  {language === 'ar' ? 'لماذا اقترحنا هذا المكان؟' : 'Why this spot?'}
                </span>
                <p className="text-pearl-muted text-xs leading-relaxed font-normal">
                  {place.aiReasoning
                    ? (language === 'ar' ? place.aiReasoning.ar : place.aiReasoning.en)
                    : (language === 'ar' ? place.descriptionAr : place.descriptionEn)}
                </p>
              </div>
            </div>

            {/* Weather / Timing Notice */}
            {stop.weatherNotice && (
              <div className="p-2.5 rounded-xl bg-gold-500/10 border border-gold-500/25 text-xs font-semibold text-gold-400 flex items-center gap-2">
                <Sun className="w-4 h-4 shrink-0 text-coral-400" />
                <span>{language === 'ar' ? stop.weatherNotice.textAr : stop.weatherNotice.textEn}</span>
              </div>
            )}

            {/* Quick Action Footer */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedPlaceForModal(place);
                }}
                className="text-gold-400 font-bold hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'نصائح أهل جدة وتفاصيل المكان' : 'Insider Tips & Info'}</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    openSwapModal(stop);
                  }}
                  className="text-pearl-muted hover:text-gold-400 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{language === 'ar' ? 'تبديل المكان' : 'Swap Spot'}</span>
                </button>

                <a
                  href={place.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-300 font-bold hover:underline flex items-center gap-1"
                >
                  <span>{language === 'ar' ? 'خرائط Google' : 'Google Maps'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
