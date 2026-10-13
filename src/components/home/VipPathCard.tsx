'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import AnimatedPathText from '@/components/fancy/text/text-along-path';
import { useLanguage } from '@/hooks/useLanguage';
import { soundEngine } from '@/utils/audioEngine';

export const VipPathCard: React.FC = () => {
  const { language } = useLanguage();
  const [contactValue, setContactValue] = useState('');
  const [buttonState, setButtonState] = useState<'idle' | 'loading' | 'success'>('idle');

  // Exact rounded rectangle path matching the official Fancy text-along-path specification
  const rectPath =
    'M 20,20 L 180,20 A 20,20 0 0,1 200,40 L 200,160 A 20,20 0 0,1 180,180 L 20,180 A 20,20 0 0,1 0,160 L 0,40 A 20,20 0 0,1 20,20';

  // Repeated text to seamlessly wrap the full 685-unit perimeter of the rounded rectangle
  const textAr =
    '✦ عضوية جداول VIP الحصرية ✦ يخوت وشواطئ أبحر ✦ كونسيرج 24/7 ✦ حجز مسارك الخاص ✦ عضوية جداول VIP الحصرية ✦ يخوت وشواطئ أبحر ✦ كونسيرج 24/7 ✦ حجز مسارك الخاص ✦ ';

  const textEn =
    '✦ JADAWEL VIP CONCIERGE ✦ BESPOKE PRIVATE YACHTS ✦ 24/7 PRIORITY ACCESS ✦ BOOK YOUR PRIVATE ROUTE ✦ JADAWEL VIP CONCIERGE ✦ BESPOKE PRIVATE YACHTS ✦ ';

  const buttonCopy = {
    idle: language === 'ar' ? 'طلب مسار VIP ✦' : 'Request VIP ✦',
    loading: (
      <div className="w-4 h-4 border-2 border-[#0B0D12] border-t-transparent rounded-full animate-spin" />
    ),
    success: language === 'ar' ? 'تم استلام طلبك ✓' : 'Done ✓',
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (buttonState === 'success') return;
      if (!contactValue.trim()) return;

      soundEngine.playClick();
      setButtonState('loading');

      setTimeout(() => {
        soundEngine.playSuccess();
        setButtonState('success');
      }, 1500);

      setTimeout(() => {
        setButtonState('idle');
        setContactValue('');
      }, 4000);
    },
    [buttonState, contactValue]
  );

  return (
    <section
      aria-label="VIP Concierge Experience"
      className="relative w-full max-w-3xl mx-auto my-12 sm:my-16 px-3 sm:px-6 select-none"
    >
      {/* Outer ambient glow */}
      <div className="absolute -inset-3 bg-gradient-to-r from-[#DF9F3D]/15 via-[#E5C378]/20 to-[#2DD4BF]/15 rounded-[2.5rem] blur-2xl pointer-events-none -z-10" />

      {/* Main Container Card */}
      <div className="relative py-8 sm:py-12 px-4 sm:px-10 rounded-[2.25rem] bg-[#090D14]/95 backdrop-blur-2xl border border-[#E5C378]/35 shadow-[0_24px_70px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col items-center justify-center text-center space-y-6">
        
        {/* 1. Header Information */}
        <div className="space-y-2 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E5C378]/15 border border-[#E5C378]/40 text-[#F5E2B3] text-xs font-black shadow-sm">
            <Crown className="w-3.5 h-3.5 text-[#E5C378]" />
            <span>{language === 'ar' ? 'خدمة الكونسيرج ومسارات VIP' : 'Bespoke VIP Concierge'}</span>
          </div>

          <h3 className="text-xl sm:text-3xl font-black text-white leading-snug">
            {language === 'ar'
              ? 'هل ترغب بمسار VIP مصمم خصيصاً لك؟'
              : 'Looking for a Bespoke VIP Luxury Itinerary?'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-md mx-auto">
            {language === 'ar'
              ? 'سجل رقمك أو بريدك، وسيتواصل معك مستشار جداول لتأكيد حجز يختك الخاص وأرقى المطاعم.'
              : 'Leave your contact and our private concierge will tailor an elite yacht reservation.'}
          </p>
        </div>

        {/* 2. Interactive Orbiting Frame (Using the exact Fancy Text Along Path specification) */}
        <div className="relative w-full max-w-[340px] sm:max-w-[400px] h-56 sm:h-64 flex items-center justify-center">
          
          {/* Animated Path Text circling around the input box */}
          <AnimatedPathText
            path={rectPath}
            pathId="vip-card-orbit-path"
            viewBox="-20 10 240 180"
            showPath={true}
            pathClassName="stroke-[#E5C378]/30 stroke-[1.2] stroke-dasharray-[5_4]"
            text={language === 'ar' ? textAr : textEn}
            textClassName="text-[9.5px] sm:text-[10px] font-black uppercase fill-[#F5E2B3] drop-shadow-[0_2px_10px_rgba(229,195,120,0.8)]"
            duration={18}
            repeatCount="indefinite"
            preserveAspectRatio="none"
            textAnchor="start"
            svgClassName="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* Form Controls neatly centered inside the orbiting boundary */}
          <div className="relative z-10 w-full max-w-[240px] sm:max-w-[280px] p-2 space-y-3">
            <input
              type="text"
              placeholder={language === 'ar' ? '05xxxxxxxx أو بريدك' : '05xxxxxxxx or email'}
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              disabled={buttonState === 'loading' || buttonState === 'success'}
              className="w-full h-11 px-3.5 rounded-xl bg-white/[0.08] border border-[#E5C378]/40 text-white placeholder-slate-400 text-xs sm:text-sm font-bold focus:outline-none focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378]/50 transition-all text-center"
            />
            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={buttonState === 'loading' || !contactValue.trim()}
              className="w-full h-11 px-4 rounded-xl bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] text-[#0B0D12] text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-[0_4px_18px_rgba(229,195,120,0.4)] active:scale-95 transition-all cursor-pointer whitespace-nowrap overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={buttonState}
                  transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex items-center justify-center gap-1.5"
                >
                  {buttonCopy[buttonState]}
                  {buttonState === 'idle' && (
                    <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>

        </div>

        {/* Trust bullet */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-[#E5C378]" />
          <span>{language === 'ar' ? 'خصوصية تامة وتأكيد فوري عبر واتساب' : 'Total privacy & prompt WhatsApp confirmation'}</span>
        </div>

      </div>
    </section>
  );
};

export default VipPathCard;
