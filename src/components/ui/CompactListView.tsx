'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TableRecord } from './DataTable';
import { StatusBadge } from './StatusBadge';
import { ProgressBarCell } from './ProgressBarCell';
import { Trash2, Eye, Edit3 } from 'lucide-react';
import { tableContainerVariants, tableRowVariants } from '@/lib/motion';

interface CompactListViewProps {
  records: TableRecord[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectRecord: (record: TableRecord) => void;
  onDeleteRecord: (id: string) => void;
}

export const CompactListView: React.FC<CompactListViewProps> = ({
  records,
  selectedIds,
  onToggleSelect,
  onSelectRecord,
  onDeleteRecord,
}) => {
  return (
    <div className="p-4" dir="rtl">
      <motion.div
        variants={tableContainerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-1.5"
      >
        <AnimatePresence mode="popLayout">
          {records.map((record, idx) => {
            const isSelected = selectedIds.has(record.id);

            return (
              <motion.div
                key={record.id}
                layout
                variants={tableRowVariants}
                custom={idx}
                onClick={() => onSelectRecord(record)}
                className={`group flex items-center justify-between gap-4 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-gold-500/10 border-gold-500/30 dark:bg-gold-500/15'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800/80 hover:border-gold-500/40 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                {/* Left side (in RTL): Checkbox, Code, Title */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(record.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gold-500 focus:ring-gold-500/30 cursor-pointer accent-gold-500 shrink-0"
                  />

                  <span className="font-mono tabular-nums text-xs font-bold text-gold-600 dark:text-gold-400 shrink-0">
                    {record.code}
                  </span>

                  <div className="flex items-center gap-2 truncate">
                    <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate group-hover:text-gold-500 transition-colors">
                      {record.name}
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 hidden sm:inline shrink-0">
                      • {record.category}
                    </span>
                  </div>
                </div>

                {/* Right side (in RTL): Assignee, Status, Progress, Budget, Actions */}
                <div className="flex items-center gap-4 shrink-0">
                  {/* Assignee Avatar */}
                  <div
                    className={`w-6 h-6 rounded-full ${record.assignee.avatarColor} text-white text-[10px] font-bold flex items-center justify-center shrink-0`}
                    title={record.assignee.name}
                  >
                    {record.assignee.initials}
                  </div>

                  {/* Status Badge */}
                  <div className="hidden sm:block">
                    <StatusBadge status={record.status} size="sm" />
                  </div>

                  {/* Mini Progress */}
                  <div className="w-24 hidden md:block">
                    <ProgressBarCell value={record.progress} size="sm" />
                  </div>

                  {/* Budget (Numeric Left Aligned) */}
                  <div className="font-mono tabular-nums font-semibold text-xs text-zinc-900 dark:text-zinc-100 text-left min-w-[75px]">
                    {record.budget.toLocaleString('en-US')} ر.س
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRecord(record.id);
                      }}
                      className="p-1 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
