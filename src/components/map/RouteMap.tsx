'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Navigation } from 'lucide-react';
import { Place } from '@/types';

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
  const validStops = stops.filter((s) => s.place?.coordinates?.lat && s.place?.coordinates?.lng);
  const gmapsUrl = validStops.length >= 2
    ? `https://www.google.com/maps/dir/?api=1&origin=${validStops[0].place.coordinates.lat},${validStops[0].place.coordinates.lng}&destination=${validStops[validStops.length - 1].place.coordinates.lat},${validStops[validStops.length - 1].place.coordinates.lng}`
    : validStops.length === 1
    ? `https://www.google.com/maps/search/?api=1&query=${validStops[0].place.coordinates.lat},${validStops[0].place.coordinates.lng}`
    : 'https://www.google.com/maps';

  return (
    <div className="w-full h-full min-h-[420px] bg-[#0A0D14] rounded-[2rem] p-6 flex flex-col items-center justify-center text-center space-y-4 border border-[#E5C378]/25 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh-abyss opacity-40 pointer-events-none" />
      <div className="w-14 h-14 rounded-2xl bg-[#E5C378]/15 text-[#E5C378] border border-[#E5C378]/40 flex items-center justify-center shadow-lg animate-pulse">
        <MapPin className="w-7 h-7 text-[#E5C378]" />
      </div>
      <div className="space-y-1 relative z-10">
        <h4 className="text-base font-black text-white">خريطة مسار جدة التفاعلية</h4>
        <p className="text-xs text-slate-400 font-medium">جاري تجهيز نقاط المسار المرقّمة والتنقل المباشر 🛰️</p>
      </div>

      {/* Mini Node Route Indicator */}
      {validStops.length > 0 && (
        <div className="flex items-center gap-2 pt-2 relative z-10">
          {validStops.slice(0, 4).map((s, idx) => (
            <React.Fragment key={idx}>
              <div className="w-8 h-8 rounded-full bg-[#E5C378] text-[#0A0D14] font-black text-xs flex items-center justify-center border-2 border-white shadow-md">
                {idx + 1}
              </div>
              {idx < validStops.slice(0, 4).length - 1 && (
                <div className="w-6 h-0.5 bg-[#E5C378]/40" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {validStops.length > 0 && (
        <a
          href={gmapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/40 text-teal-300 text-xs font-bold transition-all shadow-md mt-2"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>فتح المسار في Google Maps</span>
        </a>
      )}
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
