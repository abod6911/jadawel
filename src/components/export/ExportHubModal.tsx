'use client';

import React, { useState } from 'react';
import {
  Calendar,
  FileText,
  MessageCircle,
  Link2,
  Check,
  Share2,
  Download,
  Printer,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Itinerary } from '@/types';
import { downloadIcsFile } from '@/utils/icsGenerator';
import { buildWhatsAppShareUrl } from '@/utils/whatsappShare';
import { buildPlanShareUrl, sharePlanViaWebShareOrCopy } from '@/services/shareService';
import { Modal } from '@/components/ui/Modal';
import { soundEngine } from '@/utils/audioEngine';

interface ExportHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: Itinerary;
}

export const ExportHubModal: React.FC<ExportHubModalProps> = ({
  isOpen,
  onClose,
  itinerary,
}) => {
  const { language, isRTL } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [downloadedIcs, setDownloadedIcs] = useState(false);
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);
  const [posterDone, setPosterDone] = useState(false);

  const shareUrl = buildPlanShareUrl(itinerary, itinerary.preferences);

  const handleDownloadCalendar = () => {
    soundEngine.playClick();
    downloadIcsFile(itinerary, language);
    setDownloadedIcs(true);
    setTimeout(() => setDownloadedIcs(false), 3000);
  };

  const handlePrintPDF = () => {
    soundEngine.playClick();
    window.print();
  };

  const handleWhatsAppShare = () => {
    soundEngine.playClick();
    const url = buildWhatsAppShareUrl(itinerary, language);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShareOrCopy = async () => {
    soundEngine.playClick();
    const result = await sharePlanViaWebShareOrCopy({
      title: language === 'ar' ? itinerary.titleAr : itinerary.titleEn,
      text: language === 'ar' ? 'تفقد خطة طلعتنا إلى جدة عبر جداول 🌊' : 'Check out our curated Jeddah outing plan on Jadawel 🌊',
      url: shareUrl,
      onSuccess: () => {
        soundEngine.playSuccess();
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      },
    });

    if (result === 'copied') {
      soundEngine.playSuccess();
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownloadPoster = async () => {
    soundEngine.playClick();
    setIsGeneratingPoster(true);
    try {
      const { downloadItineraryPoster } = await import('@/utils/planPosterCanvas');
      await downloadItineraryPoster(itinerary, language);
      soundEngine.playSuccess();
      setPosterDone(true);
      setTimeout(() => setPosterDone(false), 3000);
    } catch (err) {
      console.error('Failed to generate poster:', err);
    } finally {
      setIsGeneratingPoster(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-gold-400" />
          <span className="text-base sm:text-lg font-black text-pearl">
            {language === 'ar' ? 'مركز المشاركة والتصدير' : 'Export & Share Hub'}
          </span>
        </div>
      }
      subtitle={
        language === 'ar'
          ? 'احفظ خطتك في تقويم هاتفك، حمّل بوستر الصورة، أو شاركها مباشرة'
          : 'Export your plan to calendar, download image poster, or share with friends'
      }
      maxWidth="lg"
    >
      <div className="space-y-4 pt-2 text-start">
        {/* Option 1: Native Share / Universal Plan Link */}
        <div className="p-4 rounded-2xl border border-[#E5C378]/30 bg-[#131722]/90 flex items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E5C378]/15 text-[#E5C378] flex items-center justify-center shrink-0 border border-[#E5C378]/30">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {language === 'ar' ? 'مشاركة الرابط الذكي (يعيد بناء الخطة)' : 'Universal Smart Share Link'}
              </h4>
              <p className="text-xs text-slate-300">
                {language === 'ar'
                  ? 'يتضمن محطات الخطة بالكامل، ويعيد توليدها فور فتح الرابط لأي شخص'
                  : 'Encodes stops & budget, reconstitutes the exact itinerary instantly'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNativeShareOrCopy}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#DF9F3D] to-[#E5C378] text-[#0B0D12] font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-md hover:brightness-110 active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-[#0B0D12]" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? (language === 'ar' ? 'تم النسخ!' : 'Copied!') : (language === 'ar' ? 'مشاركة / نسخ' : 'Share / Copy')}</span>
          </button>
        </div>

        {/* Option 2: Download Visual Canvas Poster Image */}
        <div className="p-4 rounded-2xl border border-white/10 bg-[#131722]/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-300 flex items-center justify-center shrink-0 border border-purple-500/20">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {language === 'ar' ? 'تنزيل بوستر الخطة كصورة (PNG)' : 'Download Plan Poster (PNG Image)'}
              </h4>
              <p className="text-xs text-slate-300">
                {language === 'ar'
                  ? 'صورة أنيقة عالية الدقة لجدول المحطات جاهزة للمشاركة في ستوري أو جروب'
                  : 'High-res luxury visual itinerary card ready for social sharing'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadPoster}
            disabled={isGeneratingPoster}
            className="px-4 py-2 rounded-xl bg-[#1A2030] hover:bg-[#222B40] text-purple-200 font-bold text-xs border border-purple-500/30 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm"
          >
            {posterDone ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-purple-300" />}
            <span>
              {isGeneratingPoster
                ? (language === 'ar' ? 'جاري التوليد...' : 'Generating...')
                : posterDone
                ? (language === 'ar' ? 'تم الحفظ!' : 'Saved!')
                : (language === 'ar' ? 'تنزيل الصورة' : 'Download PNG')}
            </span>
          </button>
        </div>

        {/* Option 3: Apple / Google Calendar (.ics) */}
        <div className="p-4 rounded-2xl border border-white/10 bg-[#131722]/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-300 flex items-center justify-center shrink-0 border border-teal-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {language === 'ar' ? 'إضافة للتقويم (Apple / Google)' : 'Add to Calendar (.ics)'}
              </h4>
              <p className="text-xs text-slate-300">
                {language === 'ar'
                  ? 'ملف .ics متوافق مع Apple Calendar و Google Calendar'
                  : 'RFC-5545 .ics file for Apple & Google Calendar'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadCalendar}
            className="px-4 py-2 rounded-xl bg-[#1A2030] hover:bg-[#222B40] text-white font-bold text-xs border border-white/15 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm"
          >
            {downloadedIcs ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-[#E5C378]" />}
            <span>{downloadedIcs ? (language === 'ar' ? 'تم التنزيل' : 'Downloaded') : (language === 'ar' ? 'تنزيل' : 'Download')}</span>
          </button>
        </div>

        {/* Option 4: WhatsApp Share */}
        <div className="p-4 rounded-2xl border border-white/10 bg-[#131722]/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {language === 'ar' ? 'مشاركة المسار عبر الواتساب' : 'Share Plan on WhatsApp'}
              </h4>
              <p className="text-xs text-slate-300">
                {language === 'ar'
                  ? 'رسالة نصية منسقة بأسماء المحطات والمواعيد والرابط المباشر'
                  : 'Structured message with times, places & direct link'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-[#090C12] font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-md hover:scale-[1.02]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{language === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
          </button>
        </div>

        {/* Option 5: Print & PDF */}
        <div className="p-4 rounded-2xl border border-white/10 bg-[#131722]/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E5C378]/15 text-[#E5C378] flex items-center justify-center shrink-0 border border-[#E5C378]/20">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {language === 'ar' ? 'طباعة الخطة أو حفظ كـ PDF' : 'Print Itinerary or Save as PDF'}
              </h4>
              <p className="text-xs text-slate-300">
                {language === 'ar'
                  ? 'طباعة فورية أو حفظ بصيغة PDF أنيقة ومنظمة'
                  : 'Print directly or save as a clean styled PDF'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePrintPDF}
            className="px-4 py-2 rounded-xl bg-[#1A2030] hover:bg-[#222B40] text-white font-bold text-xs border border-[#E5C378]/40 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <Printer className="w-4 h-4 text-[#E5C378]" />
            <span>{language === 'ar' ? 'طباعة / PDF' : 'Print / PDF'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

