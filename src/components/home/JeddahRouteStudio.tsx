'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  CheckCircle2,
} from 'lucide-react';
import { RouteMap } from '@/components/map/RouteMap';
import { JEDDAH_PLACES } from '@/data/jeddah-places';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { soundEngine } from '@/utils/audioEngine';
import { getAssetUrl } from '@/utils/paths';
import { MagneticButton } from '@/components/fancy/MagneticButton';
import { BorderBeam } from '@/components/fancy/BorderBeam';
import { NumberTicker } from '@/components/fancy/NumberTicker';
import { Place } from '@/types';

interface CuratedStudioRoute {
  id: string;
  curatedPlanId: string;
  titleAr: string;
  titleEn: string;
  taglineAr: string;
  taglineEn: string;
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
  transitSummaryAr: string;
  transitSummaryEn: string;
}

const STUDIO_ROUTES: CuratedStudioRoute[] = [
  {
    id: 'obhur-yachts',
    curatedPlanId: 'luxury-red-sea-yacht',
    titleAr: 'مسار يخوت وشواطئ أبحر الفاخرة',
    titleEn: 'Obhur Luxury Yacht & Beach Route',
    taglineAr: 'روقان الغروب الذهبي بين أفخم أندية اليخوت ومطاعم البحر الأحمر',
    taglineEn: 'Golden sunset relaxation among private yacht clubs and seafood lounges',
    badgeAr: 'فاخر VIP',
    badgeEn: 'VIP Luxury',
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
    transitSummaryAr: '18 دقيقة بالسيارة بين المحطات (طريق الملك)',
    transitSummaryEn: '18 min drive via King Road',
  },
  {
    id: 'historic-balad',
    curatedPlanId: 'heritage-and-digital-art',
    titleAr: 'مسار رواشين البلد وتيم لاب الرقمي',
    titleEn: 'Historic Al-Balad & teamLab Heritage',
    taglineAr: 'جولة ساحرة بين عبق التاريخ الحجازي وفنون المستقبل الرقمية',
    taglineEn: 'Enchanting blend of Hijazi architecture and futuristic digital art',
    badgeAr: 'يونسكو وتراث',
    badgeEn: 'UNESCO Heritage',
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
    transitSummaryAr: 'مسار مشي ممتع داخل أزقة البلد ومواقف قريبة',
    transitSummaryEn: 'Pleasant pedestrian walk inside Al-Balad alleys',
  },
  {
    id: 'corniche-icons',
    curatedPlanId: 'family-coastal-adventure',
    titleAr: 'مسار الكورنيش والترفيه الحيوي',
    titleEn: 'Corniche Waterfront & Entertainment',
    taglineAr: 'أيقونات عروس البحر: نسيم الشاطئ، حماس الملاهي، والنافورة',
    taglineEn: 'Jeddah icons: Sea breeze, amusement park thrills, and King Fahd Fountain',
    badgeAr: 'أيقوني وعائلي',
    badgeEn: 'Iconic & Family',
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
    transitSummaryAr: '12 دقيقة بالسيارة عبر طريق الكورنيش المباشر',
    transitSummaryEn: '12 min drive along the Corniche',
  },
  {
    id: 'rawdah-coffee',
    curatedPlanId: 'specialty-coffee-and-arts-trail',
    titleAr: 'مسار مقاهي الروضة والفنون المعاصرة',
    titleEn: 'Al-Rawdah Coffee & Creative Arts',
    taglineAr: 'عاصمة الروقان: محامص القهوة المختصة، المعارض التشكيلية، واللقاءات الهادئة',
    taglineEn: 'The chill capital: Specialty coffee roasters, art galleries, and boutique bites',
    badgeAr: 'عشاق القهوة',
    badgeEn: 'Coffee Lovers',
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
    transitSummaryAr: '8 دقائق بالسيارة أو جولة مشي بين كافيهات الروضة',
    transitSummaryEn: '8 min drive or short stroll in Al-Rawdah',
  },
];

