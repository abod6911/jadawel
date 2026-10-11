'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Users,
  Coins,
  Clock,
  Check,
  ChevronDown,
  Coffee,
  Building2,
  Crown,
  Heart,
  Smile,
  Zap,
  Compass,
} from 'lucide-react';
import { useItineraryStore } from '@/store/useItineraryStore';
import { useLanguage } from '@/hooks/useLanguage';
import { soundEngine } from '@/utils/audioEngine';
import { getAssetUrl } from '@/utils/paths';
import { getJeddahAtmosphere } from '@/utils/atmosphereEngine';
import { DistrictId, CompanionType, BudgetTier, DurationOption, VibeType } from '@/types';

// ==========================================
// 1. DATA DEFINITIONS & SHOWCASE DESTINATIONS
// ==========================================

interface Destination {
  id: string;
  name: string;
  nameEn: string;
  tagline: string;
  taglineEn: string;
  badge: string;
  badgeEn: string;
  bgImage: string;
  districtId: DistrictId | 'all_jeddah';
  vibe: VibeType;
  budgetTier: BudgetTier;
  duration: DurationOption;
}

const DESTINATIONS: Destination[] = [
  {
    id: 'obhur',
    name: 'أبحر والواجهة البحرية',
    nameEn: 'Obhur Marina & Waterfront',
    tagline: 'روقان الغروب، نسيم البحر الأحمر، وأرقى شواطئ ونوادي اليخوت 🌊',
    taglineEn: 'Golden sunset breeze, Red Sea yachts, and serene private beach lounges 🌊',
    badge: '📍 عروس البحر الأحمر • الواجهة والنوادي الشاطئية',
    badgeEn: '📍 Red Sea Bride • Waterfront & Beach Clubs',
    bgImage: getAssetUrl('/images/realms/obhur-marina.jpg'),
    districtId: 'obhur',
    vibe: 'beach_sunset',
    budgetTier: 'moderate',
    duration: '4_to_6h',
  },
  {
    id: 'balad',
    name: 'رواشين وتراث البلد',
    nameEn: 'Historic Al-Balad & Heritage',
    tagline: 'أصالة الماضي، أزقة التاريخ العتيقة، وبسطات الشاي الحجازي 🏛️',
    taglineEn: 'Timeless Hijazi heritage, ancient coral stone alleys, and lantern tea nights 🏛️',
    badge: '📍 التراث العالمي • قلب جدة التاريخي',
    badgeEn: '📍 World Heritage • Historic Heart of Jeddah',
    bgImage: getAssetUrl('/images/realms/albalad-heritage.jpg'),
    districtId: 'al-balad',
    vibe: 'heritage_arts',
    budgetTier: 'economy',
    duration: '2_to_4h',
  },
  {
    id: 'rawdah',
    name: 'كافيهات ومطاعم الروضة',
    nameEn: 'Al-Rawdah Specialty Cafes',
    tagline: 'عاصمة الروقان، أحدث محامص القهوة المختصة، وأرقى المطاعم العالمية ☕',
    taglineEn: 'Specialty coffee capital, artisanal roasters, and world-class culinary gems ☕',
    badge: '📍 النبض العصري • أرقى مقاهي ومطاعم جدة',
    badgeEn: '📍 Urban Pulse • Premier Cafes & Dining Hub',
    bgImage: getAssetUrl('/images/realms/alrawdah-coffee.jpg'),
    districtId: 'al-rawdah',
    vibe: 'coffee_dessert',
    budgetTier: 'premium',
    duration: 'under_2h',
  },
];

const QUICK_MOODS = [
  {
    id: 'sunset_beach',
    labelAr: 'بحر وغروب 🌅',
    labelEn: 'Beach & Sunset 🌅',
    district: 'obhur' as const,
    vibe: 'beach_sunset' as const,
    budget: 'moderate' as const,
    duration: '4_to_6h' as const,
    companions: 'friends' as const,
  },
  {
    id: 'specialty_coffee',
    labelAr: 'قهوة وروقان ☕',
    labelEn: 'Coffee & Chill ☕',
    district: 'al-rawdah' as const,
    vibe: 'coffee_dessert' as const,
    budget: 'moderate' as const,
    duration: 'under_2h' as const,
    companions: 'solo' as const,
  },
  {
    id: 'balad_night',
    labelAr: 'جولة البلد التاريخية 🏛️',
    labelEn: 'Historic Al-Balad 🏛️',
    district: 'al-balad' as const,
    vibe: 'heritage_arts' as const,
    budget: 'economy' as const,
    duration: '2_to_4h' as const,
    companions: 'family' as const,
  },
  {
    id: 'luxury_vip',
    labelAr: 'سهرة فاخرة VIP 👑',
    labelEn: 'Luxury VIP Night 👑',
    district: 'al-shati' as const,
    vibe: 'food' as const,
    budget: 'premium' as const,
    duration: 'half_day_night' as const,
    companions: 'couples' as const,
  },
  {
    id: 'free_outing',
    labelAr: 'خطة مجانية 100% 🎫',
    labelEn: '100% Free Plan 🎫',
    district: 'al-shati' as const,
    vibe: 'free_walk' as const,
    budget: 'free' as const,
    duration: '2_to_4h' as const,
    companions: 'friends' as const,
  },
];

