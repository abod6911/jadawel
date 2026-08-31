'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreHorizontal, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import { TableRecord } from './DataTable';
import { StatusBadge, StatusVariant } from './StatusBadge';
import { ProgressBarCell } from './ProgressBarCell';
import { MOTION_SPRINGS } from '@/lib/motion';

interface KanbanViewProps {
  records: TableRecord[];
  onSelectRecord: (record: TableRecord) => void;
  onStatusChange?: (id: string, newStatus: StatusVariant) => void;
}

const COLUMNS: { status: StatusVariant; title: string; color: string }[] = [
  { status: 'active', title: 'نشط ومكتمل', color: 'border-emerald-500/40 bg-emerald-500/5' },
  { status: 'pending', title: 'قيد التنفيذ', color: 'border-amber-500/40 bg-amber-500/5' },
  { status: 'neutral', title: 'مسودة ومحايد', color: 'border-zinc-500/40 bg-zinc-500/5' },
  { status: 'failed', title: 'ملغي ومتعثر', color: 'border-rose-500/40 bg-rose-500/5' },
];

export const KanbanView: React.FC<KanbanViewProps> = ({
  records,
  onSelectRecord,
}) => {
  return (
    <div className="p-6 overflow-x-auto min-h-[500px]" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 min-w-[900px]">
        {COLUMNS.map((col) => {
          const colRecords = records.filter((r) => r.status === col.status);

          return (
            <div
              key={col.status}
              className="flex flex-col rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/80 p-3.5 shadow-sm"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800/60 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                    {col.title}
                  </span>
                  <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] font-bold flex items-center justify-center tabular-nums">
                    {colRecords.length}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[580px] p-0.5">
                <AnimatePresence mode="popLayout">
                  {colRecords.map((record) => (
                    <motion.div
                      key={record.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={MOTION_SPRINGS.smooth}
                      onClick={() => onSelectRecord(record)}
                      className="group p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm hover:shadow-md hover:border-gold-500/40 transition-all cursor-pointer select-none relative"
                    >
                      {/* Top Row: Code & Category */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-gold-600 dark:text-gold-400">
                          {record.code}
                        </span>
                        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                          {record.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h5 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-gold-500 transition-colors line-clamp-2 mb-3">
                        {record.name}
                      </h5>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <ProgressBarCell value={record.progress} size="sm" />
                      </div>

                      {/* Footer Row: Assignee & Budget */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-zinc-100 dark:border-zinc-800/70 text-xs">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-5 h-5 rounded-full ${record.assignee.avatarColor} text-white text-[10px] font-bold flex items-center justify-center`}
                            title={record.assignee.name}
                          >
                            {record.assignee.initials}
                          </div>
                          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate max-w-[90px]">
                            {record.assignee.name}
                          </span>
                        </div>

                        <div className="font-mono tabular-nums font-semibold text-zinc-900 dark:text-zinc-100 text-xs">
                          {record.budget.toLocaleString('en-US')} ر.س
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {colRecords.length === 0 && (
                  <div className="p-6 text-center text-xs text-zinc-400 dark:text-zinc-500 border-2 border-dashed border-zinc-200 dark:border-zinc-800/80 rounded-xl">
                    لا توجد بطاقات
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
