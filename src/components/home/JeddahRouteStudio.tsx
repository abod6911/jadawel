'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  MapPin,
  Clock,
  Coins,
  Navigation,
  ExternalLink,
  Sparkles,
  Car,
  Waves,
  Landmark,
  Palmtree,
  Coffee,
} from 'lucide-react';
import { RouteMap } from '@/components/map/RouteMap';
import { JEDDAH_PLACES } from '@/data/jeddah-places';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { soundEngine } from '@/utils/audioEngine';
import { getAssetUrl } from '@/utils/paths';
import { BorderBeam } from '@/components/fancy/BorderBeam';
import { Place } from '@/types';

interface CuratedStudioRoute {
  id: string;
  curatedPlanId: string;
  titleAr: string;
  titleEn: string;
  shortTitleAr: string;
  shortTitleEn: string;
  shortBadgeAr: string;
  shortBadgeEn: string;
  badgeAr: string;
  badgeEn: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  borderColor: string;
  bgGlow: string;
  placeSlugsOrIds: string[];
  totalDurationAr: string;
  totalDurationEn: string;
  estimatedCostSAR: number;
  cleanTransitAr: string;
  cleanTransitEn: string;
}

const STUDIO_ROUTES: CuratedStudioRoute[] = [
  {
    id: 'obhur-yachts',
    curatedPlanId: 'luxury-red-sea-yacht',
    titleAr: 'مسار يخوت وشواطئ أبحر',
    titleEn: 'Obhur Yacht & Beach Route',
    shortTitleAr: 'يخوت وشواطئ أبحر',
    shortTitleEn: 'Obhur Yachts',
    badgeAr: 'فاخر VIP',
    badgeEn: 'VIP Luxury',
    shortBadgeAr: 'VIP',
    shortBadgeEn: 'VIP',
    icon: Waves,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    bgGlow: 'from-amber-500/10 via-amber-500/5 to-transparent',
    placeSlugsOrIds: [
      'indigo-beach-resort',
      'jeddah-yacht-club',
      'twina-seafood-lounge',
    ],
    totalDurationAr: '5.5 ساعات',
    totalDurationEn: '5.5 Hours',
    estimatedCostSAR: 480,
    cleanTransitAr: '18 دقيقة بين المحطات',
    cleanTransitEn: '18 min drive',
  },
  {
    id: 'historic-balad',
    curatedPlanId: 'heritage-and-digital-art',
    titleAr: 'مسار رواشين البلد وتيم لاب',
    titleEn: 'Historic Balad & teamLab',
    shortTitleAr: 'رواشين البلد وتيم لاب',
    shortTitleEn: 'Balad & teamLab',
    badgeAr: 'يونسكو وتراث',
    badgeEn: 'UNESCO Heritage',
    shortBadgeAr: 'تراث',
    shortBadgeEn: 'Heritage',
    icon: Landmark,
    color: 'text-gold-400',
    borderColor: 'border-gold-500/40',
    bgGlow: 'from-gold-500/10 via-gold-500/5 to-transparent',
    placeSlugsOrIds: [
      'teamlab-borderless-jeddah',
      'historic-balad-open-trail',
      'bait-nassif-balad',
      'medd-cafe-alrawdah',
    ],
    totalDurationAr: '4.5 ساعات',
    totalDurationEn: '4.5 Hours',
    estimatedCostSAR: 195,
    cleanTransitAr: 'مسار مشي خفيف',
    cleanTransitEn: 'Short walking trail',
  },
  {
    id: 'corniche-icons',
    curatedPlanId: 'family-coastal-adventure',
    titleAr: 'مسار الكورنيش والترفيه',
    titleEn: 'Corniche & Waterfront',
    shortTitleAr: 'الكورنيش والترفيه',
    shortTitleEn: 'Corniche Icons',
    badgeAr: 'أيقوني وعائلي',
    badgeEn: 'Iconic & Family',
    shortBadgeAr: 'عائلي',
    shortBadgeEn: 'Family',
    icon: Palmtree,
    color: 'text-teal-400',
    borderColor: 'border-teal-400/40',
    bgGlow: 'from-teal-500/10 via-teal-500/5 to-transparent',
    placeSlugsOrIds: [
      'north-corniche-waterfront',
      'al-shallal-theme-park',
      'king-fahd-fountain',
    ],
    totalDurationAr: '4 ساعات',
    totalDurationEn: '4 Hours',
    estimatedCostSAR: 160,
    cleanTransitAr: '12 دقيقة بين المحطات',
    cleanTransitEn: '12 min drive',
  },
  {
    id: 'rawdah-coffee',
    curatedPlanId: 'specialty-coffee-and-arts-trail',
    titleAr: 'مسار مقاهي وفنون الروضة',
    titleEn: 'Al-Rawdah Coffee & Arts',
    shortTitleAr: 'مقاهي وفنون الروضة',
    shortTitleEn: 'Coffee & Arts',
    badgeAr: 'عشاق القهوة',
    badgeEn: 'Coffee Lovers',
    shortBadgeAr: 'قهوة',
    shortBadgeEn: 'Coffee',
    icon: Coffee,
    color: 'text-rose-400',
    borderColor: 'border-rose-400/40',
    bgGlow: 'from-rose-500/10 via-rose-500/5 to-transparent',
    placeSlugsOrIds: [
      'caffe-bene-rawdah',
      'hayy-jameel-arts',
      'san-carlo-cicchetti',
    ],
    totalDurationAr: '3.5 ساعات',
    totalDurationEn: '3.5 Hours',
    estimatedCostSAR: 210,
    cleanTransitAr: '8 دقائق بين المحطات',
    cleanTransitEn: '8 min drive',
  },
];

