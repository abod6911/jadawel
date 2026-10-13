'use client';

import React from 'react';
import {
  MapPin,
  Users,
  Zap,
  ShieldCheck,
  Star,
  Sparkles,
  TrendingUp,
  Check,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { NumberTicker } from '@/components/fancy/NumberTicker';
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

  const getMonogram = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}.${parts[1][0]}`;
    }
    return name.slice(0, 2);
  };

  return (
    <div className="rounded-3xl p-5 sm:p-7 bg-[#0E131A]/80 backdrop-blur-xl border border-white/10 border-t-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6 select-none text-start relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#E5C378]/5 rounded-full blur-3xl pointer-events-none" />

      {/* 1. LIVE ACTIVE METRICS STRIP WITH REAL-TIME PULSE */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-white/[0.08] pb-5">
        {/* Live Active Travelers */}
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          <span className="font-bold text-white flex items-center gap-1">
            <NumberTicker value={142} suffix="+" />
            <span>{language === 'ar' ? 'يخططون لطلعتهم الآن في جدة' : 'Exploring Outings Right Now'}</span>
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-black border border-emerald-500/30">
            {language === 'ar' ? 'مباشر • Live' : 'Live'}
          </span>
        </div>

        {/* Live Ticker Capsule */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[11px] text-slate-300">
          <Sparkles className="w-3 h-3 text-[#E5C378]" />
          <span>
            {language === 'ar'
              ? 'آخر مسار نشط: كافيهات الروضة والبلد (قبل 3 دقائق)'
              : 'Latest Route: Al-Rawdah & Balad (3m ago)'}
          </span>
        </div>

        {/* Aggregate Credibility Badges */}
        <div className="hidden sm:flex items-center gap-4 text-slate-400 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-slate-300">
            <TrendingUp className="w-3.5 h-3.5 text-[#E5C378]" />
            <NumberTicker value={12500} prefix="+" />
            <span>{language === 'ar' ? 'مسار استكشفه الزوار' : 'Routes Explored'}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>{language === 'ar' ? 'تقدير دقيق للميزانية 🇸🇦' : 'Realistic SAR Budget 🇸🇦'}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-[#E5C378]">
            <Star className="w-3.5 h-3.5 fill-[#E5C378]" />
            <span className="font-bold text-white">4.9/5</span>
            <span className="text-slate-400 font-normal">({language === 'ar' ? 'آراء موثقة' : 'Verified Reviews'})</span>
          </span>
        </div>
      </div>

      {/* 2. REFINED VERIFIED TESTIMONIALS (Horizontal snap carousel on mobile, 3-col grid on desktop) */}
      <div className="flex md:grid md:grid-cols-3 gap-3.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none snap-x snap-mandatory -mx-1 px-1">
        {TESTIMONIALS.slice(0, 3).map((t) => (
          <div
            key={t.id}
            className="w-[82vw] max-w-[320px] shrink-0 snap-center md:w-auto md:max-w-none p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-[#E5C378]/40 transition-all duration-300 space-y-3.5 shadow-sm"
          >
            {/* Reviewer Header */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                {/* Monogram Initial Avatar */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E5C378]/20 to-[#DF9F3D]/10 border border-[#E5C378]/35 text-[#F5E2B3] font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                  {getMonogram(language === 'ar' ? t.nameAr : t.nameEn)}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    {language === 'ar' ? t.nameAr : t.nameEn}
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal block">
                    {language === 'ar' ? t.locationAr : t.locationEn}
                  </span>
                </div>
              </div>

              {/* 5 Gold Stars */}
              <div className="flex items-center gap-0.5 text-[#E5C378]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-[#E5C378]" />
                ))}
              </div>
            </div>

            {/* Quote */}
            <p className="text-xs text-slate-300 font-normal leading-relaxed">
              "{language === 'ar' ? t.quoteAr : t.quoteEn}"
            </p>

            {/* Tag + Verification Badge */}
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[10px] px-2.5 py-0.5 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/20 font-bold">
                {language === 'ar' ? t.tagAr : t.tagEn}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>{language === 'ar' ? 'رحلة موثقة' : 'Verified'}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialProofBar;
