'use client';

import React, { useState, useRef, useMemo } from 'react';
import { motion, useAnimate, AnimationOptions } from 'framer-motion';

interface RandomLetterSwapProps {
  label: string;
  reverse?: boolean;
  transition?: AnimationOptions;
  staggerDuration?: number;
  className?: string;
  onClick?: () => void;
  mode?: 'auto' | 'letter' | 'word';
}

/**
 * RandomLetterSwap - World-Class Kinetic Typography Component
 * Inspired by FancyComponents (https://www.fancycomponents.dev/docs/components/text/random-letter-swap)
 * Engineered with native RTL Arabic & Latin bilingual support.
 */
export const RandomLetterSwap: React.FC<RandomLetterSwapProps> = ({
  label,
  reverse = true,
  transition = {
    type: 'spring',
    duration: 0.7,
    bounce: 0.2,
  },
  staggerDuration = 0.025,
  className = '',
  onClick,
  mode = 'auto',
}) => {
  const [scope, animate] = useAnimate();
  const [isBlocked, setIsBlocked] = useState(false);

  // Determine whether to split by character or by word.
  // Arabic connected words with multiple letters look best either word-swapped
  // or letter-swapped with tight tracking.
  const isArabic = useMemo(() => /[\u0600-\u06FF]/.test(label), [label]);
  const splitBy = mode === 'auto' ? (isArabic && label.length > 12 ? 'word' : 'letter') : mode;

  const tokens = useMemo(() => {
    if (splitBy === 'word') {
      return label.split(' ').map((w, idx, arr) => (idx < arr.length - 1 ? `${w} ` : w));
    }
    return label.split('');
  }, [label, splitBy]);

  // Pre-generate shuffled indices for non-linear, organic stagger
  const shuffledIndices = useMemo(() => {
    return Array.from({ length: tokens.length }, (_, i) => i).sort(() => Math.random() - 0.5);
  }, [tokens.length]);

  const handleHoverStart = () => {
    if (isBlocked) return;
    setIsBlocked(true);

    for (let i = 0; i < tokens.length; i++) {
      const idx = shuffledIndices[i];
      const delay = i * staggerDuration;

      // Animate primary letter out
      animate(
        `.fancy-char-${idx}`,
        { y: reverse ? '100%' : '-100%', opacity: [1, 0.2, 0] },
        { ...transition, delay }
      ).then(() => {
        animate(`.fancy-char-${idx}`, { y: 0, opacity: 1 }, { duration: 0 });
      });

      // Animate secondary letter in
      animate(
        `.fancy-char-secondary-${idx}`,
        { top: '0%', opacity: [0, 0.8, 1] },
        { ...transition, delay }
      ).then(() => {
        animate(
          `.fancy-char-secondary-${idx}`,
          { top: reverse ? '-100%' : '100%', opacity: 0 },
          { duration: 0 }
        );
        if (i === tokens.length - 1) {
          setIsBlocked(false);
        }
      });
    }
  };

  return (
    <motion.span
      ref={scope}
      onHoverStart={handleHoverStart}
      onClick={onClick}
      className={`relative inline-flex items-center overflow-hidden cursor-pointer select-none ${className}`}
    >
      <span className="sr-only">{label}</span>

      {tokens.map((token, i) => (
        <span
          key={i}
          aria-hidden={true}
          className="relative inline-flex whitespace-pre overflow-hidden"
        >
          {/* Primary Glyph */}
          <motion.span className={`relative fancy-char-${i} inline-block leading-normal`}>
            {token}
          </motion.span>

          {/* Secondary Glyph (Sliding In) */}
          <motion.span
            className={`absolute inset-x-0 fancy-char-secondary-${i} inline-block leading-normal pointer-events-none`}
            style={{ top: reverse ? '-100%' : '100%', opacity: 0 }}
          >
            {token}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

export default RandomLetterSwap;
