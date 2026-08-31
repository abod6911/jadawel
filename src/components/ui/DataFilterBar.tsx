'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Table as TableIcon, 
  Kanban, 
  ListFilter, 
  X, 
  Plus, 
  ChevronDown, 
  Columns, 
  SlidersHorizontal,
  Sliders
} from 'lucide-react';
import { MOTION_SPRINGS } from '@/lib/motion';

export type ActiveViewMode = 'table' | 'kanban' | 'list';

export interface FilterChip {
  id: string;
  field: string;
  operator: 'is' | 'contains' | 'gt';
  value: string;
}

interface DataFilterBarProps {
  viewMode: ActiveViewMode;
  onViewModeChange: (mode: ActiveViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: FilterChip[];
  onAddFilter: (filter: FilterChip) => void;
  onRemoveFilter: (id: string) => void;
  onClearAllFilters: () => void;
  totalRecordsCount: number;
  filteredRecordsCount: number;
  columns?: { key: string; label: string; visible: boolean }[];
  onToggleColumn?: (key: string) => void;
  density?: 'compact' | 'comfortable';
  onDensityChange?: (density: 'compact' | 'comfortable') => void;
}

export const DataFilterBar: React.FC<DataFilterBarProps> = ({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  filters,
  onAddFilter,
  onRemoveFilter,
  onClearAllFilters,
  totalRecordsCount,
  filteredRecordsCount,
  columns,
  onToggleColumn,
  density,
  onDensityChange,
}) => {
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [isFilterBuilderOpen, setIsFilterBuilderOpen] = useState(false);

  // New filter form state
  const [filterField, setFilterField] = useState('category');
  const [filterOperator, setFilterOperator] = useState<'is' | 'contains' | 'gt'>('contains');
  const [filterValue, setFilterValue] = useState('');

  const handleCreateFilter = () => {
    if (!filterValue.trim()) return;
    onAddFilter({
      id: String(Date.now()),
      field: filterField,
      operator: filterOperator,
      value: filterValue,
    });
    setFilterValue('');
    setIsFilterBuilderOpen(false);
  };

  const getOperatorLabel = (op: 'is' | 'contains' | 'gt') => {
    if (op === 'is') return 'يساوي';
    if (op === 'contains') return 'يحتوي';
    return 'أكبر من';
  };

  const getFieldLabel = (field: string) => {
    if (field === 'category') return 'التصنيف';
    if (field === 'status') return 'الحالة';
    if (field === 'assignee') return 'المسؤول';
    if (field === 'budget') return 'الميزانية';
    return field;
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-zinc-50/80 dark:bg-zinc-950/40 border-b border-zinc-200 dark:border-zinc-800" dir="rtl">
      {/* Top Row: Search + View Switcher + Density + Column Manager */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left (in RTL): Search Bar */}
        <div className="flex items-center gap-2.5 flex-1 min-w-[240px] max-w-lg">
          <div className="relative w-full">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="بحث سريع في جميع الحقول..."
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pr-10 pl-4 py-2 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Add Filter Button */}
          <button
            type="button"
            onClick={() => setIsFilterBuilderOpen(!isFilterBuilderOpen)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-colors select-none tactile-press ${
              isFilterBuilderOpen || filters.length > 0
                ? 'bg-gold-500/10 text-gold-600 dark:text-gold-400 border-gold-500/30'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>تصفية</span>
            {filters.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-gold-500 text-zinc-950 text-[10px] font-bold flex items-center justify-center font-mono">
                {filters.length}
              </span>
            )}
          </button>
        </div>

        {/* Right (in RTL): View Switcher Tabs & Utilities */}
        <div className="flex items-center gap-2">
          {/* Multi-View Mode Switcher (Linear Style) */}
          <div className="flex items-center bg-zinc-200/70 dark:bg-zinc-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
              title="عرض الجدول الشبكي"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">جدول</span>
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
              title="عرض بطاقات كانبان"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">كانبان</span>
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
              title="عرض القائمة المضغوطة"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">قائمة</span>
            </button>
          </div>

          {/* Columns Visibility Dropdown */}
          {columns && onToggleColumn && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
                className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors tactile-press"
                title="تخصيص الأعمدة"
              >
                <Columns className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {isColumnDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                    className="absolute left-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2 shadow-xl z-30 text-xs text-zinc-800 dark:text-zinc-200"
                  >
                    <div className="px-2 py-1 font-semibold text-[11px] text-zinc-400 border-b border-zinc-100 dark:border-zinc-800/80 mb-1">
                      إظهار / إخفاء الأعمدة
                    </div>
                    {columns.map((col) => (
                      <label
                        key={col.key}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={col.visible}
                          onChange={() => onToggleColumn(col.key)}
                          className="w-3.5 h-3.5 rounded border-zinc-300 dark:border-zinc-700 text-gold-500 accent-gold-500"
                        />
                        <span>{col.label}</span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Filter Builder Inline Form */}
      <AnimatePresence>
        {isFilterBuilderOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden"
          >
            <span className="text-xs text-zinc-400">حيث أن:</span>

            {/* Field Select */}
            <select
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-gold-500"
            >
              <option value="category">التصنيف</option>
              <option value="status">الحالة</option>
              <option value="assignee">المسؤول</option>
              <option value="name">اسم السجل</option>
            </select>

            {/* Operator Select */}
            <select
              value={filterOperator}
              onChange={(e) => setFilterOperator(e.target.value as any)}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-gold-500"
            >
              <option value="contains">يحتوي على</option>
              <option value="is">يساوي تماماً</option>
            </select>

            {/* Value Input */}
            <input
              type="text"
              placeholder="القيمة المراد تصفيتها..."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFilter();
              }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-gold-500 min-w-[140px]"
            />

            <button
              type="button"
              onClick={handleCreateFilter}
              className="px-3 py-1 rounded-lg bg-gold-500 text-zinc-950 font-semibold text-xs hover:bg-gold-400 transition-colors tactile-press"
            >
              تطبيق الفلتر
            </button>

            <button
              type="button"
              onClick={() => setIsFilterBuilderOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-xs"
            >
              إلغاء
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filter Chips Pills */}
      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-zinc-400 font-medium">الفلاتر المطبقة:</span>
          {filters.map((f) => (
            <span
              key={f.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-gold-500/10 border border-gold-500/30 text-gold-700 dark:text-gold-300 font-medium"
            >
              <span className="text-zinc-500 dark:text-zinc-400">{getFieldLabel(f.field)}</span>
              <span className="text-[10px] text-gold-500 font-semibold">[{getOperatorLabel(f.operator)}]</span>
              <span>"{f.value}"</span>
              <button
                type="button"
                onClick={() => onRemoveFilter(f.id)}
                className="p-0.5 rounded-full hover:bg-gold-500/20 text-gold-600 dark:text-gold-400"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={onClearAllFilters}
            className="text-[11px] text-zinc-400 hover:text-rose-500 transition-colors ms-1 underline"
          >
            مسح الكل
          </button>
        </div>
      )}
    </div>
  );
};
