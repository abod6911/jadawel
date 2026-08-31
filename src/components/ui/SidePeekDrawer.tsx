'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  User, 
  DollarSign, 
  FileText, 
  Tag, 
  Activity, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Share2, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { StatusBadge, StatusVariant } from './StatusBadge';
import { ProgressBarCell } from './ProgressBarCell';
import { TableRecord } from './DataTable';
import { MOTION_SPRINGS, backdropVariants } from '@/lib/motion';

interface SidePeekDrawerProps {
  record: TableRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateRecord?: (updated: TableRecord) => void;
  onNextRecord?: () => void;
  onPrevRecord?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export const SidePeekDrawer: React.FC<SidePeekDrawerProps> = ({
  record,
  isOpen,
  onClose,
  onUpdateRecord,
  onNextRecord,
  onPrevRecord,
  hasNext = false,
  hasPrev = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'activity'>('details');
  const [editedName, setEditedName] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (record) {
      setEditedName(record.name);
    }
  }, [record]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  // Handle ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!record) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(record, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleStatusChange = (newStatus: StatusVariant) => {
    if (onUpdateRecord) {
      onUpdateRecord({ ...record, status: newStatus, lastUpdated: 'الآن' });
    }
  };

  const handleNameBlur = () => {
    if (editedName !== record.name && onUpdateRecord) {
      onUpdateRecord({ ...record, name: editedName, lastUpdated: 'الآن' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" dir="rtl">
          {/* Backdrop Blur Overlay */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/70 backdrop-blur-sm z-40 transition-colors"
          />

          {/* Side-Peek Panel */}
          <motion.aside
            initial={{ x: '100%', opacity: 0.9 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.9 }}
            transition={MOTION_SPRINGS.smooth}
            className={`relative z-50 h-full bg-white dark:bg-zinc-900 border-s border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col transition-all duration-300 gpu-layer ${
              isExpanded ? 'w-full md:w-3/4 max-w-5xl' : 'w-full md:w-[480px] lg:w-[540px]'
            }`}
          >
            {/* Header Control Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/60 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-gold-600 dark:text-gold-400 bg-gold-500/10 dark:bg-gold-500/15 border border-gold-500/20 px-2 py-1 rounded-lg">
                  {record.code}
                </span>

                {/* Record Navigation */}
                <div className="flex items-center gap-1 ms-2 border-s border-zinc-200 dark:border-zinc-800 ps-2">
                  <button
                    type="button"
                    onClick={onPrevRecord}
                    disabled={!hasPrev}
                    className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors tactile-press"
                    title="السجل السابق"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={onNextRecord}
                    disabled={!hasNext}
                    className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors tactile-press"
                    title="السجل التالي"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors tactile-press"
                  title="نسخ بيانات السجل بصيغة JSON"
                >
                  {isCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hidden md:inline-flex p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors tactile-press"
                  title={isExpanded ? 'تصغير العرض' : 'توسيع العرض'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors tactile-press"
                  title="إغلاق اللوحة (ESC)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Title Header (Notion-style inline editable) */}
              <div>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onBlur={handleNameBlur}
                  className="w-full text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-gold-500/40 rounded-lg px-1 py-1 -mx-1"
                  placeholder="اسم السجل..."
                />
                <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>آخر تحديث: {record.lastUpdated}</span>
                </div>
              </div>

              {/* Quick Tab Switcher */}
              <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'details'
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                  }`}
                >
                  خصائص السجل
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('activity')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                    activeTab === 'activity'
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  سجل النشاطات
                </button>
              </div>

              {activeTab === 'details' ? (
                /* Metadata Property Grid (Linear/Notion Inspector Style) */
                <div className="space-y-4">
                  {/* Status Property */}
                  <div className="grid grid-cols-3 items-center py-2 border-b border-zinc-100 dark:border-zinc-800/60 text-sm">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-medium">
                      <Tag className="w-4 h-4 text-zinc-400" />
                      <span>الحالة</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <StatusBadge status={record.status} size="md" />
                      <div className="flex items-center gap-1 ms-2">
                        {(['active', 'pending', 'failed', 'neutral'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(st)}
                            className={`w-3 h-3 rounded-full border transition-transform ${
                              st === 'active'
                                ? 'bg-emerald-500 border-emerald-600'
                                : st === 'pending'
                                ? 'bg-amber-500 border-amber-600'
                                : st === 'failed'
                                ? 'bg-rose-500 border-rose-600'
                                : 'bg-zinc-400 border-zinc-500'
                            } ${record.status === st ? 'scale-125 ring-2 ring-gold-500/50' : 'opacity-60 hover:opacity-100'}`}
                            title={`تغيير إلى ${st}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Assignee Property */}
                  <div className="grid grid-cols-3 items-center py-2 border-b border-zinc-100 dark:border-zinc-800/60 text-sm">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-medium">
                      <User className="w-4 h-4 text-zinc-400" />
                      <span>المسؤول</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-full ${record.assignee.avatarColor} text-white text-[11px] font-bold flex items-center justify-center`}>
                        {record.assignee.initials}
                      </div>
                      <span className="text-zinc-800 dark:text-zinc-200 font-medium text-xs">
                        {record.assignee.name}
                      </span>
                    </div>
                  </div>

                  {/* Category Property */}
                  <div className="grid grid-cols-3 items-center py-2 border-b border-zinc-100 dark:border-zinc-800/60 text-sm">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-medium">
                      <FileText className="w-4 h-4 text-zinc-400" />
                      <span>التصنيف</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-zinc-800 dark:text-zinc-200 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700">
                        {record.category}
                      </span>
                    </div>
                  </div>

                  {/* Progress Property */}
                  <div className="grid grid-cols-3 items-center py-2 border-b border-zinc-100 dark:border-zinc-800/60 text-sm">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-medium">
                      <Activity className="w-4 h-4 text-zinc-400" />
                      <span>نسبة الإنجاز</span>
                    </div>
                    <div className="col-span-2">
                      <ProgressBarCell value={record.progress} size="md" />
                    </div>
                  </div>

                  {/* Budget Property */}
                  <div className="grid grid-cols-3 items-center py-2 border-b border-zinc-100 dark:border-zinc-800/60 text-sm">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-medium">
                      <DollarSign className="w-4 h-4 text-zinc-400" />
                      <span>الميزانية المرصودة</span>
                    </div>
                    <div className="col-span-2 font-mono tabular-nums text-zinc-900 dark:text-zinc-100 font-semibold text-sm">
                      {record.budget.toLocaleString('en-US')} ر.س
                    </div>
                  </div>

                  {/* Records Count Metric */}
                  <div className="grid grid-cols-3 items-center py-2 border-b border-zinc-100 dark:border-zinc-800/60 text-sm">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-medium">
                      <FileText className="w-4 h-4 text-zinc-400" />
                      <span>عدد السجلات الفرعية</span>
                    </div>
                    <div className="col-span-2 font-mono tabular-nums text-zinc-700 dark:text-zinc-300 font-medium text-xs">
                      {record.recordsCount} سجل
                    </div>
                  </div>
                </div>
              ) : (
                /* Activity Log & Audit Trail */
                <div className="space-y-4">
                  <div className="relative border-s-2 border-zinc-200 dark:border-zinc-800 ms-3 space-y-6">
                    <div className="relative ps-6">
                      <div className="absolute -start-[7px] top-0 w-3 h-3 rounded-full bg-gold-500 ring-4 ring-white dark:ring-zinc-900" />
                      <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        تم تحديث نسبة الإنجاز إلى {record.progress}%
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">منذ 15 دقيقة بواسطة {record.assignee.name}</div>
                    </div>

                    <div className="relative ps-6">
                      <div className="absolute -start-[7px] top-0 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-zinc-900" />
                      <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        تم اعتماد الميزانية بقيمة {record.budget.toLocaleString('en-US')} ر.س
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">منذ ساعتين بواسطة إدارة العمليات</div>
                    </div>

                    <div className="relative ps-6">
                      <div className="absolute -start-[7px] top-0 w-3 h-3 rounded-full bg-zinc-400 ring-4 ring-white dark:ring-zinc-900" />
                      <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        إنشاء السجل في النظام ({record.code})
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{record.lastUpdated}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 flex items-center justify-between text-xs text-zinc-500">
              <span>معرف السجل: <code className="font-mono text-gold-500">{record.id}</code></span>
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
              >
                إغلاق
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
