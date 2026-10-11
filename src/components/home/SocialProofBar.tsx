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
import { BorderBeam } from '@/components/fancy/BorderBeam';

import testimonialsData from '@/data/testimonials.json';

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

const TESTIMONIALS: TestimonialCapsule[] = testimonialsData as TestimonialCapsule[];

export const SocialProofBar: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="relative w-full rounded-3xl bg-[#0E1118]/80 backdrop-blur-2xl border border-[#E5C378]/30 shadow-[0_16px_50px_rgba(0,0,0,0.85)] p-4 sm:p-6 space-y-4 overflow-hidden">
      {/* Animated Traveling Border Laser Beam */}
      <BorderBeam size={320} duration={14} borderWidth={1.2} colorFrom="#E5C378" colorTo="#F5E2B3" />

      {/* Top Specular Rim Light */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#E5C378]/30 to-transparent pointer-events-none" />

      {/* 1. LIVE ACTIVE METRICS STRIP */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 text-xs">
        {/* Live Active Travelers */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5C378] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E5C378]" />
          </span>
          <span className="font-black text-white flex items-center gap-1">
            <NumberTicker value={142} suffix="+" />
            <span>{language === 'ar' ? 'يخططون لطلعتهم الآن في جدة' : 'Exploring Jeddah Outings Right Now'}</span>
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#E5C378]/15 text-[#F5E2B3] font-bold border border-[#E5C378]/35 shadow-[0_0_10px_rgba(229,195,120,0.25)]">
            {language === 'ar' ? 'مباشر' : 'Live'}
          </span>
        </div>

        {/* Aggregate Credibility Badges */}
        <div className="hidden sm:flex items-center gap-4 text-slate-300 text-[11px] font-bold">
          <span className="flex items-center gap-1.5 text-white/90">
            <TrendingUp className="w-3.5 h-3.5 text-[#E5C378]" />
            <NumberTicker value={12500} prefix="+" />
            <span>{language === 'ar' ? 'مسار استكشفه الزوار' : 'Routes Explored'}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-white/90">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>{language === 'ar' ? 'تقدير تقريبي للميزانية بالريال 🇸🇦' : 'Realistic SAR Budget Estimate 🇸🇦'}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-[#E5C378]">
            <Star className="w-3 h-3 fill-[#E5C378]" />
            <span className="font-black">4.9/5</span>
            <span className="text-white/60 font-medium">({language === 'ar' ? 'نماذج استطلاعية توضيحية' : 'Sample Reviews'})</span>
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
              className="flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-[#131722]/70 hover:bg-[#1A1F2C]/90 border border-white/[0.08] hover:border-[#E5C378]/40 backdrop-blur-md shadow-lg transition-all duration-300 shrink-0 max-w-sm sm:max-w-md select-none group cursor-default"
            >
              {/* Avatar Emoji */}
              <div className="w-10 h-10 rounded-xl bg-[#E5C378]/10 border border-[#E5C378]/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                {t.avatar}
              </div>

              {/* Review Content */}
              <div className="space-y-1 min-w-0 text-start">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white">
                      {language === 'ar' ? t.nameAr : t.nameEn}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      • {language === 'ar' ? t.locationAr : t.locationEn}
                    </span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#E5C378]/15 text-[#F5E2B3] font-bold border border-[#E5C378]/30 shrink-0">
                    {language === 'ar' ? t.tagAr : t.tagEn}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 font-medium leading-relaxed line-clamp-2">
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
