'use client';

import React from 'react';
import {
  MapPin,
  Clock,
  Star,
  ExternalLink,
  Plus,
  Check,
  Sparkles,
  Lightbulb,
  DollarSign,
  Shield,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { Modal } from '@/components/ui/Modal';
import { getAssetUrl } from '@/utils/paths';

export const PlaceDetailModal: React.FC = () => {
  const { language } = useLanguage();
  const selectedPlace = useItineraryStore((state) => state.selectedPlaceForModal);
  const setSelectedPlaceForModal = useItineraryStore((state) => state.setSelectedPlaceForModal);
  const addPlaceToItinerary = useItineraryStore((state) => state.addPlaceToItinerary);
  const currentItinerary = useItineraryStore((state) => state.currentItinerary);

  if (!selectedPlace) return null;

  const isAlreadyInPlan = currentItinerary?.stops.some((s) => s.place.id === selectedPlace.id);

  return (
    <Modal
      isOpen={!!selectedPlace}
      onClose={() => setSelectedPlaceForModal(null)}
      maxWidth="3xl"
    >
      <div className="space-y-6 text-start">
        {/* Hero Photo Banner */}
        <div className="relative aspect-[16/9] -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 rounded-t-3xl overflow-hidden bg-abyss-950">
          <img
            src={getAssetUrl(selectedPlace.imageUrl)}
            alt={selectedPlace.nameEn}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getAssetUrl('/images/places/placeholder.jpg');
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-abyss-950 via-abyss-950/40 to-transparent" />

          {/* Bottom Title Overlay */}
          <div className="absolute bottom-4 inset-x-4 sm:bottom-6 sm:inset-x-6 text-pearl space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-abyss-900/90 backdrop-blur-md text-gold-400 text-xs font-black flex items-center gap-1.5 border border-gold-500/40">
                <Star className="w-3.5 h-3.5 fill-gold-400" />
                <span>{selectedPlace.rating} ({selectedPlace.reviewsCount}+ {language === 'ar' ? 'تقييم' : 'reviews'})</span>
              </span>
              <span className="px-3 py-1 rounded-xl bg-abyss-900/90 backdrop-blur-md text-teal-300 text-xs font-black flex items-center gap-1.5 border border-teal-500/40">
                <MapPin className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? selectedPlace.districtNameAr : selectedPlace.districtNameEn}</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black text-pearl drop-shadow-md">
              {language === 'ar' ? selectedPlace.nameAr : selectedPlace.nameEn}
            </h2>
          </div>
        </div>

        {/* Quick Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          {/* Average Cost */}
          <div className="p-3.5 rounded-2xl bg-abyss-900 border border-white/10 space-y-1">
            <span className="text-pearl-muted font-medium">
              {language === 'ar' ? 'التكلفة المقدرة' : 'Estimated Cost'}
            </span>
            <div className="text-sm font-black text-gold-400">
              {selectedPlace.averageCostSAR > 0
                ? `${selectedPlace.averageCostSAR} ر.س`
                : language === 'ar' ? 'دخول مجاني' : 'Free Entry'}
            </div>
          </div>

          {/* Dwell Time */}
          <div className="p-3.5 rounded-2xl bg-abyss-900 border border-white/10 space-y-1">
            <span className="text-pearl-muted font-medium">
              {language === 'ar' ? 'الوقت المقترح للزيارة' : 'Suggested Duration'}
            </span>
            <div className="text-sm font-black text-teal-300">
              {selectedPlace.dwellTimeMinutes} {language === 'ar' ? 'دقيقة' : 'mins'}
            </div>
          </div>

          {/* Best Time */}
          <div className="p-3.5 rounded-2xl bg-abyss-900 border border-white/10 space-y-1 col-span-2 sm:col-span-1">
            <span className="text-pearl-muted font-medium">
              {language === 'ar' ? 'أفضل فترة للزيارة' : 'Prime Visiting Time'}
            </span>
            <div className="text-sm font-black text-pearl">
              {language === 'ar' ? 'وقت الغروب والمساء' : 'Sunset & Evening'}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h4 className="text-sm font-black text-pearl">
            {language === 'ar' ? 'نبذة عن المكان' : 'About the Destination'}
          </h4>
          <p className="text-xs sm:text-sm text-pearl-muted leading-relaxed font-medium">
            {language === 'ar' ? selectedPlace.descriptionAr : selectedPlace.descriptionEn}
          </p>
        </div>

        {/* Opening Hours */}
        <div className="p-3.5 rounded-2xl bg-abyss-900 border border-white/10 flex items-center gap-3">
          <Clock className="w-5 h-5 text-gold-400 shrink-0" />
          <div className="text-xs">
            <span className="text-pearl-muted font-bold block">
              {language === 'ar' ? 'ساعات العمل الرسمية:' : 'Opening Hours:'}
            </span>
            <span className="text-pearl font-bold">
              {language === 'ar' ? selectedPlace.openingHoursAr : selectedPlace.openingHoursEn}
            </span>
          </div>
        </div>

        {/* Insider Tip Box */}
        {(selectedPlace.insiderTipAr || selectedPlace.insiderTipEn) && (
          <div className="p-4 rounded-2xl bg-abyss-800 border border-gold-500/30 space-y-1.5 shadow-md">
            <div className="flex items-center gap-2 text-xs font-black text-gold-400">
              <Lightbulb className="w-4 h-4 text-gold-400" />
              <span>{language === 'ar' ? 'نصيحة جداوية خاصة 💡' : 'Local Insider Tip 💡'}</span>
            </div>
            <p className="text-xs text-pearl-muted leading-relaxed font-medium">
              {language === 'ar' ? selectedPlace.insiderTipAr : selectedPlace.insiderTipEn}
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
          <a
            href={selectedPlace.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-pearl border border-white/15 text-xs font-bold transition-all flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4 text-teal-300" />
            <span>{language === 'ar' ? 'فتح في خرائط Google' : 'Open in Google Maps'}</span>
          </a>

          <button
            type="button"
            onClick={() => {
              addPlaceToItinerary(selectedPlace);
              setSelectedPlaceForModal(null);
            }}
            className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              isAlreadyInPlan
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm font-black'
                : 'bg-gold-500 hover:bg-gold-600 text-abyss-950 shadow-glow-gold hover:scale-[1.02]'
            }`}
          >
            {isAlreadyInPlan ? (
              <>
                <Check className="w-4 h-4" />
                <span>{language === 'ar' ? 'مضاف في خطتك الحالية' : 'Added to Plan'}</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>{language === 'ar' ? '✨ أضف المكان إلى خطتك' : '✨ Add to Itinerary'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
