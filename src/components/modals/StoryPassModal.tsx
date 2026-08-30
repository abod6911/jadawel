'use client';

import React, { useRef, useState } from 'react';
import { Download, Share2, Sparkles, Clock, Coins, MapPin, Check, Copy, Printer, QrCode, Ticket, Compass } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Itinerary, PlanVariantKey } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { soundEngine } from '@/utils/audioEngine';
import { openWhatsAppShare } from '@/utils/whatsappShare';

interface StoryPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: Itinerary | null;
  activeVariant: PlanVariantKey;
}

export const StoryPassModal: React.FC<StoryPassModalProps> = ({
  isOpen,
  onClose,
  itinerary,
  activeVariant,
}) => {
  const { language, isRTL } = useLanguage();
  const storyCardRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  if (!itinerary) return null;

  const currentPlan = itinerary.variants[activeVariant];

  const handleShareStory = () => {
    soundEngine.playClick();
    const text = language === 'ar'
      ? `🌊 *بطاقة طلعتنا في جدة عبر جداول (Jadawel)* 🌊\n📌 *${currentPlan.titleAr}*\n💰 الميزانية: ~${currentPlan.financials.totalPerPersonSAR} ر.س / شخص\n⏱️ وقت المشاوير: ~${currentPlan.totalTransitMinutes} دقيقة\n\n📍 *المحطات:* \n${currentPlan.stops.map((s, i) => `${i + 1}. ${s.place.nameAr} (${s.timeSlot})`).join('\n')}\n\n🌐 افتح الخطة التفاعلية: https://jadawel.app`
      : `🌊 *Our Jeddah Outing Pass via Jadawel* 🌊\n📌 *${currentPlan.titleEn}*\n💰 Budget: ~${currentPlan.financials.totalPerPersonSAR} SAR / person\n⏱️ Transit: ~${currentPlan.totalTransitMinutes} mins\n\n📍 *Stops:* \n${currentPlan.stops.map((s, i) => `${i + 1}. ${s.place.nameEn} (${s.timeSlot})`).join('\n')}\n\n🌐 View plan: https://jadawel.app`;

    openWhatsAppShare(text);
  };

  const handleCopyLink = () => {
    soundEngine.playClick();
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
    >
      <div className="space-y-6 text-center">
        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-xs font-black">
            <Ticket className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'بطاقة الطلعة الحصرية 9:16' : 'Luxury Outing Boarding Pass'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-pearl">
            {language === 'ar' ? 'تذكرة ستوري إنستقرام والواتساب' : 'Social Story Pass (9:16)'}
          </h3>
          <p className="text-xs sm:text-sm text-pearl-muted font-medium">
            {language === 'ar'
              ? 'تصميم تذكرة صعود فاخرة لمشاركتها فوراً مع الشلة في الستوري أو قروب الواتساب'
              : 'Curated 9:16 luxury boarding pass ready to share with friends on Stories or WhatsApp'}
          </p>
        </div>

        {/* The 9:16 Vertical Story Pass - Luxury Boarding Pass Style */}
        <div
          ref={storyCardRef}
          className="relative w-full max-w-[360px] sm:max-w-[380px] mx-auto rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-abyss-850 via-abyss-900 to-abyss-950 border-2 border-gold-500/40 p-6 flex flex-col justify-between text-start text-pearl shadow-cinematic transition-all duration-300"
        >
          {/* Ambient Lighting Layers */}
          <div className="absolute -top-20 -end-20 w-48 h-48 rounded-full bg-gold-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -start-20 w-48 h-48 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.03] rawashin-lattice pointer-events-none" />

          {/* 1. Header Section: Brand & Verification */}
          <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl overflow-hidden bg-abyss-950 border border-gold-500/50 p-0.5 flex items-center justify-center shadow-glow-gold shrink-0">
                <img
                  src="/images/brand/jadawel-logo.jpg"
                  alt="Jadawel Logo"
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </div>
              <div>
                <span className="text-base font-black text-pearl block leading-tight">جداول | Jadawel</span>
                <span className="text-[10px] text-gold-400 font-bold">صانع مسارات جدة الذكي</span>
              </div>
            </div>

            <div className="px-3 py-1 rounded-xl bg-coral-500/20 text-coral-400 text-xs font-black border border-coral-500/40 flex items-center gap-1 shadow-sm">
              <span>{language === 'ar' ? currentPlan.badgeAr : currentPlan.badgeEn}</span>
            </div>
          </div>

          {/* 2. Middle Body: Plan Title, Vibe & Stops Timeline */}
          <div className="relative z-10 py-5 space-y-4">
            {/* Title & Tagline */}
            <div className="space-y-1">
              <h4 className="text-lg sm:text-xl font-black text-pearl leading-snug">
                {language === 'ar' ? currentPlan.titleAr : currentPlan.titleEn}
              </h4>
              <p className="text-xs text-pearl-muted font-medium leading-relaxed">
                {language === 'ar' ? currentPlan.taglineAr : currentPlan.taglineEn}
              </p>
            </div>

            {/* Stops list with spacious layout & zero text clipping */}
            <div className="space-y-2.5">
              {currentPlan.stops.map((stop, idx) => (
                <div
                  key={stop.id}
                  className="p-3.5 rounded-2xl bg-abyss-800/90 border border-white/10 flex items-center justify-between gap-3 shadow-md hover:border-gold-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-gold-500 text-abyss-950 text-xs font-black flex items-center justify-center shrink-0 shadow-sm">
                      {idx + 1}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-gold-400">
                          {stop.timeSlot}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-pearl-muted font-bold">
                          {language === 'ar' ? stop.place.districtNameAr : stop.place.districtNameEn}
                        </span>
                      </div>
                      <h5 className="text-xs sm:text-sm font-bold text-pearl leading-tight truncate">
                        {language === 'ar' ? stop.place.nameAr : stop.place.nameEn}
                      </h5>
                    </div>
                  </div>

                  <div className="text-end shrink-0 ps-1">
                    <span className="text-xs font-black text-teal-300 block">
                      {stop.place.averageCostSAR > 0 ? `${stop.place.averageCostSAR} ر.س` : (language === 'ar' ? 'مجاني' : 'Free')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Bottom Summary & Boarding Pass Details */}
          <div className="relative z-10 pt-4 border-t border-white/10 space-y-3">
            {/* Stats Pills */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <div className="p-2.5 rounded-xl bg-abyss-900/90 border border-gold-500/25 flex items-center gap-2 text-gold-400">
                <Coins className="w-4 h-4 shrink-0" />
                <span className="truncate">~{currentPlan.financials.totalPerPersonSAR} ر.س / شخص</span>
              </div>

              <div className="p-2.5 rounded-xl bg-abyss-900/90 border border-teal-500/25 flex items-center gap-2 text-teal-300">
                <Clock className="w-4 h-4 shrink-0" />
                <span className="truncate">~{currentPlan.totalTransitMinutes} د مشاوير</span>
              </div>
            </div>

            {/* Authenticity Watermark */}
            <div className="flex items-center justify-between text-[10px] text-pearl-muted font-medium pt-1">
              <span>jadawel.app • عروس البحر الأحمر 🌊🌴</span>
              <span className="font-mono text-gold-400/90 font-bold">JDW-2026-PASS</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
          {/* Primary Share to WhatsApp */}
          <button
            type="button"
            onClick={handleShareStory}
            className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-abyss-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>{language === 'ar' ? 'مشاركة عبر واتساب للشلة' : 'Share via WhatsApp'}</span>
          </button>

          {/* Copy Link Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full sm:w-auto py-3.5 px-4 rounded-2xl bg-abyss-800 hover:bg-abyss-700 text-pearl font-bold text-xs sm:text-sm border border-white/15 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">{language === 'ar' ? 'تم النسخ ✓' : 'Copied ✓'}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gold-400" />
                <span>{language === 'ar' ? 'نسخ الرابط' : 'Copy Link'}</span>
              </>
            )}
          </button>

          {/* Print / Save */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              window.print();
            }}
            className="w-full sm:w-auto py-3.5 px-4 rounded-2xl bg-abyss-800 hover:bg-abyss-700 text-pearl font-bold text-xs sm:text-sm border border-white/15 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            title="طباعة / حفظ PDF"
          >
            <Printer className="w-4 h-4 text-pearl-muted" />
            <span>{language === 'ar' ? 'طباعة' : 'Print'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
