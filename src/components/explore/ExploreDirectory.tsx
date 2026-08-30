'use client';

import React, { useState, useMemo } from 'react';
import { Search, Compass, MapPin, Sparkles } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { JEDDAH_PLACES } from '@/data/jeddah-places';
import { PlaceCategory, DistrictId, Place } from '@/types';
import { FilterBar } from './FilterBar';
import { PlaceCard } from './PlaceCard';
import { PlaceDetailModal } from './PlaceDetailModal';
import { InteractiveMap } from '@/components/map/InteractiveMap';

export const ExploreDirectory: React.FC = () => {
  const { language, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'all'>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictId | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const [features, setFeatures] = useState({
    freeOnly: false,
    familyOnly: false,
    seaViewOnly: false,
    indoorOnly: false,
  });

  const handleFeatureToggle = (key: keyof typeof features) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter logic
  const filteredPlaces = useMemo(() => {
    return JEDDAH_PLACES.filter((place) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchNameAr = place.nameAr.toLowerCase().includes(q);
        const matchNameEn = place.nameEn.toLowerCase().includes(q);
        const matchDistrictAr = place.districtNameAr.toLowerCase().includes(q);
        const matchDistrictEn = place.districtNameEn.toLowerCase().includes(q);
        const matchTags = place.tags.some((tag) => tag.toLowerCase().includes(q));
        if (!matchNameAr && !matchNameEn && !matchDistrictAr && !matchDistrictEn && !matchTags) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'all' && place.category !== selectedCategory) {
        return false;
      }

      // District
      if (selectedDistrict !== 'all' && place.district !== selectedDistrict) {
        return false;
      }

      // Feature toggles
      if (features.freeOnly && place.averageCostSAR > 0) return false;
      if (features.familyOnly && !place.features.familyFriendly) return false;
      if (features.seaViewOnly && !place.features.seaView) return false;
      if (features.indoorOnly && !place.features.indoorAC) return false;

      return true;
    });
  }, [searchQuery, selectedCategory, selectedDistrict, features]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Container in Velvet Midnight Blue */}
      <div className="bg-navy-900 rounded-3xl p-6 sm:p-8 border border-gold-500/30 shadow-card-dark space-y-6">
        <div className="space-y-1.5 text-start">
          <span className="text-xs font-black text-gold-400 uppercase tracking-wider block">
            {language === 'ar' ? 'أفضل وجهات عروس البحر الأحمر' : 'Curated Destinations in Jeddah'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {language === 'ar' ? 'دليل معالم ووجهات جدة' : 'Jeddah Destination Guide'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            {language === 'ar'
              ? 'استكشف أكثر من 35 وجهة منتقاة بعناية في كافة أرجاء المدينة، مع تفاصيل الأسعار، ساعات العمل، وأفضل الأوقات للزيارة.'
              : 'Explore 35+ handpicked destinations across Jeddah with verified pricing, hours, and prime visiting times.'}
          </p>
        </div>

        {/* Filter Controls */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedDistrict={selectedDistrict}
          onDistrictChange={setSelectedDistrict}
          activeFeatures={features}
          onFeatureToggle={handleFeatureToggle}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          resultsCount={filteredPlaces.length}
        />
      </div>

      {/* Main Content: Grid vs Map */}
      {viewMode === 'map' ? (
        <div className="space-y-4">
          <InteractiveMap
            stops={filteredPlaces.map((p, idx) => ({ place: p, order: idx + 1 }))}
            className="h-[600px]"
            showPolyline={false}
          />
        </div>
      ) : (
        <div>
          {filteredPlaces.length === 0 ? (
            <div className="p-12 text-center bg-navy-900 rounded-3xl border border-white/10 space-y-3 shadow-card-dark">
              <Compass className="w-12 h-12 mx-auto text-gold-400" />
              <h3 className="text-lg font-black text-white">
                {language === 'ar' ? 'لم نجد أي وجهة مطابقة للبحث' : 'No destinations match your criteria'}
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                {language === 'ar' ? 'جرب تعديل خيارات التصفية أو البحث عن كلمة أخرى.' : 'Try adjusting your filters or search query.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Place Detail Modal */}
      <PlaceDetailModal />
    </div>
  );
};
