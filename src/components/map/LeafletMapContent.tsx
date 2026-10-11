'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Place } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';
import { Navigation, MapPin, ExternalLink, Layers, Crosshair, Clock, Coins } from 'lucide-react';
import { soundEngine } from '@/utils/audioEngine';
import { getAssetUrl } from '@/utils/paths';

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

type MapStyleKey = 'streets' | 'satellite' | 'topo';

const MAP_TILES: Record<
  MapStyleKey,
  {
    nameAr: string;
    nameEn: string;
    icon: string;
    url: string;
    attribution: string;
    subdomains: string;
    maxZoom: number;
  }
> = {
  streets: {
    nameAr: 'شوارع ومعالم',
    nameEn: 'Streets',
    icon: '🗺️',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    subdomains: 'abc',
    maxZoom: 19,
  },
  satellite: {
    nameAr: 'قمر صناعي',
    nameEn: 'Satellite',
    icon: '🛰️',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri World Imagery',
    subdomains: '',
    maxZoom: 19,
  },
  topo: {
    nameAr: 'تضاريس وساحل',
    nameEn: 'Coast Topo',
    icon: '🌊',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri World Topo',
    subdomains: '',
    maxZoom: 19,
  },
};

// Custom Numbered Glowing Pin Maker with Place Name Badge
function createNumberedGlowingPin(order: number, nameAr: string, isHovered: boolean = false): L.DivIcon {
  return L.divIcon({
    className: 'custom-leaflet-pin-wrapper',
    html: `
      <div style="
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transform: translate(-18px, -18px);
        pointer-events: auto;
        white-space: nowrap;
      ">
        <div style="
          position: relative;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        ">
          <div style="
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            background: ${isHovered ? 'rgba(245, 158, 11, 0.6)' : 'rgba(245, 158, 11, 0.35)'};
            animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <div style="
            position: relative;
            background: ${isHovered ? 'linear-gradient(135deg, #FBBF24, #F59E0B)' : 'linear-gradient(135deg, #F59E0B, #D97706)'};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2.5px solid #ffffff;
            box-shadow: 0 4px 14px rgba(0,0,0,0.7), 0 0 12px rgba(245,158,11,0.6);
            color: #090B0E;
            font-weight: 900;
            font-size: 13px;
            font-family: inherit;
          ">
            ${order}
          </div>
        </div>
        <div style="
          background: rgba(9, 11, 14, 0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(245, 158, 11, 0.45);
          border-radius: 10px;
          padding: 3px 8px;
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          box-shadow: 0 6px 18px rgba(0,0,0,0.6);
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
        ">
          ${nameAr}
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

// Map Bounds Auto-Fitter component
function MapBoundsUpdater({ stops, triggerReset }: { stops: MapStop[]; triggerReset: number }) {
  const map = useMap();

  useEffect(() => {
    if (stops.length > 0) {
      const validCoords = stops
        .filter((s) => s.place?.coordinates?.lat && s.place?.coordinates?.lng)
        .map((s) => [s.place.coordinates.lat, s.place.coordinates.lng] as [number, number]);

      if (validCoords.length > 0) {
        const bounds = L.latLngBounds(validCoords);
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
      }
    }
  }, [stops, triggerReset, map]);

  return null;
}

export const LeafletMapContent: React.FC<LeafletMapContentProps> = ({
  stops,
  center = [21.5433, 39.1728],
  zoom = 12,
  showPolyline = true,
}) => {
  const { language } = useLanguage();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyleKey>('streets');
  const [recenterCount, setRecenterCount] = useState<number>(0);

  const validStops = useMemo(
    () => stops.filter((s) => s.place && s.place.coordinates && typeof s.place.coordinates.lat === 'number'),
    [stops]
  );

  const polylineCoords: [number, number][] = useMemo(
    () => validStops.map((s) => [s.place.coordinates.lat, s.place.coordinates.lng]),
    [validStops]
  );

  // Generate Google Maps Multi-Stop directions link
  const generateGoogleMapsRouteUrl = () => {
    if (validStops.length < 2) {
      if (validStops.length === 1) {
        return (
          validStops[0].place.googleMapsUrl ||
          `https://www.google.com/maps/search/?api=1&query=${validStops[0].place.coordinates.lat},${validStops[0].place.coordinates.lng}`
        );
      }
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

  const currentTileConfig = MAP_TILES[mapStyle];

  return (
    <div className="w-full h-full min-h-[420px] sm:min-h-[480px] lg:min-h-[580px] relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl bg-[#080B10]">
      {/* FLOATING TOP BAR: Route Info Badge + Map Style Switcher + Recenter + Google Maps Route */}
      <div className="absolute top-3.5 inset-x-3.5 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left Side: Route Badge & Recenter Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#090C12]/92 backdrop-blur-xl border border-gold-500/40 text-gold-300 text-xs font-black shadow-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {language === 'ar'
                ? `📍 مسار جدة المباشر • ${validStops.length} محطات`
                : `📍 Live Route • ${validStops.length} Stops`}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setRecenterCount((c) => c + 1);
            }}
            className="p-2 rounded-xl bg-[#090C12]/92 hover:bg-[#161B24] border border-white/15 text-white/80 hover:text-white transition-all shadow-lg cursor-pointer"
            title={language === 'ar' ? 'إعادة تركيز الخريطة على كامل المسار' : 'Recenter map'}
          >
            <Crosshair className="w-3.5 h-3.5 text-gold-400" />
          </button>
        </div>

        {/* Right Side: 3-Layer Map Style Switcher & External Route Link */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Map Style Pills */}
          <div className="flex items-center p-1 rounded-xl bg-[#090C12]/92 backdrop-blur-xl border border-white/15 shadow-lg">
            {(Object.keys(MAP_TILES) as MapStyleKey[]).map((key) => {
              const tile = MAP_TILES[key];
              const isSelected = mapStyle === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setMapStyle(key);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-gold-500 text-stone-950 font-black shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{tile.icon}</span>
                  <span className="hidden sm:inline">{language === 'ar' ? tile.nameAr : tile.nameEn}</span>
                </button>
              );
            })}
          </div>

          {/* Google Maps Multi-Stop Link */}
          <a
            href={generateGoogleMapsRouteUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundEngine.playClick()}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500/20 to-teal-600/20 hover:from-teal-500/30 hover:to-teal-600/30 border border-teal-400/40 text-teal-200 text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
            title="فتح المسار في خرائط جوجل"
          >
            <Navigation className="w-3.5 h-3.5 text-teal-300" />
            <span className="hidden sm:inline">{language === 'ar' ? 'خرائط Google' : 'Google Maps'}</span>
            <ExternalLink className="w-3 h-3 text-teal-400" />
          </a>
        </div>

      </div>

      <MapContainer
        center={polylineCoords[0] || center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
      >
        {/* Crystal Clear TileLayer with dynamic switcher and NO API keys */}
        <TileLayer
          key={mapStyle}
          attribution={currentTileConfig.attribution}
          url={currentTileConfig.url}
          subdomains={currentTileConfig.subdomains}
          maxZoom={currentTileConfig.maxZoom}
        />

        <MapBoundsUpdater stops={validStops} triggerReset={recenterCount} />

        {/* Connected Glowing Luxury Route Line (Dual Layer: Ambient Glow + Radiant Core) */}
        {showPolyline && polylineCoords.length > 1 && (
          <>
            {/* Outer Halo Glow */}
            <Polyline
              positions={polylineCoords}
              pathOptions={{
                color: '#F59E0B',
                weight: 8,
                opacity: 0.35,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
            {/* Core Solid Line */}
            <Polyline
              positions={polylineCoords}
              pathOptions={{
                color: '#FBBF24',
                weight: 4,
                opacity: 0.95,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </>
        )}

        {/* Numbered Interactive Pins with Location Names */}
        {validStops.map((stop, idx) => {
          const orderNum = stop.order || idx + 1;
          const isHovered = hoveredIdx === idx;
          const placeName = language === 'ar' ? stop.place.nameAr : stop.place.nameEn;
          const icon = createNumberedGlowingPin(orderNum, placeName, isHovered);

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
              <Popup className="custom-luxury-popup">
                <div className="p-2 text-start font-sans min-w-[220px] max-w-[260px] space-y-2 select-none">
                  {/* Photo Thumbnail */}
                  {stop.place.imageUrl && (
                    <img
                      src={getAssetUrl(stop.place.imageUrl)}
                      alt={placeName}
                      className="w-full h-24 object-cover rounded-xl border border-white/10"
                    />
                  )}

                  <div className="flex items-center justify-between text-[11px] font-black">
                    <span className="px-2 py-0.5 rounded-lg bg-gold-500 text-stone-950 font-bold">
                      المحطة #{orderNum} • {stop.timeSlot || `${4 + idx * 2}:00 PM`}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {stop.place.averageCostSAR > 0
                        ? `${stop.place.averageCostSAR} ر.س`
                        : (language === 'ar' ? 'مجاني' : 'Free')}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-white leading-tight">
                    {placeName}
                  </h4>

                  <p className="text-[11px] text-white/70">
                    {language === 'ar' ? stop.place.districtNameAr : stop.place.districtNameEn}
                  </p>

                  <a
                    href={
                      stop.place.googleMapsUrl ||
                      `https://www.google.com/maps/search/?api=1&query=${stop.place.coordinates.lat},${stop.place.coordinates.lng}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 transition-all"
                  >
                    <span>{language === 'ar' ? 'فتح في خرائط جوجل' : 'Open in Google Maps'}</span>
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
