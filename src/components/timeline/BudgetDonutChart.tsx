'use client';

import React from 'react';
import { Utensils, Ticket, Car, Coins } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface BudgetDonutChartProps {
  totalPerPersonSAR: number;
  foodShareSAR: number;
  ticketsShareSAR: number;
  transitShareSAR: number;
}

/**
 * BudgetDonutChart — High-Performance Native SVG Donut Chart
 * Visualizes the budget breakdown (Food, Activities, Transit) with pure SVG,
 * zero chart library overhead, and accessible semantic legend.
 */
export const BudgetDonutChart: React.FC<BudgetDonutChartProps> = ({
  totalPerPersonSAR,
  foodShareSAR,
  ticketsShareSAR,
  transitShareSAR,
}) => {
  const { language } = useLanguage();

  const total = Math.max(1, totalPerPersonSAR);
  const isFree = totalPerPersonSAR === 0;

  // Percentages
  const foodPct = isFree ? 0 : Math.round((foodShareSAR / total) * 100);
  const ticketsPct = isFree ? 0 : Math.round((ticketsShareSAR / total) * 100);
  const transitPct = isFree ? 0 : Math.max(0, 100 - foodPct - ticketsPct);

  // SVG Donut Calculations (Radius = 42, Circumference = 2 * PI * 42 ≈ 263.89)
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  const foodStroke = (foodPct / 100) * circumference;
  const ticketsStroke = (ticketsPct / 100) * circumference;
  const transitStroke = (transitPct / 100) * circumference;

  const foodOffset = 0;
  const ticketsOffset = -foodStroke;
  const transitOffset = -(foodStroke + ticketsStroke);

  return (
    <div className="card-surface p-4 sm:p-6 border border-[var(--border-subtle)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-[var(--accent-gold)]" />
          <h4 className="text-sm sm:text-base font-bold text-white">
            {language === 'ar' ? 'تفصيل الميزانية التقديرية' : 'Itemized Budget Breakdown'}
          </h4>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--accent-gold-soft)] border border-[var(--border-gold)] text-[var(--text-gold)] font-bold">
          {language === 'ar' ? 'لكل شخص' : 'Per Person'}
        </span>
      </div>

      {/* Donut and Legend Grid */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-5 sm:gap-8 pt-1">
        {/* SVG Donut */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="11"
            />

            {/* Food Slice (Champagne Gold) */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#E5C378"
              strokeWidth="11"
              strokeDasharray={`${foodStroke} ${circumference}`}
              strokeDashoffset={foodOffset}
              className="transition-all duration-700 ease-out"
            />

            {/* Tickets Slice (Twilight Coral / Amber) */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#FB7185"
              strokeWidth="11"
              strokeDasharray={`${ticketsStroke} ${circumference}`}
              strokeDashoffset={ticketsOffset}
              className="transition-all duration-700 ease-out"
            />

            {/* Transit Slice (Marine Teal) */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#2DD4BF"
              strokeWidth="11"
              strokeDasharray={`${transitStroke} ${circumference}`}
              strokeDashoffset={transitOffset}
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Donut Center Total Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xs text-slate-400 font-medium">
              {language === 'ar' ? 'المجموع' : 'Total'}
            </span>
            <span className="text-base sm:text-lg font-black text-white leading-tight font-mono">
              {isFree ? (language === 'ar' ? 'مجاني' : '0 SAR') : `~${totalPerPersonSAR}`}
            </span>
            {!isFree && (
              <span className="text-[10px] text-[var(--accent-gold)] font-bold">
                {language === 'ar' ? 'ر.س' : 'SAR'}
              </span>
            )}
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 w-full space-y-2.5">
          {/* 1. Food */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-2 text-xs text-slate-200 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E5C378] shrink-0" />
              <Utensils className="w-3.5 h-3.5 text-[#E5C378]" />
              <span>{language === 'ar' ? 'الأكل والمقاهي' : 'Food & Cafes'}</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="font-bold text-white">~{foodShareSAR} ر.س</span>
              <span className="text-slate-400 text-[10px]">({foodPct}%)</span>
            </div>
          </div>

          {/* 2. Tickets */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-2 text-xs text-slate-200 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FB7185] shrink-0" />
              <Ticket className="w-3.5 h-3.5 text-[#FB7185]" />
              <span>{language === 'ar' ? 'التذاكر والأنشطة' : 'Tickets & Entry'}</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="font-bold text-white">~{ticketsShareSAR} ر.س</span>
              <span className="text-slate-400 text-[10px]">({ticketsPct}%)</span>
            </div>
          </div>

          {/* 3. Transit */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-2 text-xs text-slate-200 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] shrink-0" />
              <Car className="w-3.5 h-3.5 text-[#2DD4BF]" />
              <span>{language === 'ar' ? 'مشاوير أوبر' : 'Uber Transit'}</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="font-bold text-white">~{transitShareSAR} ر.س</span>
              <span className="text-slate-400 text-[10px]">({transitPct}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetDonutChart;
