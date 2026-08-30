'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Place } from '@/types';
import { MapPin, Navigation, Sparkles } from 'lucide-react';

interface MapStop {
  place: Place;
  order?: number;
  timeSlot?: string;
}

export interface RouteMapProps {
  stops: MapStop[];
  className?: string;
  showPolyline?: boolean;
}

// Fallback Vector Route Canvas during client hydration or offline
const VectorRouteFallback: React.FC<{ stops: MapStop[] }> = ({ stops }) => {
  return (
    <div className="w-full h-full min-h-[420px] bg-abyss-950 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center space-y-4 border border-gold-500/25 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh-abyss opacity-40 pointer-events-none" />
      <div className="w-14 h-14 rounded-2xl bg-gold-500/20 text-gold-400 border border-gold-500/40 flex items-center justify-center shadow-glow-gold animate-bounce">
        <MapPin className="w-7 h-7 text-coral-400" />
      </div>
      <div className="space-y-1 relative z-10">
        <h4 className="text-base font-black text-pearl">جارٍ تحميل خريطة مسار جدة التفاعلية...</h4>
        <p className="text-xs text-pearl-muted font-medium">جاري تجهيز نقاط المسار والاتصال بالأقمار الصناعية 🛰️</p>
      </div>

      {/* Mini Node Route Indicator */}
      <div className="flex items-center gap-2 pt-2 relative z-10">
        {stops.slice(0, 4).map((s, idx) => (
          <React.Fragment key={idx}>
            <div className="w-8 h-8 rounded-full bg-coral-500 text-white font-black text-xs flex items-center justify-center border-2 border-gold-400 shadow-md">
              {idx + 1}
            </div>
            {idx < stops.slice(0, 4).length - 1 && (
              <div className="w-6 h-0.5 bg-teal-400 opacity-60" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Dynamically import Leaflet with no SSR
const LeafletMap = dynamic(() => import('./LeafletMapContent'), {
  ssr: false,
  loading: () => <VectorRouteFallback stops={[]} />,
});

export const RouteMap: React.FC<RouteMapProps> = ({
  stops,
  className = 'h-full min-h-[480px] w-full',
  showPolyline = true,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <VectorRouteFallback stops={stops} />;
  }

  return (
    <div className={`w-full h-full min-h-[420px] sm:min-h-[480px] lg:min-h-[580px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-cinematic border border-gold-500/30 ${className}`}>
      <LeafletMap stops={stops} showPolyline={showPolyline} />
    </div>
  );
};

export const InteractiveMap = RouteMap;
export default RouteMap;
