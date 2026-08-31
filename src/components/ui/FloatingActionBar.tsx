'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, CheckCircle, Copy, X } from 'lucide-react';
import { MOTION_SPRINGS } from '@/lib/motion';

interface FloatingActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBatchExport?: () => void;
  onBatchStatusChange?: (status: 'active' | 'pending' | 'failed') => void;
  onBatchDuplicate?: () => void;
  onBatchDelete?: () => void;
}

export const FloatingActionBar: React.FC<FloatingActionBarProps> = ({
  selectedCount,
  onClearSelection,
  onBatchExport,
  onBatchStatusChange,
  onBatchDuplicate,
  onBatchDelete,
}) => {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 25, scale: 0.95 }}
          transition={MOTION_SPRINGS.smooth}
          className="fixed bottom-6 inset-x-0 mx-auto w-fit max-w-[95vw] shadow-2xl backdrop-blur-xl bg-zinc-900/95 text-white border border-zinc-700/70 rounded-2xl px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-4 z-50 gpu-layer"
          dir="rtl"
        >
          {/* Selected Count Indicator */}
          <div className="flex items-center gap-2 ps-1 pe-3 border-e border-zinc-700/80">
            <span className="w-6 h-6 rounded-full bg-gold-500 text-zinc-950 font-mono tabular-nums text-xs font-bold flex items-center justify-center">
              {selectedCount}
            </span>
            <span className="text-xs sm:text-sm font-medium text-zinc-200 whitespace-nowrap">
              سجلات محددة
            </span>
          </div>

          {/* Quick Batch Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {onBatchExport && (
              <button
                type="button"
                onClick={onBatchExport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/10 transition-colors tactile-press focus:outline-none"
                title="تصدير المحدد"
              >
                <Download className="w-4 h-4 text-gold-400" />
                <span className="hidden sm:inline">تصدير</span>
              </button>
            )}

            {onBatchStatusChange && (
              <button
                type="button"
                onClick={() => onBatchStatusChange('active')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/10 transition-colors tactile-press focus:outline-none"
                title="تفعيل المحدد"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">تفعيل</span>
              </button>
            )}

            {onBatchDuplicate && (
              <button
                type="button"
                onClick={onBatchDuplicate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/10 transition-colors tactile-press focus:outline-none"
                title="تكرار المحدد"
              >
                <Copy className="w-4 h-4 text-sky-400" />
                <span className="hidden sm:inline">نسخ</span>
              </button>
            )}

            {onBatchDelete && (
              <button
                type="button"
                onClick={onBatchDelete}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors tactile-press focus:outline-none"
                title="حذف المحدد"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">حذف</span>
              </button>
            )}
          </div>

          {/* Dismiss / Deselect All Button */}
          <div className="ps-2 border-s border-zinc-700/80">
            <button
              type="button"
              onClick={onClearSelection}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors tactile-press focus:outline-none"
              aria-label="إلغاء التحديد"
              title="إلغاء التحديد"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
