'use client';

import React from 'react';
import { RouteMap } from '@/components/map/RouteMap';
import { useItineraryStore } from '@/store/useItineraryStore';

export const PlanMapSplit: React.FC = () => {
  const currentItinerary = useItineraryStore((state) => state.currentItinerary);
  const activeVariant = useItineraryStore((state) => state.activeVariant);

  if (!currentItinerary) return null;

  const currentVariantData = (currentItinerary.variants as any)[activeVariant] || currentItinerary.variants.balanced;

  return (
    <div className="w-full h-full min-h-[480px] lg:min-h-[580px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-gold-500/30 shadow-cinematic bg-abyss-950">
      <RouteMap
        stops={currentVariantData?.stops || currentItinerary.stops}
        className="w-full h-full min-h-[480px] lg:min-h-[580px]"
      />
    </div>
  );
};

export default PlanMapSplit;
