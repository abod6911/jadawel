'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Users,
  Coins,
  Check,
  ChevronDown,
  Heart,
  Smile,
  Compass,
  Sparkles,
  Waves,
  Landmark,
  Coffee,
  SlidersHorizontal,
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
    tagline: 'نوادي اليخوت الخاصة، نسيم البحر الأحمر، وأرقى جلسات الغروب الشاطئية',
    taglineEn: 'Private yacht clubs, Red Sea breeze, and serene sunset beach lounges',
    badge: 'شواطئ ونوادي يخوت',
    badgeEn: 'Yachts & Waterfront',
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
    tagline: 'أزقة التراث العالمي العتيقة، عبق الماضي الحجازي، وأمسيات الشاي العتيقة',
    taglineEn: 'Timeless UNESCO heritage, ancient coral alleys, and lantern tea nights',
    badge: 'تراث وفنون عريقة',
    badgeEn: 'Heritage & Culture',
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
    tagline: 'عاصمة القهوة المختصة الحرفية، فنون الطهي العالمية، وأرقى الأجواء الاجتماعية',
    taglineEn: 'Artisanal specialty roasters, world-class fine dining, and vibrant social hubs',
    badge: 'قهوة ومطاعم استثنائية',
    badgeEn: 'Specialty Coffee & Dining',
    bgImage: getAssetUrl('/images/realms/alrawdah-coffee.jpg'),
    districtId: 'al-rawdah',
    vibe: 'coffee_dessert',
    budgetTier: 'premium',
    duration: 'under_2h',
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
  { id: 'couples', labelAr: 'كابلز واحتفال', labelEn: 'Couples', icon: Heart, subAr: 'جلسة هادئة وإطلالة مميزة' },
  { id: 'family', labelAr: 'مع العائلة', labelEn: 'Family', icon: Smile, subAr: 'مناسبة لجميع الأعمار وراحة تامة' },
  { id: 'solo', labelAr: 'لحالي بروقان', labelEn: 'Solo Chill', icon: Compass, subAr: 'عزلة إيجابية، قهوة وتأمل' },
];

const BUDGET_OPTIONS: { id: BudgetTier; labelAr: string; labelEn: string; icon: string; priceAr: string }[] = [
  { id: 'free', labelAr: 'مجانية 100%', labelEn: '100% Free', icon: '🆓', priceAr: '0 ريال (ممشى وبحر وحدائق)' },
  { id: 'economy', labelAr: 'اقتصادية', labelEn: 'Economy', icon: '🏷️', priceAr: 'أقل من 100 ريال للشخص' },
  { id: 'moderate', labelAr: 'متوسطة وموزونة', labelEn: 'Moderate', icon: '⚖️', priceAr: '100 - 250 ريال للشخص' },
  { id: 'premium', labelAr: 'فاخرة VIP', labelEn: 'VIP Luxury', icon: '💎', priceAr: '350+ ريال تجارب استثنائية' },
];

const VIBE_OPTIONS: { id: VibeType; labelAr: string; labelEn: string; icon: string; subAr: string }[] = [
  { id: 'beach_sunset', labelAr: 'بحر وغروب', labelEn: 'Beach & Sunset', icon: '🌊', subAr: 'نسيم الكورنيش وجلسات الشواطئ' },
  { id: 'coffee_dessert', labelAr: 'قهوة وحلى', labelEn: 'Coffee & Dessert', icon: '☕', subAr: 'محامص مختصة وألذ الحلويات' },
  { id: 'heritage_arts', labelAr: 'تراث وفنون', labelEn: 'Heritage & Arts', icon: '🏛️', subAr: 'تاريخ البلد العريق والمعارض الفنية' },
  { id: 'food', labelAr: 'عشاء وتجارب تذوق', labelEn: 'Fine Dining', icon: '🍽️', subAr: 'أشهى المأكولات البحرية والعالمية' },
  { id: 'free_walk', labelAr: 'ممشى وطبيعة', labelEn: 'Scenic Walk', icon: '🌴', subAr: 'هواء نقي ومسارات الكورنيش' },
];

// ==========================================
// 2. MAIN HERO SECTION (QUIET LUXURY ARCHITECTURE)
// ==========================================

