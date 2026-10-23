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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06090F]/95 backdrop-blur-2xl"
          >
            <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-[#0B111E]/90 border border-[#D4AF37]/40 text-center space-y-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative overflow-hidden">
              <RawashinPattern className="text-[#D4AF37]" opacity={0.06} />

              {/* Ultra-Luxury Golden Compass & Radar Radar Animation */}
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                {/* Outer Glow Ring */}
                <div className="absolute inset-0 rounded-full border border-[#D4AF37]/20 shadow-[0_0_30px_rgba(212,175,55,0.2)]" />
                
                {/* Secondary Concentric Dashed Ring */}
                <div className="absolute inset-3 rounded-full border border-dashed border-[#D4AF37]/30 animate-[spin_20s_linear_infinite]" />

                {/* Inner Ring */}
                <div className="absolute inset-7 rounded-full border border-[#D4AF37]/40" />

                {/* Radar Sweeping Beam */}
                <div
                  className="absolute inset-0 rounded-full animate-radar-sweep pointer-events-none"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(212, 175, 55, 0.08) 320deg, rgba(212, 175, 55, 0.45) 360deg)',
                  }}
                />

                {/* Pulsing Concentric Waves */}
                <div className="absolute inset-8 rounded-full bg-[#D4AF37]/15 animate-ping" />

                {/* Center Glowing Compass Rose */}
                <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-br from-[#F5D07A] via-[#D4AF37] to-[#AA7C11] p-[2px] shadow-[0_0_25px_rgba(212,175,55,0.6)] flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#06090F] flex items-center justify-center">
                    <Compass className="w-7 h-7 text-[#F5D07A] animate-[spin_12s_linear_infinite]" />
                  </div>
                </div>

                {/* Cardinal Tick Points */}
                <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-[#F5D07A]/70">N</span>
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-[#F5D07A]/70">S</span>
                <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-[#F5D07A]/70">E</span>
                <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-[#F5D07A]/70">W</span>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F5D07A] text-[11px] font-bold">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>{language === 'ar' ? 'ذكاء جداول الحجازي' : 'Jadawel AI Synthesis'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {language === 'ar' ? 'نرتّب لك الطلعة على أصولها..' : 'Crafting Your Tailored Outing..'}
                </h3>
                <p className="text-xs sm:text-sm text-[#F5D07A] font-medium transition-all duration-300 min-h-[44px] flex items-center justify-center max-w-sm mx-auto">
                  {language === 'ar' ? SYNTHESIS_STAGES[synthesisStageIndex].ar : SYNTHESIS_STAGES[synthesisStageIndex].en}
                </p>
              </div>

              {/* Progress Track */}
              <div className="space-y-1.5">
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#F5D07A] via-[#D4AF37] to-[#AA7C11] rounded-full shadow-[0_0_12px_rgba(212,175,55,0.7)]"
                    initial={{ width: '20%' }}
                    animate={{ width: `${(synthesisStageIndex + 1) * 33.3}%` }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>{language === 'ar' ? 'استكشاف الأماكن' : 'Venue Search'}</span>
                  <span className="text-[#F5D07A] font-bold">{Math.round(((synthesisStageIndex + 1) / 3) * 100)}%</span>
                  <span>{language === 'ar' ? 'اعتماد المسار' : 'Route Lock'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN WIZARD SHELL */}
      <div className="card-surface p-4 sm:p-8 md:p-10 relative overflow-hidden flex flex-col justify-between min-h-[540px] sm:min-h-[600px] border border-white/[0.08] rounded-3xl bg-[#0B111E]/75 backdrop-blur-xl shadow-2xl">
        {/* Subtle Rawasheen Accent in Background */}
        <RawashinPattern className="text-[#D4AF37]" opacity={0.03} />

        {/* 1. HEADER & 4-STEP ILLUMINATED PROGRESS TRACK */}
        <div className="space-y-5 pb-6 border-b border-white/[0.08] relative z-10">
          {/* Interactive Stepper Track */}
          <div className="relative px-2 sm:px-6">
            {/* Connecting Track Line */}
            <div className="absolute top-4 sm:top-5 inset-x-8 sm:inset-x-12 h-1 bg-white/10 -z-0 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#F5D07A] via-[#D4AF37] to-[#AA7C11] shadow-[0_0_10px_#D4AF37]"
                initial={false}
                animate={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            {/* Stepper Nodes */}
            <div className="flex items-center justify-between relative z-10">
              {WIZARD_STEPS.map((stepMeta) => {
                const stepIdx = stepMeta.stepNumber;
                const isCompleted = stepIdx < currentStep;
                const isCurrent = stepIdx === currentStep;
                const StepIcon = stepMeta.icon;

                return (
                  <button
                    key={stepIdx}
                    type="button"
                    onClick={() => goToStep(stepIdx)}
                    className="flex flex-col items-center gap-1.5 cursor-pointer group focus:outline-none"
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 relative ${
                        isCompleted
                          ? 'bg-gradient-to-br from-[#F5D07A] via-[#D4AF37] to-[#AA7C11] text-[#06090F] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                          : isCurrent
                          ? 'bg-[#06090F] border-2 border-[#F5D07A] text-[#F5D07A] shadow-[0_0_20px_rgba(212,175,55,0.6)] ring-4 ring-[#D4AF37]/20 scale-110'
                          : 'bg-[#101726] border border-white/15 text-slate-400 group-hover:border-white/30 group-hover:text-slate-200'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <StepIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isCurrent ? 'text-[#F5D07A]' : 'text-slate-400'}`} />
                      )}

                      {/* Active Node Pulse Ring */}
                      {isCurrent && (
                        <span className="absolute -inset-1 rounded-full border border-[#F5D07A]/60 animate-ping opacity-60 pointer-events-none" />
                      )}
                    </div>

                    <span
                      className={`text-[10px] sm:text-xs font-bold transition-colors hidden xs:block ${
                        isCurrent
                          ? 'text-[#F5D07A]'
                          : isCompleted
                          ? 'text-slate-300'
                          : 'text-slate-500 group-hover:text-slate-400'
                      }`}
                    >
                      {language === 'ar'
                        ? stepIdx === 1 ? 'الانطلاق' : stepIdx === 2 ? 'الرفقة' : stepIdx === 3 ? 'الجو' : 'الميزانية'
                        : stepIdx === 1 ? 'Start' : stepIdx === 2 ? 'Group' : stepIdx === 3 ? 'Vibe' : 'Budget'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step Meta Headline & Description */}
          <div className="text-center pt-1 sm:pt-2 space-y-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
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
                        className={`text-start p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-2 touch-manipulation relative overflow-hidden group ${
                          isSelected
                            ? 'bg-gradient-to-br from-[#D4AF37]/18 via-[#D4AF37]/08 to-transparent border-[#D4AF37] ring-1 ring-[#F5D07A]/50 shadow-[0_0_25px_rgba(212,175,55,0.30)] -translate-y-0.5'
                            : 'bg-[#101726]/60 backdrop-blur-md border-white/[0.08] hover:border-[#D4AF37]/40 hover:bg-[#101726]/85 hover:-translate-y-0.5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-xl transition-colors ${isSelected ? 'bg-[#D4AF37] text-[#06090F]' : 'bg-white/5 text-slate-300 group-hover:text-[#F5D07A]'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-white">
                              {language === 'ar' ? item.nameAr : item.nameEn}
                            </span>
                          </div>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, rotate: -20 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                              className="w-5 h-5 rounded-full bg-gradient-to-br from-[#F5D07A] via-[#D4AF37] to-[#AA7C11] text-[#06090F] flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.6)] shrink-0"
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                            </motion.div>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-normal leading-relaxed line-clamp-1 sm:line-clamp-none">
                          {language === 'ar' ? item.descAr : item.descEn}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* STEP 2: COMPANIONS */}
              {currentStep === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
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
                        className={`text-start p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-2.5 touch-manipulation relative overflow-hidden group ${
                          isSelected
                            ? 'bg-gradient-to-br from-[#D4AF37]/18 via-[#D4AF37]/08 to-transparent border-[#D4AF37] ring-1 ring-[#F5D07A]/50 shadow-[0_0_25px_rgba(212,175,55,0.30)] -translate-y-0.5'
                            : 'bg-[#101726]/60 backdrop-blur-md border-white/[0.08] hover:border-[#D4AF37]/40 hover:bg-[#101726]/85 hover:-translate-y-0.5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl transition-colors ${isSelected ? 'bg-[#D4AF37] text-[#06090F]' : 'bg-white/5 text-slate-300 group-hover:text-[#F5D07A]'}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm sm:text-base font-bold text-white">
                              {language === 'ar' ? item.labelAr : item.labelEn}
                            </span>
                          </div>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, rotate: -20 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                              className="w-5 h-5 rounded-full bg-gradient-to-br from-[#F5D07A] via-[#D4AF37] to-[#AA7C11] text-[#06090F] flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.6)] shrink-0"
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                            </motion.div>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-normal leading-relaxed">
                          {language === 'ar' ? item.descAr : item.descEn}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* STEP 3: VIBE & MOOD */}
              {currentStep === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
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
                        className={`text-start p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-2 touch-manipulation relative overflow-hidden group ${
                          isSelected
                            ? 'bg-gradient-to-br from-[#D4AF37]/18 via-[#D4AF37]/08 to-transparent border-[#D4AF37] ring-1 ring-[#F5D07A]/50 shadow-[0_0_25px_rgba(212,175,55,0.30)] -translate-y-0.5'
                            : 'bg-[#101726]/60 backdrop-blur-md border-white/[0.08] hover:border-[#D4AF37]/40 hover:bg-[#101726]/85 hover:-translate-y-0.5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-xl transition-colors ${isSelected ? 'bg-[#D4AF37] text-[#06090F]' : 'bg-white/5 text-slate-300 group-hover:text-[#F5D07A]'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-white">
                              {language === 'ar' ? item.labelAr : item.labelEn}
                            </span>
                          </div>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, rotate: -20 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                              className="w-5 h-5 rounded-full bg-gradient-to-br from-[#F5D07A] via-[#D4AF37] to-[#AA7C11] text-[#06090F] flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.6)] shrink-0"
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                            </motion.div>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-normal leading-relaxed line-clamp-1 sm:line-clamp-none">
                          {language === 'ar' ? item.descAr : item.descEn}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* STEP 4: BUDGET & DURATION COMBINED */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  {/* Budget Rail */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-[#F5D07A] flex items-center gap-1.5 px-1">
                      <Coins className="w-4 h-4" />
                      <span>{language === 'ar' ? 'الميزانية التقديرية للشخص:' : 'Budget Tier per Person:'}</span>
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {BUDGET_OPTIONS.map((item) => {
                        const isSelected = wizardPreferences.budgetTier === (item.id === 'premium' ? 'luxury' : item.id);

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              soundEngine.playClick();
                              updateWizardPreferences({ budgetTier: item.id === 'premium' ? ('luxury' as any) : item.id });
                            }}
                            className={`text-start p-3 sm:p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-1.5 touch-manipulation relative overflow-hidden group ${
                              isSelected
                                ? 'bg-gradient-to-br from-[#D4AF37]/18 via-[#D4AF37]/08 to-transparent border-[#D4AF37] ring-1 ring-[#F5D07A]/50 shadow-[0_0_20px_rgba(212,175,55,0.25)] -translate-y-0.5'
                                : 'bg-[#101726]/60 backdrop-blur-md border-white/[0.08] hover:border-[#D4AF37]/40 hover:bg-[#101726]/85'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs sm:text-sm font-bold text-white">
                                {language === 'ar' ? item.labelAr : item.labelEn}
                              </span>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-4 h-4 rounded-full bg-[#D4AF37] text-[#06090F] flex items-center justify-center shrink-0"
                                >
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </motion.div>
                              )}
                            </div>
                            <span className="text-[11px] text-[#F5D07A]/80 font-medium">
                              {language === 'ar' ? item.priceAr : item.priceEn}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Duration Rail */}
                  <div className="space-y-3 pt-3 border-t border-white/[0.08]">
                    <span className="text-xs font-bold text-[#F5D07A] flex items-center gap-1.5 px-1">
                      <Clock className="w-4 h-4" />
                      <span>{language === 'ar' ? 'المدة المتاحة للطلعة:' : 'Available Outing Duration:'}</span>
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {DURATION_OPTIONS.map((item) => {
                        const isSelected = wizardPreferences.duration === item.id;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              soundEngine.playClick();
                              updateWizardPreferences({ duration: item.id });
                            }}
                            className={`text-start p-3 sm:p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-1.5 touch-manipulation relative overflow-hidden group ${
                              isSelected
                                ? 'bg-gradient-to-br from-[#D4AF37]/18 via-[#D4AF37]/08 to-transparent border-[#D4AF37] ring-1 ring-[#F5D07A]/50 shadow-[0_0_20px_rgba(212,175,55,0.25)] -translate-y-0.5'
                                : 'bg-[#101726]/60 backdrop-blur-md border-white/[0.08] hover:border-[#D4AF37]/40 hover:bg-[#101726]/85'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs sm:text-sm font-bold text-white">
                                {language === 'ar' ? item.labelAr : item.labelEn}
                              </span>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-4 h-4 rounded-full bg-[#D4AF37] text-[#06090F] flex items-center justify-center shrink-0"
                                >
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </motion.div>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium">
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

        {/* 3. RESPONSIVE CONTROLS BAR (Mobile & Desktop) */}
        <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between gap-3 relative z-10">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`min-h-[46px] px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              currentStep === 1
                ? 'opacity-20 cursor-not-allowed text-slate-600'
                : 'bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10'
            }`}
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{language === 'ar' ? 'السابق' : 'Back'}</span>
          </button>

          {/* Desktop Summary Pill */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 font-medium px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/5">
            <span className="text-[#F5D07A] font-bold">{activeDistrictName}</span>
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
            className="min-h-[46px] px-6 sm:px-8 py-3 rounded-2xl bg-gradient-to-r from-[#F5D07A] via-[#D4AF37] to-[#AA7C11] text-[#06090F] text-xs sm:text-sm font-black flex items-center gap-2.5 shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
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
            {isRTL ? <ArrowLeft className="w-4 h-4 stroke-[3]" /> : <ArrowRight className="w-4 h-4 stroke-[3]" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickPlanWizard;
