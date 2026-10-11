'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  MapPin,
  Users,
  Clock,
  Flame,
  DollarSign,
  SlidersHorizontal,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { soundEngine } from '@/utils/audioEngine';
import { BorderBeam } from '@/components/fancy/BorderBeam';
import {
  DistrictId,
  CompanionType,
  DurationOption,
  VibeType,
  AmbienceType,
  BudgetTier,
} from '@/types';

const STEP_DEFINITIONS = [
  {
    id: 1,
    icon: MapPin,
    titleAr: 'من وين تحب تبدأ طلعتك؟ 📍',
    titleEn: 'Where do you want to start? 📍',
    subtitleAr: 'اختر الحي الأقرب لك لترتيب مسار انسيابي متصل بدون زحام ومسافات متناغمة.',
    subtitleEn: 'Pick your preferred district for an optimized direct linear route.',
  },
  {
    id: 2,
    icon: Users,
    titleAr: 'مين معاك في الطلعة؟ 👥',
    titleEn: 'Who is joining your outing? 👥',
    subtitleAr: 'نخصص الأماكن ونوع الجلسات لتناسب طبيعة جمعتكم وديناميكية المجموعة.',
    subtitleEn: 'We tailor venues and seating to your group dynamic.',
  },
  {
    id: 3,
    icon: Clock,
    titleAr: 'كم الوقت المتاح للطلعة؟ ⏱️',
    titleEn: 'How much time do you have? ⏱️',
    subtitleAr: 'نحسب زمن الجلسات والتنقل بدقة لملء وقتكم بأفضل شكل دون هدر.',
    subtitleEn: 'Accurate pacing factoring in dwell times and driving buffers.',
  },
  {
    id: 4,
    icon: Flame,
    titleAr: 'وش جو ومود الطلعة اليوم؟ 🔥',
    titleEn: 'What is the vibe for today? 🔥',
    subtitleAr: 'اختر التجربة الأساسية اللي ودك تعيشها في جدة.',
    subtitleEn: 'Select the primary mood and experience you seek in Jeddah.',
  },
  {
    id: 5,
    icon: Compass,
    titleAr: 'البيئة المفضلة للجلسات؟ 🌴❄️',
    titleEn: 'Preferred Seating Ambience? 🌴❄️',
    subtitleAr: 'نراعي طبيعة الأجواء والتكييف وإطلالات الهواء الطلق.',
    subtitleEn: 'Air-conditioned comfort, open seaside breeze, or balanced mix.',
  },
  {
    id: 6,
    icon: DollarSign,
    titleAr: 'الميزانية التقديرية للشخص؟ 💰',
    titleEn: 'Estimated Budget per Person? 💰',
    subtitleAr: 'كل شي محسوب بالريال من الأكل للتذاكر وحتى المشاوير مع خيار مجاني 100%.',
    subtitleEn: 'Itemized calculations for food, activities, and transit.',
  },
  {
    id: 7,
    icon: SlidersHorizontal,
    titleAr: 'شروط وتفضيلات إضافية؟ 🤫',
    titleEn: 'Smart Preferences & Conditions? 🤫',
    subtitleAr: 'خيارات ذكية لتجنب الزحام وصعوبة المواقف خلال طلعتك.',
    subtitleEn: 'Intelligent filters to avoid traffic congestion and parking hassles.',
  },
];

