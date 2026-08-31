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
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#090B0E] select-none overflow-hidden"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,169,98,0.06)_0%,transparent_70%)] pointer-events-none" />

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
                  className="absolute w-[180px] h-[240px] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-[#0F141C]"
                  animate={{
                    scale: isTop ? 1.05 : 0.94,
                    rotate: isTop ? 0 : idx % 2 === 0 ? -6 : 6,
                    opacity: isTop ? 1 : 0.4,
                    zIndex: isTop ? 10 : idx
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                >
                  <img src={card.url} alt="" className="w-full h-full object-cover brightness-[0.8] contrast-[1.1]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 inset-x-0 text-center text-[11px] font-medium text-white/90">
                    {card.label}
                  </span>
                </motion.div>
              );
            })}

            {/* Wordmark & Clean Minimalist Ticker */}
            <div className="absolute z-20 flex flex-col items-center justify-center px-6 py-3.5 backdrop-blur-xl bg-black/70 border border-white/20 rounded-2xl shadow-2xl">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-wider">
                جداول <span className="text-[#E5A962] text-[10px] font-bold tracking-widest uppercase">JADAWEL</span>
              </span>
              <div className="flex items-center justify-between w-full mt-2.5 pt-2 border-t border-white/10">
                <span className="text-[10px] text-white/60">جاري تجهيز المسار</span>
                <span className="font-mono text-xs font-bold text-[#E5A962]">
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
