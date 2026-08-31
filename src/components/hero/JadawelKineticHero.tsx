'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useItineraryStore } from '@/store/useItineraryStore';
import { useLanguage } from '@/hooks/useLanguage';
import { soundEngine } from '@/utils/audioEngine';

const wordAnimation = {
  hidden: { y: '110%', opacity: 0 },
  visible: (i: number) => ({
    y: '0%',
    opacity: 1,
    transition: {
      delay: i * 0.06,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export const JadawelKineticHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { language, isRTL } = useLanguage();
  const setActiveNavTab = useItineraryStore((state) => state.setActiveNavTab);
  const generatePlanFromPreferences = useItineraryStore((state) => state.generatePlanFromPreferences);
  const updateWizardPreferences = useItineraryStore((state) => state.updateWizardPreferences);

  // Background Constellation Animation (Mobile-Optimized)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const isMobile = width < 768;

    // Jeddah Nodes
    const nodes = [
      { name: 'أبحر', nameEn: 'Obhur', x: 0.35, y: 0.28, radius: 4, color: '#4E9F96' },
      { name: 'البلد', nameEn: 'Al-Balad', x: 0.65, y: 0.68, radius: 4.5, color: '#E5A962' },
      { name: 'الروضة', nameEn: 'Al-Rawdah', x: 0.55, y: 0.36, radius: 3.5, color: '#D48B38' },
      { name: 'الشاطئ', nameEn: 'Al-Shati', x: 0.42, y: 0.52, radius: 3.5, color: '#4E9F96' },
    ];

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = isMobile ? height * 0.35 : height * 0.45;
      const baseRadius = Math.min(width, height) * (isMobile ? 0.38 : 0.32);
      angle += 0.0025;

      const computedNodes = nodes.map((node, i) => {
        const theta = angle + (i * Math.PI * 2) / nodes.length;
        return {
          ...node,
          currentX: centerX + Math.cos(theta) * baseRadius * 1.1,
          currentY: centerY + Math.sin(theta) * baseRadius * 0.65,
        };
      });

      // Draw Connection Lines
      ctx.strokeStyle = 'rgba(78, 159, 150, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < computedNodes.length; i++) {
        const next = computedNodes[(i + 1) % computedNodes.length];
        ctx.moveTo(computedNodes[i].currentX, computedNodes[i].currentY);
        ctx.lineTo(next.currentX, next.currentY);
      }
      ctx.stroke();

      // Draw Nodes
      computedNodes.forEach((node) => {
        // Outer Glow
        const grad = ctx.createRadialGradient(node.currentX, node.currentY, 0, node.currentX, node.currentY, 14);
        grad.addColorStop(0, 'rgba(229, 169, 98, 0.35)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(node.currentX, node.currentY, 14, 0, Math.PI * 2);
        ctx.fill();

        // Center Dot
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.currentX, node.currentY, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // ONLY render text labels on desktop (hide on mobile to prevent overlap)
        if (!isMobile) {
          ctx.fillStyle = 'rgba(251, 251, 250, 0.65)';
          ctx.font = '11px "Alexandria", "IBM Plex Sans Arabic", sans-serif';
          ctx.textAlign = 'center';
          const label = language === 'ar' ? node.name : node.nameEn;
          ctx.fillText(label, node.currentX, node.currentY + 16);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [language]);

  const headlineWordsAr = ['المواقع', 'تشتتك..', 'وجداول', 'يرتّب', 'لك', 'الطلعة', 'كاملة'];
  const headlineWordsEn = ['Endless', 'options..', 'Jadawel', 'curates', 'your', 'full', 'outing'];
  const headlineWords = language === 'ar' ? headlineWordsAr : headlineWordsEn;

  const handleBuildPlanClick = () => {
    soundEngine.playClick();
    setActiveNavTab('quick-plan');
  };

  const handleInstantQuickPlan = () => {
    soundEngine.playSuccess();
    updateWizardPreferences({
      startingDistrict: 'all_jeddah',
      budgetTier: 'free',
      vibe: 'sea_sunset',
      companions: 'friends',
      duration: '4_to_6h',
    });
    generatePlanFromPreferences();
  };

  return (
    <section className="relative min-h-[88dvh] w-full flex flex-col items-center justify-center overflow-hidden px-5 pt-8 pb-16 bg-[#090B0E]">
      {/* 1. Background Orbital Canvas with Radial Mask */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full pointer-events-none opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#090B0E_85%)] pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[320px] sm:w-[500px] h-[260px] bg-[#E5A962]/10 blur-[90px] pointer-events-none z-0" />

      {/* 2. Hero Content Stack */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto w-full">
        {/* Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-xl bg-white/[0.04] border border-white/10 text-[11px] sm:text-xs text-[#F3CA95] mb-5 shadow-lg"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#4E9F96] animate-pulse" />
          <span>
            {language === 'ar'
              ? 'المخطط الذكي الأول لرحلات جدة 🌊'
              : 'The Premier AI Outing Engine for Jeddah 🌊'}
          </span>
        </motion.div>

        {/* Word-by-Word Kinetic Headline */}
        <h1 className="text-3xl sm:text-5xl font-black text-[#FBFBFA] tracking-tight leading-[1.35] mb-4 flex flex-wrap justify-center gap-x-2 gap-y-0.5">
          {headlineWords.map((word, i) => {
            const isHighlight =
              word === 'وجداول' || word === 'كاملة' || word === 'Jadawel' || word === 'outing';
            return (
              <span key={i} className="inline-block overflow-hidden py-0.5">
                <motion.span
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={wordAnimation}
                  className={`inline-block ${
                    isHighlight
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#E5A962] to-[#D48B38]'
                      : 'text-[#FBFBFA]'
                  }`}
                >
                  {word}
                </motion.span>
              </span>
            );
          })}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-xs sm:text-base text-[#9EA8B3] max-w-md leading-relaxed mb-7 px-2"
        >
          {language === 'ar'
            ? 'مسارات ذكية محسوبة الوقت والتكلفة، من شواطئ أبحر إلى رواشين البلد التاريخية مع خيار مجاني 100%.'
            : 'Smart itineraries calculated for time and cost, from Obhur beaches to historic Al-Balad alleys with 100% free plans.'}
        </motion.p>

        {/* Action Controls */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 px-2"
        >
          {/* Primary Button */}
          <motion.button
            onClick={handleBuildPlanClick}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto px-7 h-[50px] rounded-2xl bg-gradient-to-r from-[#E5A962] to-[#D48B38] text-[#090B0E] font-bold text-sm shadow-lg shadow-[#E5A962]/20 flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
          >
            <span>{language === 'ar' ? '✨ ابنِ خطتي في جدة بنقرة واحدة' : '✨ Build My Jeddah Plan'}</span>
            <span className="text-base">{isRTL ? '←' : '→'}</span>
          </motion.button>

          {/* Secondary Button */}
          <motion.button
            onClick={handleInstantQuickPlan}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto px-6 h-[48px] rounded-2xl backdrop-blur-md bg-white/[0.04] border border-white/10 hover:border-[#E5A962]/40 text-[#FBFBFA] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors touch-manipulation"
          >
            <span className="text-[#E5A962]">▶</span>
            <span>
              {language === 'ar'
                ? 'جرّب مسار تجريبي سريع (0 ر.س)'
                : 'Try Instant Free Plan (0 SAR)'}
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default JadawelKineticHero;
