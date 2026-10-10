'use client';

import React from 'react';
import { MapPin, Users, Zap, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export const SocialProofBar: React.FC = () => {
  const { language } = useLanguage();

  const proofs = [
    {
      icon: MapPin,
      color: 'text-gold-400',
      bgColor: 'bg-gold-500/15 border-gold-500/30',
      titleAr: '+35 وجهة موثقة ومجربة',
      titleEn: '35+ Verified Spots',
      subAr: 'تحديث مستمر للأسعار وساعات العمل',
      subEn: 'Verified pricing & opening hours',
    },
    {
      icon: Users,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/15 border-teal-400/30',
      titleAr: '+50,000 طلعة تم تخطيطها',
      titleEn: '50,000+ Outings Planned',
      subAr: 'لأهالي جدة وزوار عروس البحر',
      subEn: 'For Jeddah locals & tourists',
    },
    {
      icon: Zap,
      color: 'text-coral-400',
      bgColor: 'bg-coral-500/15 border-coral-500/30',
      titleAr: 'توليد مسارات ذكية بنقرة',
      titleEn: '1-Click Smart Routing',
      subAr: 'حساب المشاوير بدون زحام وتشتيت',
      subEn: 'Optimized transit without congestion',
    },
    {
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/15 border-emerald-500/30',
      titleAr: 'دقة الميزانية بالريال 🇸🇦',
      titleEn: '100% SAR Budget Accuracy',
      subAr: 'حساب التذاكر والأكل وأوبر بدقة',
      subEn: 'Food, tickets & Uber breakdown',
    },
  ];

  return (
    <div className="py-5 px-5 sm:px-8 rounded-3xl bg-abyss-900/90 backdrop-blur-xl border border-white/10 shadow-cinematic">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {proofs.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div key={idx} className="flex items-start gap-3 sm:gap-3.5 text-start">
              <div className={`p-2.5 sm:p-3 rounded-2xl ${p.bgColor} border ${p.color} shrink-0 shadow-sm`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="space-y-0.5 sm:space-y-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-black text-pearl leading-tight truncate">
                  {language === 'ar' ? p.titleAr : p.titleEn}
                </h4>
                <p className="text-[11px] sm:text-xs text-pearl-muted font-medium leading-normal line-clamp-2">
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

export default SocialProofBar;
