'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { checkboxCheckVariants, MOTION_SPRINGS } from '@/lib/motion';

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const AnimatedCheckbox: React.FC<AnimatedCheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
}) => {
  return (
    <label
      className={`inline-flex items-center gap-3 select-none cursor-pointer group ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />

        {/* Outer Checkbox Box with tactile spring bounce */}
        <motion.div
          animate={{
            scale: checked ? [0.85, 1.08, 1] : 1,
            borderColor: checked ? '#E5A962' : 'rgba(255, 255, 255, 0.2)',
            backgroundColor: checked ? 'rgba(229, 169, 98, 0.15)' : 'rgba(15, 20, 28, 0.8)',
            boxShadow: checked ? '0 0 12px -1px rgba(229, 169, 98, 0.4)' : 'none',
          }}
          transition={MOTION_SPRINGS.bouncy}
          className="w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-colors group-hover:border-gold-400/50"
        >
          {/* Animated SVG Checkmark */}
          <svg
            className="w-3.5 h-3.5 text-gold-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M20 6L9 17L4 12"
              variants={checkboxCheckVariants}
              initial="hidden"
              animate={checked ? 'visible' : 'hidden'}
            />
          </svg>
        </motion.div>
      </div>

      {label && (
        <span className="text-sm font-medium text-pearl group-hover:text-gold-300 transition-colors">
          {label}
        </span>
      )}
    </label>
  );
};
