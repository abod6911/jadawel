'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAssetUrl } from '@/utils/paths';

const JEDDAH_SNAPS = [
  { url: getAssetUrl('/images/realms/obhur-marina.jpg'), label: 'واجهة ومارينا أبحر 🌊' },
  { url: getAssetUrl('/images/realms/albalad-heritage.jpg'), label: 'رواشين البلد العتيقة 🏛️' },
  { url: getAssetUrl('/images/realms/alrawdah-coffee.jpg'), label: 'كافيهات الروضة المختصة ☕' }
];

export const JadawelIntro: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(1);
  const [activeCard, setActiveCard] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Bypass if already seen in current session
    if (typeof window !== 'undefined' && sessionStorage.getItem('jadawel_intro_seen')) {
      setIsDone(true);
      if (onComplete) onComplete();
      return;
    }

    // Lock body scroll during intro
    document.body.style.overflow = 'hidden';

    const duration = 2200; // 2.2s total count duration
    const startTime = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      
      // Decelerating easing calculation
      const easeProgress = 1 - Math.pow(1 - rawProgress, 2.2);
      const easedProgress = Math.floor(easeProgress * 100);
      setProgress(Math.max(1, Math.min(100, easedProgress)));

      // Cycle card index based on elapsed progress
      const cardIdx = Math.floor(rawProgress * JEDDAH_SNAPS.length) % JEDDAH_SNAPS.length;
      setActiveCard(cardIdx);

      if (rawProgress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        // Trigger reveal wipe
        setIsRevealing(true);
        setTimeout(() => {
          setIsDone(true);
          document.body.style.overflow = '';
          try {
            sessionStorage.setItem('jadawel_intro_seen', 'true');
          } catch (e) {
            // Ignore sessionStorage restrictions if any
          }
          if (onComplete) onComplete();
        }, 750);
      }
    };

    frameId = requestAnimationFrame(tick);

    // Hard Failsafe: Forces site unlock after 3.2s regardless of frame stalls
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
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#090B0E] select-none"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
            transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] }
          }}
        >
          {/* Ambient Background Mesh */}
          <div className="absolute inset-0 bg-mesh-abyss opacity-70 pointer-events-none" />

          {/* Expanding Morph Layer */}
          {isRevealing && (
            <motion.div
              className="absolute inset-0 bg-[#E5A962] z-30 pointer-events-none"
              initial={{ scaleY: 0, originY: 0.5 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
            />
          )}

          {/* Central Card Stack */}
          <motion.div
            className="relative flex items-center justify-center w-[280px] h-[380px] sm:w-[320px] sm:h-[440px]"
            animate={
              isRevealing
                ? { scale: 2, opacity: 0, filter: 'blur(10px)' }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            {JEDDAH_SNAPS.map((snap, idx) => {
              const isTop = activeCard === idx;
              const rotation = idx % 2 === 0 ? -7 : 7;

              return (
                <motion.div
                  key={idx}
                  className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-[#0F141C]"
                  animate={{
                    scale: isTop ? 1.04 : 0.94,
                    rotate: isTop ? 0 : rotation,
                    zIndex: isTop ? 10 : idx,
                    opacity: isTop ? 1 : 0.45
                  }}
                  transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                >
                  <img
                    src={snap.url}
                    alt={snap.label}
                    className="w-full h-full object-cover brightness-[0.85] contrast-[1.1]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                  <span className="absolute bottom-4 inset-x-0 text-center text-xs sm:text-sm font-bold text-white drop-shadow-md">
                    {snap.label}
                  </span>
                </motion.div>
              );
            })}

            {/* Brand Logo & Smooth Counter Box */}
            <div className="absolute z-20 flex flex-col items-center justify-center px-6 py-4 backdrop-blur-xl bg-black/70 border border-white/20 rounded-2xl shadow-2xl min-w-[210px]">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-wide">
                جداول <span className="text-[#E5A962] text-[10px] font-bold tracking-widest uppercase">JADAWEL</span>
              </span>
              <div className="flex items-center justify-between w-full mt-3 pt-2.5 border-t border-white/15">
                <span className="text-[10px] text-white/70 font-medium">جاري تجهيز المسار</span>
                <span className="font-mono text-sm font-bold text-[#E5A962] tracking-wider">
                  {String(progress).padStart(3, '0')}%
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
