'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useLanguage } from '@/hooks/useLanguage';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { language } = useLanguage();
  const [updateRegistration, setUpdateRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<ServiceWorkerRegistration>;
      if (customEvent.detail) {
        setUpdateRegistration(customEvent.detail);
      }
    };

    window.addEventListener('sw-update-available', handleUpdate);
    return () => window.removeEventListener('sw-update-available', handleUpdate);
  }, []);

  const handleApplyUpdate = () => {
    if (updateRegistration && updateRegistration.waiting) {
      updateRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  };

  return (
    <aside aria-label="Status notifications" className="fixed top-2.5 sm:top-4 inset-x-3 sm:inset-x-auto sm:start-1/2 sm:-translate-x-1/2 z-50 pointer-events-none flex flex-col items-center gap-2">
      <AnimatePresence>
        {/* 1. Offline Mode Banner */}
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="pointer-events-auto px-4 py-2.5 rounded-full bg-neutral-950/95 backdrop-blur-xl border border-amber-500/40 text-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.25)] flex items-center gap-2.5 text-xs sm:text-sm font-bold"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
            </span>
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {language === 'ar'
                ? 'وضع عدم الاتصال 📡 — خطتك ومحطاتك محفوظة وتعمل أوفلاين'
                : 'Offline Mode 📡 — Your saved itinerary works offline'}
            </span>
          </motion.div>
        )}

        {/* 2. New Version Update Banner */}
        {updateRegistration && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="pointer-events-auto px-4 py-2 rounded-2xl bg-gradient-to-r from-[#0C121E] to-[#121A2B] backdrop-blur-xl border border-[#E5C378]/50 text-white shadow-[0_0_30px_rgba(229,195,120,0.3)] flex items-center gap-3 text-xs sm:text-sm font-bold"
          >
            <Sparkles className="w-4 h-4 text-[#E5C378] shrink-0" />
            <span>
              {language === 'ar'
                ? 'يتوفر إصدار جديد ومحدث من جداول 🚀'
                : 'A fresh update of Jadawel is ready 🚀'}
            </span>
            <button
              type="button"
              onClick={handleApplyUpdate}
              className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#DF9F3D] to-[#E5C378] text-[#0A0D12] text-xs font-black shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تحديث الآن' : 'Update'}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};