export const JeddahRouteStudio: React.FC = () => {
  const { language } = useLanguage();
  const [activeRouteId, setActiveRouteId] = useState<string>(STUDIO_ROUTES[0].id);
  const [selectedStopIdx, setSelectedStopIdx] = useState<number>(0);
  const [hoveredStopIdx, setHoveredStopIdx] = useState<number | null>(null);

  // References for mobile horizontal carousel
  const carouselRef = useRef<HTMLDivElement>(null);
  const stopCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isProgrammaticScroll = useRef<boolean>(false);

  const loadCuratedPlan = useItineraryStore((state) => state.loadCuratedPlan);
  const setActiveNavTab = useItineraryStore((state) => state.setActiveNavTab);

  const activeRoute = useMemo(() => {
    return STUDIO_ROUTES.find((r) => r.id === activeRouteId) || STUDIO_ROUTES[0];
  }, [activeRouteId]);

  // Resolve Place objects from JEDDAH_PLACES
  const stops = useMemo(() => {
    const list: { place: Place; order: number; timeSlot: string }[] = [];
    activeRoute.placeSlugsOrIds.forEach((idOrSlug, index) => {
      let found = JEDDAH_PLACES.find(
        (p) => p.id === idOrSlug || p.slug === idOrSlug
      );
      if (!found) {
        const cleanSlug = idOrSlug.toLowerCase();
        found = JEDDAH_PLACES.find(
          (p) => p.slug.toLowerCase().includes(cleanSlug) || cleanSlug.includes(p.slug.toLowerCase())
        );
      }
      if (found) {
        list.push({
          place: found,
          order: index + 1,
          timeSlot: `المحطة ${index + 1}`,
        });
      }
    });
    return list;
  }, [activeRoute]);

  // Scroll active mobile stop card smoothly into view
  const scrollToStopCard = useCallback((idx: number) => {
    isProgrammaticScroll.current = true;
    const target = stopCardRefs.current[idx];
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 500);
  }, []);

  // Listen to mobile carousel horizontal scroll to dynamically track active stop
  const handleCarouselScroll = useCallback(() => {
    if (!carouselRef.current || isProgrammaticScroll.current) return;
    const container = carouselRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestIdx = 0;
    let minDiff = Infinity;

    stopCardRefs.current.forEach((el, idx) => {
      if (!el) return;
      const cardRect = el.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const diff = Math.abs(cardCenter - containerCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    if (closestIdx !== selectedStopIdx) {
      setSelectedStopIdx(closestIdx);
    }
  }, [selectedStopIdx]);

  // Generate Google Maps Multi-Stop directions link
  const generateGoogleMapsMultiStopUrl = () => {
    if (stops.length < 2) {
      if (stops.length === 1 && stops[0].place.coordinates) {
        return `https://www.google.com/maps/search/?api=1&query=${stops[0].place.coordinates.lat},${stops[0].place.coordinates.lng}`;
      }
      return 'https://www.google.com/maps';
    }

    const origin = `${stops[0].place.coordinates.lat},${stops[0].place.coordinates.lng}`;
    const destination = `${stops[stops.length - 1].place.coordinates.lat},${stops[stops.length - 1].place.coordinates.lng}`;
    const waypoints = stops
      .slice(1, -1)
      .map((s) => `${s.place.coordinates.lat},${s.place.coordinates.lng}`)
      .join('|');

    let url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
    if (waypoints) {
      url += `&waypoints=${encodeURIComponent(waypoints)}`;
    }
    return url;
  };

  const handleApplyRoute = () => {
    soundEngine.playSuccess();
    loadCuratedPlan(activeRoute.curatedPlanId);
    setActiveNavTab('timeline');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full rounded-[24px] lg:rounded-[2rem] bg-[#16181D]/75 lg:bg-[#0A0C10]/95 backdrop-blur-2xl saturate-150 lg:saturate-100 border border-white/[0.12] lg:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.45)] lg:shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-4 sm:p-5 lg:p-6 space-y-4 lg:space-y-5 overflow-hidden overflow-x-hidden">
      {/* Animated Traveling Border Laser Beam */}
      <BorderBeam size={320} duration={14} borderWidth={1.5} colorFrom="#F5D07A" colorTo="#D4AF37" />

      {/* Dynamic Background Atmospheric Radial Glow */}
      <div
        className={`absolute -top-32 -right-32 w-80 h-80 rounded-full bg-gradient-to-br ${activeRoute.bgGlow} blur-3xl pointer-events-none transition-all duration-700`}
      />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-gradient-to-tr from-[#D4AF37]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* 1. HEADER DIET: Ultra-Clean, Punchy, Zero-Fluff */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1 text-start">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-black shadow-sm">
              <Compass className="w-3 h-3 text-amber-400" />
              <span>{language === 'ar' ? 'استوديو المسارات' : 'Route Studio'}</span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:inline">
              • {language === 'ar' ? 'مسارات جاهزة بضغطة زر' : 'Curated tracks in 1-click'}
            </p>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {language === 'ar' ? 'مسارات طلعتك المعتمدة' : 'Curated Outing Tracks'}
          </h2>
        </div>

        {/* Global Multi-Stop Navigation Shortcut: Minimal Label */}
        <div className="self-start sm:self-auto shrink-0">
          <a
            href={generateGoogleMapsMultiStopUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundEngine.playClick()}
            className="px-3.5 py-2 rounded-xl bg-[#121620] hover:bg-[#181D2A] border border-[#D4AF37]/45 hover:border-[#D4AF37] text-white text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(212,175,55,0.15)] active:scale-95 group"
          >
            <Navigation className="w-3.5 h-3.5 text-[#D4AF37] group-hover:rotate-12 transition-transform" />
            <span>{language === 'ar' ? 'فتح في الخريطة' : 'Open Map'}</span>
            <ExternalLink className="w-3 h-3 text-[#D4AF37] opacity-75 group-hover:opacity-100" />
          </a>
        </div>
      </div>

      {/* 2. MINIMAL ROUTE TABS: Icon + Short Title + Clean Badge (No repetitive stats) */}
      <div className="relative z-10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar snap-x snap-mandatory px-1 -mx-1 lg:snap-none lg:px-0 lg:mx-0">
        {STUDIO_ROUTES.map((route) => {
          const isActive = route.id === activeRouteId;
          return (
            <button
              key={route.id}
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveRouteId(route.id);
                setSelectedStopIdx(0);
                setHoveredStopIdx(null);
                scrollToStopCard(0);
              }}
              className={`relative snap-center rounded-xl lg:rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-black transition-all flex items-center gap-2.5 shrink-0 cursor-pointer select-none border text-start active:scale-[0.97] duration-150 ${
                isActive
                  ? 'border-amber-500/80 bg-gradient-to-b from-amber-500/15 via-[#161B26] to-[#0E121A] text-white shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)] ring-1 ring-amber-500/40'
                  : 'border-white/10 bg-[#12151C]/80 text-slate-300 hover:text-white hover:bg-[#181D26] hover:border-white/20'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeRouteStudioIndicator"
                  className="absolute inset-0 rounded-xl lg:rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-600/10 -z-10"
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                />
              )}

              <route.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400 animate-pulse' : route.color}`} />

              <span className="leading-snug font-black whitespace-nowrap">
                {language === 'ar' ? route.shortTitleAr : route.shortTitleEn}
              </span>

              <span
                className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap font-black ${
                  isActive
                    ? 'bg-amber-400/20 border-amber-400/50 text-amber-300 shadow-sm'
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                {language === 'ar' ? route.shortBadgeAr : route.shortBadgeEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. MOBILE ARCHITECTURE (< 1024px): Fast-Scan Apple Maps & Horizontal Cards */}
      <div className="flex flex-col lg:hidden space-y-3.5 relative z-10">
        
        {/* Mobile Apple Maps Viewport (h-[390px] sm:h-[430px]) */}
        <div className="relative w-full h-[390px] sm:h-[430px] rounded-[24px] overflow-hidden border border-[#D4AF37]/35 shadow-[0_8px_30px_rgba(0,0,0,0.5)] bg-[#06090F]">
          <BorderBeam size={260} duration={10} borderWidth={1.5} colorFrom="#F5D07A" colorTo="#D4AF37" />
          <RouteMap
            stops={stops}
            className="w-full h-full min-h-[350px]"
            showPolyline={true}
            activeStopIdx={selectedStopIdx}
            hoveredStopIdx={hoveredStopIdx}
            onSelectStop={(idx) => {
              setSelectedStopIdx(idx);
              scrollToStopCard(idx);
            }}
            onHoverStop={(idx) => setHoveredStopIdx(idx)}
            routeBadge={language === 'ar' ? activeRoute.badgeAr : activeRoute.badgeEn}
          />
        </div>

        {/* Compact Stats Strip: Values directly with icons only */}
        <div className="w-full bg-[#16181D]/75 backdrop-blur-2xl saturate-150 border border-white/[0.12] rounded-[18px] py-2 px-3 flex justify-between items-center divide-x divide-x-reverse divide-white/10 shadow-md select-none text-xs font-black">
          <div className="flex-1 flex items-center justify-center gap-1.5 px-2 text-white">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{stops.length} {language === 'ar' ? 'محطات' : 'stops'}</span>
          </div>

          <div className="flex-1 flex items-center justify-center gap-1.5 px-2 text-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{language === 'ar' ? activeRoute.totalDurationAr : activeRoute.totalDurationEn}</span>
          </div>

          <div className="flex-1 flex items-center justify-center gap-1.5 px-2 text-emerald-400">
            <Coins className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>~{activeRoute.estimatedCostSAR} {language === 'ar' ? 'ر.س' : 'SAR'}</span>
          </div>
        </div>

        {/* Apple Maps Horizontal Snap Carousel (Stop Cards) */}
        <div
          ref={carouselRef}
          onScroll={handleCarouselScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-1 pt-0.5 scrollbar-none no-scrollbar px-4 -mx-4 scroll-smooth"
        >
          {stops.map((stop, idx) => {
            const p = stop.place;
            const isSelected = selectedStopIdx === idx;
            const cleanStationName = (language === 'ar' ? p.nameAr : p.nameEn)
              .replace(/\s*\(.*?\)\s*/g, '')
              .trim();

            return (
              <div
                key={`${p.id}-${idx}`}
                ref={(el) => {
                  stopCardRefs.current[idx] = el;
                }}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedStopIdx(idx);
                  scrollToStopCard(idx);
                }}
                className={`w-[86%] shrink-0 snap-center rounded-[20px] p-3 border transition-all cursor-pointer flex items-center gap-3 active:scale-[0.97] duration-150 select-none ${
                  isSelected
                    ? 'bg-[#181D2A] border-amber-500/70 shadow-[0_6px_20px_rgba(212,175,55,0.22)] ring-1 ring-amber-500/40'
                    : 'bg-[#16181D]/75 backdrop-blur-2xl border-white/[0.10] hover:border-white/20'
                }`}
              >
                {/* Thumbnail + Number Badge */}
                <div className="relative shrink-0">
                  <img
                    src={p.imageUrl ? getAssetUrl(p.imageUrl) : getAssetUrl('/images/places/indigo-beach.jpg')}
                    alt={cleanStationName}
                    loading="lazy"
                    decoding="async"
                    className="w-16 h-16 rounded-[16px] object-cover border border-white/10"
                  />
                  <div className="absolute -top-1 -start-1 w-5 h-5 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-stone-950 font-black text-[11px] flex items-center justify-center shadow-md border border-white/40">
                    {idx + 1}
                  </div>
                </div>

                {/* Station Info: Single Clean Line Below Name */}
                <div className="flex-1 min-w-0 space-y-0.5 text-start">
                  <h4 className="text-sm font-black text-white leading-tight truncate">
                    {cleanStationName}
                  </h4>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium pt-0.5 truncate">
                    <span className="text-teal-300 font-bold truncate">
                      {language === 'ar' ? p.districtNameAr : p.districtNameEn}
                    </span>
                    <span>•</span>
                    <span className="text-amber-300 font-bold shrink-0">
                      {p.dwellTimeMinutes || p.durationMinutes || 60} {language === 'ar' ? 'د' : 'min'}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-black shrink-0">
                      {p.averageCostSAR !== undefined && p.averageCostSAR > 0
                        ? `${p.averageCostSAR} ر.س`
                        : (language === 'ar' ? 'مجاني' : 'Free')}
                    </span>
                  </div>
                </div>

                {/* Navigation Shortcut */}
                <a
                  href={
                    p.googleMapsUrl ||
                    `https://www.google.com/maps/search/?api=1&query=${p.coordinates?.lat},${p.coordinates?.lng}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundEngine.playClick();
                  }}
                  className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-white/[0.06] hover:bg-amber-400 hover:text-stone-950 text-amber-400 border border-white/10 shrink-0 transition-all flex items-center justify-center active:scale-95 self-center"
                  title={language === 'ar' ? 'فتح المحطة في Google Maps' : 'Open in Google Maps'}
                  aria-label="Open stop in Google Maps"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 pt-0.5">
          <span className="text-[11px] font-bold text-slate-400">
            {selectedStopIdx + 1} {language === 'ar' ? `من ${stops.length}` : `of ${stops.length}`}
          </span>
          <div className="flex items-center gap-1.5">
            {stops.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => {
                  setSelectedStopIdx(dotIdx);
                  scrollToStopCard(dotIdx);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  selectedStopIdx === dotIdx
                    ? 'w-5 h-1.5 bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.7)]'
                    : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to stop ${dotIdx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Sticky Action Dock */}
        <div className="w-full pt-0.5">
          <button
            type="button"
            onClick={handleApplyRoute}
            className="w-full h-13 py-3.5 rounded-[18px] bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-stone-950 text-sm font-black shadow-[0_4px_20px_rgba(245,158,11,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
          >
            <Sparkles className="w-4 h-4 text-stone-950 shrink-0" />
            <span>{language === 'ar' ? 'اعتماد هذا المسار في خطتي' : 'Load This Route Into My Plan'}</span>
          </button>
        </div>

      </div>

      {/* 4. DESKTOP ARCHITECTURE (lg:grid): Single Viewport Fit & Zero-Clutter HUD */}
      <div className="hidden lg:grid relative z-10 grid-cols-12 gap-5 items-stretch">
        
        {/* PANE 1: Leaflet Route Map (7 Cols) - Unblocked 100% Canvas */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl overflow-hidden border border-[#D4AF37]/35 shadow-xl relative h-[480px] bg-[#06090F]">
          <BorderBeam size={220} duration={10} borderWidth={1.5} colorFrom="#F5D07A" colorTo="#D4AF37" />

          <RouteMap
            stops={stops}
            className="w-full h-full min-h-[480px]"
            showPolyline={true}
            activeStopIdx={selectedStopIdx}
            hoveredStopIdx={hoveredStopIdx}
            onSelectStop={(idx) => setSelectedStopIdx(idx)}
            onHoverStop={(idx) => setHoveredStopIdx(idx)}
            routeBadge={language === 'ar' ? activeRoute.badgeAr : activeRoute.badgeEn}
          />
        </div>

        {/* PANE 2: Ultra-Clean Itinerary Panel (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl bg-[#12151C]/90 border border-white/10 p-4 sm:p-5 gap-3.5 shadow-xl h-[480px]">
          
          {/* Header Row: Title & Transit Capsule */}
          <div className="flex items-center justify-between gap-2 shrink-0">
            <h3 className="text-base sm:text-lg font-black text-white truncate">
              {language === 'ar' ? activeRoute.titleAr : activeRoute.titleEn}
            </h3>
            <div className="flex items-center gap-1.5 text-[11px] text-teal-300 font-bold bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/25 shrink-0">
              <Car className="w-3 h-3 text-teal-400 shrink-0" />
              <span>{language === 'ar' ? activeRoute.cleanTransitAr : activeRoute.cleanTransitEn}</span>
            </div>
          </div>

          {/* Compact Stats Strip: 1 unified horizontal capsule without redundant labels */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl py-2 px-3 flex items-center justify-around divide-x divide-x-reverse divide-white/10 text-xs font-black select-none shadow-inner shrink-0">
            <span className="flex items-center gap-1.5 text-white px-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{stops.length} {language === 'ar' ? 'محطات' : 'stops'}</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-300 px-2">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{language === 'ar' ? activeRoute.totalDurationAr : activeRoute.totalDurationEn}</span>
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 px-2">
              <Coins className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>~{activeRoute.estimatedCostSAR} {language === 'ar' ? 'ر.س' : 'SAR'}</span>
            </span>
          </div>

          {/* Stations List: Clean Arabic Names + 1-Line Meta */}
          <div className="flex-1 space-y-2.5 overflow-y-auto pt-1 pb-1 px-0.5 scrollbar-none relative text-start scroll-smooth">
            {stops.map((stop, idx) => {
              const p = stop.place;
              const isSelected = selectedStopIdx === idx;
              const isHovered = hoveredStopIdx === idx;
              const isLast = idx === stops.length - 1;
              const cleanStationName = (language === 'ar' ? p.nameAr : p.nameEn)
                .replace(/\s*\(.*?\)\s*/g, '')
                .trim();

              return (
                <div
                  key={`${p.id}-${idx}`}
                  onMouseEnter={() => setHoveredStopIdx(idx)}
                  onMouseLeave={() => setHoveredStopIdx(null)}
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedStopIdx(idx);
                  }}
                  className={`group relative flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected || isHovered
                      ? 'bg-[#181D2A] border-amber-500/60 shadow-[0_4px_16px_rgba(212,175,55,0.18)]'
                      : 'bg-white/[0.03] hover:bg-[#161B24] border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  {/* Left Column: Number Marker */}
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`w-7 h-7 rounded-full font-black text-xs flex items-center justify-center shrink-0 transition-all ${
                        isSelected || isHovered
                          ? 'bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-stone-950 shadow-[0_0_12px_rgba(245,158,11,0.5)] scale-105'
                          : 'bg-gradient-to-br from-amber-400/80 to-amber-600/80 text-stone-950 shadow-sm'
                      }`}
                    >
                      {idx + 1}
                    </div>
                  </div>

                  {/* Thumbnail Image */}
                  <img
                    src={p.imageUrl ? getAssetUrl(p.imageUrl) : getAssetUrl('/images/places/indigo-beach.jpg')}
                    alt={cleanStationName}
                    loading="lazy"
                    decoding="async"
                    className="w-13 h-13 w-[52px] h-[52px] rounded-xl object-cover shrink-0 border border-white/10 group-hover:scale-105 transition-transform"
                  />

                  {/* Clean Station Info in 1 Line */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h4 className="text-xs sm:text-sm font-black text-white leading-tight truncate group-hover:text-amber-300 transition-colors">
                      {cleanStationName}
                    </h4>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium truncate">
                      <span className="text-teal-300 font-bold truncate">
                        {language === 'ar' ? p.districtNameAr : p.districtNameEn}
                      </span>
                      <span>•</span>
                      <span className="text-amber-300/90 font-bold shrink-0">
                        {p.dwellTimeMinutes || p.durationMinutes || 60} {language === 'ar' ? 'دقيقة' : 'mins'}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-400 font-black shrink-0">
                        {p.averageCostSAR !== undefined && p.averageCostSAR > 0
                          ? `${p.averageCostSAR} ر.س`
                          : (language === 'ar' ? 'مجاني' : 'Free')}
                      </span>
                    </div>
                  </div>

                  {/* Single Stop Navigation Shortcut */}
                  <a
                    href={
                      p.googleMapsUrl ||
                      `https://www.google.com/maps/search/?api=1&query=${p.coordinates?.lat},${p.coordinates?.lng}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEngine.playClick();
                    }}
                    className="p-2 rounded-xl bg-white/[0.04] hover:bg-amber-400 hover:text-stone-950 text-amber-400 border border-white/10 shrink-0 transition-all cursor-pointer"
                    title={language === 'ar' ? 'فتح المحطة في Google Maps' : 'Open in Google Maps'}
                    aria-label="Open stop in Google Maps"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            })}
          </div>

          {/* Primary Action Button (CTA) */}
          <div className="mt-auto pt-1 shrink-0">
            <button
              type="button"
              onClick={handleApplyRoute}
              className="w-full h-11 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-stone-950 text-xs sm:text-sm font-black shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer active:translate-y-0"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>{language === 'ar' ? 'اعتماد هذا المسار في خطتي' : 'Load This Route Into My Plan'}</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default JeddahRouteStudio;
