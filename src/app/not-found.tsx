'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ArrowRight, Home, Sparkles, MapPin } from 'lucide-react';
import { getAssetUrl } from '@/utils/paths';

export default function NotFound() {
  const homeUrl = getAssetUrl('/');

  return (
    <div className="min-h-screen bg-[#090B0E] text-[#FBFBFA] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Ambient Radial Glowing Halos */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/15 via-gold-500/10 to-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Floating Animated Golden Embers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-[20%] w-2 h-2 rounded-full bg-gold-400 blur-[1px] animate-pulse opacity-40" />
        <div className="absolute bottom-32 right-[25%] w-2.5 h-2.5 rounded-full bg-amber-400 blur-[1px] animate-ping opacity-30" />
        <div className="absolute top-1/2 right-[15%] w-1.5 h-1.5 rounded-full bg-teal-400 blur-[1px] animate-pulse opacity-50" />
      </div>

      <div className="w-full max-w-lg mx-auto text-center space-y-6 relative z-10 px-4">
        {/* Compass Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-bold shadow-[0_0_25px_rgba(229,169,98,0.2)]">
          <Compass className="w-4 h-4 animate-spin [animation-duration:15s]" />
          <span>عروس البحر الأحمر • 404 خطأ في المسار</span>
        </div>

        {/* 404 Monumental Shimmer Number */}
        <div className="relative">
          <h1 className="text-8xl sm:text-9xl font-black tracking-tighter bg-gradient-to-b from-white via-gold-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_15px_35px_rgba(229,169,98,0.3)]">
            404
          </h1>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] tracking-widest font-black uppercase text-gold-400/60 bg-[#090B0E] px-3 border border-gold-500/20 rounded-full">
            PAGE NOT FOUND
          </span>
        </div>

        {/* Descriptive Headings */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            يبدو أنك ضعت في أزقة جدة الجميلة..
          </h2>
          <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto leading-relaxed">
            الصفحة التي تحاول الوصول إليها غير موجودة أو تم نقل مسارها، لكن لا تشيل هم أبداً — جداول يدلك دائماً على الوجهة الصح!
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={homeUrl}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 text-stone-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(229,169,98,0.4)] hover:shadow-[0_0_45px_rgba(229,169,98,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>العودة للرئيسية ومتابعة الخطة</span>
          </a>
        </div>

        {/* Footer Hint */}
        <div className="pt-6 border-t border-white/[0.08] flex items-center justify-center gap-2 text-[11px] text-white/40">
          <MapPin className="w-3.5 h-3.5 text-gold-400" />
          <span>من شواطئ أبحر إلى البلد التاريخية • جداول رفيقك في جدة</span>
        </div>
      </div>
    </div>
  );
}
