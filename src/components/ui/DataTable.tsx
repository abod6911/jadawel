'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  tableContainerVariants, 
  tableRowVariants, 
  MOTION_TIMING, 
  MOTION_EASE 
} from '@/lib/motion';
import { 
  Search, 
  Filter, 
  Plus, 
  SlidersHorizontal, 
  Download, 
  Trash2, 
  Copy, 
  Edit3, 
  MoreHorizontal, 
  Check, 
  X, 
  ArrowUpDown, 
  Command as CommandIcon,
  ChevronDown
} from 'lucide-react';
import { StatusBadge, StatusVariant } from './StatusBadge';
import { ProgressBarCell } from './ProgressBarCell';
import { EmptyState } from './EmptyState';
import { FloatingActionBar } from './FloatingActionBar';
import { CommandPalette, CommandAction } from './CommandPalette';
import { SkeletonTable } from './SkeletonTable';
import { Button } from './Button';

export type TableDensity = 'compact' | 'comfortable';

export interface TableRecord {
  id: string;
  code: string;
  name: string;
  assignee: {
    name: string;
    avatarColor: string;
    initials: string;
  };
  category: string;
  status: StatusVariant;
  progress: number;
  budget: number;
  recordsCount: number;
  lastUpdated: string;
}

const INITIAL_RECORDS: TableRecord[] = [
  {
    id: '1',
    code: 'JDW-801',
    name: 'أجندة فعاليات موسم جدة التراثي',
    assignee: { name: 'عبدالله السالم', avatarColor: 'bg-amber-500', initials: 'ع.س' },
    category: 'سياحة وثقافة',
    status: 'active',
    progress: 88,
    budget: 145000,
    recordsCount: 412,
    lastUpdated: 'منذ ساعتين',
  },
  {
    id: '2',
    code: 'JDW-802',
    name: 'دليل مطاعم ومقاهي البلد التاريخية',
    assignee: { name: 'سارة القحطاني', avatarColor: 'bg-emerald-500', initials: 'س.ق' },
    category: 'ضيافة وتذوق',
    status: 'active',
    progress: 95,
    budget: 68500,
    recordsCount: 184,
    lastUpdated: 'منذ 4 ساعات',
  },
  {
    id: '3',
    code: 'JDW-803',
    name: 'حصر مسارات مارينا أبحر واليخوت',
    assignee: { name: 'محمد الزهراني', avatarColor: 'bg-sky-500', initials: 'م.ز' },
    category: 'بحرية ورياضة',
    status: 'pending',
    progress: 45,
    budget: 92000,
    recordsCount: 96,
    lastUpdated: 'أمس',
  },
  {
    id: '4',
    code: 'JDW-804',
    name: 'خطة التحول الرقمي لمعارض القبة',
    assignee: { name: 'نورة الشمري', avatarColor: 'bg-rose-500', initials: 'ن.ش' },
    category: 'تقنية وأعمال',
    status: 'pending',
    progress: 30,
    budget: 210000,
    recordsCount: 340,
    lastUpdated: 'منذ 3 أيام',
  },
  {
    id: '5',
    code: 'JDW-805',
    name: 'تقارير أداء الربع السنوي للواجهة',
    assignee: { name: 'فيصل الغامدي', avatarColor: 'bg-purple-500', initials: 'ف.غ' },
    category: 'تحليلات وإحصاء',
    status: 'neutral',
    progress: 15,
    budget: 35000,
    recordsCount: 52,
    lastUpdated: 'منذ أسبوع',
  },
  {
    id: '6',
    code: 'JDW-806',
    name: 'أرشيف تراخيص الفعاليات المؤقتة',
    assignee: { name: 'ريما الشهري', avatarColor: 'bg-zinc-500', initials: 'ر.ش' },
    category: 'حوكمة وتراخيص',
    status: 'failed',
    progress: 0,
    budget: 12000,
    recordsCount: 28,
    lastUpdated: 'منذ أسبوعين',
  },
];