const DISTRICT_OPTIONS: { id: DistrictId | 'all_jeddah'; nameAr: string; nameEn: string; icon: string; subAr: string }[] = [
  { id: 'all_jeddah', nameAr: 'كل جدة (الأفضل)', nameEn: 'All Jeddah (Best)', icon: '🏙️', subAr: 'أذكى مسار متوازن عبر عروس البحر' },
  { id: 'obhur', nameAr: 'أبحر والواجهة البحرية', nameEn: 'Obhur & Waterfront', icon: '🌊', subAr: 'شواطئ ونوادي يخوت وروقان بحري' },
  { id: 'al-shati', nameAr: 'الشاطئ والكورنيش', nameEn: 'Al-Shati & Corniche', icon: '🌴', subAr: 'الواجهة البحرية والفعاليات العالمية' },
  { id: 'al-balad', nameAr: 'البلد التاريخية', nameEn: 'Historic Al-Balad', icon: '🏛️', subAr: 'رواشين التراث وبسطات الشاي العتيقة' },
  { id: 'al-rawdah', nameAr: 'الروضة والمقاهي', nameEn: 'Al-Rawdah District', icon: '☕', subAr: 'محامص مختصة ومطاعم استثنائية' },
  { id: 'al-zahra', nameAr: 'الزهراء وحي جميل', nameEn: 'Al-Zahra & Hayy Jameel', icon: '🎨', subAr: 'فنون معاصرة ومقاهي هادئة' },
  { id: 'al-hamra', nameAr: 'الحمراء ونافورة جدة', nameEn: 'Al-Hamra & Fountain', icon: '⛲', subAr: 'إطلالة نافورة الملك فهد الساحرة' },
];

const COMPANION_OPTIONS: { id: CompanionType; labelAr: string; labelEn: string; icon: any; subAr: string }[] = [
  { id: 'friends', labelAr: 'مع الأصحاب', labelEn: 'Friends', icon: Users, subAr: 'طلعة حماسية وأجواء ضحك وسوالف' },
  { id: 'couples', labelAr: 'كابلز واحتفال', labelEn: 'Couples', icon: Heart, subAr: 'جلسة رومانسية هادئة وإطلالة مميزة' },
  { id: 'family', labelAr: 'مع العائلة', labelEn: 'Family', icon: Smile, subAr: 'مناسبة لجميع الأعمار وراحة تامة' },
  { id: 'solo', labelAr: 'لحالي بروقان', labelEn: 'Solo Chill', icon: Compass, subAr: 'عزلة إيجابية، قهوة، وقراءة وتأمل' },
];

const BUDGET_OPTIONS: { id: BudgetTier; labelAr: string; labelEn: string; icon: string; priceAr: string }[] = [
  { id: 'free', labelAr: 'مجانية 100%', labelEn: '100% Free', icon: '🆓', priceAr: '0 ريال (ممشى وبحر وحدائق)' },
  { id: 'economy', labelAr: 'اقتصادية', labelEn: 'Economy', icon: '🏷️', priceAr: 'أقل من 100 ريال للشخص' },
  { id: 'moderate', labelAr: 'متوسطة وموزونة', labelEn: 'Moderate', icon: '⚖️', priceAr: '100 - 250 ريال للشخص' },
  { id: 'premium', labelAr: 'فاخرة VIP', labelEn: 'VIP Luxury', icon: '💎', priceAr: '350+ ريال تجارب استثنائية' },
];

const DURATION_OPTIONS: { id: DurationOption; labelAr: string; labelEn: string; icon: string; subAr: string }[] = [
  { id: 'under_2h', labelAr: 'أقل من ساعتين', labelEn: 'Under 2h', icon: '⚡', subAr: 'روقان سريع، قهوة أو حلى' },
  { id: '2_to_4h', labelAr: '2 إلى 4 ساعات', labelEn: '2 - 4h', icon: '⏳', subAr: 'مسار ممتع ومتنوع لنشاطين' },
  { id: '4_to_6h', labelAr: '4 إلى 6 ساعات', labelEn: '4 - 6h', icon: '🌅', subAr: 'نصف يوم متكامل مع الغروب' },
  { id: 'half_day_night', labelAr: 'سهرة مسائية', labelEn: 'Night Out', icon: '🌙', subAr: 'من المغرب حتى منتصف الليل' },
  { id: 'full_day', labelAr: 'يوم كامل استثنائي', labelEn: 'Full Day', icon: '🌟', subAr: 'تجربة جدة الشاملة صباحاً ومساءً' },
];

