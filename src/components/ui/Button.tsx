import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'coral' | 'turquoise' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 ease-spring focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.97] min-h-[44px] cursor-pointer gpu-layer';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 min-h-[38px]',
    md: 'px-5 py-2.5 text-sm gap-2 min-h-[44px]',
    lg: 'px-7 py-3.5 text-base gap-2.5 min-h-[50px] font-semibold',
  };

  const variantStyles = {
    primary:
      'bg-navy-900 text-white hover:bg-navy-800 focus:ring-navy-700 shadow-md hover:shadow-lg dark:bg-coral-500 dark:hover:bg-coral-600 dark:text-navy-950',
    secondary:
      'bg-pearl-200 text-navy-900 hover:bg-pearl-300 dark:bg-charcoal-800 dark:text-pearl-100 dark:hover:bg-charcoal-700',
    coral:
      'bg-coral-500 text-white hover:bg-coral-600 focus:ring-coral-400 shadow-md hover:shadow-glow-coral',
    turquoise:
      'bg-turquoise-500 text-white hover:bg-turquoise-600 focus:ring-turquoise-400 shadow-md hover:shadow-glow-turquoise',
    outline:
      'border-2 border-navy-900 text-navy-900 hover:bg-navy-50 dark:border-coral-400 dark:text-coral-400 dark:hover:bg-charcoal-800',
    ghost:
      'text-navy-900 hover:bg-navy-50 dark:text-pearl-100 dark:hover:bg-charcoal-800',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
  };

  return (
    <button
      className={twMerge(
        clsx(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          className
        )
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin me-2" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && (
        <span className="inline-flex shrink-0">{rightIcon}</span>
      )}
    </button>
  );
};
