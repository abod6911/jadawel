'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Ticket, Car, Wallet, Sparkles, Users, Coins, Info, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface BudgetDonutChartProps {
  totalPerPersonSAR: number;
  foodShareSAR: number;
  ticketsShareSAR: number;
  transitShareSAR: number;
}

type CategoryKey = 'food' | 'tickets' | 'transit';

/**
 * BudgetDonutChart — World-Class Quiet Luxury Financial Breakdown
 * Elevated to ultra-luxury Swiss horology & Apple Card fintech standards.
 * Features ambient glowing pedestal, horological dial track, sculpted monetary typography,
 * interactive category synchronization, and executive group metrics.
 */
export const BudgetDonutChart: React.FC<BudgetDonutChartProps> = ({
  totalPerPersonSAR,
  foodShareSAR,
  ticketsShareSAR,
  transitShareSAR,
}) => {
  const { language, isRTL } = useLanguage();
  const [activeHover, setActiveHover] = useState<CategoryKey | null>(null);

  const total = Math.max(1, totalPerPersonSAR);
  const isFree = totalPerPersonSAR === 0;

  // Percentages
  const foodPct = isFree ? 0 : Math.round((foodShareSAR / total) * 100);
  const ticketsPct = isFree ? 0 : Math.round((ticketsShareSAR / total) * 100);
  const transitPct = isFree ? 0 : Math.max(0, 100 - foodPct - ticketsPct);

  // SVG Donut Calculations (Radius = 40, Circumference = 2 * PI * 40 ≈ 251.327)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  // Segment stroke lengths with 3.5px gap spacing
  const gap = total > 0 ? 3.5 : 0;
  const activeSegmentsCount = [foodShareSAR, ticketsShareSAR, transitShareSAR].filter((v) => v > 0).length;
  const totalGap = activeSegmentsCount > 1 ? gap * activeSegmentsCount : 0;
  const usableCircumference = Math.max(0, circumference - totalGap);

  const foodStroke = total > 0 && foodPct > 0 ? Math.max(2, (foodPct / 100) * usableCircumference) : 0;
  const ticketsStroke = total > 0 && ticketsPct > 0 ? Math.max(2, (ticketsPct / 100) * usableCircumference) : 0;
  const transitStroke = total > 0 && transitPct > 0 ? Math.max(2, (transitPct / 100) * usableCircumference) : 0;

  const foodOffset = 0;
  const ticketsOffset = -(foodStroke + (foodStroke > 0 ? gap : 0));
  const transitOffset = -(foodStroke + ticketsStroke + (foodStroke > 0 ? gap : 0) + (ticketsStroke > 0 ? gap : 0));

  const categories = [
    {
      key: 'food' as const,
      name: language === 'ar' ? 'الأكل والمقاهي' : 'Dining & Specialty Cafes',
      subtitle: language === 'ar' ? 'وجبات رئيسية، قهوة مختصة وحلى حجازي' : 'Main courses, specialty roasts & dessert',
      highlightTag: language === 'ar' ? 'أطباق وقهوة' : 'Dining',
      amount: foodShareSAR,
      percentage: foodPct,
      icon: Utensils,
      color: '#E5C378',
      activeBorder: 'border-[#E5C378]/50 shadow-[0_0_30px_rgba(229,195,120,0.18)]',
      bgGlow: 'bg-[#E5C378]/10 text-[#E5C378] border-[#E5C378]/30',
      badgeBg: 'bg-[#E5C378]/15 text-[#F5E2B3] border-[#E5C378]/30',
      barColor: 'from-[#DF9F3D] via-[#E5C378] to-[#F5E2B3]',
      barShadow: 'shadow-[0_0_12px_rgba(229,195,120,0.4)]',
    },
    {
      key: 'tickets' as const,
      name: language === 'ar' ? 'التذاكر والأنشطة' : 'Tickets & Experiences',
      subtitle: language === 'ar' ? 'دخول المعارض الرقمية، الفعاليات والمزارات' : 'Museum admissions & curated attraction entry',
      highlightTag: language === 'ar' ? 'فعاليات ومعارض' : 'Entry',
      amount: ticketsShareSAR,
      percentage: ticketsPct,
      icon: Ticket,
      color: '#F4956C',
      activeBorder: 'border-[#F4956C]/50 shadow-[0_0_30px_rgba(244,149,108,0.18)]',
      bgGlow: 'bg-[#F4956C]/10 text-[#F4956C] border-[#F4956C]/30',
      badgeBg: 'bg-[#F4956C]/15 text-[#FAD2C0] border-[#F4956C]/30',
      barColor: 'from-[#E07A5F] via-[#F4956C] to-[#FFAB85]',
      barShadow: 'shadow-[0_0_12px_rgba(244,149,108,0.4)]',
    },
    {
      key: 'transit' as const,
      name: language === 'ar' ? 'مشاوير أوبر والتنقل' : 'Uber & Local Transit',
      subtitle: language === 'ar' ? 'المسافات البينية المباشرة وتوصيل المحطات' : 'Inter-station rides & point-to-point transit',
      highlightTag: language === 'ar' ? 'مشاوير سريعة' : 'Rides',
      amount: transitShareSAR,
      percentage: transitPct,
      icon: Car,
      color: '#2DD4BF',
      activeBorder: 'border-[#2DD4BF]/50 shadow-[0_0_30px_rgba(45,212,191,0.18)]',
      bgGlow: 'bg-[#2DD4BF]/10 text-[#2DD4BF] border-[#2DD4BF]/30',
      badgeBg: 'bg-[#2DD4BF]/15 text-[#99F6E4] border-[#2DD4BF]/30',
      barColor: 'from-[#0D9488] via-[#2DD4BF] to-[#5EEAD4]',
      barShadow: 'shadow-[0_0_12px_rgba(45,212,191,0.4)]',
    },
  ];

  // Highest expense category for executive insight
  const highestCategory = [...categories].sort((a, b) => b.amount - a.amount)[0];

  // Dynamic center values based on active hover
  const getCenterData = () => {
    if (isFree) {
      return {
        badge: language === 'ar' ? '✦ رحلة مجانية' : '✦ Free Tour',
        value: language === 'ar' ? 'مجاني' : 'Free',
        sub: language === 'ar' ? 'بدون أي رسوم دخول' : 'Zero admission fees',
        color: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
      };
    }

    if (activeHover === 'food') {
      return {
        badge: language === 'ar' ? '🍴 الأكل والمقاهي' : '🍴 Dining & Cafes',
        value: `${foodShareSAR}`,
        sub: `${foodPct}% ${language === 'ar' ? 'من ميزانية الجولة' : 'of total budget'}`,
        color: 'text-[#F5E2B3]',
        borderColor: 'border-[#E5C378]/40',
      };
    }
    if (activeHover === 'tickets') {
      return {
        badge: language === 'ar' ? '🎟️ التذاكر والأنشطة' : '🎟️ Experiences',
        value: `${ticketsShareSAR}`,
        sub: `${ticketsPct}% ${language === 'ar' ? 'من ميزانية الجولة' : 'of total budget'}`,
        color: 'text-[#F4956C]',
        borderColor: 'border-[#F4956C]/40',
      };
    }
    if (activeHover === 'transit') {
      return {
        badge: language === 'ar' ? '🚗 مشاوير أوبر' : '🚗 Uber Rides',
        value: `${transitShareSAR}`,
        sub: `${transitPct}% ${language === 'ar' ? 'من ميزانية الجولة' : 'of total budget'}`,
        color: 'text-[#2DD4BF]',
        borderColor: 'border-[#2DD4BF]/40',
      };
    }

    return {
      badge: language === 'ar' ? '✦ التكلفة التقديرية' : '✦ Estimated Cost',
      value: `~${totalPerPersonSAR}`,
      sub: language === 'ar' ? 'ريال سعودي / لكل فرد' : 'SAR / per person',
      color: 'text-white',
      borderColor: 'border-[#E5C378]/30',
    };
  };

  const centerData = getCenterData();

  return (
    <div className="relative rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 lg:p-9 bg-gradient-to-b from-[#111622]/95 via-[#0C1018]/95 to-[#090C12]/98 backdrop-blur-3xl border border-white/[0.08] shadow-[0_30px_90px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.12)] space-y-7 select-none text-start overflow-hidden">
      
      {/* Top Specular Gold Reflection Accent */}
      <div className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-[#E5C378]/50 to-transparent pointer-events-none" />

      {/* Multi-Layer Ambient Radial Illumination */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#E5C378]/8 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#2DD4BF]/7 blur-[100px] pointer-events-none" />

      {/* 1. Header with Executive Badges & Refined Hierarchy */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/[0.07]">
        
        {/* Title + Icon */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#E5C378]/20 via-[#DF9F3D]/10 to-transparent border border-[#E5C378]/35 text-[#F5E2B3] flex items-center justify-center shadow-[0_0_20px_rgba(229,195,120,0.15)] shrink-0">
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h4 className="text-base sm:text-lg font-black text-white tracking-wide">
                {language === 'ar' ? 'تفصيل الميزانية التقديرية' : 'Itemized Budget Architecture'}
              </h4>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#E5C378]/15 border border-[#E5C378]/30 text-[#F5E2B3]">
                <Sparkles className="w-3 h-3 text-[#E5C378]" />
                {language === 'ar' ? 'حساب دقيق' : 'Smart Precision'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              {language === 'ar'
                ? 'توزيع نسبي واقعي للتكاليف المتوقعة لكافة المحطات المعتمدة'
                : 'Realistic per-person expense distribution across verified itinerary stops'}
            </p>
          </div>
        </div>

        {/* Executive Metrics Pills */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-300">
              {language === 'ar' ? 'المعدل للفرد:' : 'Per Person:'}
            </span>
            <span className="text-xs sm:text-sm font-black text-[#F5E2B3]">
              ~{totalPerPersonSAR} {language === 'ar' ? 'ر.س' : 'SAR'}
            </span>
          </div>

          <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-[#E5C378]/10 border border-[#E5C378]/25 text-[#F5E2B3] shadow-sm hidden md:inline-block">
            {language === 'ar' ? '✦ تقدير مستقل' : '✦ Individual Share'}
          </span>
        </div>
      </div>

      {/* 2. Balanced Dual-Pane Composition: Gauge Hub + Financial Asset Bento Cards */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        
        {/* PANE 1: Luxury Gauge Pod & Donut Hub (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl bg-gradient-to-b from-[#131924]/70 to-[#0B0E15]/90 border border-white/[0.07] p-6 shadow-xl relative overflow-hidden text-center group">
          
          {/* Subtle Pod Corner Highlight */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#E5C378]/5 rounded-full blur-2xl pointer-events-none" />

          {/* Top Gauge Eyebrow */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2">
            <span className="font-bold flex items-center gap-1.5 text-slate-300">
              <Coins className="w-3.5 h-3.5 text-[#E5C378]" />
              {language === 'ar' ? 'مؤشر الإنفاق الإجمالي' : 'Total Expense Gauge'}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-400 border border-white/[0.06]">
              {language === 'ar' ? '3 بنود رئيسية' : '3 Main Pillars'}
            </span>
          </div>

          {/* Luxury Horology-Inspired Donut Dial */}
          <div className="my-auto py-3 flex items-center justify-center">
            <div className="relative w-52 h-52 sm:w-56 sm:h-56 shrink-0 flex items-center justify-center">
              
              {/* Outer Ambient Halo on Hover */}
              <div
                className={`absolute inset-4 rounded-full blur-xl transition-opacity duration-500 pointer-events-none ${
                  activeHover === 'food'
                    ? 'bg-[#E5C378]/20 opacity-100'
                    : activeHover === 'tickets'
                    ? 'bg-[#F4956C]/20 opacity-100'
                    : activeHover === 'transit'
                    ? 'bg-[#2DD4BF]/20 opacity-100'
                    : 'bg-[#E5C378]/10 opacity-70'
                }`}
              />

              <svg className="w-full h-full -rotate-90 transform relative z-10" viewBox="0 0 100 100">
                <defs>
                  {/* Linear Gradients for Luxury Sheen */}
                  <linearGradient id="foodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DF9F3D" />
                    <stop offset="60%" stopColor="#E5C378" />
                    <stop offset="100%" stopColor="#F5E2B3" />
                  </linearGradient>

                  <linearGradient id="ticketsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E07A5F" />
                    <stop offset="60%" stopColor="#F4956C" />
                    <stop offset="100%" stopColor="#FFBFA3" />
                  </linearGradient>

                  <linearGradient id="transitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0D9488" />
                    <stop offset="60%" stopColor="#2DD4BF" />
                    <stop offset="100%" stopColor="#5EEAD4" />
                  </linearGradient>
                </defs>

                {/* Outer Horological Ticks Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="47.5"
                  fill="transparent"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="1"
                  strokeDasharray="1.5 5"
                />

                {/* Inner Track Guide */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="11"
                />

                {/* Food Slice */}
                {foodStroke > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke="url(#foodGrad)"
                    strokeWidth={activeHover === 'food' ? '14' : '11'}
                    strokeDasharray={`${foodStroke} ${circumference}`}
                    strokeDashoffset={foodOffset}
                    strokeLinecap="round"
                    className="transition-all duration-300 ease-out cursor-pointer"
                    onMouseEnter={() => setActiveHover('food')}
                    onMouseLeave={() => setActiveHover(null)}
                  />
                )}

                {/* Tickets Slice */}
                {ticketsStroke > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke="url(#ticketsGrad)"
                    strokeWidth={activeHover === 'tickets' ? '14' : '11'}
                    strokeDasharray={`${ticketsStroke} ${circumference}`}
                    strokeDashoffset={ticketsOffset}
                    strokeLinecap="round"
                    className="transition-all duration-300 ease-out cursor-pointer"
                    onMouseEnter={() => setActiveHover('tickets')}
                    onMouseLeave={() => setActiveHover(null)}
                  />
                )}

                {/* Transit Slice */}
                {transitStroke > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke="url(#transitGrad)"
                    strokeWidth={activeHover === 'transit' ? '14' : '11'}
                    strokeDasharray={`${transitStroke} ${circumference}`}
                    strokeDashoffset={transitOffset}
                    strokeLinecap="round"
                    className="transition-all duration-300 ease-out cursor-pointer"
                    onMouseEnter={() => setActiveHover('transit')}
                    onMouseLeave={() => setActiveHover(null)}
                  />
                )}
              </svg>

              {/* Dynamic Center Horology Core */}
              <div className="absolute inset-7 rounded-full bg-gradient-to-b from-[#0E121B]/95 to-[#07090E]/95 border border-white/[0.08] shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center text-center p-3 pointer-events-none transition-all duration-300">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 block truncate max-w-[130px] mb-0.5">
                  {centerData.badge}
                </span>

                <div className="flex items-baseline justify-center gap-1 my-0.5">
                  <span className={`text-2xl sm:text-3xl font-black tracking-tight ${centerData.color} transition-colors duration-200`}>
                    {centerData.value}
                  </span>
                  {!isFree && (
                    <span className="text-xs font-black text-[#E5C378]">
                      {language === 'ar' ? 'ر.س' : 'SAR'}
                    </span>
                  )}
                </div>

                <span className="text-[10px] text-slate-400 font-semibold block">
                  {centerData.sub}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Color Pill Dots (Mini Legend) */}
          <div className="pt-2 border-t border-white/[0.05] flex items-center justify-center gap-3 text-[11px] font-bold text-slate-400">
            <span className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors" onMouseEnter={() => setActiveHover('food')} onMouseLeave={() => setActiveHover(null)}>
              <span className="w-2.5 h-2.5 rounded-full bg-[#E5C378] shadow-[0_0_8px_rgba(229,195,120,0.6)]" />
              <span>{foodPct}%</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors" onMouseEnter={() => setActiveHover('tickets')} onMouseLeave={() => setActiveHover(null)}>
              <span className="w-2.5 h-2.5 rounded-full bg-[#F4956C] shadow-[0_0_8px_rgba(244,149,108,0.6)]" />
              <span>{ticketsPct}%</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors" onMouseEnter={() => setActiveHover('transit')} onMouseLeave={() => setActiveHover(null)}>
              <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] shadow-[0_0_8px_rgba(45,212,191,0.6)]" />
              <span>{transitPct}%</span>
            </span>
          </div>

        </div>

        {/* PANE 2: Sculpted Financial Asset Bento Cards (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-3.5 w-full">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isHovered = activeHover === cat.key;

            return (
              <div
                key={cat.key}
                onMouseEnter={() => setActiveHover(cat.key)}
                onMouseLeave={() => setActiveHover(null)}
                className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                  isHovered
                    ? `bg-[#151B27]/90 ${cat.activeBorder} -translate-y-0.5`
                    : 'bg-[#0E131C]/60 border-white/[0.06] hover:bg-[#121722]/80 hover:border-white/15'
                }`}
              >
                {/* Subtle Ambient Hover Glow in Card Corner */}
                <div
                  className={`absolute top-0 -left-12 w-32 h-32 rounded-full blur-2xl transition-opacity duration-300 pointer-events-none ${
                    isHovered ? 'opacity-25' : 'opacity-0'
                  }`}
                  style={{ backgroundColor: cat.color }}
                />

                {/* Top Row: Icon + Title + Category Pill + Price */}
                <div className="relative z-10 flex items-start justify-between gap-3">
                  
                  {/* Left Info Group */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 border ${cat.bgGlow} shadow-sm transition-transform duration-300 group-hover:scale-105`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm sm:text-base font-black text-white block">
                          {cat.name}
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${cat.badgeBg} shrink-0`}>
                          {cat.percentage}%
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/[0.03] text-slate-400 border border-white/[0.05] hidden sm:inline-block">
                          {cat.highlightTag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-normal leading-relaxed line-clamp-1">
                        {cat.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right Price Display */}
                  <div className="text-end shrink-0 pt-0.5">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-base sm:text-lg font-black text-white tracking-tight">
                        ~{cat.amount}
                      </span>
                      <span className="text-xs font-black text-[#E5C378]">
                        {language === 'ar' ? 'ر.س' : 'SAR'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {language === 'ar' ? 'للفرد' : 'per person'}
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Illuminated Luxury Micro-Progress Pill Track */}
                <div className="relative z-10 mt-3.5 pt-1">
                  <div className="w-full h-2 rounded-full bg-white/[0.04] p-[1.5px] border border-white/[0.06] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${cat.barColor} ${
                        isHovered ? cat.barShadow : ''
                      }`}
                      style={{ width: `${Math.max(5, cat.percentage)}%` }}
                    />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* 3. Executive Strip: Group Math & Trust Disclaimer */}
      <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        
        {/* Real-World Group Multiplier */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.07] text-slate-300 w-full sm:w-auto justify-center sm:justify-start">
          <Users className="w-3.5 h-3.5 text-[#E5C378]" />
          <span className="font-bold">
            {language === 'ar' ? 'تقدير للمجموعة (3 أفراد):' : 'Estimated for group of 3:'}
          </span>
          <span className="font-black text-[#F5E2B3]">
            ~{totalPerPersonSAR * 3} {language === 'ar' ? 'ر.س' : 'SAR'}
          </span>
        </div>

        {/* Insight Disclaimer */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 text-center sm:text-end">
          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 hidden sm:inline" />
          <span>
            {language === 'ar'
              ? 'الأسعار مبنية على متوسط قوائم الطعام الرسمية وتذاكر الفعاليات المعتمدة.'
              : 'Estimates calculated from official menu averages and verified venue admissions.'}
          </span>
        </div>

      </div>

    </div>
  );
};

export default BudgetDonutChart;
