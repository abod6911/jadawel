'use client';

import React, { useEffect, useRef, useState } from 'react';

interface NumberTickerProps {
  value: number;
  direction?: 'up' | 'down';
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  startValue?: number;
}

/**
 * NumberTicker - High-Performance Smooth Number Odometer with IntersectionObserver
 * Starts counting from a realistic baseline when the element enters the viewport,
 * never displaying a jarring "0" on initial paint.
 */
export const NumberTicker: React.FC<NumberTickerProps> = ({
  value,
  direction = 'up',
  delay = 0,
  className = '',
  prefix = '',
  suffix = '',
  startValue,
}) => {
  // Realistic initial display value (never zero for non-zero metrics)
  const initialBase = startValue !== undefined
    ? startValue
    : direction === 'down'
      ? value
      : value > 100
        ? Math.floor(value * 0.82)
        : Math.max(1, Math.floor(value * 0.5));

  const [displayValue, setDisplayValue] = useState<number>(initialBase);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // If user prefers reduced motion, jump straight to target value
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      setDisplayValue(value);
      return;
    }

    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      setDisplayValue(value);
      return;
    }

    let animationFrameId: number;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.disconnect();

          const duration = 1600; // 1.6s smooth glide
          let startTime: number | null = null;
          const startNum = initialBase;

          const timeout = setTimeout(() => {
            const step = (timestamp: number) => {
              if (!startTime) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / duration, 1);
              // Ease-out expo curve for luxury feel
              const ease = 1 - Math.pow(2, -10 * progress);
              const currentVal = Math.round(startNum + (value - startNum) * ease);
              setDisplayValue(currentVal);

              if (progress < 1) {
                animationFrameId = requestAnimationFrame(step);
              } else {
                setDisplayValue(value);
              }
            };

            animationFrameId = requestAnimationFrame(step);
          }, delay * 1000);

          return () => clearTimeout(timeout);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [value, delay, hasAnimated, initialBase]);

  return (
    <span ref={ref} className={`inline-block tabular-nums font-mono ${className}`}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};

export default NumberTicker;
