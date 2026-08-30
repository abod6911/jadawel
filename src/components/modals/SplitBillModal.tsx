'use client';

import React, { useState } from 'react';
import { Users, Plus, Minus, Calculator, MessageCircle, DollarSign, Sparkles, Utensils, Ticket, Car, ShieldAlert, Coins } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { Modal } from '@/components/ui/Modal';
import { soundEngine } from '@/utils/audioEngine';
import { openWhatsAppShare } from '@/utils/whatsappShare';

export const SplitBillModal: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const isSplitBillOpen = useItineraryStore((state) => state.isSplitBillOpen);
  const setIsSplitBillOpen = useItineraryStore((state) => state.setIsSplitBillOpen);
  const currentItinerary = useItineraryStore((state) => state.currentItinerary);

  const [headcount, setHeadcount] = useState<number>(4);
  const [includeBuffer, setIncludeBuffer] = useState<boolean>(true);

  if (!isSplitBillOpen || !currentItinerary) return null;

  const currentVariant = currentItinerary.variants[currentItinerary.activeVariant];
  const financials = currentVariant.financials;

  const safeTotalSAR = financials.totalSAR ?? (financials.totalPerPersonSAR * 2);
  const foodBase = financials.foodAndBeverageSAR || Math.round(safeTotalSAR * 0.65);
  const activitiesBase = financials.activitiesAndTicketsSAR || Math.round(safeTotalSAR * 0.22);
  const transitBase = financials.estimatedTransitSAR || financials.transitEstimatedSAR || Math.max(30, Math.round(safeTotalSAR * 0.13));

  const subTotal = foodBase + activitiesBase + transitBase;
  const bufferTotal = includeBuffer ? Math.round(subTotal * 0.1) : 0;
  const grandTotal = subTotal + bufferTotal;
  const perPerson = Math.round(grandTotal / headcount);

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
      msg += `▫️ مشاوير أوبر: ~${transitBase} ر.س\n`;
      if (includeBuffer) msg += `▫️ احتياطي طوارئ (10%): ~${bufferTotal} ر.س\n`;
      msg += `▫️ المجموع الكلي: *${grandTotal} ر.س*\n\n`;
      msg += `✨ تم الترتيب والحساب تلقائياً عبر منصة جداول 🌊\n`;
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
      msg += `✨ Calculated with Jadawel 🌊`;
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

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setHeadcount((prev) => Math.max(1, prev - 1));
                }}
                disabled={headcount <= 1}
                className="w-10 h-10 rounded-xl bg-abyss-800 hover:bg-abyss-700 disabled:opacity-30 border border-white/10 text-pearl font-black flex items-center justify-center transition-all cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setHeadcount((prev) => prev + 1);
                }}
                className="w-10 h-10 rounded-xl bg-abyss-800 hover:bg-abyss-700 border border-white/10 text-pearl font-black flex items-center justify-center transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-abyss-900 border border-white/5">
            <div className="flex items-center gap-2 text-pearl font-medium">
              <Utensils className="w-4 h-4 text-gold-400" />
              <span>{language === 'ar' ? 'الأكل والمشروبات المقدرة' : 'Estimated Food & Coffee'}</span>
            </div>
            <span className="font-bold text-pearl">~{foodBase} ر.س</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-abyss-900 border border-white/5">
            <div className="flex items-center gap-2 text-pearl font-medium">
              <Ticket className="w-4 h-4 text-coral-400" />
              <span>{language === 'ar' ? 'رسوم التذاكر والفعاليات' : 'Tickets & Activities'}</span>
            </div>
            <span className="font-bold text-pearl">~{activitiesBase} ر.س</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-abyss-900 border border-white/5">
            <div className="flex items-center gap-2 text-pearl font-medium">
              <Car className="w-4 h-4 text-teal-400" />
              <span>{language === 'ar' ? 'مشاوير أوبر التقديرية' : 'Estimated Uber Rides'}</span>
            </div>
            <span className="font-bold text-pearl">~{transitBase} ر.س</span>
          </div>

          {/* Buffer Toggle */}
          <div
            onClick={() => {
              soundEngine.playClick();
              setIncludeBuffer((prev) => !prev);
            }}
            className="flex items-center justify-between p-3 rounded-xl bg-abyss-900 border border-white/5 cursor-pointer hover:border-gold-500/30 transition-colors"
          >
            <div className="flex items-center gap-2 text-pearl font-medium">
              <input
                type="checkbox"
                checked={includeBuffer}
                onChange={() => {}}
                className="w-4 h-4 rounded text-gold-500 focus:ring-gold-400 bg-abyss-950 border-white/20"
              />
              <span>{language === 'ar' ? 'إضافة 10% احتياطي طوارئ' : 'Include 10% Emergency Buffer'}</span>
            </div>
            <span className="font-bold text-gold-400">~{bufferTotal} ر.س</span>
          </div>
        </div>

        {/* Per Person Result Highlight */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-gold-500/20 via-coral-500/20 to-teal-500/20 border border-gold-500/40 text-center space-y-1 shadow-glow-gold">
          <span className="text-xs text-gold-300 font-bold uppercase tracking-wider block">
            {language === 'ar' ? 'القطة المقدرة للشخص الواحد' : 'Estimated Share per Person'}
          </span>
          <div className="text-3xl sm:text-4xl font-black text-pearl font-sans">
            ~{perPerson} <span className="text-lg text-gold-400 font-normal">ر.س</span>
          </div>
          <span className="text-[11px] text-pearl-muted block">
            {language === 'ar' ? `المجموع الكلي: ~${grandTotal} ر.س` : `Grand Total: ~${grandTotal} SAR`}
          </span>
        </div>

        {/* WhatsApp Share Button */}
        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-abyss-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{language === 'ar' ? 'مشاركة الحسبة للشلة عبر واتساب' : 'Share Breakdown to WhatsApp'}</span>
        </button>
      </div>
    </Modal>
  );
};