interface DataTableProps {
  initialData?: TableRecord[];
  isLoading?: boolean;
  onRowClick?: (record: TableRecord) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  initialData = INITIAL_RECORDS,
  isLoading = false,
  onRowClick,
}) => {
  const [data, setData] = useState<TableRecord[]>(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [density, setDensity] = useState<TableDensity>('comfortable');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof TableRecord } | null>(null);
  const [editValue, setEditValue] = useState('');

  // Density styling tokens
  const densityStyles = {
    compact: {
      th: 'py-2 px-3 text-xs',
      td: 'py-2 px-3 text-xs',
    },
    comfortable: {
      th: 'py-3.5 px-4 text-xs',
      td: 'py-3.5 px-4 text-sm',
    },
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    return data.filter((record) => {
      const matchesSearch =
        record.name.includes(searchQuery) ||
        record.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.category.includes(searchQuery) ||
        record.assignee.name.includes(searchQuery);

      const matchesStatus =
        statusFilter === 'all' || record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredData.length && filteredData.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map((r) => r.id)));
    }
  };

  // Add new record
  const handleAddNewRecord = () => {
    const newId = String(Date.now());
    const newRecord: TableRecord = {
      id: newId,
      code: `JDW-${Math.floor(800 + Math.random() * 200)}`,
      name: 'سجل بيانات جديد غير مسمى',
      assignee: { name: 'المستخدم الحالي', avatarColor: 'bg-gold-500', initials: 'م.ح' },
      category: 'عام',
      status: 'pending',
      progress: 10,
      budget: 50000,
      recordsCount: 1,
      lastUpdated: 'الآن',
    };
    setData([newRecord, ...data]);
  };

  // Delete single record
  const handleDeleteRecord = (id: string) => {
    setData((prev) => prev.filter((r) => r.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  // Batch delete
  const handleBatchDelete = () => {
    setData((prev) => prev.filter((r) => !selectedIds.has(r.id)));
    setSelectedIds(new Set());
  };

  // Batch status update
  const handleBatchStatus = (status: StatusVariant) => {
    setData((prev) =>
      prev.map((r) => (selectedIds.has(r.id) ? { ...r, status, lastUpdated: 'الآن' } : r))
    );
    setSelectedIds(new Set());
  };

  // Batch duplicate
  const handleBatchDuplicate = () => {
    const toDuplicate = data.filter((r) => selectedIds.has(r.id));
    const clones: TableRecord[] = toDuplicate.map((r) => ({
      ...r,
      id: String(Date.now() + Math.random()),
      code: `${r.code}-نسخة`,
      name: `${r.name} (نسخة مكررة)`,
      lastUpdated: 'الآن',
    }));
    setData([...clones, ...data]);
  };

  // Inline edit
  const handleStartEdit = (record: TableRecord, field: keyof TableRecord) => {
    setEditingCell({ id: record.id, field });
    setEditValue(String(record[field]));
  };

  const handleSaveEdit = () => {
    if (!editingCell) return;
    setData((prev) =>
      prev.map((r) => {
        if (r.id === editingCell.id) {
          return { ...r, [editingCell.field]: editValue, lastUpdated: 'الآن' };
        }
        return r;
      })
    );
    setEditingCell(null);
  };

  // Command palette actions
  const commandActions: CommandAction[] = [
    {
      id: 'add-record',
      title: 'إضافة سجل جديد إلى الجدول',
      category: 'إجراءات الجداول',
      icon: Plus,
      shortcut: 'N',
      perform: handleAddNewRecord,
    },
    {
      id: 'filter-active',
      title: 'عرض السجلات النشطة فقط',
      category: 'الفلاتر والبحث',
      icon: Filter,
      perform: () => setStatusFilter('active'),
    },
    {
      id: 'filter-all',
      title: 'إعادة ضبط جميع الفلاتر وعرض الكل',
      category: 'الفلاتر والبحث',
      icon: Filter,
      perform: () => {
        setStatusFilter('all');
        setSearchQuery('');
      },
    },
    {
      id: 'toggle-density',
      title: `تبديل نمط الكثافة إلى (${density === 'compact' ? 'مريح' : 'مضغوط'})`,
      category: 'عمليات سريعة',
      icon: SlidersHorizontal,
      perform: () => setDensity(density === 'compact' ? 'comfortable' : 'compact'),
    },
  ];

  // Listen for Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading) {
    return <SkeletonTable rowsCount={6} columnsCount={7} />;
  }

  const isAllSelected = filteredData.length > 0 && selectedIds.size === filteredData.length;
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < filteredData.length;

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl shadow-card-dark overflow-hidden flex flex-col transition-colors duration-200" dir="rtl">
      {/* Top Toolbar */}
      <div className="p-5 border-b border-zinc-200/80 dark:border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-950/40">
        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث في الأسماء، الرموز، أو المسؤولين..."
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700/80 rounded-xl pr-10 pl-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter Pill Select */}
          <div className="flex items-center gap-1 bg-zinc-200/60 dark:bg-zinc-800 p-1 rounded-xl">
            {(['all', 'active', 'pending', 'failed'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all select-none ${
                  statusFilter === status
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {status === 'all'
                  ? 'الكل'
                  : status === 'active'
                  ? 'نشط'
                  : status === 'pending'
                  ? 'قيد التنفيذ'
                  : 'ملغي'}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls & Density Switch */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Density Toggle */}
          <div className="flex items-center bg-zinc-200/60 dark:bg-zinc-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setDensity('comfortable')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                density === 'comfortable'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
              title="عرض مريح"
            >
              مريح
            </button>
            <button
              type="button"
              onClick={() => setDensity('compact')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                density === 'compact'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
              title="عرض مضغوط عالي الكثافة"
            >
              مضغوط
            </button>
          </div>

          {/* Command Palette Trigger Button */}
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-gold-500/50 transition-colors tactile-press"
          >
            <CommandIcon className="w-3.5 h-3.5 text-gold-500" />
            <span className="font-mono text-[10px] text-zinc-400">Ctrl+K</span>
          </button>

          {/* Add Row Button */}
          <Button
            variant="coral"
            size="sm"
            onClick={handleAddNewRecord}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            إضافة سجل
          </Button>
        </div>
      </div>

      {/* Table Scrollable Container */}
      <div className="relative overflow-x-auto max-h-[640px] overflow-y-auto">
        <table className="w-full text-start border-collapse">
          {/* Sticky Glassmorphic Header */}
          <thead className="sticky top-0 z-20 backdrop-blur-md bg-white/90 dark:bg-zinc-900/90 border-b border-zinc-200/80 dark:border-zinc-800 shadow-sm">
            <tr className="text-zinc-500 dark:text-zinc-400 font-medium text-xs">
              {/* Checkbox Header */}
              <th className={`${densityStyles[density].th} w-12 text-center`}>
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gold-500 focus:ring-gold-500/30 cursor-pointer accent-gold-500"
                    aria-label="تحديد جميع السجلات"
                  />
                </div>
              </th>

              {/* Code */}
              <th className={`${densityStyles[density].th} text-right font-medium`}>رمز الجدول</th>

              {/* Name & Assignee */}
              <th className={`${densityStyles[density].th} text-right font-medium`}>اسم السجل / المسؤول</th>

              {/* Category */}
              <th className={`${densityStyles[density].th} text-right font-medium`}>التصنيف</th>

              {/* Status */}
              <th className={`${densityStyles[density].th} text-center font-medium`}>الحالة</th>

              {/* Progress */}
              <th className={`${densityStyles[density].th} text-right font-medium min-w-[140px]`}>الإنجاز</th>

              {/* Budget (Numeric Left Aligned) */}
              <th className={`${densityStyles[density].th} text-left font-medium`}>الميزانية (ر.س)</th>

              {/* Records Metric (Numeric Left Aligned) */}
              <th className={`${densityStyles[density].th} text-left font-medium`}>السجلات</th>

              {/* Actions Header */}
              <th className={`${densityStyles[density].th} text-center font-medium w-24`}>إجراءات</th>
            </tr>
          </thead>

          {/* Animated Table Body */}
          <motion.tbody
            variants={tableContainerVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 bg-transparent text-zinc-800 dark:text-zinc-200"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredData.map((record, index) => {
                const isSelected = selectedIds.has(record.id);
                const isEditingName = editingCell?.id === record.id && editingCell?.field === 'name';

                return (
                  <motion.tr
                    key={record.id}
                    layout
                    variants={tableRowVariants}
                    custom={index}
                    onClick={() => onRowClick && onRowClick(record)}
                    className={`group transition-colors duration-150 ${
                      isSelected
                        ? 'bg-gold-500/10 dark:bg-gold-500/15'
                        : 'hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40'
                    }`}
                  >
                    {/* Checkbox Cell */}
                    <td className={`${densityStyles[density].td} text-center`}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(record.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gold-500 focus:ring-gold-500/30 cursor-pointer accent-gold-500"
                      />
                    </td>

                    {/* Code (Tabular Font) */}
                    <td className={`${densityStyles[density].td} font-mono tabular-nums text-gold-600 dark:text-gold-400 font-semibold text-xs whitespace-nowrap`}>
                      {record.code}
                    </td>

                    {/* Name with Avatar & Inline Edit */}
                    <td className={`${densityStyles[density].td}`}>
                      <div className="flex items-center gap-3">
                        {/* Assignee Avatar */}
                        <div
                          className={`w-7 h-7 rounded-full ${record.assignee.avatarColor} text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm`}
                          title={record.assignee.name}
                        >
                          {record.assignee.initials}
                        </div>

                        {/* Record Title */}
                        <div className="flex-1 min-w-0">
                          {isEditingName ? (
                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="text"
                                autoFocus
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveEdit();
                                  if (e.key === 'Escape') setEditingCell(null);
                                }}
                                className="bg-white dark:bg-zinc-800 border border-gold-500 rounded px-2 py-1 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none w-full"
                              />
                              <button
                                type="button"
                                onClick={handleSaveEdit}
                                className="p-1 rounded bg-gold-500 text-zinc-950 hover:bg-gold-400"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEdit(record, 'name');
                              }}
                              className="font-medium text-zinc-900 dark:text-zinc-100 truncate flex items-center gap-2 group/edit cursor-pointer py-0.5 rounded hover:text-gold-500"
                            >
                              <span className="truncate">{record.name}</span>
                              <Edit3 className="w-3 h-3 opacity-0 group-hover/edit:opacity-100 text-zinc-400 hover:text-gold-500 transition-opacity shrink-0" />
                            </div>
                          )}
                          <div className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate">
                            بواسطة: {record.assignee.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className={`${densityStyles[density].td} text-zinc-600 dark:text-zinc-400 whitespace-nowrap`}>
                      {record.category}
                    </td>

                    {/* Status Badge */}
                    <td className={`${densityStyles[density].td} text-center whitespace-nowrap`}>
                      <StatusBadge status={record.status} size="sm" />
                    </td>

                    {/* Progress Bar Cell */}
                    <td className={`${densityStyles[density].td}`}>
                      <ProgressBarCell value={record.progress} size={density === 'compact' ? 'sm' : 'md'} />
                    </td>

                    {/* Budget (Numeric Left Aligned with Tabular Numbers) */}
                    <td className={`${densityStyles[density].td} text-left font-mono tabular-nums font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap`}>
                      {record.budget.toLocaleString('en-US')}
                    </td>

                    {/* Records Count (Numeric Left Aligned) */}
                    <td className={`${densityStyles[density].td} text-left font-mono tabular-nums text-zinc-500 dark:text-zinc-400 whitespace-nowrap`}>
                      {record.recordsCount.toLocaleString('en-US')}
                    </td>

                    {/* Contextual Row Actions (Reveal on Hover) */}
                    <td className={`${densityStyles[density].td} text-center whitespace-nowrap`}>
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRecord(record.id);
                          }}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors tactile-press"
                          title="حذف السجل"
                          aria-label="حذف السجل"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </motion.tbody>
        </table>

        {/* Empty State when zero results */}
        {filteredData.length === 0 && (
          <EmptyState
            searchTerm={searchQuery}
            onResetFilters={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
            onAddNew={handleAddNewRecord}
          />
        )}
      </div>

      {/* Table Footer Summary */}
      <div className="px-5 py-3 border-t border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <div>
          إجمالي السجلات: <span className="font-mono tabular-nums font-semibold text-zinc-800 dark:text-zinc-200">{filteredData.length}</span> من أصل <span className="font-mono tabular-nums">{data.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>آخر مزامنة لقاعدة البيانات: منذ بضع دقائق</span>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      <FloatingActionBar
        selectedCount={selectedIds.size}
        onClearSelection={() => setSelectedIds(new Set())}
        onBatchDelete={handleBatchDelete}
        onBatchStatusChange={handleBatchStatus}
        onBatchDuplicate={handleBatchDuplicate}
      />

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        actions={commandActions}
      />
    </div>
  );
};
