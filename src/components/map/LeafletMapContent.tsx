'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Place } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';
import { Navigation, MapPin, ExternalLink, Crosshair, Clock, Coins } from 'lucide-react';
import { soundEngine } from '@/utils/audioEngine';
import { getAssetUrl } from '@/utils/paths';
import { useItineraryStore } from '@/store/useItineraryStore';

interface MapStop {
  place: Place;
  order?: number;
  timeSlot?: string;
}

export interface LeafletMapContentProps {
  stops: MapStop[];
  center?: [number, number];
  zoom?: number;
  showPolyline?: boolean;
  activeStopIdx?: number | null;
  hoveredStopIdx?: number | null;
  onSelectStop?: (idx: number) => void;
  onHoverStop?: (idx: number | null) => void;
  routeBadge?: string;
}

type MapStyleKey = 'dark' | 'streets' | 'satellite';

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
  dark: {
    nameAr: 'ليلي',
    nameEn: 'Dark',
    icon: '✨',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abc',
    maxZoom: 19,
  },
  streets: {
    nameAr: 'شوارع',
    nameEn: 'Streets',
    icon: '🗺️',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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
};

// Strips English parentheses like (Beach Resort ...) to leave clean Arabic name
function getCleanPlaceName(rawName: string): string {
  if (!rawName) return '';
  return rawName.replace(/\s*\(.*?\)\s*/g, '').trim();
}

