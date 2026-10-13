'use client';

import React, { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import AnimatedPathText from '@/components/fancy/text/text-along-path';

export default function TextAlongPathDemo() {
  // Rounded rectangle path from the official Fancy documentation
  const rectPath =
    'M 20,20 L 180,20 A 20,20 0 0,1 200,40 L 200,160 A 20,20 0 0,1 180,180 L 20,180 A 20,20 0 0,1 0,160 L 0,40 A 20,20 0 0,1 20,20';

  const [buttonState, setButtonState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [email, setEmail] = useState('');

  const buttonCopy = {
    idle: 'Subscribe',
    loading: (
      <motion.div className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
    ),
    success: 'Done ✓',
  } as const;

  const handleSubmit = useCallback(() => {
    if (buttonState === 'success') return;
    setButtonState('loading');

    setTimeout(() => {
      setButtonState('success');
    }, 1750);

    setTimeout(() => {
      setButtonState('idle');
      setEmail('');
    }, 3500);
  }, [buttonState]);

  return (
    <div className="w-full min-h-[380px] flex justify-center items-center text-[#0015ff] relative bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xl p-4 select-none">
      <AnimatedPathText
        path={rectPath}
        svgClassName="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-2 sm:py-8 w-full h-full max-w-[420px] max-h-[320px] pointer-events-none"
        viewBox="-20 10 240 180"
        text="JOIN THE WAITLIST ✉ JOIN THE WAITLIST ✉ JOIN THE WAITLIST ✉ JOIN THE WAITLIST ✉ JOIN THE WAITLIST ✉ "
        textClassName="text-[10.6px] lowercase font-mono font-bold tracking-wider fill-[#0015ff]"
        duration={20}
        preserveAspectRatio="none"
        textAnchor="start"
      />

      {/* Centered input and action button */}
      <div className="relative z-10 w-64 sm:w-80 p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-xl">
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border-2 border-[#0015ff] focus:outline-none focus:ring-2 focus:ring-[#0015ff]/40 font-mono text-xs sm:text-sm placeholder:text-[#0015ff]/70 rounded-lg bg-white text-[#0015ff]"
          />
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={buttonState === 'loading' || !email.trim()}
            className="w-full px-3 py-2 h-10 sm:h-11 sm:px-8 sm:py-2 bg-[#0015ff] text-white hover:bg-[#0015ff]/90 transition-colors font-mono font-bold text-xs sm:text-sm rounded-lg shadow-md cursor-pointer flex items-center justify-center"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 25 }}
                key={buttonState}
              >
                {buttonCopy[buttonState]}
              </motion.span>
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </div>
  );
}