const VIBE_OPTIONS: { id: VibeType; labelAr: string; labelEn: string; icon: string; subAr: string }[] = [
  { id: 'beach_sunset', labelAr: 'بحر وغروب', labelEn: 'Beach & Sunset', icon: '🌊', subAr: 'نسيم الكورنيش وجلسات الشواطئ' },
  { id: 'coffee_dessert', labelAr: 'قهوة وحلى', labelEn: 'Coffee & Dessert', icon: '☕', subAr: 'محامص مختصة وألذ الحلويات' },
  { id: 'heritage_arts', labelAr: 'تراث وفنون', labelEn: 'Heritage & Arts', icon: '🏛️', subAr: 'تاريخ البلد العريق والمعارض الفنية' },
  { id: 'food', labelAr: 'عشاء وتجارب تذوق', labelEn: 'Fine Dining', icon: '🍽️', subAr: 'أشهى المأكولات البحرية والعالمية' },
  { id: 'free_walk', labelAr: 'ممشى وطبيعة مجانية', labelEn: 'Free Scenic Walk', icon: '🌴', subAr: 'هواء نقي ومسارات الكورنيش' },
];

// ==========================================
// 1.5 3D PERSPECTIVE TILT CARD (SPATIAL DEPTH)
// ==========================================
const DestinationTiltCard: React.FC<{
  dest: Destination;
  idx: number;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ dest, idx, isSelected, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, isHovered: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = x / rect.width - 0.5;
    const normY = y / rect.height - 0.5;
    setTilt({
      x: normY * -9,
      y: normX * 9,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50, isHovered: false });
  };

  return (
    <div
      ref={cardRef}
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${
          tilt.isHovered ? 'scale3d(1.025, 1.025, 1.025)' : 'scale3d(1, 1, 1)'
        }`,
        transition: tilt.isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
      }}
      className={`relative group h-48 sm:h-56 rounded-3xl overflow-hidden cursor-pointer border transition-colors duration-300 shadow-2xl select-none ${
        isSelected
          ? 'border-gold-500/70 shadow-[0_16px_50px_rgba(229,169,98,0.35)] ring-2 ring-gold-500/50'
          : 'border-white/[0.08] hover:border-gold-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.6)]'
      }`}
    >
      {/* Background Image with Cinematic Zoom */}
      <img
        src={dest.bgImage}
        alt={dest.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.55]"
      />

      {/* Ambient Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/45 to-transparent" />

      {/* Dynamic Specular Spotlight Glare following cursor */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: tilt.isHovered ? 0.35 : 0,
          background: `radial-gradient(circle 200px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.45), transparent 70%)`,
        }}
      />

      {/* Top Specular Rim Light */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black text-gold-300 shadow-sm">
            {dest.badge}
          </span>
          {isSelected && (
            <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-gold-500 to-amber-400 text-stone-950 flex items-center justify-center shadow-lg font-black text-xs">
              ✓
            </span>
          )}
        </div>

        <div>
          <h3 className="text-lg font-black text-white group-hover:text-gold-300 transition-colors drop-shadow-md">
            {dest.name}
          </h3>
          <p className="text-xs text-white/70 line-clamp-1 mt-1 font-medium">
            {dest.tagline}
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. MAIN HERO SECTION COMPONENT
// ==========================================

export const HeroSection: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const [activeIdx, setActiveIdx] = useState(0);
  const activeDest = DESTINATIONS[activeIdx];

  // Store bindings
  const updateWizardPreferences = useItineraryStore((state) => state.updateWizardPreferences);
  const generatePlanFromPreferences = useItineraryStore((state) => state.generatePlanFromPreferences);
  const isGeneratingPlan = useItineraryStore((state) => state.isGeneratingPlan);
  const atmospherePhase = useItineraryStore((state) => state.atmospherePhase);
  const atmosphere = getJeddahAtmosphere(atmospherePhase);

  // Dynamic Time Machine video selection
  const activeVideoSrc =
    atmosphere.phase === 'golden_hour'
      ? getAssetUrl('/videos/jeddah-sunset.webm')
      : atmosphere.phase === 'daytime'
        ? getAssetUrl('/videos/jeddah-waves.webm')
        : getAssetUrl('/videos/jeddah-corniche.mp4');

  // Form State
  const [district, setDistrict] = useState<DistrictId | 'all_jeddah'>(activeDest.districtId);
  const [companions, setCompanions] = useState<CompanionType>('friends');
  const [budget, setBudget] = useState<BudgetTier>(activeDest.budgetTier);
  const [duration, setDuration] = useState<DurationOption>(activeDest.duration);
  const [vibe, setVibe] = useState<VibeType>(activeDest.vibe);
  const [activeMoodId, setActiveMoodId] = useState<string>('sunset_beach');

  // Popover State (which pillar is currently opened)
  const [activePopover, setActivePopover] = useState<'district' | 'companions' | 'budget' | 'duration' | 'vibe' | null>(null);

  // Ambient Background Video Ref & Search Bar Ref
  const videoRef = useRef<HTMLVideoElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const [isIntroStage, setIsIntroStage] = useState(true);

  // Cinematic Entrance: Showcase pure Jeddah video scenery first, then gracefully reveal the luxury text
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntroStage(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Update video when atmospherePhase changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.src = activeVideoSrc;
    video.load();
    const promise = video.play();
    if (promise) promise.catch(() => {});
  }, [activeVideoSrc]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // HTML5 Video Autoplay Lifecycle (Direct DOM property assignment for smooth ambient background)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const tryPlay = () => {
      video.muted = true;
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch(() => {});
      }
    };

    tryPlay();

    const handleEnded = () => {
      video.currentTime = 0;
      tryPlay();
    };

    video.addEventListener('ended', handleEnded);

    // Gesture unlock fallback for strict mobile browser policies
    const unlockOnGesture = () => {
      if (video.paused) {
        video.muted = true;
        video.play().catch(() => {});
      }
      window.removeEventListener('pointerdown', unlockOnGesture);
      window.removeEventListener('touchstart', unlockOnGesture);
      window.removeEventListener('scroll', unlockOnGesture);
    };

    window.addEventListener('pointerdown', unlockOnGesture, { passive: true });
    window.addEventListener('touchstart', unlockOnGesture, { passive: true });
    window.addEventListener('scroll', unlockOnGesture, { passive: true });

    return () => {
      video.removeEventListener('ended', handleEnded);
      window.removeEventListener('pointerdown', unlockOnGesture);
      window.removeEventListener('touchstart', unlockOnGesture);
      window.removeEventListener('scroll', unlockOnGesture);
    };
  }, []);

  const handleSelectDestination = (idx: number) => {
    soundEngine.playClick();
    setActiveIdx(idx);
    const dest = DESTINATIONS[idx];
    setDistrict(dest.districtId);
    setVibe(dest.vibe);
    setBudget(dest.budgetTier);
    setDuration(dest.duration);
    setActiveMoodId('');
  };

  const handleApplyMood = (preset: typeof QUICK_MOODS[0]) => {
    soundEngine.playClick();
    setActiveMoodId(preset.id);
    setDistrict(preset.district);
    setVibe(preset.vibe);
    setBudget(preset.budget);
    setDuration(preset.duration);
    setCompanions(preset.companions);
  };



  const handleBuildPlan = () => {
    soundEngine.playSuccess();
    setActivePopover(null);
    updateWizardPreferences({
      startingDistrict: district,
      companions,
      budgetTier: budget,
      duration,
      vibe,
    });
    generatePlanFromPreferences();
  };

  // Helper labels for active states
  const currentDistrictObj = DISTRICT_OPTIONS.find((d) => d.id === district) || DISTRICT_OPTIONS[0];
  const currentCompanionObj = COMPANION_OPTIONS.find((c) => c.id === companions) || COMPANION_OPTIONS[0];
  const currentBudgetObj = BUDGET_OPTIONS.find((b) => b.id === budget) || BUDGET_OPTIONS[2];
  const currentDurationObj = DURATION_OPTIONS.find((d) => d.id === duration) || DURATION_OPTIONS[2];
  const currentVibeObj = VIBE_OPTIONS.find((v) => v.id === vibe) || VIBE_OPTIONS[0];

  return (
    <section
      onClick={() => isIntroStage && setIsIntroStage(false)}
      className="relative w-full rounded-[2.5rem] overflow-hidden px-3 sm:px-8 py-8 sm:py-16 select-none border border-white/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.85)] bg-[#0B0F15]"
    >
      
      {/* ======================================================== */}
      {/* 1. ATMOSPHERIC CANVAS: RED SEA TWILIGHT & VIDEO OVERLAY  */}
      {/* ======================================================== */}
      <div className="absolute inset-0 z-0 bg-[#0B0F15] overflow-hidden">
        {/* Native Looping Jeddah Video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src={getAssetUrl('/videos/jeddah-corniche.mp4')} type="video/mp4" />
          <source src={getAssetUrl('/videos/jeddah-sunset.webm')} type="video/webm" />
          <source src={getAssetUrl('/videos/jeddah-waves.webm')} type="video/webm" />
        </video>

        {/* Deep Obsidian & Luminous Golden Amber Ambient Glows (Smooth crossfade from clear video to high-contrast canvas) */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none ${
            isIntroStage ? 'opacity-20' : 'opacity-85'
          } bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/75 to-[#0B0F15]/90`}
        />
        {/* Dynamic Atmosphere Radial Gradient */}
        <div
          className={`absolute inset-0 pointer-events-none transition-all duration-1000 ${
            atmosphere.phase === 'golden_hour'
              ? 'bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.24)_0%,rgba(234,88,12,0.12)_40%,transparent_70%)]'
              : atmosphere.phase === 'daytime'
                ? 'bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.24)_0%,rgba(20,184,166,0.12)_40%,transparent_70%)]'
                : 'bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.2)_0%,rgba(245,158,11,0.08)_35%,transparent_70%)]'
          }`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(30,41,59,0.35)_0%,transparent_70%)] pointer-events-none" />

        {/* Cinematic Lens Vignette & 35mm Film Grain */}
        <div className="cinematic-vignette absolute inset-0 z-0 pointer-events-none" />
        <div className="cinematic-film-grain absolute inset-0 z-0 pointer-events-none" />

        {/* Cinematic Floating Golden Twilight Embers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-10 left-[15%] w-2 h-2 rounded-full bg-gold-400 blur-[1px] animate-ember opacity-40" />
          <div className="absolute bottom-24 right-[20%] w-1.5 h-1.5 rounded-full bg-amber-300 blur-[1px] animate-ember opacity-60 [animation-delay:1.5s]" />
          <div className="absolute bottom-16 left-[45%] w-2.5 h-2.5 rounded-full bg-gold-500 blur-[1px] animate-ember opacity-30 [animation-delay:3s]" />
          <div className="absolute bottom-32 right-[40%] w-1.5 h-1.5 rounded-full bg-amber-400 blur-[1px] animate-ember opacity-50 [animation-delay:2.2s]" />
        </div>

        {/* Subtle Ambient SVG Floating Light Ray particles */}
        <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="particleGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#E5A962" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#E5A962" stopOpacity="0.8" />
              </radialGradient>
            </defs>
            <circle cx="20%" cy="30%" r="2" fill="url(#particleGlow)" className="animate-pulse" />
            <circle cx="85%" cy="25%" r="3" fill="url(#particleGlow)" className="animate-ping" />
            <circle cx="45%" cy="75%" r="2.5" fill="url(#particleGlow)" className="animate-pulse" />
            <circle cx="70%" cy="80%" r="1.5" fill="url(#particleGlow)" />
            <circle cx="10%" cy="85%" r="2" fill="url(#particleGlow)" />
          </svg>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. INTERACTIVE HERO EXPERIENCE                           */}
      {/* ======================================================== */}
      <motion.div
        key="hero-interactive-content"
        initial={{ opacity: 0, y: 28 }}
        animate={{
          opacity: isIntroStage ? 0 : 1,
          y: isIntroStage ? 28 : 0,
        }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full flex flex-col items-center"
      >
        {/* EDITORIAL HERO HEADLINE & INSPIRING VALUE PROP */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-5 sm:space-y-6 mb-10 sm:mb-14">
        
        {/* Luxury Micro-Badge with Pulse Star */}
        <div className="inline-flex items-center gap-2.5 px-4.5 py-1.5 rounded-full backdrop-blur-2xl bg-gold-500/10 border border-gold-500/40 text-xs font-bold text-gold-300 shadow-[0_0_25px_rgba(229,169,98,0.28)] transition-all hover:scale-105">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-400" />
          </span>
          <Compass className="w-3.5 h-3.5 text-gold-400 animate-spin [animation-duration:22s]" />
          <span>
            {language === 'ar'
              ? `عروس البحر الأحمر • ${atmosphere.phaseNameAr} (${atmosphere.temperatureC}°C)`
              : `Bride of the Red Sea • ${atmosphere.phaseNameEn} (${atmosphere.temperatureC}°C)`}
          </span>
        </div>

        {/* Master Headline with Luxury Arabic Typography */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white tracking-normal max-w-4xl mx-auto flex flex-col items-center gap-3 sm:gap-5">
          {language === 'ar' ? (
            <>
              <span className="block text-white tracking-wide">
                عروس البحر الأحمر&nbsp;&nbsp;بين يديك..
              </span>
              <span className="block text-white">
                <span className="text-shimmer-gold font-bold">
                  جداول
                </span>{' '}
                ترتب طلعتك من وإلى
              </span>
            </>
          ) : (
            <>
              <span className="block text-white">
                Bride of the Red Sea in Your Hands..
              </span>
              <span className="block text-white">
                <span className="text-shimmer-gold font-bold">
                  Jadawel
                </span>{' '}
                curates your outing from start to finish
              </span>
            </>
          )}
        </h1>

        {/* Generous Subheading */}
        <p className="text-xs sm:text-sm md:text-base text-white/75 max-w-2xl mx-auto font-normal leading-relaxed">
          {language === 'ar'
            ? 'من شواطئ ونوادي أبحر إلى أزقة البلد التاريخية — اختر مودك وميزانيتك، وسنصنع لك مساراً سينمائياً متكاملاً بدقة متناهية.'
            : 'From Obhur beach clubs to historic Al-Balad alleys — choose your vibe and budget, and let our engine orchestrate a seamless luxury itinerary.'}
        </p>

        {/* Quick Mood Chips (Linear / Apple Tier) */}
        <div className="w-full flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 pt-2">
          {QUICK_MOODS.map((mood) => {
            const isActive = activeMoodId === mood.id;
            return (
              <button
                key={mood.id}
                type="button"
                onClick={() => handleApplyMood(mood)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center whitespace-nowrap shadow-sm touch-manipulation ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-stone-950 font-bold shadow-[0_0_22px_rgba(245,158,11,0.4)] border border-amber-400/40 scale-[1.02]'
                    : 'bg-[#12161f]/80 hover:bg-[#1a202c]/90 text-white/85 hover:text-white border border-white/[0.12] backdrop-blur-md hover:border-white/25'
                }`}
              >
                <span>{language === 'ar' ? mood.labelAr : mood.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. DYNAMIC DESTINATION SHOWCASE (3D PERSPECTIVE CARDS)   */}
      {/* ======================================================== */}
      <div className="relative z-10 w-full max-w-5xl mx-auto mb-10 sm:mb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {DESTINATIONS.map((dest, idx) => (
            <DestinationTiltCard
              key={dest.id}
              dest={dest}
              idx={idx}
              isSelected={activeIdx === idx}
              onSelect={() => handleSelectDestination(idx)}
            />
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. THE ULTRA-MODERN TRIP ENGINE (MODULAR COMMAND PILL)  */}
      {/* ======================================================== */}
      <div
        ref={searchBarRef}
        className="relative z-30 w-full max-w-5xl mx-auto"
      >
        {/* Soft Ambient Glow Halo behind the Dock */}
        <div className="absolute -inset-2 bg-gradient-to-r from-gold-500/10 via-amber-500/5 to-teal-500/10 rounded-[2.5rem] blur-2xl -z-10 pointer-events-none" />

        <div className="glass-specular relative p-2.5 sm:p-3 rounded-[2rem] bg-[#0E131C]/90 backdrop-blur-2xl border border-white/[0.12] shadow-[0_24px_70px_rgba(0,0,0,0.85)]">
          
          {/* Main 5 Pillars Cockpit Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 items-center">
            
            {/* PILLAR 1: DISTRICT / LOCATION */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setActivePopover(activePopover === 'district' ? null : 'district');
                }}
                className={`w-full text-start p-3 sm:p-3.5 rounded-2xl transition-all flex items-center gap-3 cursor-pointer ${
                  activePopover === 'district'
                    ? 'bg-white/10 border border-gold-500/40 shadow-inner'
                    : 'hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[11px] font-bold text-white/50 block">المنطقة</span>
                  <span className="text-xs sm:text-sm font-black text-white truncate block">
                    {currentDistrictObj.nameAr}
                  </span>
                </div>
              </button>

              {/* DISTRICT POPOVER */}
              <AnimatePresence>
                {activePopover === 'district' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full mt-2 right-0 sm:right-auto sm:left-0 w-72 sm:w-80 p-2.5 rounded-2xl bg-[#0F141D] backdrop-blur-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 space-y-1.5"
                  >
                    <div className="px-2 py-1 text-[11px] font-black text-gold-400 border-b border-white/10 pb-1.5">
                      اختر وجهة الانطلاق في جدة:
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                      {DISTRICT_OPTIONS.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            setDistrict(d.id);
                            setActivePopover(null);
                          }}
                          className={`w-full p-2.5 rounded-xl text-start flex items-center justify-between transition-all cursor-pointer ${
                            district === d.id
                              ? 'bg-gold-500/20 text-gold-300 font-black border border-gold-500/30'
                              : 'hover:bg-white/5 text-white/80'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg">{d.icon}</span>
                            <div>
                              <span className="text-xs font-bold block">{d.nameAr}</span>
                              <span className="text-[10px] text-white/40 block">{d.subAr}</span>
                            </div>
                          </div>
                          {district === d.id && <Check className="w-4 h-4 text-gold-400 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* PILLAR 2: COMPANIONS */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setActivePopover(activePopover === 'companions' ? null : 'companions');
                }}
                className={`w-full text-start p-3 sm:p-3.5 rounded-2xl transition-all flex items-center gap-3 cursor-pointer ${
                  activePopover === 'companions'
                    ? 'bg-white/10 border border-teal-500/40 shadow-inner'
                    : 'hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[11px] font-bold text-white/50 block">الرفقة</span>
                  <span className="text-xs sm:text-sm font-black text-white truncate block">
                    {currentCompanionObj.labelAr}
                  </span>
                </div>
              </button>

              {/* COMPANIONS POPOVER */}
              <AnimatePresence>
                {activePopover === 'companions' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full mt-2 right-0 sm:right-auto sm:left-0 w-64 sm:w-72 p-2.5 rounded-2xl bg-[#0F141D] backdrop-blur-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 space-y-1.5"
                  >
                    <div className="px-2 py-1 text-[11px] font-black text-teal-400 border-b border-white/10 pb-1.5">
                      مين طالع معاك اليوم؟
                    </div>
                    {COMPANION_OPTIONS.map((c) => {
                      const Icon = c.icon;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            setCompanions(c.id);
                            setActivePopover(null);
                          }}
                          className={`w-full p-2.5 rounded-xl text-start flex items-center justify-between transition-all cursor-pointer ${
                            companions === c.id
                              ? 'bg-teal-500/20 text-teal-300 font-black border border-teal-500/30'
                              : 'hover:bg-white/5 text-white/80'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4 text-teal-400 shrink-0" />
                            <div>
                              <span className="text-xs font-bold block">{c.labelAr}</span>
                              <span className="text-[10px] text-white/40 block">{c.subAr}</span>
                            </div>
                          </div>
                          {companions === c.id && <Check className="w-4 h-4 text-teal-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* PILLAR 3: BUDGET TIER */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setActivePopover(activePopover === 'budget' ? null : 'budget');
                }}
                className={`w-full text-start p-3 sm:p-3.5 rounded-2xl transition-all flex items-center gap-3 cursor-pointer ${
                  activePopover === 'budget'
                    ? 'bg-white/10 border border-amber-500/40 shadow-inner'
                    : 'hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Coins className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[11px] font-bold text-white/50 block">الميزانية</span>
                  <span className="text-xs sm:text-sm font-black text-white truncate block">
                    {currentBudgetObj.labelAr}
                  </span>
                </div>
              </button>

              {/* BUDGET POPOVER */}
              <AnimatePresence>
                {activePopover === 'budget' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full mt-2 right-0 sm:right-auto sm:left-0 w-64 sm:w-72 p-2.5 rounded-2xl bg-[#0F141D] backdrop-blur-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 space-y-1.5"
                  >
                    <div className="px-2 py-1 text-[11px] font-black text-amber-400 border-b border-white/10 pb-1.5">
                      حدد سقف الصرف للطلعة:
                    </div>
                    {BUDGET_OPTIONS.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setBudget(b.id);
                          setActivePopover(null);
                        }}
                        className={`w-full p-2.5 rounded-xl text-start flex items-center justify-between transition-all cursor-pointer ${
                          budget === b.id
                            ? 'bg-amber-500/20 text-amber-300 font-black border border-amber-500/30'
                            : 'hover:bg-white/5 text-white/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{b.icon}</span>
                          <div>
                            <span className="text-xs font-bold block">{b.labelAr}</span>
                            <span className="text-[10px] text-white/40 block">{b.priceAr}</span>
                          </div>
                        </div>
                        {budget === b.id && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* PILLAR 4: DURATION */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setActivePopover(activePopover === 'duration' ? null : 'duration');
                }}
                className={`w-full text-start p-3 sm:p-3.5 rounded-2xl transition-all flex items-center gap-3 cursor-pointer ${
                  activePopover === 'duration'
                    ? 'bg-white/10 border border-sky-500/40 shadow-inner'
                    : 'hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[11px] font-bold text-white/50 block">المدة</span>
                  <span className="text-xs sm:text-sm font-black text-white truncate block">
                    {currentDurationObj.labelAr}
                  </span>
                </div>
              </button>

              {/* DURATION POPOVER */}
              <AnimatePresence>
                {activePopover === 'duration' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full mt-2 left-0 w-64 sm:w-72 p-2.5 rounded-2xl bg-[#0F141D] backdrop-blur-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 space-y-1.5"
                  >
                    <div className="px-2 py-1 text-[11px] font-black text-sky-400 border-b border-white/10 pb-1.5">
                      كم وقت مخصص للطلعة؟
                    </div>
                    {DURATION_OPTIONS.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setDuration(d.id);
                          setActivePopover(null);
                        }}
                        className={`w-full p-2.5 rounded-xl text-start flex items-center justify-between transition-all cursor-pointer ${
                          duration === d.id
                            ? 'bg-sky-500/20 text-sky-300 font-black border border-sky-500/30'
                            : 'hover:bg-white/5 text-white/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{d.icon}</span>
                          <div>
                            <span className="text-xs font-bold block">{d.labelAr}</span>
                            <span className="text-[10px] text-white/40 block">{d.subAr}</span>
                          </div>
                        </div>
                        {duration === d.id && <Check className="w-4 h-4 text-sky-400 shrink-0" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* PILLAR 5: VIBE */}
            <div className="relative col-span-2 md:col-span-1">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setActivePopover(activePopover === 'vibe' ? null : 'vibe');
                }}
                className={`w-full text-start p-3 sm:p-3.5 rounded-2xl transition-all flex items-center gap-3 cursor-pointer ${
                  activePopover === 'vibe'
                    ? 'bg-white/10 border border-purple-500/40 shadow-inner'
                    : 'hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[11px] font-bold text-white/50 block">المود</span>
                  <span className="text-xs sm:text-sm font-black text-white truncate block">
                    {currentVibeObj.labelAr}
                  </span>
                </div>
              </button>

              {/* VIBE POPOVER */}
              <AnimatePresence>
                {activePopover === 'vibe' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full mt-2 left-0 w-64 sm:w-72 p-2.5 rounded-2xl bg-[#0F141D] backdrop-blur-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 space-y-1.5"
                  >
                    <div className="px-2 py-1 text-[11px] font-black text-purple-400 border-b border-white/10 pb-1.5">
                      وش الجو اللي ببالك؟
                    </div>
                    {VIBE_OPTIONS.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setVibe(v.id);
                          setActivePopover(null);
                        }}
                        className={`w-full p-2.5 rounded-xl text-start flex items-center justify-between transition-all cursor-pointer ${
                          vibe === v.id
                            ? 'bg-purple-500/20 text-purple-300 font-black border border-purple-500/30'
                            : 'hover:bg-white/5 text-white/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{v.icon}</span>
                          <div>
                            <span className="text-xs font-bold block">{v.labelAr}</span>
                            <span className="text-[10px] text-white/40 block">{v.subAr}</span>
                          </div>
                        </div>
                        {vibe === v.id && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* PRIMARY SHOW-STOPPING CTA BUTTON */}
          <div className="mt-3 pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-white/60 font-medium px-2">
              <Zap className="w-4 h-4 text-gold-400" />
              <span>محرك ذكي يُحلل 50+ موقعاً ومساراً في ثوانٍ</span>
            </div>

            <div className="relative group w-full sm:w-auto">
              {/* Cinematic Ambient Halo Behind Button */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500 via-gold-400 to-teal-500 opacity-60 blur-lg group-hover:opacity-100 group-hover:blur-xl transition-all duration-500 animate-pulse" />

              <motion.button
                type="button"
                onClick={handleBuildPlan}
                disabled={isGeneratingPlan}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full sm:w-auto px-7 sm:px-11 py-4 rounded-2xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 text-[#090B0E] font-bold text-sm sm:text-base tracking-normal flex items-center justify-center gap-3 shadow-[0_0_35px_rgba(229,169,98,0.45)] hover:shadow-[0_0_55px_rgba(229,169,98,0.8)] cursor-pointer overflow-hidden transition-all duration-300 touch-manipulation"
              >
                {/* Conic Glow Shimmer Layer */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%)] bg-[length:250%_250%] opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity pointer-events-none" />

                {/* Top specular highlight */}
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

                {isGeneratingPlan ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#090B0E] border-t-transparent rounded-full animate-spin" />
                    <span>جاري هندسة خطتك في جدة...</span>
                  </>
                ) : (
                  <>
                    <ArrowLeft className="w-5 h-5 text-[#090B0E] group-hover:-translate-x-1.5 transition-transform" />
                    <span>ابنِ خطتي لجدة بنقرة واحدة ✨</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

        </div>
      </div>

      </motion.div>

    </section>
  );
};

export default HeroSection;