// Custom Numbered Glowing Pin Maker with Place Name Badge & Active Pulse Ring
function createNumberedGlowingPin(
  order: number,
  rawName: string,
  isHovered: boolean = false,
  isActive: boolean = false
): L.DivIcon {
  const isHighlighted = isHovered || isActive;
  const cleanName = getCleanPlaceName(rawName);

  return L.divIcon({
    className: 'custom-leaflet-pin-wrapper',
    html: `
      <div style="
        display: inline-flex;
        align-items: center;
        gap: 8px;
        pointer-events: auto;
        white-space: nowrap;
        user-select: none;
        transform: ${isHighlighted ? 'scale(1.12) translateY(-2px)' : 'scale(1)'};
        transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
        z-index: ${isHighlighted ? '9999' : '100'};
      ">
        <div style="
          position: relative;
          width: ${isHighlighted ? '38px' : '32px'};
          height: ${isHighlighted ? '38px' : '32px'};
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: width 0.2s, height 0.2s;
        ">
          <!-- Animated Pulse Halo for Active / Hovered Stop -->
          <div style="
            position: absolute;
            inset: -7px;
            border-radius: 50%;
            background: ${isHighlighted ? 'rgba(212, 175, 55, 0.6)' : 'rgba(212, 175, 55, 0.2)'};
            animation: ping ${isHighlighted ? '1.5s' : '3s'} cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          
          <!-- Outer Specular Ring -->
          <div style="
            position: absolute;
            inset: -2px;
            border-radius: 50%;
            border: ${isHighlighted ? '2px solid #F5D07A' : '1.5px solid rgba(212, 175, 55, 0.6)'};
            box-shadow: 0 0 20px ${isHighlighted ? 'rgba(212, 175, 55, 0.95)' : 'rgba(212, 175, 55, 0.35)'};
          "></div>

          <!-- Metallic Golden Coin Marker -->
          <div style="
            position: relative;
            background: ${
              isHighlighted
                ? 'linear-gradient(135deg, #FFF6D6 0%, #F5D07A 40%, #D4AF37 70%, #996F0E 100%)'
                : 'linear-gradient(135deg, #F5D07A 0%, #D4AF37 50%, #AA7C11 100%)'
            };
            width: 100%;
            height: 100%;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #FFFFFF;
            box-shadow: 0 8px 24px rgba(0,0,0,0.9), 0 0 16px rgba(212,175,55,0.7);
            color: #06090F;
            font-weight: 900;
            font-size: ${isHighlighted ? '14px' : '12px'};
            letter-spacing: -0.5px;
          ">
            ${order}
          </div>
        </div>

        <!-- Glass Station Name Badge: Clean Arabic Name without truncation -->
        <div style="
          background: rgba(10, 14, 24, 0.94);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid ${isHighlighted ? 'rgba(245, 208, 122, 0.95)' : 'rgba(212, 175, 55, 0.4)'};
          border-radius: 12px;
          padding: 4px 12px;
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 800;
          box-shadow: 0 10px 28px rgba(0,0,0,0.85);
          white-space: nowrap;
          line-height: 1.3;
        ">
          ${cleanName}
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -26],
  });
}

// Resilient Map Dimensions, Bounds & FlyTo Auto-Controller
function MapController({
  stops,
  triggerReset,
  activeStopIdx,
  hoveredStopIdx,
}: {
  stops: MapStop[];
  triggerReset: number;
  activeStopIdx?: number | null;
  hoveredStopIdx?: number | null;
}) {
  const map = useMap();
  const focusedStopCoords = useItineraryStore((state) => state.focusedStopCoords);

  // Smooth flyTo when user hovers or clicks a specific stop in the timeline
  useEffect(() => {
    const targetIdx = hoveredStopIdx ?? activeStopIdx;
    if (typeof targetIdx === 'number' && stops[targetIdx]?.place?.coordinates) {
      const coords = stops[targetIdx].place.coordinates;
      if (typeof coords.lat === 'number' && typeof coords.lng === 'number') {
        try {
          map.flyTo([coords.lat, coords.lng], 15, {
            duration: 1.1,
            easeLinearity: 0.25,
          });
        } catch (err) {
          console.warn('Map flyTo station warning:', err);
        }
      }
    }
  }, [hoveredStopIdx, activeStopIdx, stops, map]);

  // Smooth flyTo when user inspects via global store focusedStopCoords
  useEffect(() => {
    if (focusedStopCoords && typeof focusedStopCoords[0] === 'number') {
      try {
        map.flyTo(focusedStopCoords, 15, {
          duration: 1.2,
          easeLinearity: 0.25,
        });
      } catch (err) {
        console.warn('Map flyTo warning:', err);
      }
    }
  }, [focusedStopCoords, map]);

  // Fit bounds when stops change or when user clicks recenter
  useEffect(() => {
    const validCoords = stops
      .filter((s) => s.place?.coordinates?.lat && s.place?.coordinates?.lng)
      .map((s) => [s.place.coordinates.lat, s.place.coordinates.lng] as [number, number]);

    const updateMap = () => {
      try {
        map.invalidateSize();

        if (validCoords.length >= 2) {
          const bounds = L.latLngBounds(validCoords);
          map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15, animate: true });
        } else if (validCoords.length === 1) {
          map.setView(validCoords[0], 14, { animate: true });
        } else {
          map.setView([21.5433, 39.1728], 12, { animate: true });
        }
      } catch (err) {
        console.warn('MapController update warning:', err);
      }
    };

    updateMap();
    const t1 = setTimeout(updateMap, 150);
    const t2 = setTimeout(updateMap, 450);

    const onResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', onResize);
    };
  }, [stops, triggerReset, map]);

  return null;
}

export const LeafletMapContent: React.FC<LeafletMapContentProps> = ({
  stops,
  center = [21.5433, 39.1728],
  zoom = 12,
  showPolyline = true,
  activeStopIdx,
  hoveredStopIdx,
  onSelectStop,
  onHoverStop,
  routeBadge,
}) => {
  const { language } = useLanguage();
  const focusedStopId = useItineraryStore((state) => state.focusedStopId);
  const [internalHoverIdx, setInternalHoverIdx] = useState<number | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyleKey>('dark');
  const [recenterCount, setRecenterCount] = useState<number>(0);

  const cycleMapStyle = () => {
    soundEngine.playClick();
    const styleKeys: MapStyleKey[] = ['dark', 'streets', 'satellite'];
    const currentIdx = styleKeys.indexOf(mapStyle);
    const nextIdx = (currentIdx + 1) % styleKeys.length;
    setMapStyle(styleKeys[nextIdx]);
  };

  const effectiveHoverIdx = hoveredStopIdx !== undefined && hoveredStopIdx !== null ? hoveredStopIdx : internalHoverIdx;

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
    <div className="w-full h-full min-h-[360px] sm:min-h-[440px] relative rounded-[28px] lg:rounded-[2.5rem] overflow-hidden shadow-2xl bg-[#06090F]">
      {/* VIGNETTE / INNER SHADOW OVERLAY: Blends map edges smoothly into deep dark background */}
      <div className="pointer-events-none absolute inset-0 z-[380] shadow-[inset_0_0_55px_rgba(6,9,15,0.92)] rounded-[28px] lg:rounded-[2.5rem]" />

      {/* 1. DESKTOP FLOATING HUD: Ultra-Clean & Minimal (< 1024px hidden) */}
      <div className="hidden lg:flex absolute top-3.5 end-3.5 z-[400] items-center gap-1.5 pointer-events-auto">
        {/* Style Pills */}
        <div className="flex items-center p-1 rounded-xl bg-[#0A0D14]/92 backdrop-blur-xl border border-white/15 shadow-[0_10px_28px_rgba(0,0,0,0.85)] gap-1">
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
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-[11px] leading-none">{tile.icon}</span>
                <span>{language === 'ar' ? tile.nameAr : tile.nameEn}</span>
              </button>
            );
          })}
        </div>

        {/* Recenter Button (Icon only) */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setRecenterCount((c) => c + 1);
          }}
          className="w-8 h-8 rounded-xl bg-[#0A0D14]/92 hover:bg-[#141A28] backdrop-blur-xl border border-white/15 hover:border-amber-400/50 text-amber-400 transition-all shadow-[0_10px_28px_rgba(0,0,0,0.85)] cursor-pointer flex items-center justify-center shrink-0 active:scale-95"
          title={language === 'ar' ? 'إعادة تركيز الخريطة' : 'Recenter Route'}
          aria-label="Recenter map"
        >
          <Crosshair className="w-3.5 h-3.5" />
        </button>

        {/* Google Maps Button (Icon only) */}
        <a
          href={generateGoogleMapsRouteUrl()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => soundEngine.playClick()}
          className="w-8 h-8 rounded-xl bg-[#0A0D14]/92 hover:bg-[#0D241E] backdrop-blur-xl border border-emerald-400/50 hover:border-emerald-300 text-emerald-300 hover:text-emerald-200 transition-all shadow-[0_10px_28px_rgba(0,0,0,0.85)] flex items-center justify-center cursor-pointer shrink-0 active:scale-95"
          title={language === 'ar' ? 'فتح المسار في Google Maps' : 'Open in Google Maps'}
          aria-label="Open route in Google Maps"
        >
          <Navigation className="w-3.5 h-3.5 text-emerald-400" />
        </a>
      </div>

      {/* 2. MOBILE APPLE MAPS FLOATING ACTION HUD: Minimal Circular Buttons (< 1024px) */}
      <div className="flex lg:hidden absolute top-3 end-3 z-[400] items-center gap-2 pointer-events-auto">
        {/* Circular Map Style Toggle Button */}
        <button
          type="button"
          onClick={cycleMapStyle}
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#16181D]/80 backdrop-blur-2xl saturate-150 border border-white/[0.15] text-amber-300 shadow-[0_8px_24px_rgba(0,0,0,0.5)] flex items-center justify-center text-base active:scale-95 transition-transform cursor-pointer"
          title={language === 'ar' ? `نمط: ${currentTileConfig.nameAr}` : `Style: ${currentTileConfig.nameEn}`}
          aria-label="Toggle map style"
        >
          <span className="select-none leading-none">{currentTileConfig.icon}</span>
        </button>

        {/* Circular Recenter Button */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setRecenterCount((c) => c + 1);
          }}
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#16181D]/80 backdrop-blur-2xl saturate-150 border border-white/[0.15] text-amber-300 shadow-[0_8px_24px_rgba(0,0,0,0.5)] flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
          title={language === 'ar' ? 'إعادة تركيز الخريطة' : 'Recenter Route'}
          aria-label="Recenter map"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        {/* Circular Google Maps Shortcut */}
        <a
          href={generateGoogleMapsRouteUrl()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => soundEngine.playClick()}
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#16181D]/80 backdrop-blur-2xl saturate-150 border border-emerald-400/40 text-emerald-400 shadow-[0_8px_24px_rgba(0,0,0,0.5)] flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
          title={language === 'ar' ? 'فتح المسار في Google Maps' : 'Open in Google Maps'}
          aria-label="Open route in Google Maps"
        >
          <Navigation className="w-4 h-4" />
        </a>
      </div>

      <MapContainer
        key={`map-container-${mapStyle}`}
        center={polylineCoords[0] || center}
        zoom={zoom}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ width: '100%', height: '100%', minHeight: '360px' }}
        className={`w-full h-full min-h-[360px] sm:min-h-[440px] z-10 ${mapStyle === 'dark' ? 'leaflet-map-dark-luxury' : ''}`}
      >
        {/* Free, Reliable TileLayer without ANY API key or watermark */}
        <TileLayer
          key={mapStyle}
          attribution={currentTileConfig.attribution}
          url={currentTileConfig.url}
          subdomains={currentTileConfig.subdomains}
          maxZoom={currentTileConfig.maxZoom}
        />

        <MapController
          stops={validStops}
          triggerReset={recenterCount}
          activeStopIdx={activeStopIdx}
          hoveredStopIdx={effectiveHoverIdx}
        />

        {/* Connected Glowing Luxury Route Line (Dual Layer: Ambient Glow + Radiant Moving Core) */}
        {showPolyline && polylineCoords.length > 1 && (
          <>
            {/* Outer Halo Glow */}
            <Polyline
              positions={polylineCoords}
              pathOptions={{
                color: '#AA7C11',
                weight: 8,
                opacity: 0.35,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
            {/* Core Animated Dashed Golden Line */}
            <Polyline
              positions={polylineCoords}
              pathOptions={{
                color: '#F5D07A',
                weight: 4,
                opacity: 0.95,
                lineCap: 'round',
                lineJoin: 'round',
                dashArray: '10 10',
                className: 'leaflet-animated-polyline',
              }}
            />
          </>
        )}

        {/* Numbered Interactive Pins with Location Names */}
        {validStops.map((stop, idx) => {
          const orderNum = stop.order || idx + 1;
          const isHovered = effectiveHoverIdx === idx;
          const isActive = activeStopIdx === idx;
          const isFocused = focusedStopId === stop.place.id;
          const rawName = language === 'ar' ? stop.place.nameAr : stop.place.nameEn;
          const cleanName = getCleanPlaceName(rawName);
          const icon = createNumberedGlowingPin(orderNum, rawName, isHovered, isActive || isFocused);

          return (
            <Marker
              key={`${stop.place.id}-${idx}`}
              position={[stop.place.coordinates.lat, stop.place.coordinates.lng]}
              icon={icon}
              eventHandlers={{
                mouseover: () => {
                  setInternalHoverIdx(idx);
                  onHoverStop?.(idx);
                },
                mouseout: () => {
                  setInternalHoverIdx(null);
                  onHoverStop?.(null);
                },
                click: () => {
                  soundEngine.playClick();
                  onSelectStop?.(idx);
                },
              }}
            >
              <Popup className="custom-luxury-popup">
                <div className="p-2 text-start font-sans min-w-[230px] max-w-[270px] space-y-2 select-none">
                  {/* Photo Thumbnail */}
                  {stop.place.imageUrl && (
                    <img
                      src={getAssetUrl(stop.place.imageUrl)}
                      alt={cleanName}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-24 object-cover rounded-xl border border-white/10"
                    />
                  )}

                  <div className="flex items-center justify-between text-[11px] font-black">
                    <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-stone-950 font-black">
                      المحطة #{orderNum} • {stop.timeSlot || `${4 + idx * 2}:00 PM`}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {stop.place.averageCostSAR > 0
                        ? `${stop.place.averageCostSAR} ر.س`
                        : (language === 'ar' ? 'مجاني' : 'Free')}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-white leading-tight">
                    {cleanName}
                  </h4>

                  <div className="flex items-center gap-2 text-[11px] text-white/80">
                    <span className="flex items-center gap-1 text-[#E5C378] font-bold">
                      <Clock className="w-3 h-3" />
                      <span>{stop.place.dwellTimeMinutes || stop.place.durationMinutes || 60} {language === 'ar' ? 'دقيقة' : 'mins'}</span>
                    </span>
                    <span>•</span>
                    <span className="text-white/70">
                      {language === 'ar' ? stop.place.districtNameAr : stop.place.districtNameEn}
                    </span>
                  </div>

                  <a
                    href={
                      stop.place.googleMapsUrl ||
                      `https://www.google.com/maps/search/?api=1&query=${stop.place.coordinates.lat},${stop.place.coordinates.lng}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 transition-all"
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
