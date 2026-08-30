'use client';

import React, { useState } from 'react';
import { MapPin, Users, Coins, Clock, Sparkles, ArrowLeft, ArrowRight, Compass } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { DistrictId, BudgetTier, DurationOption, VibeType, CompanionType } from '@/types';
import { JEDDAH_DISTRICTS } from '@/data/districts';
import { soundEngine } from '@/utils/audioEngine';

export const QuickPlannerBar: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const updateWizardPreferences = useItineraryStore((state) => state.updateWizardPreferences);
  const generatePlanFromPreferences = useItineraryStore((state) => state.generatePlanFromPreferences);
  const isGeneratingPlan = useItineraryStore((state) => state.isGeneratingPlan);

  const [district, setDistrict] = useState<DistrictId | 'all_jeddah'>('all_jeddah');
  const [companions, setCompanions] = useState<CompanionType>('friends');
  const [budget, setBudget] = useState<BudgetTier>('moderate');
  const [duration, setDuration] = useState<DurationOption>('4_to_6h');
  const [vibe, setVibe] = useState<VibeType>('food');

  const handleGenerate = () => {
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
    <div className="p-5 sm:p-7 rounded-[2rem] bg-abyss-900/90 backdrop-blur-2xl border border-gold-500/30 shadow-cinematic space-y-4 transition-all duration-300">
      {/* Header text */}
      <div className="flex items-center justify-between text-xs sm:text-sm font-black">
        <div className="flex items-center gap-2 text-gold-400">
          <Sparkles className="w-4 h-4 text-coral-400 animate-pulse" />
          <span>{language === 'ar' ? 'المحدد السريع • رتّب طلعتك بـ 5 خيارات:' : 'Quick Dock • 5-Pillar Setup:'}</span>
        </div>
        <span className="text-[11px] text-teal-300 font-bold hidden sm:inline-block">
          {language === 'ar' ? 'مسار فوري مدعوم بالذكاء الاصطناعي ⚡' : 'Instant AI Route ⚡'}
        </span>
      </div>

      {/* 5-Column Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
        {/* Selector 1: District */}
        <div className="space-y-1.5 text-start">
          <label className="text-xs font-bold text-gold-400 flex items-center gap-1.5 ps-1">
            <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>{language === 'ar' ? '1. الحي / المنطقة' : '1. District'}</span>
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value as any)}
            className="w-full py-3.5 px-3.5 rounded-2xl bg-abyss-950/90 border border-white/15 text-pearl font-bold text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-gold-400 hover:border-gold-400/60 transition-all cursor-pointer shadow-inner touch-manipulation"
          >
            <option value="all_jeddah" className="bg-abyss-950 text-pearl">
              {language === 'ar' ? 'جدة كلها 🌊' : 'All Jeddah 🌊'}
            </option>
            {JEDDAH_DISTRICTS.map((d) => (
              <option key={d.id} value={d.id} className="bg-abyss-950 text-pearl">
                {language === 'ar' ? d.nameAr : d.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Selector 2: Companions */}
        <div className="space-y-1.5 text-start">
          <label className="text-xs font-bold text-gold-400 flex items-center gap-1.5 ps-1">
            <Users className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>{language === 'ar' ? '2. مين معاك؟' : '2. Companions'}</span>
          </label>
          <select
            value={companions}
            onChange={(e) => setCompanions(e.target.value as any)}
            className="w-full py-3.5 px-3.5 rounded-2xl bg-abyss-950/90 border border-white/15 text-pearl font-bold text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-gold-400 hover:border-gold-400/60 transition-all cursor-pointer shadow-inner touch-manipulation"
          >
            <option value="solo" className="bg-abyss-950 text-pearl">
              {language === 'ar' ? 'لحالي أروّق 🚶' : 'Solo 🚶'}
            </option>
            <option value="couples" className="bg-abyss-950 text-pearl">
              {language === 'ar' ? 'شخصين / كوبل 👩‍❤️‍👨' : 'Couples 👩‍❤️‍👨'}
            </option>
            <option value="friends" className="bg-abyss-950 text-pearl">
              {language === 'ar' ? 'مع الشلة 🥳' : 'Friends 🥳'}
            </option>
            <option value="family" className="bg-abyss-950 text-pearl">
              {language === 'ar' ? 'جمعة عائلة 👨‍👩‍👧‍👦' : 'Family 👨‍👩‍👧‍👦'}
            </option>
            <option value="kids" className="bg-abyss-950 text-pearl">
              {language === 'ar' ? 'مع أطفال 👶' : 'With Kids 👶'}
            </option>
            <option value="business" className="bg-abyss-950 text-pearl">
              {language === 'ar' ? 'لقاء عمل 💼' : 'Business 💼'}
            </option>
          </select>
        </div>

        {/* Selector 3: Budget */}
        <div className="space-y-1.5 text-start">
          <label className="text-xs font-bold text-gold-400 flex items-center gap-1.5 ps-1">
            <Coins className="w-3.5 h-3.5 text-gold-400 shrink-0" />
            <span>{language === 'ar' ? '3. الميزانية' : '3. Budget'}</span>
          </label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value as any)}
            className="w-full py-3.5 px-3.5 rounded-2xl bg-abyss-950/90 border border-white/15 text-pearl font-bold text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-gold-400 hover:border-gold-400/60 transition-all cursor-pointer shadow-inner touch-manipulation"
          >
            <option value="economy" className="bg-abyss-950 text-pearl">
              {language === 'ar' ? 'على قد الجيب (≤60 ر.س)' : 'Economy (≤60 SAR)'}
            </option>
            <option value="moderate" className="bg-abyss-950 text-pearl">
              {language === 'ar' ? 'متوازن (~150 ر.س)' : 'Moderate (~150 SAR)'}
            </option>
            <option value="premium" className="bg-abyss-950 text-pearl">
              {language === 'ar' ? 'دلع وفخامة (~350 ر.س)' : 'Premium (~350 SAR)'}
            </option>
            <option value="luxury" className="bg-abyss-950 text-pearl">
              {language === 'ar' ? 'VIP فخم (+600 ر.س)' : 'VIP (+600 SAR)'}
            </option>
          </select>
        </div>

        {/* Selector 4: Duration */}
        <div className="space-y-1.5 text-start">
          <label className="text-xs font-bold text-gold-400 flex items-center gap-1.5 ps-1">
            <Clock className="w-3.5 h-3.5 text-coral-400 shrink-0" />
            <span>{language === 'ar' ? '4. الوقت المتاح' : '4. Duration'}</span>
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value as any)}
            className="w-full py-3.5 px-3.5 rounded-2xl bg-abyss-950/90 border border-white/15 text-pearl font-bold text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-gold-400 hover:border-gold-400/60 transition-all cursor-pointer shadow-inner touch-manipulation"
          >
            <option value="under_2h" className="bg-abyss-950 text-pearl">
              {language === 'ar' ? 'أقل من ساعتين ⚡' : '< 2 Hours ⚡'}
            </option>
            <option value="2_to_4h" className="bg-abyss-950 text-pearl">
              {language === 'ar' ? '2 إلى 4 ساعات ☕' : '2 - 4 Hours ☕'}
            </option>
            <option value="4_to_6h" className="bg-abyss-950 text-pearl">
              {language === 'ar' ? '4 إلى 6 ساعات 🌆' : '4 - 6 Hours 🌆'}
            </option>
            <option value="half_day_night" className="bg-abyss-950 text-pearl">
              {language === 'ar' ? 'سهرة مسائية 🌙' : 'Night Vibe 🌙'}
            </option>
            <option value="full_day" className="bg-abyss-950 text-pearl">
              {language === 'ar' ? 'يوم كامل 🚀' : 'Full Day 🚀'}
            </option>
          </select>
        </div>

        {/* Selector 5: Vibe */}
        <div className="space-y-1.5 text-start">
          <label className="text-xs font-bold text-gold-400 flex items-center gap-1.5 ps-1">
            <Compass className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>{language === 'ar' ? '5. جو ومود الطلعة' : '5. Vibe'}</span>
          </label>
          <select
            value={vibe}
            onChange={(e) => setVibe(e.target.value as any)}
            className="w-full py-3.5 px-3.5 rounded-2xl bg-abyss-950/90 border border-white/15 text-pearl font-bold text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-gold-400 hover:border-gold-400/60 transition-all cursor-pointer shadow-inner touch-manipulation"
          >
            <option value="food" className="bg-abyss-950 text-pearl">
              {language === 'ar' ? 'أكل ومطاعم 🍔' : 'Food & Dining 🍔'}
            </option>
            <option value="coffee_dessert" className="bg-abyss-950 text-pearl">
              {language === 'ar' ? 'قهوة وحلى ☕' : 'Coffee & Dessert ☕'}
            </option>
            <option value="beach_sunset" className="bg-abyss-950 text-pearl">
              {language === 'ar' ? 'بحر وغروب 🌊' : 'Beach & Sunset 🌊'}
            </option>
            <option value="gaming_challenges" className="bg-abyss-950 text-pearl">
              {language === 'ar' ? 'ألعاب وحماس 🎯' : 'Gaming & Fun 🎯'}
            </option>
            <option value="heritage_arts" className="bg-abyss-950 text-pearl">
              {language === 'ar' ? 'تراث وفنون 🏛️' : 'Heritage & Arts 🏛️'}
            </option>
          </select>
        </div>
      </div>

      {/* Primary Glowing Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGeneratingPlan}
          className="w-full py-4 px-6 rounded-2xl bg-coral-500 hover:bg-coral-600 active:bg-coral-700 text-white font-black text-sm sm:text-base shadow-glow-coral hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[54px]"
        >
          {isGeneratingPlan ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-gold-300" />
              <span>{language === 'ar' ? '✨ ابنِ خطتي في جدة بنقرة واحدة' : '✨ Build My Jeddah Plan in 1 Click'}</span>
              {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
