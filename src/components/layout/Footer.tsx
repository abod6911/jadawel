'use client';

import React from 'react';
import { Waves, Heart, MapPin, Compass, Coffee, Navigation } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { JEDDAH_DISTRICTS } from '@/data/districts';
import { soundEngine } from '@/utils/audioEngine';
import { getAssetUrl } from '@/utils/paths';
import { JadawelLogo } from '@/components/ui/JadawelLogo';

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-[#E5C378]/25 bg-[#0B0D12] pt-12 pb-24 md:pb-12 text-slate-300 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand info */}
          <div className="md:col-span-1 space-y-4 text-start">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 flex items-center justify-center shrink-0">
                <JadawelLogo className="w-11 h-11" />
              </div>
              <div>
                <span className="text-xl font-black text-white block">
                  {language === 'ar' ? 'جداول' : 'Jadawel'}
                </span>
                <span className="text-xs text-[#E5C378] font-bold">
                  {language === 'ar' ? 'مخطط رحلات جدة الذكي' : 'Jeddah Outings Planner'}
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-300 font-medium">
              {language === 'ar'
                ? 'المنصة الذكية الأولى المتخصصة في التخطيط الفوري والدقيق للطلعات والفعاليات في عروس البحر الأحمر.'
                : 'The premier smart platform for crafting instant, realistic day itineraries in Jeddah.'}
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-[#E5C378]">
              <Compass className="w-4 h-4" />
              <span>{isRTL ? 'عروس البحر الأحمر - 2026' : 'Bride of the Red Sea - 2026'}</span>
            </div>
          </div>

          {/* Col 2: Quick navigation */}
          <div className="text-start">
            <h4 className="text-sm font-black text-white mb-3">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setWizardStep(0);
                    setActiveNavTab('quick-plan');
                  }}
                  className="text-slate-300 hover:text-[#E5C378] transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
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
                  }}
                  className="text-slate-300 hover:text-[#E5C378] transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
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
                  }}
                  className="text-slate-300 hover:text-[#E5C378] transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#E5C378]" />
                  <span>{language === 'ar' ? 'دليل استكشف معالم جدة' : 'Explore Directory'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Districts */}
          <div className="md:col-span-2 text-start">
            <h4 className="text-sm font-black text-white mb-3">
              {language === 'ar' ? 'أحياء جدة الرئيسية' : 'Jeddah Prime Districts'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {JEDDAH_DISTRICTS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleDistrictClick(d.id)}
                  className="p-2.5 rounded-xl bg-[#12151C] hover:bg-[#1A1F2C] border border-white/[0.08] hover:border-[#E5C378]/40 text-start text-xs transition-colors cursor-pointer"
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

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-pearl-muted">
          <div className="flex items-center gap-2">
            <span>© 2026 جداول (Jadawel). جميع الحقوق محفوظة لعروس البحر الأحمر.</span>
          </div>

          <div className="flex items-center gap-1.5 text-pearl-muted">
            <span>صُنع بشغف لجدة وأهلها وزوارها</span>
            <Heart className="w-3.5 h-3.5 text-coral-500 fill-coral-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
