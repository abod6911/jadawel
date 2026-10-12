'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Users,
  Clock,
  Coins,
  Sparkles,
  Waves,
  Coffee,
  Landmark,
  Footprints,
  Heart,
  Smile,
  Compass,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Check,
  UtensilsCrossed,
  SlidersHorizontal,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { soundEngine } from '@/utils/audioEngine';
import { RawashinPattern } from '@/components/ui/RawashinPattern';
import {
  DistrictId,
  CompanionType,
  DurationOption,
  VibeType,
  BudgetTier,
} from '@/types';

// ==========================================
// 1. FOUR CURATED HIGH-IMPACT WIZARD STEPS (1/4)
// ==========================================

interface WizardStepMeta {
  stepNumber: number;
  icon: React.ElementType;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
}

const WIZARD_STEPS: WizardStepMeta[] = [
  {
    stepNumber: 1,
    icon: MapPin,
    titleAr: 'من وين تبدأ طلعتك؟',
    titleEn: 'Where do you want to start?',
    subtitleAr: 'اختر نقطة الانطلاق في جدة لترتيب مسار جغرافي متصل بدون زحمة.',
    subtitleEn: 'Choose your starting point in Jeddah for a direct traffic-optimized route.',
  },
  {
    stepNumber: 2,
    icon: Users,
    titleAr: 'مين معاك في الطلعة؟',
    titleEn: 'Who is joining your outing?',
    subtitleAr: 'نخصص الجلسات والأماكن لتناسب ديناميكية وراحة مجموعتكم.',
    subtitleEn: 'We tailor seating and venues to match your group dynamic.',
  },
  {
    stepNumber: 3,
    icon: Sparkles,
    titleAr: 'وش جو ومود الطلعة؟',
    titleEn: 'What is the vibe for today?',
    subtitleAr: 'اختر التجربة الأساسية اللي ودك تعيشها اليوم في عروس البحر.',
    subtitleEn: 'Select the primary atmosphere and experience you seek in Jeddah.',
  },
  {
    stepNumber: 4,
    icon: Coins,
    titleAr: 'الميزانية والمدة المتاحة',
    titleEn: 'Budget & Available Duration',
    subtitleAr: 'كل هللة محسوبة بدقة (من الأكل للمشاوير) مع ضبط وتيرة المحطات.',
    subtitleEn: 'Itemized calculations with accurate pacing for stops and transit.',
  },
];

// District Options (Unified Lucide Icons — No Emojis)
const DISTRICT_OPTIONS = [
  { id: 'all_jeddah' as const, nameAr: 'كل جدة (الأفضل)', nameEn: 'All Jeddah (Best)', descAr: 'أذكى مسار متوازن عبر أبرز معالم عروس البحر', descEn: 'Top curated highlights across Jeddah', icon: Compass },
  { id: 'obhur' as const, nameAr: 'أبحر والواجهة البحرية', nameEn: 'Obhur & Marina', descAr: 'نوادي شاطئية، مارينا اليخوت، ونسيم الغروب', descEn: 'Beach clubs, creek yachts & sunset breeze', icon: Waves },
  { id: 'al-balad' as const, nameAr: 'البلد التاريخية', nameEn: 'Historic Al-Balad', descAr: 'أزقة التراث العتيق، بيوت الرواشين، والمتاحف', descEn: 'UNESCO alleys, heritage roshan houses', icon: Landmark },
  { id: 'al-shati' as const, nameAr: 'حي الشاطئ والكورنيش', nameEn: 'Al-Shati & Corniche', descAr: 'الواجهة البحرية، الممشى الحديث، والمطاعم', descEn: 'Coastal promenade, waterfront dining', icon: Footprints },
  { id: 'al-rawdah' as const, nameAr: 'حي الروضة', nameEn: 'Al-Rawdah District', descAr: 'عاصمة المقاهي المختصة والمطاعم الراقية', descEn: 'Specialty coffee hub & artisan dining', icon: Coffee },
  { id: 'al-hamra' as const, nameAr: 'الحمراء ونافورة جدة', nameEn: 'Al-Hamra Corniche', descAr: 'إطلالة نافورة الملك فهد وجلسات الكورنيش', descEn: 'King Fahd fountain view & seaside cafes', icon: MapPin },
];

