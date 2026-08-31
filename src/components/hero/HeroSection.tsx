'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { useItineraryStore } from '@/store/useItineraryStore';
import { useLanguage } from '@/hooks/useLanguage';
import { soundEngine } from '@/utils/audioEngine';
import { getAssetUrl } from '@/utils/paths';
import { DistrictId, CompanionType, BudgetTier, DurationOption, VibeType } from '@/types';

interface Destination {
  id: string;
  name: string;
  nameEn: string;
  tagline: string;
  taglineEn: string;
  badge: string;
  badgeEn: string;
  weather: string;
  weatherEn: string;
  bgImage: string;
  districtId: DistrictId | 'all_jeddah';
  district: string;
  districtEn: string;
  vibe: VibeType;
  vibeName: string;
  vibeNameEn: string;
  budgetTier: BudgetTier;
  duration: DurationOption;
}

const DESTINATIONS: Destination[] = [
  {
    id: 'obhur',
    name: 'أبحر والواجهة البحرية',
    nameEn: 'Obhur & Waterfront Marina',
    tagline: 'روقان الغروب، نسيم البحر الأحمر، وأرقى شواطئ ونوادي اليخوت 🌊',
    taglineEn: 'Golden sunset breeze, Red Sea yachts, and serene private beach lounges 🌊',
    badge: '📍 عروس البحر الأحمر • الواجهة والنوادي الشاطئية',
    badgeEn: '📍 Red Sea Bride • Waterfront & Beach Clubs',
    weather: '🌊 28°C • نسيم البحر عليل • غروب ذهبي',
    weatherEn: '🌊 28°C • Gentle Sea Breeze • Golden Sunset',
    bgImage: getAssetUrl('/images/realms/obhur-marina.jpg'),
    districtId: 'obhur',
    district: 'أبحر (الشمالية والجنوبية)',
    districtEn: 'Obhur (North & South)',
    vibe: 'beach_sunset',
    vibeName: 'بحر وغروب 🌊',
    vibeNameEn: 'Beach & Sunset 🌊',
    budgetTier: 'moderate',
    duration: '4_to_6h',
  },
  {
    id: 'balad',
    name: 'رواشين وتراث البلد',
    nameEn: 'Historic Al-Balad & Rawashin',
    tagline: 'أصالة الماضي، أزقة التاريخ العتيقة، وبسطات الشاي الحجازي 🏛️',
    taglineEn: 'Timeless Hijazi heritage, ancient coral stone alleys, and lantern tea nights 🏛️',
    badge: '📍 التراث العالمي • قلب جدة التاريخي',
    badgeEn: '📍 World Heritage • Historic Heart of Jeddah',
    weather: '🌙 26°C • أجواء مسائية ساحرة',
    weatherEn: '🌙 26°C • Magical Evening • Al-Balad Lanterns',
    bgImage: getAssetUrl('/images/realms/albalad-heritage.jpg'),
    districtId: 'al-balad',
    district: 'البلد التاريخية',
    districtEn: 'Historic Al-Balad',
    vibe: 'heritage_arts',
    vibeName: 'تراث وسهرات 🏛️',
    vibeNameEn: 'Heritage & Culture 🏛️',
    budgetTier: 'economy',
    duration: '2_to_4h',
  },
  {
    id: 'rawdah',
    name: 'كافيهات ومطاعم الروضة',
    nameEn: 'Al-Rawdah Cafes & Dining',
    tagline: 'عاصمة الروقان، أحدث محامص القهوة المختصة، وأرقى المطاعم العالمية ☕',
    taglineEn: 'Specialty coffee capital, artisanal roasters, and world-class culinary gems ☕',
    badge: '📍 النبض العصري • أرقى مقاهي ومطاعم جدة',
    badgeEn: '📍 Urban Pulse • Premier Cafes & Dining Hub',
    weather: '✨ 27°C • أجواء حيوية ومنعشة',
    weatherEn: '✨ 27°C • Vibrant Atmosphere • Specialty Coffee Hub',
    bgImage: getAssetUrl('/images/realms/alrawdah-coffee.jpg'),
    districtId: 'al-rawdah',
    district: 'حي الروضة',
    districtEn: 'Al-Rawdah District',
    vibe: 'coffee_dessert',
    vibeName: 'قهوة وحلى ☕',
    vibeNameEn: 'Coffee & Dessert ☕',
    budgetTier: 'premium',
    duration: 'under_2h',
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

  const handleSelectDestination = (idx: number) => {
    soundEngine.playClick();
    setActiveIdx(idx);
    const dest = DESTINATIONS[idx];
    setDistrict(dest.districtId);
    setVibe(dest.vibe);
    setBudget(dest.budgetTier);
    setDuration(dest.duration);
  };

  const handleBuildPlan = () => {
    soundEngine.playSuccess();
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
    <section className="relative min-h-[92dvh] w-full flex flex-col items-center justify-between px-3 sm:px-6 pt-4 sm:pt-6 pb-8 select-none">
      {/* 1. ATMOSPHERIC BACKGROUND WITH VIGNETTE */}
      <div className="absolute inset-0 z-0 bg-[#090B0E]">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeDest.id}
            src={activeDest.bgImage}
            alt={language === 'ar' ? activeDest.name : activeDest.nameEn}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover brightness-[0.65] contrast-[1.15]"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-[#090B0E]/80 via-transparent to-[#090B0E]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#090B0E_85%)]" />
      </div>

      {/* 2. CENTER CONTENT STACK */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto my-auto py-2">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-xl bg-white/[0.06] border border-white/15 text-xs text-[#F3CA95] mb-4 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#4E9F96] animate-pulse" />
          <span>{language === 'ar' ? activeDest.badge : activeDest.badgeEn}</span>
        </div>

        {/* Master Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#FBFBFA] tracking-tight leading-[1.25] mb-3 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
          {language === 'ar' ? (
            <>
              المواقع تشتتك..{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5A962] to-[#D48B38]">
                وجداول
              </span>{' '}
              يرتّب لك الطلعة كاملة
            </>
          ) : (
            <>
              Endless options..{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5A962] to-[#D48B38]">
                Jadawel
              </span>{' '}
              curates your full outing
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-base text-[#9EA8B3] max-w-2xl leading-relaxed mb-6">
          {language === 'ar' ? activeDest.tagline : activeDest.taglineEn}
        </p>

        {/* 3-Destination Switcher Cards */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 w-full max-w-xl mb-4">
          {DESTINATIONS.map((dest, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={dest.id}
                onClick={() => handleSelectDestination(idx)}
                className={`flex items-center gap-2.5 p-2 sm:px-3 sm:py-2.5 rounded-2xl border transition-all text-start cursor-pointer backdrop-blur-xl touch-manipulation ${
                  isActive
                    ? 'bg-[#E5A962]/15 border-[#E5A962] shadow-[0_0_20px_rgba(229,169,98,0.25)]'
                    : 'bg-white/[0.04] border-white/10 hover:border-white/20 hover:bg-white/[0.08]'
                }`}
              >
                <img
                  src={dest.bgImage}
                  alt=""
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover border border-white/20 shadow shrink-0"
                />
                <div className="overflow-hidden min-w-0">
                  <span className="text-[9px] sm:text-[10px] text-[#F3CA95] block font-medium">
                    {language === 'ar' ? `الوجهة ${idx + 1}` : `Portal ${idx + 1}`}
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-white block truncate">
                    {language === 'ar' ? dest.name : dest.nameEn}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. FLOATING 5-PILLAR SMART PLANNER DOCK */}
      <div className="relative z-20 w-full max-w-5xl backdrop-blur-2xl bg-[#090B0E]/90 border border-white/15 rounded-3xl p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E5A962]" />
            <span className="text-xs sm:text-sm font-bold text-white">
              {language === 'ar'
                ? 'المحدد السريع • رتّب طلعة جدة بـ 5 خيارات:'
                : 'Quick Dock • Craft Jeddah Outing in 5 Steps:'}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs text-[#4E9F96] bg-[#4E9F96]/15 px-3 py-1 rounded-full border border-[#4E9F96]/30 font-medium hidden sm:inline-block">
            {language === 'ar' ? 'مسار فوري مدعوم بالذكاء الاصطناعي ⚡' : 'Instant AI Route ⚡'}
          </span>
        </div>

        {/* 5 Selectors Grid (Calm & Subtle Borders) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 mb-4">
          <div className="bg-white/[0.04] border border-white/10 hover:border-white/20 rounded-2xl p-2.5 transition-colors">
            <label className="text-[10px] text-[#9EA8B3] block mb-1">
              📍 {language === 'ar' ? '1. الحي / المنطقة' : '1. District'}
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value as any)}
              className="w-full bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer touch-manipulation"
            >
              <option value="obhur" className="bg-[#090B0E] text-white">
                {language === 'ar' ? 'أبحر (الشمالية والجنوبية)' : 'Obhur (North & South)'}
              </option>
              <option value="al-rawdah" className="bg-[#090B0E] text-white">
                {language === 'ar' ? 'حي الروضة' : 'Al-Rawdah District'}
              </option>
              <option value="al-balad" className="bg-[#090B0E] text-white">
                {language === 'ar' ? 'البلد التاريخية' : 'Historic Al-Balad'}
              </option>
              <option value="al-shati" className="bg-[#090B0E] text-white">
                {language === 'ar' ? 'حي الشاطئ والكورنيش' : 'Al-Shati & Corniche'}
              </option>
              <option value="all_jeddah" className="bg-[#090B0E] text-white">
                {language === 'ar' ? 'جدة كلها 🌊' : 'All Jeddah 🌊'}
              </option>
            </select>
          </div>

          <div className="bg-white/[0.04] border border-white/10 hover:border-white/20 rounded-2xl p-2.5 transition-colors">
            <label className="text-[10px] text-[#9EA8B3] block mb-1">
              👥 {language === 'ar' ? '2. مين معاك؟' : '2. Companions'}
            </label>
            <select
              value={companions}
              onChange={(e) => setCompanions(e.target.value as any)}
              className="w-full bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer touch-manipulation"
            >
              <option value="friends" className="bg-[#090B0E] text-white">
                {language === 'ar' ? 'مع الشلة 🥳' : 'Friends 🥳'}
              </option>
              <option value="solo" className="bg-[#090B0E] text-white">
                {language === 'ar' ? 'لحالي أروّق 🚶' : 'Solo 🚶'}
              </option>
              <option value="couples" className="bg-[#090B0E] text-white">
                {language === 'ar' ? 'شخصين / كوبل 👩‍❤️‍👨' : 'Couples 👩‍❤️‍👨'}
              </option>
              <option value="family" className="bg-[#090B0E] text-white">
                {language === 'ar' ? 'جمعة عائلة 👨‍👩‍👧‍👦' : 'Family 👨‍👩‍👧‍👦'}
              </option>
              <option value="kids" className="bg-[#090B0E] text-white">
                {language === 'ar' ? 'مع أطفال 👶' : 'With Kids 👶'}
              </option>
            </select>
          </div>

          <div className="bg-white/[0.04] border border-white/10 hover:border-white/20 rounded-2xl p-2.5 transition-colors">
            <label className="text-[10px] text-[#9EA8B3] block mb-1">
              💰 {language === 'ar' ? '3. الميزانية' : '3. Budget'}
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value as any)}
              className="w-full bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer touch-manipulation"
            >
              <option value="moderate" className="bg-[#090B0E] text-white">
                {language === 'ar' ? 'متوازن (~150 ر.س)' : 'Moderate (~150 SAR)'}
              </option>
              <option value="free" className="bg-[#090B0E] text-white">
                {language === 'ar' ? 'خطة مجانية 100% 🆓 (0 ر.س)' : '100% Free Plan 🆓 (0 SAR)'}
              </option>
              <option value="economy" className="bg-[#090B0E] text-white">
                {language === 'ar' ? 'على قد الجيب (≤60 ر.س)' : 'Budget Saver (≤60 SAR)'}
              </option>
              <option value="premium" className="bg-[#090B0E] text-white">
                {language === 'ar' ? 'فاخر VIP (+350 ر.س)' : 'VIP Tier (+350 SAR)'}
              </option>
            </select>
          </div>

          <div className="bg-white/[0.04] border border-white/10 hover:border-white/20 rounded-2xl p-2.5 transition-colors">
            <label className="text-[10px] text-[#9EA8B3] block mb-1">
              ⏱️ {language === 'ar' ? '4. الوقت المتاح' : '4. Duration'}
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value as any)}
              className="w-full bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer touch-manipulation"
            >
              <option value="4_to_6h" className="bg-[#090B0E] text-white">
                {language === 'ar' ? '4 إلى 6 ساعات 🌆' : '4 - 6 Hours 🌆'}
              </option>
              <option value="under_2h" className="bg-[#090B0E] text-white">
                {language === 'ar' ? 'أقل من ساعتين ⚡' : '< 2 Hours ⚡'}
              </option>
              <option value="2_to_4h" className="bg-[#090B0E] text-white">
                {language === 'ar' ? '2 إلى 4 ساعات ☕' : '2 - 4 Hours ☕'}
              </option>
              <option value="half_day_night" className="bg-[#090B0E] text-white">
                {language === 'ar' ? 'سهرة ليلية 🌙' : 'Night Out 🌙'}
              </option>
              <option value="full_day" className="bg-[#090B0E] text-white">
                {language === 'ar' ? 'يوم كامل 🚀' : 'Full Day 🚀'}
              </option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-white/[0.04] border border-white/10 hover:border-white/20 rounded-2xl p-2.5 transition-colors">
            <label className="text-[10px] text-[#9EA8B3] block mb-1">
              🎭 {language === 'ar' ? '5. جو الطلعة' : '5. Vibe & Mood'}
            </label>
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value as any)}
              className="w-full bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer touch-manipulation"
            >
              <option value="beach_sunset" className="bg-[#090B0E] text-white">
                {language === 'ar' ? 'بحر وغروب 🌊' : 'Beach & Sunset 🌊'}
              </option>
              <option value="food" className="bg-[#090B0E] text-white">
                {language === 'ar' ? 'أكل ومطاعم 🍔' : 'Food & Dining 🍔'}
              </option>
              <option value="coffee_dessert" className="bg-[#090B0E] text-white">
                {language === 'ar' ? 'قهوة مختصة وحلى ☕' : 'Coffee & Dessert ☕'}
              </option>
              <option value="heritage_arts" className="bg-[#090B0E] text-white">
                {language === 'ar' ? 'تراث وفنون وثقافة 🏛️' : 'Heritage & Arts 🏛️'}
              </option>
              <option value="gaming_challenges" className="bg-[#090B0E] text-white">
                {language === 'ar' ? 'ألعاب وحماس 🎯' : 'Gaming & Fun 🎯'}
              </option>
              <option value="free_walk" className="bg-[#090B0E] text-white">
                {language === 'ar' ? 'تمشية مجانية 🆓' : 'Free Walk 🆓'}
              </option>
            </select>
          </div>
        </div>

        {/* Master Glowing CTA Button */}
        <motion.button
          whileHover={{ scale: 1.01, boxShadow: '0 0 35px rgba(229, 169, 98, 0.4)' }}
          whileTap={{ scale: 0.99 }}
          onClick={handleBuildPlan}
          disabled={isGeneratingPlan}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#E5A962] to-[#D48B38] text-[#090B0E] font-bold text-sm sm:text-base shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation disabled:opacity-50"
        >
          <span>
            {language === 'ar'
              ? '✨ ابنِ خطتي في جدة بنقرة واحدة'
              : '✨ Build My Jeddah Plan in One Click'}
          </span>
          {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;
