'use client';

import React from 'react';
import { Star, MapPin, Clock, Plus, ExternalLink, Heart, Check } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { Place } from '@/types';
import { getAssetUrl } from '@/utils/paths';
import { SafeVenueImage } from '@/components/ui/SafeVenueImage';

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

  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const isFavorite = favoritePlaceIds.includes(place.id);
  const isAlreadyInPlan = currentItinerary?.stops.some((s) => s.place.id === place.id);

  const formattedDuration =
    language === 'ar'
      ? `${place.dwellTimeMinutes} دقيقة`
      : `${place.dwellTimeMinutes} mins`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-[#0B111E]/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.7)] hover:border-[#D4AF37]/50 hover:shadow-[0_25px_60px_rgba(212,175,55,0.18)] hover:-translate-y-1.5 transition-all duration-300 ease-spring-snappy flex flex-col justify-between"
    >
      {/* Radial Spotlight Hover Glow */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300 opacity-100 z-10"
          style={{
            background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212, 175, 55, 0.12), transparent 80%)`,
          }}
        />
      )}

      {/* Image Banner with Safe Venue Image Fallback */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#06090F]">
        <SafeVenueImage
          src={place.imageUrl}
          alt={place.nameEn}
          category={place.category}
          className="w-full h-full object-cover group-hover:scale-[1.07] transition-transform duration-600 ease-spring-smooth"
        />

        {/* Top Badges overlay */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto flex-wrap">
            <span className="px-2.5 py-1 rounded-xl bg-[#0B0D12]/85 backdrop-blur-md text-white text-xs font-black flex items-center gap-1 border border-white/10 shadow-sm">
              <Star className="w-3.5 h-3.5 text-[#E5C378] fill-[#E5C378]" />
              <span>{place.rating}</span>
              {place.reviewsCount ? (
                <span className="text-[10px] text-pearl-muted font-bold">
                  ({place.reviewsCount >= 1000 ? `${(place.reviewsCount / 1000).toFixed(place.reviewsCount >= 10000 ? 0 : 1)}k` : place.reviewsCount})
                </span>
              ) : null}
            </span>

            {/* Special Badges */}
            {place.tags?.includes('trending') && (
              <span className="px-2 py-0.5 rounded-lg bg-rose-950/80 backdrop-blur-md text-rose-300 text-[10px] font-black border border-rose-500/40">
                {language === 'ar' ? '🔥 ترند' : 'Trending'}
              </span>
            )}
            {place.tags?.includes('michelin_guide') && (
              <span className="px-2 py-0.5 rounded-lg bg-red-950/80 backdrop-blur-md text-red-300 text-[10px] font-black border border-red-500/40">
                {language === 'ar' ? '⭐ ميشلان' : 'Michelin'}
              </span>
            )}
            {place.tags?.includes('luxury_vip') && !place.tags?.includes('michelin_guide') && (
              <span className="px-2 py-0.5 rounded-lg bg-amber-950/80 backdrop-blur-md text-amber-300 text-[10px] font-black border border-amber-500/40">
                👑 VIP
              </span>
            )}
            {place.tags?.includes('famous') && !place.tags?.includes('trending') && (
              <span className="px-2 py-0.5 rounded-lg bg-blue-950/80 backdrop-blur-md text-blue-300 text-[10px] font-black border border-blue-500/40">
                {language === 'ar' ? '⭐ أيقوني' : 'Iconic'}
              </span>
            )}
            {place.tags?.includes('budget_gem') && !place.tags?.includes('trending') && (
              <span className="px-2 py-0.5 rounded-lg bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-[10px] font-black border border-emerald-500/40">
                {language === 'ar' ? '💰 توفيري' : 'Budget'}
              </span>
            )}
            {place.branches && place.branches.length > 0 && (
              <span className="px-2 py-0.5 rounded-lg bg-teal-950/85 backdrop-blur-md text-teal-300 text-[10px] font-black border border-teal-500/40 flex items-center gap-1 shadow-sm">
                <span>📍</span>
                <span>{place.branches.length} {language === 'ar' ? 'فروع' : 'branches'}</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavoritePlace(place.id);
            }}
            className="p-2 rounded-xl bg-[#0B0D12]/85 backdrop-blur-md text-white hover:text-red-400 active:scale-125 transition-all duration-300 ease-spring-bouncy pointer-events-auto shadow-sm cursor-pointer border border-white/10"
            aria-label="Favorite"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'text-red-500 fill-red-500' : 'text-slate-400'
              }`}
            />
          </button>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 start-3">
          <span className="px-3 py-1 rounded-xl bg-[#0B0D12]/90 backdrop-blur-md text-[#E5C378] font-black text-xs border border-[#E5C378]/40">
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
            <span className="text-xs text-teal-300 font-bold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? place.districtNameAr : place.districtNameEn}</span>
            </span>

            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#E5C378]" />
              <span>{formattedDuration}</span>
            </span>
          </div>

          <h3
            onClick={() => setSelectedPlaceForModal(place)}
            className="text-base sm:text-lg font-black text-white hover:text-[#F5E2B3] transition-colors cursor-pointer line-clamp-1"
          >
            {language === 'ar' ? place.nameAr : place.nameEn}
          </h3>

          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">
            {language === 'ar' ? place.descriptionAr : place.descriptionEn}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-white/10 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedPlaceForModal(place)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#131722] hover:bg-[#1A1F2C] text-white border border-white/10 text-xs font-bold transition-all cursor-pointer text-center"
          >
            {language === 'ar' ? 'تفاصيل المكان' : 'Details'}
          </button>

          <button
            type="button"
            onClick={() => addPlaceToItinerary(place)}
            className={`py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isAlreadyInPlan
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm font-black'
                : 'bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] text-[#0B0D12] shadow-[0_0_15px_rgba(229,195,120,0.4)] hover:brightness-110 active:scale-95'
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
