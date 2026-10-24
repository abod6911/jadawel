'use client';

import React from 'react';
import { Search, MapPin, X, Compass } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { PlaceCategory, DistrictId } from '@/types';
import { JEDDAH_DISTRICTS } from '@/data/districts';
import { soundEngine } from '@/utils/audioEngine';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: PlaceCategory | 'all';
  onCategoryChange: (cat: PlaceCategory | 'all') => void;
  selectedDistrict: DistrictId | 'all';
  onDistrictChange: (d: DistrictId | 'all') => void;
  activeFeatures: {
    freeOnly: boolean;
    familyOnly: boolean;
    seaViewOnly: boolean;
    indoorOnly: boolean;
  };
  onFeatureToggle: (key: 'freeOnly' | 'familyOnly' | 'seaViewOnly' | 'indoorOnly') => void;
  resultsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDistrict,
  onDistrictChange,
  activeFeatures,
  onFeatureToggle,
  resultsCount,
}) => {
  const { language } = useLanguage();

  const categories: { id: PlaceCategory | 'all'; labelAr: string; labelEn: string }[] = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'culinary', labelAr: 'مطاعم ومقاهي', labelEn: 'Dining & Cafes' },
    { id: 'waterfront', labelAr: 'واجهات بحرية', labelEn: 'Waterfront' },
    { id: 'heritage', labelAr: 'تراث وتاريخ', labelEn: 'Heritage' },
    { id: 'beach_resorts', labelAr: 'شواطئ ونوادي', labelEn: 'Beaches & Clubs' },
    { id: 'arts_entertainment', labelAr: 'فنون وفعاليات', labelEn: 'Arts & Events' },
    { id: 'nature_parks', labelAr: 'ترفيه ومغامرة', labelEn: 'Fun & Adventure' },
  ];

  return (
    <div className="space-y-4 text-start">
      {/* 1. Clean Search Bar + District Selector (No Map toggle) */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="sm:col-span-8 relative">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3.5 w-4 h-4 text-[#E5C378] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'ابحث باسم المكان، الحي، أو نوع التجربة...'
                : 'Search by name, district, or vibe...'
            }
            className="w-full ps-10 pe-10 py-3 sm:py-3.5 rounded-2xl bg-[#090C12]/90 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#E5C378]/70 focus:ring-1 focus:ring-[#E5C378]/50 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onSearchChange('');
              }}
              className="absolute top-1/2 -translate-y-1/2 end-3.5 p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
              aria-label="Clear Search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* District Selector */}
        <div className="sm:col-span-4 relative">
          <MapPin className="absolute top-1/2 -translate-y-1/2 start-3.5 w-4 h-4 text-teal-400 pointer-events-none" />
          <select
            value={selectedDistrict}
            onChange={(e) => {
              soundEngine.playClick();
              onDistrictChange(e.target.value as any);
            }}
            className="w-full ps-10 pe-8 py-3 sm:py-3.5 rounded-2xl bg-[#090C12]/90 border border-white/10 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-[#E5C378]/70 transition-all cursor-pointer"
          >
            <option value="all" className="bg-[#090B0E] text-white">
              {language === 'ar' ? 'جميع أحياء جدة' : 'All Districts'}
            </option>
            {JEDDAH_DISTRICTS.map((d) => (
              <option key={d.id} value={d.id} className="bg-[#090B0E] text-white">
                {language === 'ar' ? d.nameAr : d.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Streamlined Category Filter Pills (Zero Emojis, Pure Elegance) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onCategoryChange(cat.id);
              }}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-gradient-to-r from-[#DF9F3D]/25 via-[#E5C378]/30 to-[#C8A452]/25 text-[#F5E2B3] border-[#E5C378]/80 shadow-[0_0_15px_rgba(229,195,120,0.25)] scale-[1.02]'
                  : 'bg-white/[0.03] text-slate-400 border-white/[0.08] hover:border-white/20 hover:text-white'
              }`}
            >
              <span>{language === 'ar' ? cat.labelAr : cat.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Subtle Quick Filters & Counter */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-white/[0.07]">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: 'freeOnly' as const, labelAr: 'دخول مجاني', labelEn: 'Free Entry' },
            { key: 'seaViewOnly' as const, labelAr: 'إطلالة بحرية', labelEn: 'Sea View' },
            { key: 'familyOnly' as const, labelAr: 'مناسب للعوائل', labelEn: 'Family Friendly' },
            { key: 'indoorOnly' as const, labelAr: 'مكيف داخلي', labelEn: 'Indoor AC' },
          ].map((feat) => {
            const isActive = activeFeatures[feat.key];
            return (
              <button
                key={feat.key}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onFeatureToggle(feat.key);
                }}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-500/20 text-teal-300 border-teal-400/50 shadow-sm'
                    : 'bg-white/[0.02] text-slate-400 border-white/[0.06] hover:border-white/15 hover:text-slate-300'
                }`}
              >
                <span>{language === 'ar' ? feat.labelAr : feat.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Live Result Counter */}
        <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-[#E5C378]" />
          <span>
            {language === 'ar'
              ? `${resultsCount} وجهة معتمدة`
              : `${resultsCount} verified spots`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
