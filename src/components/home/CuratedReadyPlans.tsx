'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ArrowLeft, ArrowRight, Clock, Coins, MapPin, Tag, Gift, Check, Copy, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { CURATED_PLANS } from '@/data/curated-plans';
import { JEDDAH_PLACES } from '@/data/jeddah-places';
import { getAssetUrl } from '@/utils/paths';
import { soundEngine } from '@/utils/audioEngine';
import { BorderBeam } from '@/components/fancy/BorderBeam';
import { MagneticButton } from '@/components/fancy/MagneticButton';

export const CuratedReadyPlans: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const loadCuratedPlan = useItineraryStore((state) => state.loadCuratedPlan);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const getPlanBudgetRange = (plan: typeof CURATED_PLANS[0]) => {
    const places = plan.placesIds
      .map((id) => JEDDAH_PLACES.find((p) => p.id === id || p.slug === id))
      .filter(Boolean);

    const totalBase = places.reduce((sum, p) => sum + (p?.averageCostSAR || 0), 0);
    const baseCost = totalBase > 0 ? totalBase : plan.estimatedCostSAR;

    const min = Math.max(0, Math.round((baseCost * 0.85) / 5) * 5);
    const max = Math.max(min + 25, Math.round((baseCost * 1.15) / 5) * 5);

    return { min, max };
  };

  const deals = [
    {
      id: 'deal-1',
      code: 'JADAW20',
      discountAr: 'خصم 20% على تذاكر تيم لاب بلا حدود',
      discountEn: '20% Off teamLab Borderless Tickets',
      descAr: 'استخدم الكود عند الدفع الإلكتروني للتذاكر',
      descEn: 'Apply code at online ticket checkout',
      category: 'فنون وترفيه',
    },
    {
      id: 'deal-2',
      code: 'TWINA15',
      discountAr: 'ضيافة مجانية + 15% بمطعم توينا أبحر',
      discountEn: 'Complimentary Dessert + 15% at Twina Obhur',
      descAr: 'أظهر بطاقة جداول للكابتن عند الطلب',
      descEn: 'Show Jadawel pass to your server',
      category: 'مأكولات بحرية',
    },
    {
      id: 'deal-3',
      code: 'MEDDCOFFEE',
      discountAr: 'ترقية الحجم مجاناً لدى محمصة مد البلد',
      discountEn: 'Free Size Upgrade at Medd Al-Balad',
      descAr: 'على جميع مشروبات الفلتر والاسبريسو الحرفية',
      descEn: 'On all filter and artisanal espresso drinks',
      category: 'قهوة مختصة',
    },
  ];

  const handleCopyCode = (code: string) => {
    soundEngine.playClick();
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setToastMessage(
        language === 'ar'
          ? `✅ تم نسخ كود الخصم (${code}) إلى الحافظة بنجاح!`
          : `✅ Promo code (${code}) copied to clipboard!`
      );
      setTimeout(() => {
        setCopiedCode(null);
        setToastMessage(null);
      }, 3000);
    }
  };

  const handleLoadPlan = (planId: string) => {
    soundEngine.playSuccess();
    loadCuratedPlan(planId);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-10 sm:space-y-12 text-start pb-28 sm:pb-8">
      {/* Ready Plans Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#E5C378] uppercase flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#E5C378]" />
              <span>{language === 'ar' ? 'مسارات جاهزة ومجربة' : 'Curated Ready Tracks'}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              {language === 'ar' ? 'جداول عطلة نهاية الأسبوع الجاهزة' : 'Pre-Crafted Weekend Itineraries'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-md">
            {language === 'ar'
              ? 'خطط متكاملة معدة مسبقاً بعناية من خبراء جدة، جاهزة للبدء بنقرة واحدة.'
              : 'Complete expert-crafted itineraries ready to load and start in one click.'}
          </p>
        </div>

        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 overflow-x-auto md:overflow-visible pb-3 md:pb-0 scrollbar-none snap-x snap-mandatory -mx-1 px-1">
          {CURATED_PLANS.map((plan, idx) => (
            <div
              key={plan.id}
              className="w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none relative rounded-3xl bg-[#0E1118]/90 backdrop-blur-xl border border-white/10 border-t-white/25 overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-[#E5C378]/50 hover:shadow-[0_20px_50px_rgba(229,195,120,0.15)] transition-all duration-300"
            >
              {idx === 0 && (
                <BorderBeam size={260} duration={12} borderWidth={1.5} colorFrom="#E5C378" colorTo="#F5E2B3" />
              )}
              <div>
                <div className="relative h-44 sm:h-52 overflow-hidden bg-[#0B0D12]">
                  <img
                    src={getAssetUrl(plan.heroImage)}
                    alt={plan.titleEn}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E1118] via-black/35 to-transparent" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-xl bg-[#0B0D12]/85 backdrop-blur-md text-[#F5E2B3] text-xs font-black border border-[#E5C378]/40 shadow-sm">
                      {language === 'ar' ? plan.badgeAr : plan.badgeEn}
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-emerald-300 text-[11px] font-black border border-emerald-500/30 shadow-sm flex items-center gap-1">
                      <span>★ 4.9</span>
                      <span className="text-white/40">•</span>
                      <span>{plan.placesIds.length} {language === 'ar' ? 'محطات' : 'stops'}</span>
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>{language === 'ar' ? 'مسار محسوب بالدقيقة • ربط مباشر' : 'Optimized Timing • Multi-stop'}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#F5E2B3] transition-colors leading-snug">
                    {language === 'ar' ? plan.titleAr : plan.titleEn}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 font-medium">
                    {language === 'ar' ? plan.descriptionAr : plan.descriptionEn}
                  </p>

                  {(() => {
                    const range = getPlanBudgetRange(plan);
                    return (
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 pt-2.5 border-t border-white/10">
                        <span className="flex items-center gap-1.5 text-[#E5C378] font-bold">
                          <Clock className="w-3.5 h-3.5 text-[#E5C378]" />
                          <span>{language === 'ar' ? plan.durationHoursTextAr : plan.durationHoursTextEn}</span>
                        </span>
                        <div className="text-end">
                          <span className="text-emerald-400 font-black block text-sm">
                            {range.min}–{range.max} {language === 'ar' ? 'ر.س / شخص' : 'SAR / pers'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {language === 'ar' ? 'الميزانية التقديرية' : 'Estimated budget'}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="p-4 sm:p-5 pt-0">
                <MagneticButton distance={0.2} className="w-full">
                  <button
                    type="button"
                    onClick={() => handleLoadPlan(plan.id)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] hover:opacity-95 text-[#0B0D12] text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_6px_20px_rgba(223,159,61,0.25)] active:scale-[0.98]"
                  >
                    <span>{language === 'ar' ? 'تحميل واعتماد هذا الجدول' : 'Load This Plan'}</span>
                    {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </MagneticButton>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exclusive Partner Deals Section */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-[#0E1118]/85 backdrop-blur-2xl border border-[#E5C378]/30 shadow-2xl space-y-6 overflow-hidden">
        <BorderBeam size={320} duration={15} borderWidth={1.5} colorFrom="#E5C378" colorTo="#F5E2B3" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E5C378]/15 text-[#E5C378] border border-[#E5C378]/30 flex items-center justify-center shadow-[0_0_15px_rgba(229,195,120,0.25)]">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">
                  {language === 'ar' ? 'عروض وخصومات حصرية لطلعتك' : 'Exclusive Partner Deals'}
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 font-bold">
                  {language === 'ar' ? 'عروض تجريبية' : 'Demo Offers'}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {language === 'ar'
                  ? 'عروض وكوبونات استرشادية وتجريبية قيد التنسيق والاعتماد مع الشركاء المحليين'
                  : 'Demonstration partner vouchers and discount perks in validation phase'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex md:grid md:grid-cols-3 gap-3.5 sm:gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none snap-x snap-mandatory -mx-1 px-1">
          {deals.map((deal) => {
            const isCopied = copiedCode === deal.code;
            return (
              <div
                key={deal.id}
                className="w-[82vw] max-w-[320px] shrink-0 snap-center md:w-auto md:max-w-none p-4 rounded-2xl bg-[#131722]/80 border border-white/[0.08] flex flex-col justify-between space-y-3 shadow-inner hover:border-[#E5C378]/40 transition-colors"
              >
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                    {deal.category}
                  </span>
                  <h4 className="text-sm font-black text-white mt-2">
                    {language === 'ar' ? deal.discountAr : deal.discountEn}
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1 font-medium leading-relaxed">
                    {language === 'ar' ? deal.descAr : deal.descEn}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyCode(deal.code)}
                  className="p-2.5 rounded-xl bg-[#0B0D12] border border-dashed border-[#E5C378]/50 hover:border-[#E5C378] flex items-center justify-between text-xs font-mono font-bold text-[#E5C378] cursor-pointer transition-all"
                  title="نسخ كود الخصم"
                >
                  <span className="tracking-wider">{deal.code}</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-sans">
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">{language === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'نسخ الكود' : 'Copy'}</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Toast Notification on Copy */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 start-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-2xl bg-[#0F1420]/95 border border-[#E5C378]/50 text-white font-bold text-xs sm:text-sm shadow-[0_16px_50px_rgba(0,0,0,0.9)] flex items-center gap-2.5 backdrop-blur-xl"
          >
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CuratedReadyPlans;
