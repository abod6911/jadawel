'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useItineraryStore } from '@/store/useItineraryStore';
import { useLanguage } from '@/hooks/useLanguage';
import { soundEngine } from '@/utils/audioEngine';
import { DistrictId, CompanionType, BudgetTier, DurationOption, VibeType } from '@/types';
import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { getAssetUrl } from '@/utils/paths';

interface Destination {
  id: 'obhur' | 'balad' | 'rawdah';
  title: string;
  titleEn: string;
  tagline: string;
  taglineEn: string;
  badge: string;
  badgeEn: string;
  weather: string;
  weatherEn: string;
  budget: string;
  budgetEn: string;
  bgImage: string;
  districtId: DistrictId | 'all_jeddah';
  districtName: string;
  vibe: VibeType;
  vibeName: string;
  budgetTier: BudgetTier;
  duration: DurationOption;
}

const DESTINATIONS: Record<string, Destination> = {
  obhur: {
    id: 'obhur',
    title: 'أبحر والواجهة البحرية',
    titleEn: 'Obhur & Waterfront Marina',
    tagline: 'روقان الغروب، نسيم البحر الأحمر، وأرقى شواطئ ونوادي اليخوت 🌊',
    taglineEn: 'Golden sunset breeze, Red Sea yachts, and serene private beach lounges 🌊',
    badge: '📍 عروس البحر الأحمر • الواجهة والنوادي الشاطئية',
    badgeEn: '📍 Red Sea Bride • Waterfront & Beach Clubs',
    weather: '🌊 28°C • نسيم البحر عليل • غروب ذهبي',
    weatherEn: '🌊 28°C • Gentle Sea Breeze • Golden Sunset',
    budget: '~150 ر.س',
    budgetEn: '~150 SAR',
    bgImage: getAssetUrl('/images/realms/obhur-marina.jpg'),
    districtId: 'obhur',
    districtName: 'أبحر (الشمالية والجنوبية)',
    vibe: 'beach_sunset',
    vibeName: 'بحر وغروب 🌊',
    budgetTier: 'moderate',
    duration: '4_to_6h',
  },
  balad: {
    id: 'balad',
    title: 'رواشين وتراث البلد',
    titleEn: 'Historic Al-Balad & Rawashin',
    tagline: 'أصالة الماضي، أزقة التاريخ العتيقة، وبسطات الشاي الحجازي 🏛️',
    taglineEn: 'Timeless Hijazi heritage, ancient coral stone alleys, and lantern tea nights 🏛️',
    badge: '📍 التراث العالمي • قلب جدة التاريخي',
    badgeEn: '📍 World Heritage • Historic Heart of Jeddah',
    weather: '🌙 26°C • أجواء مسائية ساحرة',
    weatherEn: '🌙 26°C • Magical Evening • Al-Balad Lanterns',
    budget: '~75 ر.س',
    budgetEn: '~75 SAR',
    bgImage: getAssetUrl('/images/realms/albalad-heritage.jpg'),
    districtId: 'al-balad',
    districtName: 'البلد التاريخية',
    vibe: 'heritage_arts',
    vibeName: 'تراث وسهرات 🏛️',
    budgetTier: 'economy',
    duration: '2_to_4h',
  },
  rawdah: {
    id: 'rawdah',
    title: 'كافيهات ومطاعم الروضة',
    titleEn: 'Al-Rawdah Coffee & Fine Dining',
    tagline: 'عاصمة الروقان، أحدث محامص القهوة المختصة، وأرقى المطابخ العالمية ☕',
    taglineEn: 'Specialty coffee capital, artisanal roasters, and world-class culinary gems ☕',
    badge: '📍 النبض العصري • أرقى كافيهات ومطاعم جدة',
    badgeEn: '📍 Urban Pulse • Premier Cafes & Dining Hub',
    weather: '✨ 27°C • أجواء حيوية ومنعشة',
    weatherEn: '✨ 27°C • Vibrant Atmosphere • Specialty Coffee Hub',
    budget: '~220 ر.س',
    budgetEn: '~220 SAR',
    bgImage: getAssetUrl('/images/realms/alrawdah-coffee.jpg'),
    districtId: 'al-rawdah',
    districtName: 'حي الروضة',
    vibe: 'coffee_dessert',
    vibeName: 'أكل ومطاعم 🍔',
    budgetTier: 'premium',
    duration: 'under_2h',
  },
};

