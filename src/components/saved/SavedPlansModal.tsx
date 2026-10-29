'use client';

import React, { useState } from 'react';
import {
  Bookmark,
  Calendar,
  Clock,
  Trash2,
  Copy,
  Edit2,
  Check,
  X,
  ExternalLink,
  Navigation,
  FolderHeart,
  Share2,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { Modal } from '@/components/ui/Modal';
import { soundEngine } from '@/utils/audioEngine';
import { buildPlanShareUrl, sharePlanViaWebShareOrCopy } from '@/services/shareService';

export const SavedPlansModal: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const isOpen = useItineraryStore((state) => state.isSavedPlansModalOpen);
  const setIsOpen = useItineraryStore((state) => state.setIsSavedPlansModalOpen);
  const savedPlans = useItineraryStore((state) => state.savedPlans);
  const loadSavedPlan = useItineraryStore((state) => state.loadSavedPlan);
  const renameSavedPlan = useItineraryStore((state) => state.renameSavedPlan);
  const deleteSavedPlan = useItineraryStore((state) => state.deleteSavedPlan);
  const duplicateSavedPlan = useItineraryStore((state) => state.duplicateSavedPlan);
  const setActiveNavTab = useItineraryStore((state) => state.setActiveNavTab);

  if (!isOpen) return null;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const handleStartRename = (id: string, currentTitle: string) => {
    soundEngine.playClick();
    setEditingId(id);
    setEditingTitle(currentTitle);
  };

  const handleSaveRename = (id: string) => {
    if (editingTitle.trim()) {
      soundEngine.playSuccess();
      renameSavedPlan(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleOpenPlan = (id: string) => {
    soundEngine.playSuccess();
    loadSavedPlan(id);
  };

  const handleSharePlan = async (plan: typeof savedPlans[0]) => {
    soundEngine.playClick();
    const url = buildPlanShareUrl(plan.itinerary, plan.preferences);
    const result = await sharePlanViaWebShareOrCopy({
      title: plan.title,
      text: language === 'ar' ? `تفقد خطتي لطلعة جدة: ${plan.title}` : `Check out my Jeddah outing: ${plan.title}`,
      url,
    });

    if (result !== 'failed') {
      soundEngine.playSuccess();
      setShareFeedback(plan.id);
      setTimeout(() => setShareFeedback(null), 2500);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title={
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-[#E5C378]" />
          <span className="text-base sm:text-lg font-black text-white">
            {language === 'ar' ? 'خططي المحفوظة' : 'My Saved Outing Plans'}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#E5C378]/20 border border-[#E5C378]/40 text-[#F5E2B3] font-bold">
            {savedPlans.length}
          </span>
        </div>
      }
      subtitle={
        language === 'ar'
          ? 'استعرض خططك المحفوظة على هذا الجهاز، افتحها أو عدلها أو شاركها'
          : 'Access your saved itineraries, load, rename, or share anytime'
      }
      maxWidth="xl"
    >
      <div className="space-y-4 pt-2 text-start">
        {savedPlans.length === 0 ? (
          <div className="py-12 px-4 rounded-3xl bg-[#0E121B] border border-white/10 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#E5C378]/10 text-[#E5C378] border border-[#E5C378]/30 flex items-center justify-center mx-auto">
              <FolderHeart className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">
                {language === 'ar' ? 'لا توجد خطط محفوظة حتى الآن' : 'No saved plans yet'}
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {language === 'ar'
                  ? 'عند توليد أو تخصيص أي جدول، اضغط على زر "احفظ خطتي 💾" للرجوع إليها في أي وقت دون اتصال بالإنترنت.'
                  : 'When exploring or customizing an itinerary, click "Save Plan 💾" to keep it stored here locally.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setIsOpen(false);
                setActiveNavTab('quick-plan');
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#DF9F3D] to-[#E5C378] text-[#090C12] font-black text-xs hover:brightness-110 transition-all cursor-pointer shadow-md"
            >
              {language === 'ar' ? 'اصنع خطتك الأولى الآن 🚀' : 'Craft Your First Plan 🚀'}
            </button>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 scrollbar-none">
            {savedPlans.map((plan) => {
              const isEditing = editingId === plan.id;
              const isShared = shareFeedback === plan.id;
              const stopsCount = plan.itinerary.stops.length;
              const dateStr = new Date(plan.createdAt).toLocaleDateString(
                language === 'ar' ? 'ar-SA' : 'en-US',
                { month: 'short', day: 'numeric' }
              );

              return (
                <div
                  key={plan.id}
                  className="p-4 rounded-2xl bg-[#131722]/90 border border-white/[0.08] hover:border-[#E5C378]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(plan.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#0A0D14] border border-[#E5C378] text-white text-xs font-bold w-full max-w-xs focus:outline-none"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveRename(plan.id)}
                          className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                          title="حفظ"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="p-1.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/20"
                          title="إلغاء"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-black text-white hover:text-[#E5C378] transition-colors truncate">
                          {plan.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => handleStartRename(plan.id, plan.title)}
                          className="text-slate-400 hover:text-white p-1"
                          title="إعادة التسمية"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium flex-wrap">
                      <span className="flex items-center gap-1 text-[#E5C378]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{(plan.itinerary as any).totalDurationFormattedAr || `${stopsCount * 1.5} ساعات`}</span>
                      </span>
                      <span>•</span>
                      <span>{stopsCount} {language === 'ar' ? 'محطات' : 'stops'}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">
                        ~{plan.itinerary.financials?.totalPerPersonSAR ?? (plan.itinerary as any).financialBreakdown?.totalPerPersonSAR ?? 0} ر.س / شخص
                      </span>
                      <span>•</span>
                      <span className="text-slate-400">{dateStr}</span>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    {/* Open Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenPlan(plan.id)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#DF9F3D] to-[#E5C378] text-[#090C12] font-black text-xs hover:brightness-110 transition-all flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'فتح الخطة' : 'Open'}</span>
                    </button>

                    {/* Share Button */}
                    <button
                      type="button"
                      onClick={() => handleSharePlan(plan)}
                      className="p-2 rounded-xl bg-[#1A2030] hover:bg-[#222B40] text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
                      title="مشاركة الرابط"
                    >
                      {isShared ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>

                    {/* Duplicate Button */}
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        duplicateSavedPlan(plan.id);
                      }}
                      className="p-2 rounded-xl bg-[#1A2030] hover:bg-[#222B40] text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
                      title="نسخ"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        deleteSavedPlan(plan.id);
                      }}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};
