'use client';

import React, { useState } from 'react';
import { Users, Plus, Minus, Calculator, MessageCircle, Utensils, Ticket, Car, Footprints, Coins } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { Modal } from '@/components/ui/Modal';
import { soundEngine } from '@/utils/audioEngine';
import { openWhatsAppShare } from '@/utils/whatsappShare';

export const SplitBillModal: React.FC = () => {
  const { language } = useLanguage();
  const isSplitBillOpen = useItineraryStore((state) => state.isSplitBillOpen);
  const setIsSplitBillOpen = useItineraryStore((state) => state.setIsSplitBillOpen);
  const currentItinerary = useItineraryStore((state) => state.currentItinerary);

  const [headcount, setHeadcount] = useState<number>(4);
  const [includeBuffer, setIncludeBuffer] = useState<boolean>(true);

  if (!isSplitBillOpen || !currentItinerary) return null;

  const currentVariant =
    (currentItinerary.variants as any)[currentItinerary.activeVariant] ||
    currentItinerary.variants.balanced;
  const financials = currentVariant?.financials || currentItinerary.financials;

  const safeTotalSAR = financials?.totalSAR ?? (financials?.totalPerPersonSAR * 2);
  const foodBase = financials?.foodAndBeverageSAR || Math.round(safeTotalSAR * 0.65);
  const activitiesBase = financials?.activitiesAndTicketsSAR || Math.round(safeTotalSAR * 0.22);
  const transitBase = financials?.estimatedTransitSAR || financials?.transitEstimatedSAR || Math.max(30, Math.round(safeTotalSAR * 0.13));

  const subTotal = foodBase + activitiesBase + transitBase;
  const bufferTotal = includeBuffer ? Math.round(subTotal * 0.1) : 0;
  const grandTotal = subTotal + bufferTotal;
  const perPerson = Math.round(grandTotal / Math.max(1, headcount));

  const handleShareWhatsApp = () => {
    soundEngine.playClick();
    const isAr = language === 'ar';
    let msg = '';
    if (isAr) {
      msg = `💳 *حسبة قطة طلعة جدة | جداول (Jadawel)*\n`;
      msg += `📌 *${currentVariant.titleAr}*\n`;
      msg += `👥 عدد الشلة: ${headcount} أشخاص\n`;
      msg += `💰 قطة الشخص الواحد: *${perPerson} ر.س*\n\n`;
      msg += `📊 *تفاصيل الحسبة:*\n`;
      msg += `▫️ الأكل والمقاهي: ~${foodBase} ر.س\n`;
      msg += `▫️ التذاكر والأنشطة: ~${activitiesBase} ر.س\n`;
      msg += transitBase === 0 ? `▫️ المواصلات: كعابي (المشي) مجاناً 🚶‍♂️\n` : `▫️ مشاوير أوبر: ~${transitBase} ر.س\n`;
      if (includeBuffer) msg += `▫️ احتياطي طوارئ (10%): ~${bufferTotal} ر.س\n`;
      msg += `▫️ المجموع الكلي: *${grandTotal} ر.س*\n\n`;
      msg += `تم الترتيب والحساب تلقائياً عبر منصة جداول 🌊\n`;
      msg += `🌐 https://jadawel.app`;
    } else {
      msg = `💳 *Jadawel Jeddah Outing Split Bill*\n`;
      msg += `📌 *${currentVariant.titleEn}*\n`;
      msg += `👥 Group Size: ${headcount} people\n`;
      msg += `💰 Share per Person: *${perPerson} SAR*\n\n`;
      msg += `📊 *Breakdown:*\n`;
      msg += `▫️ Food & Dining: ~${foodBase} SAR\n`;
      msg += `▫️ Activities: ~${activitiesBase} SAR\n`;
      msg += `▫️ Uber Rideshare: ~${transitBase} SAR\n`;
      if (includeBuffer) msg += `▫️ Emergency Buffer (10%): ~${bufferTotal} SAR\n`;
      msg += `▫️ Grand Total: *${grandTotal} SAR*\n\n`;
      msg += `Calculated with Jadawel 🌊`;
    }

    openWhatsAppShare(msg);
  };

  return (
    <Modal
      isOpen={isSplitBillOpen}
      onClose={() => setIsSplitBillOpen(false)}
      maxWidth="md"
    >
      <div className="space-y-6 text-start">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold-500/20 text-gold-400 border border-gold-500/30 flex items-center justify-center shadow-glow-gold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-pearl">
                {language === 'ar' ? 'حاسبة قطة الشلة والطلعة' : 'Group Bill Splitter'}
              </h3>
              <p className="text-xs text-pearl-muted font-medium">
                {language === 'ar' ? 'تقسيم عادل وشامل لكافة تكاليف المسار' : 'Fair and comprehensive outing expense splitting'}
              </p>
            </div>
          </div>
        </div>

        {/* Headcount Adjuster */}
        <div className="p-5 rounded-2xl bg-abyss-950/80 border border-white/10 space-y-3">
          <label className="text-xs font-bold text-pearl-muted block">
            {language === 'ar' ? 'كم شخص طالعين معاكم اليوم؟' : 'How many people in your group?'}
          </label>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-pearl font-black text-lg">
              <Users className="w-5 h-5 text-teal-400" />
              <span>{headcount} {language === 'ar' ? 'أشخاص' : 'people'}</span>
            </div>

            <div className="flex items-center gap-2 bg-abyss-900 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setHeadcount((prev) => Math.max(1, prev - 1));
                }}
                className="w-9 h-9 rounded-lg bg-abyss-800 hover:bg-abyss-700 text-pearl flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Decrease headcount"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-mono font-bold text-sm text-gold-400 px-2">{headcount}</span>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setHeadcount((prev) => Math.min(25, prev + 1));
                }}
                className="w-9 h-9 rounded-lg bg-abyss-800 hover:bg-abyss-700 text-pearl flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Increase headcount"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Emergency Buffer Toggle */}
        <div className="p-4 rounded-2xl bg-abyss-950/60 border border-white/10 flex items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-pearl">
              {language === 'ar' ? 'إضافة 10% احتياطي طوارئ وحلى إضافي' : 'Add 10% buffer for unexpected treats'}
            </h4>
            <span className="text-[11px] text-pearl-muted">
              {language === 'ar' ? `(~${bufferTotal} ر.س إجمالي)` : `(~${bufferTotal} SAR total)`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setIncludeBuffer((prev) => !prev);
            }}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
              includeBuffer ? 'bg-gold-500' : 'bg-abyss-800'
            }`}
            aria-label="Toggle Buffer"
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                includeBuffer ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Cost Breakdown Matrix */}
        <div className="space-y-2 p-4 rounded-2xl bg-abyss-950/80 border border-white/10 text-xs">
          <div className="flex items-center justify-between text-pearl-muted py-1 border-b border-white/5">
            <span className="flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-gold-400" />
              <span>{language === 'ar' ? 'الأكل والمقاهي' : 'Dining & Coffee'}</span>
            </span>
            <span className="font-bold text-pearl">~{foodBase} ر.س</span>
          </div>

          <div className="flex items-center justify-between text-pearl-muted py-1 border-b border-white/5">
            <span className="flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-coral-400" />
              <span>{language === 'ar' ? 'التذاكر والأنشطة' : 'Tickets & Activities'}</span>
            </span>
            <span className="font-bold text-pearl">~{activitiesBase} ر.س</span>
          </div>

          <div className="flex items-center justify-between text-pearl-muted py-1 border-b border-white/5">
            <span className="flex items-center gap-1.5">
              {transitBase === 0 ? (
                <Footprints className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Car className="w-3.5 h-3.5 text-teal-400" />
              )}
              <span>
                {transitBase === 0
                  ? language === 'ar' ? 'المواصلات: كعابي (المشي)' : 'Transit: Walking'
                  : language === 'ar' ? 'مشاوير أوبر المقدرة' : 'Uber Transit'}
              </span>
            </span>
            <span className="font-bold text-pearl">
              {transitBase === 0 ? (language === 'ar' ? '0 ر.س (مجاناً)' : '0 SAR (Free)') : `~${transitBase} ر.س`}
            </span>
          </div>

          {includeBuffer && (
            <div className="flex items-center justify-between text-gold-400 py-1 border-b border-white/5">
              <span className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'احتياطي الطوارئ (10%)' : 'Emergency Buffer (10%)'}</span>
              </span>
              <span className="font-bold">~{bufferTotal} ر.س</span>
            </div>
          )}

          <div className="flex items-center justify-between text-pearl font-black pt-2 text-sm">
            <span>{language === 'ar' ? 'المجموع الكلي للطلعة' : 'Grand Total'}</span>
            <span className="text-gold-400 text-base font-black">~{grandTotal} ر.س</span>
          </div>
        </div>

        {/* Big Per-Person Result Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-gold-500/20 via-gold-500/10 to-coral-500/20 border border-gold-500/40 text-center space-y-1 shadow-glow-gold">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-wider block">
            {language === 'ar' ? 'قطة الشخص الواحد المطلوبة' : 'Individual Share'}
          </span>
          <div className="text-3xl sm:text-4xl font-black text-pearl font-mono">
            ~{perPerson} <span className="text-base font-sans font-bold text-gold-400">{language === 'ar' ? 'ر.س' : 'SAR'}</span>
          </div>
        </div>

        {/* WhatsApp Share CTA */}
        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all active:scale-[0.98]"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>{language === 'ar' ? 'إرسال الحسبة في قروب الواتساب' : 'Share Bill to WhatsApp'}</span>
        </button>
      </div>
    </Modal>
  );
};

export default SplitBillModal;
