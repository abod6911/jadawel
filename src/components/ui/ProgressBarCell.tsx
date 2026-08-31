'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarCellProps {
  value: number; // 0 - 100
  label?: string;
  showPercentage?: boolean;
  colorScheme?: 'gold' | 'emerald' | 'amber' | 'dynamic';
  size?: 'sm' | 'md';
}

export const ProgressBarCell: React.FC<ProgressBarCellProps> = ({
  value,
  label,
  showPercentage = true,
  colorScheme = 'dynamic',
  size = 'md',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  // Determine dynamic bar color based on completion percentage
  const getBarColor = () => {
    if (colorScheme === 'gold') return 'bg-gold-500';
    if (colorScheme === 'emerald') return 'bg-emerald-500';
    if (colorScheme === 'amber') return 'bg-amber-500';
    
    // Dynamic
    if (clampedValue >= 80) return 'bg-emerald-500';
    if (clampedValue >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const heightClass = size === 'sm' ? 'h-1.5' : 'h-2';

  return (
    <div className="flex items-center gap-3 w-full min-w-[130px]" dir="rtl">
      {/* Visual Progress Track */}
      <div className={`flex-1 bg-zinc-200/80 dark:bg-zinc-800 rounded-full overflow-hidden ${heightClass} relative`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full rounded-full ${getBarColor()}`}
        />
      </div>

      {/* Tabular Percentage Tag */}
      {showPercentage && (
        <span className="font-mono tabular-nums text-xs font-semibold text-zinc-700 dark:text-zinc-300 w-11 text-left shrink-0">
          {clampedValue}%
        </span>
      )}

      {label && <span className="text-[11px] text-zinc-400 dark:text-zinc-500">{label}</span>}
    </div>
  );
};
