'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'gold';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]',
          variant === 'default' && 'bg-[#0015ff] text-white hover:bg-[#0015ff]/90',
          variant === 'gold' && 'bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] text-[#0B0D12] font-black hover:brightness-105 shadow-[0_4px_16px_rgba(229,195,120,0.35)]',
          variant === 'outline' && 'border border-current bg-transparent hover:bg-white/10',
          variant === 'ghost' && 'hover:bg-white/10',
          size === 'default' && 'h-10 px-4 py-2',
          size === 'sm' && 'h-8 rounded-md px-3 text-xs',
          size === 'lg' && 'h-12 rounded-xl px-8 text-base',
          size === 'icon' && 'h-9 w-9',
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export default Button;
