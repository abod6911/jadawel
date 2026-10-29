'use client';

import React, { useRef, useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface MagneticButtonProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  strength?: number;
  disabled?: boolean;
}

/**
 * MagneticButton - Cursor-following Magnetic Attraction Physics
 * Gives high-impact CTA buttons a physical Apple / Awwwards tactile sensation.
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  distance = 0.3,
  strength = 1,
  disabled = false,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => {
    if (disabled || !ref.current) return;
    rectRef.current = ref.current.getBoundingClientRect();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return;
    if (!rectRef.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
    const { clientX, clientY } = e;
    const { left, top, width, height } = rectRef.current;
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    setPosition({
      x: (clientX - centerX) * distance * strength,
      y: (clientY - centerY) * distance * strength,
    });
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 280, damping: 22, mass: 0.4 }}
      className={`inline-block ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;
