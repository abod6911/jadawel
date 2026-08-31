'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, MapPin, Users, Clock, Sparkles, 
  DollarSign, SlidersHorizontal, ArrowRight, ArrowLeft, CheckCircle2 
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { soundEngine } from '@/utils/audioEngine';

export interface WizardState {
  district: string;
  companion: string;
  duration: string;
  vibe: string;
  atmosphere: string;
  budget: string;
  preferences: string[];
}

const STEP_DEFINITIONS = [
  {
    id: 1,
    icon: MapPin,
    titleAr: 'من وين تحب تبدأ طلعتك؟ 📍',
    titleEn: 'Where do you want to start? 📍',
    subtitleAr: 'اختر الحي أو المنطقة الأقرب لك لترتيب مسار انسيابي بدون زحام ومسافات متناسقة.',
    subtitleEn: 'Pick your preferred district for an optimized direct linear route.'
  },
  {
    id: 2,
    icon: Users,
    titleAr: 'مين معاك في الطلعة؟ 👥',
    titleEn: 'Who is joining your outing? 👥',
    subtitleAr: 'نخصص الأماكن ونوع الجلسات لتناسب طبيعة جمعتكم وديناميكية المجموعة.',
    subtitleEn: 'We tailor venues and seating to your group dynamic.'
  },
  {
    id: 3,
    icon: Clock,
    titleAr: 'كم الوقت المتاح للطلعة؟ ⏱️',
    titleEn: 'How much time do you have? ⏱️',
    subtitleAr: 'نحسب زمن الجلسات والتنقل بدقة لملء وقتكم بأفضل شكل دون هدر.',
    subtitleEn: 'Accurate pacing factoring in dwell times and driving buffers.'
  },
  {
    id: 4,
    icon: Sparkles,
    titleAr: 'وش جو ومود الطلعة اليوم؟ ✨',
    titleEn: 'What is the vibe for today? ✨',
    subtitleAr: 'اختر التجربة الأساسية اللي ودك تعيشها في جدة.',
    subtitleEn: 'Select the primary mood and experience you seek in Jeddah.'
  },
  {
    id: 5,
    icon: Compass,
    titleAr: 'البيئة المفضلة للجلسات؟ 🌴❄️',
    titleEn: 'Preferred Seating Ambience? 🌴❄️',
    subtitleAr: 'نراعي طبيعة الأجواء والتكييف وإطلالات الهواء الطلق.',
    subtitleEn: 'Air-conditioned comfort, open seaside breeze, or balanced mix.'
  },
  {
    id: 6,
    icon: DollarSign,
    titleAr: 'الميزانية التقديرية للشخص؟ 💰',
    titleEn: 'Estimated Budget per Person? 💰',
    subtitleAr: 'كل شي محسوب بالريال من الأكل للتذاكر وحتى المشاوير مع خيار مجاني 100%.',
    subtitleEn: 'Itemized calculations for food, activities, and transit.'
  },
  {
    id: 7,
    icon: SlidersHorizontal,
    titleAr: 'شروط وتفضيلات إضافية؟ 🤫',
    titleEn: 'Smart Preferences & Conditions? 🤫',
    subtitleAr: 'خيارات ذكية لتجنب الزحام وصعوبة المواقف خلال طلعتك.',
    subtitleEn: 'Intelligent filters to avoid traffic congestion and parking hassles.'
  }
];

