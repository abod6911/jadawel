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
  Eye,
  Share2
} from 'lucide-react';
import { StatusBadge, StatusVariant } from './StatusBadge';
import { ProgressBarCell } from './ProgressBarCell';
import { EmptyState } from './EmptyState';
import { FloatingActionBar } from './FloatingActionBar';
import { CommandPalette, CommandAction } from './CommandPalette';
import { SkeletonTable } from './SkeletonTable';
import { SidePeekDrawer } from './SidePeekDrawer';
import { CustomContextMenu } from './CustomContextMenu';
import { DataFilterBar, ActiveViewMode, FilterChip } from './DataFilterBar';
import { KanbanView } from './KanbanView';
import { CompactListView } from './CompactListView';
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
}

export const DataTable: React.FC<DataTableProps> = ({
  initialData = INITIAL_RECORDS,
  isLoading = false,
}) => {
  const [data, setData] = useState<TableRecord[]>(initialData);
  const [viewMode, setViewMode] = useState<ActiveViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterChip[]>([]);
  const [density, setDensity] = useState<TableDensity>('comfortable');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedRecordForPeek, setSelectedRecordForPeek] = useState<TableRecord | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof TableRecord } | null>(null);
  const [editValue, setEditValue] = useState('');

  // Column visibility state
  const [columns, setColumns] = useState([
    { key: 'code', label: 'رمز الجدول', visible: true },
    { key: 'name', label: 'اسم السجل / المسؤول', visible: true },
    { key: 'category', label: 'التصنيف', visible: true },
    { key: 'status', label: 'الحالة', visible: true },
    { key: 'progress', label: 'الإنجاز', visible: true },
    { key: 'budget', label: 'الميزانية', visible: true },
    { key: 'recordsCount', label: 'السجلات', visible: true },
  ]);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    record: TableRecord | null;
  }>({
    isOpen: false,
    x: 0,
    y: 0,
    record: null,
  });

  const handleToggleColumn = (key: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.key === key ? { ...col, visible: !col.visible } : col))
    );
  };

  const isColVisible = (key: string) => columns.find((c) => c.key === key)?.visible ?? true;

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
      // 1. Search Query
      const matchesSearch =
        !searchQuery ||
        record.name.includes(searchQuery) ||
        record.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.category.includes(searchQuery) ||
        record.assignee.name.includes(searchQuery);

      if (!matchesSearch) return false;

      // 2. Filter Chips
      for (const filter of filters) {
        let fieldVal = '';
        if (filter.field === 'category') fieldVal = record.category;
        else if (filter.field === 'status') fieldVal = record.status;
        else if (filter.field === 'assignee') fieldVal = record.assignee.name;
        else if (filter.field === 'name') fieldVal = record.name;

        if (filter.operator === 'is' && fieldVal !== filter.value) return false;
        if (filter.operator === 'contains' && !fieldVal.includes(filter.value)) return false;
      }

      return true;
    });
  }, [data, searchQuery, filters]);

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

  // Delete record
  const handleDeleteRecord = (id: string) => {
    setData((prev) => prev.filter((r) => r.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (selectedRecordForPeek?.id === id) {
      setSelectedRecordForPeek(null);
    }
  };

  // Duplicate record
  const handleDuplicateRecord = (rec: TableRecord) => {
    const clone: TableRecord = {
      ...rec,
      id: String(Date.now()),
      code: `${rec.code}-نسخة`,
      name: `${rec.name} (نسخة مكررة)`,
      lastUpdated: 'الآن',
    };
    setData([clone, ...data]);
  };

  // Batch delete
  const handleBatchDelete = () => {
    setData((prev) => prev.filter((r) => !selectedIds.has(r.id)));
    setSelectedIds(new Set());
  };

  // Batch status
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
    setSelectedIds(new Set());
  };

  // Update record from side peek
  const handleUpdateRecord = (updated: TableRecord) => {
    setData((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setSelectedRecordForPeek(updated);
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

  // Right-click Context Menu
  const handleContextMenu = (e: React.MouseEvent, record: TableRecord) => {
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      record,
    });
  };

  // Side Peek Navigation
  const currentPeekIndex = selectedRecordForPeek
    ? filteredData.findIndex((r) => r.id === selectedRecordForPeek.id)
    : -1;
  const hasNextPeek = currentPeekIndex >= 0 && currentPeekIndex < filteredData.length - 1;
  const hasPrevPeek = currentPeekIndex > 0;

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
      id: 'switch-table',
      title: 'التحويل إلى عرض الجدول الشبكي',
      category: 'عمليات سريعة',
      icon: SlidersHorizontal,
      perform: () => setViewMode('table'),
    },
    {
      id: 'switch-kanban',
      title: 'التحويل إلى عرض لوحة كانبان',
      category: 'عمليات سريعة',
      icon: SlidersHorizontal,
      perform: () => setViewMode('kanban'),
    },
    {
      id: 'switch-list',
      title: 'التحويل إلى عرض القائمة المضغوطة',
      category: 'عمليات سريعة',
      icon: SlidersHorizontal,
      perform: () => setViewMode('list'),
    },
    {
      id: 'toggle-density',
      title: `تبديل نمط الكثافة إلى (${density === 'compact' ? 'مريح' : 'مضغوط'})`,
      category: 'عمليات سريعة',
      icon: SlidersHorizontal,
      perform: () => setDensity(density === 'compact' ? 'comfortable' : 'compact'),
    },
  ];

  // Listen for Ctrl+K
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
      {/* Top Filter Bar & Multi-View Switcher */}
      <DataFilterBar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onAddFilter={(f) => setFilters([...filters, f])}
        onRemoveFilter={(id) => setFilters(filters.filter((f) => f.id !== id))}
        onClearAllFilters={() => setFilters([])}
        totalRecordsCount={data.length}
        filteredRecordsCount={filteredData.length}
        columns={columns}
        onToggleColumn={handleToggleColumn}
        density={density}
        onDensityChange={setDensity}
      />

      {/* Main View Area */}
      <div className="relative">
        {viewMode === 'table' && (
          <div className="overflow-x-auto max-h-[620px] overflow-y-auto">
            <table className="w-full text-start border-collapse">
              {/* Sticky Glass Header */}
              <thead className="sticky top-0 z-20 backdrop-blur-md bg-white/90 dark:bg-zinc-900/90 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
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
                        aria-label="تحديد الكل"
                      />
                    </div>
                  </th>

                  {isColVisible('code') && (
                    <th className={`${densityStyles[density].th} text-right font-medium`}>رمز الجدول</th>
                  )}

                  {isColVisible('name') && (
                    <th className={`${densityStyles[density].th} text-right font-medium`}>اسم السجل / المسؤول</th>
                  )}

                  {isColVisible('category') && (
                    <th className={`${densityStyles[density].th} text-right font-medium`}>التصنيف</th>
                  )}

                  {isColVisible('status') && (
                    <th className={`${densityStyles[density].th} text-center font-medium`}>الحالة</th>
                  )}

                  {isColVisible('progress') && (
                    <th className={`${densityStyles[density].th} text-right font-medium min-w-[140px]`}>الإنجاز</th>
                  )}

                  {isColVisible('budget') && (
                    <th className={`${densityStyles[density].th} text-left font-medium`}>الميزانية (ر.س)</th>
                  )}

                  {isColVisible('recordsCount') && (
                    <th className={`${densityStyles[density].th} text-left font-medium`}>السجلات</th>
                  )}

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
                        onContextMenu={(e) => handleContextMenu(e, record)}
                        onClick={() => setSelectedRecordForPeek(record)}
                        className={`group transition-colors duration-150 cursor-pointer ${
                          isSelected
                            ? 'bg-gold-500/10 dark:bg-gold-500/15'
                            : 'hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40'
                        }`}
                      >
                        {/* Checkbox */}
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
                        {isColVisible('code') && (
                          <td className={`${densityStyles[density].td} font-mono tabular-nums text-gold-600 dark:text-gold-400 font-semibold text-xs whitespace-nowrap`}>
                            {record.code}
                          </td>
                        )}

                        {/* Name & Assignee with Inset Inline Edit */}
                        {isColVisible('name') && (
                          <td className={`${densityStyles[density].td}`}>
                            <div className="flex items-center gap-3">
                              {/* Avatar */}
                              <div
                                className={`w-7 h-7 rounded-full ${record.assignee.avatarColor} text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm`}
                                title={record.assignee.name}
                              >
                                {record.assignee.initials}
                              </div>

                              {/* Title */}
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
                                      className="bg-white dark:bg-zinc-800 border border-gold-500 rounded px-2 py-1 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none w-full shadow-inner"
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
                                    className="font-medium text-zinc-900 dark:text-zinc-100 truncate flex items-center gap-2 group/edit py-0.5 rounded hover:text-gold-500"
                                  >
                                    <span className="truncate">{record.name}</span>
                                    <Edit3 className="w-3 h-3 opacity-0 group-hover/edit:opacity-100 text-zinc-400 hover:text-gold-500 transition-opacity shrink-0" />
                                  </div>
                                )}
                                <div className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate">
                                  {record.assignee.name}
                                </div>
                              </div>
                            </div>
                          </td>
                        )}

                        {/* Category */}
                        {isColVisible('category') && (
                          <td className={`${densityStyles[density].td} text-zinc-600 dark:text-zinc-400 whitespace-nowrap`}>
                            {record.category}
                          </td>
                        )}

                        {/* Status Badge */}
                        {isColVisible('status') && (
                          <td className={`${densityStyles[density].td} text-center whitespace-nowrap`}>
                            <StatusBadge status={record.status} size="sm" />
                          </td>
                        )}

                        {/* Progress */}
                        {isColVisible('progress') && (
                          <td className={`${densityStyles[density].td}`}>
                            <ProgressBarCell value={record.progress} size={density === 'compact' ? 'sm' : 'md'} />
                          </td>
                        )}

                        {/* Budget (Numeric Left Aligned) */}
                        {isColVisible('budget') && (
                          <td className={`${densityStyles[density].td} text-left font-mono tabular-nums font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap`}>
                            {record.budget.toLocaleString('en-US')}
                          </td>
                        )}

                        {/* Records Count (Numeric Left Aligned) */}
                        {isColVisible('recordsCount') && (
                          <td className={`${densityStyles[density].td} text-left font-mono tabular-nums text-zinc-500 dark:text-zinc-400 whitespace-nowrap`}>
                            {record.recordsCount.toLocaleString('en-US')}
                          </td>
                        )}

                        {/* Hover Actions */}
                        <td className={`${densityStyles[density].td} text-center whitespace-nowrap`}>
                          <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRecordForPeek(record);
                              }}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-gold-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors tactile-press"
                              title="معاينة جانبية"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateRecord(record);
                              }}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-sky-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors tactile-press"
                              title="تكرار السجل"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRecord(record.id);
                              }}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors tactile-press"
                              title="حذف السجل"
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
          </div>
        )}

        {viewMode === 'kanban' && (
          <KanbanView
            records={filteredData}
            onSelectRecord={(rec) => setSelectedRecordForPeek(rec)}
          />
        )}

        {viewMode === 'list' && (
          <CompactListView
            records={filteredData}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onSelectRecord={(rec) => setSelectedRecordForPeek(rec)}
            onDeleteRecord={handleDeleteRecord}
          />
        )}

        {/* Empty State */}
        {filteredData.length === 0 && (
          <EmptyState
            searchTerm={searchQuery}
            onResetFilters={() => {
              setSearchQuery('');
              setFilters([]);
            }}
            onAddNew={handleAddNewRecord}
          />
        )}
      </div>

      {/* Footer Summary Bar */}
      <div className="px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 flex flex-wrap items-center justify-between text-xs text-zinc-500 gap-3">
        <div className="flex items-center gap-2">
          <span>إجمالي السجلات المعروضة:</span>
          <span className="font-mono tabular-nums font-semibold text-zinc-800 dark:text-zinc-200">
            {filteredData.length}
          </span>
          <span>من أصل</span>
          <span className="font-mono tabular-nums">{data.length}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline font-mono text-[11px] text-zinc-400">
            انقر بالزر الأيمن على الصف للخيارات المتقدمة
          </span>
          <Button
            variant="coral"
            size="sm"
            onClick={handleAddNewRecord}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            إضافة سجل جديد
          </Button>
        </div>
      </div>

      {/* Side Peek Drawer (Notion style) */}
      <SidePeekDrawer
        record={selectedRecordForPeek}
        isOpen={Boolean(selectedRecordForPeek)}
        onClose={() => setSelectedRecordForPeek(null)}
        onUpdateRecord={handleUpdateRecord}
        onNextRecord={() => {
          if (hasNextPeek) setSelectedRecordForPeek(filteredData[currentPeekIndex + 1]);
        }}
        onPrevRecord={() => {
          if (hasPrevPeek) setSelectedRecordForPeek(filteredData[currentPeekIndex - 1]);
        }}
        hasNext={hasNextPeek}
        hasPrev={hasPrevPeek}
      />

      {/* Custom Context Menu */}
      <CustomContextMenu
        isOpen={contextMenu.isOpen}
        x={contextMenu.x}
        y={contextMenu.y}
        record={contextMenu.record}
        onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
        onInspect={(rec) => setSelectedRecordForPeek(rec)}
        onDuplicate={handleDuplicateRecord}
        onDelete={handleDeleteRecord}
        onStatusChange={(id, st) => {
          setData((prev) => prev.map((r) => (r.id === id ? { ...r, status: st } : r)));
        }}
      />

      {/* Floating Bulk Action Bar */}
      <FloatingActionBar
        selectedCount={selectedIds.size}
        onClearSelection={() => setSelectedIds(new Set())}
        onBatchDelete={handleBatchDelete}
        onBatchStatusChange={handleBatchStatus}
        onBatchDuplicate={handleBatchDuplicate}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        actions={commandActions}
      />
    </div>
  );
};
