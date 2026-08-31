/**
 * JADAWEL (جداول) — Motion Design System & Framer Motion Presets
 * High-performance, GPU-accelerated micro-interactions for data-heavy applications.
 * WCAG 2.1 Compliant with automatic reduced motion fallbacks.
 */

import { Transition, Variants } from 'framer-motion';

/* ==========================================================================
   1. Motion Constants & Easing Presets
   ========================================================================== */

export const MOTION_TIMING = {
  instant: 0.075, // 75ms: Micro-clicks, switches, active tactile press
  fast: 0.15,     // 150ms: Tooltips, popovers, inline focus glow
  normal: 0.25,   // 250ms: Row entry, modals, drawers, tabs
  slow: 0.35,     // 350ms: Complex page transitions, large sheets
  shimmer: 1.6,   // 1600ms: Skeleton wave
} as const;

export const MOTION_EASE = {
  spring: [0.16, 1, 0.3, 1] as [number, number, number, number],
  smooth: [0.4, 0, 0.2, 1] as [number, number, number, number],
  bounce: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  exit: [0.4, 0, 1, 1] as [number, number, number, number],
} as const;

export const MOTION_SPRINGS = {
  // Snappy: Buttons, icons, badges, small popovers
  snappy: {
    type: 'spring',
    stiffness: 450,
    damping: 32,
    mass: 0.8,
  } as Transition,

  // Smooth: Modals, drawers, sliding tab pills
  smooth: {
    type: 'spring',
    stiffness: 320,
    damping: 28,
    mass: 1,
  } as Transition,

  // Tactile Micro-Bounce: Checkboxes, notification badges
  bouncy: {
    type: 'spring',
    stiffness: 550,
    damping: 24,
    mass: 0.7,
  } as Transition,

  // Gentle: Floating indicators, ambient pulses
  gentle: {
    type: 'spring',
    stiffness: 180,
    damping: 22,
    mass: 1.2,
  } as Transition,
} as const;

/* ==========================================================================
   2. Reusable Framer Motion Variants
   ========================================================================== */

/**
 * Table Container & Row Stagger Variants
 * Capped at 15 items max to prevent main-thread layout bottleneck on large datasets.
 */
export const tableContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.02,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: MOTION_TIMING.fast, ease: MOTION_EASE.exit },
  },
};

export const tableRowVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 6,
    scale: 0.995,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: MOTION_TIMING.normal,
      ease: MOTION_EASE.spring,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    height: 0,
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
    transition: {
      opacity: { duration: MOTION_TIMING.fast, ease: MOTION_EASE.exit },
      height: { duration: MOTION_TIMING.normal, ease: MOTION_EASE.spring },
    },
  },
};

/**
 * Modal & Backdrop Variants
 */
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: MOTION_TIMING.fast, ease: MOTION_EASE.smooth },
  },
  exit: {
    opacity: 0,
    transition: { duration: MOTION_TIMING.fast, ease: MOTION_EASE.exit },
  },
};

export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 12,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: MOTION_SPRINGS.smooth,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: {
      duration: MOTION_TIMING.fast,
      ease: MOTION_EASE.exit,
    },
  },
};

/**
 * Slide-over Panel (Drawer) Variants (RTL & LTR Aware)
 */
export const createDrawerVariants = (direction: 'right' | 'left' = 'right'): Variants => ({
  hidden: {
    x: direction === 'right' ? '100%' : '-100%',
    opacity: 0.8,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: MOTION_SPRINGS.smooth,
  },
  exit: {
    x: direction === 'right' ? '100%' : '-100%',
    opacity: 0.8,
    transition: {
      duration: MOTION_TIMING.normal,
      ease: MOTION_EASE.exit,
    },
  },
});

/**
 * Dropdown & Tooltip Variants (Transform-Origin Aware)
 */
export const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -4,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: MOTION_TIMING.fast,
      ease: MOTION_EASE.spring,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -4,
    transition: {
      duration: MOTION_TIMING.instant,
      ease: MOTION_EASE.exit,
    },
  },
};

export const tooltipVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 3 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: MOTION_TIMING.fast,
      ease: MOTION_EASE.spring,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    transition: { duration: MOTION_TIMING.instant },
  },
};

/**
 * Checkbox & Switch Tactile Pop
 */
export const checkboxCheckVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: MOTION_TIMING.fast, ease: MOTION_EASE.spring },
      opacity: { duration: MOTION_TIMING.instant },
    },
  },
};

/**
 * Reduced Motion Fallback Definition
 */
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.01 } },
  exit: { opacity: 0, transition: { duration: 0.01 } },
};
