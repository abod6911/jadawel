'use client';

import React, { useState, useMemo } from 'react';
import { Compass } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { JEDDAH_PLACES } from '@/data/jeddah-places';
import { PlaceCategory, DistrictId } from '@/types';
import { FilterBar } from './FilterBar';
import { PlaceCard } from './PlaceCard';
import { BorderBeam } from '@/components/fancy/BorderBeam';
import { doesPlaceMatchDistrict, doesPlaceMatchCategory } from '@/utils/plannerEngine';

export const ExploreDirectory: React.FC = () => {
  const { language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'all'>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictId | 'all'>('all');

  const [features, setFeatures] = useState({
    freeOnly: false,
    familyOnly: false,
    seaViewOnly: false,
    indoorOnly: false,
  });

  const handleFeatureToggle = (key: keyof typeof features) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Robust Filter Logic with fuzzy normalization
  const filteredPlaces = useMemo(() => {
    return JEDDAH_PLACES.filter((place) => {
      // 1. Text Search across Arabic & English names, district, and tags
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchNameAr = place.nameAr?.toLowerCase().includes(q);
        const matchNameEn = place.nameEn?.toLowerCase().includes(q);
        const matchDistrictAr = place.districtNameAr?.toLowerCase().includes(q);
        const matchDistrictEn = place.districtNameEn?.toLowerCase().includes(q);
        const matchTags = place.tags?.some((tag) => tag.toLowerCase().includes(q));
        if (!matchNameAr && !matchNameEn && !matchDistrictAr && !matchDistrictEn && !matchTags) {
          return false;
        }
      }

      // 2. Normalized Category matching
      if (!doesPlaceMatchCategory(place.category, selectedCategory)) {
        return false;
      }

      // 3. Normalized District matching
      if (!doesPlaceMatchDistrict(place.district as string, selectedDistrict)) {
        return false;
      }

      // 4. Feature toggles
      if (features.freeOnly && place.averageCostSAR > 0) return false;
      if (features.familyOnly && !place.features?.familyFriendly) return false;
      if (features.seaViewOnly && !place.features?.seaView) return false;
      if (features.indoorOnly && !place.features?.indoorAC) return false;

      return true;
    });
  }, [searchQuery, selectedCategory, selectedDistrict, features]);

  return (
    <div className="max-w-7xl w-full mx-auto space-y-6 sm:space-y-8 pb-32 sm:pb-16 select-none">
      {/* Header Container with Smoky Obsidian Glass */}
      <div className="bg-[#0E1118]/85 backdrop-blur-3xl rounded-3xl p-5 sm:p-8 border border-[#E5C378]/30 shadow-[0_24px_70px_rgba(0,0,0,0.9)] space-y-6 relative overflow-hidden">
        <BorderBeam size={320} duration={15} borderWidth={1.5} colorFrom="#E5C378" colorTo="#F5E2B3" />
        <div className="space-y-1.5 text-start">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5C378]/15 border border-[#E5C378]/30 text-[#E5C378] text-xs font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'أفضل وجهات عروس البحر الأحمر' : 'Curated Destinations in Jeddah'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white">
            {language === 'ar' ? 'دليل معالم ووجهات جدة' : 'Jeddah Destination Guide'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
            {language === 'ar'
              ? 'استكشف وجهات منتقاة بعناية في كافة أرجاء المدينة، مع تفاصيل الأسعار، ساعات العمل، ومستوى التقييم.'
              : 'Explore handpicked destinations across Jeddah with verified pricing, hours, and insider local tips.'}
          </p>
        </div>

        {/* Streamlined Filter Controls */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedDistrict={selectedDistrict}
          onDistrictChange={setSelectedDistrict}
          activeFeatures={features}
          onFeatureToggle={handleFeatureToggle}
          resultsCount={filteredPlaces.length}
        />
      </div>

      {/* Main Content: Pure Responsive Grid (Map view removed as requested) */}
      <div>
        {filteredPlaces.length === 0 ? (
          <div className="p-12 sm:p-16 text-center bg-[#0C0F17]/90 rounded-3xl border border-white/10 space-y-4 shadow-cinematic">
            <div className="w-16 h-16 rounded-2xl bg-[#E5C378]/15 text-[#E5C378] flex items-center justify-center mx-auto border border-[#E5C378]/30">
              <Compass className="w-8 h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              {language === 'ar' ? 'لم نجد أي وجهة مطابقة للبحث' : 'No destinations match your criteria'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-md mx-auto">
              {language === 'ar'
                ? 'جرب تعديل خيارات التصفية أو البحث عن كلمة أخرى أو مسح فلتر الحي.'
                : 'Try adjusting your filters, searching for another keyword, or resetting the district filter.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDistrict('all');
                setFeatures({ freeOnly: false, familyOnly: false, seaViewOnly: false, indoorOnly: false });
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#DF9F3D] to-[#E5C378] text-[#0A0D14] font-black text-xs hover:opacity-95 transition-all cursor-pointer shadow-md"
            >
              {language === 'ar' ? 'إعادة ضبط عوامل التصفية' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreDirectory;
