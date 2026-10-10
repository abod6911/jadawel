'use client';

import React from 'react';
import { RefreshCw, Star, MapPin, Clock, Check } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { JEDDAH_PLACES } from '@/data/jeddah-places';
import { Place } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { soundEngine } from '@/utils/audioEngine';
import { getAssetUrl } from '@/utils/paths';
import { doesPlaceMatchDistrict, doesPlaceMatchCategory } from '@/utils/plannerEngine';

export const SwapPlaceModal: React.FC = () => {
  const { language } = useLanguage();
  const stopToSwap = useItineraryStore((state) => state.stopToSwap);
  const closeSwapModal = useItineraryStore((state) => state.closeSwapModal);
  const executeSwapStop = useItineraryStore((state) => state.executeSwapStop);
  const currentItinerary = useItineraryStore((state) => state.currentItinerary);

  if (!stopToSwap) return null;

  const currentPlace = stopToSwap.place;
  const existingPlaceIds = new Set(currentItinerary?.stops.map((s) => s.place.id));
  const isFreeContext = currentPlace.averageCostSAR === 0 || currentItinerary?.activeVariant === 'free';

  const alternatives = JEDDAH_PLACES.filter((p) => {
    if (p.id === currentPlace.id || existingPlaceIds.has(p.id)) return false;
    if (isFreeContext && p.averageCostSAR > 0) return false;

    const matchesDistrict = doesPlaceMatchDistrict(p.district as string, currentPlace.district as any);
    const matchesCategory = doesPlaceMatchCategory(p.category, currentPlace.category);
    return matchesDistrict || matchesCategory || (isFreeContext && p.averageCostSAR === 0);
  }).slice(0, 5);

  const handleSelectAlternative = (newPlace: Place) => {
    soundEngine.playSuccess();
    executeSwapStop(stopToSwap.id, newPlace);
  };

  return (
    <Modal
      isOpen={!!stopToSwap}
      onClose={closeSwapModal}
      title={
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-gold-400" />
          <span className="text-base sm:text-lg font-black text-pearl">
            {language === 'ar' ? 'تبديل واقتراح مكان بديل' : 'Swap Destination'}
          </span>
        </div>
      }
      subtitle={
        language === 'ar'
          ? 'اختر مكاناً بديلاً متوافقاً مع نفس التوقيت والمنطقة الجغرافية'
          : 'Select an alternative venue compatible with your current schedule'
      }
      maxWidth="2xl"
    >
      <div className="space-y-4 text-start">
        {/* Current Place Preview */}
        <div className="p-3.5 rounded-2xl bg-abyss-950 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={getAssetUrl(currentPlace.imageUrl)}
              alt={currentPlace.nameEn}
              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-pearl-muted uppercase">
                {language === 'ar' ? 'المكان الحالي' : 'Current Place'}
              </span>
              <h4 className="text-sm font-bold text-pearl truncate">
                {language === 'ar' ? currentPlace.nameAr : currentPlace.nameEn}
              </h4>
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl bg-gold-500/20 text-gold-400 text-xs font-black border border-gold-500/30 shrink-0">
            {stopToSwap.timeSlot}
          </span>
        </div>

        {/* Alternatives List */}
        <div className="space-y-3 pt-2">
          <h5 className="text-xs font-bold text-pearl-muted uppercase tracking-wider">
            {language === 'ar' ? 'البدائل المقترحة المتوافقة:' : 'Recommended Alternatives:'}
          </h5>

          {alternatives.length === 0 ? (
            <div className="p-6 text-center text-pearl-muted text-xs bg-abyss-950 rounded-2xl border border-white/10">
              {language === 'ar'
                ? 'لا توجد بدائل إضافية متوفرة لنفس المعايير حالياً.'
                : 'No additional alternatives available under current filters.'}
            </div>
          ) : (
            <div className="space-y-2.5">
              {alternatives.map((altPlace) => (
                <div
                  key={altPlace.id}
                  className="p-3.5 rounded-2xl bg-abyss-950 border border-white/10 hover:border-gold-400/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={getAssetUrl(altPlace.imageUrl)}
                      alt={altPlace.nameEn}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/10"
                    />
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-pearl truncate">
                          {language === 'ar' ? altPlace.nameAr : altPlace.nameEn}
                        </h4>
                        <span className="text-[11px] text-gold-400 font-bold flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-gold-400" />
                          <span>{altPlace.rating}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-pearl-muted">
                        <span className="flex items-center gap-1 text-teal-300">
                          <MapPin className="w-3 h-3" />
                          <span>{language === 'ar' ? altPlace.districtNameAr : altPlace.districtNameEn}</span>
                        </span>
                        <span className="text-gold-400 font-bold">
                          {altPlace.averageCostSAR > 0
                            ? `~${altPlace.averageCostSAR} ر.س`
                            : language === 'ar'
                            ? 'مجاني'
                            : 'Free'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectAlternative(altPlace)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-abyss-950 font-black text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'اختيار كبديل' : 'Select'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SwapPlaceModal;
