'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useItineraryStore } from '@/store/useItineraryStore';
import { useLanguage } from '@/hooks/useLanguage';
import { soundEngine } from '@/utils/audioEngine';
import { Sparkles, Play, ArrowLeft, ArrowRight, Compass, ShieldCheck, MapPin } from 'lucide-react';

// Kinetic Text Splitter Animation
const wordAnimation = {
  hidden: { y: '120%', opacity: 0 },
  visible: (i: number) => ({
    y: '0%',
    opacity: 1,
    transition: {
      delay: 0.15 + i * 0.07,
      duration: 0.7,
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

  // Interactive Particle & Orbital Constellation Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Nodes representing Jeddah Locations
    const nodes = [
      { name: 'أبحر', nameEn: 'Obhur', color: '#1D8C88', radius: 5, pulse: 0 },
      { name: 'البلد', nameEn: 'Al-Balad', color: '#F6C77A', radius: 5.5, pulse: 1.5 },
      { name: 'الروضة', nameEn: 'Al-Rawdah', color: '#F46F52', radius: 4.5, pulse: 0.8 },
      { name: 'الشاطئ', nameEn: 'Al-Shati', color: '#1D8C88', radius: 4.5, pulse: 2.1 },
      { name: 'الحمراء', nameEn: 'Al-Hamra', color: '#F6C77A', radius: 4, pulse: 3.0 },
    ];

    // Background floating stardust particles
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Starfield
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Connected Route Lines
      const centerX = width * 0.5;
      const centerY = height * 0.42;
      const baseRadius = Math.min(width, height) * 0.34;
      angle += 0.0028;

      const computedNodes = nodes.map((node, i) => {
        const theta = angle + (i * Math.PI * 2) / nodes.length;
        const currentRadius = baseRadius + Math.sin(angle * 2.2 + i) * 16;
        return {
          ...node,
          currentX: centerX + Math.cos(theta) * currentRadius * 1.15,
          currentY: centerY + Math.sin(theta) * currentRadius * 0.62,
        };
      });

      // Draw Connection Arcs
      ctx.strokeStyle = 'rgba(29, 140, 136, 0.22)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (let i = 0; i < computedNodes.length; i++) {
        const next = computedNodes[(i + 1) % computedNodes.length];
        ctx.moveTo(computedNodes[i].currentX, computedNodes[i].currentY);
        ctx.lineTo(next.currentX, next.currentY);
      }
      ctx.stroke();

      // Additional cross-links for constellation look
      ctx.strokeStyle = 'rgba(246, 199, 122, 0.12)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      for (let i = 0; i < computedNodes.length; i++) {
        const jump = computedNodes[(i + 2) % computedNodes.length];
        ctx.moveTo(computedNodes[i].currentX, computedNodes[i].currentY);
        ctx.lineTo(jump.currentX, jump.currentY);
      }
      ctx.stroke();

      // 3. Draw Nodes with Ambient Glow & Pulse
      computedNodes.forEach((node) => {
        node.pulse += 0.045;
        const pulseSize = node.radius + Math.sin(node.pulse) * 3.2;

        // Outer Glow
        const grad = ctx.createRadialGradient(
          node.currentX,
          node.currentY,
          0,
          node.currentX,
          node.currentY,
          pulseSize * 3.8
        );
        grad.addColorStop(
          0,
          node.color === '#F46F52'
            ? 'rgba(244,111,82,0.45)'
            : node.color === '#1D8C88'
            ? 'rgba(29,140,136,0.45)'
            : 'rgba(246,199,122,0.45)'
        );
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(node.currentX, node.currentY, pulseSize * 3.8, 0, Math.PI * 2);
        ctx.fill();

        // Node Center
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(node.currentX, node.currentY, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Node Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.font = 'bold 11px "Alexandria", system-ui, sans-serif';
        ctx.textAlign = 'center';
        const label = language === 'ar' ? node.name : node.nameEn;
        ctx.fillText(label, node.currentX, node.currentY + 18);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [language]);

  const headlineWordsAr = ['المواقع', 'تشتتك', 'بمئات', 'الأماكن..', 'وجداول', 'يرتّب', 'لك', 'الطلعة', 'كاملة'];
  const headlineWordsEn = ['Stop', 'browsing', 'endless', 'spots..', 'Jadawel', 'curates', 'your', 'whole', 'outing'];
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
    <section className="relative min-h-[92vh] w-full flex flex-col items-center justify-between overflow-hidden px-4 pt-10 sm:pt-14 pb-8 bg-[#081B26] border-b border-white/5">
      {/* 1. Luminous Interactive Constellation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 w-full h-full pointer-events-none opacity-85"
      />

      {/* Atmospheric Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[380px] bg-[radial-gradient(ellipse_at_center,rgba(29,140,136,0.22)_0%,transparent_70%)] pointer-events-none -z-0" />
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[750px] h-[280px] bg-[radial-gradient(ellipse_at_center,rgba(244,111,82,0.15)_0%,transparent_70%)] pointer-events-none -z-0" />

      {/* 2. Kinetic Typography Hero Stack */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto my-auto py-6">
        {/* Eyebrow Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full backdrop-blur-xl bg-white/[0.06] border border-gold-400/30 text-xs sm:text-sm text-[#F6C77A] mb-6 shadow-xl"
        >
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse shadow-[0_0_8px_#22C55E]" />
          <span className="font-bold">
            {language === 'ar'
              ? 'المخطط الذكي الأول لرحلات عروس البحر الأحمر 🌊'
              : 'The Premier AI Outing Engine for the Red Sea Bride 🌊'}
          </span>
        </motion.div>

        {/* Word-by-Word Kinetic Headline */}
        <h1 className="text-3.5xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.3] mb-5 flex flex-wrap justify-center gap-x-2.5 sm:gap-x-3.5 gap-y-1 sm:gap-y-2">
          {headlineWords.map((word, i) => {
            const isHighlight =
              word === 'وجداول' || word === 'كاملة' || word === 'Jadawel' || word === 'outing';
            return (
              <span key={i} className="inline-block overflow-hidden py-0.5 sm:py-1">
                <motion.span
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={wordAnimation}
                  className={`inline-block ${
                    isHighlight
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#F6C77A] via-[#F46F52] to-[#E95E43] font-black'
                      : 'text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]'
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
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-sm sm:text-lg text-[#AFC1C6] max-w-2xl font-medium leading-relaxed mb-8 px-2"
        >
          {language === 'ar'
            ? 'مسارات ذكية محسوبة الوقت والتكلفة بدقة، من روقان شواطئ أبحر إلى أزقة البلد التاريخية مع خيار مجاني 100%.'
            : 'Smart itineraries optimized for time & budget, from Obhur sunsets to historic Al-Balad alleys with 100% free plans.'}
        </motion.p>

        {/* Dual Luxury Action Triggers */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.95, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 mb-8 sm:mb-10 w-full sm:w-auto"
        >
          <motion.button
            onClick={handleBuildPlanClick}
            whileHover={{ scale: 1.04, boxShadow: '0 0 35px rgba(244, 111, 82, 0.55)' }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#F46F52] to-[#E95E43] text-white font-black text-sm sm:text-base shadow-xl shadow-[#F46F52]/30 transition-all flex items-center justify-center gap-3 cursor-pointer touch-manipulation active:scale-95"
          >
            <Sparkles className="w-5 h-5 text-gold-200" />
            <span>{language === 'ar' ? 'ابنِ خطتي في جدة بنقرة واحدة' : 'Build My Jeddah Plan'}</span>
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
              {isRTL ? '←' : '→'}
            </span>
          </motion.button>

          <motion.button
            onClick={handleInstantQuickPlan}
            whileHover={{ scale: 1.03, backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 text-white font-bold text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer touch-manipulation active:scale-95"
          >
            <Play className="w-4 h-4 text-[#F6C77A] fill-current" />
            <span>{language === 'ar' ? 'جرّب مسار تجريبي سريع (0 ر.س)' : 'Try Instant Free Outing'}</span>
          </motion.button>
        </motion.div>
      </div>

      {/* 3. Bottom Trust Badges & Metrics Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="relative z-10 w-full max-w-4xl flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 px-4 sm:px-6 py-3 sm:py-3.5 rounded-2xl backdrop-blur-xl bg-white/[0.04] border border-white/10 text-[11px] sm:text-xs text-[#AFC1C6]"
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#1D8C88]" />
          <span>{language === 'ar' ? '+300 وجهة موثقة في جدة' : '+300 Verified Jeddah Spots'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-[#F6C77A]" />
          <span>{language === 'ar' ? 'خوارزمية مسارات بدون لف ودوران' : 'Anti-Backtracking Smart Routing'}</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
          <span>{language === 'ar' ? 'خطة مجانية 100% (0 ر.س) متوفرة' : '100% Free Plan (0 SAR) Included'}</span>
        </div>
      </motion.div>
    </section>
  );
};

export default JadawelKineticHero;
