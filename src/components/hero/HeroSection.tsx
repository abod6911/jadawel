'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Compass,
  MapPin,
  Users,
  Coins,
  Clock,
  Flame,
  Waves,
  Sunset,
  Volume2,
  VolumeX,
  Check,
  ChevronDown,
  Navigation,
  Film,
} from 'lucide-react';
import { useItineraryStore } from '@/store/useItineraryStore';
import { useLanguage } from '@/hooks/useLanguage';
import { soundEngine } from '@/utils/audioEngine';
import { getAssetUrl } from '@/utils/paths';
import { DistrictId, CompanionType, BudgetTier, DurationOption, VibeType } from '@/types';
import { getJeddahAtmosphere } from '@/utils/atmosphereEngine';

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

const QUICK_PRESETS = [
  {
    id: 'sunset_beach',
    labelAr: '🌅 بحر وغروب',
    labelEn: '🌅 Beach & Sunset',
    district: 'obhur' as const,
    vibe: 'beach_sunset' as const,
    budget: 'moderate' as const,
    duration: '4_to_6h' as const,
    companions: 'friends' as const,
  },
  {
    id: 'specialty_coffee',
    labelAr: '☕ قهوة وروقان',
    labelEn: '☕ Coffee & Chill',
    district: 'al-rawdah' as const,
    vibe: 'coffee_dessert' as const,
    budget: 'moderate' as const,
    duration: 'under_2h' as const,
    companions: 'solo' as const,
  },
  {
    id: 'balad_night',
    labelAr: '🏛️ جولة البلد التاريخية',
    labelEn: '🏛️ Historic Al-Balad',
    district: 'al-balad' as const,
    vibe: 'heritage_arts' as const,
    budget: 'economy' as const,
    duration: '2_to_4h' as const,
    companions: 'family' as const,
  },
  {
    id: 'free_outing',
    labelAr: '🆓 خطة مجانية 100%',
    labelEn: '🆓 100% Free Plan',
    district: 'al-shati' as const,
    vibe: 'free_walk' as const,
    budget: 'free' as const,
    duration: '2_to_4h' as const,
    companions: 'friends' as const,
  },
  {
    id: 'luxury_vip',
    labelAr: '✨ سهرة فاخرة VIP',
    labelEn: '✨ VIP Night Out',
    district: 'al-shati' as const,
    vibe: 'food' as const,
    budget: 'premium' as const,
    duration: 'half_day_night' as const,
    companions: 'couples' as const,
  },
];

