'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Users,
  Clock,
  Flame,
  Wind,
  Coins,
  SlidersHorizontal,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  Building2,
  Compass,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { JEDDAH_DISTRICTS } from '@/data/districts';
import { soundEngine } from '@/utils/audioEngine';

export const PlanGeneratorWizard: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const wizardStep = useItineraryStore((state) => state.wizardStep);
  const setWizardStep = useItineraryStore((state) => state.setWizardStep);
  const wizardPreferences = useItineraryStore((state) => state.wizardPreferences);
  const updateWizardPreferences = useItineraryStore((state) => state.updateWizardPreferences);
  const generatePlanFromPreferences = useItineraryStore((state) => state.generatePlanFromPreferences);
  const isGeneratingPlan = useItineraryStore((state) => state.isGeneratingPlan);

  const stepHeaders = [
    {
      titleAr: 'من وين تحب تبدأ طلعتك؟ 📍',
      titleEn: 'Where do you want to start? 📍',
      subAr: 'اختر الحي أو المنطقة الأقرب لك لترتيب خط سير مباشر بدون زحام ومسافات متناسقة',
      subEn: 'Pick your preferred district for optimized direct linear routing',
    },
    {
      titleAr: 'مين طالع معاك اليوم؟ 👥',
      titleEn: 'Who is joining your outing? 👥',
      subAr: 'سنخصص الأماكن والفعاليات لتناسب ديناميكية الجلسة والمرافقة بدقة',
      subEn: 'We tailor the vibe to your group dynamics and preferences',
    },
    {
      titleAr: 'كم المدة المتوفرة لطلعتكم؟ ⏱️',
      titleEn: 'How much time do you have? ⏱️',
      subAr: 'من المشاوير السريعة إلى برامج اليوم الكامل المتكاملة',
      subEn: 'From quick coffee pitstops to full-day immersive experiences',
    },
    {
      titleAr: 'وش جو ومود الطلعة اليوم؟ 🔥',
      titleEn: 'What is the vibe for today? 🔥',
      subAr: 'أكل ومطاعم، كافيهات، بحر وغروب، أو فعاليات وألعاب وتحديات',
      subEn: 'Food, specialty coffee, sunset ocean, or entertainment & games',
    },
    {
      titleAr: 'وش تفضل طبيعة الجلسة؟ 🌴❄️',
      titleEn: 'Preferred ambience? 🌴❄️',
      subAr: 'صالات مكيفة، هواء طلق وبحر، أو مزيج متوازن بين الداخل والخارج',
      subEn: 'Indoor AC, open air sea breeze, or a balanced hybrid mix',
    },
    {
      titleAr: 'مستوى الميزانية التقديرية للشخص؟ 💰',
      titleEn: 'Estimated budget per person? 💰',
      subAr: 'حساب دقيق وموزون للوجبات، التذاكر، والمشاوير بالريال السعودي',
      subEn: 'Accurate breakdown of meals, tickets, and transit in SAR',
    },
    {
      titleAr: 'تفضيلات إضافية تهمك؟ ⚙️',
      titleEn: 'Additional preferences? ⚙️',
      subAr: 'تجنب الزحام، مواقف سيارات سهلة، أو أماكن بدون حجز مسبق',
      subEn: 'Avoid traffic, easy parking, or walk-in destinations',
    },
  ];

  const currentHeader = stepHeaders[wizardStep] || stepHeaders[0];

  const handleNext = () => {
    soundEngine.playClick();
    if (wizardStep < 6) {
      setWizardStep(wizardStep + 1);
    } else {
      generatePlanFromPreferences();
    }
  };

  const handleBack = () => {
    soundEngine.playClick();
    if (wizardStep > 0) {
      setWizardStep(wizardStep - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 my-2 sm:my-4 pb-28 sm:pb-4">
      {/* Wizard Card Container */}
      <div className="bg-abyss-900/95 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-9 border border-gold-500/30 shadow-cinematic transition-all duration-300">
        {/* Step Progress Tracker */}
        <div className="mb-6 sm:mb-8 space-y-2.5 sm:space-y-3">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="text-gold-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
              <Sparkles className="w-3.5 h-3.5 text-coral-400" />
              <span>{language === 'ar' ? `المرحلة ${wizardStep + 1} من 7` : `Step ${wizardStep + 1} of 7`}</span>
            </span>
            <span className="text-pearl font-bold bg-abyss-800 px-2.5 sm:px-3 py-1 rounded-xl border border-white/10 text-[11px] sm:text-xs">
              {Math.round(((wizardStep + 1) / 7) * 100)}%
            </span>
          </div>

          <div className="w-full h-2 sm:h-2.5 rounded-full bg-abyss-950 overflow-hidden border border-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-gold-500 via-coral-500 to-teal-400 rounded-full"
              initial={{ width: `${(wizardStep / 7) * 100}%` }}
              animate={{ width: `${((wizardStep + 1) / 7) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Header */}
        <div className="mb-6 sm:mb-8 space-y-1.5 sm:space-y-2 text-start">
          <h2 className="text-xl sm:text-3xl font-black text-pearl tracking-tight">
            {language === 'ar' ? currentHeader.titleAr : currentHeader.titleEn}
          </h2>
          <p className="text-xs sm:text-sm text-pearl-muted font-medium leading-relaxed">
            {language === 'ar' ? currentHeader.subAr : currentHeader.subEn}
          </p>
        </div>

        {/* Step Dynamic Content with Framer Motion */}
        <div className="min-h-[260px] sm:min-h-[290px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={wizardStep}
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Step 0: Location */}
              {wizardStep === 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5">
                  <div
                    onClick={() => {
                      soundEngine.playClick();
                      updateWizardPreferences({ startingDistrict: 'all_jeddah' });
                    }}
                    className={`min-h-[44px] p-4 sm:p-5 rounded-2xl border text-start cursor-pointer transition-all duration-200 touch-manipulation active:scale-[0.97] ${
                      wizardPreferences.startingDistrict === 'all_jeddah'
                        ? 'bg-abyss-700 border-gold-400 ring-2 ring-gold-400/50 text-gold-300 font-black shadow-glow-gold scale-[1.01]'
                        : 'bg-abyss-950/80 border-white/10 hover:border-gold-400/40 text-pearl hover:bg-abyss-800'
                    }`}
                  >
                    <span className="text-xl sm:text-2xl block mb-1 sm:mb-2">🌊</span>
                    <h4 className="text-xs sm:text-sm font-black text-pearl">{language === 'ar' ? 'جدة كلها 🌊' : 'All Jeddah'}</h4>
                    <p className="text-[10px] sm:text-[11px] text-pearl-muted mt-0.5 truncate">
                      {language === 'ar' ? 'أفضل المعالم' : 'Best of Jeddah'}
                    </p>
                  </div>

                  {JEDDAH_DISTRICTS.map((d) => {
                    const isSelected = wizardPreferences.startingDistrict === d.id;
                    return (
                      <div
                        key={d.id}
                        onClick={() => {
                          soundEngine.playClick();
                          updateWizardPreferences({ startingDistrict: d.id });
                        }}
                        className={`min-h-[44px] p-3.5 sm:p-4 rounded-2xl border text-start cursor-pointer transition-all duration-200 touch-manipulation active:scale-[0.97] ${
                          isSelected
                            ? 'bg-abyss-700 border-gold-400 ring-2 ring-gold-400/50 text-gold-300 font-black shadow-glow-gold scale-[1.01]'
                            : 'bg-abyss-950/80 border-white/10 hover:border-gold-400/40 text-pearl hover:bg-abyss-800'
                        }`}
                      >
                        <MapPin className={`w-4 h-4 sm:w-5 sm:h-5 mb-1.5 sm:mb-2 ${isSelected ? 'text-gold-400' : 'text-teal-400'}`} />
                        <h4 className="text-xs sm:text-sm font-black text-pearl">{language === 'ar' ? d.nameAr : d.nameEn}</h4>
                        <p className="text-[10px] sm:text-[11px] text-pearl-muted mt-0.5 truncate font-medium">{language === 'ar' ? d.vibeAr : d.vibeEn}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Step 1: Companions */}
              {wizardStep === 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-3.5">
                  {[
                    { id: 'solo', labelAr: 'لحالي أروّق 🚶', labelEn: 'Solo 🚶', desc: 'هدوء وقهوة مختصة واستجمام' },
                    { id: 'couples', labelAr: 'شخصين / كوبل 👩‍❤️‍👨', labelEn: 'Couples 👩‍❤️‍👨', desc: 'أجواء رومانسية وغروب بحري' },
                    { id: 'friends', labelAr: 'مع الشلة 🥳', labelEn: 'Friends Hangout 🥳', desc: 'فعاليات وضحك وتحديات جماعية' },
                    { id: 'family', labelAr: 'جمعة عائلة 👨‍👩‍👧‍👦', labelEn: 'Family 👨‍👩‍👧‍👦', desc: 'جلسات عائلية مريحة ومطاعم واسعة' },
                    { id: 'kids', labelAr: 'مع أطفال 👶', labelEn: 'With Kids 👶', desc: 'ألعاب وأماكن ترفيهية آمنة' },
                    { id: 'business', labelAr: 'لقاء عمل 💼', labelEn: 'Business 💼', desc: 'أجواء هادئة وقهوة راقية' },
                  ].map((c) => {
                    const isSelected = wizardPreferences.companions === c.id;
                    return (
                      <div
                        key={c.id}
                        onClick={() => {
                          soundEngine.playClick();
                          updateWizardPreferences({ companions: c.id as any });
                        }}
                        className={`min-h-[44px] p-4 sm:p-5 rounded-2xl border text-start cursor-pointer transition-all duration-200 touch-manipulation active:scale-[0.97] ${
                          isSelected
                            ? 'bg-abyss-700 border-gold-400 ring-2 ring-gold-400/50 text-gold-300 font-black shadow-glow-gold scale-[1.01]'
                            : 'bg-abyss-950/80 border-white/10 hover:border-gold-400/40 text-pearl hover:bg-abyss-800'
                        }`}
                      >
                        <h4 className="text-sm sm:text-base font-black text-pearl mb-1">{language === 'ar' ? c.labelAr : c.labelEn}</h4>
                        <p className="text-[11px] sm:text-xs text-pearl-muted font-medium leading-relaxed">{c.desc}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Step 2: Duration */}
              {wizardStep === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
                  {[
                    { id: 'under_2h', time: '< ساعتين ⚡', desc: 'مشوار قهوة سريع ومباشر' },
                    { id: '2_to_4h', time: '2 إلى 4 ساعات ☕', desc: 'قهوة مع نشاط خفيف أو تسوق' },
                    { id: '4_to_6h', time: '4 إلى 6 ساعات 🌆', desc: 'الخيار الأفضل: غروب بحري + عشاء' },
                    { id: 'half_day_night', time: 'سهرة مسائية 🌙', desc: 'من بعد العشاء حتى آخر الليل' },
                    { id: 'full_day', time: 'يوم كامل 🚀', desc: 'برنامج حافل يبدأ من الصباح أو العصر' },
                  ].map((d) => {
                    const isSelected = wizardPreferences.duration === d.id;
                    return (
                      <div
                        key={d.id}
                        onClick={() => {
                          soundEngine.playClick();
                          updateWizardPreferences({ duration: d.id as any });
                        }}
                        className={`min-h-[44px] p-4 sm:p-5 rounded-2xl border text-start cursor-pointer transition-all duration-200 touch-manipulation active:scale-[0.97] ${
                          isSelected
                            ? 'bg-abyss-700 border-gold-400 ring-2 ring-gold-400/50 text-gold-300 font-black shadow-glow-gold scale-[1.01]'
                            : 'bg-abyss-950/80 border-white/10 hover:border-gold-400/40 text-pearl hover:bg-abyss-800'
                        }`}
                      >
                        <Clock className={`w-5 h-5 mb-1.5 sm:mb-2 ${isSelected ? 'text-gold-400' : 'text-coral-400'}`} />
                        <h4 className="text-sm sm:text-base font-black text-pearl mb-1">{d.time}</h4>
                        <p className="text-xs text-pearl-muted font-medium">{d.desc}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Step 3: Vibe */}
              {wizardStep === 3 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-3.5">
                  {[
                    { id: 'food', label: 'أكل ومطاعم 🍔', desc: 'تذوق أشهى الأطباق والمطاعم الفاخرة' },
                    { id: 'coffee_dessert', label: 'قهوة وحلى ☕', desc: 'محامص مختصة ومخابز حرفية' },
                    { id: 'beach_sunset', label: 'بحر وغروب 🌊', desc: 'شواطئ وكورنيش ويخوت البحر الأحمر' },
                    { id: 'gaming_challenges', label: 'تحديات وألعاب 🎯', desc: 'تزلج، بولينج، بادل وكارتينج' },
                    { id: 'heritage_arts', label: 'تراث وفنون 🏛️', desc: 'رواشين البلد وتيم لاب والمتاحف' },
                    { id: 'surprise_me', label: 'فاجئني بأحلى مكس 🎁', desc: 'تشكيلة متوازنة وشاملة من الخيارات' },
                  ].map((v) => {
                    const isSelected = wizardPreferences.vibe === v.id;
                    return (
                      <div
                        key={v.id}
                        onClick={() => {
                          soundEngine.playClick();
                          updateWizardPreferences({ vibe: v.id as any });
                        }}
                        className={`min-h-[44px] p-3.5 sm:p-4 rounded-2xl border text-start cursor-pointer transition-all duration-200 touch-manipulation active:scale-[0.97] ${
                          isSelected
                            ? 'bg-abyss-700 border-gold-400 ring-2 ring-gold-400/50 text-gold-300 font-black shadow-glow-gold scale-[1.01]'
                            : 'bg-abyss-950/80 border-white/10 hover:border-gold-400/40 text-pearl hover:bg-abyss-800'
                        }`}
                      >
                        <h4 className="text-xs sm:text-sm font-black text-pearl mb-1">{v.label}</h4>
                        <p className="text-[11px] sm:text-xs text-pearl-muted font-medium leading-relaxed">{v.desc}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Step 4: Ambience */}
              {wizardStep === 4 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5">
                  {[
                    { id: 'ac_indoor', label: 'مكيف وبارد ❄️', desc: 'صالات ومطاعم مكيفة بالكامل لتفادي الحرارة' },
                    { id: 'open_air_beach', label: 'هواء طلق وبحر 🌴', desc: 'جلسات خارجية وتراسات وإطلالات بحرية مفتوحة' },
                    { id: 'mixed', label: 'مكس متوازن 🔄', desc: 'بداية مكيفة وختام بالهواء الطلق وقت اعتدال الجو' },
                  ].map((a) => {
                    const isSelected = wizardPreferences.ambience === a.id;
                    return (
                      <div
                        key={a.id}
                        onClick={() => {
                          soundEngine.playClick();
                          updateWizardPreferences({ ambience: a.id as any });
                        }}
                        className={`min-h-[44px] p-4 sm:p-5 rounded-2xl border text-start cursor-pointer transition-all duration-200 touch-manipulation active:scale-[0.97] ${
                          isSelected
                            ? 'bg-abyss-700 border-gold-400 ring-2 ring-gold-400/50 text-gold-300 font-black shadow-glow-gold scale-[1.01]'
                            : 'bg-abyss-950/80 border-white/10 hover:border-gold-400/40 text-pearl hover:bg-abyss-800'
                        }`}
                      >
                        <Wind className={`w-5 h-5 mb-1.5 sm:mb-2 ${isSelected ? 'text-gold-400' : 'text-teal-400'}`} />
                        <h4 className="text-sm sm:text-base font-black text-pearl mb-1">{a.label}</h4>
                        <p className="text-xs text-pearl-muted font-medium leading-relaxed">{a.desc}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Step 5: Budget */}
              {wizardStep === 5 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
                  {[
                    { id: 'economy', label: 'على قد الجيب (≤60 ر.س)', desc: 'أماكن مجانية ومطاعم شعبية لذيذة' },
                    { id: 'moderate', label: 'موزونة (~150 ر.س)', desc: 'مقاهي مختصة ووجبة عشاء مميزة' },
                    { id: 'premium', label: 'دلع ومميز (~350 ر.س)', desc: 'مطاعم راقية وفعاليات ومقاهي فخمة' },
                    { id: 'luxury', label: 'VIP فخم (+600 ر.س)', desc: 'نادي اليخوت والمارينا وأرقى الموائد' },
                  ].map((b) => {
                    const isSelected = wizardPreferences.budgetTier === b.id;
                    return (
                      <div
                        key={b.id}
                        onClick={() => {
                          soundEngine.playClick();
                          updateWizardPreferences({ budgetTier: b.id as any });
                        }}
                        className={`min-h-[44px] p-3.5 sm:p-4 rounded-2xl border text-start cursor-pointer transition-all duration-200 touch-manipulation active:scale-[0.97] ${
                          isSelected
                            ? 'bg-abyss-700 border-gold-400 ring-2 ring-gold-400/50 text-gold-300 font-black shadow-glow-gold scale-[1.01]'
                            : 'bg-abyss-950/80 border-white/10 hover:border-gold-400/40 text-pearl hover:bg-abyss-800'
                        }`}
                      >
                        <Coins className={`w-5 h-5 mb-1.5 sm:mb-2 ${isSelected ? 'text-gold-400' : 'text-gold-400'}`} />
                        <h4 className="text-xs sm:text-sm font-black text-pearl mb-1">{b.label}</h4>
                        <p className="text-[11px] sm:text-xs text-pearl-muted font-medium">{b.desc}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Step 6: Preferences */}
              {wizardStep === 6 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5">
                  {[
                    { id: 'no_traffic', label: 'بدون زحمة 🤫', desc: 'مسارات وتوقيتات هادئة' },
                    { id: 'easy_parking', label: 'مواقف سهلة 🅿️', desc: 'مواقف واسعة ومتوفرة' },
                    { id: 'short_drive', label: 'مشاوير قريبة 🚗', desc: 'أماكن متقاربة جغرافياً' },
                    { id: 'no_booking', label: 'بدون حجز مسبق 🎟️', desc: 'دخول مباشر وسهل' },
                  ].map((p) => {
                    const isChecked = (wizardPreferences.preferences || []).includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          soundEngine.playClick();
                          const current = wizardPreferences.preferences || [];
                          const next = isChecked ? current.filter((x) => x !== p.id) : [...current, p.id];
                          updateWizardPreferences({ preferences: next });
                        }}
                        className={`min-h-[44px] p-4 sm:p-5 rounded-2xl border text-start cursor-pointer transition-all duration-200 touch-manipulation active:scale-[0.97] ${
                          isChecked
                            ? 'bg-abyss-700 border-gold-400 ring-2 ring-gold-400/50 text-gold-300 font-black shadow-glow-gold scale-[1.01]'
                            : 'bg-abyss-950/80 border-white/10 hover:border-gold-400/40 text-pearl hover:bg-abyss-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                          <h4 className="text-xs sm:text-sm font-black text-pearl">{p.label}</h4>
                          {isChecked && <Check className="w-4 h-4 text-gold-400" />}
                        </div>
                        <p className="text-[11px] sm:text-xs text-pearl-muted font-medium">{p.desc}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Wizard Footer Controls: Sticky on mobile above MobileTabBar */}
        <div className="mt-8 pt-4 sm:pt-6 border-t border-white/10 flex items-center justify-between gap-3 sm:gap-4 max-sm:fixed max-sm:bottom-16 max-sm:inset-x-0 max-sm:p-3 max-sm:bg-abyss-950/95 max-sm:backdrop-blur-2xl max-sm:border-t max-sm:border-white/15 max-sm:z-30">
          <button
            type="button"
            onClick={handleBack}
            disabled={wizardStep === 0}
            className="min-h-[44px] px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl bg-abyss-800 hover:bg-abyss-700 text-pearl font-bold text-xs sm:text-sm border border-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer touch-manipulation active:scale-95"
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{language === 'ar' ? 'السابق' : 'Back'}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={isGeneratingPlan}
            className="min-h-[50px] px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-2xl bg-coral-500 hover:bg-coral-600 active:bg-coral-700 text-white font-black text-xs sm:text-sm shadow-glow-coral transition-all flex items-center gap-2 cursor-pointer touch-manipulation active:scale-95"
          >
            {wizardStep === 6 ? (
              <>
                <span>{language === 'ar' ? '🚀 توليد 3 خطط ذكية' : '🚀 Generate 3 Plans'}</span>
                <Sparkles className="w-4 h-4 text-gold-300" />
              </>
            ) : (
              <>
                <span>{language === 'ar' ? 'التالي' : 'Next'}</span>
                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
