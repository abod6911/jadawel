'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Trash2, Eye, CheckCircle2, FileJson, Share2 } from 'lucide-react';
import { dropdownVariants } from '@/lib/motion';
import { TableRecord } from './DataTable';
import { StatusVariant } from './StatusBadge';

interface CustomContextMenuProps {
  x: number;
  y: number;
  isOpen: boolean;
  record: TableRecord | null;
  onClose: () => void;
  onInspect: (record: TableRecord) => void;
  onDuplicate: (record: TableRecord) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: StatusVariant) => void;
}

export const CustomContextMenu: React.FC<CustomContextMenuProps> = ({
  x,
  y,
  isOpen,
  record,
  onClose,
  onInspect,
  onDuplicate,
  onDelete,
  onStatusChange,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutside);
      document.addEventListener('scroll', onClose, true);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('scroll', onClose, true);
    };
  }, [isOpen, onClose]);

  // Handle ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !record) return null;

  // Prevent viewport overflow
  const adjustedX = Math.min(x, window.innerWidth - 220);
  const adjustedY = Math.min(y, window.innerHeight - 280);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(record, null, 2));
    onClose();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(record.code);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ top: adjustedY, left: adjustedX }}
          className="fixed z-50 w-52 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl text-zinc-800 dark:text-zinc-200 text-xs select-none gpu-layer"
          dir="rtl"
        >
          {/* Header Info */}
          <div className="px-3 py-1.5 border-b border-zinc-100 dark:border-zinc-800/80 mb-1 text-zinc-400 font-mono text-[11px] flex items-center justify-between">
            <span>{record.code}</span>
            <span className="text-[10px] text-zinc-500 font-sans">قائمة الإجراءات</span>
          </div>

          <div className="space-y-0.5">
            {/* Quick Inspect */}
            <button
              type="button"
              onClick={() => {
                onInspect(record);
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-start transition-colors tactile-press"
            >
              <Eye className="w-4 h-4 text-gold-500" />
              <span>معاينة تفاصيل السجل</span>
            </button>

            {/* Copy Code */}
            <button
              type="button"
              onClick={handleCopyCode}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-start transition-colors tactile-press"
            >
              <Copy className="w-4 h-4 text-zinc-400" />
              <span>نسخ رمز السجل</span>
            </button>

            {/* Copy JSON */}
            <button
              type="button"
              onClick={handleCopyJson}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-start transition-colors tactile-press"
            >
              <FileJson className="w-4 h-4 text-zinc-400" />
              <span>نسخ كـ JSON</span>
            </button>

            {/* Duplicate */}
            <button
              type="button"
              onClick={() => {
                onDuplicate(record);
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-start transition-colors tactile-press"
            >
              <Share2 className="w-4 h-4 text-sky-500" />
              <span>تكرار هذا السجل</span>
            </button>

            <div className="my-1 border-t border-zinc-100 dark:border-zinc-800/80" />

            {/* Delete Option */}
            <button
              type="button"
              onClick={() => {
                onDelete(record.id);
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-start transition-colors tactile-press"
            >
              <Trash2 className="w-4 h-4" />
              <span>حذف السجل</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
