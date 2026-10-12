'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Sparkles, ArrowLeft, Check, PhoneCall, ShieldCheck } from 'lucide-react';
import { AnimatedPathText } from '@/components/fancy/AnimatedPathText';
import { useLanguage } from '@/hooks/useLanguage';
import { soundEngine } from '@/utils/audioEngine';

export const VipPathCard: React.FC = () => {
  const { language } = useLanguage();
  const [contactValue, setContactValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Exact rounded rectangle path matching the user's Fancy component specification
  const rectPath =
    'M 20,20 L 180,20 A 20,20 0 0,1 200,40 L 200,160 A 20,20 0 0,1 180,180 L 20,180 A 20,20 0 0,1 0,160 L 0,40 A 20,20 0 0,1 20,20';

  const textAr =
    '✦ عـضـويـة جـداول VIP الـحـصـريـة ✦ يـخـوت وشـواطـئ أبـحـر ✦ كـونـسـيـرج 24/7 ✦ حـجـز مـسـارك الـخـاص ✦ ';

  const textEn =
    '✦ JADAWEL VIP CONCIERGE ✦ BESPOKE PRIVATE YACHTS ✦ 24/7 PRIORITY ACCESS ✦ BOOK YOUR PRIVATE ROUTE ✦ ';

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (status === 'success') return;
      if (!contactValue.trim()) return;

      soundEngine.playClick();
      setStatus('loading');

      setTimeout(() => {
        soundEngine.playSuccess();
        setStatus('success');
      }, 1200);

      setTimeout(() => {
        setStatus('idle');
        setContactValue('');
      }, 4500);
    },
    [status, contactValue]
  );

  return (
    <section
      aria-label="VIP Concierge Experience"
      className="relative w-full max-w-2xl mx-auto my-12 sm:my-16 px-3 sm:px-6 select-none"
    >
      {/* Outer ambient glow */}
      <div className="absolute -inset-2 bg-gradient-to-r from-[#DF9F3D]/10 via-[#E5C378]/15 to-[#2DD4BF]/10 rounded-3xl blur-2xl pointer-events-none -z-10" />

      {/* Main Container Card */}
      <div className="relative py-8 sm:py-10 px-4 sm:px-8 rounded-3xl bg-[#090D14]/90 backdrop-blur-2xl border border-[#E5C378]/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center justify-center text-center space-y-6">
        
        {/* 1. Header Information */}
        <div className="space-y-2 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5C378]/15 border border-[#E5C378]/35 text-[#F5E2B3] text-xs font-black shadow-sm">
            <Crown className="w-3.5 h-3.5 text-[#E5C378]" />
            <span>{language === 'ar' ? 'خدمة الكونسيرج ومسارات VIP' : 'Bespoke VIP Concierge'}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
            {language === 'ar'
              ? 'هل ترغب بمسار VIP مصمم خصيصاً لك؟'
              : 'Looking for a Bespoke VIP Luxury Itinerary?'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            {language === 'ar'
              ? 'سجل رقمك وسيتواصل معك مستشار جداول لحجز يخت خاص وأرقى الطاولات.'
              : 'Leave your contact and our private concierge will tailor an elite yacht reservation.'}
          </p>
        </div>

        {/* 2. Interactive Orbiting Frame (Using the exact user's Fancy AnimatedPathText pattern) */}
        <div className="relative w-full max-w-[320px] sm:max-w-[380px] h-44 sm:h-48 flex items-center justify-center">
          
          {/* Animated Path Text circling around the input box */}
          <AnimatedPathText
            path={rectPath}
            pathId="vip-card-orbit-path"
            viewBox="-15 10 230 180"
            showPath={true}
            pathClassName="stroke-[#E5C378]/30 stroke-[1.2] stroke-dasharray-[4_3]"
            text={language === 'ar' ? textAr : textEn}
            textClassName="text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-widest fill-[#F5E2B3] drop-shadow-[0_2px_8px_rgba(229,195,120,0.7)]"
            duration={20}
            repeatCount="indefinite"
            preserveAspectRatio="none"
            textAnchor="start"
            svgClassName="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* Form Controls neatly centered inside the orbiting boundary */}
          <div className="relative z-10 w-full max-w-[240px] sm:max-w-[280px] p-2 space-y-2.5">
            <input
              type="text"
              placeholder={language === 'ar' ? '05xxxxxxxx أو بريدك' : '05xxxxxxxx or email'}
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              disabled={status === 'loading' || status === 'success'}
              className="w-full h-10 px-3.5 rounded-xl bg-white/[0.08] border border-[#E5C378]/40 text-white placeholder-slate-400 text-xs sm:text-sm font-bold focus:outline-none focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378]/50 transition-all text-center"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={status === 'loading' || !contactValue.trim()}
              className="w-full h-10 px-4 rounded-xl bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] text-[#0B0D12] text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(229,195,120,0.4)] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <AnimatePresence mode="wait" initial={false}>
                {status === 'loading' ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-4 h-4 border-2 border-[#0B0D12] border-t-transparent rounded-full animate-spin"
                  />
                ) : status === 'success' ? (
                  <motion.span
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1 text-emerald-950 font-black"
                  >
                    <Check className="w-4 h-4" />
                    <span>{language === 'ar' ? 'تم استلام طلبك ✓' : 'Received ✓'}</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5"
                  >
                    <span>{language === 'ar' ? 'طلب مسار VIP ✦' : 'Request VIP ✦'}</span>
                    <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

        </div>

        {/* Trust bullet */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#E5C378]" />
          <span>{language === 'ar' ? 'خصوصية تامة وتأكيد سريع عبر واتساب' : 'Total privacy & prompt WhatsApp confirmation'}</span>
        </div>

      </div>
    </section>
  );
};

export default VipPathCard;
