'use client';

import React, { useState } from 'react';
import { Compass, ArrowLeft, ArrowRight, Clock, Coins, MapPin, Tag, Gift, Check, Copy } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { CURATED_PLANS } from '@/data/curated-plans';
import { getAssetUrl } from '@/utils/paths';
import { soundEngine } from '@/utils/audioEngine';
import { BorderBeam } from '@/components/fancy/BorderBeam';
import { MagneticButton } from '@/components/fancy/MagneticButton';
import { NumberTicker } from '@/components/fancy/NumberTicker';

export const CuratedReadyPlans: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const loadCuratedPlan = useItineraryStore((state) => state.loadCuratedPlan);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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
      setTimeout(() => setCopiedCode(null), 2500);
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
    <div className="space-y-10 sm:space-y-12 text-start">
      {/* Ready Plans Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gold-400 uppercase flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-coral-400" />
              <span>{language === 'ar' ? 'مسارات جاهزة ومجربة' : 'Curated Ready Tracks'}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-pearl">
              {language === 'ar' ? 'جداول عطلة نهاية الأسبوع الجاهزة' : 'Pre-Crafted Weekend Itineraries'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-pearl-muted font-medium max-w-md">
            {language === 'ar'
              ? 'خطط متكاملة معدة مسبقاً بعناية من خبراء جدة، جاهزة للبدء بنقرة واحدة.'
              : 'Complete expert-crafted itineraries ready to load and start in one click.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CURATED_PLANS.map((plan, idx) => (
            <div
              key={plan.id}
              className="relative rounded-3xl bg-abyss-900/90 backdrop-blur-xl border border-white/10 overflow-hidden shadow-cinematic flex flex-col justify-between group hover:border-gold-500/50 transition-all duration-300"
            >
              {idx === 0 && (
                <BorderBeam size={260} duration={12} borderWidth={1.5} colorFrom="#FF6B4A" colorTo="#E5A962" />
              )}
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-abyss-950">
                  <img
                    src={getAssetUrl(plan.heroImage)}
                    alt={plan.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-abyss-900 via-black/30 to-transparent" />
                  <span className="absolute top-3 start-3 px-3 py-1 rounded-xl bg-abyss-950/85 backdrop-blur-md text-gold-400 text-xs font-black border border-gold-500/30">
                    {language === 'ar' ? plan.badgeAr : plan.badgeEn}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-black text-pearl group-hover:text-gold-400 transition-colors">
                    {language === 'ar' ? plan.titleAr : plan.titleEn}
                  </h3>
                  <p className="text-xs text-pearl-muted leading-relaxed line-clamp-2 font-medium">
                    {language === 'ar' ? plan.descriptionAr : plan.descriptionEn}
                  </p>

                  <div className="flex items-center justify-between text-xs font-bold text-pearl-muted pt-3 border-t border-white/10">
                    <span className="flex items-center gap-1.5 text-teal-300 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? plan.durationHoursTextAr : plan.durationHoursTextEn}</span>
                    </span>
                    <span className="text-gold-400 font-black">
                      <NumberTicker
                        value={plan.estimatedCostSAR}
                        prefix="~"
                        suffix={language === 'ar' ? ' ر.س / شخص' : ' SAR / pers'}
                      />
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <MagneticButton distance={0.2} className="w-full">
                  <button
                    type="button"
                    onClick={() => handleLoadPlan(plan.id)}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-glow-coral active:scale-[0.98]"
                  >
                    <span>{language === 'ar' ? 'تحميل هذا الجدول 🚀' : 'Load This Plan 🚀'}</span>
                    {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </MagneticButton>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exclusive Partner Deals Section */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-abyss-900/90 backdrop-blur-2xl border border-gold-500/30 shadow-cinematic space-y-6 overflow-hidden">
        <BorderBeam size={320} duration={15} borderWidth={1.5} colorFrom="#E5A962" colorTo="#2DD4BF" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold-500/20 text-gold-400 border border-gold-500/30 flex items-center justify-center shadow-glow-gold">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-pearl">
                {language === 'ar' ? 'عروض وخصومات حصرية لطلعتك' : 'Exclusive Partner Deals'}
              </h3>
              <p className="text-xs text-pearl-muted font-medium">
                {language === 'ar'
                  ? 'وفّر على مطاعم وتذاكر فعاليات جدة المميزة مع شركاء جداول'
                  : 'Exclusive vouchers and discounts curated for Jadawel explorers'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {deals.map((deal) => {
            const isCopied = copiedCode === deal.code;
            return (
              <div
                key={deal.id}
                className="p-4 rounded-2xl bg-abyss-950/80 border border-white/10 flex flex-col justify-between space-y-3 shadow-inner hover:border-gold-500/40 transition-colors"
              >
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                    {deal.category}
                  </span>
                  <h4 className="text-sm font-black text-pearl mt-2">
                    {language === 'ar' ? deal.discountAr : deal.discountEn}
                  </h4>
                  <p className="text-[11px] text-pearl-muted mt-1 font-medium leading-relaxed">
                    {language === 'ar' ? deal.descAr : deal.descEn}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyCode(deal.code)}
                  className="p-2.5 rounded-xl bg-abyss-900 border border-dashed border-gold-500/50 hover:border-gold-400 flex items-center justify-between text-xs font-mono font-bold text-gold-400 cursor-pointer transition-all"
                  title="نسخ كود الخصم"
                >
                  <span className="tracking-wider">{deal.code}</span>
                  <span className="text-[10px] text-pearl-muted flex items-center gap-1 font-sans">
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
    </div>
  );
};

export default CuratedReadyPlans;
