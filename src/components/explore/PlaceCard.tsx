'use client';

import React from 'react';
import { Star, MapPin, Clock, Plus, ExternalLink, Heart, Check } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { Place } from '@/types';
import { getAssetUrl } from '@/utils/paths';

interface PlaceCardProps {
  place: Place;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const { language } = useLanguage();
  const setSelectedPlaceForModal = useItineraryStore((state) => state.setSelectedPlaceForModal);
  const addPlaceToItinerary = useItineraryStore((state) => state.addPlaceToItinerary);
  const favoritePlaceIds = useItineraryStore((state) => state.favoritePlaceIds);
  const toggleFavoritePlace = useItineraryStore((state) => state.toggleFavoritePlace);
  const currentItinerary = useItineraryStore((state) => state.currentItinerary);

  const isFavorite = favoritePlaceIds.includes(place.id);
  const isAlreadyInPlan = currentItinerary?.stops.some((s) => s.place.id === place.id);

  const formattedDuration =
    language === 'ar'
      ? `${place.dwellTimeMinutes} دقيقة`
      : `${place.dwellTimeMinutes} mins`;

  return (
    <div className="group bg-navy-800 rounded-3xl overflow-hidden border border-navy-700 shadow-card-dark hover:border-gold-400/60 transition-all duration-300 flex flex-col justify-between">
      {/* Image Banner */}
      <div className="relative aspect-[16/10] overflow-hidden bg-navy-950">
        <img
          src={getAssetUrl(place.imageUrl)}
          alt={place.nameEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges overlay */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <span className="px-2.5 py-1 rounded-xl bg-navy-950/85 backdrop-blur-md text-white text-xs font-black flex items-center gap-1 border border-white/10">
              <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
              <span>{place.rating}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavoritePlace(place.id);
            }}
            className="p-2 rounded-xl bg-navy-950/85 backdrop-blur-md text-white hover:text-red-400 transition-colors pointer-events-auto shadow-sm cursor-pointer border border-white/10"
            aria-label="Favorite"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'text-red-500 fill-red-500' : ''
              }`}
            />
          </button>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 start-3">
          <span className="px-3 py-1 rounded-xl bg-navy-950/90 backdrop-blur-md text-gold-400 font-black text-xs border border-gold-500/40">
            {place.averageCostSAR > 0
              ? `${place.averageCostSAR} ر.س`
              : language === 'ar'
              ? 'مجاني'
              : 'Free'}
          </span>
        </div>
      </div>

      {/* Content Area with No Text Clipping */}
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between text-start">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-teal-400 font-bold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? place.districtNameAr : place.districtNameEn}</span>
            </span>

            <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3 text-gold-400" />
              <span>{formattedDuration}</span>
            </span>
          </div>

          <h3
            onClick={() => setSelectedPlaceForModal(place)}
            className="text-base sm:text-lg font-black text-white hover:text-gold-400 transition-colors cursor-pointer line-clamp-1"
          >
            {language === 'ar' ? place.nameAr : place.nameEn}
          </h3>

          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">
            {language === 'ar' ? place.descriptionAr : place.descriptionEn}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-navy-700 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedPlaceForModal(place)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-navy-700 hover:bg-navy-600 text-white border border-white/10 text-xs font-bold transition-all cursor-pointer"
          >
            {language === 'ar' ? 'تفاصيل المكان' : 'Details'}
          </button>

          <button
            type="button"
            onClick={() => addPlaceToItinerary(place)}
            className={`py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isAlreadyInPlan
                ? 'bg-status-success text-white shadow-sm font-black'
                : 'bg-coral-500 hover:bg-coral-600 text-white shadow-glow-coral hover:scale-[1.02]'
            }`}
          >
            {isAlreadyInPlan ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'في خطتك' : 'Added'}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'أضف للخطة' : 'Add'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
