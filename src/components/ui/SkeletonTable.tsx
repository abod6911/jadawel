'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOTION_TIMING, MOTION_EASE } from '@/lib/motion';

interface SkeletonTableProps {
  rowsCount?: number;
  columnsCount?: number;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rowsCount = 5,
  columnsCount = 6,
}) => {
  return (
    <div className="w-full bg-abyss-900/80 border border-white/10 rounded-2xl p-6 shadow-cinematic backdrop-blur-xl" dir="rtl">
      {/* Search and Action Bar Skeleton */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="w-64 h-10 rounded-xl skeleton-shimmer" />
        <div className="w-32 h-10 rounded-xl skeleton-shimmer" />
      </div>

      {/* Table Skeleton Header */}
      <div className="rounded-xl border border-white/5 overflow-hidden">
        <div className="grid grid-cols-6 gap-4 p-4 bg-abyss-950/80 border-b border-white/10">
          {Array.from({ length: columnsCount }).map((_, i) => (
            <div key={i} className="h-4 rounded-md skeleton-shimmer w-3/4" />
          ))}
        </div>

        {/* Table Skeleton Rows with staggered wave */}
        <div className="divide-y divide-white/5 bg-abyss-950/40">
          {Array.from({ length: rowsCount }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-6 gap-4 p-4 items-center"
              style={{
                opacity: 1 - rowIndex * 0.12, // subtle organic gradient
              }}
            >
              <div className="h-4 rounded-md skeleton-shimmer w-1/2" />
              <div className="h-4 rounded-md skeleton-shimmer w-4/5" />
              <div className="h-4 rounded-md skeleton-shimmer w-2/3" />
              <div className="h-6 rounded-full skeleton-shimmer w-20" />
              <div className="h-4 rounded-md skeleton-shimmer w-1/3" />
              <div className="h-4 rounded-md skeleton-shimmer w-1/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface AsyncDataBoundaryProps {
  isLoading: boolean;
  skeleton?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * AsyncDataBoundary
 * Seamlessly cross-fades from skeleton loader to live data without layout shifts.
 */
export const AsyncDataBoundary: React.FC<AsyncDataBoundaryProps> = ({
  isLoading,
  skeleton = <SkeletonTable />,
  children,
}) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: MOTION_TIMING.fast, ease: MOTION_EASE.smooth }}
          className="w-full"
        >
          {skeleton}
        </motion.div>
      ) : (
        <motion.div
          key="content-state"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: MOTION_TIMING.normal, ease: MOTION_EASE.spring }}
          className="w-full"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