export const HeroSection: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const [activeIdx, setActiveIdx] = useState(0);
  const activeDest = DESTINATIONS[activeIdx];

  // Store bindings
  const updateWizardPreferences = useItineraryStore((state) => state.updateWizardPreferences);
  const generatePlanFromPreferences = useItineraryStore((state) => state.generatePlanFromPreferences);
  const isGeneratingPlan = useItineraryStore((state) => state.isGeneratingPlan);

  // Form State
  const [district, setDistrict] = useState<DistrictId | 'all_jeddah'>(activeDest.districtId);
  const [companions, setCompanions] = useState<CompanionType>('friends');
  const [budget, setBudget] = useState<BudgetTier>(activeDest.budgetTier);
  const [duration, setDuration] = useState<DurationOption>(activeDest.duration);
  const [vibe, setVibe] = useState<VibeType>(activeDest.vibe);
  const [atmosphere] = useState(getJeddahAtmosphere());
  const [isMuted, setIsMuted] = useState(soundEngine.isSoundMuted());
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Robust HTML5 Video Autoplay & Lifecycle management
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Direct DOM property assignment to defeat React JSX muted bug & browser policy blocks
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const tryPlay = () => {
      video.muted = true;
      const promise = video.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            setIsVideoPlaying(true);
          })
          .catch(() => {
            setIsVideoPlaying(false);
          });
      }
    };

    // Instant autoplay attempt
    tryPlay();

    // Event listeners to keep state strictly synced
    const handlePlaying = () => setIsVideoPlaying(true);
    const handlePause = () => setIsVideoPlaying(false);
    const handleEnded = () => {
      video.currentTime = 0;
      tryPlay();
    };

    video.addEventListener('playing', handlePlaying);
    video.addEventListener('play', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    // Fallback: If autoplay was policy-restricted by browser, unlock on first user gesture
    const unlockOnGesture = () => {
      if (video.paused) {
        video.muted = true;
        video.play().then(() => setIsVideoPlaying(true)).catch(() => {});
      }
      window.removeEventListener('pointerdown', unlockOnGesture);
      window.removeEventListener('touchstart', unlockOnGesture);
      window.removeEventListener('scroll', unlockOnGesture);
      window.removeEventListener('keydown', unlockOnGesture);
    };

    window.addEventListener('pointerdown', unlockOnGesture, { passive: true });
    window.addEventListener('touchstart', unlockOnGesture, { passive: true });
    window.addEventListener('scroll', unlockOnGesture, { passive: true });
    window.addEventListener('keydown', unlockOnGesture, { passive: true });

    return () => {
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('play', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
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
  };

  const handleApplyPreset = (preset: typeof QUICK_PRESETS[0]) => {
    soundEngine.playClick();
    setDistrict(preset.district);
    setVibe(preset.vibe);
    setBudget(preset.budget);
    setDuration(preset.duration);
    setCompanions(preset.companions);
  };

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) soundEngine.playClick();
  };

  const handleToggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.muted = true;
      video.play().then(() => setIsVideoPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsVideoPlaying(false);
    }
  };

  const handleBuildPlan = () => {
    soundEngine.playSuccess();
    updateWizardPreferences({
      startingDistrict: district,
      companions,
      budgetTier: budget,
      duration,
      vibe,
    });
    generatePlanFromPreferences();
  };

  return (
    <section className="relative w-full rounded-[2.5rem] overflow-hidden px-4 sm:px-8 py-8 sm:py-12 select-none border border-gold-500/20 shadow-cinematic">
      {/* 1. CINEMATIC BACKGROUND VIDEO & ATMOSPHERE */}
      <div className="absolute inset-0 z-0 bg-[#090B0E] overflow-hidden">
        {/* Seamless looping cinematic video of coastal Jeddah Corniche */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={activeDest.bgImage}
          className="w-full h-full object-cover brightness-[0.42] contrast-[1.20] scale-[1.03] transition-transform duration-1000"
        >
          <source src={getAssetUrl('/videos/jeddah-corniche.mp4')} type="video/mp4" />
          <source src={getAssetUrl('/videos/jeddah-sunset.webm')} type="video/webm" />
          <source src={getAssetUrl('/videos/jeddah-waves.webm')} type="video/webm" />
        </video>

        {/* Cinematic Vignette & Warm Twilight Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090B0E] via-[#090B0E]/50 to-[#090B0E]/75" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(229,169,98,0.18)_0%,transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(78,159,150,0.12)_0%,transparent_70%)]" />
      </div>

      {/* 2. REAL-TIME ATMOSPHERE & AUDIO FLOATING STATUS PILL */}
      <div className="relative z-20 w-full max-w-4xl mx-auto mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-abyss-950/80 backdrop-blur-xl border border-white/10 shadow-lg text-xs font-bold text-pearl">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            {/* Live Weather */}
            <div className="flex items-center gap-1.5 text-teal-300">
              <Waves className="w-4 h-4 text-teal-400 shrink-0" />
              <span>{language === 'ar' ? 'الكورنيش:' : 'Corniche:'}</span>
              <span className="font-mono font-black text-white" dir="ltr">{atmosphere.temperatureC}°C</span>
              <span className="text-[11px] text-teal-200/80">• {language === 'ar' ? atmosphere.weatherConditionAr : atmosphere.weatherConditionEn}</span>
            </div>

            {/* Sunset Countdown */}
            <div className="flex items-center gap-1.5 text-gold-400">
              <Sunset className="w-4 h-4 text-gold-400 shrink-0" />
              <span>{language === 'ar' ? atmosphere.sunsetCountdownTextAr : atmosphere.sunsetCountdownTextEn}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Video Background Toggle */}
            <button
              type="button"
              onClick={handleToggleVideo}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isVideoPlaying
                  ? 'bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/30 text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.15)]'
                  : 'bg-white/5 hover:bg-white/10 border-white/15 text-pearl-muted hover:text-white'
              }`}
              title={language === 'ar' ? 'تشغيل / إيقاف فيديو كورنيش جدة' : 'Toggle Jeddah Corniche Video'}
            >
              <span className="relative flex h-2 w-2">
                {isVideoPlaying && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isVideoPlaying ? 'bg-teal-400' : 'bg-slate-500'}`} />
              </span>
              <Film className={`w-3.5 h-3.5 ${isVideoPlaying ? 'text-teal-400' : 'text-slate-400'}`} />
              <span className="text-[11px]">
                {language === 'ar' ? (isVideoPlaying ? 'فيديو كورنيش جدة' : 'تشغيل الفيديو ▶') : (isVideoPlaying ? 'Jeddah Live' : 'Play Video ▶')}
              </span>
            </button>

            {/* Sound Effect Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-pearl-muted hover:text-gold-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title={language === 'ar' ? 'تشغيل/كتم المؤثرات الصوتية' : 'Toggle Audio FX'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-gold-400" />}
              <span className="text-[11px]">{isMuted ? (language === 'ar' ? 'صامت' : 'Muted') : (language === 'ar' ? 'صوتيات' : 'Audio On')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. HERO TYPOGRAPHY & VALUE PROPOSITION */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-4 mb-8">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-xl bg-gold-500/10 border border-gold-500/30 text-xs font-black text-gold-400 shadow-glow-gold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? activeDest.badge : activeDest.badgeEn}</span>
        </div>

        {/* Master Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-pearl tracking-tight leading-[1.25] drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
          {language === 'ar' ? (
            <>
              المواقع تشتتك..{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-500 to-amber-500">
                وجداول
              </span>{' '}
              يرتّب لك الطلعة كاملة
            </>
          ) : (
            <>
              Endless places..{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-500 to-amber-500">
                Jadawel
              </span>{' '}
              crafts your entire outing
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-pearl-muted max-w-2xl leading-relaxed font-medium">
          {language === 'ar' ? activeDest.tagline : activeDest.taglineEn}
        </p>

        {/* 3 Interactive Destination Realms */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl pt-2">
          {DESTINATIONS.map((dest, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={dest.id}
                type="button"
                onClick={() => handleSelectDestination(idx)}
                className={`relative flex items-center gap-3 p-3 rounded-2xl border transition-all text-start cursor-pointer backdrop-blur-xl touch-manipulation group ${
                  isActive
                    ? 'bg-gold-500/20 border-gold-400 shadow-glow-gold scale-[1.02]'
                    : 'bg-abyss-900/60 border-white/10 hover:border-gold-500/40 hover:bg-abyss-800/80'
                }`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-md">
                  <img
                    src={dest.bgImage}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="overflow-hidden min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gold-400 font-bold block">
                      {language === 'ar' ? `الوجهة ${idx + 1}` : `Realm ${idx + 1}`}
                    </span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />}
                  </div>
                  <span className="text-xs sm:text-sm font-black text-pearl block truncate">
                    {language === 'ar' ? dest.name : dest.nameEn}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. ULTRA-MODERN FLOATING SMART PLANNER DOCK */}
      <div className="relative z-20 w-full max-w-4xl mx-auto backdrop-blur-2xl bg-abyss-950/90 border border-gold-500/30 rounded-3xl p-5 sm:p-7 shadow-cinematic space-y-5">
        {/* Header & 1-Click Preset Pills */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span className="text-sm font-black text-pearl">
                {language === 'ar' ? 'صانع مسار جدة الفوري • 5 ركائز ذكية' : 'Instant Jeddah Route Engine • 5 Smart Pillars'}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold w-fit">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>{language === 'ar' ? 'تخطيط ذكي فوري' : 'AI Multi-Stop Matrix'}</span>
            </div>
          </div>

          {/* Quick 1-Click Mood Preset Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-pearl-muted font-bold shrink-0">
              {language === 'ar' ? 'طلعات سريعة جاهزة:' : 'Fast Presets:'}
            </span>
            {QUICK_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-gold-500/15 text-pearl-muted hover:text-gold-300 border border-white/10 hover:border-gold-500/40 text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95"
              >
                {language === 'ar' ? preset.labelAr : preset.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* 5 Tactile Modern Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* 1. District */}
          <div className="p-3 rounded-2xl bg-abyss-900/90 border border-white/10 hover:border-gold-500/40 transition-colors space-y-1">
            <label className="text-[10px] text-pearl-muted font-bold flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gold-400" />
              <span>{language === 'ar' ? '1. المنطقة / الحي' : '1. District'}</span>
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value as any)}
              className="w-full bg-transparent text-pearl text-xs font-black focus:outline-none cursor-pointer py-1"
            >
              <option value="obhur" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? 'أبحر (الشمالية والجنوبية)' : 'Obhur Marina'}
              </option>
              <option value="al-rawdah" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? 'حي الروضة' : 'Al-Rawdah'}
              </option>
              <option value="al-balad" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? 'البلد التاريخية' : 'Historic Al-Balad'}
              </option>
              <option value="al-shati" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? 'حي الشاطئ والكورنيش' : 'Al-Shati Beach'}
              </option>
              <option value="al-hamra" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? 'حي الحمراء والنافورة' : 'Al-Hamra Fountain'}
              </option>
              <option value="all_jeddah" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? 'جدة كلها 🌊' : 'All Jeddah 🌊'}
              </option>
            </select>
          </div>

          {/* 2. Companions */}
          <div className="p-3 rounded-2xl bg-abyss-900/90 border border-white/10 hover:border-gold-500/40 transition-colors space-y-1">
            <label className="text-[10px] text-pearl-muted font-bold flex items-center gap-1">
              <Users className="w-3 h-3 text-teal-400" />
              <span>{language === 'ar' ? '2. مين معاك؟' : '2. Company'}</span>
            </label>
            <select
              value={companions}
              onChange={(e) => setCompanions(e.target.value as any)}
              className="w-full bg-transparent text-pearl text-xs font-black focus:outline-none cursor-pointer py-1"
            >
              <option value="friends" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? 'مع الشلة 🥳' : 'Friends 🥳'}
              </option>
              <option value="solo" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? 'لحالي أروّق 🚶' : 'Solo 🚶'}
              </option>
              <option value="couples" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? 'شخصين / كوبل 👩‍❤️‍👨' : 'Couples 👩‍❤️‍👨'}
              </option>
              <option value="family" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? 'جمعة عائلة 👨‍👩‍👧‍👦' : 'Family 👨‍👩‍👧‍👦'}
              </option>
              <option value="kids" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? 'مع أطفال 👶' : 'With Kids 👶'}
              </option>
            </select>
          </div>

          {/* 3. Budget */}
          <div className="p-3 rounded-2xl bg-abyss-900/90 border border-white/10 hover:border-gold-500/40 transition-colors space-y-1">
            <label className="text-[10px] text-pearl-muted font-bold flex items-center gap-1">
              <Coins className="w-3 h-3 text-gold-400" />
              <span>{language === 'ar' ? '3. الميزانية' : '3. Budget'}</span>
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value as any)}
              className="w-full bg-transparent text-pearl text-xs font-black focus:outline-none cursor-pointer py-1"
            >
              <option value="moderate" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? 'متوازن (~150 ر.س)' : 'Moderate (~150 SAR)'}
              </option>
              <option value="free" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? 'خطة مجانية 100% 🆓' : 'Free Plan 100% 🆓'}
              </option>
              <option value="economy" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? 'اقتصادي (≤60 ر.س)' : 'Economy (≤60 SAR)'}
              </option>
              <option value="premium" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? 'فاخر VIP (+350 ر.س)' : 'VIP Tier (+350 SAR)'}
              </option>
            </select>
          </div>

          {/* 4. Duration */}
          <div className="p-3 rounded-2xl bg-abyss-900/90 border border-white/10 hover:border-gold-500/40 transition-colors space-y-1">
            <label className="text-[10px] text-pearl-muted font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 text-teal-400" />
              <span>{language === 'ar' ? '4. الوقت المتاح' : '4. Duration'}</span>
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value as any)}
              className="w-full bg-transparent text-pearl text-xs font-black focus:outline-none cursor-pointer py-1"
            >
              <option value="4_to_6h" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? '4 إلى 6 ساعات 🌆' : '4 - 6 Hours 🌆'}
              </option>
              <option value="under_2h" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? 'أقل من ساعتين ⚡' : '< 2 Hours ⚡'}
              </option>
              <option value="2_to_4h" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? '2 إلى 4 ساعات ☕' : '2 - 4 Hours ☕'}
              </option>
              <option value="half_day_night" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? 'سهرة ليلية 🌙' : 'Night Out 🌙'}
              </option>
              <option value="full_day" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? 'يوم كامل 🚀' : 'Full Day 🚀'}
              </option>
            </select>
          </div>

          {/* 5. Vibe */}
          <div className="p-3 rounded-2xl bg-abyss-900/90 border border-white/10 hover:border-gold-500/40 transition-colors space-y-1">
            <label className="text-[10px] text-pearl-muted font-bold flex items-center gap-1">
              <Flame className="w-3 h-3 text-gold-400" />
              <span>{language === 'ar' ? '5. جو ومود الطلعة' : '5. Mood & Vibe'}</span>
            </label>
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value as any)}
              className="w-full bg-transparent text-pearl text-xs font-black focus:outline-none cursor-pointer py-1"
            >
              <option value="beach_sunset" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? 'بحر وغروب 🌊' : 'Beach & Sunset 🌊'}
              </option>
              <option value="coffee_dessert" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? 'قهوة مختصة وحلى ☕' : 'Specialty Coffee ☕'}
              </option>
              <option value="food" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? 'أكل ومطاعم 🍔' : 'Dining & Food 🍔'}
              </option>
              <option value="heritage_arts" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? 'تراث وفنون 🏛️' : 'Heritage & Arts 🏛️'}
              </option>
              <option value="gaming_challenges" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? 'ألعاب وتحديات 🎯' : 'Gaming & Fun 🎯'}
              </option>
              <option value="free_walk" className="bg-abyss-950 text-pearl">
                {language === 'ar' ? 'تمشية مجانية 🆓' : 'Free Walk 🆓'}
              </option>
            </select>
          </div>
        </div>

        {/* Master Glowing CTA Button */}
        <motion.button
          whileHover={{ scale: 1.015, boxShadow: '0 0 40px rgba(229, 169, 98, 0.5)' }}
          whileTap={{ scale: 0.985 }}
          onClick={handleBuildPlan}
          disabled={isGeneratingPlan}
          className="w-full py-4 sm:py-4.5 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 text-abyss-950 font-black text-sm sm:text-base shadow-glow-gold transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation disabled:opacity-50"
        >
          {isGeneratingPlan ? (
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-abyss-950 border-t-transparent rounded-full animate-spin" />
              <span>{language === 'ar' ? 'جاري رسم المسار الذكي والتحقق من التوقيت...' : 'Calculating Optimal Route...'}</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>
                {language === 'ar'
                  ? '✨ ابنِ خطتي في جدة بنقرة واحدة'
                  : '✨ Build My Jeddah Plan in One Click'}
              </span>
              {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </>
          )}
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;
