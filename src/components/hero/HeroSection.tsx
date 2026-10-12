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
      className={`relative group h-44 sm:h-60 rounded-3xl overflow-hidden cursor-pointer border transition-colors duration-300 shadow-2xl select-none ${
        isSelected
          ? 'border-[#E5C378]/70 shadow-[0_12px_36px_rgba(0,0,0,0.6)] ring-1 ring-[#E5C378]/40'
          : 'border-white/10 hover:border-[#E5C378]/30 shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
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

  // Cinematic Entrance: Showcase pure Jeddah video scenery first (~4.5s) on desktop, instant on mobile
  const [isIntroStage, setIsIntroStage] = useState(false);

  useEffect(() => {
    // Only enable intro video delay on desktop screens (>= 768px), reveal instantly on mobile
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setIsIntroStage(true);
      const timer = setTimeout(() => {
        setIsIntroStage(false);
      }, 4500);

      const handleScroll = () => {
        if (window.scrollY > 30) {
          setIsIntroStage(false);
        }
      };
      window.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', handleScroll);
      };
    } else {
      setIsIntroStage(false);
    }
  }, []);


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

  // HTML5 Video Autoplay Lifecycle (Bulletproof ambient background video playback)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Enforce HTML5 autoplay policies strictly
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('x5-playsinline', 'true');

    const tryPlay = () => {
      if (!video) return;
      video.muted = true;
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch(() => {
          // Handled gracefully; watchdog or gesture will unlock
        });
      }
    };

    // Immediate attempt
    tryPlay();

    // Attach to all readiness events
    video.addEventListener('loadedmetadata', tryPlay);
    video.addEventListener('loadeddata', tryPlay);
    video.addEventListener('canplay', tryPlay);
    video.addEventListener('canplaythrough', tryPlay);

    // Watchdog retry: Ensures video plays even if browser throttled initial frame
    const watchdog = setInterval(() => {
      if (video && video.paused) {
        tryPlay();
      } else if (video && !video.paused) {
        clearInterval(watchdog);
      }
    }, 250);

    // Keep looping seamlessly
    const handleEnded = () => {
      if (!video) return;
      video.currentTime = 0;
      tryPlay();
    };
    video.addEventListener('ended', handleEnded);

    // Prevent unexpected pausing
    const handlePause = () => {
      if (video && video.paused && document.visibilityState === 'visible') {
        tryPlay();
      }
    };
    video.addEventListener('pause', handlePause);

    // Auto-resume when user returns to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        tryPlay();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Universal gesture unlock for mobile battery-saver / restricted environments
    const unlockOnGesture = () => {
      tryPlay();
    };

    window.addEventListener('pointerdown', unlockOnGesture, { passive: true });
    window.addEventListener('touchstart', unlockOnGesture, { passive: true });
    window.addEventListener('scroll', unlockOnGesture, { passive: true });
    window.addEventListener('keydown', unlockOnGesture, { passive: true });

    return () => {
      clearInterval(watchdog);
      video.removeEventListener('loadedmetadata', tryPlay);
      video.removeEventListener('loadeddata', tryPlay);
      video.removeEventListener('canplay', tryPlay);
      video.removeEventListener('canplaythrough', tryPlay);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('pause', handlePause);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pointerdown', unlockOnGesture);
      window.removeEventListener('touchstart', unlockOnGesture);
      window.removeEventListener('scroll', unlockOnGesture);
      window.removeEventListener('keydown', unlockOnGesture);
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
      className="relative w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden px-2.5 sm:px-8 py-5 sm:py-16 select-none border border-cyan-500/20 shadow-[0_24px_70px_rgba(2,8,23,0.9)] bg-[#070B14]"
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
          preload="auto"
          src={getAssetUrl('/videos/jeddah-corniche.mp4?v=20261012b')}
          className="w-full h-full object-cover brightness-[0.92] contrast-[1.08] saturate-[1.05]"
        >
          <source src={getAssetUrl('/videos/jeddah-corniche.mp4?v=20261012b')} type="video/mp4" />
          <source src={getAssetUrl('/videos/r07qxo-jeddah.mp4?v=20261012b')} type="video/mp4" />
        </video>

        {/* Obsidian Noir & Champagne Gold Ambient Glows (Smooth crossfade from pure scenic video to high-contrast backdrop) */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none ${
            isIntroStage ? 'opacity-10' : 'opacity-45'
          } bg-gradient-to-t from-[#0B0D12] via-[#0B0D12]/30 to-transparent`}
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
        className="relative z-10 w-full max-w-full min-w-0 flex flex-col items-center"
      >
        {/* EDITORIAL HERO HEADLINE & INSPIRING VALUE PROP */}
        <div className="relative z-10 w-full max-w-4xl min-w-0 flex flex-col items-center text-center space-y-3 sm:space-y-6 mb-6 sm:mb-14 px-1">
        
        {/* Subtle Live Atmosphere Badge - Clean & Centered */}
        <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full backdrop-blur-md bg-white/[0.04] border border-white/10 text-[10px] sm:text-xs font-semibold text-slate-300 shadow-sm mb-1 sm:mb-4 max-w-[92vw] overflow-hidden">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <Compass className="w-3.5 h-3.5 text-[#E5C378] shrink-0" />
          <span className="truncate">
            {language === 'ar'
              ? `عروس البحر الأحمر • ${atmosphere.phaseNameAr} (${atmosphere.temperatureC}°C)`
              : `Bride of the Red Sea • ${atmosphere.phaseNameEn} (${atmosphere.temperatureC}°C)`}
          </span>
        </div>

        {/* Master Headline with Clean Modern Arabic Typography & Generous Spacing */}
        <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-[3.25rem] font-bold text-white tracking-normal max-w-4xl mx-auto flex flex-col items-center gap-1.5 sm:gap-5 leading-[1.3] select-none px-2 text-center">
          {language === 'ar' ? (
            <>
              <span className="block text-white font-bold tracking-normal drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                عروس البحر الأحمر بين يديك..
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
              <span className="block text-white font-bold tracking-normal drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
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

        {/* Generous Subheading in Refined Light Platinum Font (Shortened on Mobile) */}
        <p className="text-xs sm:text-base md:text-lg text-[#E2E8F0] max-w-2xl mx-auto font-normal leading-relaxed tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] pt-0.5 px-2">
          {language === 'ar'
            ? 'اختر مودك وميزانيتك، وسنصنع لك مساراً سينمائياً متكاملاً بدقة متناهية.'
            : 'Choose your vibe and budget, and let our engine orchestrate a seamless luxury itinerary.'}
        </p>

        {/* Quick Mood Chips (Smooth Horizontal Swipe Rail on Mobile, Centered Flex on Desktop) */}
        <div className="w-full max-w-full min-w-0 flex items-center justify-start sm:justify-center gap-2 sm:gap-3.5 pt-1.5 sm:pt-3 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 scrollbar-none px-1">
          {QUICK_MOODS.map((mood) => {
            const isActive = activeMoodId === mood.id;
            return (
              <button
                key={mood.id}
                type="button"
                onClick={() => handleApplyMood(mood)}
                className={`px-3.5 sm:px-5 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer flex items-center justify-center whitespace-nowrap touch-manipulation shrink-0 relative group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] text-[#0B0D12] font-black shadow-md border border-[#FFF1CC]/60 scale-[1.02]'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 backdrop-blur-md shadow-sm'
                }`}
              >
                <span>{language === 'ar' ? mood.labelAr : mood.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3A. MOBILE ULTRA-SLEEK GLASS COCKPIT (TOUCH-FIRST & SLIM) */}
      {/* Reduced footprint allows pure video breathing room!       */}
      {/* ======================================================== */}
      <div className="md:hidden w-full max-w-md mx-auto mb-5 px-1 relative z-30">
        <div className="relative p-3 rounded-2xl bg-[#090D14]/90 backdrop-blur-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.8)] space-y-2.5">
          
          {/* Segmented Quick Bar with 3 Elegant Interactive Touch Pills */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10">
            {/* District Pill */}
            <div className="relative flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-white/[0.04] border border-white/10 active:bg-white/[0.1] transition-all">
              <span className="text-[10px] text-[#E5C378] font-bold flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />
                <span>{language === 'ar' ? 'الوجهة' : 'Zone'}</span>
              </span>
              <span className="text-xs font-black text-white truncate max-w-full px-0.5 mt-0.5">
                {currentDistrictObj.nameAr.split(' ')[0]}
              </span>
              <select
                value={district}
                onChange={(e) => {
                  soundEngine.playClick();
                  setDistrict(e.target.value as DistrictId | 'all_jeddah');
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label={language === 'ar' ? 'الوجهة' : 'Destination'}
              >
                {DISTRICT_OPTIONS.map((d) => (
                  <option key={d.id} value={d.id} className="bg-[#0B0D12] text-white">
                    {d.icon} {language === 'ar' ? d.nameAr : d.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Companions Pill */}
            <div className="relative flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-white/[0.04] border border-white/10 active:bg-white/[0.1] transition-all">
              <span className="text-[10px] text-[#E5C378] font-bold flex items-center gap-1">
                <Users className="w-2.5 h-2.5" />
                <span>{language === 'ar' ? 'الرفقة' : 'Who'}</span>
              </span>
              <span className="text-xs font-black text-white truncate max-w-full px-0.5 mt-0.5">
                {language === 'ar' ? currentCompanionObj.labelAr : currentCompanionObj.labelEn}
              </span>
              <select
                value={companions}
                onChange={(e) => {
                  soundEngine.playClick();
                  setCompanions(e.target.value as CompanionType);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label={language === 'ar' ? 'الرفقة' : 'Companions'}
              >
                {COMPANION_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#0B0D12] text-white">
                    {language === 'ar' ? c.labelAr : c.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Pill */}
            <div className="relative flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-white/[0.04] border border-white/10 active:bg-white/[0.1] transition-all">
              <span className="text-[10px] text-[#E5C378] font-bold flex items-center gap-1">
                <Coins className="w-2.5 h-2.5" />
                <span>{language === 'ar' ? 'الميزانية' : 'Budget'}</span>
              </span>
              <span className="text-xs font-black text-white truncate max-w-full px-0.5 mt-0.5">
                {language === 'ar'
                  ? currentBudgetObj.id === 'moderate'
                    ? 'متوسطة'
                    : currentBudgetObj.id === 'free'
                    ? 'مجانية'
                    : currentBudgetObj.id === 'economy'
                    ? 'اقتصادية'
                    : 'VIP فاخرة'
                  : currentBudgetObj.labelEn}
              </span>
              <select
                value={budget}
                onChange={(e) => {
                  soundEngine.playClick();
                  setBudget(e.target.value as BudgetTier);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label={language === 'ar' ? 'الميزانية' : 'Budget'}
              >
                {BUDGET_OPTIONS.map((b) => (
                  <option key={b.id} value={b.id} className="bg-[#0B0D12] text-white">
                    {language === 'ar' ? b.labelAr : b.labelEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PRIMARY SHOW-STOPPING CTA BUTTON */}
          <div>
            <button
              type="button"
              onClick={handleBuildPlan}
              disabled={isGeneratingPlan}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] text-[#0B0D12] font-black text-sm flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(229,195,120,0.4)] active:scale-[0.98] transition-all cursor-pointer"
            >
              {isGeneratingPlan ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0B0D12] border-t-transparent rounded-full animate-spin" />
                  <span>{language === 'ar' ? 'جاري هندسة خطتك في جدة...' : 'Building Itinerary...'}</span>
                </>
              ) : (
                <>
                  <span>{language === 'ar' ? 'ابنِ خطتي لجدة بنقرة واحدة ✨' : 'Build My Plan in 1-Click ✨'}</span>
                  <ArrowLeft className="w-4 h-4 text-[#0B0D12]" />
                </>
              )}
            </button>
          </div>

          {/* Helper Quick Switcher to Wizard */}
          <div className="text-center pt-0.5">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                useItineraryStore.getState().setActiveNavTab('quick-plan');
              }}
              className="text-[11px] text-[#E5C378]/90 hover:text-[#E5C378] font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'ar' ? 'أو خصص خطتك خطوة بخطوة بالصانع الذكي ✦' : 'Or tailor step-by-step with Smart Wizard ✦'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 3B. DESKTOP CENTRAL TRIP ENGINE COCKPIT (FRONT & CENTER) */}
      {/* ======================================================== */}
      <div
        ref={searchBarRef}
        className="hidden md:block relative z-30 w-full max-w-5xl min-w-0 mx-auto mb-12 sm:mb-16"
      >
        {/* Ambient Halo Behind Cockpit */}
        <div className="absolute -inset-2 bg-gradient-to-r from-[#E5C378]/10 via-[#DF9F3D]/5 to-[#C8A452]/10 rounded-[2.8rem] blur-2xl -z-10 pointer-events-none opacity-40" />

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

        {/* Main Cockpit Shell (Ultra-Premium Smoky Obsidian Glass) */}
        <div className="relative p-3.5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-[#0E1118]/85 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] space-y-4 sm:space-y-6">

          {/* CONTROL RAIL 1: DISTRICT / LOCATION */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-white/70 px-1">
              <span className="flex items-center gap-1.5 text-[#E5C378]">
                <MapPin className="w-4 h-4 text-[#E5C378] shrink-0" />
                <span>{language === 'ar' ? '1. منطقة الانطلاق في جدة:' : '1. Starting Location:'}</span>
              </span>
              <span className="text-slate-400 text-[11px] truncate max-w-[200px]">{currentDistrictObj.subAr}</span>
            </div>
            <div className="flex sm:grid sm:grid-cols-4 md:grid-cols-7 gap-1.5 sm:gap-2 overflow-x-auto sm:overflow-visible pb-1.5 sm:pb-0 scrollbar-none snap-x -mx-1 px-1">
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
                    className={`px-3 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer flex sm:flex-col items-center justify-center gap-1.5 border text-center shrink-0 snap-start whitespace-nowrap sm:whitespace-normal touch-manipulation min-h-[38px] sm:min-h-0 ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#E5C378]/25 to-[#C8A452]/15 border-[#E5C378]/70 text-[#F5E2B3] shadow-md scale-[1.02]'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 hover:border-white/20 text-slate-300 hover:text-white backdrop-blur-md'
                    }`}
                  >
                    <span className="text-base leading-none">{d.icon}</span>
                    <span className="truncate">{language === 'ar' ? d.nameAr : d.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CONTROL RAILS 2, 3, 4: COMPANIONS, BUDGET, DURATION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5 pt-1 border-t border-white/[0.08]">
            {/* COMPANIONS */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#E5C378] px-1">
                <Users className="w-4 h-4 text-[#E5C378] shrink-0" />
                <span>{language === 'ar' ? '2. الرفقة:' : '2. Companions:'}</span>
              </div>
              <div className="flex sm:grid sm:grid-cols-2 gap-1.5 sm:gap-2 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 scrollbar-none snap-x -mx-1 px-1">
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
                      className={`px-3 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 border shrink-0 snap-start whitespace-nowrap sm:whitespace-normal touch-manipulation min-h-[38px] sm:min-h-0 ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#E5C378]/25 to-[#C8A452]/15 border-[#E5C378]/70 text-[#F5E2B3] shadow-md scale-[1.02]'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 hover:border-white/20 text-slate-300 hover:text-white backdrop-blur-md'
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
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#E5C378] px-1">
                <Coins className="w-4 h-4 text-[#E5C378] shrink-0" />
                <span>{language === 'ar' ? '3. الميزانية للشخص:' : '3. Budget:'}</span>
              </div>
              <div className="flex sm:grid sm:grid-cols-2 gap-1.5 sm:gap-2 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 scrollbar-none snap-x -mx-1 px-1">
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
                      className={`px-3 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 border shrink-0 snap-start whitespace-nowrap sm:whitespace-normal touch-manipulation min-h-[38px] sm:min-h-0 ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#E5C378]/25 to-[#C8A452]/15 border-[#E5C378]/70 text-[#F5E2B3] shadow-md scale-[1.02]'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 hover:border-white/20 text-slate-300 hover:text-white backdrop-blur-md'
                      }`}
                    >
                      <span className="text-sm leading-none">{b.icon}</span>
                      <span>{language === 'ar' ? b.labelAr : b.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DURATION */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#E5C378] px-1">
                <Clock className="w-4 h-4 text-[#E5C378] shrink-0" />
                <span>{language === 'ar' ? '4. المدة المتاحة:' : '4. Duration:'}</span>
              </div>
              <div className="flex sm:grid sm:grid-cols-2 gap-1.5 sm:gap-2 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 scrollbar-none snap-x -mx-1 px-1">
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
                      className={`px-3 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 border shrink-0 snap-start whitespace-nowrap sm:whitespace-normal touch-manipulation min-h-[38px] sm:min-h-0 ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#E5C378]/25 to-[#C8A452]/15 border-[#E5C378]/70 text-[#F5E2B3] shadow-md scale-[1.02]'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 hover:border-white/20 text-slate-300 hover:text-white backdrop-blur-md'
                      }`}
                    >
                      <span className="text-sm leading-none">{d.icon}</span>
                      <span>{language === 'ar' ? d.labelAr : d.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* DYNAMIC LIVE PLAN SYNTHESIS HUD BAR (Clean Minimalist Obsidian Bar) */}
          <div className="pt-1">
            <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0B0D12]/95 border border-white/10 text-xs shadow-lg">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-white/90 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5C378] opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E5C378]" />
                </span>
                <span className="text-[#E5C378] font-black">{language === 'ar' ? 'ملخص المسار:' : 'Plan:'}</span>
                <span className="text-white font-bold">{currentDistrictObj.nameAr}</span>
                <span className="text-white/30">•</span>
                <span className="text-[#F5E2B3] font-bold">{currentCompanionObj.labelAr}</span>
                <span className="text-white/30">•</span>
                <span className="text-[#F5E2B3] font-bold">{currentBudgetObj.labelAr}</span>
                <span className="text-white/30">•</span>
                <span className="text-[#F5E2B3] font-bold">{currentDurationObj.labelAr}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-teal-200 bg-teal-500/15 border border-teal-400/40 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full font-bold shadow-sm">
                <Check className="w-3.5 h-3.5 text-teal-300" />
                <span>{language === 'ar' ? 'مسار بدون زحمة' : 'Optimized route'}</span>
              </div>
            </div>
          </div>

          {/* PRIMARY SHOW-STOPPING CTA LAUNCH BUTTON */}
          <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 text-xs text-white/60 font-medium px-1 self-start sm:self-auto">
              <Zap className="w-4 h-4 text-[#E5C378] shrink-0" />
              <span>{language === 'ar' ? 'محرك ذكي يُحلل 50+ موقعاً مع خريطة تفاعلية' : 'AI engine analyzes 50+ spots with interactive map'}</span>
            </div>

            <div className="relative group w-full sm:w-auto">
              <MagneticButton distance={0.25} strength={1}>
                {/* Subtle Refined Halo Behind Button */}
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] opacity-30 blur-md group-hover:opacity-50 transition-all duration-300" />

                <motion.button
                  type="button"
                  onClick={handleBuildPlan}
                  disabled={isGeneratingPlan}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full sm:w-auto px-6 sm:px-12 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] text-[#0B0D12] font-black text-sm sm:text-base tracking-normal flex items-center justify-center gap-2.5 sm:gap-3 shadow-[0_8px_24px_rgba(229,195,120,0.35)] hover:shadow-[0_12px_32px_rgba(229,195,120,0.45)] border border-[#FFF1CC]/40 cursor-pointer overflow-hidden transition-all duration-300 touch-manipulation"
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
      <div className="relative z-10 w-full max-w-5xl min-w-0 mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 px-1">
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

        {/* Horizontal Snap Track on Mobile, 3-Col Grid on Desktop */}
        <div className="flex md:grid md:grid-cols-3 gap-3.5 sm:gap-6 overflow-x-auto md:overflow-visible pb-3 sm:pb-0 scrollbar-none snap-x snap-mandatory px-1 sm:px-0">
          {DESTINATIONS.map((dest, idx) => (
            <div key={dest.id} className="w-[82vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none">
              <DestinationTiltCard
                dest={dest}
                idx={idx}
                isSelected={activeIdx === idx}
                onSelect={() => handleSelectDestination(idx)}
                onLaunch={() => {
                  handleSelectDestination(idx);
                  setTimeout(handleBuildPlan, 50);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      </motion.div>

      {/* Presentation skip hint during pure video entrance */}
      {isIntroStage && (
        <div className="absolute bottom-6 sm:bottom-8 inset-x-0 z-20 flex justify-center pointer-events-none">
          <div className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/80 text-[11px] font-medium flex items-center gap-1.5 shadow-lg animate-pulse">
            <span>{language === 'ar' ? 'انقر في أي مكان للمتابعة المباشرة ✦' : 'Click anywhere to explore ✦'}</span>
          </div>
        </div>
      )}

    </section>
  );
};

export default HeroSection;
