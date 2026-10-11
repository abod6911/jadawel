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
        className="relative aspect-square w-10 h-10 rounded-2xl overflow-hidden bg-gradient-to-br from-[#161B26] to-[#0A0D14] border border-white/15 p-1 flex items-center justify-center shadow-md hover:border-[#E5C378]/40 transition-all shrink-0"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="logo-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF1CC" />
              <stop offset="50%" stopColor="#E5C378" />
              <stop offset="100%" stopColor="#C8A452" />
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
          <circle cx="48" cy="58" r="5" fill="#E5C378" />
        </svg>
      </div>

      {showText && (
        <div className="text-start">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black tracking-tight text-[#FBFBFA]">
              جداول
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E5C378]/15 text-[#F5E2B3] font-black border border-[#E5C378]/30">
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
