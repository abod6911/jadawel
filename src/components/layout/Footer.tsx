'use client';

import React from 'react';
import { Waves, Heart, MapPin, Compass, Coffee, Navigation } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { JEDDAH_DISTRICTS } from '@/data/districts';
import { soundEngine } from '@/utils/audioEngine';
import { JadawelLogo } from '@/components/ui/JadawelLogo';
import { RawashinPattern } from '@/components/ui/RawashinPattern';

export const Footer: React.FC = () => {
  const { isRTL, language } = useLanguage();
  const setActiveNavTab = useItineraryStore((state) => state.setActiveNavTab);
  const updateWizardPreferences = useItineraryStore((state) => state.updateWizardPreferences);
  const setWizardStep = useItineraryStore((state) => state.setWizardStep);

  const handleDistrictClick = (districtId: any) => {
    soundEngine.playClick();
    updateWizardPreferences({ startingDistrict: districtId });
    setWizardStep(1);
    setActiveNavTab('quick-plan');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative border-t border-white/10 border-t-white/20 bg-[#070A0F] pt-14 pb-28 md:pb-14 text-slate-300 transition-colors overflow-hidden">
      {/* Subtle Authentic Hijazi Pattern in Footer Background */}
      <RawashinPattern className="opacity-10 pointer-events-none" />

      {/* Ambient Radial Accent */}
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-[#E5C378]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand info */}
          <div className="md:col-span-1 space-y-4 text-start">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 flex items-center justify-center shrink-0">
                <JadawelLogo className="w-11 h-11" />
              </div>
              <div>
                <span className="text-xl font-black text-white block tracking-tight">
                  {language === 'ar' ? 'جداول' : 'Jadawel'}
                </span>
                <span className="text-xs text-[#E5C378] font-bold">
                  {language === 'ar' ? 'مخطط رحلات وطلعات جدة' : 'Jeddah Outings Planner'}
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-300 font-normal">
              {language === 'ar'
                ? 'المنصة الذكية الأولى المتخصصة في التخطيط الفوري والدقيق للطلعات والفعاليات في عروس البحر الأحمر.'
                : 'The premier smart platform for crafting instant, realistic day itineraries in Jeddah.'}
            </p>
            <div className="flex flex-col gap-1 text-[11px] font-semibold text-[#E5C378]">
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-[#E5C378]" />
                <span>{isRTL ? 'عروس البحر الأحمر • 2026' : 'Bride of the Red Sea • 2026'}</span>
              </div>
              <span className="text-slate-400 font-mono text-[10px]">
                21.5433° N, 39.1728° E • جدة، المملكة العربية السعودية
              </span>
            </div>
          </div>

          {/* Col 2: Quick navigation */}
          <div className="text-start">
            <h4 className="text-sm font-bold text-white mb-3">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setWizardStep(1);
                    setActiveNavTab('quick-plan');
                    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-300 hover:text-[#E5C378] transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#E5C378]" />
                  <span>{language === 'ar' ? 'صانع الجداول الذكي' : 'Smart Wizard'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveNavTab('curated');
                    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-300 hover:text-[#E5C378] transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <Compass className="w-3.5 h-3.5 text-teal-400" />
                  <span>{language === 'ar' ? 'جداول جاهزة ومقترحة' : 'Curated Ready Plans'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveNavTab('explore');
                    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-300 hover:text-[#E5C378] transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#E5C378]" />
                  <span>{language === 'ar' ? 'دليل استكشف معالم جدة' : 'Explore Directory'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Districts */}
          <div className="md:col-span-2 text-start">
            <h4 className="text-sm font-bold text-white mb-3">
              {language === 'ar' ? 'أحياء ومناطق جدة' : 'Jeddah Districts'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {JEDDAH_DISTRICTS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleDistrictClick(d.id)}
                  className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-[#E5C378]/40 hover:bg-white/[0.06] text-start text-xs transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <span className="font-bold text-white block truncate">
                    {language === 'ar' ? d.nameAr : d.nameEn}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate block">
                    {language === 'ar' ? d.vibeAr : d.vibeEn}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Real-world Disclaimer & Authenticity Bar */}
        <div className="mt-10 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-start">
          <div className="flex items-start sm:items-center gap-2.5 text-xs text-slate-400">
            <span className="px-2 py-0.5 rounded-lg bg-[#E5C378]/10 text-[#E5C378] font-bold text-[11px] shrink-0 mt-0.5 sm:mt-0 border border-[#E5C378]/20">
              {language === 'ar' ? 'تنويه' : 'Notice'}
            </span>
            <p className="leading-relaxed">
              {language === 'ar'
                ? 'الأسعار ومواعيد العمل وأوقات القيادة هي تقديرات ذكية قابلة للتغير بناءً على سياسات المنشآت وحركة السير في جدة.'
                : 'Prices, opening hours, and transit times are smart estimates subject to venue policies and real-time Jeddah traffic.'}
            </p>
          </div>
          <span className="shrink-0 text-[11px] font-bold text-teal-300 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 shadow-sm">
            {language === 'ar' ? 'صُنع بشغف لأجل جدة ومجتمعها 🌊' : 'Curated with passion for Jeddah 🌊'}
          </span>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>© 2026 جداول (Jadawel). جميع الحقوق محفوظة لعروس البحر الأحمر.</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span>صُنع بشغف لجدة وأهلها وزوارها</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
