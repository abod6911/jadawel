import React from 'react';

interface RawashinPatternProps {
  className?: string;
  opacity?: number;
}

/**
 * RawashinPattern — Authentic Hijazi Mashrabiya / Rawasheen Geometric Motif
 * Ultra-lightweight inline vector pattern (< 1.5 KB) with subtle 3.5% default opacity.
 */
export const RawashinPattern: React.FC<RawashinPatternProps> = ({
  className = '',
  opacity = 0.035,
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
      style={{ opacity }}
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="120"
        height="120"
        viewBox="0 0 120 120"
      >
        <defs>
          <pattern
            id="hijazi-rawashin-grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            {/* Central 8-Point Rosette / Star */}
            <path
              d="M30 6 L36 21 L51 15 L45 30 L60 36 L45 42 L51 57 L36 51 L30 66 L24 51 L9 57 L15 42 L0 36 L15 30 L9 15 L24 21 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
            />
            {/* Outer Diamond Interlock */}
            <path
              d="M30 0 L60 30 L30 60 L0 30 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            {/* Corner Lattice Crosses */}
            <path
              d="M0 0 L10 10 M60 0 L50 10 M0 60 L10 50 M60 60 L50 50"
              stroke="currentColor"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hijazi-rawashin-grid)" />
      </svg>
    </div>
  );
};

export default RawashinPattern;
