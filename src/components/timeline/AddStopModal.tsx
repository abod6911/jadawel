'use client';

import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Search,
  Plus,
  Clock,
  Car,
  Compass,
  Sparkles,
  Coffee,
  Utensils,
  Waves,
  Landmark,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { JEDDAH_PLACES } from '@/data/jeddah-places';
import { Place, PlaceCategory } from '@/types';
import {
  calculateHaversineDistanceKm,
  estimateDrivingMinutes,
} from '@/utils/distanceCalculator';
import { soundEngine } from '@/utils/audioEngine';
import { getAssetUrl } from '@/utils/paths';

export const AddStopModal: React.FC = () => {
  const { language } = useLanguage();
  const isAddStopModalOpen = useItineraryStore((state) => state.isAddStopModalOpen);
  const setIsAddStopModalOpen = useItineraryStore((state) => state.setIsAddStopModalOpen);
  const addStop = useItineraryStore((state) => state.addStop);
  const currentItinerary = useItineraryStore((state) => state.currentItinerary);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const currentStops = currentItinerary?.stops || [];
  const usedPlaceIds = useMemo(() => new Set(currentStops.map((s) => s.place.id)), [currentStops]);
  const lastStop = currentStops.length > 0 ? currentStops[currentStops.length - 1] : null;

  // Filter & Rank Places
  const candidatePlaces = useMemo(() => {
    return JEDDAH_PLACES.filter((p) => !usedPlaceIds.has(p.id))
      .map((place) => {
        let distKm = 5;
        let driveMins = 12;

        if (lastStop) {
          distKm = calculateHaversineDistanceKm(
            lastStop.place.coordinates.lat,
            lastStop.place.coordinates.lng,
            place.coordinates.lat,
            place.coordinates.lng
          );
          driveMins = estimateDrivingMinutes(distKm);
        }

        return {
          place,
          distKm: Math.round(distKm * 10) / 10,
          driveMins,
        };
      })
      .sort((a, b) => a.distKm - b.distKm); // Sort by proximity to last stop
  }, [usedPlaceIds, lastStop]);

  // Apply search query and category filters
  const filteredList = useMemo(() => {
    return candidatePlaces.filter(({ place }) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'cafe' && place.category !== 'cafe') return false;
        if (selectedCategory === 'restaurant' && place.category !== 'restaurant' && place.category !== 'culinary')
          return false;
        if (
          selectedCategory === 'waterfront' &&
          place.category !== 'waterfront' &&
          place.category !== 'beach'
        )
          return false;
        if (
          selectedCategory === 'cultural' &&
          place.category !== 'cultural' &&
          place.category !== 'heritage' &&
          place.category !== 'arts_entertainment'
        )
          return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchNameAr = place.nameAr?.toLowerCase().includes(query);
        const matchNameEn = place.nameEn?.toLowerCase().includes(query);
        const matchDistrictAr = place.districtNameAr?.toLowerCase().includes(query);
        const matchDistrictEn = place.districtNameEn?.toLowerCase().includes(query);
        return matchNameAr || matchNameEn || matchDistrictAr || matchDistrictEn;
      }

      return true;
    });
  }, [candidatePlaces, selectedCategory, searchQuery]);

  const handleSelectPlace = (place: Place) => {
    soundEngine.playClick();
    const success = addStop(place);
    if (success) {
      setIsAddStopModalOpen(false);
      setSearchQuery('');
    }
  };

  const categories = [
    { id: 'all', labelAr: 'الكل المقترح', labelEn: 'All Suggested', icon: Compass },
    { id: 'cafe', labelAr: 'كافيه وحلى', labelEn: 'Cafes', icon: Coffee },
    { id: 'restaurant', labelAr: 'مطاعم وعشاء', labelEn: 'Dining', icon: Utensils },
    { id: 'waterfront', labelAr: 'بحر وإطلالات', labelEn: 'Seaside', icon: Waves },
    { id: 'cultural', labelAr: 'تراث وفنون', labelEn: 'Culture', icon: Landmark },
  ];

  return (
    <Modal
      isOpen={isAddStopModalOpen}
      onClose={() => setIsAddStopModalOpen(false)}
      title={
        <div className="flex items-center gap-2 text-start">
          <span className="p-2 rounded-xl bg-gradient-to-br from-[#DF9F3D]/20 to-[#2DD4BF]/20 border border-[#E5C378]/30 text-[#E5C378]">
            <Plus className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">
              {language === 'ar' ? 'إضافة محطة جديدة للخطة' : 'Add Stop to Itinerary'}
            </h3>
            {lastStop && (
              <p className="text-[11px] text-slate-400 font-medium">
                {language === 'ar'
                  ? `أماكن مرتبة بالأقرب جغرافياً من: ${lastStop.place.nameAr}`
                  : `Ranked closest to: ${lastStop.place.nameEn}`}
              </p>
            )}
          </div>
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-4 pt-1">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'ابحث باسم المكان أو الحي (مثلاً: الروضة، الشاطئ، كافيه...)'
                : 'Search place or district...'
            }
            className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-[#080B11] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[#E5C378]/50 focus:ring-1 focus:ring-[#E5C378]/40 transition-all"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-[#E5C378] text-[#0A0D12] shadow-sm'
                    : 'bg-[#12151C] text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? cat.labelAr : cat.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Places List */}
        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pe-1 scrollbar-thin scrollbar-thumb-white/10">
          {filteredList.slice(0, 20).map(({ place, distKm, driveMins }) => (
            <div
              key={place.id}
              className="p-3 rounded-2xl bg-[#0D1017] hover:bg-[#121722] border border-white/5 hover:border-[#E5C378]/30 transition-all flex items-center justify-between gap-3 text-start group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-900 shrink-0 border border-white/10 relative">
                  <img
                    src={getAssetUrl(place.imageUrl)}
                    alt={place.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getAssetUrl('/images/places/placeholder.jpg');
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E5C378]/10 text-[#E5C378] border border-[#E5C378]/20">
                      {language === 'ar' ? place.districtNameAr : place.districtNameEn}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {place.averageCostSAR > 0
                        ? `${place.averageCostSAR} ر.س`
                        : (language === 'ar' ? 'مجاني' : 'Free')}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-white truncate mt-1">
                    {language === 'ar' ? place.nameAr : place.nameEn}
                  </h4>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1 text-teal-400 font-mono">
                      <Car className="w-3 h-3" />
                      ~{driveMins} {language === 'ar' ? 'دقيقة قيادة' : 'min drive'}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <MapPin className="w-3 h-3" />
                      {distKm} {language === 'ar' ? 'كم' : 'km'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPlace(place)}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#DF9F3D] to-[#E5C378] text-[#0A0D12] text-xs font-black shrink-0 flex items-center gap-1 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'إضافة' : 'Add'}</span>
              </button>
            </div>
          ))}

          {filteredList.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-xs">
              {language === 'ar' ? 'لا توجد نتائج مطابقة لبحثك' : 'No places found matching your search'}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
