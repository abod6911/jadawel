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
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Itinerary } from '@/types';
import { downloadIcsFile } from '@/utils/icsGenerator';
import { buildWhatsAppShareUrl } from '@/utils/whatsappShare';
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
  const { language, isRTL, t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [downloadedIcs, setDownloadedIcs] = useState(false);

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

  const handleCopyLink = () => {
    soundEngine.playClick();
    const url = typeof window !== 'undefined' ? window.location.href : 'https://jadawel.app';
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-coral-500" />
          <span className="text-base sm:text-lg font-black text-white">
            {language === 'ar' ? 'مركز المشاركة والتصدير' : 'Export & Share Hub'}
          </span>
        </div>
      }
      subtitle={
        language === 'ar'
          ? 'احفظ خطتك في تقويم هاتفك أو شاركها مع الشلة'
          : 'Export your plan to mobile calendar or share with friends'
      }
      maxWidth="lg"
    >
      <div className="space-y-4 pt-2 text-start">
        {/* Option 1: Apple / Google Calendar (.ics) */}
        <div className="p-4 rounded-2xl border border-white/10 bg-navy-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {language === 'ar' ? 'إضافة للتقويم (Apple / Google)' : 'Add to Calendar (.ics)'}
              </h4>
              <p className="text-xs text-slate-400">
                {language === 'ar'
                  ? 'ملف .ics متوافق مع Apple Calendar و Google Calendar'
                  : 'RFC-5545 .ics file for Apple & Google Calendar'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadCalendar}
            className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-white font-bold text-xs border border-white/15 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm"
          >
            {downloadedIcs ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-gold-400" />}
            <span>{downloadedIcs ? (language === 'ar' ? 'تم التنزيل' : 'Downloaded') : (language === 'ar' ? 'تنزيل' : 'Download')}</span>
          </button>
        </div>

        {/* Option 2: Print & PDF */}
        <div className="p-4 rounded-2xl border border-white/10 bg-navy-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-coral-500/15 text-coral-400 flex items-center justify-center shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {language === 'ar' ? 'طباعة الخطة أو حفظ كـ PDF' : 'Print Itinerary or Save as PDF'}
              </h4>
              <p className="text-xs text-slate-400">
                {language === 'ar'
                  ? 'طباعة فورية أو حفظ بصيغة PDF أنيقة ومنظمة'
                  : 'Print directly or save as a clean styled PDF'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePrintPDF}
            className="px-4 py-2 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs shadow-glow-coral flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'ar' ? 'طباعة / PDF' : 'Print / PDF'}</span>
          </button>
        </div>

        {/* Option 3: WhatsApp Share */}
        <div className="p-4 rounded-2xl border border-white/10 bg-navy-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {language === 'ar' ? 'مشاركة المسار عبر الواتساب' : 'Share Plan on WhatsApp'}
              </h4>
              <p className="text-xs text-slate-400">
                {language === 'ar'
                  ? 'رسالة نصية منسقة بأسماء المحطات والمواعيد'
                  : 'Structured message with times, places & links'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-navy-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{language === 'ar' ? 'مشاركة' : 'Share'}</span>
          </button>
        </div>

        {/* Option 4: Copy Shareable Link */}
        <div className="p-4 rounded-2xl border border-white/10 bg-navy-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/15 text-gold-400 flex items-center justify-center shrink-0">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {language === 'ar' ? 'نسخ الرابط المباشر' : 'Copy Direct Share Link'}
              </h4>
              <p className="text-xs text-slate-400">
                {language === 'ar'
                  ? 'رابط مباشر لعرض ومشاركة الخطة'
                  : 'Direct URL to view and share this itinerary'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-white font-bold text-xs border border-white/15 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Link2 className="w-4 h-4 text-gold-400" />}
            <span>{copied ? (language === 'ar' ? 'تم النسخ!' : 'Copied!') : (language === 'ar' ? 'نسخ' : 'Copy')}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
