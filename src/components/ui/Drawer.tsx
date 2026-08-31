'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X } from 'lucide-react';
import { 
  backdropVariants, 
  createDrawerVariants, 
  MOTION_SPRINGS, 
  MOTION_TIMING 
} from '@/lib/motion';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  side?: 'right' | 'left';
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const WIDTH_MAP = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-full',
};

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  side = 'right',
  width = 'md',
}) => {
  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll during open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const drawerVariants = createDrawerVariants(side);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    const velocityThreshold = 350;
    
    if (side === 'right' && (info.offset.x > threshold || info.velocity.x > velocityThreshold)) {
      onClose();
    } else if (side === 'left' && (info.offset.x < -threshold || info.velocity.x < -velocityThreshold)) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex" dir="rtl">
          {/* Backdrop Blur Overlay */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-abyss-950/80 backdrop-blur-md z-40 transition-colors"
          />

          {/* Drawer Panel Container */}
          <div className={`fixed inset-y-0 z-50 flex ${side === 'right' ? 'right-0' : 'left-0'} max-w-full`}>
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              className={`w-screen ${WIDTH_MAP[width]} bg-abyss-900 border-s border-white/10 shadow-cinematic flex flex-col gpu-layer`}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-abyss-950/70 backdrop-blur-lg">
                <div>
                  {title && <h3 className="text-lg font-bold text-pearl">{title}</h3>}
                  {subtitle && <p className="text-xs text-pearl-muted mt-0.5">{subtitle}</p>}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-pearl-muted hover:text-white hover:bg-white/10 transition-colors tactile-press focus:outline-none"
                  aria-label="إغلاق اللوحة"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 text-pearl">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
