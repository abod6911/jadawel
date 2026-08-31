'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  tableContainerVariants, 
  tableRowVariants, 
  MOTION_SPRINGS,
  MOTION_TIMING 
} from '@/lib/motion';
import { Plus, Trash2, Edit3, Check, X, Search, Filter } from 'lucide-react';
import { Button } from './Button';

export interface DataRow {
  id: string;
  code: string;
  name: string;
  category: string;
  status: 'active' | 'pending' | 'archived';
  budget: string;
  recordsCount: number;
  lastUpdated: string;
}

const INITIAL_DATA: DataRow[] = [
  { id: '1', code: 'JDW-101', name: 'جدول فعاليات كورنيش جدة', category: 'سياحة وترفيه', status: 'active', budget: '45,000 ر.س', recordsCount: 124, lastUpdated: 'منذ ساعتين' },
  { id: '2', code: 'JDW-102', name: 'موسم البلد التاريخي 2026', category: 'ثقافة وتراث', status: 'active', budget: '120,000 ر.س', recordsCount: 380, lastUpdated: 'منذ 5 ساعات' },
  { id: '3', code: 'JDW-103', name: 'قائمة المطاعم الفاخرة بالحمراء', category: 'مطاعم وضيافة', status: 'pending', budget: '18,500 ر.س', recordsCount: 64, lastUpdated: 'أمس' },
  { id: '4', code: 'JDW-104', name: 'دليل مسارات الواجهة البحرية', category: 'رياضة وصحة', status: 'active', budget: '32,000 ر.س', recordsCount: 92, lastUpdated: 'منذ 3 أيام' },
  { id: '5', code: 'JDW-105', name: 'أجندة معارض جدة سوبر دوم', category: 'مؤتمرات ومعارض', status: 'archived', budget: '85,000 ر.س', recordsCount: 215, lastUpdated: 'منذ أسبوع' },
];