export const QuickPlanWizard: React.FC<{ onComplete?: (data: WizardState) => void }> = ({ onComplete }) => {
  const { language, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const wizardPreferences = useItineraryStore((state) => state.wizardPreferences);
  const updateWizardPreferences = useItineraryStore((state) => state.updateWizardPreferences);
  const generatePlanFromPreferences = useItineraryStore((state) => state.generatePlanFromPreferences);
  const isGeneratingPlan = useItineraryStore((state) => state.isGeneratingPlan);

  const [formData, setFormData] = useState<WizardState>({
    district: wizardPreferences.startingDistrict || 'all',
    companion: wizardPreferences.companions || 'friends',
    duration: wizardPreferences.duration || '4h',
    vibe: wizardPreferences.vibe || 'food',
    atmosphere: wizardPreferences.ambience || 'hybrid',
    budget: wizardPreferences.budgetTier || 'balanced',
    preferences: wizardPreferences.preferences || ['no_traffic'],
  });

  const nextStep = () => {
    soundEngine.playClick();
    if (currentStep < 7) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      soundEngine.playSuccess();
      updateWizardPreferences({
        startingDistrict: formData.district === 'all' ? 'all_jeddah' : (formData.district as any),
        companions: formData.companion as any,
        duration: (formData.duration === '2h' ? 'under_2h' : formData.duration === '4h' ? '2_to_4h' : formData.duration === '6h' ? '4_to_6h' : 'full_day') as any,
        vibe: (formData.vibe === 'sea' ? 'beach_sunset' : formData.vibe === 'coffee' ? 'coffee_dessert' : formData.vibe === 'heritage' ? 'heritage_arts' : formData.vibe === 'gaming' ? 'gaming_challenges' : formData.vibe) as any,
        ambience: (formData.atmosphere === 'indoor' ? 'ac_indoor' : formData.atmosphere === 'outdoor' ? 'open_air_beach' : 'mixed') as any,
        budgetTier: (formData.budget === 'free_0' || formData.budget === 'free' ? 'free' : formData.budget === 'economy' ? 'economy' : formData.budget === 'balanced' ? 'moderate' : 'luxury') as any,
        preferences: formData.preferences,
      });

      if (onComplete) {
        onComplete(formData);
      } else {
        generatePlanFromPreferences();
      }
    }
  };

  const prevStep = () => {
    soundEngine.playClick();
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const progressPercent = Math.round((currentStep / 7) * 100);

  // Motion variants for step slide
  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <div className="w-full max-w-4xl mx-auto backdrop-blur-2xl bg-[#090B0E]/95 border border-white/10 rounded-3xl p-5 sm:p-10 shadow-2xl relative select-none my-4">
      {/* 1. Header Progress Strip */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E5A962] animate-pulse" />
          <span className="text-xs sm:text-sm font-semibold text-[#F3CA95]">
            {language === 'ar' ? `المرحلة ${currentStep} من 7` : `Step ${currentStep} of 7`}
          </span>
        </div>
        <span className="font-mono text-xs sm:text-sm font-bold text-white/80">{progressPercent}%</span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-6 sm:mb-8">
        <motion.div
          className="h-full bg-gradient-to-r from-[#E5A962] to-[#D48B38] rounded-full shadow-[0_0_12px_rgba(229,169,98,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </div>

      {/* 2. Step Title & Narrative */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-3xl font-black text-white mb-2 flex items-center justify-center gap-2">
          {language === 'ar' ? STEP_DEFINITIONS[currentStep - 1].titleAr : STEP_DEFINITIONS[currentStep - 1].titleEn}
        </h2>
        <p className="text-xs sm:text-sm text-[#9EA8B3] max-w-xl mx-auto">
          {language === 'ar' ? STEP_DEFINITIONS[currentStep - 1].subtitleAr : STEP_DEFINITIONS[currentStep - 1].subtitleEn}
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
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-[260px]"
        >
          {/* STEP 1: DISTRICT SELECTION */}
          {currentStep === 1 && (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
              {[
                { id: 'all', titleAr: 'جدة كلها 🌊', titleEn: 'All Jeddah 🌊', descAr: 'أفضل المعالم المختارة بعناية', descEn: 'Top curated spots across Jeddah' },
                { id: 'balad', titleAr: 'البلد التاريخية 🏛️', titleEn: 'Historic Al-Balad 🏛️', descAr: 'تراث، عراقة، وأزقة أصيلة', descEn: 'Heritage, ancient alleys & rawashin' },
                { id: 'shati', titleAr: 'حي الشاطئ والكورنيش 🏖️', titleEn: 'Al-Shati & Waterfront 🏖️', descAr: 'إطلالات بحرية وفخامة عصرية', descEn: 'Waterfront views & modern chic' },
                { id: 'rawdah', titleAr: 'حي الروضة ☕', titleEn: 'Al-Rawdah District ☕', descAr: 'مقاهي مختصة وتذوق طعام راقي', descEn: 'Specialty coffee & gastronomy' },
                { id: 'obhur', titleAr: 'أبحر (الشمالية والجنوبية) 🏄', titleEn: 'Obhur Marina & Creek 🏄', descAr: 'بحر، شواطئ خاصة، ومارينا', descEn: 'Creek yachts, sunset & private beaches' },
                { id: 'hamra', titleAr: 'حي الحمراء والكورنيش 🌅', titleEn: 'Al-Hamra Corniche 🌅', descAr: 'غروب الشمس ونافورة الملك فهد', descEn: 'Sunset walk & King Fahd Fountain' },
                { id: 'zahra', titleAr: 'حي الزهراء 🌿', titleEn: 'Al-Zahra District 🌿', descAr: 'أناقة عصرية وأجواء هادئة', descEn: 'Modern elegance & cozy spots' },
                { id: 'salamah', titleAr: 'حي السلامة والنعيم 🛍️', titleEn: 'Al-Salamah & Al-Naeem 🛍️', descAr: 'حيوية، أسواق، ومطاعم متنوعة', descEn: 'Vibrant dining & shopping hubs' },
                { id: 'andalus', titleAr: 'حي الأندلس 🏙️', titleEn: 'Al-Andalus District 🏙️', descAr: 'تسوق فاخر وأجواء راقية', descEn: 'Luxury boutiques & fine cafes' },
              ].map((item) => {
                const isSelected = formData.district === item.id;
                return (
                  <motion.button
                    key={item.id}
                    variants={cardVariants}
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, district: item.id })}
                    className={`flex flex-col text-start p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer relative touch-manipulation ${
                      isSelected
                        ? 'bg-[#E5A962]/10 border-[#E5A962] shadow-[0_0_20px_rgba(229,169,98,0.2)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-[#F3CA95]' : 'text-white'}`}>
                        {language === 'ar' ? item.titleAr : item.titleEn}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#E5A962]" />}
                    </div>
                    <span className="text-[11px] text-[#9EA8B3] leading-relaxed">
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
                { id: 'solo', titleAr: 'لحالي أروّق 🚶', titleEn: 'Solo Outing 🚶', descAr: 'وقت هادئ وتركيز وتجارب خاصة', descEn: 'Quiet personal me-time' },
                { id: 'couple', titleAr: 'شخصين رايقين 👩❤️👨', titleEn: 'Romantic Couple 👩❤️👨', descAr: 'أجواء شاعرية وإطلالات مميزة', descEn: 'Scenic sunset & intimate dining' },
                { id: 'friends', titleAr: 'مع الشلة 🥳', titleEn: 'With Friends 🥳', descAr: 'حماس، فعاليات، وأماكن جماعية', descEn: 'Fun group activities & challenges' },
                { id: 'family', titleAr: 'جمعة عائلية 👨👩👧👦', titleEn: 'Family Gathering 👨👩👧👦', descAr: 'جلسات رحبة ومناسبة للجميع', descEn: 'Comfortable spacious seating for all' },
                { id: 'kids', titleAr: 'معنا أطفال 👶', titleEn: 'With Kids 👶', descAr: 'مرافق ممتعة وآمنة للأطفال', descEn: 'Safe & engaging family spots' },
              ].map((item) => {
                const isSelected = formData.companion === item.id;
                return (
                  <motion.button
                    key={item.id}
                    variants={cardVariants}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, companion: item.id })}
                    className={`flex flex-col text-start p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer touch-manipulation ${
                      isSelected
                        ? 'bg-[#E5A962]/10 border-[#E5A962] shadow-[0_0_20px_rgba(229,169,98,0.2)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-[#F3CA95]' : 'text-white'}`}>
                        {language === 'ar' ? item.titleAr : item.titleEn}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#E5A962]" />}
                    </div>
                    <span className="text-[11px] text-[#9EA8B3]">
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
                { id: '2h', titleAr: 'أقل من ساعتين ⚡', titleEn: 'Under 2 Hours ⚡', descAr: 'محطة سريعة وقهوة على الماشي', descEn: 'Quick coffee & relaxed pitstop' },
                { id: '4h', titleAr: '2 إلى 4 ساعات ☕', titleEn: '2 to 4 Hours ☕', descAr: 'روقان ومطعم أو جلسة شاطئية', descEn: 'Balanced dining & seaside chill' },
                { id: '6h', titleAr: '4 إلى 6 ساعات 🌆', titleEn: '4 to 6 Hours 🌆', descAr: 'طلعة متكاملة وتمشية وعشاء', descEn: 'Complete evening: stroll + dinner' },
                { id: 'half_day', titleAr: 'نصف يوم / سهرة 🌙', titleEn: 'Evening Night Out 🌙', descAr: 'مسار ممتد من العصر لمنتصف الليل', descEn: 'Extended route from sunset to late' },
                { id: 'full_day', titleAr: 'يوم كامل 🚀', titleEn: 'Full Day Tour 🚀', descAr: 'خطة سياحية شاملة من الصباح', descEn: 'Comprehensive all-day itinerary' },
              ].map((item) => {
                const isSelected = formData.duration === item.id;
                return (
                  <motion.button
                    key={item.id}
                    variants={cardVariants}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, duration: item.id })}
                    className={`flex flex-col text-start p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer touch-manipulation ${
                      isSelected
                        ? 'bg-[#E5A962]/10 border-[#E5A962] shadow-[0_0_20px_rgba(229,169,98,0.2)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-[#F3CA95]' : 'text-white'}`}>
                        {language === 'ar' ? item.titleAr : item.titleEn}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#E5A962]" />}
                    </div>
                    <span className="text-[11px] text-[#9EA8B3]">
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
                { id: 'food', titleAr: 'أكل وجوعان 🍔', titleEn: 'Food & Dining 🍔', descAr: 'تجارب تذوق ومطاعم مميزة', descEn: 'Signature restaurants & gastronomy' },
                { id: 'coffee', titleAr: 'قهوة مختصة وحلى ☕', titleEn: 'Specialty Coffee ☕', descAr: 'أحدث المحامص وجلسات هادئة', descEn: 'Artisanal brews & cozy lounges' },
                { id: 'sea', titleAr: 'بحر وغروب وعليلة 🌊', titleEn: 'Sunset & Sea Breeze 🌊', descAr: 'إطلالات بحرية ونسمة عليلة', descEn: 'Waterfront promenade & beaches' },
                { id: 'gaming', titleAr: 'ألعاب وحماس وتحديات 🎯', titleEn: 'Gaming & Action 🎯', descAr: 'بولينج، كارتينج، وأنشطة حماسية', descEn: 'High-energy games & bowling' },
                { id: 'heritage', titleAr: 'تراث وفنون وثقافة 🏛️', titleEn: 'Heritage & Arts 🏛️', descAr: 'أزقة البلد التاريخية والمتاحف', descEn: 'Historic alleys, galleries & UNESCO' },
                { id: 'free', titleAr: 'طلعة مجانية بالكامل 🆓', titleEn: '100% Free Outing 🆓', descAr: '0 ر.س - مماشي ومعالم عامة', descEn: '0 SAR - Open walkways & public art' },
              ].map((item) => {
                const isSelected = formData.vibe === item.id;
                return (
                  <motion.button
                    key={item.id}
                    variants={cardVariants}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, vibe: item.id })}
                    className={`flex flex-col text-start p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer touch-manipulation ${
                      isSelected
                        ? 'bg-[#E5A962]/10 border-[#E5A962] shadow-[0_0_20px_rgba(229,169,98,0.2)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-[#F3CA95]' : 'text-white'}`}>
                        {language === 'ar' ? item.titleAr : item.titleEn}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#E5A962]" />}
                    </div>
                    <span className="text-[11px] text-[#9EA8B3]">
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
                { id: 'indoor', titleAr: 'داخلية ومكيفة ❄️', titleEn: 'Indoor AC ❄️', descAr: 'راحة وبراد بعيد عن الرطوبة', descEn: 'Chilled indoor comfort' },
                { id: 'outdoor', titleAr: 'خارجية وهواء طلق 🌴', titleEn: 'Open-Air Outdoor 🌴', descAr: 'جلسات مفتوحة ونسمة بحر', descEn: 'Open sky & sea breeze' },
                { id: 'hybrid', titleAr: 'مكس متوازن 🔄', titleEn: 'Balanced Hybrid 🔄', descAr: 'تمشية خفيفة مع جلسة داخلية', descEn: 'Outdoor stroll + indoor lounge' },
              ].map((item) => {
                const isSelected = formData.atmosphere === item.id;
                return (
                  <motion.button
                    key={item.id}
                    variants={cardVariants}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, atmosphere: item.id })}
                    className={`flex flex-col text-start p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer touch-manipulation ${
                      isSelected
                        ? 'bg-[#E5A962]/10 border-[#E5A962] shadow-[0_0_20px_rgba(229,169,98,0.2)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-[#F3CA95]' : 'text-white'}`}>
                        {language === 'ar' ? item.titleAr : item.titleEn}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#E5A962]" />}
                    </div>
                    <span className="text-[11px] text-[#9EA8B3]">
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
                { id: 'free_0', titleAr: 'مجانية 100% 🆓', titleEn: '100% Free 🆓', descAr: '0 ر.س (بدون أي تكاليف)', descEn: '0 SAR zero-cost outing' },
                { id: 'economy', titleAr: 'على قد الجيب 💰', titleEn: 'Budget Saver 💰', descAr: '≤ 60 ر.س للشخص', descEn: '≤ 60 SAR per person' },
                { id: 'balanced', titleAr: 'موزونة وممتازة ✨', titleEn: 'Balanced Value ✨', descAr: '~ 150 ر.س للشخص', descEn: '~ 150 SAR per person' },
                { id: 'luxury', titleAr: 'دلع وفخامة VIP 💎', titleEn: 'Signature VIP 💎', descAr: '+ 350 ر.س للشخص', descEn: '+ 350 SAR luxury tier' },
              ].map((item) => {
                const isSelected = formData.budget === item.id;
                return (
                  <motion.button
                    key={item.id}
                    variants={cardVariants}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, budget: item.id })}
                    className={`flex flex-col text-start p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer touch-manipulation ${
                      isSelected
                        ? 'bg-[#E5A962]/10 border-[#E5A962] shadow-[0_0_20px_rgba(229,169,98,0.2)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-[#F3CA95]' : 'text-white'}`}>
                        {language === 'ar' ? item.titleAr : item.titleEn}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#E5A962]" />}
                    </div>
                    <span className="text-[11px] text-[#9EA8B3]">
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
                { id: 'short_drives', titleAr: 'مشاوير قصيرة 🚗', titleEn: 'Short Transit 🚗', descAr: 'محطات متجاورة جداً', descEn: 'Tightly clustered venues' },
                { id: 'no_booking', titleAr: 'بدون حجز مسبق 🎟️', titleEn: 'No Prior Booking 🎟️', descAr: 'دخول فوري بدون انتظار', descEn: 'Walk-in friendly spots' },
              ].map((item) => {
                const isSelected = formData.preferences.includes(item.id);
                return (
                  <motion.button
                    key={item.id}
                    variants={cardVariants}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const exists = formData.preferences.includes(item.id);
                      setFormData({
                        ...formData,
                        preferences: exists
                          ? formData.preferences.filter((p) => p !== item.id)
                          : [...formData.preferences, item.id],
                      });
                    }}
                    className={`flex flex-col text-start p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer touch-manipulation ${
                      isSelected
                        ? 'bg-[#E5A962]/10 border-[#E5A962] shadow-[0_0_20px_rgba(229,169,98,0.2)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-[#F3CA95]' : 'text-white'}`}>
                        {language === 'ar' ? item.titleAr : item.titleEn}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#E5A962]" />}
                    </div>
                    <span className="text-[11px] text-[#9EA8B3]">
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
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
            currentStep === 1
              ? 'opacity-30 cursor-not-allowed text-white/40'
              : 'backdrop-blur-md bg-white/5 hover:bg-white/10 border border-white/10 text-white cursor-pointer touch-manipulation'
          }`}
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{language === 'ar' ? 'السابق' : 'Back'}</span>
        </button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={nextStep}
          disabled={isGeneratingPlan}
          className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-[#E5A962] to-[#D48B38] text-[#090B0E] text-xs sm:text-sm font-bold shadow-lg shadow-[#E5A962]/20 flex items-center gap-2 cursor-pointer touch-manipulation disabled:opacity-50"
        >
          <span>
            {currentStep === 7
              ? language === 'ar'
                ? '✨ ابتكر الخطة الحين'
                : '✨ Generate My Plan'
              : language === 'ar'
              ? 'التالي'
              : 'Next'}
          </span>
          {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </motion.button>
      </div>
    </div>
  );
};

export default QuickPlanWizard;
