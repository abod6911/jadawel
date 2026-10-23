'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Star, Sparkles, Coins, Crown, Compass, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useItineraryStore } from '@/store/useItineraryStore';
import { JEDDAH_PLACES } from '@/data/jeddah-places';
import { PlaceTierFilter, Place } from '@/types';
import { PlaceCard } from '@/components/explore/PlaceCard';
import { PlaceDetailModal } from '@/components/explore/PlaceDetailModal';
import { BorderBeam } from '@/components/fancy/BorderBeam';
import { soundEngine } from '@/utils/audioEngine';

export const TrendingPlacesShowcase: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const setActiveNavTab = useItineraryStore((state) => state.setActiveNavTab);
  const [selectedTab, setSelectedTab] = useState<PlaceTierFilter>('trending');

  const tabs = [
    {
      id: 'trending' as const,
      labelAr: '🔥 ترند جدة الآن',
      labelEn: '🔥 Trending Now',
      subAr: 'الخال الدمشقي، بارت، كورو، ميت مووت، والمطاعم الأكثر تداولاً',
      subEn: 'Al-Khal, BART, Kuuru, Meat Moot & viral sensations',
    },
    {
      id: 'famous' as const,
      labelAr: '⭐ الأشهر والأيقونية',
      labelEn: '⭐ Most Famous',
      subAr: 'البيك، خيال، السدة، وبرو 92 بعشرات آلاف التقييمات',
      subEn: 'ALBAIK, Khayal, Al Saddah & Brew92 with 10k+ reviews',
    },
    {
      id: 'budget' as const,
      labelAr: '💰 الأوفر والأرخص (≤ 35 ر.س)',
      labelEn: '💰 Budget Gems (≤ 35 SAR)',
      subAr: 'شاورما شاكر، أبو زيد، باعشن التاريخي، وكشري أبو طارق',
      subEn: 'Shakir Shawarma, Abu Zaid, Baeshen Seafood & top value',
    },
    {
      id: 'luxury' as const,
      labelAr: '👑 الأفخم والأعلى تقييماً VIP',
      labelEn: '👑 Ultra-Luxury VIP',
      subAr: 'ميازو، نيالي شانغريلا، روكا، وبافارات التراثية الفاخرة',
      subEn: 'MYAZU, Niyyali, ROKA & Bafarat Heritage Luxury',
    },
  ];

  const filteredPlaces = useMemo(() => {
    if (selectedTab === 'trending') {
      return JEDDAH_PLACES.filter((p) => p.tags?.includes('trending')).slice(0, 6);
    }
    if (selectedTab === 'famous') {
      return JEDDAH_PLACES.filter(
        (p) =>
          p.tags?.includes('famous') ||
          p.tags?.includes('popular') ||
          (p.reviewsCount && p.reviewsCount >= 10000)
      ).slice(0, 6);
    }
    if (selectedTab === 'budget') {
      return JEDDAH_PLACES.filter(
        (p) =>
          p.tags?.includes('budget_gem') ||
          p.priceTier === '$' ||
          (p.averageCostSAR > 0 && p.averageCostSAR <= 35)
      ).slice(0, 6);
    }
    if (selectedTab === 'luxury') {
      return JEDDAH_PLACES.filter(
        (p) =>
          p.tags?.includes('luxury_vip') ||
          p.tags?.includes('michelin_guide') ||
          p.priceTier === '$$$$' ||
          p.averageCostSAR >= 250
      ).slice(0, 6);
    }
    return JEDDAH_PLACES.slice(0, 6);
  }, [selectedTab]);

  return (
    <section className="space-y-6 sm:space-y-8 text-start relative">
      {/* Header Container with Smoky Obsidian Glass & Border Glow */}
      <div className="relative rounded-3xl bg-[#0B111E]/80 backdrop-blur-2xl border border-[#D4AF37]/30 p-6 sm:p-8 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        <BorderBeam size={340} duration={14} borderWidth={1.5} colorFrom="#F5D07A" colorTo="#D4AF37" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-black">
              <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>
                {language === 'ar' ? 'هبّات وترندات جدة 2025 / 2026' : 'Jeddah Viral & Trending Hotspots'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              {language === 'ar'
                ? 'أحدث المطاعم والوجهات الأكثر طلباً وترند في جدة'
                : 'Hottest Trending Restaurants & Viral Spots in Jeddah'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
              {language === 'ar'
                ? 'من شاورما الخال الدمشقي وبودينغ بارت كافيه إلى أفخم مطابخ ميشلان والمطاعم الشعبية ذات أعلى تقييمات Google Maps.'
                : 'From Al-Khal Al-Dimashqi and BART Cafe to Michelin-selected fine dining and top-rated local street staples.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setActiveNavTab('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="self-start md:self-auto shrink-0 px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-[#F5E2B3] border border-[#D4AF37]/40 text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer group shadow-sm"
          >
            <Compass className="w-4 h-4 text-gold-400 group-hover:rotate-45 transition-transform" />
            <span>{language === 'ar' ? 'عرض كافة الوجهات الـ 50+' : 'View All 50+ Spots'}</span>
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Filter Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-6 mt-6 border-t border-white/10">
          {tabs.map((tab) => {
            const isSelected = selectedTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedTab(tab.id);
                }}
                className={`p-3 sm:p-3.5 rounded-2xl text-start transition-all cursor-pointer border relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#1A2338] to-[#0E1524] text-white border-[#D4AF37] shadow-[0_10px_30px_rgba(212,175,55,0.22)] ring-1 ring-[#D4AF37]/50'
                    : 'bg-[#06090F]/60 text-slate-400 border-white/[0.08] hover:border-white/20 hover:text-white'
                }`}
              >
                <div className="text-xs sm:text-sm font-black text-white">{language === 'ar' ? tab.labelAr : tab.labelEn}</div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium line-clamp-1 mt-1">
                  {language === 'ar' ? tab.subAr : tab.subEn}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Place Detail Modal */}
      <PlaceDetailModal />
    </section>
  );
};

export default TrendingPlacesShowcase;
