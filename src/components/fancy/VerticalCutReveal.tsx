'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface VerticalCutRevealProps {
  children: string;
  className?: string;
  delay?: number;
  staggerDuration?: number;
  reverse?: boolean;
}

/**
 * VerticalCutReveal - Cinematic Staggered Text Entrance
 * Inspired by FancyComponents (https://www.fancycomponents.dev/docs/components/text/vertical-cut-reveal)
 * Text elements rise through an overflow clip container with spring motion.
 */
export const VerticalCutReveal: React.FC<VerticalCutRevealProps> = ({
  children,
  className = '',
  delay = 0,
  staggerDuration = 0.08,
  reverse = false,
}) => {
  const words = children.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDuration,
      },
    },
  };

  const wordVariants = {
    hidden: {
      y: reverse ? '-120%' : '120%',
      opacity: 0,
    },
    visible: {
      y: '0%',
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 24,
        stiffness: 180,
      },
    },
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`inline-flex flex-wrap items-center justify-center gap-x-[0.3em] gap-y-[0.1em] overflow-visible ${className}`}
    >
      {words.map((word, idx) => (
        <span key={idx} className="relative inline-block overflow-hidden py-1">
          <motion.span variants={wordVariants} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

export default VerticalCutReveal;