export const DataTableAnimated: React.FC = () => {
  const [rows, setRows] = useState<DataRow[]>(INITIAL_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof DataRow } | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filtered rows
  const filteredRows = rows.filter(r => 
    r.name.includes(searchQuery) || 
    r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.includes(searchQuery)
  );

  // Handle inline cell edit start
  const handleStartEdit = (row: DataRow, field: keyof DataRow) => {
    setEditingCell({ id: row.id, field });
    setEditValue(String(row[field]));
  };

  // Commit inline edit with zero layout shift
  const handleSaveEdit = () => {
    if (!editingCell) return;
    setRows(prev => prev.map(r => {
      if (r.id === editingCell.id) {
        return { ...r, [editingCell.field]: editValue, lastUpdated: 'الآن' };
      }
      return r;
    }));
    setEditingCell(null);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingCell(null);
  };

  // Add new row with smooth expansion animation
  const handleAddRow = () => {
    const newId = String(Date.now());
    const newRow: DataRow = {
      id: newId,
      code: `JDW-${Math.floor(100 + Math.random() * 900)}`,
      name: 'جدول بيانات جديد مضاف',
      category: 'عام',
      status: 'pending',
      budget: '25,000 ر.س',
      recordsCount: 1,
      lastUpdated: 'الآن',
    };
    setRows([newRow, ...rows]);
  };

  // Delete row with smooth height collapsing and fade
  const handleDeleteRow = (id: string) => {
    setRows(prev => prev.filter(r => r.id !== id));
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredRows.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRows.map(r => r.id)));
    }
  };

  return (
    <div className="w-full bg-abyss-900/90 border border-white/10 rounded-2xl p-6 shadow-cinematic backdrop-blur-xl" dir="rtl">
      {/* Header Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pearl-muted pointer-events-none" />
            <input
              type="text"
              placeholder="بحث في الجداول والسجلات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-abyss-950/80 border border-white/10 rounded-xl pr-10 pl-4 py-2.5 text-sm text-pearl placeholder:text-pearl-muted focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/30 transition-all duration-150"
            />
          </div>
          <button 
            type="button"
            className="p-2.5 rounded-xl border border-white/10 bg-abyss-950/60 text-pearl-muted hover:text-pearl hover:border-gold-500/40 tactile-press"
            aria-label="Filter records"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="coral"
            size="sm"
            onClick={handleAddRow}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-glow-gold hover:shadow-glow-gold/80"
          >
            إضافة سجل جديد
          </Button>
        </div>
      </div>

      {/* Table Surface */}
      <div className="overflow-x-auto rounded-xl border border-white/5 bg-abyss-950/40">
        <table className="w-full text-start border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-white/10 bg-abyss-950/80 text-pearl-muted text-xs font-semibold uppercase tracking-wider">
              <th className="p-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={filteredRows.length > 0 && selectedIds.size === filteredRows.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-white/20 bg-abyss-800 text-gold-500 focus:ring-gold-500/30 cursor-pointer accent-gold-500"
                />
              </th>
              <th className="p-4 text-start font-medium">رمز الجدول</th>
              <th className="p-4 text-start font-medium">اسم الجدول / السجل</th>
              <th className="p-4 text-start font-medium">التصنيف</th>
              <th className="p-4 text-start font-medium">الحالة</th>
              <th className="p-4 text-start font-medium">الميزانية</th>
              <th className="p-4 text-start font-medium">السجلات</th>
              <th className="p-4 text-start font-medium">آخر تحديث</th>
              <th className="p-4 text-center font-medium w-24">إجراءات</th>
            </tr>
          </thead>

          {/* Staggered Animated Body */}
          <motion.tbody
            variants={tableContainerVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-white/5 text-sm"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredRows.map((row, index) => {
                const isSelected = selectedIds.has(row.id);
                const isEditingName = editingCell?.id === row.id && editingCell?.field === 'name';

                return (
                  <motion.tr
                    key={row.id}
                    layout
                    variants={tableRowVariants}
                    custom={index}
                    className={`group transition-colors duration-150 ${
                      isSelected ? 'bg-gold-500/10' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(row.id)}
                        className="w-4 h-4 rounded border-white/20 bg-abyss-800 text-gold-500 focus:ring-gold-500/30 cursor-pointer accent-gold-500"
                      />
                    </td>

                    {/* Code */}
                    <td className="p-4 font-mono text-xs text-gold-400 font-semibold">
                      {row.code}
                    </td>

                    {/* Name with Non-Layout-Shifting Inline Edit */}
                    <td className="p-4 text-pearl font-medium relative">
                      {isEditingName ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editValue}
                            autoFocus
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit();
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                            className="bg-abyss-800 text-pearl text-sm px-3 py-1.5 rounded-lg border border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/40 w-full"
                          />
                          <button
                            type="button"
                            onClick={handleSaveEdit}
                            className="p-1.5 rounded-lg bg-gold-500 text-abyss-950 hover:bg-gold-400 tactile-press"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="p-1.5 rounded-lg bg-white/10 text-pearl-muted hover:text-white tactile-press"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div 
                          onClick={() => handleStartEdit(row, 'name')}
                          className="flex items-center justify-between group/cell cursor-pointer py-1 px-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors"
                          title="انقر للتعديل السريع"
                        >
                          <span>{row.name}</span>
                          <Edit3 className="w-3.5 h-3.5 text-pearl-muted/40 group-hover/cell:text-gold-400 transition-colors opacity-0 group-hover/cell:opacity-100 me-2" />
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="p-4 text-pearl-muted">
                      {row.category}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        row.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : row.status === 'pending'
                          ? 'bg-gold-500/10 text-gold-400 border-gold-500/20'
                          : 'bg-white/5 text-pearl-muted border-white/10'
                      }`}>
                        {row.status === 'active' ? 'نشط' : row.status === 'pending' ? 'قيد المراجعة' : 'مؤرشف'}
                      </span>
                    </td>

                    {/* Budget */}
                    <td className="p-4 text-pearl font-medium">
                      {row.budget}
                    </td>

                    {/* Records Count */}
                    <td className="p-4 text-pearl-muted font-mono">
                      {row.recordsCount}
                    </td>

                    {/* Last Updated */}
                    <td className="p-4 text-xs text-pearl-muted/80">
                      {row.lastUpdated}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(row.id)}
                        className="p-1.5 rounded-lg text-pearl-muted hover:text-red-400 hover:bg-red-500/10 transition-colors tactile-press"
                        aria-label="حذف السجل"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </motion.tbody>
        </table>

        {filteredRows.length === 0 && (
          <div className="text-center py-12 text-pearl-muted text-sm">
            لا توجد سجلات مطابقة لمعايير البحث.
          </div>
        )}
      </div>
    </div>
  );
};
