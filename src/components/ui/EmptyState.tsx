'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SearchX, RotateCcw, Plus } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  searchTerm?: string;
  onResetFilters?: () => void;
  onAddNew?: () => void;
  resetLabel?: string;
  addNewLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'لا توجد سجلات مطابقة',
  description = 'لم نتمكن من العثور على أي نتائج تطابق معايير البحث أو الفلترة الحالية.',
  searchTerm,
  onResetFilters,
  onAddNew,
  resetLabel = 'إعادة ضبط الفلاتر',
  addNewLabel = 'إضافة سجل جديد',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
      dir="rtl"
    >
      {/* Minimal Animated SVG Icon Badge */}
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-center text-zinc-400 dark:text-zinc-500 shadow-sm">
          <SearchX className="w-8 h-8 stroke-[1.5]" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 text-xs font-bold">
          !
        </div>
      </div>

      {/* Typography Hierarchy */}
      <h4 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
        {title}
      </h4>

      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mb-6 leading-relaxed">
        {searchTerm ? (
          <>
            لا توجد بيانات تطابق استعلام البحث: <span className="font-semibold text-gold-500 dark:text-gold-400">"{searchTerm}"</span>. جرب كلمات مفتاحية أخرى أو تحقق من الفلاتر.
          </>
        ) : (
          description
        )}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onResetFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            {resetLabel}
          </Button>
        )}

        {onAddNew && (
          <Button
            variant="primary"
            size="sm"
            onClick={onAddNew}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            {addNewLabel}
          </Button>
        )}
      </div>
    </motion.div>
  );
};
