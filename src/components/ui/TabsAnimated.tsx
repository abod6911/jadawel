'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MOTION_SPRINGS } from '@/lib/motion';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsAnimatedProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'pill' | 'underline';
  className?: string;
}

export const TabsAnimated: React.FC<TabsAnimatedProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pill',
  className = '',
}) => {
  return (
    <div
      role="tablist"
      dir="rtl"
      className={`inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-abyss-950/80 border border-white/10 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-150 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 ${
              isActive ? 'text-pearl font-semibold' : 'text-pearl-muted hover:text-pearl'
            }`}
          >
            {/* Sliding Pill Background Indicator */}
            {variant === 'pill' && isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 rounded-xl bg-surface-card border border-gold-500/30 shadow-glow-gold/40 z-0"
                transition={MOTION_SPRINGS.smooth}
              />
            )}

            {/* Sliding Underline Indicator */}
            {variant === 'underline' && isActive && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 inset-x-2 h-0.5 bg-gradient-to-r from-gold-primary to-gold-hover shadow-glow-gold z-0"
                transition={MOTION_SPRINGS.smooth}
              />
            )}

            {/* Content (Elevated above indicator) */}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon && <span className="w-4 h-4 shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono transition-colors ${
                    isActive
                      ? 'bg-gold-500/20 text-gold-300 border border-gold-500/30'
                      : 'bg-white/5 text-pearl-muted'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};