// Companion Options (Unified Lucide Icons — No Emojis)
const COMPANION_OPTIONS = [
  { id: 'friends' as const, labelAr: 'مع الأصحاب', labelEn: 'With Friends', descAr: 'حماس وفعاليات وأماكن حيوية للشلة', descEn: 'High-energy group spots & activities', icon: Users },
  { id: 'couples' as const, labelAr: 'كابلز واحتفال', labelEn: 'Couples / Celebration', descAr: 'جلسة رومانسية هادئة وإطلالة مميزة', descEn: 'Intimate scenic dining & sunset views', icon: Heart },
  { id: 'family' as const, labelAr: 'جمعة عائلية', labelEn: 'Family Gathering', descAr: 'جلسات رحبة ومريحة تناسب كافة الأعمار', descEn: 'Spacious, relaxed seating for all ages', icon: Smile },
  { id: 'solo' as const, labelAr: 'لحالي بروقان', labelEn: 'Solo Chill', descAr: 'عزلة إيجابية، قهوة، وقراءة واستجمام', descEn: 'Quiet me-time, artisanal coffee & peace', icon: Compass },
];

// Vibe Options (Unified Lucide Icons — No Emojis)
const VIBE_OPTIONS = [
  { id: 'beach_sunset' as const, labelAr: 'بحر وغروب', labelEn: 'Beach & Sunset', descAr: 'شواطئ ونسمة عليلة وإطلالات بحرية', descEn: 'Waterfront views & beach relaxation', icon: Waves },
  { id: 'coffee_dessert' as const, labelAr: 'قهوة وروقان', labelEn: 'Coffee & Dessert', descAr: 'محامص مختصة وجلسات هادئة رايقة', descEn: 'Specialty roasters & curated desserts', icon: Coffee },
  { id: 'food' as const, labelAr: 'عشاء وتجارب تذوق', labelEn: 'Culinary Dining', descAr: 'تجارب طعام استثنائية ومأكولات بحرية', descEn: 'Fine dining & Red Sea seafood gems', icon: UtensilsCrossed },
  { id: 'heritage_arts' as const, labelAr: 'تراث وفنون وثقافة', labelEn: 'Heritage & Culture', descAr: 'أزقة البلد التاريخية والمتاحف والمعارض', descEn: 'Historic alleys, museums & art galleries', icon: Landmark },
  { id: 'free_walk' as const, labelAr: 'ممشى وطبيعة مجانية', labelEn: 'Free Scenic Walk', descAr: '0 ر.س — ممشى الكورنيش والحدائق العامة', descEn: '0 SAR — Scenic promenade & sea views', icon: Footprints },
  { id: 'luxury_vip' as const, labelAr: 'سهرة فاخرة VIP', labelEn: 'Luxury VIP Night', descAr: 'أرقى مطاعم ونوادي اليخوت بإطلالة ساحرة', descEn: 'Exclusive yacht lounges & premier dining', icon: Sparkles },
];

// Budget Options (Unified Lucide Icons — No Emojis)
const BUDGET_OPTIONS = [
  { id: 'free' as const, labelAr: 'مجانية 100%', labelEn: '100% Free', priceAr: '0 ر.س (ممشى ومعالم عامة)', priceEn: '0 SAR free promenade', icon: Footprints },
  { id: 'economy' as const, labelAr: 'اقتصادية', labelEn: 'Economy', priceAr: '≤ 60 ر.س للشخص', priceEn: '≤ 60 SAR per person', icon: Coins },
  { id: 'moderate' as const, labelAr: 'متوسطة وموزونة', labelEn: 'Moderate Value', priceAr: '~ 150 ر.س للشخص', priceEn: '~ 150 SAR per person', icon: SlidersHorizontal },
  { id: 'premium' as const, labelAr: 'فاخرة VIP', labelEn: 'Luxury VIP', priceAr: '+ 350 ر.س للشخص', priceEn: '+ 350 SAR luxury tier', icon: Sparkles },
];

