'use client';

import React, { useState } from 'react';
import { Vote, MessageCircle, Check, Copy, Compass, Footprints, Zap, Scale, Crown } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { Modal } from '@/components/ui/Modal';
import { soundEngine } from '@/utils/audioEngine';
import { openWhatsAppShare } from '@/utils/whatsappShare';
import { buildPlanShareUrl } from '@/services/shareService';

export const GroupVotingModal: React.FC = () => {
  const { language } = useLanguage();
  const isVotingModalOpen = useItineraryStore((state) => state.isVotingModalOpen);
  const setIsVotingModalOpen = useItineraryStore((state) => state.setIsVotingModalOpen);
  const currentItinerary = useItineraryStore((state) => state.currentItinerary);

  const [copied, setCopied] = useState(false);

  if (!isVotingModalOpen || !currentItinerary) return null;

  const fastest = currentItinerary.variants?.fastest || currentItinerary.variants?.balanced;
  const balanced = currentItinerary.variants?.balanced || fastest;
  const thirdVariant =
    currentItinerary.variants?.free ||
    currentItinerary.variants?.luxury ||
    balanced;
  const isThirdFree = !!currentItinerary.variants?.free;

  const buildPollText = () => {
    const isAr = language === 'ar';
    const shareUrl = buildPlanShareUrl(currentItinerary, currentItinerary.preferences);

    if (isAr) {
      return (
        `🗳️ *تصويت الشلة: وش خطتنا اليوم في جدة؟*\n\n` +
        `1️⃣ *الخيار 1: الأقرب والأسرع ⚡*\n` +
        `   المسار: ${fastest.stops.map((s) => s.place.nameAr).join(' ➔ ')}\n` +
        `   💰 التكلفة: ~${fastest.financials.totalPerPersonSAR} ر.س | 🚗 وقت المشوار: ${fastest.totalTransitMinutes} دقيقة\n\n` +
        `2️⃣ *الخيار 2: الخطة الموزونة ⚖️ (المقترحة)*\n` +
        `   المسار: ${balanced.stops.map((s) => s.place.nameAr).join(' ➔ ')}\n` +
        `   💰 التكلفة: ~${balanced.financials.totalPerPersonSAR} ر.س | 🚗 وقت المشوار: ${balanced.totalTransitMinutes} دقيقة\n\n` +
        `3️⃣ *الخيار 3: ${isThirdFree ? 'خطة الوضع طفرة كعابي (المشي) (0 ر.س) 🚶‍♂️' : 'التجربة الفخمة 💎'}*\n` +
        `   المسار: ${thirdVariant.stops.map((s) => s.place.nameAr).join(' ➔ ')}\n` +
        `   💰 التكلفة: ${isThirdFree ? '0 ر.س' : `~${thirdVariant.financials.totalPerPersonSAR} ر.س`} | ${isThirdFree ? '🚶‍♂️ كعابي (المشي)' : '🚗 وقت المشوار'}: ${thirdVariant.totalTransitMinutes} دقيقة\n\n` +
        `رد برقم الخيار اللي يناسبك! 👇\n` +
        `🌐 التفاصيل كاملة عبر جداول: ${shareUrl}`
      );
    }
    return (
      `🗳️ *Group Vote: Which Jeddah Outing Plan?*\n\n` +
      `1️⃣ Option 1: Fastest & Closest ⚡ (~${fastest.financials.totalPerPersonSAR} SAR)\n` +
      `2️⃣ Option 2: The Balanced Plan ⚖️ (~${balanced.financials.totalPerPersonSAR} SAR)\n` +
      `3️⃣ Option 3: ${isThirdFree ? '100% Free Plan 🆓 (0 SAR)' : 'Luxury VIP 💎 (~' + thirdVariant.financials.totalPerPersonSAR + ' SAR)'}\n\n` +
      `Reply with your favorite option number! 👇\n` +
      `🌐 Detailed plan: ${shareUrl}`
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
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <Modal
      isOpen={isVotingModalOpen}
      onClose={() => setIsVotingModalOpen(false)}
      title={
        <div className="flex items-center gap-2">
          <Vote className="w-5 h-5 text-gold-400" />
          <span className="text-base sm:text-lg font-black text-pearl">
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
          <div className="p-3.5 rounded-2xl bg-abyss-950 border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-teal-300 flex items-center justify-center font-bold text-xs border border-teal-500/30">
                1️⃣
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-pearl">
                  {language === 'ar' ? fastest.titleAr : fastest.titleEn}
                </h4>
                <span className="text-[11px] text-pearl-muted">
                  ~{fastest.financials.totalPerPersonSAR} ر.س • {fastest.totalTransitMinutes} دقيقة مشاوير
                </span>
              </div>
            </div>
            <Zap className="w-4 h-4 text-teal-400 shrink-0" />
          </div>

          {/* Choice 2 */}
          <div className="p-3.5 rounded-2xl bg-abyss-950 border border-gold-500/30 flex items-center justify-between gap-3 shadow-glow-gold">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold text-xs border border-gold-500/40">
                2️⃣
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-pearl">
                    {language === 'ar' ? balanced.titleAr : balanced.titleEn}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-extrabold border border-gold-500/30">
                    {language === 'ar' ? 'المقترحة ⭐' : 'Recommended'}
                  </span>
                </div>
                <span className="text-[11px] text-pearl-muted">
                  ~{balanced.financials.totalPerPersonSAR} ر.س • {balanced.totalTransitMinutes} دقيقة مشاوير
                </span>
              </div>
            </div>
            <Scale className="w-4 h-4 text-gold-400 shrink-0" />
          </div>

          {/* Choice 3 (Free or Luxury) */}
          <div className="p-3.5 rounded-2xl bg-abyss-950 border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-coral-500/15 text-coral-400 flex items-center justify-center font-bold text-xs border border-coral-500/30">
                3️⃣
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-pearl">
                  {language === 'ar' ? thirdVariant.titleAr : thirdVariant.titleEn}
                </h4>
                <span className="text-[11px] text-pearl-muted">
                  ~{thirdVariant.financials.totalPerPersonSAR} ر.س • {thirdVariant.totalTransitMinutes} دقيقة مشاوير
                </span>
              </div>
            </div>
            {isThirdFree ? (
              <Footprints className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Crown className="w-4 h-4 text-coral-400 shrink-0" />
            )}
          </div>
        </div>

        {/* WhatsApp Poll Preview Box */}
        <div className="p-4 rounded-2xl bg-[#090B0E] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-pearl-muted font-bold">
            <span>{language === 'ar' ? 'معاينة نص الاستطلاع للواتساب:' : 'WhatsApp Poll Preview:'}</span>
            <span className="text-[11px] text-gold-400 font-normal">جاهز للإرسال 💬</span>
          </div>
          <pre className="text-xs font-mono text-pearl/90 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto p-2 bg-abyss-950/60 rounded-xl border border-white/5 scrollbar-none">
            {buildPollText()}
          </pre>
        </div>

        {/* Actions Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>{language === 'ar' ? 'إرسال الاستطلاع لقروب الواتساب' : 'Share Poll to WhatsApp'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyPoll}
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-abyss-800 hover:bg-abyss-700 border border-white/10 text-pearl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">{language === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gold-400" />
                <span>{language === 'ar' ? 'نسخ النص' : 'Copy Text'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default GroupVotingModal;
