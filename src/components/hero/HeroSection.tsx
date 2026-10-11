'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Compass,
  ArrowLeft,
  Sparkles,
  Waves,
  Coffee,
  Landmark,
  Footprints,
  Volume2,
  VolumeX,
  Play,
  Pause,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useItineraryStore } from '@/store/useItineraryStore';
import { useLanguage } from '@/hooks/useLanguage';
import { soundEngine } from '@/utils/audioEngine';
import { getAssetUrl } from '@/utils/paths';
import { getJeddahAtmosphere } from '@/utils/atmosphereEngine';
import { RawashinPattern } from '@/components/ui/RawashinPattern';
import { DistrictId, CompanionType, BudgetTier, DurationOption, VibeType } from '@/types';

interface MoodChip {
  id: string;
  labelAr: string;
  labelEn: string;
  icon: React.ElementType;
  district: DistrictId;
  vibe: VibeType;
  budget: BudgetTier;
  duration: DurationOption;
  companions: CompanionType;
}

const HERO_MOOD_CHIPS: MoodChip[] = [
  {
    id: 'sunset_beach',
    labelAr: 'بحر وغروب',
    labelEn: 'Beach & Sunset',
    icon: Waves,
    district: 'obhur',
    vibe: 'beach_sunset',
    budget: 'moderate',
    duration: '4_to_6h',
    companions: 'friends',
  },
  {
    id: 'specialty_coffee',
    labelAr: 'قهوة وروقان',
    labelEn: 'Coffee & Chill',
    icon: Coffee,
    district: 'al-rawdah',
    vibe: 'coffee_dessert',
    budget: 'moderate',
    duration: 'under_2h',
    companions: 'solo',
  },
  {
    id: 'balad_heritage',
    labelAr: 'أزقة وتراث البلد',
    labelEn: 'Historic Al-Balad',
    icon: Landmark,
    district: 'al-balad',
    vibe: 'heritage_arts',
    budget: 'economy',
    duration: '2_to_4h',
    companions: 'family',
  },
  {
    id: 'luxury_vip',
    labelAr: 'سهرة فاخرة VIP',
    labelEn: 'Luxury VIP Night',
    icon: Sparkles,
    district: 'al-shati',
    vibe: 'food',
    budget: 'premium',
    duration: 'half_day_night',
    companions: 'couples',
  },
  {
    id: 'free_scenic',
    labelAr: 'ممشى وطبيعة مجانية',
    labelEn: 'Free Scenic Walk',
    icon: Footprints,
    district: 'al-shati',
    vibe: 'free_walk',
    budget: 'free',
    duration: '2_to_4h',
    companions: 'friends',
  },
];

