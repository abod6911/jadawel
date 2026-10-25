'use client';

import React, { useRef, useState } from 'react';
import { Download, Share2, Clock, Coins, MapPin, Check, Copy, Printer, QrCode, Ticket, Compass } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Itinerary, PlanVariantKey } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { soundEngine } from '@/utils/audioEngine';
import { openWhatsAppShare } from '@/utils/whatsappShare';
import { JadawelLogo } from '@/components/ui/JadawelLogo';
import { exportAndShareStoryPass } from '@/utils/planPosterCanvas';
import { useItineraryStore } from '@/store/useItineraryStore';

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
  const showToast = useItineraryStore((state) => state.showToast);
  const storyCardRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);

  if (!itinerary) return null;

  const currentPlan = itinerary.variants[activeVariant] || itinerary.variants.balanced;

  const handleExportPosterImage = async () => {
    if (!itinerary || isExportingImage) return;
    soundEngine.playClick();
    setIsExportingImage(true);
    showToast(
      language === 'ar' ? 'جاري تجهيز بوستر الستوري 9:16 بدقة فائقة...' : 'Generating 9:16 Story Pass...',
      'info'
    );

    try {
      const result = await exportAndShareStoryPass(itinerary, language);
      if (result.shared) {
        showToast(
          language === 'ar' ? 'تم فتح نافذة المشاركة بنجاح 📸' : 'Opened share sheet successfully!',
          'success'
        );
      } else if (result.downloaded) {
        showToast(
          language === 'ar' ? 'تم تحميل بوستر الستوري (PNG) بنجاح 🎉' : 'Story Pass image downloaded!',
          'success'
        );
      }
    } catch (e) {
      console.error('Failed to export story pass image:', e);
      showToast(
        language === 'ar' ? 'حدث خطأ أثناء تصدير الصورة' : 'Failed to export image',
        'error'
      );
    } finally {
      setIsExportingImage(false);
    }
  };

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

        {/* The 9:16 Vertical Story Pass - Ultra-Luxury VIP First Class Boarding Pass */}
        <div
          ref={storyCardRef}
          className="relative w-full max-w-[360px] sm:max-w-[390px] mx-auto rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-[#0B111E] via-[#0E1524] to-[#06090F] border border-[#D4AF37]/45 p-6 flex flex-col justify-between text-start text-white shadow-[0_30px_90px_rgba(0,0,0,0.85)] transition-all duration-300 relative group"
        >
          {/* Diagonal Glass Specular Shimmer Sweep */}
          <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent pointer-events-none animate-boarding-pass-shimmer z-30" />

          {/* Ambient Lighting Layers */}
          <div className="absolute -top-20 -end-20 w-48 h-48 rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -start-20 w-48 h-48 rounded-full bg-[#0EA5E9]/15 blur-3xl pointer-events-none" />

          {/* 1. Header Section: VIP Airline / Boarding Pass Brand */}
          <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <JadawelLogo className="w-10 h-10" />
              </div>
              <div>
                <span className="text-sm font-black text-white block leading-tight tracking-wide">جداول • JADAWEL</span>
                <span className="text-[10px] text-[#F5D07A] font-bold">درجة أولى VIP • First Class</span>
              </div>
            </div>

            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#F5D07A]/20 to-[#D4AF37]/30 text-[#F5D07A] text-[10px] font-black border border-[#D4AF37]/50 flex items-center gap-1 shadow-sm uppercase tracking-wider">
              <span>{language === 'ar' ? currentPlan.badgeAr : currentPlan.badgeEn}</span>
            </div>
          </div>

          {/* 2. Middle Body: Plan Title, Vibe & Stops Timeline */}
          <div className="relative z-10 py-4 space-y-3.5">
            {/* Title & Tagline */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#F5D07A] uppercase tracking-wider flex items-center gap-1">
                <span>BOARDING PASS • JED-2026</span>
              </span>
              <h4 className="text-lg sm:text-xl font-black text-white leading-snug">
                {language === 'ar' ? currentPlan.titleAr : currentPlan.titleEn}
              </h4>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                {language === 'ar' ? currentPlan.taglineAr : currentPlan.taglineEn}
              </p>
            </div>

            {/* Flight / Outing Metadata Pill Strip */}
            <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center text-[10px]">
              <div>
                <span className="text-slate-400 block font-mono">GATE</span>
                <span className="font-bold text-[#F5D07A]">JEDDAH</span>
              </div>
              <div className="border-x border-white/10">
                <span className="text-slate-400 block font-mono">CLASS</span>
                <span className="font-bold text-white">VIP GOLD</span>
              </div>
              <div>
                <span className="text-slate-400 block font-mono">STOPS</span>
                <span className="font-bold text-[#0EA5E9]">{currentPlan.stops.length} STATIONS</span>
              </div>
            </div>

            {/* Stops list with spacious layout & zero text clipping */}
            <div className="space-y-2">
              {currentPlan.stops.map((stop, idx) => (
                <div
                  key={stop.id}
                  className="p-3 rounded-2xl bg-[#101726]/80 border border-white/[0.08] flex items-center justify-between gap-3 shadow-md hover:border-[#D4AF37]/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#F5D07A] via-[#D4AF37] to-[#AA7C11] text-[#06090F] text-[11px] font-black flex items-center justify-center shrink-0 shadow-sm">
                      {idx + 1}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-[#F5D07A]">
                          {stop.timeSlot}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300 font-medium">
                          {language === 'ar' ? stop.place.districtNameAr : stop.place.districtNameEn}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-white leading-tight truncate">
                        {language === 'ar' ? stop.place.nameAr : stop.place.nameEn}
                      </h5>
                    </div>
                  </div>

                  <div className="text-end shrink-0 ps-1">
                    <span className="text-[11px] font-bold text-[#10B981] block">
                      {stop.place.averageCostSAR > 0 ? `${stop.place.averageCostSAR} ر.س` : (language === 'ar' ? 'مجاني' : 'Free')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Semicircular Ticket Notches & Perforation Cutout Line */}
          <div className="relative my-1 -mx-6 flex items-center justify-between pointer-events-none">
            {/* Left Notch */}
            <div className="w-6 h-6 rounded-full bg-[#06090F] border-r border-[#D4AF37]/45 -translate-x-3" />
            {/* Dashed Perforation Line */}
            <div className="flex-1 border-b-2 border-dashed border-[#D4AF37]/35 mx-1" />
            {/* Right Notch */}
            <div className="w-6 h-6 rounded-full bg-[#06090F] border-l border-[#D4AF37]/45 translate-x-3" />
          </div>

          {/* 3. Bottom Perforated Stub: Barcode & QR Code Section */}
          <div className="relative z-10 pt-3 space-y-3">
            {/* Stats Summary Pills */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <div className="p-2.5 rounded-xl bg-[#06090F]/80 border border-[#D4AF37]/30 flex items-center gap-2 text-[#F5D07A]">
                <Coins className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">~{currentPlan.financials.totalPerPersonSAR} ر.س / شخص</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#06090F]/80 border border-[#0EA5E9]/30 flex items-center gap-2 text-[#0EA5E9]">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">~{currentPlan.totalTransitMinutes} د مشاوير</span>
              </div>
            </div>

            {/* QR Code & Barcode Mockup */}
            <div className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-slate-400 block">ELECTRONIC PASS</span>
                <span className="text-xs font-mono font-bold text-[#F5D07A]">JDW-VIP-9942</span>
                <span className="text-[9px] text-slate-500 block">jadawel.app • عروس البحر</span>
              </div>

              {/* Styled QR Code Box with Golden Corners */}
              <div className="relative p-2 rounded-xl bg-white/5 border border-[#D4AF37]/40 flex items-center justify-center">
                <QrCode className="w-9 h-9 text-[#F5D07A]" />
                <span className="absolute -top-1 -start-1 w-2 h-2 border-t-2 border-s-2 border-[#F5D07A]" />
                <span className="absolute -top-1 -end-1 w-2 h-2 border-t-2 border-e-2 border-[#F5D07A]" />
                <span className="absolute -bottom-1 -start-1 w-2 h-2 border-b-2 border-s-2 border-[#F5D07A]" />
                <span className="absolute -bottom-1 -end-1 w-2 h-2 border-b-2 border-e-2 border-[#F5D07A]" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-3 pt-2 max-w-md mx-auto">
          {/* Primary 1-Click Export Story Pass (9:16 PNG) */}
          <button
            type="button"
            disabled={isExportingImage}
            onClick={handleExportPosterImage}
            className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] text-[#0A0D12] font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(229,195,120,0.35)] hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
          >
            {isExportingImage ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin w-4 h-4 border-2 border-[#0A0D12] border-t-transparent rounded-full" />
                <span>{language === 'ar' ? 'جاري رسم وتصدير البوستر...' : 'Generating 9:16 Poster...'}</span>
              </span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>
                  {language === 'ar'
                    ? 'حفظ ومشاركة بوستر الستوري (PNG 9:16) 📸'
                    : 'Save & Share Story Pass (9:16 PNG) 📸'}
                </span>
              </>
            )}
          </button>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            {/* Primary Share to WhatsApp */}
            <button
              type="button"
              onClick={handleShareStory}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-abyss-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>{language === 'ar' ? 'مشاركة عبر واتساب للشلة' : 'Share via WhatsApp'}</span>
            </button>

            {/* Copy Link Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full sm:w-auto py-3 px-3.5 rounded-xl bg-abyss-800 hover:bg-abyss-700 text-pearl font-bold text-xs border border-white/15 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
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
              className="w-full sm:w-auto py-3 px-3 rounded-xl bg-abyss-800 hover:bg-abyss-700 text-pearl font-bold text-xs border border-white/15 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              title="طباعة / حفظ PDF"
            >
              <Printer className="w-4 h-4 text-pearl-muted" />
              <span>{language === 'ar' ? 'طباعة' : 'Print'}</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