// Duration Options (Unified Lucide Icons — No Emojis)
const DURATION_OPTIONS = [
  { id: 'under_2h' as const, labelAr: 'أقل من ساعتين', labelEn: 'Under 2 Hours', subAr: 'محطة سريعة وقهوة على الماشي', subEn: 'Quick coffee & chill', icon: Clock },
  { id: '2_to_4h' as const, labelAr: '2 إلى 4 ساعات', labelEn: '2 to 4 Hours', subAr: 'روقان ومطعم أو جلسة بحرية', subEn: 'Balanced dining & seaside', icon: Clock },
  { id: '4_to_6h' as const, labelAr: '4 إلى 6 ساعات', labelEn: '4 to 6 Hours', subAr: 'طلعة متكاملة مع وقت الغروب', subEn: 'Complete evening with sunset', icon: Clock },
  { id: 'half_day_night' as const, labelAr: 'سهرة مسائية', labelEn: 'Night Out', subAr: 'من المغرب حتى منتصف الليل', subEn: 'From sunset to late midnight', icon: Clock },
];

export const QuickPlanWizard: React.FC = () => {
  const { language, isRTL } = useLanguage();

  const wizardPreferences = useItineraryStore((state) => state.wizardPreferences);
  const updateWizardPreferences = useItineraryStore((state) => state.updateWizardPreferences);
  const generatePlanFromPreferences = useItineraryStore((state) => state.generatePlanFromPreferences);
  const storeStep = useItineraryStore((state) => state.wizardStep);
  const setStoreStep = useItineraryStore((state) => state.setWizardStep);

  const [currentStep, setCurrentStep] = useState<number>(() => {
    // Clamp to 1..4
    if (storeStep && storeStep >= 1 && storeStep <= 4) return storeStep;
    return 1;
  });
  const [direction, setDirection] = useState(1);

  // Cinematic Generation Animation State
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisStageIndex, setSynthesisStageIndex] = useState(0);

  const SYNTHESIS_STAGES = [
    { ar: 'جاري استكشاف أفضل محطات جدة المطابقة لاختياراتكم...', en: 'Scanning top Jeddah venues matching your vibe...' },
    { ar: 'نحسب أوقات التنقل وتجنب مناطق الزحام بالدقيقة...', en: 'Optimizing driving routes to bypass traffic...' },
    { ar: 'نوزّع الميزانية ونربط المحطات في 3 مسارات سينمائية...', en: 'Balancing budget and connecting 3 curated itineraries...' },
  ];

  // Sync external step requests
  useEffect(() => {
    if (storeStep && storeStep >= 1 && storeStep <= 4 && storeStep !== currentStep) {
      setCurrentStep(storeStep);
    }
  }, [storeStep]);

  const goToStep = (stepNum: number) => {
    soundEngine.playClick();
    setDirection(stepNum > currentStep ? 1 : -1);
    setCurrentStep(stepNum);
    setStoreStep(stepNum);
  };

  const nextStep = () => {
    soundEngine.playClick();
    if (currentStep < 4) {
      setDirection(1);
      const next = currentStep + 1;
      setCurrentStep(next);
      setStoreStep(next);
    } else {
      triggerCinematicGeneration();
    }
  };

  const prevStep = () => {
    soundEngine.playClick();
    if (currentStep > 1) {
      setDirection(-1);
      const prev = currentStep - 1;
      setCurrentStep(prev);
      setStoreStep(prev);
    }
  };

  // Cinematic 2.4-second Generation Flow
  const triggerCinematicGeneration = () => {
    soundEngine.playSuccess();
    setIsSynthesizing(true);
    setSynthesisStageIndex(0);

    const stage1 = setTimeout(() => setSynthesisStageIndex(1), 800);
    const stage2 = setTimeout(() => setSynthesisStageIndex(2), 1600);
    const stageFinal = setTimeout(() => {
      setIsSynthesizing(false);
      generatePlanFromPreferences();
    }, 2400);

    return () => {
      clearTimeout(stage1);
      clearTimeout(stage2);
      clearTimeout(stageFinal);
    };
  };

  const currentStepMeta = WIZARD_STEPS[currentStep - 1];

  // Slide Animation Variants
  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 35 : -35, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -35 : 35, opacity: 0 }),
  };

  // Live Summary Labels
  const activeDistrictName = DISTRICT_OPTIONS.find((d) => d.id === wizardPreferences.startingDistrict)?.nameAr || 'كل جدة';
  const activeCompanionLabel = COMPANION_OPTIONS.find((c) => c.id === wizardPreferences.companions)?.labelAr || 'مع الأصحاب';
  const activeVibeLabel = VIBE_OPTIONS.find((v) => v.id === (wizardPreferences.vibe as any))?.labelAr || 'بحر وغروب';
  const activeBudgetLabel = BUDGET_OPTIONS.find((b) => b.id === (wizardPreferences.budgetTier === 'luxury' ? 'premium' : wizardPreferences.budgetTier))?.labelAr || 'متوسطة وموزونة';

  return (
    <div className="w-full max-w-4xl mx-auto my-2 sm:my-6 select-none relative">
      {/* CINEMATIC SYNTHESIZING MODAL OVERLAY */}
      <AnimatePresence>
        {isSynthesizing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080B11]/92 backdrop-blur-xl"
          >
            <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl card-surface border border-[var(--border-gold)] text-center space-y-6 shadow-2xl relative overflow-hidden">
              <RawashinPattern className="text-[var(--accent-gold)]" opacity={0.04} />

              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[var(--accent-gold)]/20 animate-ping" />
                <div className="w-16 h-16 rounded-full border-2 border-[var(--accent-gold)] border-t-transparent animate-spin flex items-center justify-center shadow-lg">
                  <Sparkles className="w-7 h-7 text-[var(--accent-gold)]" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {language === 'ar' ? 'نرتّب لك الطلعة على أصولها..' : 'Crafting Your Tailored Outing..'}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--accent-gold)] font-medium transition-all duration-300 min-h-[40px] flex items-center justify-center">
                  {language === 'ar' ? SYNTHESIS_STAGES[synthesisStageIndex].ar : SYNTHESIS_STAGES[synthesisStageIndex].en}
                </p>
              </div>

              {/* Progress Track */}
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] rounded-full"
                  initial={{ width: '15%' }}
                  animate={{ width: `${(synthesisStageIndex + 1) * 33}%` }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN WIZARD SHELL (Zero Heavy Backdrop Blur for Mobile Performance) */}
      <div className="card-surface p-4 sm:p-8 md:p-10 relative overflow-hidden flex flex-col justify-between min-h-[520px] sm:min-h-[580px]">
        {/* Subtle Rawasheen Accent in Background */}
        <RawashinPattern className="text-[var(--accent-gold)]" opacity={0.03} />

        {/* 1. HEADER & 4-STEP CLEAR PROGRESS INDICATOR (1/4) */}
        <div className="space-y-3 pb-5 border-b border-[var(--border-subtle)] relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-gold)] animate-pulse" />
              <span className="text-xs sm:text-sm font-black text-[var(--text-gold)]">
                {language === 'ar' ? `الخطوة ${currentStep} من 4` : `Step ${currentStep} of 4`}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">
              {Math.round((currentStep / 4) * 100)}%
            </span>
          </div>

          {/* 4-Segment Progress Bar */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((stepIdx) => {
              const isFilled = stepIdx <= currentStep;
              const isCurrent = stepIdx === currentStep;

              return (
                <div
                  key={stepIdx}
                  onClick={() => goToStep(stepIdx)}
                  className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                    isFilled
                      ? 'bg-gradient-to-r from-[#DF9F3D] to-[#E5C378] shadow-[0_0_8px_rgba(229,195,120,0.4)]'
                      : 'bg-white/10 hover:bg-white/20'
                  } ${isCurrent ? 'ring-2 ring-[var(--accent-gold)]/40' : ''}`}
                  title={`Step ${stepIdx}`}
                />
              );
            })}
          </div>

          {/* Step Meta Headline & Description */}
          <div className="text-center pt-2 sm:pt-4 space-y-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              {language === 'ar' ? currentStepMeta.titleAr : currentStepMeta.titleEn}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto font-normal leading-relaxed">
              {language === 'ar' ? currentStepMeta.subtitleAr : currentStepMeta.subtitleEn}
            </p>
          </div>
        </div>

        {/* 2. DYNAMIC CONTENT SLIDE FOR THE ACTIVE STEP */}
        <div className="py-6 sm:py-8 flex-1 relative z-10">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* STEP 1: STARTING DISTRICT */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                  {DISTRICT_OPTIONS.map((item) => {
                    const isSelected = wizardPreferences.startingDistrict === item.id;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          updateWizardPreferences({ startingDistrict: item.id });
                        }}
                        className={`text-start p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-1.5 sm:gap-2 touch-manipulation active:scale-[0.98] ${
                          isSelected
                            ? 'bg-[var(--accent-gold-soft)] border-[var(--border-gold-active)] ring-2 ring-[var(--accent-gold)]/30 shadow-[0_0_18px_rgba(229,195,120,0.25)]'
                            : 'bg-[var(--bg-surface-card)] border-[var(--border-subtle)] hover:border-[var(--border-gold)] hover:bg-[var(--bg-surface-elevated)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-[var(--accent-gold)]' : 'text-slate-400'}`} />
                            <span className="text-xs sm:text-sm font-bold text-white">
                              {language === 'ar' ? item.nameAr : item.nameEn}
                            </span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />}
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 font-normal leading-relaxed line-clamp-1 sm:line-clamp-none">
                          {language === 'ar' ? item.descAr : item.descEn}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* STEP 2: COMPANIONS */}
              {currentStep === 2 && (
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 sm:gap-3.5 max-w-2xl mx-auto">
                  {COMPANION_OPTIONS.map((item) => {
                    const isSelected = wizardPreferences.companions === item.id;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          updateWizardPreferences({ companions: item.id });
                        }}
                        className={`text-start p-3 sm:p-5 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-1.5 sm:gap-2.5 touch-manipulation active:scale-[0.98] ${
                          isSelected
                            ? 'bg-[var(--accent-gold-soft)] border-[var(--border-gold-active)] ring-2 ring-[var(--accent-gold)]/30 shadow-[0_0_18px_rgba(229,195,120,0.25)]'
                            : 'bg-[var(--bg-surface-card)] border-[var(--border-subtle)] hover:border-[var(--border-gold)] hover:bg-[var(--bg-surface-elevated)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${isSelected ? 'bg-[var(--accent-gold)] text-[#090C12]' : 'bg-white/5 text-slate-300'}`}>
                              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <span className="text-xs sm:text-base font-bold text-white">
                              {language === 'ar' ? item.labelAr : item.labelEn}
                            </span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent-gold)] shrink-0" />}
                        </div>
                        <p className="text-[10px] sm:text-xs text-slate-400 font-normal leading-relaxed line-clamp-1 sm:line-clamp-none">
                          {language === 'ar' ? item.descAr : item.descEn}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* STEP 3: VIBE & MOOD */}
              {currentStep === 3 && (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                  {VIBE_OPTIONS.map((item) => {
                    const isSelected = (wizardPreferences.vibe as any) === item.id;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          updateWizardPreferences({ vibe: item.id as any });
                        }}
                        className={`text-start p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-1.5 sm:gap-2 touch-manipulation active:scale-[0.98] ${
                          isSelected
                            ? 'bg-[var(--accent-gold-soft)] border-[var(--border-gold-active)] ring-2 ring-[var(--accent-gold)]/30 shadow-[0_0_18px_rgba(229,195,120,0.25)]'
                            : 'bg-[var(--bg-surface-card)] border-[var(--border-subtle)] hover:border-[var(--border-gold)] hover:bg-[var(--bg-surface-elevated)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-[var(--accent-gold)]' : 'text-slate-400'}`} />
                            <span className="text-xs sm:text-sm font-bold text-white">
                              {language === 'ar' ? item.labelAr : item.labelEn}
                            </span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />}
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 font-normal leading-relaxed line-clamp-1 sm:line-clamp-none">
                          {language === 'ar' ? item.descAr : item.descEn}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* STEP 4: BUDGET & DURATION COMBINED */}
              {currentStep === 4 && (
                <div className="space-y-5 sm:space-y-6">
                  {/* Budget Rail */}
                  <div className="space-y-2 sm:space-y-2.5">
                    <span className="text-xs font-bold text-[var(--accent-gold)] flex items-center gap-1.5 px-1">
                      <Coins className="w-4 h-4" />
                      <span>{language === 'ar' ? 'الميزانية التقديرية للشخص:' : 'Budget Tier per Person:'}</span>
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                      {BUDGET_OPTIONS.map((item) => {
                        const isSelected = wizardPreferences.budgetTier === (item.id === 'premium' ? 'luxury' : item.id);
                        const Icon = item.icon;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              soundEngine.playClick();
                              updateWizardPreferences({ budgetTier: item.id === 'premium' ? ('luxury' as any) : item.id });
                            }}
                            className={`text-start p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-1 touch-manipulation active:scale-[0.98] ${
                              isSelected
                                ? 'bg-[var(--accent-gold-soft)] border-[var(--border-gold-active)] ring-2 ring-[var(--accent-gold)]/30 shadow-[0_0_15px_rgba(229,195,120,0.25)]'
                                : 'bg-[var(--bg-surface-card)] border-[var(--border-subtle)] hover:border-[var(--border-gold)] hover:bg-[var(--bg-surface-elevated)]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs sm:text-sm font-bold text-white">
                                {language === 'ar' ? item.labelAr : item.labelEn}
                              </span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-[var(--accent-gold)] shrink-0" />}
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {language === 'ar' ? item.priceAr : item.priceEn}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Duration Rail */}
                  <div className="space-y-2 sm:space-y-2.5 pt-2 border-t border-[var(--border-subtle)]">
                    <span className="text-xs font-bold text-[var(--accent-gold)] flex items-center gap-1.5 px-1">
                      <Clock className="w-4 h-4" />
                      <span>{language === 'ar' ? 'المدة المتاحة للطلعة:' : 'Available Outing Duration:'}</span>
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                      {DURATION_OPTIONS.map((item) => {
                        const isSelected = wizardPreferences.duration === item.id;
                        const Icon = item.icon;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              soundEngine.playClick();
                              updateWizardPreferences({ duration: item.id });
                            }}
                            className={`text-start p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-1 touch-manipulation active:scale-[0.98] ${
                              isSelected
                                ? 'bg-[var(--accent-gold-soft)] border-[var(--border-gold-active)] ring-2 ring-[var(--accent-gold)]/30 shadow-[0_0_15px_rgba(229,195,120,0.25)]'
                                : 'bg-[var(--bg-surface-card)] border-[var(--border-subtle)] hover:border-[var(--border-gold)] hover:bg-[var(--bg-surface-elevated)]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs sm:text-sm font-bold text-white">
                                {language === 'ar' ? item.labelAr : item.labelEn}
                              </span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-[var(--accent-gold)] shrink-0" />}
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {language === 'ar' ? item.subAr : item.subEn}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3. DESKTOP / INLINE CONTROLS BAR */}
        <div className="pt-5 border-t border-[var(--border-subtle)] hidden md:flex items-center justify-between gap-3 relative z-10">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`min-h-[46px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              currentStep === 1
                ? 'opacity-25 cursor-not-allowed text-slate-600'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{language === 'ar' ? 'السابق' : 'Back'}</span>
          </button>

          {/* Desktop Summary Pill */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span className="text-[var(--accent-gold)] font-bold">{activeDistrictName}</span>
            <span>•</span>
            <span>{activeCompanionLabel}</span>
            <span>•</span>
            <span>{activeVibeLabel}</span>
            <span>•</span>
            <span className="text-slate-300 font-bold">{activeBudgetLabel}</span>
          </div>

          <button
            type="button"
            onClick={nextStep}
            className="min-h-[46px] px-7 py-3 rounded-xl bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] text-[#080B11] text-xs sm:text-sm font-black flex items-center gap-2 shadow-[0_0_20px_rgba(229,195,120,0.4)] hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>
              {currentStep === 4
                ? language === 'ar'
                  ? 'ابتكر خطتي الآن ✨'
                  : 'Generate My Plan ✨'
                : language === 'ar'
                ? 'التالي'
                : 'Next'}
            </span>
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickPlanWizard;
