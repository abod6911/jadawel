'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Code2, Check, ExternalLink, ArrowRight } from 'lucide-react';
import AnimatedPathText from '@/components/fancy/text/text-along-path';
import { useLanguage } from '@/hooks/useLanguage';
import { soundEngine } from '@/utils/audioEngine';

export const TextAlongPathShowcase: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'waitlist' | 'waves' | 'circle' | 'scroll'>('waitlist');

  // Mode 1: Waitlist demo states
  const [email, setEmail] = useState('');
  const [buttonState, setButtonState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [themeMode, setThemeMode] = useState<'gold' | 'blue'>('gold');

  const rectPath =
    'M 20,20 L 180,20 A 20,20 0 0,1 200,40 L 200,160 A 20,20 0 0,1 180,180 L 20,180 A 20,20 0 0,1 0,160 L 0,40 A 20,20 0 0,1 20,20';

  const handleWaitlistSubmit = useCallback(() => {
    if (buttonState === 'success' || !email.trim()) return;
    soundEngine.playClick();
    setButtonState('loading');

    setTimeout(() => {
      soundEngine.playSuccess();
      setButtonState('success');
    }, 1500);

    setTimeout(() => {
      setButtonState('idle');
      setEmail('');
    }, 4000);
  }, [buttonState, email]);

  // Mode 2: Waves demo (centered around y=40, viewBox 0 0 1000 80)
  const wavePaths = [
    'M -50 40 C 200 15, 350 65, 550 40 C 750 15, 900 65, 1100 40',
    'M -50 40 C 180 65, 380 15, 580 40 C 780 65, 920 15, 1100 40',
    'M -50 40 C 220 20, 360 60, 560 40 C 760 20, 900 60, 1100 40',
  ];

  const waveTextsAr = [
    '✦ شـواطـئ أبـحـر الـفـارهـة • نـادي الـيـخـوت • نـسـيـم الـغـروب • كـورنـيـش جـدة ✦ شـواطـئ أبـحـر ✦ ',
    '✦ رواشـيـن وتـراث الـبـلـد • بـيـت نـصـيـف • بـاب مـكـة • أصـالـة الـمـاضـي ✦ رواشـيـن وتـراث الـبـلـد ✦ ',
    '✦ مـحـامـص الـروضـة • قـهـوة مـخـتـصـة • مـطـاعـم عـالـمـيـة • حـي جـمـيـل ✦ مـحـامـص الـروضـة ✦ ',
  ];

  const waveTextsEn = [
    '✦ OBHUR MARINA & YACHTS • RED SEA BREEZE • SUNSET LOUNGES • CORNICHE ✦ OBHUR MARINA ✦ ',
    '✦ HISTORIC AL-BALAD • UNESCO HERITAGE • TIMELESS RAWASHIN • LANTERNS ✦ HISTORIC AL-BALAD ✦ ',
    '✦ AL-RAWDAH ARTISANAL ROASTERS • SPECIALTY COFFEE • FINE DINING ✦ AL-RAWDAH ROASTERS ✦ ',
  ];

  // Mode 3: Circle demo (centered at 100, 100 with radius 60, viewBox 0 0 200 200)
  const circlePath =
    'M 100 100 m -60, 0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0';

  // Mode 4: Scroll container ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPaths = [
    'M -50 40 C 200 15, 450 65, 700 40 C 950 15, 1100 65, 1300 40',
    'M -50 40 C 200 65, 450 15, 700 40 C 950 65, 1100 15, 1300 40',
  ];

  return (
    <section
      aria-label="Text Along Path Showcase"
      className="relative w-full max-w-5xl mx-auto my-12 sm:my-16 px-3 sm:px-6 select-none"
    >
      {/* Outer ambient glow */}
      <div className="absolute -inset-2 bg-gradient-to-r from-[#DF9F3D]/10 via-[#2DD4BF]/10 to-[#E5C378]/15 rounded-[2.5rem] blur-2xl pointer-events-none -z-10" />

      {/* Main card */}
      <div className="relative rounded-[2.25rem] bg-[#0A0E17]/95 backdrop-blur-2xl border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.8)] overflow-hidden p-4 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#E5C378]/15 border border-[#E5C378]/30 text-[#F5E2B3] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#E5C378]" />
              <span>{language === 'ar' ? 'مكوّن النص المتحرك على المسار' : 'Text Along Path Component'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {language === 'ar' ? 'استوديو المسارات الحركية (AnimatedPathText)' : 'Text Along Path Studio'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              {language === 'ar'
                ? 'تحريك النصوص بانسيابية سينمائية عبر مسارات SVG ثنائية وثلاثية الأبعاد.'
                : 'Cinematic SVG path text animations supporting auto-loop and scroll-driven physics.'}
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/10 overflow-x-auto scrollbar-none self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('waitlist');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'waitlist'
                  ? 'bg-gradient-to-r from-[#DF9F3D] to-[#E5C378] text-[#0B0D12] shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {language === 'ar' ? 'صندوق الانتظار' : 'Waitlist Box'}
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('waves');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'waves'
                  ? 'bg-gradient-to-r from-[#DF9F3D] to-[#E5C378] text-[#0B0D12] shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {language === 'ar' ? 'أمواج المسارات' : 'Flowing Waves'}
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('circle');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'circle'
                  ? 'bg-gradient-to-r from-[#DF9F3D] to-[#E5C378] text-[#0B0D12] shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {language === 'ar' ? 'شارات دائرية' : 'Circle Badges'}
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('scroll');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'scroll'
                  ? 'bg-gradient-to-r from-[#DF9F3D] to-[#E5C378] text-[#0B0D12] shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {language === 'ar' ? 'مسار السكرول' : 'Scroll Driven'}
            </button>
          </div>
        </div>

        {/* Dynamic Display Area */}
        <div className="relative min-h-[380px] rounded-2xl overflow-hidden border border-white/10 bg-[#070A10] flex items-center justify-center p-3 sm:p-6">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: WAITLIST ORBIT DEMO */}
            {activeTab === 'waitlist' && (
              <motion.div
                key="waitlist"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="w-full flex flex-col items-center justify-center space-y-4 py-4"
              >
                {/* Theme toggle pill */}
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{language === 'ar' ? 'السمة اللونية:' : 'Color Theme:'}</span>
                  <div className="inline-flex rounded-lg bg-white/5 border border-white/10 p-0.5">
                    <button
                      type="button"
                      onClick={() => setThemeMode('gold')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                        themeMode === 'gold' ? 'bg-[#E5C378] text-stone-950 font-black' : 'text-slate-400'
                      }`}
                    >
                      {language === 'ar' ? 'ذهب جداول' : 'Jadawel Gold'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setThemeMode('blue')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                        themeMode === 'blue' ? 'bg-[#0015ff] text-white font-black' : 'text-slate-400'
                      }`}
                    >
                      {language === 'ar' ? 'أزرق Fancy الأصلي' : 'Original Blue'}
                    </button>
                  </div>
                </div>

                {/* Container */}
                <div
                  className={`relative w-full max-w-[340px] sm:max-w-[420px] h-60 sm:h-64 flex items-center justify-center rounded-2xl transition-all shadow-xl ${
                    themeMode === 'blue' ? 'bg-white text-[#0015ff]' : 'bg-[#0B0E17] text-[#E5C378]'
                  }`}
                >
                  <AnimatedPathText
                    path={rectPath}
                    pathId={`showcase-waitlist-${themeMode}`}
                    viewBox="-20 10 240 180"
                    showPath={true}
                    pathClassName={
                      themeMode === 'blue'
                        ? 'stroke-[#0015ff]/25 stroke-[1.5]'
                        : 'stroke-[#E5C378]/35 stroke-[1.5] stroke-dasharray-[5_4]'
                    }
                    text={
                      themeMode === 'blue'
                        ? 'JOIN THE WAITLIST ✉ JOIN THE WAITLIST ✉ JOIN THE WAITLIST ✉ JOIN THE WAITLIST ✉ JOIN THE WAITLIST ✉ '
                        : language === 'ar'
                        ? '✦ قائمة جداول VIP الحصرية ✉ مسارات جدة الاستثنائية ✦ قائمة جداول VIP الحصرية ✉ مسارات جدة الاستثنائية ✦ '
                        : '✦ JADAWEL VIP WAITLIST ✉ BESPOKE LUXURY ROUTES ✦ JADAWEL VIP WAITLIST ✉ BESPOKE LUXURY ROUTES ✦ '
                    }
                    textClassName={`text-[10.5px] font-mono font-black uppercase ${
                      themeMode === 'blue'
                        ? 'fill-[#0015ff] text-[#0015ff]'
                        : 'fill-[#F5E2B3] text-[#F5E2B3] drop-shadow-[0_2px_8px_rgba(229,195,120,0.7)]'
                    }`}
                    duration={18}
                    repeatCount="indefinite"
                    preserveAspectRatio="none"
                    textAnchor="start"
                    svgClassName={`absolute inset-0 w-full h-full pointer-events-none ${
                      themeMode === 'blue' ? 'text-[#0015ff]' : 'text-[#E5C378]'
                    }`}
                  />

                  {/* Centered Form */}
                  <div className="relative z-10 w-60 sm:w-72 p-3 space-y-2.5">
                    <input
                      type="text"
                      placeholder={language === 'ar' ? 'أدخل بريدك أو هاتفك...' : 'Enter your email...'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={buttonState === 'loading' || buttonState === 'success'}
                      className={`w-full h-11 px-3.5 rounded-xl border text-xs sm:text-sm font-mono text-center focus:outline-none transition-all ${
                        themeMode === 'blue'
                          ? 'border-[#0015ff] text-[#0015ff] placeholder:text-[#0015ff]/60 bg-white ring-2 ring-[#0015ff]/10'
                          : 'border-[#E5C378]/40 text-white placeholder:text-slate-400 bg-white/[0.08] focus:border-[#E5C378]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleWaitlistSubmit}
                      disabled={buttonState === 'loading' || !email.trim()}
                      className={`w-full h-11 px-4 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all flex items-center justify-center cursor-pointer select-none active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                        themeMode === 'blue'
                          ? 'bg-[#0015ff] text-white hover:bg-[#0015ff]/90 shadow-md'
                          : 'bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] text-[#0B0D12] font-black shadow-[0_4px_16px_rgba(229,195,120,0.4)]'
                      }`}
                    >
                      <AnimatePresence mode="popLayout" initial={false}>
                        {buttonState === 'loading' ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`w-4 h-4 border-2 rounded-full animate-spin ${
                              themeMode === 'blue' ? 'border-white' : 'border-[#0B0D12]'
                            } border-t-transparent`}
                          />
                        ) : buttonState === 'success' ? (
                          <motion.span
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-1 font-bold"
                          >
                            <Check className="w-4 h-4" />
                            <span>{language === 'ar' ? 'تم الانضمام ✓' : 'Done ✓'}</span>
                          </motion.span>
                        ) : (
                          <motion.span
                            key="idle"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                          >
                            {language === 'ar' ? 'اشتراك بالقائمة ✉' : 'Subscribe ✉'}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: FLOWING MULTI-WAVE DEMO */}
            {activeTab === 'waves' && (
              <motion.div
                key="waves"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="w-full h-80 relative flex flex-col justify-center overflow-hidden"
              >
                <div className="absolute inset-0 flex flex-col justify-around py-4">
                  {wavePaths.map((path, i) => {
                    const color = i === 0 ? '#2DD4BF' : i === 1 ? '#E5C378' : '#F472B6';
                    return (
                      <div key={`wave-${i}`} className="relative w-full h-24">
                        <AnimatedPathText
                          path={path}
                          pathId={`wave-demo-${i}`}
                          viewBox="0 0 1000 80"
                          preserveAspectRatio="none"
                          showPath={true}
                          pathClassName="stroke-white/20 stroke-[1.5]"
                          text={language === 'ar' ? waveTextsAr[i] : waveTextsEn[i]}
                          textClassName="text-[20px] sm:text-[22px] font-black drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                          animationType="auto"
                          duration={i * 2 + 10}
                          repeatCount="indefinite"
                          textAnchor="start"
                          svgClassName="w-full h-full"
                          style={{ color } as any}
                        />
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 3: CIRCLE BADGES DEMO */}
            {activeTab === 'circle' && (
              <motion.div
                key="circle"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="w-full h-80 relative flex items-center justify-center text-[#E5C378]"
              >
                <div className="relative w-72 h-72 flex items-center justify-center">
                  {[0, 90, 180, 270].map((rotation, i) => (
                    <AnimatedPathText
                      key={`circle-${rotation}`}
                      path={circlePath}
                      pathId={`circle-path-demo-${i}`}
                      showPath={true}
                      pathClassName="stroke-[#E5C378]/30 stroke-[1.5]"
                      svgClassName={`absolute inset-0 w-full h-full pointer-events-none text-[#E5C378] ${
                        rotation === 0
                          ? 'rotate-0'
                          : rotation === 90
                          ? 'rotate-90'
                          : rotation === 180
                          ? 'rotate-180'
                          : '-rotate-90'
                      }`}
                      viewBox="0 0 200 200"
                      text="✦ JADAWEL VIP ✦ JEDDAH ✦ JADAWEL VIP ✦ JEDDAH "
                      textClassName="text-[11px] font-black uppercase fill-[#E5C378] drop-shadow-[0_2px_8px_rgba(229,195,120,0.7)]"
                      duration={5}
                      repeatCount="indefinite"
                      textAnchor="start"
                    />
                  ))}
                  
                  {/* Center Emblem */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#E5C378]/25 to-[#DF9F3D]/35 border border-[#E5C378]/60 flex flex-col items-center justify-center shadow-lg backdrop-blur-md">
                    <Sparkles className="w-4 h-4 text-[#E5C378]" />
                    <span className="text-[9px] font-black text-white mt-0.5">VIP</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4: SCROLL DRIVEN DEMO */}
            {activeTab === 'scroll' && (
              <motion.div
                key="scroll"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="w-full flex flex-col items-center space-y-3"
              >
                <div className="text-xs text-slate-300 text-center">
                  <span>{language === 'ar' ? 'قم بتمرير الصندوق بالأسفل لمشاهدة حركة النص مع التمرير:' : 'Scroll inside the container below to drive the text path:'}</span>
                </div>

                <div
                  ref={scrollContainerRef}
                  className="w-full h-64 overflow-y-auto rounded-xl border border-white/10 bg-black/40 relative p-4 scrollbar-thin"
                >
                  <div className="h-[250%] relative flex flex-col items-center">
                    <div className="sticky top-4 w-full h-36 flex flex-col justify-center">
                      {scrollPaths.map((path, idx) => (
                        <div key={`scroll-p-${idx}`} className="relative w-full h-16">
                          <AnimatedPathText
                            path={path}
                            pathId={`scroll-path-demo-${idx}`}
                            scrollContainer={scrollContainerRef}
                            viewBox="0 0 1000 80"
                            preserveAspectRatio="none"
                            showPath={true}
                            pathClassName="stroke-[#E5C378]/25 stroke-[1.5]"
                            text={
                              idx === 0
                                ? '✦ JADAWEL JEDDAH • SCROLL TO EXPLORE LUXURY RED SEA OUTINGS ✦ JADAWEL JEDDAH ✦ '
                                : '✦ عروس البحر الأحمر • مرر للأعلى والأسفل لاستكشاف المسارات ✦ عروس البحر الأحمر ✦ '
                            }
                            textClassName="text-[14px] font-black fill-[#E5C378] drop-shadow-[0_2px_8px_rgba(229,195,120,0.8)]"
                            animationType="scroll"
                            scrollTransformValues={[-30, 70]}
                            textAnchor="start"
                            svgClassName="w-full h-full text-[#E5C378]"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-48 text-center text-xs text-slate-500 font-mono">
                      <span>↓ {language === 'ar' ? 'تابع التمرير للأسفل...' : 'Keep scrolling down...'} ↓</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Quick developer snippet footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 pt-1 border-t border-white/5 font-mono">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[#E5C378]" />
            <span>import AnimatedPathText from '@/components/fancy/text/text-along-path';</span>
          </div>
          <span className="text-[#E5C378]/80 font-bold">
            {language === 'ar' ? 'جاهز للاستخدام ومطابق للمواصفات 100%' : 'Production Ready & Verified'}
          </span>
        </div>

      </div>
    </section>
  );
};

export default TextAlongPathShowcase;
