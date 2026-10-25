'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useItineraryStore } from '@/store/useItineraryStore';

export const Toast: React.FC = () => {
  const toast = useItineraryStore((state) => state.toast);
  const hideToast = useItineraryStore((state) => state.hideToast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      hideToast();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  if (!toast) return null;

  const icons = {
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
  };

  const borders = {
    info: 'border-sky-500/30 shadow-[0_0_25px_rgba(14,165,233,0.25)]',
    success: 'border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.25)]',
    warning: 'border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.25)]',
    error: 'border-rose-500/30 shadow-[0_0_25px_rgba(244,63,94,0.25)]',
  };

  return (
    <AnimatePresence>
      <div className="fixed bottom-24 sm:bottom-8 inset-x-4 sm:inset-x-auto sm:end-8 z-50 flex justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className={`pointer-events-auto max-w-md w-full px-4 py-3.5 rounded-2xl bg-neutral-950/95 backdrop-blur-xl border ${borders[toast.type]} flex items-center justify-between gap-3 text-start shadow-2xl`}
        >
          <div className="flex items-center gap-3">
            {icons[toast.type]}
            <p className="text-xs sm:text-sm font-bold text-neutral-100 leading-snug">
              {toast.message}
            </p>
          </div>
          <button
            type="button"
            onClick={hideToast}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
