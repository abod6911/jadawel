'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  MapPin,
  Clock,
  Coins,
  Navigation,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Car,
  CheckCircle2,
  Share2,
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
    <section className="relative w-full rounded-[2.5rem] bg-[#0A0D12]/90 backdrop-blur-2xl border border-white/[0.08] shadow-[0_24px_70px_rgba(0,0,0,0.85)] p-5 sm:p-8 lg:p-10 space-y-8 overflow-hidden">
      {/* Animated Traveling Border Laser Beam */}
      <BorderBeam size={360} duration={14} borderWidth={1.5} colorFrom="#E5C378" colorTo="#F5E2B3" />

      {/* Dynamic Background Atmospheric Radial Glow */}
      <div
        className={`absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br ${activeRoute.bgGlow} blur-3xl pointer-events-none transition-all duration-700`}
      />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-[#E5C378]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* 1. SECTION HEADER WITH LUXURY EYEBROW */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2 text-start">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#E5C378] text-xs font-semibold shadow-sm">
            <Compass className="w-3.5 h-3.5 text-[#E5C378]" />
            <span>{language === 'ar' ? 'استوديو مسارات جدة الذكية' : 'Jeddah Route Studio'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
            {language === 'ar' ? 'خرائط ومسارات طلعتك المعتمدة' : 'Curated Geographic Outing Tracks'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
            {language === 'ar'
              ? 'تصفح مسارات جدة الجغرافية المحسوبة بالمتر والدقيقة، مع الربط المباشر بخرائط جوجل متعددة المحطات ومحاكاة الميزانية.'
              : 'Explore verified geographic itineraries optimized for traffic flow with multi-stop Google Maps integration.'}
          </p>
        </div>

        {/* Global Multi-Stop Navigation Shortcut */}
        <div className="flex items-center gap-3 shrink-0">
          <MagneticButton distance={0.25}>
            <a
              href={generateGoogleMapsMultiStopUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEngine.playClick()}
              className="px-4 py-2.5 rounded-full bg-[#131722] hover:bg-[#1A1F2C] border border-[#E5C378]/35 hover:border-[#E5C378]/70 text-white text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
            >
              <Navigation className="w-4 h-4 text-[#E5C378]" />
              <span>{language === 'ar' ? 'فتح كامل المسار في Google Maps' : 'Open Route in Google Maps'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#E5C378]" />
            </a>
          </MagneticButton>
        </div>
      </div>

      {/* 2. ROUTE SELECTOR TABS (Apple Segmented Glass Rail) */}
      <div className="relative z-10 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
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
              }}
              className={`relative px-4 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2.5 shrink-0 cursor-pointer select-none border ${
                isActive
                  ? 'border-[#E5C378] text-white shadow-[0_8px_24px_rgba(229,195,120,0.3)]'
                  : 'border-white/[0.08] bg-[#131722]/70 text-slate-300 hover:text-white hover:bg-[#1A1F2C]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeRouteStudioIndicator"
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#DF9F3D]/25 via-[#E5C378]/20 to-[#C8A452]/15 -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <route.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[var(--accent-gold)]' : route.color}`} />
              <div className="flex flex-col text-start">
                <span className="leading-snug">
                  {language === 'ar' ? route.titleAr : route.titleEn}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {route.placeSlugsOrIds.length} {language === 'ar' ? 'محطات' : 'stops'} • {route.totalDurationAr}
                </span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  isActive ? 'bg-[#E5C378]/20 border-[#E5C378]/40 text-[#F5E2B3]' : 'bg-white/5 border-white/10 text-white/50'
                }`}
              >
                {language === 'ar' ? route.badgeAr : route.badgeEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. DUAL-PANE ROUTE CANVAS & STATION DRAWER */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* PANE 1: Interactive Leaflet Route Map (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-3xl overflow-hidden border border-[#E5C378]/25 shadow-2xl relative min-h-[460px] sm:min-h-[520px]">
          <BorderBeam size={220} duration={10} borderWidth={1.5} colorFrom="#E5C378" colorTo="#F5E2B3" />
          <RouteMap stops={stops} className="w-full h-full min-h-[460px] sm:min-h-[520px]" showPolyline={true} />

          {/* Floating Route Summary Overlay at Map Bottom */}
          <div className="absolute bottom-3 inset-x-3 z-[400] bg-[#0B0D12]/90 backdrop-blur-xl border border-[#E5C378]/30 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 shadow-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-black text-white">
                {language === 'ar' ? activeRoute.titleAr : activeRoute.titleEn}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-300">
              <span className="flex items-center gap-1 text-[#E5C378]">
                <Clock className="w-3.5 h-3.5 text-[#E5C378]" />
                {activeRoute.totalDurationAr}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-300">
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
                <NumberTicker value={activeRoute.estimatedCostSAR} suffix=" ر.س / شخص" />
              </span>
            </div>
          </div>
        </div>

        {/* PANE 2: Stations Breakdown, Transit Details & 1-Click Load CTA (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl bg-[#12151C]/90 border border-[#E5C378]/20 p-5 sm:p-6 space-y-5">
          {/* Top Route Overview Card */}
          <div className="space-y-3 text-start">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-[#E5C378]/15 border border-[#E5C378]/30 text-[#F5E2B3] text-[11px] font-black">
                {language === 'ar' ? activeRoute.badgeAr : activeRoute.badgeEn}
              </span>
              <div className="flex items-center gap-1 text-[11px] text-teal-300 font-bold bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                <Car className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? activeRoute.transitSummaryAr : activeRoute.transitSummaryEn}</span>
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
              {language === 'ar' ? activeRoute.taglineAr : activeRoute.taglineEn}
            </h3>

            {/* Quick Metrics Pills */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                <span className="text-[10px] text-slate-400 block font-medium">
                  {language === 'ar' ? 'المحطات' : 'Stops'}
                </span>
                <span className="text-sm font-black text-white">{stops.length} محطات</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                <span className="text-[10px] text-slate-400 block font-medium">
                  {language === 'ar' ? 'المدة التقديرية' : 'Duration'}
                </span>
                <span className="text-sm font-black text-[#E5C378]">{activeRoute.totalDurationAr}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                <span className="text-[10px] text-slate-400 block font-medium">
                  {language === 'ar' ? 'الميزانية للفرد' : 'Budget'}
                </span>
                <span className="text-sm font-black text-emerald-400">~{activeRoute.estimatedCostSAR} ر.س</span>
              </div>
            </div>
          </div>

          {/* Sequential Stations Timeline */}
          <div className="space-y-2.5 overflow-y-auto max-h-[290px] pr-1 scrollbar-none">
            {stops.map((stop, idx) => {
              const p = stop.place;
              return (
                <div
                  key={idx}
                  className="group p-3 rounded-2xl bg-white/[0.03] hover:bg-[#171B24] border border-white/[0.08] hover:border-[#E5C378]/40 transition-all flex items-center justify-between gap-3 text-start shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Number Badge */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#DF9F3D] to-[#E5C378] text-[#0B0D12] font-black text-xs flex items-center justify-center shrink-0 shadow-md">
                      {idx + 1}
                    </div>

                    {/* Thumbnail Image */}
                    <img
                      src={p.imageUrl ? getAssetUrl(p.imageUrl) : getAssetUrl('/images/places/indigo-beach.jpg')}
                      alt={p.nameAr}
                      loading="lazy"
                      decoding="async"
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10 group-hover:scale-105 transition-transform"
                    />

                    {/* Details */}
                    <div className="min-w-0 space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-black text-white truncate group-hover:text-[#F5E2B3] transition-colors">
                        {language === 'ar' ? p.nameAr : p.nameEn}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium truncate">
                        {language === 'ar' ? p.districtNameAr : p.districtNameEn} • {p.durationMinutes} دقيقة
                      </p>
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
                    onClick={() => soundEngine.playClick()}
                    className="p-2 rounded-xl bg-white/[0.04] hover:bg-[#E5C378] hover:text-[#0B0D12] text-[#E5C378] border border-white/10 shrink-0 transition-all cursor-pointer"
                    title="فتح هذه المحطة في خرائط جوجل"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            })}
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <div className="relative group w-full">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] opacity-60 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-300" />
              <MagneticButton className="w-full" distance={0.25}>
                <button
                  type="button"
                  onClick={handleApplyRoute}
                  className="relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] text-[#0B0D12] text-sm font-black shadow-[0_0_35px_rgba(229,195,120,0.5)] hover:shadow-[0_0_55px_rgba(229,195,120,0.85)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2.5 cursor-pointer touch-manipulation active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 text-[#0B0D12]" />
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
