'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntroStore } from '@/store/useIntroStore';

const JEDDAH_SNAPS = [
  {
    url: 'https://images.unsplash.com/photo-1578895210405-907db486c111?auto=format&fit=crop&q=80&w=1000',
    label: 'رواشين البلد التاريخية',
    en: 'Al-Balad Heritage',
  },
  {
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1000',
    label: 'غروب ومارينا أبحر',
    en: 'Obhur Sunset & Marina',
  },
  {
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1000',
    label: 'كافيهات الروضة المختصة',
    en: 'Al-Rawdah Specialty Coffee',
  },
  {
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000',
    label: 'واجهة جدة البحرية',
    en: 'Jeddah Waterfront Dining',
  },
];

export const JadawelPreloader: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [count, setCount] = useState(1);
  const [activeCard, setActiveCard] = useState(0);
  const [preloaderPhase, setPreloaderPhase] = useState<'shuffling' | 'locked' | 'expanding' | 'done'>('shuffling');
  const { setPhase, markIntroSeen } = useIntroStore();

  useEffect(() => {
    // Check if user already experienced intro this session
    const seen = typeof window !== 'undefined' && sessionStorage.getItem('jadawel_intro_seen');
    if (seen) {
      setPreloaderPhase('done');
      setPhase('interactive');
      if (onComplete) onComplete();
      return;
    }

    setPhase('preloader');

    // Paced counter calculation: Reaches 100 in ~2.2 seconds with natural deceleration
    const startTime = Date.now();
    const duration = 2200; // 2.2s

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Decelerating easing progression (starts briskly, decelerates gracefully to 100%)
      const easeProgress = 1 - Math.pow(1 - progress, 2.5);
      const currentVal = Math.floor(easeProgress * 100);
      setCount(Math.max(1, Math.min(100, currentVal)));

      if (progress >= 1) {
        clearInterval(timer);
        setCount(100);
        setPreloaderPhase('locked');
        setPhase('locked');

        // Phase 2 Climax: Lock & Geometric Split trigger
        setTimeout(() => {
          setPreloaderPhase('expanding');
          setPhase('expanding');

          // Signal Hero Section to begin entrance right as curtain wipes
          setTimeout(() => {
            setPhase('hero_entering');
          }, 350);

          // Phase 3: Complete & Clean handover
          setTimeout(() => {
            setPreloaderPhase('done');
            markIntroSeen();
            if (onComplete) onComplete();
          }, 850);
        }, 350);
      }
    }, 24);

    // Card cycle interval (smooth shuffle cadence)
    const cardCycle = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % JEDDAH_SNAPS.length);
    }, 280);

    return () => {
      clearInterval(timer);
      clearInterval(cardCycle);
    };
  }, [onComplete, setPhase, markIntroSeen]);

  if (preloaderPhase === 'done') return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#081B26] overflow-hidden select-none"
        initial={{ opacity: 1 }}
        exit={{
          opacity: 0,
          transition: { duration: 0.6, ease: [0.85, 0, 0.15, 1] },
        }}
      >
        {/* Deep Radial Vignette & Mesh */}
        <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none" />
        <div className="absolute inset-0 bg-mesh-abyss opacity-50 pointer-events-none" />
        <div className="absolute inset-0 rawashin-lattice opacity-[0.03] pointer-events-none" />

        {/* Full-Screen Expanding Morph & Curtain Wipe Layers */}
        {preloaderPhase === 'expanding' && (
          <>
            {/* Layer 1: Coral Contour Curtain */}
            <motion.div
              className="absolute inset-0 bg-[#F46F52] z-30 pointer-events-none"
              initial={{ scaleY: 0, originY: 0.5 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.65, ease: [0.85, 0, 0.15, 1] }}
            />
            {/* Layer 2: Warm Ivory Accent Slice */}
            <motion.div
              className="absolute inset-0 bg-[#FAF8F3] z-35 pointer-events-none"
              initial={{ scaleX: 0, originX: 0.5 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.85, 0, 0.15, 1] }}
            />
            {/* Layer 3: Main Velvet Canvas Handover */}
            <motion.div
              className="absolute inset-0 bg-[#081B26] z-40 pointer-events-none"
              initial={{ scaleY: 0, originY: 0.5 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.75, delay: 0.12, ease: [0.85, 0, 0.15, 1] }}
            />
          </>
        )}

        {/* Central Prominent Card Deck Container */}
        <motion.div
          className="relative flex items-center justify-center w-[280px] h-[380px] sm:w-[340px] sm:h-[460px]"
          animate={
            preloaderPhase === 'expanding'
              ? { scale: 3.2, opacity: 0, filter: 'blur(12px)' }
              : {}
          }
          transition={{ duration: 0.65, ease: [0.85, 0, 0.15, 1] }}
        >
          {/* Card Stack */}
          {JEDDAH_SNAPS.map((snap, idx) => {
            const isTop = activeCard === idx;
            const rotationAngle = (idx % 2 === 0 ? -1 : 1) * (9 + (idx % 3) * 2);

            return (
              <motion.div
                key={idx}
                className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 bg-abyss-900"
                animate={
                  preloaderPhase === 'locked' || preloaderPhase === 'expanding'
                    ? { rotate: 0, scale: 1, zIndex: 10 }
                    : {
                        scale: isTop ? 1.05 : 0.94 - idx * 0.02,
                        rotate: isTop ? 0 : rotationAngle,
                        y: isTop ? 0 : idx * 5,
                        zIndex: isTop ? 10 : 5 - idx,
                        opacity: isTop ? 1 : 0.45,
                      }
                }
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 22,
                }}
              >
                <img
                  src={snap.url}
                  alt={snap.label}
                  className="w-full h-full object-cover brightness-[0.9] contrast-[1.1]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-4 inset-x-0 text-center px-3">
                  <span className="text-xs sm:text-sm font-black text-pearl tracking-wide block drop-shadow-md">
                    {snap.label}
                  </span>
                  <span className="text-[10px] text-gold-400 font-bold tracking-wider uppercase block mt-0.5">
                    {snap.en}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* Central Monolithic Typography & Decelerating Counter */}
          <motion.div
            className="absolute z-20 flex flex-col items-center justify-center p-6 sm:p-7 backdrop-blur-2xl bg-black/60 border border-white/25 rounded-3xl shadow-glow-gold min-w-[240px] sm:min-w-[280px]"
            animate={
              preloaderPhase === 'expanding'
                ? { scale: 1.6, opacity: 0, y: -20 }
                : {}
            }
            transition={{ duration: 0.5, ease: [0.85, 0, 0.15, 1] }}
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl sm:text-5xl font-black tracking-wider text-pearl drop-shadow-lg">
                جداول
              </span>
              <span className="bg-[#F46F52] text-white text-[11px] font-black px-2.5 py-1 rounded-lg tracking-widest uppercase shadow-glow-coral">
                JADAWEL
              </span>
            </div>

            {/* Counter Bar & Status */}
            <div className="flex items-center justify-between w-full mt-4 pt-3 border-t border-white/15">
              <span className="text-[11px] sm:text-xs text-pearl-muted font-medium">
                {preloaderPhase === 'locked' ? '✨ اكتملت خطط جدة' : 'جاري ترتيب المسارات...'}
              </span>
              <span className="font-mono text-sm sm:text-base font-black text-[#F6C77A] tracking-wider">
                {String(count).padStart(3, '0')}%
              </span>
            </div>

            {/* Glowing Linear Progress Tracker */}
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mt-2.5">
              <div
                className="h-full bg-gradient-to-r from-teal-400 via-coral-500 to-gold-400 rounded-full transition-all duration-75 shadow-glow-gold"
                style={{ width: `${count}%` }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
