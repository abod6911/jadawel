'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { ItineraryStop } from '@/types';
import { soundEngine } from '@/utils/audioEngine';
import { getAssetUrl } from '@/utils/paths';

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

  const focusedStopId = useItineraryStore((state) => state.focusedStopId);
  const setFocusedStopId = useItineraryStore((state) => state.setFocusedStopId);
  const setFocusedStopCoords = useItineraryStore((state) => state.setFocusedStopCoords);

  const place = stop.place;
  const isFocused = focusedStopId === place.id;

  const handleCardFocus = () => {
    setFocusedStopId(place.id);
    if (place.coordinates) {
      setFocusedStopCoords([place.coordinates.lat, place.coordinates.lng]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={handleCardFocus}
      onClick={handleCardFocus}
      className="relative group text-start select-none"
    >
      {/* Numbered Node on Glowing Timeline with Active Pulse */}
      <div
        className={`absolute top-6 start-4 sm:start-6 -translate-x-1/2 rtl:translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full font-black text-xs sm:text-sm flex items-center justify-center z-20 border-2 border-[#06090F] transition-all duration-300 ${
          isFocused
            ? 'bg-gradient-to-tr from-[#F5D07A] via-[#D4AF37] to-[#AA7C11] text-[#06090F] shadow-[0_0_25px_rgba(212,175,55,0.85)] scale-110 ring-4 ring-[#D4AF37]/30'
            : 'bg-gradient-to-tr from-[#DF9F3D] to-[#E5C378] text-[#080B11] shadow-[0_0_15px_rgba(229,195,120,0.5)]'
        }`}
      >
        {stop.order}
        {isFocused && (
          <span className="absolute -inset-1 rounded-full border border-[#F5D07A] animate-ping opacity-75 pointer-events-none" />
        )}
      </div>

      {/* Card Surface Container */}
      <div
        className={`ms-10 sm:ms-14 rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition-all duration-300 ease-spring-snappy border ${
          isFocused
            ? 'bg-[#0E1524]/90 border-[#D4AF37]/80 shadow-[0_15px_40px_-10px_rgba(212,175,55,0.25)] ring-1 ring-[#D4AF37]/40 -translate-y-1'
            : 'bg-[#0B111E]/70 backdrop-blur-xl border-white/[0.08] hover:border-[#D4AF37]/50 hover:bg-[#0E1524]/80'
        }`}
      >
        {/* Top Header Bar: Time Slot, District, & Stop Reorder Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-[var(--accent-gold-soft)] text-[var(--accent-gold)] border border-[var(--border-gold)] text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <Clock className="w-3.5 h-3.5" />
              <span>{stop.timeSlot}</span>
            </span>

            <span className="px-2.5 py-1 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{language === 'ar' ? place.districtNameAr : place.districtNameEn}</span>
            </span>

            <span className="text-xs text-slate-400 font-medium">
              ({place.dwellTimeMinutes || 60} {language === 'ar' ? 'دقيقة جلسة' : 'mins'})
            </span>
          </div>

          {/* Reorder and Swap Toolbar */}
          <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                moveStopUp(stop.id);
              }}
              disabled={isFirst}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/10 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              title="تقديم المحطة"
              aria-label="Move Stop Up"
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
              className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/10 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              title="تأخير المحطة"
              aria-label="Move Stop Down"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                openSwapModal(stop);
              }}
              className="p-1.5 rounded-lg text-[var(--accent-gold)] hover:brightness-110 hover:bg-white/10 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              title="تبديل المحطة ببديل مناسب"
              aria-label="Swap Stop"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                removeStop(stop.id);
              }}
              className="p-1.5 rounded-lg text-rose-400/80 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              title="حذف المحطة"
              aria-label="Remove Stop"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Place Content Grid (16:9 Visual + Details) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Visual Thumbnail (Aspect 16:9 on mobile, 4:3 on desktop with 1.04 hover zoom) */}
          <div className="md:col-span-4 relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#0A0D14] border border-white/10 group-hover:border-[var(--border-gold)] transition-colors">
            <img
              src={getAssetUrl(place.imageUrl)}
              alt={place.nameEn}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-spring-smooth"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

            {/* Price Badge */}
            <div className="absolute top-2.5 start-2.5">
              <span className="px-3 py-1 rounded-xl bg-[#080B11]/90 text-[var(--accent-gold)] font-black text-xs border border-[var(--border-gold)] shadow-md">
                {place.averageCostSAR > 0
                  ? `${place.averageCostSAR} ر.س`
                  : language === 'ar'
                  ? 'مجاني'
                  : 'Free'}
              </span>
            </div>

            {/* Open Now Tag */}
            <div className="absolute bottom-2.5 start-2.5">
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{language === 'ar' ? 'مفتوح للزيارة' : 'Open'}</span>
              </span>
            </div>
          </div>

          {/* Details & Curated Reasoning */}
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-xs text-[var(--accent-gold)] font-bold">
                <Star className="w-3.5 h-3.5 fill-[var(--accent-gold)]" />
                <span>{place.rating}</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  ({(place.reviewsCount || 1000).toLocaleString()})
                </span>
              </div>

              <div className="text-[11px] text-slate-400 font-medium">
                <span>{language === 'ar' ? place.openingHoursAr : place.openingHoursEn}</span>
              </div>
            </div>

            <h3
              onClick={() => {
                soundEngine.playClick();
                setSelectedPlaceForModal(place);
              }}
              className="text-lg sm:text-xl font-bold text-white hover:text-[var(--accent-gold)] transition-colors cursor-pointer leading-snug"
            >
              {language === 'ar' ? place.nameAr : place.nameEn}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2 font-normal">
              {language === 'ar' ? place.descriptionAr : place.descriptionEn}
            </p>

            {/* AI Curated Rationale */}
            <div className="p-3 rounded-xl bg-[var(--accent-gold-soft)] border border-[var(--border-gold)] text-xs flex items-start gap-2">
              <Compass className="w-4 h-4 text-[var(--accent-gold)] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-[var(--text-gold)] block">
                  {language === 'ar' ? 'لماذا اخترنا هذه المحطة؟' : 'Why this spot?'}
                </span>
                <p className="text-slate-300 text-xs leading-relaxed font-normal">
                  {place.aiReasoning
                    ? language === 'ar'
                      ? place.aiReasoning.ar
                      : place.aiReasoning.en
                    : language === 'ar'
                    ? place.descriptionAr
                    : place.descriptionEn}
                </p>
              </div>
            </div>

            {/* Weather Notice if applicable */}
            {stop.weatherNotice && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-300 flex items-center gap-2">
                <Sun className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span>{language === 'ar' ? stop.weatherNotice.textAr : stop.weatherNotice.textEn}</span>
              </div>
            )}

            {/* Action Bar with Google Maps Direct Link */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedPlaceForModal(place);
                }}
                className="text-[var(--accent-gold)] font-bold hover:underline flex items-center gap-1.5 cursor-pointer"
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
                  className="text-slate-400 hover:text-white font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{language === 'ar' ? 'تبديل المحطة' : 'Swap'}</span>
                </button>

                <a
                  href={place.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-teal-300 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  <span>{language === 'ar' ? 'خرائط Google' : 'Google Maps'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TimelineCard;