export const HeroSection: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Store Bindings
  const updateWizardPreferences = useItineraryStore((state) => state.updateWizardPreferences);
  const generatePlanFromPreferences = useItineraryStore((state) => state.generatePlanFromPreferences);
  const setWizardStep = useItineraryStore((state) => state.setWizardStep);
  const setActiveNavTab = useItineraryStore((state) => state.setActiveNavTab);
  const atmospherePhase = useItineraryStore((state) => state.atmospherePhase);
  const atmosphere = getJeddahAtmosphere(atmospherePhase);

  // Local State
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedMoodId, setSelectedMoodId] = useState<string>('sunset_beach');

  // Parallax subtle scroll offset
  const { scrollYProgress } = useScroll({
    target: heroContainerRef,
    offset: ['start start', 'end start'],
  });
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);

  // Video Autoplay & Lifecycle Guardrails
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    if (prefersReducedMotion) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    const tryPlay = () => {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsVideoLoaded(true);
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay policy prevented playback until gesture
          });
      }
    };

    tryPlay();

    const handleEnded = () => {
      video.currentTime = 0;
      tryPlay();
    };
    video.addEventListener('ended', handleEnded);

    // Fallback gesture unlock for mobile browsers
    const unlockOnGesture = () => {
      if (video.paused) {
        video.muted = true;
        video.play().then(() => {
          setIsVideoLoaded(true);
          setIsPlaying(true);
        }).catch(() => {});
      }
      window.removeEventListener('pointerdown', unlockOnGesture);
      window.removeEventListener('touchstart', unlockOnGesture);
      window.removeEventListener('scroll', unlockOnGesture);
    };

    window.addEventListener('pointerdown', unlockOnGesture, { passive: true });
    window.addEventListener('touchstart', unlockOnGesture, { passive: true });
    window.addEventListener('scroll', unlockOnGesture, { passive: true });

    return () => {
      video.removeEventListener('ended', handleEnded);
      window.removeEventListener('pointerdown', unlockOnGesture);
      window.removeEventListener('touchstart', unlockOnGesture);
      window.removeEventListener('scroll', unlockOnGesture);
    };
  }, []);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playClick();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playClick();
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleSelectMood = (mood: MoodChip) => {
    soundEngine.playClick();
    setSelectedMoodId(mood.id);
    updateWizardPreferences({
      startingDistrict: mood.district,
      vibe: mood.vibe,
      budgetTier: mood.budget,
      duration: mood.duration,
      companions: mood.companions,
    });
  };

  const handleStartPlanning = () => {
    soundEngine.playSuccess();
    const activeMood = HERO_MOOD_CHIPS.find((m) => m.id === selectedMoodId) || HERO_MOOD_CHIPS[0];
    updateWizardPreferences({
      startingDistrict: activeMood.district,
      vibe: activeMood.vibe,
      budgetTier: activeMood.budget,
      duration: activeMood.duration,
      companions: activeMood.companions,
    });
    setWizardStep(1);
    setActiveNavTab('quick-plan');
  };

  const handleQuickGenerate = () => {
    soundEngine.playSuccess();
    const activeMood = HERO_MOOD_CHIPS.find((m) => m.id === selectedMoodId) || HERO_MOOD_CHIPS[0];
    updateWizardPreferences({
      startingDistrict: activeMood.district,
      vibe: activeMood.vibe,
      budgetTier: activeMood.budget,
      duration: activeMood.duration,
      companions: activeMood.companions,
    });
    generatePlanFromPreferences();
  };

  // Word-by-word staggered reveal animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      ref={heroContainerRef}
      className="relative w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden select-none border border-[var(--border-subtle)] shadow-[var(--shadow-card)] bg-[var(--bg-base)] min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center justify-center p-4 sm:p-8 lg:p-12"
      aria-label="Jadawel Hero Showcase"
    >
      {/* 1. ATMOSPHERIC PARALLAX CANVAS & SCENIC OVERLAY */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Ambient Video with Parallax & Graceful Poster Fallback */}
        <motion.div style={{ y: videoY }} className="w-full h-[120%] -top-[10%] absolute inset-x-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={getAssetUrl('/images/places/indigo-beach.jpg')}
            className="w-full h-full object-cover brightness-[0.88] contrast-[1.14] saturate-[1.08]"
          >
            <source src={getAssetUrl('/videos/jeddah-sunset.webm')} type="video/webm" />
            <source src={getAssetUrl('/videos/jeddah-waves.webm')} type="video/webm" />
            <source src={getAssetUrl('/videos/jeddah-corniche.mp4')} type="video/mp4" />
          </video>
        </motion.div>

        {/* Authentic Hijazi Rawasheen Decorative Watermark (< 1.5KB, 3% Opacity) */}
        <RawashinPattern className="text-[var(--accent-gold)]" opacity={0.03} />

        {/* Cinematic Scrim: Let the video and sea scenery shine while keeping text legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] via-[var(--bg-base)]/40 to-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(8,11,17,0.65)_100%)] pointer-events-none" />
      </div>

      {/* 2. TOP CORNER CONTROLS (Atmosphere Tag & Video Playback Controls) */}
      <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 z-20 flex items-center justify-between pointer-events-auto">
        {/* Atmosphere & Weather Live Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-surface)]/85 border border-[var(--border-gold)] text-xs font-semibold text-[var(--text-heading)] shadow-sm backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <Compass className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
          <span className="text-[11px] sm:text-xs">
            {language === 'ar'
              ? `جدة • ${atmosphere.phaseNameAr} (${atmosphere.temperatureC}°م)`
              : `Jeddah • ${atmosphere.phaseNameEn} (${atmosphere.temperatureC}°C)`}
          </span>
        </div>

        {/* Video Play / Mute Floating Glass Controls */}
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-[var(--bg-surface)]/85 border border-[var(--border-subtle)] backdrop-blur-md shadow-sm">
          <button
            type="button"
            onClick={handleToggleMute}
            className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              !isMuted ? 'text-[var(--accent-gold)] bg-[var(--accent-gold-soft)]' : 'text-slate-300 hover:text-white'
            }`}
            title={isMuted ? (language === 'ar' ? 'تشغيل صوت البحر' : 'Unmute') : (language === 'ar' ? 'كتم الصوت' : 'Mute')}
            aria-label="Toggle Video Sound"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[var(--accent-gold)] animate-pulse" />}
            <span className="text-[11px] font-bold">{isMuted ? (language === 'ar' ? 'صوت البحر' : 'Sound') : (language === 'ar' ? 'شغّال' : 'Playing')}</span>
          </button>

          <button
            type="button"
            onClick={handleTogglePlay}
            className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isPlaying ? 'text-teal-300 bg-teal-500/10' : 'text-slate-300 hover:text-white'
            }`}
            title={isPlaying ? (language === 'ar' ? 'إيقاف الفيديو' : 'Pause Video') : (language === 'ar' ? 'تشغيل فيديو جدة' : 'Play Video')}
            aria-label="Toggle Video Playback"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-teal-400" /> : <Play className="w-3.5 h-3.5 text-[var(--accent-gold)]" />}
            <span className="text-[11px] font-bold">{isPlaying ? (language === 'ar' ? 'فيديو جدة' : 'Video') : (language === 'ar' ? 'تشغيل' : 'Play')}</span>
          </button>
        </div>
      </div>

      {/* 3. HERO CONTENT CONTAINER (FOCAL POINT & EDITORIAL HIERARCHY) */}
      <motion.div
        style={{ y: contentY }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center py-10 sm:py-14 space-y-6 sm:space-y-8"
      >
        {/* Curated Subtitle Pill */}
        <motion.div variants={itemVariants} className="inline-block">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-gold-soft)] border border-[var(--border-gold)] text-xs font-bold text-[var(--text-gold)] tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span>{language === 'ar' ? 'المخطط الذكي لطلعات ورحلات عروس البحر الأحمر' : 'Smart Curated Jeddah Itinerary Engine'}</span>
          </span>
        </motion.div>

        {/* Master Staggered Headline (Apple Keynote Simplicity) */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.25] sm:leading-[1.2] max-w-3xl"
        >
          {language === 'ar' ? (
            <>
              <span className="block text-white font-bold">
                عروس البحر الأحمر بين يديك..
              </span>
              <span className="block mt-2 font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F5E2B3] via-[#E5C378] to-[#C8A452]">
                جداول ترتّب طلعتك من وإلى
              </span>
            </>
          ) : (
            <>
              <span className="block text-white font-bold">
                The Red Sea Bride in Your Hands..
              </span>
              <span className="block mt-2 font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F5E2B3] via-[#E5C378] to-[#C8A452]">
                Jadawel Crafts Your Outing End-to-End
              </span>
            </>
          )}
        </motion.h1>

        {/* Refined Descriptive Copy */}
        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl mx-auto font-normal leading-relaxed text-balance"
        >
          {language === 'ar'
            ? 'من نوادي وشواطئ أبحر إلى أزقة البلد العتيقة — اختر مودك وميزانيتك، وسننسّق لك مساراً سينمائياً متكاملاً بدقة متناهية.'
            : 'From Obhur beach clubs to historic Al-Balad alleys — choose your vibe and budget, and let our engine orchestrate a seamless luxury itinerary.'}
        </motion.p>

        {/* Curated Mood Chips (Unified SVG Icons, Smooth Highlights) */}
        <motion.div
          variants={itemVariants}
          className="w-full flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2"
        >
          {HERO_MOOD_CHIPS.map((chip) => {
            const isSelected = selectedMoodId === chip.id;
            const Icon = chip.icon;

            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleSelectMood(chip)}
                className={`min-h-[42px] px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer touch-manipulation active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#DF9F3D] to-[#E5C378] text-[#090C12] font-black shadow-[var(--shadow-gold-glow)] scale-[1.02]'
                    : 'bg-[#101522]/90 hover:bg-[#161D2E] text-slate-200 hover:text-white border border-white/10 hover:border-[var(--accent-gold-border)]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#090C12]' : 'text-[var(--accent-gold)]'}`} />
                <span>{language === 'ar' ? chip.labelAr : chip.labelEn}</span>
              </button>
            );
          })}
        </motion.div>

        {/* 4. SINGLE DOMINANT HERO CTA BUTTON (PULSING GOLD AURA) */}
        <motion.div
          variants={itemVariants}
          className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto"
        >
          {/* Main Pulsing Golden CTA */}
          <div className="relative w-full sm:w-auto group">
            {/* Ambient Pulsing Glow Aura */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] opacity-70 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-300 animate-pulse" />

            <button
              type="button"
              onClick={handleStartPlanning}
              className="relative w-full sm:w-auto min-h-[52px] px-8 sm:px-10 py-3.5 rounded-2xl bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] text-[#080B11] font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_12px_32px_rgba(229,195,120,0.45)] hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer touch-manipulation"
            >
              <span>{language === 'ar' ? 'اصنع خطتك الآن' : 'Start Planning Now'}</span>
              <ArrowLeft className="w-4 h-4 text-[#080B11] group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Secondary Quick Action */}
          <button
            type="button"
            onClick={handleQuickGenerate}
            className="w-full sm:w-auto min-h-[52px] px-6 py-3 rounded-2xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-gold)] text-slate-200 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer touch-manipulation active:scale-[0.98]"
          >
            <Compass className="w-4 h-4 text-[var(--accent-gold)]" />
            <span>{language === 'ar' ? 'توليد مسار فوري ⚡' : 'Instant 1-Click Plan ⚡'}</span>
          </button>
        </motion.div>

        {/* Micro Guarantee Label */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-4 text-[11px] sm:text-xs text-slate-400 font-medium pt-1"
        >
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span>{language === 'ar' ? 'مسار جغرافي متصل' : 'Connected geographic track'}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span>{language === 'ar' ? 'حساب دقيق للميزانية والتنقل' : 'Real budget & transit estimates'}</span>
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
