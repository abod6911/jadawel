'use client';

import React from 'react';

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  anchor?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

/**
 * BorderBeam - Cinematic Traveling Laser Edge Glow
 * Inspired by Magic UI & Fancy Components.
 * Renders an animated beam of light tracking the perimeter of any card or container.
 */
export const BorderBeam: React.FC<BorderBeamProps> = ({
  className = '',
  size = 220,
  duration = 10,
  borderWidth = 1.5,
  anchor = 90,
  colorFrom = '#F6C77A',
  colorTo = '#4E9F96',
  delay = 0,
}) => {
  return (
    <div
      style={
        {
          '--size': `${size}px`,
          '--duration': `${duration}s`,
          '--anchor': `${anchor}%`,
          '--border-width': `${borderWidth}px`,
          '--color-from': colorFrom,
          '--color-to': colorTo,
          '--delay': `-${delay}s`,
        } as React.CSSProperties
      }
      className={`pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width))_solid_transparent] ![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)] after:absolute after:aspect-square after:w-[var(--size)] after:animate-border-beam after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:var(--anchor)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)))] ${className}`}
    />
  );
};

export default BorderBeam;
