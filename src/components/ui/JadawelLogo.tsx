'use client';

import React from 'react';

interface JadawelLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const JadawelLogo: React.FC<JadawelLogoProps> = ({
  className = 'w-10 h-10',
  size,
  showText = false,
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Minimalist Vector Emblem */}
      <div
        style={style}
        className="relative aspect-square w-10 h-10 rounded-2xl overflow-hidden bg-gradient-to-br from-[#161C24] to-[#090B0E] border border-gold-500/35 p-1 flex items-center justify-center shadow-[0_4px_20px_rgba(229,169,98,0.2)] hover:border-gold-400/60 hover:shadow-[0_4px_25px_rgba(229,169,98,0.35)] transition-all shrink-0"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="logo-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F3CA95" />
              <stop offset="50%" stopColor="#E5A962" />
              <stop offset="100%" stopColor="#D48B38" />
            </linearGradient>
          </defs>

          {/* Minimalist Geometric Arabic 'Jeem' (ج) */}
          <path
            d="M 32 35 H 68"
            stroke="url(#logo-gold-grad)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 68 35 C 50 48, 68 62, 68 70 C 68 81, 54 82, 38 78"
            stroke="url(#logo-gold-grad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Minimalist Red Sea Pearl Dot */}
          <circle cx="48" cy="58" r="5" fill="#4E9F96" />
        </svg>
      </div>

      {showText && (
        <div className="text-start">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black tracking-tight text-[#FBFBFA]">
              جداول
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500/15 text-gold-400 font-black border border-gold-500/30">
              جدة
            </span>
          </div>
          <span className="text-[10px] text-[#9EA8B3] block font-medium">
            المخطط الذكي لرحلات عروس البحر
          </span>
        </div>
      )}
    </div>
  );
};

export default JadawelLogo;
