'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Place } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';
import { Navigation, Sparkles, MapPin, ExternalLink } from 'lucide-react';
import { soundEngine } from '@/utils/audioEngine';

interface MapStop {
  place: Place;
  order?: number;
  timeSlot?: string;
}

interface LeafletMapContentProps {
  stops: MapStop[];
  center?: [number, number];
  zoom?: number;
  showPolyline?: boolean;
}

// Custom Numbered Glowing Pin Maker
function createNumberedGlowingPin(order: number, isHovered: boolean = false): L.DivIcon {
  return L.divIcon({
    className: 'custom-leaflet-numbered-pin',
    html: `
      <div style="
        position: relative;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: ${isHovered ? 'rgba(246,199,122,0.4)' : 'rgba(244,111,82,0.35)'};
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          position: relative;
          background: ${isHovered ? 'linear-gradient(135deg, #F6C77A, #F46F52)' : 'linear-gradient(135deg, #F46F52, #1D8C88)'};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 14px rgba(0,0,0,0.6), 0 0 10px rgba(244,111,82,0.5);
          color: #ffffff;
          font-weight: 900;
          font-size: 13px;
          font-family: sans-serif;
          user-select: none;
        ">
          ${order}
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -18],
  });
}

// Map Bounds Auto-Fitter
function MapBoundsUpdater({ stops }: { stops: MapStop[] }) {
  const map = useMap();

  useEffect(() => {
    if (stops.length > 0) {
      const validCoords = stops
        .filter((s) => s.place?.coordinates?.lat && s.place?.coordinates?.lng)
        .map((s) => [s.place.coordinates.lat, s.place.coordinates.lng] as [number, number]);

      if (validCoords.length > 0) {
        const bounds = L.latLngBounds(validCoords);
        map.fitBounds(bounds, { padding: [55, 55], maxZoom: 15 });
      }
    }
  }, [stops, map]);

  return null;
}

export const LeafletMapContent: React.FC<LeafletMapContentProps> = ({
  stops,
  center = [21.5433, 39.1728],
  zoom = 12,
  showPolyline = true,
}) => {
  const { language, isRTL } = useLanguage();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const validStops = stops.filter(
    (s) => s.place && s.place.coordinates && typeof s.place.coordinates.lat === 'number'
  );

  const polylineCoords: [number, number][] = validStops.map((s) => [
    s.place.coordinates.lat,
    s.place.coordinates.lng,
  ]);

  // Generate Google Maps Multi-Stop directions link
  const generateGoogleMapsRouteUrl = () => {
    if (validStops.length < 2) {
      if (validStops.length === 1) return validStops[0].place.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${validStops[0].place.coordinates.lat},${validStops[0].place.coordinates.lng}`;
      return 'https://www.google.com/maps';
    }

    const origin = `${validStops[0].place.coordinates.lat},${validStops[0].place.coordinates.lng}`;
    const destination = `${validStops[validStops.length - 1].place.coordinates.lat},${validStops[validStops.length - 1].place.coordinates.lng}`;
    const waypoints = validStops
      .slice(1, -1)
      .map((s) => `${s.place.coordinates.lat},${s.place.coordinates.lng}`)
      .join('|');

    let url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
    if (waypoints) {
      url += `&waypoints=${encodeURIComponent(waypoints)}`;
    }
    return url;
  };

  return (
    <div className="w-full h-full min-h-[420px] sm:min-h-[480px] lg:min-h-[580px] relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-cinematic bg-abyss-950">
      {/* Floating Top Left Badge */}
      <div className="absolute top-3.5 start-3.5 z-[400] flex items-center gap-2">
        <div className="px-3.5 py-1.5 rounded-xl bg-abyss-950/90 backdrop-blur-xl border border-gold-500/40 text-gold-300 text-xs font-black shadow-glow-gold flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-coral-400" />
          <span>
            {language === 'ar'
              ? `📍 مسار الطلعة المباشر • ${validStops.length} محطات`
              : `📍 Live Route • ${validStops.length} Stops`}
          </span>
        </div>
      </div>

      {/* Floating Top Right Multi-Stop Google Maps Route Button */}
      <div className="absolute top-3.5 end-3.5 z-[400]">
        <a
          href={generateGoogleMapsRouteUrl()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => soundEngine.playClick()}
          className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-abyss-900/90 hover:bg-abyss-800 border border-teal-400/40 hover:border-gold-400/60 text-pearl text-xs font-black shadow-lg flex items-center gap-1.5 transition-all cursor-pointer touch-manipulation active:scale-95"
          title="فتح المسار الكامل في خرائط جوجل"
        >
          <Navigation className="w-3.5 h-3.5 text-teal-300" />
          <span>{language === 'ar' ? 'مسار Google Maps' : 'Google Maps Route'}</span>
          <ExternalLink className="w-3 h-3 text-gold-400" />
        </a>
      </div>

      <MapContainer
        center={polylineCoords[0] || center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
      >
        {/* CartoDB Dark Matter Fast Free Base Tiles (No API key needed) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
        />

        <MapBoundsUpdater stops={validStops} />

        {/* Connected Glowing Route Line */}
        {showPolyline && polylineCoords.length > 1 && (
          <Polyline
            positions={polylineCoords}
            pathOptions={{
              color: '#1D8C88',
              weight: 4,
              opacity: 0.9,
              dashArray: '8, 8',
            }}
          />
        )}

        {/* Numbered Interactive Pins */}
        {validStops.map((stop, idx) => {
          const orderNum = stop.order || idx + 1;
          const isHovered = hoveredIdx === idx;
          const icon = createNumberedGlowingPin(orderNum, isHovered);

          return (
            <Marker
              key={`${stop.place.id}-${idx}`}
              position={[stop.place.coordinates.lat, stop.place.coordinates.lng]}
              icon={icon}
              eventHandlers={{
                mouseover: () => setHoveredIdx(idx),
                mouseout: () => setHoveredIdx(null),
                click: () => soundEngine.playClick(),
              }}
            >
              <Popup>
                <div className="p-2 text-start font-sans min-w-[200px] max-w-[240px] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-black">
                    <span className="px-2 py-0.5 rounded bg-gold-500 text-abyss-950">
                      #{orderNum} • {stop.timeSlot || `${4 + idx * 2}:00 PM`}
                    </span>
                    <span className="text-teal-300">
                      {stop.place.averageCostSAR > 0
                        ? `${stop.place.averageCostSAR} ر.س`
                        : (language === 'ar' ? 'مجاني' : 'Free')}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-pearl leading-tight pt-1">
                    {language === 'ar' ? stop.place.nameAr : stop.place.nameEn}
                  </h4>

                  <p className="text-[11px] text-pearl-muted line-clamp-1">
                    {language === 'ar' ? stop.place.districtNameAr : stop.place.districtNameEn}
                  </p>

                  <a
                    href={stop.place.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${stop.place.coordinates.lat},${stop.place.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 w-full py-1.5 px-3 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>{language === 'ar' ? 'توجيه عبر الخريطة' : 'Get Directions'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default LeafletMapContent;
