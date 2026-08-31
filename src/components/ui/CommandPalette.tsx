'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, Download, Trash2, Command, FileSpreadsheet, ArrowRight, CornerDownLeft } from 'lucide-react';
import { backdropVariants, modalVariants } from '@/lib/motion';

export interface CommandAction {
  id: string;
  title: string;
  category: 'إجراءات الجداول' | 'الفلاتر والبحث' | 'عمليات سريعة';
  icon: React.ElementType;
  shortcut?: string;
  perform: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  actions: CommandAction[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  actions,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter actions based on query
  const filteredActions = actions.filter((action) =>
    action.title.toLowerCase().includes(query.toLowerCase()) ||
    action.category.toLowerCase().includes(query.toLowerCase())
  );

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Arrow key navigation inside palette
  const handleKeyNavigation = useCallback(
    (e: React.KeyboardEvent) => {
      if (filteredActions.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredActions[selectedIndex];
        if (selected) {
          selected.perform();
          onClose();
        }
      }
    },
    [filteredActions, selectedIndex, onClose]
  );

  // Reset index on search change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4 overflow-hidden" dir="rtl">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md z-40"
          />

          {/* Palette Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-xl bg-zinc-900/95 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 text-zinc-100 flex flex-col backdrop-blur-2xl gpu-layer"
            onKeyDown={handleKeyNavigation}
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-zinc-800 bg-zinc-950/40">
              <Search className="w-5 h-5 text-zinc-400 ms-1 me-3 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن أمر، أو فلترة، أو إجراء في الجداول..."
                className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
              />
              <span className="text-[11px] font-mono bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700">
                ESC
              </span>
            </div>

            {/* Actions List */}
            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-zinc-800/40">
              {filteredActions.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-sm">
                  لا توجد أوامر مطابقة لـ "{query}".
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredActions.map((action, idx) => {
                    const isSelected = idx === selectedIndex;
                    const Icon = action.icon;

                    return (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => {
                          action.perform();
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors text-start cursor-pointer select-none ${
                          isSelected
                            ? 'bg-gold-500/15 text-gold-300 border border-gold-500/30'
                            : 'text-zinc-300 hover:bg-zinc-800/60 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`p-1.5 rounded-lg ${
                              isSelected
                                ? 'bg-gold-500 text-zinc-950'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </span>
                          <div>
                            <div className="font-medium">{action.title}</div>
                            <div className="text-[11px] text-zinc-500">{action.category}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {action.shortcut && (
                            <span className="font-mono text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700">
                              {action.shortcut}
                            </span>
                          )}
                          {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-gold-400" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="px-4 py-2 bg-zinc-950/60 border-t border-zinc-800 text-[11px] text-zinc-500 flex items-center justify-between">
              <span>استخدم الأسهم للانتقال و Enter للتنفيذ</span>
              <span className="font-mono">⌘K / Ctrl+K</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
