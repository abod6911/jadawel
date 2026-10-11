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
  Film,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useItineraryStore } from '@/store/useItineraryStore';
import { useLanguage } from '@/hooks/useLanguage';
import { soundEngine } from '@/utils/audioEngine';
import { getAssetUrl } from '@/utils/paths';
import { getJeddahAtmosphere } from '@/utils/atmosphereEngine';
import { MagneticButton } from '@/components/fancy/MagneticButton';
import { BorderBeam } from '@/components/fancy/BorderBeam';
import { TextRotate } from '@/components/fancy/TextRotate';
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
  onLaunch?: () => void;
}> = ({ dest, idx, isSelected, onSelect, onLaunch }) => {
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
      className={`relative group h-52 sm:h-60 rounded-3xl overflow-hidden cursor-pointer border transition-colors duration-300 shadow-2xl select-none ${
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
            <span>{dest.name}</span>
          </h3>
          <p className="text-xs text-white/70 line-clamp-1 mt-1 font-medium">
            {dest.tagline}
          </p>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] font-bold text-gold-400 group-hover:text-gold-300 flex items-center gap-1 transition-colors">
              <span>استكشف هذا المسار</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onLaunch?.();
              }}
              className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gold-500/20 hover:bg-gold-500 hover:text-stone-950 text-gold-300 border border-gold-500/40 transition-all cursor-pointer"
            >
              تشغيل فوري ⚡
            </button>
          </div>
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

  // Video & Sound Controls State
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

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
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleVideo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEngine.playClick();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsVideoPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsVideoPlaying(false);
    }
  };

  const handleToggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEngine.playClick();
    const video = videoRef.current;
    if (!video) return;
    if (video.muted) {
      video.muted = false;
      setIsVideoMuted(false);
    } else {
      video.muted = true;
      setIsVideoMuted(true);
    }
  };

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

    // Accessibility & Data Saver: Disable video on reduced-motion or slow 2G connection
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const navConn = typeof navigator !== 'undefined' ? (navigator as any).connection : undefined;
    const isSlowConnection = navConn?.saveData === true || ['slow-2g', '2g'].includes(navConn?.effectiveType);

    if (prefersReducedMotion || isSlowConnection) {
      video.pause();
      return;
    }

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
      className="relative w-full rounded-[2.5rem] overflow-hidden px-3 sm:px-8 py-8 sm:py-16 select-none border border-cyan-500/20 shadow-[0_24px_70px_rgba(2,8,23,0.9)] bg-[#070B14]"
    >
      
      {/* ======================================================== */}
      {/* 1. ATMOSPHERIC CANVAS: DEEP SAPPHIRE & RED SEA TWILIGHT  */}
      {/* ======================================================== */}
      <div className="absolute inset-0 z-0 bg-[#070B14] overflow-hidden">
        {/* Native Looping Jeddah Corniche Video - Full Atmospheric Vibe */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={getAssetUrl('/images/places/indigo-beach.jpg')}
          className="w-full h-full object-cover brightness-[0.88] contrast-[1.14] saturate-[1.05]"
        >
          <source src={getAssetUrl('/videos/jeddah-corniche.mp4')} type="video/mp4" />
        </video>

        {/* Obsidian Noir & Champagne Gold Ambient Glows */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none ${
            isIntroStage ? 'opacity-20' : 'opacity-70'
          } bg-gradient-to-t from-[#0B0D12] via-[#0B0D12]/60 to-[#0B0D12]/20`}
        />
        {/* Dynamic Atmosphere Radial Gradient */}
        <div
          className={`absolute inset-0 pointer-events-none transition-all duration-1000 ${
            atmosphere.phase === 'golden_hour'
              ? 'bg-[radial-gradient(ellipse_at_top,rgba(229,195,120,0.22)_0%,rgba(18,21,28,0.4)_45%,transparent_75%)]'
              : atmosphere.phase === 'daytime'
                ? 'bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.2)_0%,rgba(18,21,28,0.4)_40%,transparent_75%)]'
                : 'bg-[radial-gradient(ellipse_at_top,rgba(229,195,120,0.16)_0%,rgba(18,21,28,0.5)_35%,transparent_75%)]'
          }`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(229,195,120,0.08)_0%,transparent_70%)] pointer-events-none" />

        {/* Cinematic Lens Vignette & 35mm Film Grain */}
        <div className="cinematic-vignette absolute inset-0 z-0 pointer-events-none" />
        <div className="cinematic-film-grain absolute inset-0 z-0 pointer-events-none" />

        {/* Cinematic Floating Champagne Gold Twilight Embers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-10 left-[15%] w-2 h-2 rounded-full bg-[#E5C378] blur-[1px] animate-ember opacity-40" />
          <div className="absolute bottom-24 right-[20%] w-1.5 h-1.5 rounded-full bg-[#F5E2B3] blur-[1px] animate-ember opacity-60 [animation-delay:1.5s]" />
          <div className="absolute bottom-16 left-[45%] w-2.5 h-2.5 rounded-full bg-[#C8A452] blur-[1px] animate-ember opacity-30 [animation-delay:3s]" />
          <div className="absolute bottom-32 right-[40%] w-1.5 h-1.5 rounded-full bg-[#E5C378] blur-[1px] animate-ember opacity-50 [animation-delay:2.2s]" />
        </div>

        {/* Subtle Ambient SVG Floating Light Ray particles */}
        <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="particleGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#E5C378" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#E5C378" stopOpacity="0.9" />
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
        
        {/* Atmosphere & Video Controls Floating Pill */}
        <div className="w-full max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 px-2 mb-2 sm:mb-4">
          {/* Luxury Micro-Badge with Pulse Star */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full backdrop-blur-2xl bg-[#12151C]/80 border border-[#E5C378]/35 text-xs font-bold text-[#F5E2B3] shadow-[0_0_25px_rgba(229,195,120,0.25)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5C378] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E5C378]" />
            </span>
            <Compass className="w-3.5 h-3.5 text-[#E5C378] animate-spin [animation-duration:22s]" />
            <span>
              {language === 'ar'
                ? `عروس البحر الأحمر • ${atmosphere.phaseNameAr} (${atmosphere.temperatureC}°C)`
                : `Bride of the Red Sea • ${atmosphere.phaseNameEn} (${atmosphere.temperatureC}°C)`}
            </span>
          </div>

          {/* Video Playback & Ocean Waves Sound Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleSound}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md ${
                !isVideoMuted
                  ? 'bg-[#E5C378]/25 border-[#E5C378]/50 text-[#F5E2B3] shadow-[0_0_15px_rgba(229,195,120,0.35)]'
                  : 'bg-black/50 border-white/15 text-white/60 hover:text-white'
              }`}
              title={language === 'ar' ? (isVideoMuted ? 'تشغيل صوت أمواج البحر' : 'كتم الصوت') : (isVideoMuted ? 'Play Waves Sound' : 'Mute Sound')}
            >
              {!isVideoMuted ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#E5C378] animate-pulse" />
                  <span className="text-[11px] font-bold">صوت البحر 🌊</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-white/50" />
                  <span className="text-[11px] font-bold">صامت</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleToggleVideo}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md ${
                isVideoPlaying
                  ? 'bg-teal-500/20 border-teal-500/40 text-teal-300 shadow-[0_0_12px_rgba(45,212,191,0.2)]'
                  : 'bg-black/50 border-white/15 text-white/60 hover:text-white'
              }`}
              title={language === 'ar' ? (isVideoPlaying ? 'إيقاف الفيديو مؤقتاً' : 'تشغيل فيديو جدة') : (isVideoPlaying ? 'Pause Video' : 'Play Video')}
            >
              <Film className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">{isVideoPlaying ? 'فيديو جدة' : 'تشغيل ▶'}</span>
            </button>
          </div>
        </div>

        {/* Master Headline with Clean Modern Arabic Typography & Generous Spacing */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-white tracking-normal max-w-4xl mx-auto flex flex-col items-center gap-4 sm:gap-6 leading-[1.3] select-none">
          {language === 'ar' ? (
            <>
              <span className="block text-white font-bold tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                عروس البحر الأحمر&nbsp;&nbsp;بين يديك..
              </span>
              <span className="block text-white font-bold tracking-normal drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                <span className="text-shimmer-champagne font-black">
                  جداول
                </span>{' '}
                ترتب طلعتك من وإلى
              </span>
            </>
          ) : (
            <>
              <span className="block text-white font-bold tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                Bride of the Red Sea in Your Hands..
              </span>
              <span className="block text-white font-bold tracking-normal drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                <span className="text-shimmer-champagne font-black">
                  Jadawel
                </span>{' '}
                curates your outing from start to finish
              </span>
            </>
          )}
        </h1>

        {/* Generous Subheading in Refined Light Platinum Font */}
        <p className="text-sm sm:text-base md:text-lg text-[#E2E8F0] max-w-2xl mx-auto font-normal leading-relaxed tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] pt-1">
          {language === 'ar'
            ? 'من شواطئ ونوادي أبحر إلى أزقة البلد التاريخية – اختر مودك وميزانيتك، وسنصنع لك مساراً سينمائياً متكاملاً بدقة متناهية.'
            : 'From Obhur beach clubs to historic Al-Balad alleys – choose your vibe and budget, and let our engine orchestrate a seamless luxury itinerary.'}
        </p>

        {/* Quick Mood Chips (Obsidian Noir & Warm Glowing Amber-Gold Capsule) */}
        <div className="w-full flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 pt-3">
          {QUICK_MOODS.map((mood) => {
            const isActive = activeMoodId === mood.id;
            return (
              <button
                key={mood.id}
                type="button"
                onClick={() => handleApplyMood(mood)}
                className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer flex items-center justify-center whitespace-nowrap touch-manipulation relative group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] text-[#0B0D12] font-black shadow-[0_0_28px_rgba(229,195,120,0.55)] border border-[#FFF1CC] scale-[1.04]'
                    : 'bg-[#12151C]/75 hover:bg-[#1A1F2C]/90 text-slate-200 hover:text-white border border-white/[0.08] hover:border-[#E5C378]/30 backdrop-blur-xl shadow-lg'
                }`}
              >
                <span>{language === 'ar' ? mood.labelAr : mood.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. CENTRAL TRIP ENGINE COCKPIT (FRONT & CENTER LUXURY)   */}
      {/* ======================================================== */}
      <div
        ref={searchBarRef}
        className="relative z-30 w-full max-w-5xl mx-auto mb-12 sm:mb-16"
      >
        {/* Ambient Halo Behind Cockpit */}
        <div className="absolute -inset-3 bg-gradient-to-r from-[#E5C378]/15 via-[#DF9F3D]/10 to-[#C8A452]/15 rounded-[2.8rem] blur-3xl -z-10 pointer-events-none" />

        {/* Dynamic Live Prompter Bar with TextRotate */}
        <div className="flex items-center justify-between px-4 sm:px-6 mb-3 text-xs text-white/80">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5C378] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E5C378]" />
            </span>
            <span className="text-white/70 font-bold">{language === 'ar' ? 'جاهز لاستكشاف:' : 'Ready to explore:'}</span>
            <TextRotate
              texts={
                language === 'ar'
                  ? [
                      'شواطئ ونوادي أبحر الفارهة 🌊',
                      'محامص وكافيهات الروضة الرايقة ☕',
                      'رواشين البلد وتراث اليونسكو 🏛️',
                      'سهرات الواجهة البحرية واليخوت 👑',
                      'ممشى الكورنيش والحدائق المجانية 🌴',
                    ]
                  : [
                      'Obhur Luxury Beach Clubs 🌊',
                      'Al-Rawdah Specialty Coffee & Cafes ☕',
                      'Historic Al-Balad Heritage 🏛️',
                      'VIP Waterfront & Yacht Lounges 👑',
                      'Scenic Corniche Walks 🌴',
                    ]
              }
              className="text-[#F5E2B3] font-bold"
            />
          </div>
          <span className="text-[11px] text-white/50 hidden sm:inline font-medium">
            {language === 'ar' ? 'تحكّم في خطتك بنقرة واحدة مباشرة بالأسفل ↓' : 'One-tap tactile controls below ↓'}
          </span>
        </div>

        {/* Main Cockpit Shell with Laser Border Beam (Ultra-Premium Smoky Obsidian Glass) */}
        <div className="glass-specular relative p-5 sm:p-8 rounded-[2.5rem] bg-[#0E1118]/75 backdrop-blur-3xl border border-[#E5C378]/35 shadow-[0_28px_90px_rgba(0,0,0,0.92)] overflow-hidden space-y-6">
          <BorderBeam size={340} duration={14} borderWidth={1.5} colorFrom="#E5C378" colorTo="#F3DA9C" />

          {/* CONTROL RAIL 1: DISTRICT / LOCATION */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-white/70 px-1">
              <span className="flex items-center gap-1.5 text-[#E5C378]">
                <MapPin className="w-4 h-4 text-[#E5C378]" />
                <span>{language === 'ar' ? '1. منطقة الانطلاق في جدة:' : '1. Starting Location:'}</span>
              </span>
              <span className="text-slate-400 text-[11px]">{currentDistrictObj.subAr}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {DISTRICT_OPTIONS.map((d) => {
                const isSelected = district === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setDistrict(d.id);
                    }}
                    className={`px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1 border text-center ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#E5C378]/25 to-[#C8A452]/10 border-[#E5C378] text-[#F5E2B3] shadow-[0_0_20px_rgba(229,195,120,0.4)] scale-[1.02]'
                        : 'bg-[#131722]/60 hover:bg-[#1A1F2C]/80 border-white/[0.08] hover:border-[#E5C378]/30 text-slate-300 hover:text-white backdrop-blur-xl'
                    }`}
                  >
                    <span className="text-base">{d.icon}</span>
                    <span className="truncate w-full">{language === 'ar' ? d.nameAr : d.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CONTROL RAILS 2, 3, 4: COMPANIONS, BUDGET, DURATION IN A 3-COLUMN RESPONSIVE GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1 border-t border-white/[0.08]">
            {/* COMPANIONS */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#E5C378] px-1">
                <Users className="w-4 h-4 text-[#E5C378]" />
                <span>{language === 'ar' ? '2. الرفقة:' : '2. Companions:'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {COMPANION_OPTIONS.map((c) => {
                  const isSelected = companions === c.id;
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setCompanions(c.id);
                      }}
                      className={`px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#E5C378]/25 to-[#C8A452]/10 border-[#E5C378] text-[#F5E2B3] shadow-[0_0_20px_rgba(229,195,120,0.4)] scale-[1.02]'
                          : 'bg-[#131722]/60 hover:bg-[#1A1F2C]/80 border-white/[0.08] hover:border-[#E5C378]/30 text-slate-300 hover:text-white backdrop-blur-xl'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0 text-[#E5C378]" />
                      <span>{language === 'ar' ? c.labelAr : c.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BUDGET */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#E5C378] px-1">
                <Coins className="w-4 h-4 text-[#E5C378]" />
                <span>{language === 'ar' ? '3. الميزانية للشخص:' : '3. Budget:'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {BUDGET_OPTIONS.map((b) => {
                  const isSelected = budget === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setBudget(b.id);
                      }}
                      className={`px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#E5C378]/25 to-[#C8A452]/10 border-[#E5C378] text-[#F5E2B3] shadow-[0_0_20px_rgba(229,195,120,0.4)] scale-[1.02]'
                          : 'bg-[#131722]/60 hover:bg-[#1A1F2C]/80 border-white/[0.08] hover:border-[#E5C378]/30 text-slate-300 hover:text-white backdrop-blur-xl'
                      }`}
                    >
                      <span className="text-sm">{b.icon}</span>
                      <span>{language === 'ar' ? b.labelAr : b.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DURATION */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#E5C378] px-1">
                <Clock className="w-4 h-4 text-[#E5C378]" />
                <span>{language === 'ar' ? '4. المدة المتاحة:' : '4. Duration:'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {DURATION_OPTIONS.slice(0, 4).map((d) => {
                  const isSelected = duration === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setDuration(d.id);
                      }}
                      className={`px-2.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 border ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#E5C378]/25 to-[#C8A452]/10 border-[#E5C378] text-[#F5E2B3] shadow-[0_0_20px_rgba(229,195,120,0.4)] scale-[1.02]'
                          : 'bg-[#131722]/60 hover:bg-[#1A1F2C]/80 border-white/[0.08] hover:border-[#E5C378]/30 text-slate-300 hover:text-white backdrop-blur-xl'
                      }`}
                    >
                      <span className="text-sm">{d.icon}</span>
                      <span className="truncate">{language === 'ar' ? d.labelAr : d.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* DYNAMIC LIVE PLAN SYNTHESIS HUD BAR (Elegant Obsidian Bar with Subtle Cyan/Teal Indicator) */}
          <div className="pt-2">
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#0B0D12]/95 border border-[#E5C378]/30 text-xs shadow-xl">
              <div className="flex flex-wrap items-center gap-2 text-white/90 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5C378] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E5C378]" />
                </span>
                <span className="text-[#E5C378] font-black">{language === 'ar' ? 'ملخص المسار المختار:' : 'Selected Plan:'}</span>
                <span className="text-white font-bold">{currentDistrictObj.nameAr}</span>
                <span className="text-white/30">•</span>
                <span className="text-[#F5E2B3] font-bold">{currentCompanionObj.labelAr}</span>
                <span className="text-white/30">•</span>
                <span className="text-[#F5E2B3] font-bold">{currentBudgetObj.labelAr}</span>
                <span className="text-white/30">•</span>
                <span className="text-[#F5E2B3] font-bold">{currentDurationObj.labelAr}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-teal-200 bg-teal-500/15 border border-teal-400/50 px-3 py-1 rounded-full font-bold shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                <Check className="w-3.5 h-3.5 text-teal-300" />
                <span>{language === 'ar' ? 'مسار جغرافي متصل بدون زحمة' : 'Zero-traffic optimized route'}</span>
              </div>
            </div>
          </div>

          {/* PRIMARY SHOW-STOPPING CTA LAUNCH BUTTON */}
          <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-white/60 font-medium px-1">
              <Zap className="w-4 h-4 text-[#E5C378]" />
              <span>{language === 'ar' ? 'محرك ذكي يُحلل 50+ موقعاً ومساراً في ثوانٍ مع خريطة تفاعلية' : 'AI engine analyzes 50+ spots with interactive map'}</span>
            </div>

            <div className="relative group w-full sm:w-auto">
              <MagneticButton distance={0.25} strength={1}>
                {/* Cinematic Ambient Halo Behind Button */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] opacity-70 blur-lg group-hover:opacity-100 group-hover:blur-xl transition-all duration-500 animate-pulse" />

                <motion.button
                  type="button"
                  onClick={handleBuildPlan}
                  disabled={isGeneratingPlan}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full sm:w-auto px-8 sm:px-12 py-4 rounded-2xl bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] text-[#0B0D12] font-black text-sm sm:text-base tracking-normal flex items-center justify-center gap-3 shadow-[0_0_35px_rgba(229,195,120,0.5)] hover:shadow-[0_0_60px_rgba(229,195,120,0.85)] border border-[#FFF1CC]/60 cursor-pointer overflow-hidden transition-all duration-300 touch-manipulation"
                >
                  {/* Conic Glow Shimmer Layer */}
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%)] bg-[length:250%_250%] opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity pointer-events-none" />

                  {/* Top specular highlight */}
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none" />

                  {isGeneratingPlan ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#0B0D12] border-t-transparent rounded-full animate-spin" />
                      <span>{language === 'ar' ? 'جاري هندسة خطتك في جدة...' : 'Generating your plan...'}</span>
                    </>
                  ) : (
                    <>
                      <ArrowLeft className="w-5 h-5 text-[#0B0D12] group-hover:-translate-x-1.5 transition-transform" />
                      <span>{language === 'ar' ? 'ابنِ خطتي لجدة بنقرة واحدة ✨' : 'Build My Plan in 1-Click ✨'}</span>
                    </>
                  )}
                </motion.button>
              </MagneticButton>
            </div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. DYNAMIC DESTINATION SHOWCASE (3D PERSPECTIVE CARDS)   */}
      {/* ======================================================== */}
      <div className="relative z-10 w-full max-w-5xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-gold-400">✦</span>
              <span>{language === 'ar' ? 'مسارات أيقونية جاهزة للتجربة الفورية' : 'Iconic Ready-to-Experience Itineraries'}</span>
            </h2>
            <p className="text-xs text-white/60 font-normal">
              {language === 'ar' ? 'انقر على أي وجهة لضبط المحرك واستكشاف مسارها بالكامل' : 'Click any card to load its tailored itinerary directly'}
            </p>
          </div>
          <span className="text-xs text-gold-400/90 font-bold hidden sm:inline">
            {language === 'ar' ? '3 مسارات مختارة بدقة ⚡' : '3 Curated Experiences ⚡'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {DESTINATIONS.map((dest, idx) => (
            <DestinationTiltCard
              key={dest.id}
              dest={dest}
              idx={idx}
              isSelected={activeIdx === idx}
              onSelect={() => handleSelectDestination(idx)}
              onLaunch={() => {
                handleSelectDestination(idx);
                setTimeout(handleBuildPlan, 50);
              }}
            />
          ))}
        </div>
      </div>

      </motion.div>

    </section>
  );
};

export default HeroSection;
