'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CheckCircle2, Clock, AlertCircle, HelpCircle } from 'lucide-react';

export type StatusVariant = 'active' | 'pending' | 'failed' | 'neutral';

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusVariant;
  label?: string;
  size?: 'sm' | 'md';
  showDot?: boolean;
  showIcon?: boolean;
}

const STATUS_CONFIG: Record<
  StatusVariant,
  {
    defaultLabel: string;
    icon: React.ElementType;
    dotColor: string;
    classes: string;
  }
> = {
  active: {
    defaultLabel: 'نشط / مكتمل',
    icon: CheckCircle2,
    dotColor: 'bg-emerald-500',
    classes:
      'bg-emerald-50 text-emerald-700 border-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40',
  },
  pending: {
    defaultLabel: 'قيد التنفيذ',
    icon: Clock,
    dotColor: 'bg-amber-500 animate-pulse',
    classes:
      'bg-amber-50 text-amber-700 border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40',
  },
  failed: {
    defaultLabel: 'ملغي / متعثر',
    icon: AlertCircle,
    dotColor: 'bg-rose-500',
    classes:
      'bg-rose-50 text-rose-700 border-rose-200/70 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40',
  },
  neutral: {
    defaultLabel: 'مسودة / محايد',
    icon: HelpCircle,
    dotColor: 'bg-zinc-400 dark:bg-zinc-500',
    classes:
      'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  showDot = true,
  showIcon = false,
  className,
  ...props
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.neutral;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1.5',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-medium',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center rounded-full border select-none transition-colors duration-150',
          sizeClasses[size],
          config.classes,
          className
        )
      )}
      {...props}
    >
      {showDot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', config.dotColor)} />
      )}
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span className="leading-none">{label || config.defaultLabel}</span>
    </span>
  );
};
