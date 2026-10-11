'use client';

import React, { useRef, useState } from 'react';
import {
  Waves,
  Flame,
  Compass,
  Coffee,
  Landmark,
  Gamepad2,
  ArrowLeft,
  ArrowRight,
  Wind,
  Star,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { soundEngine } from '@/utils/audioEngine';
import { getAssetUrl } from '@/utils/paths';
import { BorderBeam } from '@/components/fancy/BorderBeam';

interface BentoTiltCardProps {
  colSpanClass: string;
  minHeightClass: string;
  imageSrc: string;
  badgeNode: React.ReactNode;
  title: string;
  description: string;
  actionText: string;
  accentColorClass: string;
  borderColorHoverClass: string;
  hasBorderBeam?: boolean;
  onClick: () => void;
}

const BentoTiltCard: React.FC<BentoTiltCardProps> = ({
  colSpanClass,
  minHeightClass,
  imageSrc,
  badgeNode,
  title,
  description,
  actionText,
  accentColorClass,
  borderColorHoverClass,
  hasBorderBeam = false,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { isRTL } = useLanguage();
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, isHovered: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = x / rect.width - 0.5;
    const normY = y / rect.height - 0.5;
    setTilt({
      x: normY * -8,
      y: normX * 8,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50, isHovered: false });
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${
          tilt.isHovered ? 'scale3d(1.02, 1.02, 1.02)' : 'scale3d(1, 1, 1)'
        }`,
        transition: tilt.isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
      }}
      className={`relative group ${colSpanClass} ${minHeightClass} rounded-[2rem] overflow-hidden border border-white/10 ${borderColorHoverClass} transition-colors duration-300 cursor-pointer shadow-[0_16px_40px_rgba(0,0,0,0.6)] select-none`}
    >
      {hasBorderBeam && (
        <BorderBeam size={320} duration={12} borderWidth={1.5} colorFrom="#2DD4BF" colorTo="#E5A962" />
      )}

      {/* Background Image with Cinematic Zoom */}
      <img
        src={imageSrc}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 brightness-[0.7]"
      />

      {/* Atmospheric Multi-layer Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080B10] via-[#080B10]/55 to-transparent transition-opacity group-hover:opacity-85" />

      {/* Top Specular Rim Light */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Dynamic Specular Glare Tracking Cursor */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: tilt.isHovered ? 0.35 : 0,
          background: `radial-gradient(circle 260px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.45), transparent 70%)`,
        }}
      />

      {/* Floating Badge (Top Left/Start) */}
      <div className="absolute top-5 start-5 z-10">{badgeNode}</div>

      {/* Bottom Content Area */}
      <div className="absolute bottom-6 inset-x-6 z-10 space-y-2 text-start">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white drop-shadow-md flex items-center gap-2">
          <span>{title}</span>
        </h3>
        <p className="text-xs sm:text-sm text-pearl-muted font-medium leading-relaxed max-w-xl">
          {description}
        </p>
        <div className={`pt-1 flex items-center gap-2 text-xs font-bold ${accentColorClass}`}>
          <span>{actionText}</span>
          {isRTL ? (
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          ) : (
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          )}
        </div>
      </div>
    </div>
  );
};

export const BentoMoodGrid: React.FC = () => {
  const { language } = useLanguage();
  const updateWizardPreferences = useItineraryStore((state) => state.updateWizardPreferences);
  const setActiveNavTab = useItineraryStore((state) => state.setActiveNavTab);
  const setWizardStep = useItineraryStore((state) => state.setWizardStep);

  const handleMoodSelect = (vibe: any) => {
    soundEngine.playClick();
    updateWizardPreferences({ vibe });
    setWizardStep(1);
    setActiveNavTab('quick-plan');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="space-y-6 my-8 text-start">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-xs font-black shadow-[0_0_12px_rgba(229,169,98,0.2)]">
            <Compass className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'مود اليوم وش جوك؟' : 'What is your vibe today?'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
            {language === 'ar' ? 'استكشف جدة حسب المزاج والطلعة' : 'Explore Jeddah by Mood & Vibe'}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-pearl-muted font-medium max-w-md leading-relaxed">
          {language === 'ar'
            ? 'انقر على أي بطاقة لتوليد مسار ذكي مخصص فوراً متوافق مع جوك وميزانيتك'
            : 'Click any mood category to automatically tailor your bespoke Jeddah outing'}
        </p>
      </div>

      {/* Asymmetrical Bento Grid with 3D Tilt Physics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
        {/* 1. Large Hero Bento Cell: Beaches & Sunset (7 Cols) */}
        <BentoTiltCard
          colSpanClass="md:col-span-7"
          minHeightClass="min-h-[300px] md:min-h-[360px]"
          hasBorderBeam={true}
          imageSrc={getAssetUrl('/images/moods/mood-beach.jpg')}
          onClick={() => handleMoodSelect('beach_sunset')}
          accentColorClass="text-teal-300"
          borderColorHoverClass="hover:border-teal-400/60"
          badgeNode={
            <span className="px-3.5 py-1.5 rounded-xl bg-teal-500/80 backdrop-blur-md text-white text-xs font-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(45,212,191,0.35)] border border-teal-300/40">
              <Wind className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'نسيم البحر • روقان الغروب 🌊' : 'Sea Breeze • Sunset Vibe 🌊'}</span>
            </span>
          }
          title={language === 'ar' ? 'شواطئ وغروب بحري 🌊' : 'Beach Clubs & Sunsets 🌊'}
          description={
            language === 'ar'
              ? 'منتجعات أبحر الشاطئية، جلسات ممشى الكورنيش الشمالي، ونوادي اليخوت الفارهة مع نسيم البحر الأحمر.'
              : 'Obhur private beach clubs, North Corniche walkways, and luxury yacht marinas with sunset views.'
          }
          actionText={language === 'ar' ? 'عرض وتوليد المسارات البحرية' : 'View Coastal Plans'}
        />

        {/* 2. Secondary Bento Cell: Cafes & Fine Dining (5 Cols) */}
        <BentoTiltCard
          colSpanClass="md:col-span-5"
          minHeightClass="min-h-[300px] md:min-h-[360px]"
          imageSrc={getAssetUrl('/images/moods/mood-food.jpg')}
          onClick={() => handleMoodSelect('food')}
          accentColorClass="text-gold-300"
          borderColorHoverClass="hover:border-gold-400/60"
          badgeNode={
            <span className="px-3.5 py-1.5 rounded-xl bg-gold-500/90 backdrop-blur-md text-abyss-950 text-xs font-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(229,169,98,0.35)] border border-gold-300/40">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'ar' ? 'أعلى تقييماً 4.9 ★' : 'Top Rated 4.9 ★'}</span>
            </span>
          }
          title={language === 'ar' ? 'مطاعم ومحامص رايقة ☕' : 'Dining & Roasteries ☕'}
          description={
            language === 'ar'
              ? 'محامص القهوة المختصة في الروضة، وأرقى جلسات العشاء العالمية في التحلية والشاطئ.'
              : 'Specialty coffee roasteries in Al-Rawdah and premier gourmet dining in Tahlia.'
          }
          actionText={language === 'ar' ? 'استكشف وجهات القهوة والتذوق' : 'Explore Dining Tracks'}
        />

        {/* 3. Bento Cell: UNESCO Heritage (6 Cols) */}
        <BentoTiltCard
          colSpanClass="md:col-span-6"
          minHeightClass="min-h-[260px] md:min-h-[300px]"
          imageSrc={getAssetUrl('/images/moods/mood-heritage.jpg')}
          onClick={() => handleMoodSelect('heritage_arts')}
          accentColorClass="text-amber-300"
          borderColorHoverClass="hover:border-amber-400/60"
          badgeNode={
            <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/80 backdrop-blur-md text-white text-xs font-black flex items-center gap-1.5 border border-amber-300/40 shadow-sm">
              <Landmark className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تراث اليونسكو 🏛️' : 'UNESCO Heritage 🏛️'}</span>
            </span>
          }
          title={language === 'ar' ? 'تراث وأزقة البلد العتيقة 🏛️' : 'Historic Al-Balad Trail 🏛️'}
          description={
            language === 'ar'
              ? 'بيوت الرواشين الخشبية، بسطات الشاي الحجازي بالنعناع، والأسواق الشعبية الساحرة.'
              : 'Rawashin stone houses, historic Hijazi tea squares, and traditional souqs.'
          }
          actionText={language === 'ar' ? 'انطلق في مسار التراث' : 'Explore Heritage Trail'}
        />

        {/* 4. Bento Cell: Entertainment & Adrenaline (6 Cols) */}
        <BentoTiltCard
          colSpanClass="md:col-span-6"
          minHeightClass="min-h-[260px] md:min-h-[300px]"
          imageSrc={getAssetUrl('/images/moods/mood-gaming.jpg')}
          onClick={() => handleMoodSelect('gaming_challenges')}
          accentColorClass="text-rose-300"
          borderColorHoverClass="hover:border-rose-400/60"
          badgeNode={
            <span className="px-3.5 py-1.5 rounded-xl bg-rose-500/80 backdrop-blur-md text-white text-xs font-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(244,63,94,0.35)] border border-rose-300/40">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'طاقة وحماس 🎯' : 'Action & Challenges 🎯'}</span>
            </span>
          }
          title={language === 'ar' ? 'تحديات وفعاليات حماسية 🎯' : 'Gaming, Bowling & Fun 🎯'}
          description={
            language === 'ar'
              ? 'حلبات الكارتينج، صالات البولينج والسينما، ومراكز الترفيه الجماعي للشلة والعائلة.'
              : 'Karting circuits, bowling lounges, indie cinemas, and group games.'
          }
          actionText={language === 'ar' ? 'خطط لطلعة حماسية' : 'Plan Action Outing'}
        />
      </div>
    </section>
  );
};

export default BentoMoodGrid;
