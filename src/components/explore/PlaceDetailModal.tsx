'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  Star,
  ExternalLink,
  Plus,
  Check,
  Lightbulb,
  DollarSign,
  Shield,
  Car,
  Navigation,
  AlertCircle,
  Store,
  Globe,
  Share2,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { Modal } from '@/components/ui/Modal';
import { getAssetUrl } from '@/utils/paths';
import { SafeVenueImage } from '@/components/ui/SafeVenueImage';
import { generateUberDeepLink, generateMapsNavigationLink } from '@/utils/navigationDeepLink';

export const PlaceDetailModal: React.FC = () => {
  const { language } = useLanguage();
  const selectedPlace = useItineraryStore((state) => state.selectedPlaceForModal);
  const setSelectedPlaceForModal = useItineraryStore((state) => state.setSelectedPlaceForModal);
  const addPlaceToItinerary = useItineraryStore((state) => state.addPlaceToItinerary);
  const openReportModal = useItineraryStore((state) => state.openReportModal);
  const currentItinerary = useItineraryStore((state) => state.currentItinerary);

  const [selectedBranchId, setSelectedBranchId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setSelectedBranchId(null);
  }, [selectedPlace?.id]);

  if (!selectedPlace) return null;

  const activeBranch = selectedPlace.branches?.find((b) => b.id === (selectedBranchId || selectedPlace.selectedBranchId))
    || selectedPlace.branches?.find((b) => b.isFlagship)
    || selectedPlace.branches?.[0];

  const currentCoordinates = activeBranch
    ? { lat: activeBranch.lat, lng: activeBranch.lng }
    : selectedPlace.coordinates;

  const currentName = activeBranch
    ? (language === 'ar' ? activeBranch.branchNameAr : activeBranch.branchNameEn)
    : (language === 'ar' ? selectedPlace.nameAr : selectedPlace.nameEn);

  const isAlreadyInPlan = currentItinerary?.stops.some((s) => s.place.id === selectedPlace.id);

  return (
    <Modal
      isOpen={!!selectedPlace}
      onClose={() => setSelectedPlaceForModal(null)}
      maxWidth="3xl"
    >
      <div className="space-y-6 text-start">
        {/* Hero Photo Banner */}
        <div
          className="relative aspect-[16/9] -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 rounded-t-3xl overflow-hidden bg-abyss-950"
        >
          <SafeVenueImage
            src={selectedPlace.imageUrl}
            alt={selectedPlace.nameEn}
            category={selectedPlace.category}
            className="w-full h-full object-cover"
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
              {selectedPlace.tags?.includes('trending') && (
                <span className="px-3 py-1 rounded-xl bg-rose-950/90 backdrop-blur-md text-rose-300 text-xs font-black border border-rose-500/50">
                  {language === 'ar' ? '🔥 ترند حالياً في جدة' : 'Trending in Jeddah'}
                </span>
              )}
              {selectedPlace.tags?.includes('michelin_guide') && (
                <span className="px-3 py-1 rounded-xl bg-red-950/90 backdrop-blur-md text-red-300 text-xs font-black border border-red-500/50">
                  {language === 'ar' ? '⭐ مختار في دليل ميشلان' : 'Michelin Guide Selected'}
                </span>
              )}
              {selectedPlace.tags?.includes('luxury_vip') && !selectedPlace.tags?.includes('michelin_guide') && (
                <span className="px-3 py-1 rounded-xl bg-amber-950/90 backdrop-blur-md text-amber-300 text-xs font-black border border-amber-500/50">
                  👑 VIP Fine Dining
                </span>
              )}
              {selectedPlace.tags?.includes('famous') && (
                <span className="px-3 py-1 rounded-xl bg-blue-950/90 backdrop-blur-md text-blue-300 text-xs font-black border border-blue-500/50">
                  {language === 'ar' ? '🔥 من أشهر معالم جدة' : 'Jeddah Iconic Landmark'}
                </span>
              )}
              {selectedPlace.tags?.includes('budget_gem') && (
                <span className="px-3 py-1 rounded-xl bg-emerald-950/90 backdrop-blur-md text-emerald-300 text-xs font-black border border-emerald-500/50">
                  {language === 'ar' ? '💰 خيار شعبي واقتصادي' : 'Budget Local Gem'}
                </span>
              )}
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

        {/* Verified Branches Section */}
        {selectedPlace.branches && selectedPlace.branches.length > 0 && (
          <div className="space-y-3 p-4 rounded-2xl bg-abyss-900/90 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-gold-400" />
                <h4 className="text-xs sm:text-sm font-black text-pearl">
                  {language === 'ar' ? 'فروع جدة المعتمدة' : 'Verified Jeddah Branches'}
                </h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-[11px] font-bold text-gold-300">
                {selectedPlace.branches.length} {language === 'ar' ? 'فروع موثقة' : 'Verified Branches'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {selectedPlace.branches.map((branch) => {
                const isSelected = activeBranch?.id === branch.id;
                return (
                  <div
                    key={branch.id}
                    onClick={() => setSelectedBranchId(branch.id)}
                    className={`p-3 rounded-xl border transition-all text-start cursor-pointer flex flex-col justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-gold-500/10 border-gold-500/60 shadow-sm ring-1 ring-gold-500/30'
                        : 'bg-abyss-950/60 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-xs font-black text-pearl line-clamp-1">
                          {language === 'ar' ? branch.branchNameAr : branch.branchNameEn}
                        </span>
                        {branch.isFlagship && (
                          <span className="shrink-0 px-1.5 py-0.5 rounded-md bg-gold-400/20 text-gold-300 border border-gold-400/40 text-[10px] font-black">
                            {language === 'ar' ? 'الفرع الرئيسي' : 'Flagship'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-pearl-muted">
                        <MapPin className="w-3 h-3 text-teal-400 shrink-0" />
                        <span>{language === 'ar' ? branch.districtAr : branch.districtEn}</span>
                      </div>
                      {branch.openingHoursAr && (
                        <div className="text-[10px] text-slate-400 line-clamp-1">
                          🕒 {language === 'ar' ? branch.openingHoursAr : branch.openingHoursEn}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 pt-1 border-t border-white/5" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={generateMapsNavigationLink(branch.lat, branch.lng, branch.branchNameAr)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1 px-2 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-teal-300 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                        title="خرائط Google"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>{language === 'ar' ? 'الخريطة' : 'Map'}</span>
                      </a>
                      <a
                        href={generateUberDeepLink(branch.lat, branch.lng, branch.branchNameAr)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1 px-2 rounded-lg bg-black/60 hover:bg-black border border-white/20 text-amber-300 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                        title="أوبر"
                      >
                        <Car className="w-3 h-3" />
                        <span>Uber</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 100% Verified Official Channels & Social Accounts */}
        {(selectedPlace.officialUrl || selectedPlace.instagramUrl) && (
          <div className="p-3.5 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 flex flex-wrap items-center justify-between gap-2.5">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'القنوات والروابط الرسمية المعتمدة:' : 'Verified Official Links:'}</span>
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {selectedPlace.officialUrl && (
                <a
                  href={selectedPlace.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white hover:text-amber-300 border border-white/15 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'ar' ? 'الموقع الرسمي' : 'Official Website'}</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}

              {selectedPlace.instagramUrl && (
                <a
                  href={selectedPlace.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/15 to-pink-500/15 hover:from-purple-500/25 hover:to-pink-500/25 text-pink-300 border border-pink-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span>Instagram</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Action Controls & Navigation Toolbar */}
        <div className="pt-3 border-t border-white/10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Feedback / Report Link */}
            <button
              type="button"
              onClick={() => {
                openReportModal(selectedPlace);
              }}
              className="text-xs text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer py-1"
            >
              <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === 'ar' ? 'معلومة غير دقيقة في المكان؟ بلّغنا 📝' : 'Inaccurate info? Report 📝'}</span>
            </button>

            {/* Smart Navigation Links */}
            <div className="flex items-center gap-2">
              <a
                href={generateUberDeepLink(currentCoordinates.lat, currentCoordinates.lng, currentName)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-black hover:bg-neutral-900 border border-white/20 text-white hover:text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                title="طلب سيارة أوبر مباشرة"
              >
                <Car className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'ar' ? 'Uber 🚗' : 'Uber 🚗'}</span>
              </a>

              <a
                href={generateMapsNavigationLink(currentCoordinates.lat, currentCoordinates.lng, currentName)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-teal-300 font-bold text-xs flex items-center gap-1.5 transition-colors active:scale-95"
                title="الملاحة بالخرائط"
              >
                <Navigation className="w-3.5 h-3.5 text-teal-400" />
                <span>{language === 'ar' ? 'الملاحة 🗺️' : 'Navigate 🗺️'}</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
            {activeBranch && selectedPlace.branches && selectedPlace.branches.length > 0 ? (
              <div className="text-[11px] text-pearl-muted flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>
                  {language === 'ar' ? 'الفرع المعتمد المختار:' : 'Selected branch:'}{' '}
                  <strong className="text-gold-400">{language === 'ar' ? activeBranch.branchNameAr : activeBranch.branchNameEn}</strong>
                </span>
              </div>
            ) : <div />}

            <button
              type="button"
              onClick={() => {
                const placeToAdd = activeBranch
                  ? {
                      ...selectedPlace,
                      coordinates: { lat: activeBranch.lat, lng: activeBranch.lng },
                      googleMapsUrl: activeBranch.googleMapsUrl,
                      selectedBranchId: activeBranch.id,
                      districtNameAr: activeBranch.districtAr,
                      districtNameEn: activeBranch.districtEn,
                    }
                  : selectedPlace;
                addPlaceToItinerary(placeToAdd);
                setSelectedPlaceForModal(null);
              }}
              className={`w-full sm:w-auto px-7 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isAlreadyInPlan
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm font-black'
                  : 'bg-gold-500 hover:bg-gold-600 text-abyss-950 shadow-glow-gold hover:scale-[1.02] active:scale-95'
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
                  <span>{language === 'ar' ? 'أضف المكان إلى خطتك' : 'Add to Itinerary'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
