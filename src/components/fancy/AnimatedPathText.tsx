'use client';

import React, { RefObject, useEffect, useRef } from 'react';
import { useScroll, type UseScrollOptions, useTransform } from 'framer-motion';

type PreserveAspectRatioAlign =
  | 'none'
  | 'xMinYMin'
  | 'xMidYMin'
  | 'xMaxYMin'
  | 'xMinYMid'
  | 'xMidYMid'
  | 'xMaxYMid'
  | 'xMinYMax'
  | 'xMidYMax'
  | 'xMaxYMax';

type PreserveAspectRatioMeetOrSlice = 'meet' | 'slice';

type PreserveAspectRatio =
  | PreserveAspectRatioAlign
  | `${Exclude<PreserveAspectRatioAlign, 'none'>} ${PreserveAspectRatioMeetOrSlice}`;

export interface AnimatedPathTextProps {
  // Path properties
  path: string;
  pathId?: string;
  pathClassName?: string;
  preserveAspectRatio?: PreserveAspectRatio;
  showPath?: boolean;

  // SVG properties
  width?: string | number;
  height?: string | number;
  viewBox?: string;
  svgClassName?: string;

  // Text properties
  text: string;
  textClassName?: string;
  textAnchor?: 'start' | 'middle' | 'end';

  // Animation properties
  animationType?: 'auto' | 'scroll';

  // Animation properties if animationType is auto
  duration?: number;
  repeatCount?: number | 'indefinite';
  easingFunction?: {
    calcMode?: string;
    keyTimes?: string;
    keySplines?: string;
  };

  // Scroll animation properties if animationType is scroll
  scrollContainer?: RefObject<HTMLElement | null>;
  scrollOffset?: UseScrollOptions['offset'];
  scrollTransformValues?: [number, number];
}

export const AnimatedPathText: React.FC<AnimatedPathTextProps> = ({
  // Path defaults
  path,
  pathId,
  pathClassName,
  preserveAspectRatio = 'xMidYMid meet',
  showPath = false,

  // SVG defaults
  width = '100%',
  height = '100%',
  viewBox = '0 0 100 100',
  svgClassName,

  // Text defaults
  text,
  textClassName,
  textAnchor = 'start',

  // Animation type
  animationType = 'auto',

  // Animation defaults
  duration = 4,
  repeatCount = 'indefinite',

  easingFunction = {},

  // Scroll animation defaults
  scrollContainer,
  scrollOffset = ['start end', 'end end'],
  scrollTransformValues = [0, 100],
}) => {
  const textPathRefs = useRef<(SVGTextPathElement | null)[]>([]);

  // Unique id for the path to prevent conflicts across multiple instances
  const idRef = useRef<string>('');
  if (!idRef.current) {
    idRef.current = pathId || `animated-path-${Math.random().toString(36).substring(2, 9)}`;
  }
  const id = idRef.current;

  const { scrollYProgress } = useScroll({
    ...(scrollContainer && { container: scrollContainer }),
    offset: scrollOffset,
  });

  const t = useTransform(scrollYProgress, [0, 1], scrollTransformValues);

  useEffect(() => {
    if (animationType !== 'scroll') return;

    // Update scroll handler when container ref changes
    const unsubscribe = scrollYProgress.on('change', () => {
      textPathRefs.current.forEach((textPath) => {
        if (textPath) {
          textPath.setAttribute('startOffset', `${t.get()}%`);
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, [scrollYProgress, t, animationType]);

  const animationProps =
    animationType === 'auto'
      ? {
          from: '0%',
          to: '100%',
          begin: '0s',
          dur: `${duration}s`,
          repeatCount: repeatCount,
          ...(easingFunction && easingFunction),
        }
      : null;

  return (
    <svg
      className={svgClassName}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
    >
      <path
        id={id}
        className={pathClassName}
        d={path}
        stroke={showPath ? 'currentColor' : 'none'}
        fill="none"
      />

      {/* First text element */}
      <text textAnchor={textAnchor} fill="currentColor">
        <textPath
          className={textClassName}
          href={`#${id}`}
          startOffset="0%"
          ref={(ref) => {
            textPathRefs.current[0] = ref;
          }}
        >
          {animationType === 'auto' && (
            <animate attributeName="startOffset" {...animationProps} />
          )}
          {text}
        </textPath>
      </text>

      {/* Second text element (offset to hide the jump for seamless loop) */}
      {animationType === 'auto' && (
        <text textAnchor={textAnchor} fill="currentColor">
          <textPath
            className={textClassName}
            href={`#${id}`}
            startOffset="-100%"
            ref={(ref) => {
              textPathRefs.current[1] = ref;
            }}
          >
            <animate
              attributeName="startOffset"
              {...animationProps}
              from="-100%"
              to="0%"
            />
            {text}
          </textPath>
        </text>
      )}
    </svg>
  );
};

export default AnimatedPathText;
