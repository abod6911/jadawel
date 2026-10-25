'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Send,
  Building2,
  DollarSign,
  MapPin,
  Clock,
  MessageSquare,
  Check,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { soundEngine } from '@/utils/audioEngine';

const REPORT_REASONS = [
  {
    id: 'closed_permanently',
    labelAr: 'المكان مقفل نهائياً',
    labelEn: 'Permanently Closed',
    descAr: 'لم يعد المكان موجوداً أو أغلق نشاطه',
    descEn: 'Venue is shut down or no longer exists',
    icon: Building2,
  },
  {
    id: 'price_change',
    labelAr: 'تغيّرت الأسعار أو رسوم الدخول',
    labelEn: 'Prices or Admission Changed',
    descAr: 'الأسعار أعلى أو أقل من المذكور في الموقع',
    descEn: 'Current pricing differs from our estimate',
    icon: DollarSign,
  },
  {
    id: 'location_inaccurate',
    labelAr: 'الموقع الجغرافي غير دقيق',
    labelEn: 'Inaccurate Map Location',
    descAr: 'المدخل أو إحداثيات الخريطة تحتاج تعديل',
    descEn: 'Pin or entrance location needs correction',
    icon: MapPin,
  },
  {
    id: 'hours_different',
    labelAr: 'أوقات العمل أو أيام الفتح مختلفة',
    labelEn: 'Different Opening Hours',
    descAr: 'المكان يفتح أو يغلق في ساعات أخرى',
    descEn: 'Opening schedule differs from reality',
    icon: Clock,
  },
  {
    id: 'other',
    labelAr: 'ملاحظة أو معلومة أخرى',
    labelEn: 'Other Feedback',
    descAr: 'اقتراح أو إضافة بخصوص هذا المكان',
    descEn: 'Any general feedback or recommendation',
    icon: MessageSquare,
  },
];

export const ReportPlaceModal: React.FC = () => {
  const { language } = useLanguage();
  const isReportModalOpen = useItineraryStore((state) => state.isReportModalOpen);
  const placeToReport = useItineraryStore((state) => state.placeToReport);
  const closeReportModal = useItineraryStore((state) => state.closeReportModal);
  const showToast = useItineraryStore((state) => state.showToast);

  const [selectedReason, setSelectedReason] = useState<string>('closed_permanently');
  const [userNote, setUserNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isReportModalOpen || !placeToReport) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playSuccess();
    setIsSubmitting(true);

    try {
      const existingReports = JSON.parse(
        localStorage.getItem('jadawel_place_reports') || '[]'
      );
      const newReport = {
        id: `rep-${Date.now()}`,
        placeId: placeToReport.id,
        placeNameAr: placeToReport.nameAr,
        placeNameEn: placeToReport.nameEn,
        reason: selectedReason,
        note: userNote.trim(),
        timestamp: new Date().toISOString(),
      };
      existingReports.push(newReport);
      localStorage.setItem('jadawel_place_reports', JSON.stringify(existingReports));
    } catch {
      // Non-blocking local storage fallback
    }

    setTimeout(() => {
      setIsSubmitting(false);
      closeReportModal();
      setUserNote('');
      showToast(
        language === 'ar'
          ? 'شكراً لاهتمامك! تم استلام ملاحظتك وسندققها قريباً 🌊'
          : 'Thank you! Your feedback has been received and will be verified 🌊',
        'success'
      );
    }, 300);
  };

  return (
    <Modal
      isOpen={isReportModalOpen}
      onClose={closeReportModal}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-start">
            <h3 className="text-base sm:text-lg font-black text-white">
              {language === 'ar' ? 'تحديث أو تصحيح معلومة مكان' : 'Report Venue Information'}
            </h3>
            <span className="text-xs text-[#E5C378] font-bold block">
              {language === 'ar' ? placeToReport.nameAr : placeToReport.nameEn}
            </span>
          </div>
        </div>
      }
      subtitle={
        language === 'ar'
          ? 'مساعدتك تصنع الفارق لكل من يزور جدة.. اختر نوع الملاحظة لنقوم بالتدقيق والتحديث فوراً.'
          : 'Your feedback helps everyone exploring Jeddah. Select what needs updating.'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1 text-start">
        {/* Reasons Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 block">
            {language === 'ar' ? 'ما نوع الملاحظة؟' : 'What is the issue?'}
          </label>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {REPORT_REASONS.map((item) => {
              const isSelected = selectedReason === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedReason(item.id);
                  }}
                  className={`w-full p-3 rounded-2xl border text-start flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/50 text-white ring-1 ring-amber-500/30 shadow-md'
                      : 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isSelected ? 'bg-amber-400 text-[#06090F]' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold block truncate">
                        {language === 'ar' ? item.labelAr : item.labelEn}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {language === 'ar' ? item.descAr : item.descEn}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-amber-400 text-[#06090F] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional User Note */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 block">
            {language === 'ar' ? 'تفاصيل إضافية (اختياري):' : 'Additional Details (Optional):'}
          </label>
          <textarea
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'مثال: الأسعار أصبحت 45 ر.س بدلاً من 30، أو المكان يفتح فقط بعد صلاة العصر...'
                : 'e.g. Current prices are 45 SAR, or venue only opens after 4 PM...'
            }
            rows={3}
            className="w-full p-3 rounded-2xl bg-[#080B11] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/70 focus:ring-1 focus:ring-amber-400/40 transition-all resize-none shadow-inner"
          />
        </div>

        {/* Submit & Cancel Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={closeReportModal}
            className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#06090F] text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'إرسال الملاحظة' : 'Submit Feedback'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReportPlaceModal;
