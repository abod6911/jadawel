'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Waves,
  Landmark,
  Coffee,
  ArrowLeft,
  ArrowRight,
  Sun,
  Coins,
  MapPin,
  Clock,
  Car,
  Compass,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { soundEngine } from '@/utils/audioEngine';

export type RealmId = 'OBHUR' | 'BALAD' | 'RAWDAH';

interface RealmData {
  id: RealmId;
  districtId: string;
  vibe: any;
  titleAr: string;
  titleEn: string;
  taglineAr: string;
  taglineEn: string;
  eyebrowAr: string;
  eyebrowEn: string;
  weatherAr: string;
  weatherEn: string;
  budgetSAR: number;
  budgetLabelAr: string;
  budgetLabelEn: string;
  imageUrl: string;
  accentColor: string;
  secondaryColor: string;
  icon: any;
  quickStops: {
    time: string;
    nameAr: string;
    nameEn: string;
    costAr: string;
    costEn: string;
  }[];
}

export const JEDDAH_REALMS: Record<RealmId, RealmData> = {
  OBHUR: {
    id: 'OBHUR',
    districtId: 'obhur_shamaliyah',
    vibe: 'beach_sunset',
    titleAr: 'أبحر والواجهة البحرية',
    titleEn: 'Obhur & Waterfront Marina',
    taglineAr: 'روقان الغروب، نسيم البحر الأحمر، وأرقى شواطئ ونوادي اليخوت 🌊',
    taglineEn: 'Golden sunset breeze, Red Sea yachts, and serene private beach lounges 🌊',
    eyebrowAr: '📍 عروس البحر الأحمر • الواجهة والنوادي الشاطئية',
    eyebrowEn: '📍 Red Sea Bride • Waterfront & Beach Clubs',
    weatherAr: '🌊 29°C • نسيم البحر 14 عقدة • غروب ذهبي',
    weatherEn: '🌊 29°C • Sea Breeze 14 kts • Golden Sunset',
    budgetSAR: 120,
    budgetLabelAr: 'موزون ~120 ر.س',
    budgetLabelEn: 'Est. ~120 SAR',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1600',
    accentColor: '#1D8C88',
    secondaryColor: '#F46F52',
    icon: Waves,
    quickStops: [
      { time: '4:30 PM', nameAr: 'شاطئ أبحر الشمالية واليخوت', nameEn: 'Obhur Marina & Beach', costAr: 'مجاني', costEn: 'Free' },
      { time: '6:15 PM', nameAr: 'واجهة الكورنيش وقت الغروب', nameEn: 'Corniche Sunset Walk', costAr: 'مجاني', costEn: 'Free' },
      { time: '8:00 PM', nameAr: 'عشاء سي فود بإطلالة بحرية', nameEn: 'Seafood Waterfront Dining', costAr: '120 ر.س', costEn: '120 SAR' },
    ],
  },
  BALAD: {
    id: 'BALAD',
    districtId: 'al_balad',
    vibe: 'heritage_arts',
    titleAr: 'رواشين وسهرات البلد',
    titleEn: 'Al-Balad Heritage & Nights',
    taglineAr: 'عبق التاريخ الحجازي، أزقة التراث العريق، وبسطات الشاي على ضوء الفوانيس 🏛️',
    taglineEn: 'Timeless Hijazi heritage, ancient coral stone alleys, and vibrant lantern tea nights 🏛️',
    eyebrowAr: '📍 قلب جدة التاريخية • UNESCO World Heritage',
    eyebrowEn: '📍 Historic Jeddah Heart • UNESCO World Heritage',
    weatherAr: '🏛️ 28°C • أجواء سهرة تراثية • فوانيس البلد',
    weatherEn: '🏛️ 28°C • Heritage Night • Al-Balad Lanterns',
    budgetSAR: 45,
    budgetLabelAr: 'اقتصادي ~45 ر.س',
    budgetLabelEn: 'Est. ~45 SAR',
    imageUrl: 'https://images.unsplash.com/photo-1578895210405-907db486c111?auto=format&fit=crop&q=80&w=1600',
    accentColor: '#F6C77A',
    secondaryColor: '#F46F52',
    icon: Landmark,
    quickStops: [
      { time: '5:30 PM', nameAr: 'ممشى البلد وزيارة بيت نصيف', nameEn: 'Bait Nassif & Heritage Walk', costAr: '25 ر.س', costEn: '25 SAR' },
      { time: '7:15 PM', nameAr: 'شاي حجازي وبسطات الكبدة والسمبوسة', nameEn: 'Hijazi Tea & Street Stalls', costAr: '20 ر.س', costEn: '20 SAR' },
      { time: '9:00 PM', nameAr: 'سهرة الفوانيس ودكاكين التحف', nameEn: 'Lantern Alleys & Antiques', costAr: 'مجاني', costEn: 'Free' },
    ],
  },
  RAWDAH: {
    id: 'RAWDAH',
    districtId: 'al_rawdah',
    vibe: 'coffee_dessert',
    titleAr: 'كافيهات ومطاعم الروضة',
    titleEn: 'Al-Rawdah Coffee & Dining',
    taglineAr: 'عاصمة القهوة المختصة، أشهر المطاعم الحرفية، وأجواء ليلية نابضة بالحياة ☕',
    taglineEn: 'Specialty roasters capital, premier culinary gems, and electric urban atmosphere ☕',
    eyebrowAr: '📍 المربع الذهبي للتذوق والروقان العصري',
    eyebrowEn: '📍 Golden District of Taste & Specialty Hub',
    weatherAr: '☕ 27°C • أجواء حيوية رايقة • Specialty Hub',
    weatherEn: '☕ 27°C • Electric Vibe • Specialty Coffee Hub',
    budgetSAR: 85,
    budgetLabelAr: 'موزون ~85 ر.س',
    budgetLabelEn: 'Est. ~85 SAR',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1600',
    accentColor: '#F46F52',
    secondaryColor: '#1D8C88',
    icon: Coffee,
    quickStops: [
      { time: '5:00 PM', nameAr: 'مِـدّ كافيه ومحمصة حرفية (V60)', nameEn: 'Medd Roastery (V60)', costAr: '35 ر.س', costEn: '35 SAR' },
      { time: '7:00 PM', nameAr: 'عشاء رايق في سان كارلو شيكيتي', nameEn: 'Dinner at San Carlo', costAr: '120 ر.س', costEn: '120 SAR' },
      { time: '9:30 PM', nameAr: 'حلى وماتشا وممشى الروضة', nameEn: 'Matcha & Evening Stroll', costAr: '40 ر.س', costEn: '40 SAR' },
    ],
  },
};

