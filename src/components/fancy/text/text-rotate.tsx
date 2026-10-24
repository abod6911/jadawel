'use client';

import React, {
  ElementType,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {
  AnimatePresence,
  AnimatePresenceProps,
  motion,
  MotionProps,
  Transition,
} from 'framer-motion';
import { cn } from '@/lib/utils';

// Helper function to split text into characters with support for unicode and emojis
const splitIntoCharacters = (text: string): string[] => {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), ({ segment }) => segment);
  }
  return Array.from(text);
};

export interface TextRotateProps {
  /** Array of text strings to rotate through */
  texts: string[];

  /** Render as HTML tag */
  as?: ElementType;

  /** Time in milliseconds between rotations */
  rotationInterval?: number;

  /** Initial animation state */
  initial?: MotionProps['initial'];

  /** Animate state */
  animate?: MotionProps['animate'];

  /** Exit animation state */
  exit?: MotionProps['exit'];

  /** AnimatePresence mode */
  animatePresenceMode?: AnimatePresenceProps['mode'];

  /** Animate initial render */
  animatePresenceInitial?: boolean;

  /** Duration of stagger delay between words/characters in seconds */
  staggerDuration?: number;

  /** Direction to stagger animations from */
  staggerFrom?: 'first' | 'last' | 'center' | number | 'random';

  /** Animation transition */
  transition?: Transition;

  /** Loop continuously */
  loop?: boolean;

  /** Auto rotate */
  auto?: boolean;

  /** How to split text: 'none' for silky whole-phrase roll, 'words', 'characters', 'lines' */
  splitBy?: 'none' | 'words' | 'characters' | 'lines' | string;

  /** Callback on rotation */
  onNext?: (index: number) => void;

  /** Container CSS class */
  mainClassName?: string;

  /** Split element wrapper class */
  splitLevelClassName?: string;

  /** Individual segment class */
  elementLevelClassName?: string;
}

export interface TextRotateRef {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
}

export const TextRotate = forwardRef<TextRotateRef, TextRotateProps>(
  (
    {
      texts,
      as = 'span',
      transition = {
        type: 'spring',
        stiffness: 320,
        damping: 28,
        mass: 0.75,
      },
      initial = { y: '100%', opacity: 0, filter: 'blur(3px)' },
      animate = { y: '0%', opacity: 1, filter: 'blur(0px)' },
      exit = { y: '-100%', opacity: 0, filter: 'blur(3px)' },
      animatePresenceMode = 'popLayout',
      animatePresenceInitial = true,
      rotationInterval = 3000,
      staggerDuration = 0,
      staggerFrom = 'first',
      loop = true,
      auto = true,
      splitBy = 'none',
      onNext,
      mainClassName,
      splitLevelClassName,
      elementLevelClassName,
      ...props
    },
    ref
  ) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const isFirstRenderRef = React.useRef(true);
    useEffect(() => {
      isFirstRenderRef.current = false;
    }, []);

    const handleIndexChange = useCallback(
      (newIndex: number) => {
        setCurrentTextIndex(newIndex);
        onNext?.(newIndex);
      },
      [onNext]
    );

    const next = useCallback(() => {
      const nextIndex =
        currentTextIndex === texts.length - 1
          ? loop
            ? 0
            : currentTextIndex
          : currentTextIndex + 1;

      if (nextIndex !== currentTextIndex) {
        handleIndexChange(nextIndex);
      }
    }, [currentTextIndex, texts.length, loop, handleIndexChange]);

    const previous = useCallback(() => {
      const prevIndex =
        currentTextIndex === 0
          ? loop
            ? texts.length - 1
            : currentTextIndex
          : currentTextIndex - 1;

      if (prevIndex !== currentTextIndex) {
        handleIndexChange(prevIndex);
      }
    }, [currentTextIndex, texts.length, loop, handleIndexChange]);

    const jumpTo = useCallback(
      (index: number) => {
        const validIndex = Math.max(0, Math.min(index, texts.length - 1));
        if (validIndex !== currentTextIndex) {
          handleIndexChange(validIndex);
        }
      },
      [texts.length, currentTextIndex, handleIndexChange]
    );

    const reset = useCallback(() => {
      if (currentTextIndex !== 0) {
        handleIndexChange(0);
      }
    }, [currentTextIndex, handleIndexChange]);

    useImperativeHandle(
      ref,
      () => ({
        next,
        previous,
        jumpTo,
        reset,
      }),
      [next, previous, jumpTo, reset]
    );

    // Auto-rotation timer
    useEffect(() => {
      if (!auto || texts.length <= 1) return;
      const intervalId = setInterval(next, rotationInterval);
      return () => clearInterval(intervalId);
    }, [next, rotationInterval, auto, texts.length]);

    const currentText = texts[currentTextIndex] || '';

    // Motion component wrapper
    const MotionComponent = useMemo(() => {
      if (typeof as === 'string' && (motion as any)[as]) {
        return (motion as any)[as];
      }
      return motion(as as any);
    }, [as]);

    // Segment helper
    const segments = useMemo(() => {
      if (splitBy === 'none') {
        return [{ text: currentText, needsSpace: false }];
      }
      if (splitBy === 'words') {
        const words = currentText.split(' ');
        return words.map((w, i) => ({
          text: w,
          needsSpace: i !== words.length - 1,
        }));
      }
      if (splitBy === 'characters') {
        const chars = splitIntoCharacters(currentText);
        return chars.map((c) => ({
          text: c,
          needsSpace: false,
        }));
      }
      if (splitBy === 'lines') {
        return currentText.split('\n').map((l, i, arr) => ({
          text: l,
          needsSpace: i !== arr.length - 1,
        }));
      }
      return [{ text: currentText, needsSpace: false }];
    }, [currentText, splitBy]);

    return (
      <MotionComponent
        layout
        transition={{ type: 'spring', damping: 30, stiffness: 350 }}
        className={cn(
          'relative inline-flex items-center justify-center overflow-hidden align-middle select-none py-1',
          mainClassName
        )}
        {...props}
      >
        <span className="sr-only">{currentText}</span>

        <AnimatePresence
          mode={animatePresenceMode}
          initial={animatePresenceInitial}
        >
          <motion.span
            key={currentTextIndex}
            layout
            initial={isFirstRenderRef.current ? false : initial}
            animate={animate}
            exit={exit}
            transition={transition}
            className={cn(
              'inline-flex items-center justify-center whitespace-nowrap leading-none',
              splitLevelClassName
            )}
            aria-hidden
          >
            {segments.map((seg, idx) => (
              <React.Fragment key={idx}>
                <span className={cn('inline-block', elementLevelClassName)}>
                  {seg.text}
                </span>
                {seg.needsSpace && <span className="whitespace-pre"> </span>}
              </React.Fragment>
            ))}
          </motion.span>
        </AnimatePresence>
      </MotionComponent>
    );
  }
);

TextRotate.displayName = 'TextRotate';

export default TextRotate;
