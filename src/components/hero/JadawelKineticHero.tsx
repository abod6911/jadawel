'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useItineraryStore } from '@/store/useItineraryStore';
import { useLanguage } from '@/hooks/useLanguage';
import { soundEngine } from '@/utils/audioEngine';
import { Sparkles, Play, MapPin, Compass, ShieldCheck } from 'lucide-react';

// Kinetic Text Splitter Animation
const wordAnimation = {
  hidden: { y: '120%', opacity: 0 },
  visible: (i: number) => ({
    y: '0%',
    opacity: 1,
    transition: {
      delay: 0.12 + i * 0.06,
      duration: 0.65,
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

    // Nodes representing Jeddah Locations with Luxury Twilight & Gold Colors
    const nodes = [
      { name: 'أبحر', nameEn: 'Obhur', color: '#4E9F96', radius: 4.5, pulse: 0 },
      { name: 'البلد', nameEn: 'Al-Balad', color: '#E5A962', radius: 5.0, pulse: 1.5 },
      { name: 'الروضة', nameEn: 'Al-Rawdah', color: '#D48B38', radius: 4.2, pulse: 0.8 },
      { name: 'الشاطئ', nameEn: 'Al-Shati', color: '#4E9F96', radius: 4.5, pulse: 2.1 },
      { name: 'الحمراء', nameEn: 'Al-Hamra', color: '#F3CA95', radius: 3.8, pulse: 3.0 },
    ];

    // Floating Stardust Particles
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      size: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.45 + 0.15,
    }));

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const isMobile = width < 640;

      // 1. Draw Starfield
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(251, 251, 250, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Orbital Constellation Lines (Adjusted to avoid text collision)
      const centerX = width * 0.5;
      const centerY = isMobile ? height * 0.24 : height * 0.42;
      const baseRadius = isMobile ? Math.min(width, height) * 0.38 : Math.min(width, height) * 0.32;
      angle += 0.0025;

      const computedNodes = nodes.map((node, i) => {
        const theta = angle + (i * Math.PI * 2) / nodes.length;
        const currentRadius = baseRadius + Math.sin(angle * 2.2 + i) * (isMobile ? 10 : 16);
        return {
          ...node,
          currentX: centerX + Math.cos(theta) * currentRadius * (isMobile ? 1.05 : 1.15),
          currentY: centerY + Math.sin(theta) * currentRadius * (isMobile ? 0.45 : 0.62),
        };
      });

      // Draw Connection Arcs
      ctx.strokeStyle = 'rgba(78, 159, 150, 0.18)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let i = 0; i < computedNodes.length; i++) {
        const next = computedNodes[(i + 1) % computedNodes.length];
        ctx.moveTo(computedNodes[i].currentX, computedNodes[i].currentY);
        ctx.lineTo(next.currentX, next.currentY);
      }
      ctx.stroke();

      // Cross links
      ctx.strokeStyle = 'rgba(229, 169, 98, 0.10)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      for (let i = 0; i < computedNodes.length; i++) {
        const jump = computedNodes[(i + 2) % computedNodes.length];
        ctx.moveTo(computedNodes[i].currentX, computedNodes[i].currentY);
        ctx.lineTo(jump.currentX, jump.currentY);
      }
      ctx.stroke();

      // 3. Draw Nodes with Ambient Glow & Pulse
      computedNodes.forEach((node) => {
        node.pulse += 0.04;
        const pulseSize = node.radius + Math.sin(node.pulse) * (isMobile ? 2.0 : 3.0);

        // Outer Glow
        const grad = ctx.createRadialGradient(
          node.currentX,
          node.currentY,
          0,
          node.currentX,
          node.currentY,
          pulseSize * 3.5
        );
        grad.addColorStop(
          0,
          node.color === '#4E9F96'
            ? 'rgba(78,159,150,0.40)'
            : 'rgba(229,169,98,0.40)'
        );
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(node.currentX, node.currentY, pulseSize * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Node Center
        ctx.fillStyle = '#FBFBFA';
        ctx.beginPath();
        ctx.arc(node.currentX, node.currentY, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Node Label (Visible on Desktop, hidden on tight mobile viewports to prevent text collision)
        if (!isMobile) {
          ctx.fillStyle = 'rgba(251, 251, 250, 0.70)';
          ctx.font = 'bold 11px "Alexandria", system-ui, sans-serif';
          ctx.textAlign = 'center';
          const label = language === 'ar' ? node.name : node.nameEn;
          ctx.fillText(label, node.currentX, node.currentY + 16);
        }
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
    <section className="relative min-h-[90vh] sm:min-h-[92vh] w-full flex flex-col items-center justify-between overflow-hidden px-4 pt-8 sm:pt-14 pb-6 sm:pb-8 bg-[#090B0E] border-b border-white/[0.06]">
      {/* 1. Luminous Interactive Constellation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 w-full h-full pointer-events-none opacity-80"
      />

      {/* Atmospheric Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[580px] h-[220px] sm:h-[360px] bg-[radial-gradient(ellipse_at_center,rgba(78,159,150,0.18)_0%,transparent_70%)] pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[360px] sm:w-[700px] h-[180px] sm:h-[260px] bg-[radial-gradient(ellipse_at_center,rgba(229,169,98,0.14)_0%,transparent_70%)] pointer-events-none -z-0" />

      {/* 2. Kinetic Typography Hero Stack */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto my-auto py-4 sm:py-6 w-full">
        {/* Eyebrow Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full backdrop-blur-xl bg-white/[0.04] border border-[#E5A962]/30 text-[11px] sm:text-xs text-[#E5A962] mb-4 sm:mb-6 shadow-lg shadow-black/40"
        >
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse shadow-[0_0_8px_#22C55E]" />
          <span className="font-semibold">
            {language === 'ar'
              ? 'المخطط الذكي لرحلات عروس البحر الأحمر 🌊'
              : 'AI Outing Planner for the Red Sea Bride 🌊'}
          </span>
        </motion.div>

        {/* Word-by-Word Kinetic Headline with Fluid Mobile Typography */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#FBFBFA] tracking-tight leading-[1.28] sm:leading-[1.3] mb-4 sm:mb-5 flex flex-wrap justify-center gap-x-2 sm:gap-x-3.5 gap-y-1 sm:gap-y-2 max-w-3xl">
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
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#E5A962] via-[#F3CA95] to-[#D48B38] font-black'
                      : 'text-[#FBFBFA] drop-shadow-[0_8px_20px_rgba(0,0,0,0.85)]'
                  }`}
                >
                  {word}
                </motion.span>
              </span>
            );
          })}
        </h1>

        {/* Subtitle with Mobile Ergonomic Line-Height */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-xs sm:text-base md:text-lg text-[#9EA8B3] max-w-2xl font-normal leading-relaxed mb-6 sm:mb-8 px-2"
        >
          {language === 'ar'
            ? 'مسارات ذكية محسوبة الوقت والتكلفة، من روقان شواطئ أبحر إلى أزقة البلد التاريخية مع خيار مجاني 100% (0 ر.س).'
            : 'Smart itineraries optimized for time & cost, from Obhur sunsets to historic Al-Balad with 100% free routes.'}
        </motion.p>

        {/* Dual Luxury Action Triggers with Mobile-Optimized Touch Target */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.85, duration: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-10 w-full max-w-md sm:max-w-none px-2"
        >
          <motion.button
            onClick={handleBuildPlanClick}
            whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(229, 169, 98, 0.45)' }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto min-h-[48px] sm:min-h-[52px] px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#E5A962] to-[#D48B38] text-[#090B0E] font-black text-sm sm:text-base shadow-xl shadow-[#E5A962]/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer touch-manipulation"
          >
            <Sparkles className="w-5 h-5 text-[#090B0E]" />
            <span>{language === 'ar' ? 'ابنِ خطتي في جدة بنقرة واحدة' : 'Build My Jeddah Plan'}</span>
            <span className="w-5 h-5 rounded-full bg-black/15 flex items-center justify-center text-xs font-bold">
              {isRTL ? '←' : '→'}
            </span>
          </motion.button>

          <motion.button
            onClick={handleInstantQuickPlan}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto min-h-[48px] sm:min-h-[52px] px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl backdrop-blur-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-[#FBFBFA] font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
          >
            <Play className="w-3.5 h-3.5 text-[#E5A962] fill-current" />
            <span>{language === 'ar' ? 'جرّب مسار تجريبي سريع (0 ر.س)' : 'Try Instant Free Outing'}</span>
          </motion.button>
        </motion.div>
      </div>

      {/* 3. Bottom Trust Badges & Metrics Strip */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95, duration: 0.5 }}
        className="relative z-10 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl backdrop-blur-xl bg-[#0F141C]/80 border border-white/[0.08] text-[11px] sm:text-xs text-[#9EA8B3] text-center sm:text-start shadow-md"
      >
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#4E9F96] shrink-0" />
          <span>{language === 'ar' ? '+300 وجهة موثقة في جدة' : '+300 Verified Jeddah Spots'}</span>
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <Compass className="w-3.5 h-3.5 text-[#E5A962] shrink-0" />
          <span>{language === 'ar' ? 'خوارزمية مسارات بدون لف ودوران' : 'Anti-Backtracking Smart Routing'}</span>
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
          <span>{language === 'ar' ? 'خطة مجانية 100% (0 ر.س) متوفرة' : '100% Free Plan (0 SAR) Included'}</span>
        </div>
      </motion.div>
    </section>
  );
};

export default JadawelKineticHero;
