import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center p-4 select-none">
      <div className="space-y-4 text-center">
        {/* Pulsing Luxury Monogram Logo */}
        <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-[var(--accent-gold)]/20 animate-ping opacity-35" />
          <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-gold)] flex items-center justify-center shadow-lg relative z-10">
            <svg
              className="w-8 h-8 text-[var(--accent-gold)] animate-pulse"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" x2="9" y1="3" y2="18" />
              <line x1="15" x2="15" y1="6" y2="21" />
            </svg>
          </div>
        </div>

        {/* Minimalist Shimmer Bar */}
        <div className="w-36 h-1 rounded-full bg-white/10 mx-auto overflow-hidden relative">
          <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-[var(--accent-gold)] to-transparent animate-[shimmer_1.5s_infinite]" />
        </div>

        <p className="text-xs font-bold text-[var(--text-gold)] tracking-wide pt-1">
          جداول • عروس البحر الأحمر
        </p>
      </div>
    </div>
  );
}
