'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Ticket, Car, Wallet, ArrowUpRight } from 'lucide-react';
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
 * Inspired by Apple Card & Revolut Ultra ergonomics.
 * Features SVG gradient strokes, interactive hover synchronicity,
 * sleek micro-progress bars, and refined typography.
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

  // Segment stroke lengths with subtle 3px gap spacing
  const gap = total > 0 ? 3 : 0;
  const activeSegmentsCount = [foodShareSAR, ticketsShareSAR, transitShareSAR].filter((v) => v > 0).length;
  const totalGap = activeSegmentsCount > 1 ? gap * activeSegmentsCount : 0;
  const usableCircumference = Math.max(0, circumference - totalGap);

  const foodStroke = total > 0 && foodPct > 0 ? Math.max(2, (foodPct / 100) * usableCircumference) : 0;
  const ticketsStroke = total > 0 && ticketsPct > 0 ? Math.max(2, (ticketsPct / 100) * usableCircumference) : 0;
  const transitStroke = total > 0 && transitPct > 0 ? Math.max(2, (transitPct / 100) * usableCircumference) : 0;

  const foodOffset = 0;
  const ticketsOffset = -(foodStroke + (foodStroke > 0 ? gap : 0));
  const transitOffset = -(foodStroke + ticketsStroke + (foodStroke > 0 ? gap : 0) + (ticketsStroke > 0 ? gap : 0));

  // Dynamic center values based on active hover
  const getCenterData = () => {
    if (isFree) {
      return {
        label: language === 'ar' ? 'التكلفة الإجمالية' : 'Total Budget',
        value: language === 'ar' ? 'مجاني 100%' : 'Free',
        sub: language === 'ar' ? 'بدون رسوم' : 'No Fees',
        color: 'text-emerald-400',
      };
    }

    if (activeHover === 'food') {
      return {
        label: language === 'ar' ? 'الأكل والمقاهي' : 'Food & Cafes',
        value: `${foodShareSAR}`,
        sub: `${foodPct}% ${language === 'ar' ? 'من الإجمالي' : 'of total'}`,
        color: 'text-[#E5C378]',
      };
    }
    if (activeHover === 'tickets') {
      return {
        label: language === 'ar' ? 'التذاكر والأنشطة' : 'Tickets & Entry',
        value: `${ticketsShareSAR}`,
        sub: `${ticketsPct}% ${language === 'ar' ? 'من الإجمالي' : 'of total'}`,
        color: 'text-[#F4956C]',
      };
    }
    if (activeHover === 'transit') {
      return {
        label: language === 'ar' ? 'مشاوير أوبر' : 'Uber Transit',
        value: `${transitShareSAR}`,
        sub: `${transitPct}% ${language === 'ar' ? 'من الإجمالي' : 'of total'}`,
        color: 'text-[#2DD4BF]',
      };
    }

    return {
      label: language === 'ar' ? 'المجموع التقديري' : 'Estimated Total',
      value: `~${totalPerPersonSAR}`,
      sub: language === 'ar' ? 'ريال / شخص' : 'SAR / person',
      color: 'text-white',
    };
  };

  const centerData = getCenterData();

  const categories = [
    {
      key: 'food' as const,
      name: language === 'ar' ? 'الأكل والمقاهي' : 'Food & Cafes',
      subtitle: language === 'ar' ? 'وجبات رئيسية، قهوة مختصة وحلى' : 'Main dining, specialty coffee & dessert',
      amount: foodShareSAR,
      percentage: foodPct,
      icon: Utensils,
      color: '#E5C378',
      gradient: 'from-[#E5C378] to-[#DF9F3D]',
      bgSoft: 'bg-[#E5C378]/10 text-[#E5C378] border-[#E5C378]/25',
      barColor: 'bg-gradient-to-r from-[#DF9F3D] to-[#E5C378]',
    },
    {
      key: 'tickets' as const,
      name: language === 'ar' ? 'التذاكر والأنشطة' : 'Tickets & Activities',
      subtitle: language === 'ar' ? 'دخول المعارض، الفعاليات والمزارات' : 'Museums, attractions & event entry',
      amount: ticketsShareSAR,
      percentage: ticketsPct,
      icon: Ticket,
      color: '#F4956C',
      gradient: 'from-[#F4956C] to-[#E07A5F]',
      bgSoft: 'bg-[#F4956C]/10 text-[#F4956C] border-[#F4956C]/25',
      barColor: 'bg-gradient-to-r from-[#E07A5F] to-[#F4956C]',
    },
    {
      key: 'transit' as const,
      name: language === 'ar' ? 'مشاوير أوبر والتنقل' : 'Uber & Transit',
      subtitle: language === 'ar' ? 'المسافات البينية المباشرة بين المحطات' : 'Direct rides between stops',
      amount: transitShareSAR,
      percentage: transitPct,
      icon: Car,
      color: '#2DD4BF',
      gradient: 'from-[#2DD4BF] to-[#0D9488]',
      bgSoft: 'bg-[#2DD4BF]/10 text-[#2DD4BF] border-[#2DD4BF]/25',
      barColor: 'bg-gradient-to-r from-[#0D9488] to-[#2DD4BF]',
    },
  ];

  return (
    <div className="relative rounded-3xl p-5 sm:p-7 bg-[#0E131A]/85 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.65)] space-y-6 select-none text-start overflow-hidden">
      
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#E5C378]/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#2DD4BF]/5 blur-3xl pointer-events-none" />

      {/* 1. Header with Modern Typography */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E5C378]/10 border border-[#E5C378]/25 text-[#E5C378] flex items-center justify-center shadow-sm shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black text-white tracking-wide">
              {language === 'ar' ? 'تفصيل الميزانية التقديرية' : 'Itemized Budget Breakdown'}
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-400 font-normal">
              {language === 'ar' ? 'توزيع نسبي واقعي للتكاليف المتوقعة' : 'Realistic per-person expense distribution'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#E5C378] shadow-sm">
            {language === 'ar' ? '✦ تقدير لكل فرد' : '✦ Per Person'}
          </span>
        </div>
      </div>

      {/* 2. Visual Donut and Modern Financial Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        
        {/* Modern Donut Chart (5 Cols on Large Screens) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-2">
          <div className="relative w-44 h-44 sm:w-48 sm:h-48 shrink-0 flex items-center justify-center">
            
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <defs>
                {/* Linear Gradients for Luxury Sheen */}
                <linearGradient id="foodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#DF9F3D" />
                  <stop offset="100%" stopColor="#E5C378" />
                </linearGradient>

                <linearGradient id="ticketsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E07A5F" />
                  <stop offset="100%" stopColor="#F4956C" />
                </linearGradient>

                <linearGradient id="transitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0D9488" />
                  <stop offset="100%" stopColor="#2DD4BF" />
                </linearGradient>
              </defs>

              {/* Background Track Circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="10"
              />

              {/* Food Slice */}
              {foodStroke > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="url(#foodGrad)"
                  strokeWidth={activeHover === 'food' ? '12.5' : '10'}
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
                  strokeWidth={activeHover === 'tickets' ? '12.5' : '10'}
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
                  strokeWidth={activeHover === 'transit' ? '12.5' : '10'}
                  strokeDasharray={`${transitStroke} ${circumference}`}
                  strokeDashoffset={transitOffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 ease-out cursor-pointer"
                  onMouseEnter={() => setActiveHover('transit')}
                  onMouseLeave={() => setActiveHover(null)}
                />
              )}
            </svg>

            {/* Dynamic Center Typography */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 pointer-events-none">
              <span className="text-[11px] text-slate-400 font-medium block truncate max-w-[120px]">
                {centerData.label}
              </span>

              <div className="flex items-baseline justify-center gap-1 my-0.5">
                <span className={`text-xl sm:text-2xl font-black tracking-tight ${centerData.color} transition-colors duration-200`}>
                  {centerData.value}
                </span>
                {!isFree && !activeHover && (
                  <span className="text-xs font-bold text-[#E5C378]">
                    {language === 'ar' ? 'ر.س' : 'SAR'}
                  </span>
                )}
                {activeHover && (
                  <span className="text-xs font-bold text-slate-400">
                    {language === 'ar' ? 'ر.س' : 'SAR'}
                  </span>
                )}
              </div>

              <span className="text-[10px] text-slate-400 font-semibold block">
                {centerData.sub}
              </span>
            </div>
          </div>

          {/* Interactive Hint */}
          <span className="text-[11px] text-slate-500 font-medium mt-3 hidden sm:block">
            {language === 'ar' ? 'مرر الماوس فوق أي فئة لتفصيل حصتها' : 'Hover over any item to inspect details'}
          </span>
        </div>

        {/* 3. Refined Financial Item Cards (7 Cols on Large Screens) */}
        <div className="lg:col-span-7 space-y-3 w-full">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isHovered = activeHover === cat.key;

            return (
              <div
                key={cat.key}
                onMouseEnter={() => setActiveHover(cat.key)}
                onMouseLeave={() => setActiveHover(null)}
                className={`group relative p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isHovered
                    ? 'bg-white/[0.05] border-white/20 shadow-lg scale-[1.01]'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.035] hover:border-white/10'
                }`}
              >
                {/* Top Row: Icon, Label & Price */}
                <div className="flex items-center justify-between gap-3">
                  
                  {/* Left Group: Icon + Title */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${cat.bgSoft}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white block truncate">
                          {cat.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-400 shrink-0">
                          {cat.percentage}%
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-normal line-clamp-1 block">
                        {cat.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Right Group: Price */}
                  <div className="text-end shrink-0">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-sm sm:text-base font-black text-white">
                        ~{cat.amount}
                      </span>
                      <span className="text-[11px] font-bold text-[#E5C378]">
                        {language === 'ar' ? 'ر.س' : 'SAR'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Micro-Progress Bar */}
                <div className="mt-3 w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${cat.barColor}`}
                    style={{ width: `${Math.max(4, cat.percentage)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* 4. Realistic Disclaimer Note */}
      <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-slate-400">
        <span>
          {language === 'ar'
            ? '💡 الأسعار تقديرية وتخضع لاختياراتك المحددة من قائمة الطعام أو تذاكر الفعاليات الموسمية.'
            : '💡 Estimates based on standard menu averages and current seasonal entry rates.'}
        </span>
      </div>

    </div>
  );
};

export default BudgetDonutChart;