export const HeroSection: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const [activeKey, setActiveKey] = useState<'obhur' | 'balad' | 'rawdah'>('obhur');
  const activeDest = DESTINATIONS[activeKey];
  const otherDestinations = (['obhur', 'balad', 'rawdah'] as const).filter((k) => k !== activeKey);

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

  const handleSelectDestination = (key: 'obhur' | 'balad' | 'rawdah') => {
    soundEngine.playClick();
    setActiveKey(key);
    const dest = DESTINATIONS[key];
    setDistrict(dest.districtId);
    setVibe(dest.vibe);
    setBudget(dest.budgetTier);
    setDuration(dest.duration);
  };

  const handleBuildPlan = () => {
    soundEngine.playClick();
    updateWizardPreferences({
      startingDistrict: district,
      companions: companions,
      budgetTier: budget,
      duration: duration,
      vibe: vibe,
    });
    generatePlanFromPreferences();
  };

  return (
    <section className="relative min-h-[92vh] w-full flex flex-col items-center justify-between overflow-hidden px-4 pt-8 pb-8 select-none">
      {/* 1. SECURE BACKGROUND IMAGE & AMBIENT GLOW (z-0 to z-[2]) */}
      <div className="absolute inset-0 z-0 bg-[#090B0E]">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeDest.id}
            src={activeDest.bgImage}
            alt={language === 'ar' ? activeDest.title : activeDest.titleEn}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover object-center brightness-[0.68] contrast-[1.12]"
          />
        </AnimatePresence>

        {/* Ambient Overlay Masks */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#090B0E]/85 via-transparent to-[#090B0E]" />
        <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,11,14,0.85)_80%)]" />
      </div>

      {/* 2. MAIN HERO CONTENT STACK (z-10) */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto my-auto py-4">
        {/* Eyebrow Badge */}
        <motion.div
          key={`badge-${activeKey}`}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 text-xs font-medium text-[#E5A962] mb-4 shadow-lg shadow-black/40"
        >
          <span className="w-2 h-2 rounded-full bg-[#4E9F96] animate-pulse" />
          <span>{language === 'ar' ? activeDest.badge : activeDest.badgeEn}</span>
        </motion.div>

        {/* Monumental Headline */}
        <motion.h1
          key={`title-${activeKey}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl font-black text-[#FBFBFA] tracking-tight leading-tight mb-3 drop-shadow-[0_12px_35px_rgba(0,0,0,0.85)]"
        >
          {language === 'ar' ? activeDest.title : activeDest.titleEn}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          key={`tagline-${activeKey}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm sm:text-lg text-[#9EA8B3] max-w-2xl font-normal leading-relaxed drop-shadow-md mb-5"
        >
          {language === 'ar' ? activeDest.tagline : activeDest.taglineEn}
        </motion.p>

        {/* Live Weather & Status Bar */}
        <motion.div
          key={`status-${activeKey}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-wrap items-center justify-center gap-3 px-5 py-2 rounded-2xl backdrop-blur-2xl bg-black/60 border border-white/15 text-xs sm:text-sm text-white/95 shadow-xl mb-6"
        >
          <span>{language === 'ar' ? activeDest.weather : activeDest.weatherEn}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/30 hidden sm:block" />
          <span className="text-[#E5A962] font-bold">
            {language === 'ar' ? `الميزانية المقترحة: ${activeDest.budget}` : `Est Budget: ${activeDest.budgetEn}`}
          </span>
        </motion.div>

        {/* Interactive Floating Destination Portals */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 w-full max-w-lg">
          {otherDestinations.map((key) => {
            const dest = DESTINATIONS[key];
            return (
              <motion.button
                key={dest.id}
                onClick={() => handleSelectDestination(key)}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center gap-3 p-2.5 sm:px-4 sm:py-3 rounded-2xl backdrop-blur-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-[#E5A962]/60 text-start transition-all cursor-pointer shadow-xl group touch-manipulation"
              >
                <img
                  src={dest.bgImage}
                  alt={language === 'ar' ? dest.title : dest.titleEn}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-white/25 shadow shrink-0"
                />
                <div className="overflow-hidden min-w-0">
                  <span className="text-[10px] sm:text-xs text-[#E5A962] font-medium block">
                    {language === 'ar' ? 'انتقل إلى' : 'Switch to'}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white block truncate group-hover:text-[#FBFBFA]">
                    {language === 'ar' ? dest.title : dest.titleEn}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 3. FLOATING 5-PILLAR SMART PLANNER DOCK (z-20) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.7 }}
        className="relative z-20 w-full max-w-5xl backdrop-blur-2xl bg-[#090B0E]/90 border border-white/15 rounded-3xl p-4 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.7)]"
      >
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-[#E5A962] text-sm">⚡</span>
            <span className="text-xs sm:text-sm font-bold text-white">
              {language === 'ar' ? 'المحدد السريع • رتّب طلعة جدة بـ 5 خيارات:' : 'Quick Dock • Craft Jeddah Outing in 5 Steps:'}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs text-[#4E9F96] bg-[#4E9F96]/15 px-3 py-1 rounded-full border border-[#4E9F96]/30 font-medium hidden sm:inline-block">
            {language === 'ar' ? 'مسار فوري مدعوم بالذكاء الاصطناعي ⚡' : 'Instant AI Route ⚡'}
          </span>
        </div>

        {/* 5-Column Input Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 mb-4 text-start">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 hover:border-white/20 transition-all">
            <label className="text-[10px] text-[#9EA8B3] font-bold block mb-1">
              📍 {language === 'ar' ? '1. الحي / المنطقة' : '1. District'}
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value as any)}
              className="w-full bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer touch-manipulation"
            >
              <option value="obhur" className="bg-[#090B0E]">
                {language === 'ar' ? 'أبحر (الشمالية والجنوبية)' : 'Obhur (North & South)'}
              </option>
              <option value="al-rawdah" className="bg-[#090B0E]">
                {language === 'ar' ? 'حي الروضة' : 'Al-Rawdah District'}
              </option>
              <option value="al-balad" className="bg-[#090B0E]">
                {language === 'ar' ? 'البلد التاريخية' : 'Historic Al-Balad'}
              </option>
              <option value="al-shati" className="bg-[#090B0E]">
                {language === 'ar' ? 'حي الشاطئ والكورنيش' : 'Al-Shati & Corniche'}
              </option>
              <option value="all_jeddah" className="bg-[#090B0E]">
                {language === 'ar' ? 'جدة كلها 🌊' : 'All Jeddah 🌊'}
              </option>
            </select>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 hover:border-white/20 transition-all">
            <label className="text-[10px] text-[#9EA8B3] font-bold block mb-1">
              👥 {language === 'ar' ? '2. مين معاك؟' : '2. Companions'}
            </label>
            <select
              value={companions}
              onChange={(e) => setCompanions(e.target.value as any)}
              className="w-full bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer touch-manipulation"
            >
              <option value="friends" className="bg-[#090B0E]">
                {language === 'ar' ? 'مع الشلة 🥳' : 'Friends 🥳'}
              </option>
              <option value="solo" className="bg-[#090B0E]">
                {language === 'ar' ? 'لحالي أروّق 🚶' : 'Solo 🚶'}
              </option>
              <option value="couples" className="bg-[#090B0E]">
                {language === 'ar' ? 'شخصين / كوبل 👩‍❤️‍👨' : 'Couples 👩‍❤️‍👨'}
              </option>
              <option value="family" className="bg-[#090B0E]">
                {language === 'ar' ? 'جمعة عائلة 👨‍👩‍👧‍👦' : 'Family 👨‍👩‍👧‍👦'}
              </option>
              <option value="kids" className="bg-[#090B0E]">
                {language === 'ar' ? 'مع أطفال 👶' : 'With Kids 👶'}
              </option>
            </select>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 hover:border-white/20 transition-all">
            <label className="text-[10px] text-[#9EA8B3] font-bold block mb-1">
              💰 {language === 'ar' ? '3. الميزانية' : '3. Budget'}
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value as any)}
              className="w-full bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer touch-manipulation"
            >
              <option value="moderate" className="bg-[#090B0E]">
                {language === 'ar' ? 'متوازن (~150 ر.س)' : 'Moderate (~150 SAR)'}
              </option>
              <option value="free" className="bg-[#090B0E]">
                {language === 'ar' ? 'خطة مجانية 100% (0 ر.س)' : '100% Free Plan (0 SAR)'}
              </option>
              <option value="economy" className="bg-[#090B0E]">
                {language === 'ar' ? 'على قد الجيب (≤60 ر.س)' : 'Budget (≤60 SAR)'}
              </option>
              <option value="premium" className="bg-[#090B0E]">
                {language === 'ar' ? 'دلع VIP (+350 ر.س)' : 'VIP Tier (+350 SAR)'}
              </option>
            </select>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 hover:border-white/20 transition-all">
            <label className="text-[10px] text-[#9EA8B3] font-bold block mb-1">
              ⏱️ {language === 'ar' ? '4. الوقت المتاح' : '4. Duration'}
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value as any)}
              className="w-full bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer touch-manipulation"
            >
              <option value="4_to_6h" className="bg-[#090B0E]">
                {language === 'ar' ? '4 إلى 6 ساعات 🌆' : '4 - 6 Hours 🌆'}
              </option>
              <option value="under_2h" className="bg-[#090B0E]">
                {language === 'ar' ? 'أقل من ساعتين ⚡' : '< 2 Hours ⚡'}
              </option>
              <option value="2_to_4h" className="bg-[#090B0E]">
                {language === 'ar' ? '2 إلى 4 ساعات ☕' : '2 - 4 Hours ☕'}
              </option>
              <option value="half_day_night" className="bg-[#090B0E]">
                {language === 'ar' ? 'سهرة ليلية 🌙' : 'Night Out 🌙'}
              </option>
              <option value="full_day" className="bg-[#090B0E]">
                {language === 'ar' ? 'يوم كامل 🚀' : 'Full Day 🚀'}
              </option>
            </select>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 hover:border-white/20 transition-all col-span-2 sm:col-span-1">
            <label className="text-[10px] text-[#9EA8B3] font-bold block mb-1">
              ✨ {language === 'ar' ? '5. جو ومود الطلعة' : '5. Vibe & Mood'}
            </label>
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value as any)}
              className="w-full bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer touch-manipulation"
            >
              <option value="beach_sunset" className="bg-[#090B0E]">
                {language === 'ar' ? 'بحر وغروب 🌊' : 'Beach & Sunset 🌊'}
              </option>
              <option value="food" className="bg-[#090B0E]">
                {language === 'ar' ? 'أكل ومطاعم 🍔' : 'Food & Dining 🍔'}
              </option>
              <option value="coffee_dessert" className="bg-[#090B0E]">
                {language === 'ar' ? 'قهوة مختصة وحلى ☕' : 'Coffee & Dessert ☕'}
              </option>
              <option value="heritage_arts" className="bg-[#090B0E]">
                {language === 'ar' ? 'تراث وفنون وثقافة 🏛️' : 'Heritage & Culture 🏛️'}
              </option>
              <option value="gaming_challenges" className="bg-[#090B0E]">
                {language === 'ar' ? 'ألعاب وتحديات 🎯' : 'Gaming & Fun 🎯'}
              </option>
              <option value="free_walk" className="bg-[#090B0E]">
                {language === 'ar' ? 'تمشية مجانية 🆓' : 'Free Walk 🆓'}
              </option>
            </select>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-start hidden sm:block">
            <span className="text-xs text-[#9EA8B3] block">
              {language === 'ar'
                ? `الخطة الحالية: ${activeDest.districtName} • ${companions} • ${vibe}`
                : `Active Preset: ${activeDest.titleEn}`}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBuildPlan}
            disabled={isGeneratingPlan}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#E5A962] to-[#D48B38] text-[#090B0E] font-bold text-sm shadow-lg shadow-[#E5A962]/20 flex items-center justify-center gap-2 cursor-pointer touch-manipulation disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-[#090B0E]" />
            <span>
              {language === 'ar' ? '✨ ابتكر خطتي الذكية في جدة الحين' : '✨ Generate My Jeddah Plan Now'}
            </span>
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
