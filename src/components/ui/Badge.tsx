import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'coral' | 'turquoise' | 'neutral' | 'success' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  icon,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
  };

  const variantStyles = {
    primary:
      'bg-navy-100 text-navy-900 dark:bg-navy-900/60 dark:text-navy-200 border border-navy-200/50 dark:border-navy-700/50',
    coral:
      'bg-coral-100 text-coral-800 dark:bg-coral-950/60 dark:text-coral-300 border border-coral-200 dark:border-coral-800/50',
    turquoise:
      'bg-turquoise-100 text-turquoise-900 dark:bg-turquoise-950/60 dark:text-turquoise-300 border border-turquoise-200 dark:border-turquoise-800/50',
    neutral:
      'bg-pearl-200 text-gray-700 dark:bg-charcoal-800 dark:text-pearl-200 border border-gray-300 dark:border-gray-700',
    success:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50',
    outline:
      'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 bg-transparent',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 rounded-full font-medium transition-colors select-none',
          sizeStyles[size],
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
