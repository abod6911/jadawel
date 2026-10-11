'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TextRotateProps {
  texts: string[];
  interval?: number;
  className?: string;
}

/**
 * TextRotate - Smooth Kinetic Phrase Rotator
 * Inspired by FancyComponents (https://fancycomponents.dev/components/text-rotate)
 * Seamlessly transitions between phrases with spring physics and gentle motion blur,
 * while preserving 100% cursive typography integrity for Arabic and bilingual content.
 */
export const TextRotate: React.FC<TextRotateProps> = ({
  texts,
  interval = 3500,
  className = '',
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (texts.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, interval);
    return () => clearInterval(timer);
  }, [texts, interval]);

  return (
    <span className={`relative inline-flex items-center overflow-hidden h-[1.35em] align-middle ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: '110%', opacity: 0, filter: 'blur(3px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-110%', opacity: 0, filter: 'blur(3px)' }}
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 26,
            mass: 0.6,
          }}
          className="inline-block whitespace-nowrap"
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default TextRotate;
