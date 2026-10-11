'use client';

import React, { useState, useEffect, useRef } from 'react';

interface DecryptionScrambleProps {
  text: string;
  speed?: number;
  triggerOnHover?: boolean;
  className?: string;
}

const SCRAMBLE_GLYPHS = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي0123456789◆▲▼■✦';

/**
 * DecryptionScramble - Cyber-Luxury Text Decryption Effect
 * Flips through random glyphs before resolving into the final text.
 */
export const DecryptionScramble: React.FC<DecryptionScrambleProps> = ({
  text,
  speed = 35,
  triggerOnHover = true,
  className = '',
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startScramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const maxIterations = text.length;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return text[index];
            }
            return SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
          })
          .join('');
      });

      iteration += 1 / 2;

      if (iteration >= maxIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, speed);
  };

  useEffect(() => {
    startScramble();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  return (
    <span
      onMouseEnter={() => triggerOnHover && startScramble()}
      className={`font-mono inline-block select-none ${className}`}
    >
      {displayText}
    </span>
  );
};

export default DecryptionScramble;
