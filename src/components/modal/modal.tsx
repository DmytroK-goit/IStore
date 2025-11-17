'use client';
import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-slate-800 dark:bg-gray-900 text-gray-900 dark:text-gray-100 
                       p-6 sm:p-8 rounded-2xl shadow-2xl max-w-3lg border border-gray-200 
                       dark:border-gray-700 w-1/3"
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {title && (
              <h2 className="text-2xl font-bold mb-4 text-center text-emerald-500">{title}</h2>
            )}

            <div className="text-center text-base leading-relaxed mb-6">{children}</div>

            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-red-500 text-white font-semibold rounded-xl 
                hover:bg-red-700 focus:ring-2 focus:bg-red-500 focus:ring-offset-2
                active:scale-95 transition-all duration-300 shadow-md 
                hover:shadow-emerald-500/40 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="absolute inset-0 -z-10 blur-2xl bg-emerald-500/10 rounded-2xl" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
