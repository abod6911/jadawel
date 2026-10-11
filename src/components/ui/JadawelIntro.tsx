'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAssetUrl } from '@/utils/paths';

const JEDDAH_CARDS = [
  { url: getAssetUrl('/images/realms/obhur-marina.jpg'), label: 'مارينا وشواطئ أبحر 🌊' },
  { url: getAssetUrl('/images/realms/albalad-heritage.jpg'), label: 'رواشين وتراث البلد 🏛️' },
  { url: getAssetUrl('/images/realms/alrawdah-coffee.jpg'), label: 'كافيهات الروضة المختصة ☕' }
];

export const JadawelIntro: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(1);
  const [cardIdx, setCardIdx] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined' && sessionStorage.getItem('jadawel_intro_seen')) {
      setIsDone(true);
      if (onComplete) onComplete();
      return;
    }

    document.body.style.overflow = 'hidden';
    const duration = 2000;
    const startTime = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const val = Math.floor(Math.pow(progress, 0.85) * 100);
      setCount(Math.max(1, val));
      setCardIdx(Math.floor(progress * JEDDAH_CARDS.length) % JEDDAH_CARDS.length);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setIsRevealing(true);
        setTimeout(() => {
          setIsDone(true);
          document.body.style.overflow = '';
          try {
            sessionStorage.setItem('jadawel_intro_seen', 'true');
          } catch (e) {
            // Ignore session storage errors
          }
          if (onComplete) onComplete();
        }, 650);
      }
    };

    frameId = requestAnimationFrame(tick);

    // Hard failsafe to guarantee page unlock
    const failsafe = setTimeout(() => {
      setIsDone(true);
      document.body.style.overflow = '';
      if (onComplete) onComplete();
    }, 3200);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(failsafe);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  if (!mounted || isDone) return null;

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="clean-intro-overlay"
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#0B0D12] select-none overflow-hidden"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,195,120,0.12)_0%,rgba(18,21,28,0.06)_40%,transparent_70%)] pointer-events-none" />

          {/* Central Deck Container */}
          <motion.div
            className="relative flex items-center justify-center w-[280px] h-[360px]"
            animate={
              isRevealing
                ? { scale: 2.2, opacity: 0, filter: 'blur(16px)' }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            {JEDDAH_CARDS.map((card, idx) => {
              const isTop = cardIdx === idx;
              return (
                <motion.div
                  key={idx}
                  className="absolute w-[180px] h-[240px] rounded-2xl overflow-hidden shadow-2xl border border-[#E5C378]/30 bg-[#12151C]"
                  animate={{
                    scale: isTop ? 1.05 : 0.94,
                    rotate: isTop ? 0 : idx % 2 === 0 ? -6 : 6,
                    opacity: isTop ? 1 : 0.4,
                    zIndex: isTop ? 10 : idx
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                >
                  <img
                    src={card.url}
                    alt={card.label}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover brightness-[0.85] contrast-[1.1]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12]/90 via-transparent to-transparent" />
                  <span className="absolute bottom-3 inset-x-0 text-center text-[11px] font-bold text-white/95">
                    {card.label}
                  </span>
                </motion.div>
              );
            })}

            {/* Wordmark & Clean Minimalist Ticker */}
            <div className="absolute z-20 flex flex-col items-center justify-center px-6 py-3.5 backdrop-blur-2xl bg-[#0E1118]/90 border border-[#E5C378]/35 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.9)]">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-wider">
                جداول <span className="text-[#E5C378] text-[10px] font-bold tracking-widest uppercase">JADAWEL</span>
              </span>
              <div className="flex items-center justify-between w-full mt-2.5 pt-2 border-t border-white/10">
                <span className="text-[10px] text-slate-300">جاري تجهيز المسار</span>
                <span className="font-mono text-xs font-bold text-[#E5C378]">
                  {String(count).padStart(3, '0')}%
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JadawelIntro;