export const CinematicRealmStage: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const [activeRealmId, setActiveRealmId] = useState<RealmId>('OBHUR');
  const updateWizardPreferences = useItineraryStore((state) => state.updateWizardPreferences);
  const setWizardStep = useItineraryStore((state) => state.setWizardStep);
  const setActiveNavTab = useItineraryStore((state) => state.setActiveNavTab);
  const generatePlanFromPreferences = useItineraryStore((state) => state.generatePlanFromPreferences);

  const activeRealm = JEDDAH_REALMS[activeRealmId];

  // The remaining 2 portals
  const realmKeys = Object.keys(JEDDAH_REALMS) as RealmId[];
  const sidePortals = realmKeys.filter((k) => k !== activeRealmId);

  const handleSelectRealm = (realmId: RealmId) => {
    soundEngine.playClick();
    setActiveRealmId(realmId);
    const r = JEDDAH_REALMS[realmId];
    updateWizardPreferences({
      startingDistrict: r.districtId as any,
      vibe: r.vibe,
    });
  };

  const handleStartPlan = () => {
    soundEngine.playClick();
    updateWizardPreferences({
      startingDistrict: activeRealm.districtId as any,
      vibe: activeRealm.vibe,
    });
    setWizardStep(0);
    setActiveNavTab('quick-plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-abyss border border-white/10 shadow-cinematic text-pearl select-none transition-all">
      {/* 1. Cinematic Visual Background Container with Crossfade */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRealm.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${activeRealm.imageUrl})` }}
          />
        </AnimatePresence>

        {/* Ambient Darkened Gradient Overlays & Mesh */}
        <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/80 to-abyss/40" />
        <div className="absolute inset-0 bg-mesh-abyss opacity-40 pointer-events-none" />
        <div className="absolute inset-0 rawashin-lattice opacity-[0.03] pointer-events-none" />
      </div>

      {/* 2. Main Center Hero Stage */}
      <div className="relative z-10 px-4 sm:px-8 lg:px-12 py-10 sm:py-16 lg:py-20 flex flex-col items-center text-center space-y-6 sm:space-y-8 max-w-5xl mx-auto">
        {/* Eyebrow Badge with Live Pulse */}
        <motion.div
          key={`eyebrow-${activeRealm.id}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-abyss-900/90 backdrop-blur-xl border border-gold-500/40 text-gold-300 text-xs sm:text-sm font-extrabold shadow-glow-gold"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-coral-500" />
          </span>
          <span>{language === 'ar' ? activeRealm.eyebrowAr : activeRealm.eyebrowEn}</span>
        </motion.div>

        {/* Massive Crisp Headline */}
        <div className="space-y-3">
          <AnimatePresence mode="wait">
            <motion.h1
              key={`title-${activeRealm.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.2] text-pearl drop-shadow-lg"
            >
              {language === 'ar' ? activeRealm.titleAr : activeRealm.titleEn}
            </motion.h1>
          </AnimatePresence>

          {/* Signature Coral Accent Rule */}
          <div className="w-24 h-1.5 bg-gradient-to-r from-coral-500 via-gold-400 to-teal-400 rounded-full mx-auto shadow-glow-coral" />
        </div>

        {/* Localized Atmospheric Description */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`desc-${activeRealm.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="text-sm sm:text-base md:text-lg text-pearl-muted font-medium max-w-2xl leading-relaxed"
          >
            {language === 'ar' ? activeRealm.taglineAr : activeRealm.taglineEn}
          </motion.p>
        </AnimatePresence>

        {/* Live Weather & SAR Status Pill */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs sm:text-sm font-bold text-pearl">
          <div className="px-3.5 py-1.5 rounded-xl bg-abyss-900/90 border border-white/10 backdrop-blur-md flex items-center gap-1.5 text-teal-300">
            <Sun className="w-4 h-4 text-gold-400" />
            <span>{language === 'ar' ? activeRealm.weatherAr : activeRealm.weatherEn}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-abyss-900/90 border border-white/10 backdrop-blur-md flex items-center gap-1.5 text-gold-400">
            <Coins className="w-4 h-4" />
            <span>{language === 'ar' ? activeRealm.budgetLabelAr : activeRealm.budgetLabelEn}</span>
          </div>
        </div>

        {/* 3. Primary Glossy CTA Button */}
        <div className="pt-2 sm:pt-4 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleStartPlan}
            className="w-full sm:w-auto min-h-[54px] px-9 py-4 rounded-2xl bg-coral-500 hover:bg-coral-600 active:bg-coral-700 text-white font-black text-sm sm:text-base shadow-glow-coral hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer touch-manipulation"
          >
            <Sparkles className="w-5 h-5 text-gold-300 animate-pulse" />
            <span>{language === 'ar' ? '✨ ابنِ خطتي في جدة بنقرة واحدة' : '✨ Build My Jeddah Plan in 1 Click'}</span>
            {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </button>
        </div>

        {/* 4. Interactive 3-Way Portal Cut-Out Badges (Switchers) */}
        <div className="w-full pt-6 sm:pt-10 border-t border-white/10">
          <span className="text-[11px] sm:text-xs font-black text-pearl-muted uppercase tracking-wider block mb-4">
            {language === 'ar' ? '⚡ تنقّل فورياً بين عوالم وتجارب جدة الثلاث:' : '⚡ Instant 3-Way Experience Switcher:'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-4xl mx-auto">
            {realmKeys.map((k) => {
              const r = JEDDAH_REALMS[k];
              const isSelected = k === activeRealmId;
              const Icon = r.icon;

              return (
                <div
                  key={k}
                  onClick={() => handleSelectRealm(k)}
                  className={`min-h-[64px] p-3.5 sm:p-4 rounded-2xl border text-start cursor-pointer transition-all duration-200 touch-manipulation active:scale-[0.97] relative overflow-hidden group ${
                    isSelected
                      ? 'bg-abyss-800/95 border-gold-400 ring-2 ring-gold-400/50 shadow-glow-gold scale-[1.02]'
                      : 'bg-abyss-950/80 hover:bg-abyss-900 border-white/10 hover:border-gold-400/40 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${r.accentColor}25`,
                        color: r.accentColor,
                        borderColor: `${r.accentColor}40`,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-black text-pearl truncate">
                          {language === 'ar' ? r.titleAr : r.titleEn}
                        </h4>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-gold-400 shadow-glow-gold shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-pearl-muted truncate mt-0.5 font-medium">
                        {language === 'ar' ? r.budgetLabelAr : r.budgetLabelEn}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