export const JeddahRouteStudio: React.FC = () => {
  const { language, isRTL } = useLanguage();
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
    <section className="relative w-full rounded-[28px] lg:rounded-[2.5rem] bg-[#16181D]/75 lg:bg-[#0A0C10]/95 backdrop-blur-2xl saturate-150 lg:saturate-100 border border-white/[0.12] lg:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.45)] lg:shadow-[0_24px_70px_rgba(0,0,0,0.85)] p-4 sm:p-6 lg:p-10 space-y-5 lg:space-y-8 overflow-hidden overflow-x-hidden">
      {/* Animated Traveling Border Laser Beam */}
      <BorderBeam size={360} duration={14} borderWidth={1.5} colorFrom="#F5D07A" colorTo="#D4AF37" />

      {/* Dynamic Background Atmospheric Radial Glow */}
      <div
        className={`absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br ${activeRoute.bgGlow} blur-3xl pointer-events-none transition-all duration-700`}
      />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-[#D4AF37]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* 1. SECTION HEADER: Right (Title & Eyebrow) / Left (Google Maps Multi-Stop Action) */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-5">
        <div className="space-y-1.5 sm:space-y-2 text-start">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black shadow-sm">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ar' ? 'استوديو مسارات جدة الذكية' : 'Jeddah Route Studio'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold lg:font-black text-white tracking-tight leading-snug">
            {language === 'ar' ? 'خرائط ومسارات طلعتك المعتمدة' : 'Curated Geographic Outing Tracks'}
          </h2>

          <p className="hidden lg:block text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
            {language === 'ar'
              ? 'تصفح مسارات جدة الجغرافية المحسوبة بالمتر والدقيقة، مع الربط المباشر بخرائط جوجل متعددة المحطات ومحاكاة الميزانية.'
              : 'Explore verified geographic itineraries optimized for traffic flow with multi-stop Google Maps integration.'}
          </p>
        </div>

        {/* Global Multi-Stop Navigation Shortcut (Desktop only in header, mobile has native FAB on map) */}
        <div className="hidden lg:flex items-center gap-3 shrink-0 self-start md:self-auto">
          <MagneticButton distance={0.25}>
            <a
              href={generateGoogleMapsMultiStopUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEngine.playClick()}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-[#121620] hover:bg-[#181D2A] border border-[#D4AF37]/45 hover:border-[#D4AF37] text-white text-xs sm:text-sm font-black transition-all flex items-center gap-2.5 cursor-pointer shadow-[0_8px_24px_rgba(212,175,55,0.18)] hover:shadow-[0_10px_32px_rgba(212,175,55,0.3)] active:scale-95 group"
            >
              <Navigation className="w-4 h-4 text-[#D4AF37] group-hover:rotate-12 transition-transform" />
              <span>{language === 'ar' ? 'فتح كامل المسار في Google Maps' : 'Open Route in Google Maps'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37] opacity-80 group-hover:opacity-100" />
            </a>
          </MagneticButton>
        </div>
      </div>

      {/* 2. ROUTE SELECTOR TABS (Apple Wallet Horizontal Scroller) */}
      <div className="relative z-10 flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar snap-x snap-mandatory px-1 -mx-1 lg:snap-none lg:px-0 lg:mx-0">
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
              className={`relative min-w-[260px] lg:min-w-0 snap-center rounded-[22px] lg:rounded-2xl p-3.5 sm:p-4 lg:px-5 lg:py-3.5 text-xs sm:text-sm font-black transition-all flex items-center gap-3 shrink-0 cursor-pointer select-none border text-start active:scale-[0.97] duration-150 ${
                isActive
                  ? 'border-amber-500/80 bg-gradient-to-b from-amber-500/15 via-[#161B26] to-[#0E121A] text-white shadow-[0_0_25px_-5px_rgba(245,158,11,0.3)] ring-1 ring-amber-500/40'
                  : 'border-white/10 bg-[#12151C]/80 text-slate-300 hover:text-white hover:bg-[#181D26] hover:border-white/20'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeRouteStudioIndicator"
                  className="absolute inset-0 rounded-[22px] lg:rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-600/10 -z-10"
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                />
              )}

              <route.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-amber-400 animate-pulse' : route.color}`} />

              <div className="flex flex-col">
                <span className="leading-snug font-black whitespace-nowrap">
                  {language === 'ar' ? route.titleAr : route.titleEn}
                </span>
                <span className="text-[11px] text-slate-400 font-medium mt-0.5">
                  {route.placeSlugsOrIds.length} {language === 'ar' ? 'محطات' : 'stops'} • {route.totalDurationAr}
                </span>
              </div>

              <span
                className={`text-[10px] px-2.5 py-1 rounded-full border whitespace-nowrap font-black ${
                  isActive
                    ? 'bg-amber-400/20 border-amber-400/50 text-amber-300 shadow-sm'
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                {language === 'ar' ? route.badgeAr : route.badgeEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. MOBILE ARCHITECTURE (< 1024px): Apple Maps + Horizontal Snap Carousel */}
      <div className="flex flex-col lg:hidden space-y-4 relative z-10">
        
        {/* A. Mobile Apple Maps Viewport (h-[420px] sm:h-[460px] with Floating Actions) */}
        <div className="relative w-full h-[420px] sm:h-[460px] rounded-[28px] overflow-hidden border border-[#D4AF37]/35 shadow-[0_8px_32px_rgba(0,0,0,0.5)] bg-[#06090F]">
          <BorderBeam size={280} duration={10} borderWidth={1.5} colorFrom="#F5D07A" colorTo="#D4AF37" />
          <RouteMap
            stops={stops}
            className="w-full h-full min-h-[360px]"
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

        {/* B. iOS Summary Pill Bar: Single Unified Glass Capsule */}
        <div className="w-full bg-[#16181D]/75 backdrop-blur-2xl saturate-150 border border-white/[0.12] rounded-[20px] py-2.5 px-3 sm:px-4 flex justify-between items-center divide-x divide-x-reverse divide-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.35)] select-none">
          {/* Stops Count */}
          <div className="flex-1 text-center px-1">
            <span className="text-[10px] text-slate-400 block font-medium">
              {language === 'ar' ? 'المحطات' : 'Stops'}
            </span>
            <span className="text-xs sm:text-sm font-black text-white flex items-center justify-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{stops.length} {language === 'ar' ? 'محطات' : 'stops'}</span>
            </span>
          </div>

          {/* Duration */}
          <div className="flex-1 text-center px-1">
            <span className="text-[10px] text-slate-400 block font-medium">
              {language === 'ar' ? 'المدة' : 'Duration'}
            </span>
            <span className="text-xs sm:text-sm font-black text-amber-300 flex items-center justify-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{language === 'ar' ? activeRoute.totalDurationAr : activeRoute.totalDurationEn}</span>
            </span>
          </div>

          {/* Budget */}
          <div className="flex-1 text-center px-1">
            <span className="text-[10px] text-slate-400 block font-medium">
              {language === 'ar' ? 'الميزانية' : 'Budget'}
            </span>
            <span className="text-xs sm:text-sm font-black text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
              <Coins className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>~{activeRoute.estimatedCostSAR} {language === 'ar' ? 'ر.س' : 'SAR'}</span>
            </span>
          </div>
        </div>

        {/* C. Apple Maps Horizontal Snap Carousel (Stop Cards) */}
        <div
          ref={carouselRef}
          onScroll={handleCarouselScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 pt-1 scrollbar-none no-scrollbar px-4 -mx-4 scroll-smooth"
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
                className={`w-[88%] shrink-0 snap-center rounded-[22px] p-3.5 border transition-all cursor-pointer flex items-center gap-3.5 active:scale-[0.97] duration-150 select-none ${
                  isSelected
                    ? 'bg-[#181D2A] border-amber-500/70 shadow-[0_8px_24px_rgba(212,175,55,0.25)] ring-1 ring-amber-500/40'
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
                    className="w-[72px] h-[72px] rounded-[18px] object-cover border border-white/10"
                  />
                  <div className="absolute -top-1.5 -start-1.5 w-6 h-6 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-stone-950 font-black text-xs flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.6)] border border-white/40">
                    {idx + 1}
                  </div>
                </div>

                {/* Station Info */}
                <div className="flex-1 min-w-0 space-y-1 text-start">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-bold text-amber-300/90 truncate">
                      {stop.timeSlot || `${language === 'ar' ? 'المحطة' : 'Stop'} ${idx + 1}`}
                    </span>
                    {p.averageCostSAR !== undefined && (
                      <span className="text-[11px] text-emerald-400 font-black shrink-0">
                        {p.averageCostSAR > 0 ? `${p.averageCostSAR} ر.س` : (language === 'ar' ? 'دخول مجاني' : 'Free')}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-black text-white leading-tight line-clamp-1">
                    {cleanStationName}
                  </h4>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium pt-0.5">
                    <span className="text-teal-300 font-bold truncate">
                      {language === 'ar' ? p.districtNameAr : p.districtNameEn}
                    </span>
                    <span>•</span>
                    <span className="text-amber-300/80 font-bold shrink-0">
                      {p.dwellTimeMinutes || p.durationMinutes || 60} {language === 'ar' ? 'دقيقة' : 'mins'}
                    </span>
                  </div>
                </div>

                {/* Single Stop Navigation Shortcut (Apple HIG 44x44px touch area) */}
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
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/[0.06] hover:bg-amber-400 hover:text-stone-950 text-amber-400 border border-white/10 shrink-0 transition-all flex items-center justify-center active:scale-95 self-center"
                  title={language === 'ar' ? 'فتح المحطة في Google Maps' : 'Open in Google Maps'}
                  aria-label="Open stop in Google Maps"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Pagination Dots (Apple iOS Style) */}
        <div className="flex items-center justify-center gap-2 pt-1 pb-1">
          <span className="text-[11px] font-bold text-slate-400 ms-1">
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
                    ? 'w-6 h-1.5 bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]'
                    : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to stop ${dotIdx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* D. iOS Sticky Glass Action Dock */}
        <div className="w-full pt-1">
          <div className="relative group w-full">
            <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 opacity-60 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-300" />
            <button
              type="button"
              onClick={handleApplyRoute}
              className="relative w-full h-14 rounded-[20px] bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-stone-950 text-sm sm:text-base font-black shadow-[0_4px_24px_rgba(245,158,11,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer touch-manipulation"
            >
              <Sparkles className="w-4 h-4 text-stone-950 shrink-0" />
              <span>{language === 'ar' ? 'اعتماد هذا المسار في خطتي' : 'Load This Route Into My Plan'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* 4. DESKTOP ARCHITECTURE (lg:grid): 100% Preserved for Desktop Screens (>= 1024px) */}
      <div className="hidden lg:grid relative z-10 grid-cols-12 gap-6 items-stretch">
        
        {/* PANE 1: Interactive Leaflet Route Map (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-3xl overflow-hidden border border-[#D4AF37]/35 shadow-2xl relative h-[380px] sm:h-[560px] min-h-[360px] bg-[#06090F]">
          <BorderBeam size={240} duration={10} borderWidth={1.5} colorFrom="#F5D07A" colorTo="#D4AF37" />

          <RouteMap
            stops={stops}
            className="w-full h-full min-h-[360px]"
            showPolyline={true}
            activeStopIdx={selectedStopIdx}
            hoveredStopIdx={hoveredStopIdx}
            onSelectStop={(idx) => setSelectedStopIdx(idx)}
            onHoverStop={(idx) => setHoveredStopIdx(idx)}
            routeBadge={language === 'ar' ? activeRoute.badgeAr : activeRoute.badgeEn}
          />

          {/* Floating Route Summary Overlay at Map Bottom */}
          <div className="absolute bottom-3.5 inset-x-3.5 z-[390] bg-[#0A0D14]/92 backdrop-blur-xl border border-amber-500/35 rounded-2xl p-3 sm:p-3.5 flex flex-wrap items-center justify-between gap-2 shadow-[0_16px_36px_rgba(0,0,0,0.85)]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
              <span className="text-xs sm:text-sm font-black text-white">
                {language === 'ar' ? activeRoute.titleAr : activeRoute.titleEn}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-amber-300">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeRoute.totalDurationAr}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-black">
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
                <NumberTicker value={activeRoute.estimatedCostSAR} suffix=" ر.س / شخص" />
              </span>
            </div>
          </div>
        </div>

        {/* PANE 2: Stations Breakdown, Connected Timeline & 1-Click Load CTA (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col rounded-3xl bg-[#12151C]/90 border border-white/10 p-4 sm:p-6 gap-4 shadow-xl">
          {/* Top Route Overview Card */}
          <div className="space-y-3 text-start shrink-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs font-black shrink-0">
                {language === 'ar' ? activeRoute.badgeAr : activeRoute.badgeEn}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-teal-300 font-bold bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/25">
                <Car className="w-3.5 h-3.5 shrink-0 text-teal-400" />
                <span className="font-bold leading-tight">
                  {language === 'ar' ? activeRoute.transitSummaryAr : activeRoute.transitSummaryEn}
                </span>
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
              {language === 'ar' ? activeRoute.taglineAr : activeRoute.taglineEn}
            </h3>

            {/* Quick Metrics: 3 Balanced Cards */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center space-y-0.5 shadow-inner">
                <span className="text-[10px] text-slate-400 block font-medium">
                  {language === 'ar' ? 'المحطات' : 'Stops'}
                </span>
                <span className="text-xs sm:text-sm font-black text-white flex items-center justify-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 inline" />
                  <span>{stops.length} محطات</span>
                </span>
              </div>

              <div className="p-2.5 sm:p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center space-y-0.5 shadow-inner">
                <span className="text-[10px] text-slate-400 block font-medium">
                  {language === 'ar' ? 'المدة التقديرية' : 'Duration'}
                </span>
                <span className="text-xs sm:text-sm font-black text-amber-300 flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400 inline" />
                  <span>{activeRoute.totalDurationAr}</span>
                </span>
              </div>

              <div className="p-2.5 sm:p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center space-y-0.5 shadow-inner">
                <span className="text-[10px] text-slate-400 block font-medium">
                  {language === 'ar' ? 'الميزانية للفرد' : 'Budget'}
                </span>
                <span className="text-xs sm:text-sm font-black text-emerald-400 flex items-center justify-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-emerald-400 inline" />
                  <span>~{activeRoute.estimatedCostSAR} ر.س</span>
                </span>
              </div>
            </div>
          </div>

          {/* Sequential Stations Timeline: Top item #1 is 100% visible with pt-2, scroll-mt-4, and no clipping */}
          <div className="flex-1 space-y-3 overflow-y-auto max-h-[320px] pt-2 pb-2 px-1 scrollbar-none relative text-start scroll-smooth">
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
                  onMouseEnter={() => {
                    setHoveredStopIdx(idx);
                  }}
                  onMouseLeave={() => {
                    setHoveredStopIdx(null);
                  }}
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedStopIdx(idx);
                  }}
                  className={`group relative flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer scroll-mt-4 min-h-[76px] ${
                    isSelected || isHovered
                      ? 'bg-[#181D2A] border-amber-500/60 shadow-[0_4px_20px_rgba(212,175,55,0.2)]'
                      : 'bg-white/[0.03] hover:bg-[#161B24] border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  {/* Left Column: Number Marker + Connecting Vertical Line */}
                  <div className="flex flex-col items-center shrink-0 self-stretch">
                    <div
                      className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center shrink-0 transition-all ${
                        isSelected || isHovered
                          ? 'bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-stone-950 shadow-[0_0_15px_rgba(245,158,11,0.6)] scale-105'
                          : 'bg-gradient-to-br from-amber-400/80 to-amber-600/80 text-stone-950 shadow-sm'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    {!isLast && (
                      <div className="w-0 flex-1 my-1 border-r-2 border-dashed border-amber-500/30" />
                    )}
                  </div>

                  {/* Thumbnail Image */}
                  <img
                    src={p.imageUrl ? getAssetUrl(p.imageUrl) : getAssetUrl('/images/places/indigo-beach.jpg')}
                    alt={cleanStationName}
                    loading="lazy"
                    decoding="async"
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/10 group-hover:scale-105 transition-transform"
                  />

                  {/* Clean Non-Truncated Station Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs sm:text-sm font-black text-white leading-relaxed line-clamp-2 group-hover:text-amber-300 transition-colors">
                      {cleanStationName}
                    </h4>

                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                      <span className="text-teal-300 font-bold">
                        {language === 'ar' ? p.districtNameAr : p.districtNameEn}
                      </span>
                      <span>•</span>
                      <span className="text-amber-300/90 font-bold">
                        {p.dwellTimeMinutes || p.durationMinutes || 60} {language === 'ar' ? 'دقيقة' : 'mins'}
                      </span>
                    </div>

                    {p.averageCostSAR !== undefined && (
                      <span className="inline-block text-[10px] text-emerald-400 font-black">
                        {p.averageCostSAR > 0 ? `${p.averageCostSAR} ر.س` : (language === 'ar' ? 'دخول مجاني' : 'Free')}
                      </span>
                    )}
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
                    className="p-2 rounded-xl bg-white/[0.04] hover:bg-amber-400 hover:text-stone-950 text-amber-400 border border-white/10 shrink-0 transition-all cursor-pointer self-center"
                    title={language === 'ar' ? 'فتح المحطة في Google Maps' : 'Open in Google Maps'}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            })}
          </div>

          {/* Primary Action Button (CTA) */}
          <div className="mt-auto pt-2">
            <div className="relative group w-full">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 opacity-60 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-300" />
              <MagneticButton className="w-full" distance={0.25}>
                <button
                  type="button"
                  onClick={handleApplyRoute}
                  className="relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-stone-950 text-sm font-black shadow-[0_0_35px_rgba(245,158,11,0.5)] hover:shadow-[0_0_55px_rgba(245,158,11,0.85)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 cursor-pointer touch-manipulation active:translate-y-0"
                >
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  <span>{language === 'ar' ? 'اعتماد هذا المسار في خطتي' : 'Load This Route Into My Plan'}</span>
                </button>
              </MagneticButton>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default JeddahRouteStudio;