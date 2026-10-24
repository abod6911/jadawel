'use client';

import React from 'react';
import { Compass, ArrowLeft, ArrowRight, Clock, Gift, Sparkles } from 'lucide-react';
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
              className="w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none relative rounded-3xl bg-[#0B111E]/80 backdrop-blur-xl border border-white/[0.08] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col justify-between group hover:border-[#D4AF37]/50 hover:shadow-[0_25px_60px_rgba(212,175,55,0.2)] hover:-translate-y-1.5 transition-all duration-300 ease-spring-snappy"
            >
              {idx === 0 && (
                <BorderBeam size={260} duration={12} borderWidth={1.5} colorFrom="#F5D07A" colorTo="#D4AF37" />
              )}
              <div>
                <div className="relative h-44 sm:h-52 overflow-hidden bg-[#06090F]">
                  <img
                    src={getAssetUrl(plan.heroImage)}
                    alt={plan.titleEn}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-[1.07] transition-transform duration-600 ease-spring-smooth"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B111E] via-black/35 to-transparent" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-xl bg-[#06090F]/85 backdrop-blur-md text-[#F5D07A] text-xs font-black border border-[#D4AF37]/40 shadow-sm">
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

                  <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#F5D07A] transition-colors leading-snug">
                    {language === 'ar' ? plan.titleAr : plan.titleEn}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 font-medium">
                    {language === 'ar' ? plan.descriptionAr : plan.descriptionEn}
                  </p>

                  {(() => {
                    const range = getPlanBudgetRange(plan);
                    return (
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 pt-2.5 border-t border-white/[0.08]">
                        <span className="flex items-center gap-1.5 text-[#F5D07A] font-bold">
                          <Clock className="w-3.5 h-3.5 text-[#F5D07A]" />
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
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#F5D07A] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-[#06090F] text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_6px_25px_rgba(212,175,55,0.35)] active:scale-[0.97] ease-spring-snappy duration-200"
                  >
                    <span>{language === 'ar' ? 'تحميل واعتماد هذا الجدول' : 'Load This Plan'}</span>
                    {isRTL ? <ArrowLeft className="w-4 h-4 stroke-[3]" /> : <ArrowRight className="w-4 h-4 stroke-[3]" />}
                  </button>
                </MagneticButton>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exclusive Partner Deals Section - Coming Soon */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0E131F]/90 via-[#0B0F19]/90 to-[#070A12]/90 backdrop-blur-2xl border border-[#D4AF37]/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
        <BorderBeam size={340} duration={14} borderWidth={1.5} colorFrom="#F5D07A" colorTo="#D4AF37" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#F5D07A] text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#F5D07A] animate-pulse" />
              <span>{language === 'ar' ? 'ميزة ستتوفر قريباً' : 'Coming Soon'}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#D4AF37]/15 text-[#F5D07A] border border-[#D4AF37]/35 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.25)]">
                <Gift className="w-5 h-5 text-[#F5D07A]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {language === 'ar' ? 'عروض وخصومات حصرية لطلعتك' : 'Exclusive Partner Deals'}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              {language === 'ar'
                ? 'نعمل حالياً على إبرام شراكات استثنائية مع نخبة من أفضل المطاعم والمقاهي والأنشطة الترفيهية في جدة، لتقديم خصومات وتجارب حصرية لرواد المنصة قريباً جداً.'
                : 'We are curating exclusive partnerships with premier restaurants, cafés, and entertainment destinations in Jeddah to unlock curated discounts and perks soon.'}
            </p>
          </div>

          {/* Feature Highlights Pills */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-slate-200 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#F5D07A] shrink-0" />
              <span>{language === 'ar' ? 'خصومات خاصة بالمطاعم والمقاهي' : 'Special Dining & Café Offers'}</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-slate-200 shadow-sm">
              <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
              <span>{language === 'ar' ? 'تجارب وتذاكر فعاليات مخفضة' : 'Discounted Event Passes'}</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-slate-200 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{language === 'ar' ? 'ضيافات مجانية لرواد جداول' : 'Complimentary VIP Perks'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuratedReadyPlans;
