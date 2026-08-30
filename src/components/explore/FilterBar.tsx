'use client';

import React from 'react';
import { Search, MapPin, SlidersHorizontal, LayoutGrid, Map as MapIcon, X } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { PlaceCategory, DistrictId } from '@/types';
import { JEDDAH_DISTRICTS } from '@/data/districts';

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
  const { language } = useLanguage();

  const categories: { id: PlaceCategory | 'all'; labelAr: string; labelEn: string; emoji: string }[] = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All', emoji: '✨' },
    { id: 'heritage', labelAr: 'تراث وتاريخ', labelEn: 'Heritage', emoji: '🏛️' },
    { id: 'waterfront', labelAr: 'واجهات وبحر', labelEn: 'Waterfront', emoji: '🌊' },
    { id: 'culinary', labelAr: 'مطاعم ومقاهي', labelEn: 'Dining & Cafes', emoji: '☕' },
    { id: 'arts_entertainment', labelAr: 'فنون وفعاليات', labelEn: 'Arts & Culture', emoji: '🎨' },
    { id: 'nature_parks', labelAr: 'ترفيه وملاهي', labelEn: 'Amusement & Parks', emoji: '🎡' },
    { id: 'beach_resorts', labelAr: 'شواطئ ومنتجعات', labelEn: 'Beaches & Resorts', emoji: '🏖️' },
  ];

  return (
    <div className="space-y-4">
      {/* Search Input & District Selector & View Toggle */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search Bar */}
        <div className="sm:col-span-7 relative">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3.5 w-4 h-4 text-gold-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={language === 'ar' ? 'ابحث باسم المكان، الحي، أو نوع التجربة...' : 'Search by name, district, or tag...'}
            className="w-full ps-10 pe-10 py-3.5 rounded-2xl bg-navy-900 border border-navy-700 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute top-1/2 -translate-y-1/2 end-3.5 p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
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
            onChange={(e) => onDistrictChange(e.target.value as any)}
            className="w-full ps-10 pe-8 py-3.5 rounded-2xl bg-navy-900 border border-navy-700 text-xs sm:text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all cursor-pointer"
          >
            <option value="all" className="bg-navy-900 text-white">
              {language === 'ar' ? 'جميع أحياء جدة 📍' : 'All Districts 📍'}
            </option>
            {JEDDAH_DISTRICTS.map((d) => (
              <option key={d.id} value={d.id} className="bg-navy-900 text-white">
                {language === 'ar' ? d.nameAr : d.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="sm:col-span-2 flex items-center justify-end gap-1.5 p-1 bg-navy-900 rounded-2xl border border-navy-700">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-coral-500 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'شبكة' : 'Grid'}</span>
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange('map')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
              viewMode === 'map'
                ? 'bg-teal-500 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'خريطة' : 'Map'}</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-start">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-coral-500 text-white shadow-glow-coral ring-2 ring-coral-400'
                  : 'bg-navy-900 hover:bg-navy-700 text-slate-300 hover:text-white border border-navy-700'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{language === 'ar' ? cat.labelAr : cat.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Feature Toggles & Results Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-navy-700/80 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onFeatureToggle('freeOnly')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              activeFeatures.freeOnly
                ? 'bg-teal-500/20 text-teal-300 border-teal-400'
                : 'bg-navy-900/80 text-slate-400 border-navy-700 hover:text-white'
            }`}
          >
            {language === 'ar' ? 'مجاني بالكامل 🏷️' : 'Free Entry 🏷️'}
          </button>

          <button
            type="button"
            onClick={() => onFeatureToggle('seaViewOnly')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              activeFeatures.seaViewOnly
                ? 'bg-teal-500/20 text-teal-300 border-teal-400'
                : 'bg-navy-900/80 text-slate-400 border-navy-700 hover:text-white'
            }`}
          >
            {language === 'ar' ? 'إطلالة بحرية 🌊' : 'Sea View 🌊'}
          </button>

          <button
            type="button"
            onClick={() => onFeatureToggle('familyOnly')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              activeFeatures.familyOnly
                ? 'bg-teal-500/20 text-teal-300 border-teal-400'
                : 'bg-navy-900/80 text-slate-400 border-navy-700 hover:text-white'
            }`}
          >
            {language === 'ar' ? 'مناسب للعائلات 👨‍👩‍👧‍👦' : 'Family Friendly 👨‍👩‍👧‍👦'}
          </button>

          <button
            type="button"
            onClick={() => onFeatureToggle('indoorOnly')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              activeFeatures.indoorOnly
                ? 'bg-teal-500/20 text-teal-300 border-teal-400'
                : 'bg-navy-900/80 text-slate-400 border-navy-700 hover:text-white'
            }`}
          >
            {language === 'ar' ? 'مكيف وداخلي ❄️' : 'Indoor AC ❄️'}
          </button>
        </div>

        <div className="text-gold-400 font-black">
          {language === 'ar'
            ? `عرض ${resultsCount} وجهة معتمدة في جدة`
            : `Showing ${resultsCount} verified destinations`}
        </div>
      </div>
    </div>
  );
};
