'use client';

import React from 'react';
import { Sparkles, ArrowLeft, ArrowRight, Clock, Coins, MapPin, Tag, Gift } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { CURATED_PLANS } from '@/data/curated-plans';
import { getAssetUrl } from '@/utils/paths';

export const CuratedReadyPlans: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const loadCuratedPlan = useItineraryStore((state) => state.loadCuratedPlan);

  const deals = [
    {
      id: 'deal-1',
      code: 'JADDAW20',
      discountAr: 'خصم 20% على تذاكر تيم لاب بلا حدود',
      discountEn: '20% Off teamLab Borderless Tickets',
      descAr: 'استخدم الكود عند الدفع الإلكتروني',
      descEn: 'Apply code at online checkout',
      category: 'فنون وترفيه',
    },
    {
      id: 'deal-2',
      code: 'TWINA15',
      discountAr: 'ضيافة مجانية + 15% بمطعم توينا أبحر',
      discountEn: 'Complimentary Dessert + 15% at Twina Obhur',
      descAr: 'أظهر بطاقة جداو للكابتن',
      descEn: 'Show Jaddaw pass to server',
      category: 'مأكولات بحرية',
    },
    {
      id: 'deal-3',
      code: 'MEDDCOFFEE',
      discountAr: 'ترقية الحجم مجاناً لدى محمصة مد البلد',
      discountEn: 'Free Size Upgrade at Medd Al-Balad',
      descAr: 'على جميع مشروبات الفلتر والاسبريسو',
      descEn: 'On all filter and espresso drinks',
      category: 'قهوة مختصة',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Ready Plans Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5 text-start">
            <span className="text-xs font-black text-gold-400 uppercase tracking-wider block">
              {language === 'ar' ? 'مسارات جاهزة ومجربة' : 'Curated Ready Tracks'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {language === 'ar' ? 'جداول عطلة نهاية الأسبوع الجاهزة' : 'Pre-Crafted Weekend Itineraries'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CURATED_PLANS.map((plan) => (
            <div
              key={plan.id}
              className="rounded-3xl bg-navy-800 border border-navy-700 overflow-hidden shadow-card-dark flex flex-col justify-between group hover:border-gold-400/60 transition-all"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-navy-950">
                  <img
                    src={getAssetUrl(plan.heroImage)}
                    alt={plan.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-800 via-black/30 to-transparent" />
                  <span className="absolute top-3 start-3 px-3 py-1 rounded-xl bg-navy-950/80 backdrop-blur-md text-gold-400 text-xs font-black border border-gold-500/30">
                    {language === 'ar' ? plan.badgeAr : plan.badgeEn}
                  </span>
                </div>

                <div className="p-5 space-y-3 text-start">
                  <h3 className="text-lg font-black text-white group-hover:text-gold-400 transition-colors">
                    {language === 'ar' ? plan.titleAr : plan.titleEn}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 font-medium">
                    {language === 'ar' ? plan.descriptionAr : plan.descriptionEn}
                  </p>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-300 pt-3 border-t border-navy-700">
                    <span className="flex items-center gap-1.5 text-teal-400 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? plan.durationHoursTextAr : plan.durationHoursTextEn}</span>
                    </span>
                    <span className="text-gold-400 font-black">
                      ~{plan.estimatedCostSAR} {language === 'ar' ? 'ر.س' : 'SAR'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => loadCuratedPlan(plan.id)}
                  className="w-full py-3 px-4 rounded-2xl bg-coral-500 hover:bg-coral-600 active:bg-coral-700 text-white text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-glow-coral hover:scale-[1.02]"
                >
                  <span>{language === 'ar' ? 'تحميل هذا الجدول 🚀' : 'Load This Plan'}</span>
                  {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exclusive Partner Deals Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-navy-800 border border-gold-500/30 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold-500/20 text-gold-400 flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
            <div className="text-start">
              <h3 className="text-xl font-black text-white">
                {language === 'ar' ? 'عروض وخصومات حصرية لطلعتك' : 'Exclusive Partner Deals'}
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                {language === 'ar'
                  ? 'وفّر على مطاعم وتذاكر فعاليات جدة المميزة مع جداو'
                  : 'Exclusive vouchers and discounts curated for Jaddaw travelers'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="p-4 rounded-2xl bg-navy-900 border border-navy-700 flex flex-col justify-between space-y-3 text-start shadow-inner"
            >
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded-lg bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                  {deal.category}
                </span>
                <h4 className="text-sm font-black text-white mt-2">
                  {language === 'ar' ? deal.discountAr : deal.discountEn}
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 font-medium">
                  {language === 'ar' ? deal.descAr : deal.descEn}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-navy-800 border border-dashed border-gold-500/50 flex items-center justify-between text-xs font-mono font-bold text-gold-400">
                <span>{deal.code}</span>
                <span className="text-[10px] text-slate-400 uppercase font-sans">
                  {language === 'ar' ? 'كود الخصم' : 'Code'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