export const QuickPlanWizard: React.FC = () => {
  const { language, isRTL } = useLanguage();

  const wizardPreferences = useItineraryStore((state) => state.wizardPreferences);
  const updateWizardPreferences = useItineraryStore((state) => state.updateWizardPreferences);
  const generatePlanFromPreferences = useItineraryStore((state) => state.generatePlanFromPreferences);
  const isGeneratingPlan = useItineraryStore((state) => state.isGeneratingPlan);
  const storeStep = useItineraryStore((state) => state.wizardStep);
  const setStoreStep = useItineraryStore((state) => state.setWizardStep);

  const [currentStep, setCurrentStep] = useState(storeStep || 1);
  const [direction, setDirection] = useState(1);

  // Synchronize with external store updates (e.g. from BentoMoodGrid)
  useEffect(() => {
    if (storeStep && storeStep >= 1 && storeStep <= 7 && storeStep !== currentStep) {
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
    if (currentStep < 7) {
      setDirection(1);
      const next = currentStep + 1;
      setCurrentStep(next);
      setStoreStep(next);
    } else {
      soundEngine.playSuccess();
      generatePlanFromPreferences();
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

  const progressPercent = Math.round((currentStep / 7) * 100);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 30 : -30, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -30 : 30, opacity: 0 }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.03 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  };

  return (
    <div className="w-full max-w-4xl mx-auto backdrop-blur-3xl bg-[#0E1118]/85 border border-[#E5C378]/30 rounded-3xl p-4 sm:p-8 md:p-10 shadow-[0_24px_70px_rgba(0,0,0,0.9)] relative select-none my-2 sm:my-4 overflow-hidden">
      <BorderBeam size={320} duration={14} borderWidth={1.5} colorFrom="#E5C378" colorTo="#F5E2B3" />
      {/* 1. Header Progress Strip */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E5C378] animate-pulse" />
          <span className="text-xs sm:text-sm font-black text-[#E5C378]">
            {language === 'ar' ? `المرحلة ${currentStep} من 7` : `Step ${currentStep} of 7`}
          </span>
        </div>
        <span className="font-mono text-xs sm:text-sm font-bold text-slate-300">{progressPercent}%</span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-5 sm:mb-6">
        <motion.div
          className="h-full bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] rounded-full shadow-[0_0_15px_rgba(229,195,120,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        />
      </div>

      {/* Step Pills Bar */}
      <div className="hidden sm:flex items-center justify-between gap-1.5 mb-6 pb-2 border-b border-white/10">
        {STEP_DEFINITIONS.map((def) => {
          const isCurrent = currentStep === def.id;
          const isPassed = currentStep > def.id;
          const Icon = def.icon;
          return (
            <button
              key={def.id}
              type="button"
              onClick={() => goToStep(def.id)}
              className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-[#E5C378]/20 text-[#F5E2B3] border border-[#E5C378]/50 shadow-[0_0_15px_rgba(229,195,120,0.3)]'
                  : isPassed
                  ? 'text-teal-300 hover:text-white bg-white/5'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>#{def.id}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Step Title & Narrative */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-3xl font-black text-white mb-2 flex items-center justify-center gap-2">
          {language === 'ar'
            ? STEP_DEFINITIONS[currentStep - 1].titleAr
            : STEP_DEFINITIONS[currentStep - 1].titleEn}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">
          {language === 'ar'
            ? STEP_DEFINITIONS[currentStep - 1].subtitleAr
            : STEP_DEFINITIONS[currentStep - 1].subtitleEn}
        </p>
      </div>

      {/* 3. Animated Step Options Container */}
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={currentStep}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-[260px]"
        >
          {/* STEP 1: DISTRICT SELECTION */}
          {currentStep === 1 && (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
              {[
                { id: 'all_jeddah' as const, titleAr: 'جدة كلها 🌊', titleEn: 'All Jeddah 🌊', descAr: 'أفضل المعالم المختارة عبر عروس البحر', descEn: 'Top curated spots across all districts' },
                { id: 'al-balad' as const, titleAr: 'البلد التاريخية 🏛️', titleEn: 'Historic Al-Balad 🏛️', descAr: 'تراث، عراقة، وأزقة بيوت الرواشين', descEn: 'UNESCO heritage & ancient alleys' },
                { id: 'al-shati' as const, titleAr: 'حي الشاطئ والكورنيش 🏖️', titleEn: 'Al-Shati & Corniche 🏖️', descAr: 'واجهة البحر، الممشى، ونادي اليخوت', descEn: 'Waterfront views & yacht club' },
                { id: 'al-rawdah' as const, titleAr: 'حي الروضة ☕', titleEn: 'Al-Rawdah District ☕', descAr: 'مقاهي مختصة وتذوق طعام راقي', descEn: 'Specialty coffee & dining hub' },
                { id: 'obhur' as const, titleAr: 'أبحر (الشمالية والجنوبية) 🏄', titleEn: 'Obhur Marina & Creek 🏄', descAr: 'منتجعات، شواطئ خاصة، ومارينا الغروب', descEn: 'Creek yachts, sunset & beach clubs' },
                { id: 'al-hamra' as const, titleAr: 'حي الحمراء والكورنيش 🌅', titleEn: 'Al-Hamra Corniche 🌅', descAr: 'غروب الشمس ومطل نافورة الملك فهد', descEn: 'Sunset walk & fountain viewpoints' },
                { id: 'al-zahra' as const, titleAr: 'حي الزهراء 🌿', titleEn: 'Al-Zahra District 🌿', descAr: 'أناقة عصرية، محامص، وبوتيكات هادئة', descEn: 'Modern chic & cozy roasteries' },
                { id: 'al-salamah' as const, titleAr: 'حي السلامة والنعيم 🛍️', titleEn: 'Al-Salamah & Al-Naeem 🛍️', descAr: 'حيوية، أسواق، ومطاعم متنوعة', descEn: 'Vibrant dining & shopping' },
                { id: 'al-andalus' as const, titleAr: 'حي الأندلس 🏙️', titleEn: 'Al-Andalus District 🏙️', descAr: 'تسوق فاخر ومطاعم عالمية راقية', descEn: 'Luxury boutiques & fine cafes' },
              ].map((item) => {
                const isSelected = wizardPreferences.startingDistrict === item.id;
                return (
                  <motion.button
                    key={item.id}
                    variants={cardVariants}
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      soundEngine.playClick();
                      updateWizardPreferences({ startingDistrict: item.id });
                    }}
                    className={`flex flex-col text-start p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer relative touch-manipulation ${
                      isSelected
                        ? 'bg-[#E5C378]/15 border-[#E5C378] shadow-[0_0_20px_rgba(229,195,120,0.35)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-[#F5E2B3]' : 'text-white'}`}>
                        {language === 'ar' ? item.titleAr : item.titleEn}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#E5C378]" />}
                    </div>
                    <span className="text-[11px] text-pearl-muted leading-relaxed font-normal">
                      {language === 'ar' ? item.descAr : item.descEn}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* STEP 2: COMPANIONS */}
          {currentStep === 2 && (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
              {[
                { id: 'friends' as const, titleAr: 'مع الشلة 🥳', titleEn: 'With Friends 🥳', descAr: 'حماس، فعاليات، وأماكن حيوية للشلة', descEn: 'Fun group activities & challenges' },
                { id: 'solo' as const, titleAr: 'لحالي أروّق 🚶', titleEn: 'Solo Outing 🚶', descAr: 'وقت هادئ وتركيز وتجارب خاصة', descEn: 'Quiet personal me-time' },
                { id: 'couples' as const, titleAr: 'شخصين رايقين 👩‍❤️‍👨', titleEn: 'Romantic Couples 👩‍❤️‍👨', descAr: 'أجواء شاعرية وإطلالات غروب مميزة', descEn: 'Scenic sunset & intimate dining' },
                { id: 'family' as const, titleAr: 'جمعة عائلية 👨‍👩‍👧‍👦', titleEn: 'Family Gathering 👨‍👩‍👧‍👦', descAr: 'جلسات رحبة ومناسبة لكافة الأعمار', descEn: 'Comfortable spacious seating for all' },
                { id: 'kids' as const, titleAr: 'معنا أطفال 👶', titleEn: 'With Kids 👶', descAr: 'مرافق ترفيهية ممتعة وآمنة للصغار', descEn: 'Safe & engaging family spots' },
              ].map((item) => {
                const isSelected = wizardPreferences.companions === item.id;
                return (
                  <motion.button
                    key={item.id}
                    variants={cardVariants}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      soundEngine.playClick();
                      updateWizardPreferences({ companions: item.id });
                    }}
                    className={`flex flex-col text-start p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer touch-manipulation ${
                      isSelected
                        ? 'bg-[#E5C378]/15 border-[#E5C378] shadow-[0_0_20px_rgba(229,195,120,0.35)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-[#F5E2B3]' : 'text-white'}`}>
                        {language === 'ar' ? item.titleAr : item.titleEn}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#E5C378]" />}
                    </div>
                    <span className="text-[11px] text-pearl-muted font-normal">
                      {language === 'ar' ? item.descAr : item.descEn}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* STEP 3: DURATION */}
          {currentStep === 3 && (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
              {[
                { id: 'under_2h' as const, titleAr: 'أقل من ساعتين ⚡', titleEn: 'Under 2 Hours ⚡', descAr: 'محطة سريعة وقهوة على الماشي', descEn: 'Quick coffee & relaxed pitstop' },
                { id: '2_to_4h' as const, titleAr: '2 إلى 4 ساعات ☕', titleEn: '2 to 4 Hours ☕', descAr: 'روقان ومطعم أو جلسة شاطئية', descEn: 'Balanced dining & seaside chill' },
                { id: '4_to_6h' as const, titleAr: '4 إلى 6 ساعات 🌆', titleEn: '4 to 6 Hours 🌆', descAr: 'طلعة متكاملة وتمشية وعشاء', descEn: 'Complete evening: stroll + dinner' },
                { id: 'half_day_night' as const, titleAr: 'سهرة ليلية 🌙', titleEn: 'Night Out 🌙', descAr: 'مسار ممتد من العصر لمنتصف الليل', descEn: 'Extended route from sunset to late' },
                { id: 'full_day' as const, titleAr: 'يوم كامل 🚀', titleEn: 'Full Day Tour 🚀', descAr: 'خطة شاملة من الصباح للمساء', descEn: 'Comprehensive all-day itinerary' },
              ].map((item) => {
                const isSelected = wizardPreferences.duration === item.id;
                return (
                  <motion.button
                    key={item.id}
                    variants={cardVariants}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      soundEngine.playClick();
                      updateWizardPreferences({ duration: item.id });
                    }}
                    className={`flex flex-col text-start p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer touch-manipulation ${
                      isSelected
                        ? 'bg-[#E5C378]/15 border-[#E5C378] shadow-[0_0_20px_rgba(229,195,120,0.35)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-[#F5E2B3]' : 'text-white'}`}>
                        {language === 'ar' ? item.titleAr : item.titleEn}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#E5C378]" />}
                    </div>
                    <span className="text-[11px] text-pearl-muted font-normal">
                      {language === 'ar' ? item.descAr : item.descEn}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* STEP 4: VIBE & MOOD */}
          {currentStep === 4 && (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
              {[
                { id: 'beach_sunset' as const, titleAr: 'بحر وغروب وعليلة 🌊', titleEn: 'Sunset & Sea Breeze 🌊', descAr: 'إطلالات بحرية ونسمة عليلة وشواطئ', descEn: 'Waterfront promenade & beach clubs' },
                { id: 'food' as const, titleAr: 'أكل ومطاعم مميزة 🍔', titleEn: 'Food & Dining 🍔', descAr: 'تجارب تذوق ومطاعم حصرية', descEn: 'Signature restaurants & gastronomy' },
                { id: 'coffee_dessert' as const, titleAr: 'قهوة مختصة وحلى ☕', titleEn: 'Specialty Coffee ☕', descAr: 'أحدث المحامص وجلسات هادئة رايقة', descEn: 'Artisanal brews & cozy lounges' },
                { id: 'heritage_arts' as const, titleAr: 'تراث وفنون وثقافة 🏛️', titleEn: 'Heritage & Arts 🏛️', descAr: 'أزقة البلد التاريخية والمتاحف والمعارض', descEn: 'Historic alleys, galleries & UNESCO' },
                { id: 'gaming_challenges' as const, titleAr: 'ألعاب وحماس وتحديات 🎯', titleEn: 'Gaming & Action 🎯', descAr: 'بولينج، كارتينج، وأنشطة تفاعلية', descEn: 'High-energy games & bowling' },
                { id: 'free_walk' as const, titleAr: 'تمشية وطلعة مجانية 🆓', titleEn: 'Free Promenade 🆓', descAr: '0 ر.س - مماشي بحرية ومعالم عامة', descEn: '0 SAR - Open walkways & public art' },
              ].map((item) => {
                const isSelected = wizardPreferences.vibe === item.id;
                return (
                  <motion.button
                    key={item.id}
                    variants={cardVariants}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      soundEngine.playClick();
                      updateWizardPreferences({ vibe: item.id });
                    }}
                    className={`flex flex-col text-start p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer touch-manipulation ${
                      isSelected
                        ? 'bg-[#E5C378]/15 border-[#E5C378] shadow-[0_0_20px_rgba(229,195,120,0.35)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-[#F5E2B3]' : 'text-white'}`}>
                        {language === 'ar' ? item.titleAr : item.titleEn}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#E5C378]" />}
                    </div>
                    <span className="text-[11px] text-pearl-muted font-normal">
                      {language === 'ar' ? item.descAr : item.descEn}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* STEP 5: ENVIRONMENT / ATMOSPHERE */}
          {currentStep === 5 && (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {[
                { id: 'ac_indoor' as const, titleAr: 'داخلية ومكيفة ❄️', titleEn: 'Indoor AC ❄️', descAr: 'راحة وبراد وتكييف ممتاز', descEn: 'Chilled indoor comfort' },
                { id: 'open_air_beach' as const, titleAr: 'خارجية وهواء طلق 🌴', titleEn: 'Open-Air Outdoor 🌴', descAr: 'جلسات مفتوحة ونسمة بحر', descEn: 'Open sky & sea breeze' },
                { id: 'mixed' as const, titleAr: 'مكس متوازن 🔄', titleEn: 'Balanced Hybrid 🔄', descAr: 'تمشية خفيفة مع جلسة داخلية', descEn: 'Outdoor stroll + indoor lounge' },
              ].map((item) => {
                const isSelected = wizardPreferences.ambience === item.id;
                return (
                  <motion.button
                    key={item.id}
                    variants={cardVariants}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      soundEngine.playClick();
                      updateWizardPreferences({ ambience: item.id });
                    }}
                    className={`flex flex-col text-start p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer touch-manipulation ${
                      isSelected
                        ? 'bg-[#E5C378]/15 border-[#E5C378] shadow-[0_0_20px_rgba(229,195,120,0.35)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-[#F5E2B3]' : 'text-white'}`}>
                        {language === 'ar' ? item.titleAr : item.titleEn}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#E5C378]" />}
                    </div>
                    <span className="text-[11px] text-pearl-muted font-normal">
                      {language === 'ar' ? item.descAr : item.descEn}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* STEP 6: BUDGET */}
          {currentStep === 6 && (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
              {[
                { id: 'free' as const, titleAr: 'مجانية 100% 🆓', titleEn: '100% Free 🆓', descAr: '0 ر.س (بدون أي تكاليف دخول)', descEn: '0 SAR zero-cost outing' },
                { id: 'economy' as const, titleAr: 'على قد الجيب 💰', titleEn: 'Budget Saver 💰', descAr: '≤ 60 ر.س للشخص', descEn: '≤ 60 SAR per person' },
                { id: 'moderate' as const, titleAr: 'موزونة وممتازة ⚖️', titleEn: 'Balanced Value ⚖️', descAr: '~ 150 ر.س للشخص', descEn: '~ 150 SAR per person' },
                { id: 'luxury' as const, titleAr: 'دلع وفخامة VIP 💎', titleEn: 'Signature VIP 💎', descAr: '+ 350 ر.س للشخص', descEn: '+ 350 SAR luxury tier' },
              ].map((item) => {
                const isSelected = wizardPreferences.budgetTier === item.id;
                return (
                  <motion.button
                    key={item.id}
                    variants={cardVariants}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      soundEngine.playClick();
                      updateWizardPreferences({ budgetTier: item.id });
                    }}
                    className={`flex flex-col text-start p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer touch-manipulation ${
                      isSelected
                        ? 'bg-[#E5C378]/15 border-[#E5C378] shadow-[0_0_20px_rgba(229,195,120,0.35)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-[#F5E2B3]' : 'text-white'}`}>
                        {language === 'ar' ? item.titleAr : item.titleEn}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#E5C378]" />}
                    </div>
                    <span className="text-[11px] text-pearl-muted font-normal">
                      {language === 'ar' ? item.descAr : item.descEn}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* STEP 7: PREFERENCES */}
          {currentStep === 7 && (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {[
                { id: 'no_traffic', titleAr: 'تجنب الزحمة 🤫', titleEn: 'Avoid Traffic 🤫', descAr: 'مسارات جانبية وأوقات مريحة', descEn: 'Smooth alternative routing' },
                { id: 'easy_parking', titleAr: 'مواقف سيارات سهلة 🅿️', titleEn: 'Easy Parking 🅿️', descAr: 'أماكن توفر مواقف مريحة', descEn: 'Spacious hassle-free parking' },
                { id: 'short_drives', titleAr: 'مشاوير قصيرة 🚗', titleEn: 'Short Transit 🚗', descAr: 'محطات متجاورة ومسافات قريبة', descEn: 'Tightly clustered venues' },
                { id: 'no_booking', titleAr: 'بدون حجز مسبق 🎟️', titleEn: 'No Prior Booking 🎟️', descAr: 'دخول فوري بدون انتظار', descEn: 'Walk-in friendly spots' },
              ].map((item) => {
                const currentPrefs = wizardPreferences.preferences || [];
                const isSelected = currentPrefs.includes(item.id);
                return (
                  <motion.button
                    key={item.id}
                    variants={cardVariants}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      soundEngine.playClick();
                      const updated = isSelected
                        ? currentPrefs.filter((p) => p !== item.id)
                        : [...currentPrefs, item.id];
                      updateWizardPreferences({ preferences: updated });
                    }}
                    className={`flex flex-col text-start p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer touch-manipulation ${
                      isSelected
                        ? 'bg-[#E5C378]/15 border-[#E5C378] shadow-[0_0_20px_rgba(229,195,120,0.35)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-[#F5E2B3]' : 'text-white'}`}>
                        {language === 'ar' ? item.titleAr : item.titleEn}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#E5C378]" />}
                    </div>
                    <span className="text-[11px] text-pearl-muted font-normal">
                      {language === 'ar' ? item.descAr : item.descEn}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 4. Controls Bottom Dock */}
      <div className="flex items-center justify-between pt-5 sm:pt-6 mt-6 sm:mt-8 border-t border-white/10">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`min-h-[44px] px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            currentStep === 1
              ? 'opacity-30 cursor-not-allowed text-slate-600'
              : 'backdrop-blur-md bg-white/5 hover:bg-white/10 border border-white/10 text-white cursor-pointer touch-manipulation'
          }`}
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{language === 'ar' ? 'السابق' : 'Back'}</span>
        </button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={nextStep}
          disabled={isGeneratingPlan}
          className="min-h-[44px] px-6 sm:px-9 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] text-[#0B0D12] text-xs sm:text-sm font-black shadow-[0_0_25px_rgba(229,195,120,0.5)] flex items-center gap-2 cursor-pointer touch-manipulation disabled:opacity-50"
        >
          {isGeneratingPlan ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-[#0B0D12] border-t-transparent rounded-full animate-spin" />
              <span>{language === 'ar' ? 'جاري الابتكار...' : 'Generating...'}</span>
            </div>
          ) : (
            <>
              <span>
                {currentStep === 7
                  ? language === 'ar'
                    ? 'ابتكر الخطة الآن'
                    : 'Generate My Plan'
                  : language === 'ar'
                  ? 'التالي'
                  : 'Next'}
              </span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default QuickPlanWizard;
