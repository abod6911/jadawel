'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAssetUrl } from '@/utils/paths';

const JEDDAH_SNAPS = [
  getAssetUrl('/images/realms/obhur-marina.jpg'),
  getAssetUrl('/images/realms/albalad-heritage.jpg'),
  getAssetUrl('/images/realms/alrawdah-coffee.jpg'),
  getAssetUrl('/images/places/north-corniche.jpg')
];

export const JadawelIntro: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<'SHUFFLE' | 'SCATTER' | 'LOCK' | 'COMPLETE'>('SHUFFLE');
  const [count, setCount] = useState(1);
  const [cardIdx, setCardIdx] = useState(0);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined' && sessionStorage.getItem('jadawel_intro_seen')) {
      setStage('COMPLETE');
      if (onComplete) onComplete();
      return;
    }

    document.body.style.overflow = 'hidden';
    const duration = 1900;
    const start = Date.now();

    const ticker = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const val = Math.floor(Math.pow(progress, 0.85) * 100);
      setCount(Math.max(1, Math.min(100, val)));
      setCardIdx((prev) => (prev + 1) % JEDDAH_SNAPS.length);

      if (progress >= 1) {
        clearInterval(ticker);
        setCount(100);
        setStage('SCATTER');

        setTimeout(() => {
          setStage('LOCK');
          setTimeout(() => {
            setStage('COMPLETE');
            document.body.style.overflow = '';
            try {
              sessionStorage.setItem('jadawel_intro_seen', 'true');
            } catch (e) {
              // Ignore session storage errors
            }
            if (onComplete) onComplete();
          }, 650);
        }, 450);
      }
    }, 28);

    // Absolute failsafe to guarantee page unlock
    const failsafe = setTimeout(() => {
      setStage('COMPLETE');
      document.body.style.overflow = '';
      if (onComplete) onComplete();
    }, 3500);

    return () => {
      clearInterval(ticker);
      clearTimeout(failsafe);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {stage !== 'COMPLETE' && (
        <motion.div
          key="editorial-intro-curtain"
          className={`fixed inset-0 z-[999999] flex items-center justify-center select-none overflow-hidden transition-colors duration-200 ${
            stage === 'SCATTER' || stage === 'LOCK' ? 'bg-[#FAF8F3]' : 'bg-[#090B0E]'
          }`}
          initial={{ opacity: 1 }}
          exit={{
            clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] }
          }}
        >
          {/* Phase 1: Card Stack + Counter */}
          {stage === 'SHUFFLE' && (
            <div className="relative flex items-center justify-center w-[280px] h-[360px]">
              {JEDDAH_SNAPS.map((img, idx) => {
                const isTop = cardIdx === idx;
                return (
                  <motion.div
                    key={idx}
                    className="absolute w-[170px] h-[230px] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black"
                    animate={{
                      scale: isTop ? 1.05 : 0.94,
                      rotate: isTop ? 0 : idx % 2 === 0 ? -7 : 7,
                      opacity: isTop ? 1 : 0.4,
                      zIndex: isTop ? 10 : idx
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  >
                    <img src={img} alt="Jeddah" className="w-full h-full object-cover brightness-90" />
                  </motion.div>
                );
              })}

              <div className="absolute z-20 flex items-center justify-center">
                <span className="font-black text-4xl sm:text-5xl tracking-widest text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
                  JADAWEL<span className="text-[#F46F52] text-xs align-top ml-1">®</span>
                </span>
                <span className="absolute -top-7 -right-8 font-mono text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded backdrop-blur-md">
                  {String(count).padStart(3, '0')}%
                </span>
              </div>
            </div>
          )}

          {/* Phase 2: Geometric Shapes Scatter (Ivory BG #FAF8F3) */}
          {stage === 'SCATTER' && (
            <motion.div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="absolute w-20 h-10 bg-[#F46F52] rounded-t-full"
                initial={{ x: 0, scale: 0.5 }}
                animate={{ x: -200, scale: 1.1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.div
                className="absolute flex flex-col items-center"
                initial={{ y: 0, scale: 0.5 }}
                animate={{ y: -90, scale: 1.1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="w-24 h-6 bg-[#F46F52] rounded-sm" />
                <div className="w-6 h-10 bg-[#F46F52] rounded-sm" />
              </motion.div>
              <motion.div
                className="absolute w-6 h-24 bg-[#F46F52] rounded-sm"
                initial={{ x: 0, scale: 0.5 }}
                animate={{ x: 200, scale: 1.1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.div>
          )}

          {/* Phase 3: Brand Lock (Editorial Ivory) */}
          {stage === 'LOCK' && (
            <motion.div
              className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 bg-[#FAF8F3]"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
            >
              <div className="w-full text-center border-b border-black/10 pb-4">
                <h1 className="text-[13vw] font-black text-[#F46F52] tracking-tighter leading-none">
                  JADAWEL<span className="text-black text-2xl align-top">®</span>
                </h1>
              </div>
              <div className="flex justify-between font-mono text-[10px] sm:text-xs text-black/60 uppercase">
                <span>// OUTING PLANNER</span>
                <span>// JEDDAH, KSA</span>
                <span>// 2026 EDITION</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JadawelIntro;
