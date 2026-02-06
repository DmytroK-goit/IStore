'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

export const Pagination = ({ page, setPage, totalPages }: PaginationProps) => {
  const { theme } = useTheme();

  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setPage((prev: number) => Math.max(prev - 1, 1))}
        disabled={page === 1}
        className={`flex items-center gap-1 px-3 py-1 rounded-xl transition-colors font-medium ${theme === 'dark'
          ? 'bg-gray-800 text-gray-100 disabled:opacity-50 hover:bg-gray-700'
          : 'bg-gray-200 text-gray-800 disabled:opacity-50 hover:bg-gray-300'
          }`}
      >
        <ChevronLeft className="w-4 h-4" /> Back
      </motion.button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <AnimatePresence key={p}>
          <motion.button
            key={p}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage(p)}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className={`px-3 py-1 rounded-xl font-medium transition-colors ${p === page
              ? 'bg-emerald-500 text-white shadow-md'
              : theme === 'dark'
                ? 'bg-gray-800 text-gray-100 hover:bg-gray-700'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
          >
            {p}
          </motion.button>
        </AnimatePresence>
      ))}

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setPage((prev: number) => Math.min(prev + 1, totalPages))}
        disabled={page === totalPages}
        className={`flex items-center gap-1 px-3 py-1 rounded-xl transition-colors font-medium ${theme === 'dark'
          ? 'bg-gray-800 text-gray-100 disabled:opacity-50 hover:bg-gray-700'
          : 'bg-gray-200 text-gray-800 disabled:opacity-50 hover:bg-gray-300'
          }`}
      >
        Next <ChevronRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
};