export const HeroSection: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  // Store bindings
  const updateWizardPreferences = useItineraryStore((state) => state.updateWizardPreferences);
  const generatePlanFromPreferences = useItineraryStore((state) => state.generatePlanFromPreferences);
  const isGeneratingPlan = useItineraryStore((state) => state.isGeneratingPlan);
  const atmospherePhase = useItineraryStore((state) => state.atmospherePhase);
  const atmosphere = getJeddahAtmosphere(atmospherePhase);

  // Concierge selection state
  const [district, setDistrict] = useState<DistrictId | 'all_jeddah'>('all_jeddah');
  const [companions, setCompanions] = useState<CompanionType>('friends');
  const [budget, setBudget] = useState<BudgetTier>('moderate');
  const [duration, setDuration] = useState<DurationOption>('4_to_6h');
  const [vibe, setVibe] = useState<VibeType>('beach_sunset');

  // Popover state
  const [activePopover, setActivePopover] = useState<'district' | 'vibe' | 'prefs' | null>(null);

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (consoleRef.current && !consoleRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // HTML5 Video Autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }, []);

  // Trigger Plan Generation
  const handleGeneratePlan = () => {
    soundEngine.playClick();
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

  // Launch Destination Directly
  const handleLaunchDestination = (dest: Destination) => {
    soundEngine.playClick();
    setDistrict(dest.districtId);
    setVibe(dest.vibe);
    setBudget(dest.budgetTier);
    setDuration(dest.duration);
    updateWizardPreferences({
      startingDistrict: dest.districtId,
      companions,
      budgetTier: dest.budgetTier,
      duration: dest.duration,
      vibe: dest.vibe,
    });
    generatePlanFromPreferences();
  };

  const selectedDistrictObj = DISTRICT_OPTIONS.find((d) => d.id === district) || DISTRICT_OPTIONS[0];
  const selectedVibeObj = VIBE_OPTIONS.find((v) => v.id === vibe) || VIBE_OPTIONS[0];
  const selectedCompanionObj = COMPANION_OPTIONS.find((c) => c.id === companions) || COMPANION_OPTIONS[0];
  const selectedBudgetObj = BUDGET_OPTIONS.find((b) => b.id === budget) || BUDGET_OPTIONS[2];

  return (
    <section className="relative w-full rounded-[2.5rem] overflow-hidden bg-[#0A0D12] border border-white/[0.07] shadow-[0_32px_90px_rgba(0,0,0,0.85)] select-none">
      
      {/* ======================================================== */}
      {/* 1. ATMOSPHERIC CINEMA BACKDROP (MUTED SAPPHIRE NOIR)      */}
      {/* ======================================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Native Smooth Looping Video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src={getAssetUrl('/videos/jeddah-corniche.mp4?v=20261012b')}
          className="w-full h-full object-cover brightness-[0.38] contrast-[1.15] saturate-[0.85] transition-opacity duration-1000"
        />

        {/* Ambient Dark Gradient Layering */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D12] via-[#0A0D12]/60 to-[#0A0D12]/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_0%,rgba(223,159,61,0.12),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0A0D12] to-transparent" />
      </div>

      {/* ======================================================== */}
      {/* 2. FOREGROUND CONTENT & QUIET LUXURY ARCHITECTURE        */}
      {/* ======================================================== */}
      <div className="relative z-10 w-full px-3.5 sm:px-8 lg:px-12 pt-8 pb-14 sm:py-24 lg:py-28 flex flex-col items-center">
        
        {/* EDITORIAL HERO HEADER */}
        <div className="w-full max-w-4xl mx-auto text-center space-y-3 sm:space-y-6">
          
          {/* Eyebrow Capsule */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md text-[#E5C378] text-xs font-semibold tracking-wide shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>
              {language === 'ar'
                ? `عروس البحر الأحمر • ${atmosphere.phaseNameAr} (${atmosphere.temperatureC}°C)`
                : `Red Sea Bride • ${atmosphere.phaseNameEn} (${atmosphere.temperatureC}°C)`}
            </span>
          </div>

          {/* Master Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-black text-white tracking-tight leading-[1.2] max-w-4xl mx-auto">
            {language === 'ar' ? (
              <>
                <span>جدة.. كما لم تعشها من قبل</span>
                <span className="block text-slate-300 font-bold text-2xl sm:text-4xl md:text-5xl mt-2 font-sans">
                  مسارك اليومي بدقة استثنائية
                </span>
              </>
            ) : (
              <>
                <span>Jeddah.. Curated Like Never Before</span>
                <span className="block text-slate-300 font-bold text-2xl sm:text-4xl md:text-5xl mt-2">
                  Bespoke Itineraries at Your Fingertips
                </span>
              </>
            )}
          </h1>

          {/* Elegant Subtitle */}
          <p className="text-sm sm:text-lg text-slate-300/90 font-normal leading-relaxed max-w-2xl mx-auto pt-1">
            {language === 'ar'
              ? 'من رواشين البلد التاريخية إلى نوادي يخوت أبحر الفارهة. صمّم طلعتك المثالية بحسب مودك وميزانيتك بضغطة زر واحدة.'
              : 'From historic Al-Balad coral alleys to Obhur private yacht clubs. Orchestrate your day seamlessly with one click.'}
          </p>
        </div>

        {/* ======================================================== */}
        {/* 3. THE FLOATING CONCIERGE SEARCH CONSOLE (LINEAR LUXURY) */}
        {/* ======================================================== */}
        <div ref={consoleRef} className="w-full max-w-4xl mx-auto mt-6 sm:mt-14 relative z-30">
          {/* A. MOBILE-NATIVE TOUCH CONCIERGE CARD (<640px) */}
          <div className="sm:hidden w-full rounded-3xl bg-[#0E131A]/95 backdrop-blur-2xl border border-white/10 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.85)] space-y-3.5 text-start">
            {/* Step 1: Horizontal Chip Scroll for District */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-[#E5C378]" />
                  <span>{language === 'ar' ? 'المنطقة في جدة' : 'District'}</span>
                </span>
                <span className="text-[10px] text-[#E5C378] font-bold">
                  {language === 'ar' ? selectedDistrictObj.nameAr : selectedDistrictObj.nameEn}
                </span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1 snap-x">
                {DISTRICT_OPTIONS.map((item) => {
                  const isSelected = district === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setDistrict(item.id);
                      }}
                      className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer snap-start active:scale-95 touch-manipulation ${
                        isSelected
                          ? 'bg-[#E5C378] text-[#080B11] shadow-[0_0_15px_rgba(229,195,120,0.4)]'
                          : 'bg-white/[0.05] text-slate-300 border border-white/10 hover:text-white'
                      }`}
                    >
                      <span className="text-sm leading-none">{item.icon}</span>
                      <span>{language === 'ar' ? item.nameAr.split(' ')[0] : item.nameEn.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Horizontal Chip Scroll for Vibe */}
            <div className="space-y-1.5 pt-1.5 border-t border-white/5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>{language === 'ar' ? 'المود والجو' : 'Vibe & Atmosphere'}</span>
                </span>
                <span className="text-[10px] text-teal-300 font-bold">
                  {language === 'ar' ? selectedVibeObj.labelAr : selectedVibeObj.labelEn}
                </span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1 snap-x">
                {VIBE_OPTIONS.map((item) => {
                  const isSelected = vibe === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setVibe(item.id);
                      }}
                      className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer snap-start active:scale-95 touch-manipulation ${
                        isSelected
                          ? 'bg-teal-400 text-[#080B11] shadow-[0_0_15px_rgba(45,212,191,0.4)]'
                          : 'bg-white/[0.05] text-slate-300 border border-white/10 hover:text-white'
                      }`}
                    >
                      <span className="text-sm leading-none">{item.icon}</span>
                      <span>{language === 'ar' ? item.labelAr : item.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Companions (Compact 4-Pill Touch Selector) */}
            <div className="space-y-1 pt-1.5 border-t border-white/5">
              <span className="text-[11px] font-bold text-slate-400 block">
                {language === 'ar' ? 'طبيعة الرفقة' : 'Companions'}
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {COMPANION_OPTIONS.map((item) => {
                  const isSelected = companions === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setCompanions(item.id);
                      }}
                      className={`min-h-[44px] p-2 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 touch-manipulation ${
                        isSelected
                          ? 'bg-[#E5C378]/20 border border-[#E5C378]/50 text-[#F5E2B3] shadow-sm'
                          : 'bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="truncate max-w-full">{language === 'ar' ? item.labelAr.replace('مع ', '') : item.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Mobile Action Button */}
            <button
              type="button"
              onClick={handleGeneratePlan}
              disabled={isGeneratingPlan}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] text-[#0B0E14] font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_4px_20px_rgba(229,195,120,0.4)] cursor-pointer disabled:opacity-50 touch-manipulation"
            >
              {isGeneratingPlan ? (
                <div className="w-5 h-5 border-2 border-[#0B0E14] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{language === 'ar' ? 'ابتكر مسار طلعتي ✨' : 'Curate My Route ✨'}</span>
                  {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </button>
          </div>

          {/* B. DESKTOP FLOATING CONCIERGE DOCK (>=640px) */}
          <div className="hidden sm:flex p-2.5 rounded-full bg-[#0E131A]/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] items-center justify-between gap-2 transition-all">
            
            {/* Segment 1: District Picker */}
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setActivePopover(activePopover === 'district' ? null : 'district');
                }}
                className={`w-full text-start px-5 py-3 sm:py-3.5 rounded-2xl sm:rounded-full transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  activePopover === 'district' ? 'bg-white/[0.08] ring-1 ring-[#E5C378]/30' : 'hover:bg-white/[0.04]'
                }`}
              >
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    {language === 'ar' ? 'المنطقة' : 'District'}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white block truncate">
                    {language === 'ar' ? selectedDistrictObj.nameAr : selectedDistrictObj.nameEn}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {/* District Popover */}
              <AnimatePresence>
                {activePopover === 'district' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 inset-x-0 sm:w-80 rounded-2xl bg-[#0F141C]/98 backdrop-blur-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.9)] p-2 z-50 space-y-1 max-h-72 overflow-y-auto scrollbar-thin"
                  >
                    {DISTRICT_OPTIONS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setDistrict(item.id);
                          setActivePopover(null);
                        }}
                        className={`w-full text-start p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                          district === item.id ? 'bg-[#E5C378]/15 text-[#F5E2B3] font-bold' : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{item.icon}</span>
                          <span>{language === 'ar' ? item.nameAr : item.nameEn}</span>
                        </div>
                        {district === item.id && <Check className="w-3.5 h-3.5 text-[#E5C378]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden sm:block w-[1px] h-8 bg-white/10 shrink-0" />

            {/* Segment 2: Vibe & Mood Picker */}
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setActivePopover(activePopover === 'vibe' ? null : 'vibe');
                }}
                className={`w-full text-start px-5 py-3 sm:py-3.5 rounded-2xl sm:rounded-full transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  activePopover === 'vibe' ? 'bg-white/[0.08] ring-1 ring-[#E5C378]/30' : 'hover:bg-white/[0.04]'
                }`}
              >
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    {language === 'ar' ? 'الجو والمود' : 'Vibe & Mood'}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white block truncate">
                    {language === 'ar' ? selectedVibeObj.labelAr : selectedVibeObj.labelEn}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {/* Vibe Popover */}
              <AnimatePresence>
                {activePopover === 'vibe' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 inset-x-0 sm:w-80 rounded-2xl bg-[#0F141C]/98 backdrop-blur-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.9)] p-2 z-50 space-y-1"
                  >
                    {VIBE_OPTIONS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setVibe(item.id);
                          setActivePopover(null);
                        }}
                        className={`w-full text-start p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                          vibe === item.id ? 'bg-[#E5C378]/15 text-[#F5E2B3] font-bold' : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{item.icon}</span>
                          <span>{language === 'ar' ? item.labelAr : item.labelEn}</span>
                        </div>
                        {vibe === item.id && <Check className="w-3.5 h-3.5 text-[#E5C378]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden sm:block w-[1px] h-8 bg-white/10 shrink-0" />

            {/* Segment 3: Companions & Budget */}
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setActivePopover(activePopover === 'prefs' ? null : 'prefs');
                }}
                className={`w-full text-start px-5 py-3 sm:py-3.5 rounded-2xl sm:rounded-full transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  activePopover === 'prefs' ? 'bg-white/[0.08] ring-1 ring-[#E5C378]/30' : 'hover:bg-white/[0.04]'
                }`}
              >
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    {language === 'ar' ? 'الرفقة والميزانية' : 'People & Budget'}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white block truncate">
                    {language === 'ar'
                      ? `${selectedCompanionObj.labelAr} • ${selectedBudgetObj.labelAr}`
                      : `${selectedCompanionObj.labelEn} • ${selectedBudgetObj.labelEn}`}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {/* Prefs Popover */}
              <AnimatePresence>
                {activePopover === 'prefs' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 inset-x-0 sm:w-96 rounded-2xl bg-[#0F141C]/98 backdrop-blur-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.9)] p-4 z-50 space-y-4"
                  >
                    {/* Companion selection */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 block">
                        {language === 'ar' ? 'مع من طلِعتك؟' : 'Who is with you?'}
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {COMPANION_OPTIONS.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              soundEngine.playClick();
                              setCompanions(item.id);
                            }}
                            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                              companions === item.id
                                ? 'bg-[#E5C378]/20 border border-[#E5C378]/40 text-[#F5E2B3]'
                                : 'bg-white/[0.03] border border-white/[0.06] text-slate-300 hover:text-white'
                            }`}
                          >
                            <span>{language === 'ar' ? item.labelAr : item.labelEn}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Budget selection */}
                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                      <span className="text-[11px] font-bold text-slate-400 block">
                        {language === 'ar' ? 'الميزانية التقريبية' : 'Budget Tier'}
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {BUDGET_OPTIONS.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              soundEngine.playClick();
                              setBudget(item.id);
                            }}
                            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                              budget === item.id
                                ? 'bg-[#E5C378]/20 border border-[#E5C378]/40 text-[#F5E2B3]'
                                : 'bg-white/[0.03] border border-white/[0.06] text-slate-300 hover:text-white'
                            }`}
                          >
                            <span>{item.icon}</span>
                            <span>{language === 'ar' ? item.labelAr : item.labelEn}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={handleGeneratePlan}
              disabled={isGeneratingPlan}
              className="h-12 sm:h-14 px-6 sm:px-8 rounded-2xl sm:rounded-full bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] hover:opacity-95 text-[#0B0E14] font-black text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_8px_24px_rgba(223,159,61,0.25)] cursor-pointer shrink-0 disabled:opacity-50"
            >
              {isGeneratingPlan ? (
                <div className="w-5 h-5 border-2 border-[#0B0E14] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{language === 'ar' ? 'صمّم مسار طلعتي' : 'Curate My Route'}</span>
                  {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. CURATED DESTINATION SHOWCASE CARDS (HORIZONTAL SNAP ON MOBILE) */}
        {/* ======================================================== */}
        <div className="w-full max-w-5xl mx-auto mt-8 sm:mt-20">
          
          <div className="flex items-center justify-between mb-3.5 sm:mb-6 px-1">
            <div className="space-y-0.5">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#E5C378] tracking-widest uppercase block">
                {language === 'ar' ? '✦ مسارات مختارة مسبقاً' : '✦ Signature Highlights'}
              </span>
              <h3 className="text-base sm:text-xl font-bold text-white">
                {language === 'ar' ? 'انطلق مباشرة في أبرز تجارب جدة' : 'Launch Premier Handcrafted Experiences'}
              </h3>
            </div>
          </div>

          <div className="flex md:grid md:grid-cols-3 gap-3.5 sm:gap-6 overflow-x-auto md:overflow-visible pb-3 -mx-2 px-2 scrollbar-none snap-x snap-mandatory">
            {DESTINATIONS.map((dest) => (
              <div
                key={dest.id}
                onClick={() => handleLaunchDestination(dest)}
                className="w-[82vw] max-w-[320px] shrink-0 snap-center md:w-auto md:max-w-none group relative h-56 sm:h-64 rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#E5C378]/40 transition-all duration-300 shadow-[0_12px_32px_rgba(0,0,0,0.6)] select-none flex flex-col justify-between p-4.5 sm:p-5 touch-manipulation active:scale-[0.98]"
              >
                {/* Background Image */}
                <img
                  src={dest.bgImage}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.55] transition-transform duration-700 group-hover:scale-105"
                />

                {/* Ambient Dark Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D12] via-[#0A0D12]/40 to-transparent" />

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-[#F5E2B3]">
                    {language === 'ar' ? dest.badge : dest.badgeEn}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 space-y-1.5">
                  <h4 className="text-base sm:text-lg font-black text-white group-hover:text-[#F5E2B3] transition-colors">
                    {language === 'ar' ? dest.name : dest.nameEn}
                  </h4>
                  <p className="text-xs text-slate-300/80 font-normal line-clamp-1">
                    {language === 'ar' ? dest.tagline : dest.taglineEn}
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-[#E5C378] group-hover:translate-x-[-4px] transition-transform">
                    <span>{language === 'ar' ? 'تشغيل هذا المسار' : 'Launch Route'}</span>
                    {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;
