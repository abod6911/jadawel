'use client';

import React, { useState } from 'react';
import { Vote, MessageCircle, Check, Copy, Sparkles, Zap, Scale, Crown } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { Modal } from '@/components/ui/Modal';
import { soundEngine } from '@/utils/audioEngine';
import { openWhatsAppShare } from '@/utils/whatsappShare';

export const GroupVotingModal: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const isVotingModalOpen = useItineraryStore((state) => state.isVotingModalOpen);
  const setIsVotingModalOpen = useItineraryStore((state) => state.setIsVotingModalOpen);
  const currentItinerary = useItineraryStore((state) => state.currentItinerary);

  const [copied, setCopied] = useState(false);

  if (!isVotingModalOpen || !currentItinerary) return null;

  const fastest = currentItinerary.variants.fastest;
  const balanced = currentItinerary.variants.balanced;
  const luxury = currentItinerary.variants.luxury;

  const buildPollText = () => {
    const isAr = language === 'ar';
    if (isAr) {
      return (
        `🗳️ *تصويت الشلة: وش خطتنا اليوم في جدة؟*\n\n` +
        `1️⃣ *الخيار 1: الأقرب والأسرع ⚡*\n` +
        `   المسار: ${fastest.stops.map((s) => s.place.nameAr).join(' ➔ ')}\n` +
        `   💰 التكلفة: ~${fastest.financials.totalPerPersonSAR} ر.س | 🚗 وقت المشوار: ${fastest.totalTransitMinutes} دقيقة\n\n` +
        `2️⃣ *الخيار 2: الخطة الموزونة ⚖️ (المقترحة)*\n` +
        `   المسار: ${balanced.stops.map((s) => s.place.nameAr).join(' ➔ ')}\n` +
        `   💰 التكلفة: ~${balanced.financials.totalPerPersonSAR} ر.س | 🚗 وقت المشوار: ${balanced.totalTransitMinutes} دقيقة\n\n` +
        `3️⃣ *الخيار 3: التجربة الفخمة 💎*\n` +
        `   المسار: ${luxury.stops.map((s) => s.place.nameAr).join(' ➔ ')}\n` +
        `   💰 التكلفة: ~${luxury.financials.totalPerPersonSAR} ر.س | 🚗 وقت المشوار: ${luxury.totalTransitMinutes} دقيقة\n\n` +
        `رد برقم الخيار اللي يناسبك! 👇✨\n` +
        `🌐 التفاصيل كاملة عبر جداول: https://jadawel.app`
      );
    }
    return (
      `🗳️ *Group Vote: Which Jeddah Outing Plan?*\n\n` +
      `1️⃣ Option 1: Fastest & Closest ⚡ (~${fastest.financials.totalPerPersonSAR} SAR)\n` +
      `2️⃣ Option 2: The Balanced Plan ⚖️ (~${balanced.financials.totalPerPersonSAR} SAR)\n` +
      `3️⃣ Option 3: Luxury VIP 💎 (~${luxury.financials.totalPerPersonSAR} SAR)\n\n` +
      `Reply with your favorite option number! 👇`
    );
  };

  const handleShareWhatsApp = () => {
    soundEngine.playClick();
    const text = buildPollText();
    openWhatsAppShare(text);
  };

  const handleCopyPoll = () => {
    soundEngine.playClick();
    const text = buildPollText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Modal
      isOpen={isVotingModalOpen}
      onClose={() => setIsVotingModalOpen(false)}
      title={
        <div className="flex items-center gap-2">
          <Vote className="w-5 h-5 text-gold-400" />
          <span className="text-base sm:text-lg font-black text-white">
            {language === 'ar' ? 'تصويت الشلة على الخطة (Group Poll)' : 'Group Outing Voting Poll'}
          </span>
        </div>
      }
      subtitle={
        language === 'ar'
          ? 'أنشئ بطاقة تصويت منسقة للواتساب لاختيار الخطة الأنسب للشلة'
          : 'Create a preformatted voting card for your WhatsApp group'
      }
      maxWidth="lg"
    >
      <div className="space-y-4 pt-1 text-start">
        {/* Preview of the 3 voting choices */}
        <div className="space-y-3">
          {/* Choice 1 */}
          <div className="p-3.5 rounded-2xl bg-navy-950 border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center font-bold text-xs">
                1️⃣
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  {fastest.titleAr}
                </h4>
                <span className="text-[11px] text-slate-400">
                  ~{fastest.financials.totalPerPersonSAR} ر.س • {fastest.totalTransitMinutes} دقيقة مشاوير
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-teal-400">
              {fastest.stops.length} محطات
            </span>
          </div>

          {/* Choice 2 */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-gold-500/15 via-gold-500/5 to-transparent border border-gold-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gold-500 text-navy-950 font-black text-xs flex items-center justify-center">
                2️⃣
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  {balanced.titleAr} ⭐
                </h4>
                <span className="text-[11px] text-gold-400 font-semibold">
                  ~{balanced.financials.totalPerPersonSAR} ر.س • الخيار الموصى به
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-gold-400">
              {balanced.stops.length} محطات
            </span>
          </div>

          {/* Choice 3 */}
          <div className="p-3.5 rounded-2xl bg-navy-950 border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-coral-500/15 text-coral-400 flex items-center justify-center font-bold text-xs">
                3️⃣
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  {luxury.titleAr}
                </h4>
                <span className="text-[11px] text-slate-400">
                  ~{luxury.financials.totalPerPersonSAR} ر.س • تجربة VIP حصرية
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-coral-400">
              {luxury.stops.length} محطات
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-navy-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{language === 'ar' ? 'إرسال التصويت للواتساب 🗳️' : 'Share Poll to WhatsApp'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyPoll}
            className="w-full py-3.5 px-4 rounded-2xl bg-navy-800 hover:bg-navy-700 text-white font-bold text-xs sm:text-sm border border-white/15 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">{language === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gold-400" />
                <span>{language === 'ar' ? 'نسخ نص التصويت 📋' : 'Copy Poll Text'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
