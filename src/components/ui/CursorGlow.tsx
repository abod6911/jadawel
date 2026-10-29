'use client';

import React, { useEffect, useRef } from 'react';

export const CursorGlow: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on desktop pointer-capable devices (skip touch devices)
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const glowEl = glowRef.current;
    if (!glowEl) return;

    let isVisible = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        glowEl.style.opacity = '1';
        isVisible = true;
      }
      // Zero React re-renders: pure hardware-accelerated GPU transform
      glowEl.style.transform = `translate3d(${e.clientX - 325}px, ${e.clientY - 325}px, 0)`;
    };

    const handleMouseLeave = () => {
      glowEl.style.opacity = '0';
      isVisible = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 w-[650px] h-[650px] rounded-full z-30 opacity-0 transition-opacity duration-300 will-change-transform"
      style={{
        background:
          'radial-gradient(circle, rgba(229, 169, 98, 0.055) 0%, rgba(78, 159, 150, 0.02) 45%, transparent 70%)',
      }}
    />
  );
};

export default CursorGlow;
