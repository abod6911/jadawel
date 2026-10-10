'use client';

import React from 'react';
import { Search, MapPin, LayoutGrid, Map as MapIcon, X, Sparkles, Filter } from 'lucide-react';
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
  viewMode: 'grid' | 'map';
  onViewModeChange: (m: 'grid' | 'map') => void;
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
  viewMode,
  onViewModeChange,
  resultsCount,
}) => {
  const { language, isRTL } = useLanguage();

  const categories: { id: PlaceCategory | 'all'; labelAr: string; labelEn: string; emoji: string }[] = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All', emoji: '✨' },
    { id: 'culinary', labelAr: 'مطاعم ومقاهي', labelEn: 'Dining & Cafes', emoji: '☕' },
    { id: 'waterfront', labelAr: 'واجهات بحرية', labelEn: 'Waterfront', emoji: '🌊' },
    { id: 'heritage', labelAr: 'تراث وتاريخ', labelEn: 'Heritage', emoji: '🏛️' },
    { id: 'beach_resorts', labelAr: 'شواطئ ونوادي', labelEn: 'Beaches & Clubs', emoji: '🏖️' },
    { id: 'arts_entertainment', labelAr: 'فنون وفعاليات', labelEn: 'Arts & Events', emoji: '🎨' },
    { id: 'nature_parks', labelAr: 'ترفيه ومغامرة', labelEn: 'Fun & Adventure', emoji: '🎡' },
  ];

  return (
    <div className="space-y-4 text-start">
      {/* 1. Search Bar + District Selector + View Toggle */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="sm:col-span-7 relative">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3.5 w-4 h-4 text-gold-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'ابحث باسم المكان، الحي، أو نوع التجربة...'
                : 'Search by name, district, or vibe...'
            }
            className="w-full ps-10 pe-10 py-3.5 rounded-2xl bg-abyss-950/80 border border-white/10 text-xs sm:text-sm text-pearl placeholder-pearl-muted/60 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/50 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onSearchChange('');
              }}
              className="absolute top-1/2 -translate-y-1/2 end-3.5 p-1 rounded-full text-pearl-muted hover:text-white cursor-pointer"
              aria-label="Clear Search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* District Selector */}
        <div className="sm:col-span-3 relative">
          <MapPin className="absolute top-1/2 -translate-y-1/2 start-3.5 w-4 h-4 text-teal-400 pointer-events-none" />
          <select
            value={selectedDistrict}
            onChange={(e) => {
              soundEngine.playClick();
              onDistrictChange(e.target.value as any);
            }}
            className="w-full ps-10 pe-8 py-3.5 rounded-2xl bg-abyss-950/80 border border-white/10 text-xs sm:text-sm text-pearl font-bold focus:outline-none focus:border-gold-500/60 transition-all cursor-pointer"
          >
            <option value="all" className="bg-[#090B0E] text-white">
              {language === 'ar' ? 'جميع أحياء جدة 📍' : 'All Districts 📍'}
            </option>
            {JEDDAH_DISTRICTS.map((d) => (
              <option key={d.id} value={d.id} className="bg-[#090B0E] text-white">
                {language === 'ar' ? d.nameAr : d.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle: Grid vs Map */}
        <div className="sm:col-span-2 flex items-center justify-end gap-1 p-1 bg-abyss-950/80 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onViewModeChange('grid');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-abyss-800 text-gold-400 border border-gold-500/40 shadow-glow-gold'
                : 'text-pearl-muted hover:text-pearl'
            }`}
            title="عرض الشبكة"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'ar' ? 'شبكة' : 'Grid'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onViewModeChange('map');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'map'
                ? 'bg-abyss-800 text-teal-300 border border-teal-400/40 shadow-glow-teal'
                : 'text-pearl-muted hover:text-pearl'
            }`}
            title="عرض الخريطة"
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'ar' ? 'خريطة' : 'Map'}</span>
          </button>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
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
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-gradient-to-r from-gold-500/20 to-gold-600/20 text-gold-300 border-gold-500/60 shadow-glow-gold'
                  : 'bg-abyss-950/60 text-pearl-muted border-white/10 hover:border-white/20 hover:text-pearl'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{language === 'ar' ? cat.labelAr : cat.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Feature Chips & Live Counter */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: 'freeOnly' as const, labelAr: 'دخول مجاني 🆓', labelEn: 'Free Entry 🆓' },
            { key: 'seaViewOnly' as const, labelAr: 'إطلالة بحرية 🌊', labelEn: 'Sea View 🌊' },
            { key: 'familyOnly' as const, labelAr: 'مناسب للعوائل 👨‍👩‍👧', labelEn: 'Family Friendly 👨‍👩‍👧' },
            { key: 'indoorOnly' as const, labelAr: 'مكيف داخلي ❄️', labelEn: 'Indoor AC ❄️' },
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
                    ? 'bg-teal-500/20 text-teal-300 border-teal-400/50 shadow-glow-teal'
                    : 'bg-abyss-950/40 text-pearl-muted border-white/5 hover:border-white/15'
                }`}
              >
                <span>{language === 'ar' ? feat.labelAr : feat.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Live Result Counter */}
        <div className="text-xs text-pearl-muted font-medium flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>
            {language === 'ar'
              ? `${resultsCount} وجهة مطابقة`
              : `${resultsCount} spots found`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
