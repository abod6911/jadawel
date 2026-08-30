'use client';

import React from 'react';
import { MapPin, Navigation, TrendingUp, Users, ShieldCheck, Zap } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export const SocialProofBar: React.FC = () => {
  const { language } = useLanguage();

  const proofs = [
    {
      icon: MapPin,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10 border-amber-400/30',
      titleAr: '+300 وجهة موثقة ومجربة',
      titleEn: '300+ Verified Spots',
      subAr: 'تحديث أسبوعي للأسعار وساعات العمل',
      subEn: 'Weekly updated pricing & hours',
    },
    {
      icon: Users,
      color: 'text-teal-400',
      bgColor: 'bg-teal-400/10 border-teal-400/30',
      titleAr: '+50,000 طلعة تم تخطيطها',
      titleEn: '50,000+ Outings Planned',
      subAr: 'لأهالي جدة وزوار عروس البحر',
      subEn: 'For Jeddah locals and visitors',
    },
    {
      icon: Zap,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10 border-amber-400/30',
      titleAr: 'توليد مسارات ذكية بنقرة',
      titleEn: '1-Click Intelligent Routing',
      subAr: 'حساب المشاوير بدون زحام وتشتيت',
      subEn: 'Optimized transit without traffic',
    },
    {
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10 border-emerald-400/30',
      titleAr: 'دقة الميزانية بالريال',
      titleEn: '100% SAR Budget Accuracy',
      subAr: 'حساب التذاكر والأكل وأوبر بدقة',
      subEn: 'Food, tickets & Uber breakdown',
    },
  ];

  return (
    <div className="py-6 px-6 sm:px-8 rounded-3xl bg-navy-800 border border-gold-500/30 shadow-2xl">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {proofs.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div key={idx} className="flex items-start gap-3.5 text-start">
              <div className={`p-3 rounded-2xl ${p.bgColor} border ${p.color} shrink-0 shadow-sm`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white leading-tight">
                  {language === 'ar' ? p.titleAr : p.titleEn}
                </h4>
                <p className="text-xs text-gray-300 font-medium leading-normal">
                  {language === 'ar' ? p.subAr : p.subEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
