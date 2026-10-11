'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Users,
  Zap,
  ShieldCheck,
  Star,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { NumberTicker } from '@/components/fancy/NumberTicker';
import { RandomLetterSwap } from '@/components/fancy/RandomLetterSwap';
import { BorderBeam } from '@/components/fancy/BorderBeam';

interface TestimonialCapsule {
  id: string;
  nameAr: string;
  nameEn: string;
  locationAr: string;
  locationEn: string;
  quoteAr: string;
  quoteEn: string;
  avatar: string;
  tagAr: string;
  tagEn: string;
  rating: number;
}

const TESTIMONIALS: TestimonialCapsule[] = [
  {
    id: 't1',
    nameAr: 'ريان السلمي',
    nameEn: 'Rayan Al-Sulami',
    locationAr: 'أبحر الشمالية',
    locationEn: 'North Obhur',
    quoteAr: 'طلعة أبحر كانت خيالية بدون أي زحمة، توقيت الغروب في نادي اليخوت كان بالميلي! 🌊',
    quoteEn: 'Obhur outing was surreal without traffic, golden hour at Yacht Club was spot on! 🌊',
    avatar: '👨🏻‍💼',
    tagAr: 'مسار اليخوت والغروب',
    tagEn: 'Yacht & Sunset Track',
    rating: 5,
  },
  {
    id: 't2',
    nameAr: 'سارة الحربي',
    nameEn: 'Sarah Al-Harbi',
    locationAr: 'البلد التاريخية',
    locationEn: 'Historic Al-Balad',
    quoteAr: 'توفير وقت حقيقي في أزقة البلد التاريخية وتيم لاب، رتبنا اليوم بضغطة زر 🏛️',
    quoteEn: 'Real time saver for UNESCO Balad and teamLab, planned in one click 🏛️',
    avatar: '👩🏻‍💻',
    tagAr: 'تراث وفنون اليونسكو',
    tagEn: 'UNESCO Arts & Heritage',
    rating: 5,
  },
  {
    id: 't3',
    nameAr: 'فيصل الغامدي',
    nameEn: 'Faisal Al-Ghamdi',
    locationAr: 'حي الروضة',
    locationEn: 'Al-Rawdah',
    quoteAr: 'حساب الميزانية طلع بالريال بالضبط شامل العشاء وتكلفة أوبر، أسطوري 💰',
    quoteEn: 'Exact SAR budget breakdown including dinner and Uber, absolutely legendary 💰',
    avatar: '👨🏽‍💼',
    tagAr: 'دقة الميزانية 100%',
    tagEn: '100% SAR Accuracy',
    rating: 5,
  },
  {
    id: 't4',
    nameAr: 'نورة الشريف',
    nameEn: 'Noura Al-Sharif',
    locationAr: 'التحلية والروضة',
    locationEn: 'Tahlia & Rawdah',
    quoteAr: 'أفضل محامص القهوة المختصة والمطاعم الراقية في جدول واحد سلس ورايق ☕',
    quoteEn: 'The best specialty roasteries and gourmet dining in one seamless plan ☕',
    avatar: '👩🏼‍🎨',
    tagAr: 'عشاق القهوة المختصة',
    tagEn: 'Specialty Coffee Lovers',
    rating: 5,
  },
  {
    id: 't5',
    nameAr: 'ماجد القرني',
    nameEn: 'Majed Al-Qarni',
    locationAr: 'الكورنيش الشمالي',
    locationEn: 'North Corniche',
    quoteAr: 'جدول عائلي مريح جداً للأطفال، دمج الكورنيش مع ملاهي الشلال كان تجربة ممتازة 👨‍👩‍👧‍👦',
    quoteEn: 'Super comfortable family schedule with kids, blending Corniche with theme park 👨‍👩‍👧‍👦',
    avatar: '👨🏻‍🦱',
    tagAr: 'طلعة عائلية متكاملة',
    tagEn: 'Curated Family Plan',
    rating: 5,
  },
];

export const SocialProofBar: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="relative w-full rounded-3xl bg-[#0A0E15]/85 backdrop-blur-2xl border border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.6)] p-4 sm:p-6 space-y-4 overflow-hidden">
      {/* Animated Traveling Border Laser Beam */}
      <BorderBeam size={280} duration={14} borderWidth={1.2} colorFrom="#E5A962" colorTo="#10B981" />

      {/* Top Specular Rim Light */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold-400/30 to-transparent pointer-events-none" />

      {/* 1. LIVE ACTIVE METRICS STRIP */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 text-xs">
        {/* Live Active Travelers */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          <span className="font-black text-white flex items-center gap-1">
            <NumberTicker value={842} suffix="+" />
            <span>{language === 'ar' ? 'يخططون لطلعتهم الآن في جدة' : 'Planning Outings in Jeddah Right Now'}</span>
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
            {language === 'ar' ? 'مباشر' : 'Live'}
          </span>
        </div>

        {/* Aggregate Credibility Badges */}
        <div className="hidden sm:flex items-center gap-4 text-pearl-muted text-[11px] font-bold">
          <span className="flex items-center gap-1.5 text-white/90">
            <TrendingUp className="w-3.5 h-3.5 text-gold-400" />
            <NumberTicker value={50000} prefix="+" />
            <span>{language === 'ar' ? 'طلعة تم توليدها' : 'Outings Generated'}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-white/90">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>{language === 'ar' ? 'دقة الميزانية بالريال 🇸🇦' : '100% SAR Budget Accuracy'}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-gold-400">
            <Star className="w-3 h-3 fill-gold-400" />
            <span className="font-black">4.9/5</span>
            <span className="text-pearl-muted font-medium">(2,400+ تقييم)</span>
          </span>
        </div>
      </div>

      {/* 2. INFINITE STREAMING LUXURY GLASS MARQUEE */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] py-1">
        <motion.div
          animate={{ x: language === 'ar' ? ['0%', '50%'] : ['0%', '-50%'] }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex items-center gap-4 w-max"
        >
          {/* Double array for seamless loop */}
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, idx) => (
            <div
              key={`${t.id}-${idx}`}
              className="flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] hover:border-gold-500/40 backdrop-blur-md shadow-lg transition-all duration-300 shrink-0 max-w-sm sm:max-w-md select-none group cursor-default"
            >
              {/* Avatar Emoji */}
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                {t.avatar}
              </div>

              {/* Review Content */}
              <div className="space-y-1 min-w-0 text-start">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white">
                      <RandomLetterSwap label={language === 'ar' ? t.nameAr : t.nameEn} />
                    </span>
                    <span className="text-[10px] text-pearl-muted font-medium">
                      • {language === 'ar' ? t.locationAr : t.locationEn}
                    </span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gold-500/15 text-gold-300 font-bold border border-gold-500/30 shrink-0">
                    {language === 'ar' ? t.tagAr : t.tagEn}
                  </span>
                </div>

                <p className="text-[11px] text-pearl-muted font-medium leading-relaxed line-clamp-2">
                  "{language === 'ar' ? t.quoteAr : t.quoteEn}"
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SocialProofBar;
