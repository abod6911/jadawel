'use client';

import React from 'react';
import { Waves, Flame, Sparkles, Coffee, Landmark, Gamepad2, ArrowLeft, ArrowRight, Wind, Star } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { soundEngine } from '@/utils/audioEngine';
import { getAssetUrl } from '@/utils/paths';

export const BentoMoodGrid: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const updateWizardPreferences = useItineraryStore((state) => state.updateWizardPreferences);
  const setActiveNavTab = useItineraryStore((state) => state.setActiveNavTab);
  const setWizardStep = useItineraryStore((state) => state.setWizardStep);

  const handleMoodSelect = (vibe: any) => {
    soundEngine.playClick();
    updateWizardPreferences({ vibe });
    setWizardStep(1);
    setActiveNavTab('quick-plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="space-y-6 my-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-start">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-xs font-black mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'مود اليوم وش جوك؟' : 'What is your vibe today?'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-pearl tracking-tight">
            {language === 'ar' ? 'استكشف حسب المزاج والطلعة' : 'Explore by Mood & Vibe'}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-pearl-muted font-medium max-w-md">
          {language === 'ar'
            ? 'انقر على المود الذي يناسبك لتوليد خطة مصممة خصيصاً لجوك اليوم'
            : 'Click any mood category to automatically tailor your bespoke Jeddah outing'}
        </p>
      </div>

      {/* Asymmetrical Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* 1. Large Featured Card: Beaches & Sunset (7 Cols on desktop) */}
        <div
          onClick={() => handleMoodSelect('beach_sunset')}
          className="md:col-span-7 relative min-h-[300px] md:min-h-[340px] rounded-[2rem] overflow-hidden border border-white/15 group cursor-pointer shadow-cinematic hover:border-teal-400/50 transition-all duration-500"
        >
          <img
            src={getAssetUrl('/images/moods/mood-beach.jpg')}
            alt="شواطئ وغروب بحري"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-abyss-950 via-abyss-950/40 to-transparent opacity-90 group-hover:opacity-85 transition-opacity" />

          {/* Top Live Sea Breeze Badge */}
          <div className="absolute top-5 start-5 flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-teal-500/80 backdrop-blur-md text-pearl text-xs font-black flex items-center gap-1.5 shadow-glow-teal border border-teal-300/40">
              <Wind className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'نسيم البحر • روقان الغروب 🌊' : 'Sea Breeze • Sunset Vibe 🌊'}</span>
            </span>
          </div>

          {/* Card Content */}
          <div className="absolute bottom-6 inset-x-6 text-pearl space-y-2 text-start">
            <h3 className="text-2xl sm:text-3xl font-black text-pearl drop-shadow-md flex items-center gap-2">
              <span>{language === 'ar' ? 'شواطئ وغروب بحري 🌊' : 'Beach Clubs & Sunsets 🌊'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-pearl-muted font-medium leading-relaxed max-w-xl">
              {language === 'ar'
                ? 'منتجعات أبحر الشاطئية، جلسات ممشى الكورنيش الشمالي، ونوادي اليخوت الفارهة مع نسيم البحر الأحمر.'
                : 'Obhur private beach clubs, North Corniche walkways, and luxury yacht marinas with sunset views.'}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-teal-300">
              <span>{language === 'ar' ? 'عرض المسارات البحرية' : 'View Coastal Plans'}</span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* 2. Tall Card: Cafes & Gourmet Dining (5 Cols, vertical portrait accent) */}
        <div
          onClick={() => handleMoodSelect('food')}
          className="md:col-span-5 relative min-h-[300px] md:min-h-[340px] rounded-[2rem] overflow-hidden border border-white/15 group cursor-pointer shadow-cinematic hover:border-gold-400/50 transition-all duration-500"
        >
          <img
            src={getAssetUrl('/images/moods/mood-food.jpg')}
            alt="مطاعم ومقاهي رايقة"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-abyss-950 via-abyss-950/40 to-transparent opacity-90 group-hover:opacity-85 transition-opacity" />

          {/* Top Ambient Rating Badge */}
          <div className="absolute top-5 start-5">
            <span className="px-3.5 py-1.5 rounded-xl bg-gold-500/90 backdrop-blur-md text-abyss-950 text-xs font-black flex items-center gap-1.5 shadow-glow-gold border border-gold-300/40">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'ar' ? 'أعلى تقييماً 4.9 ★' : 'Top Rated 4.9 ★'}</span>
            </span>
          </div>

          {/* Card Content */}
          <div className="absolute bottom-6 inset-x-6 text-pearl space-y-2 text-start">
            <h3 className="text-xl sm:text-2xl font-black text-pearl drop-shadow-md">
              {language === 'ar' ? 'مطاعم وكافيهات رايقة ☕' : 'Gourmet Cafes & Dining ☕'}
            </h3>
            <p className="text-xs sm:text-sm text-pearl-muted font-medium leading-relaxed">
              {language === 'ar'
                ? 'محامص القهوة المختصة في الروضة، برجر سكشن بي الحرفي، ومطاعم إيطالية وبحرية فاخرة.'
                : 'Artisanal roasteries in Al-Rawdah, Section-B burgers, and fine Italian & seafood dining.'}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-gold-400">
              <span>{language === 'ar' ? 'خطط القهوة والمطاعم' : 'Explore Dining Plans'}</span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* 3. Medium Card: Heritage & Al-Balad (6 Cols) */}
        <div
          onClick={() => handleMoodSelect('heritage_arts')}
          className="md:col-span-6 relative min-h-[260px] md:min-h-[280px] rounded-[2rem] overflow-hidden border border-white/15 group cursor-pointer shadow-cinematic hover:border-gold-500/50 transition-all duration-500"
        >
          <img
            src={getAssetUrl('/images/moods/mood-heritage.jpg')}
            alt="سهرات وتراث البلد"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-abyss-950 via-abyss-950/45 to-transparent opacity-90 group-hover:opacity-85 transition-opacity" />

          {/* Top Badge */}
          <div className="absolute top-5 start-5">
            <span className="px-3.5 py-1.5 rounded-xl bg-gold-500/20 backdrop-blur-md text-gold-400 text-xs font-black flex items-center gap-1.5 border border-gold-500/40">
              <Landmark className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تراث اليونسكو العالمي 🏛️' : 'UNESCO Heritage 🏛️'}</span>
            </span>
          </div>

          {/* Card Content */}
          <div className="absolute bottom-6 inset-x-6 text-pearl space-y-1.5 text-start">
            <h3 className="text-xl sm:text-2xl font-black text-pearl drop-shadow-md">
              {language === 'ar' ? 'سهرات وتراث البلد 🏛️' : 'Heritage & Al-Balad Nights 🏛️'}
            </h3>
            <p className="text-xs text-pearl-muted font-medium leading-relaxed">
              {language === 'ar'
                ? 'رواشين بيت نصيف، تيم لاب بلا حدود الرقمي، وأزقة سوق العلوي مع شاي النعناع الحجازي.'
                : 'Bait Nassif Rawashin, teamLab Borderless, and Souq Al-Alawi spice stalls with mint tea.'}
            </p>
          </div>
        </div>

        {/* 4. Medium Card: Gaming & Thrills (6 Cols) */}
        <div
          onClick={() => handleMoodSelect('gaming_challenges')}
          className="md:col-span-6 relative min-h-[260px] md:min-h-[280px] rounded-[2rem] overflow-hidden border border-white/15 group cursor-pointer shadow-cinematic hover:border-coral-400/50 transition-all duration-500"
        >
          <img
            src={getAssetUrl('/images/moods/mood-gaming.jpg')}
            alt="ألعاب وتحديات حماس"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-abyss-950 via-abyss-950/45 to-transparent opacity-90 group-hover:opacity-85 transition-opacity" />

          {/* Top Badge */}
          <div className="absolute top-5 start-5">
            <span className="px-3.5 py-1.5 rounded-xl bg-coral-500/25 backdrop-blur-md text-coral-400 text-xs font-black flex items-center gap-1.5 border border-coral-500/40">
              <Flame className="w-3.5 h-3.5 text-coral-400" />
              <span>{language === 'ar' ? 'حماس وتحديات للشلة ⚡' : 'Thrills & Fun ⚡'}</span>
            </span>
          </div>

          {/* Card Content */}
          <div className="absolute bottom-6 inset-x-6 text-pearl space-y-1.5 text-start">
            <h3 className="text-xl sm:text-2xl font-black text-pearl drop-shadow-md">
              {language === 'ar' ? 'ألعاب وتحديات حماس 🎯' : 'Gaming & Thrills 🎯'}
            </h3>
            <p className="text-xs text-pearl-muted font-medium leading-relaxed">
              {language === 'ar'
                ? 'قطار الموت بمدينة ملاهي الشلال، صالة التزلج، ملاعب باتور للبادل، وغرف الهروب.'
                : 'Al-Shallal roller coasters, indoor ice rink, Batour padel courts, and escape challenges.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
