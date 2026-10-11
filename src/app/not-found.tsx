'use client';

import React from 'react';
import { Compass, Home, Sparkles, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import { getAssetUrl } from '@/utils/paths';
import { RawashinPattern } from '@/components/ui/RawashinPattern';

export default function NotFound() {
  const homeUrl = getAssetUrl('/');

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-pearl)] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Authentic Hijazi Rawashin Pattern Background */}
      <RawashinPattern className="opacity-15 pointer-events-none" />

      {/* Ambient Radial Glowing Halos */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] bg-gradient-to-tr from-[var(--accent-gold)]/15 via-[var(--accent-teal)]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--accent-gold)]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-xl mx-auto text-center space-y-6 relative z-10 px-4">
        {/* Compass Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-gold-soft)] border border-[var(--border-gold)] text-[var(--text-gold)] text-xs font-bold shadow-sm">
          <Compass className="w-4 h-4 animate-spin [animation-duration:18s]" />
          <span>عروس البحر الأحمر • 404 خطأ في المسار</span>
        </div>

        {/* 404 Monumental Shimmer Number */}
        <div className="relative py-2">
          <h1 className="text-8xl sm:text-9xl font-black tracking-tighter bg-gradient-to-b from-white via-[var(--accent-gold)] to-[#DF9F3D] bg-clip-text text-transparent drop-shadow-[0_15px_35px_rgba(229,195,120,0.3)]">
            404
          </h1>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] tracking-widest font-black uppercase text-[var(--accent-gold)] bg-[var(--bg-base)] px-3 border border-[var(--border-gold)] rounded-full">
            LOST IN AL-BALAD
          </span>
        </div>

        {/* Descriptive Headings with Jeddawi Warmth */}
        <div className="space-y-3 pt-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            ضيعت الدرب في حواري جدة؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed font-normal">
            بين أزقة البلد العتيقة ورواشينها الخشبية يطيب التيه أحياناً.. لكن لا تشيل هم، جداول يرتب طلعتك ويرجعك لأجمل وجهات عروس البحر الأحمر فوراً.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={homeUrl}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#DF9F3D] via-[#E5C378] to-[#C8A452] text-[#080B11] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(229,195,120,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>العودة للكورنيش والرئيسية</span>
          </a>
        </div>

        {/* Footer Hint */}
        <div className="pt-8 border-t border-[var(--border-subtle)] flex items-center justify-center gap-2 text-xs text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
          <span>من شواطئ أبحر إلى أزقة البلد التاريخية • جداول رفيقك في جدة</span>
        </div>
      </div>
    </div>
  );
}
