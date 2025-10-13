'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ShieldCheck, Cookie } from 'lucide-react';

export const CookiesModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookies-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookies-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookies-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-11/12 sm:w-[420px]"
        >
          <div
            className="relative bg-gray-900/90 backdrop-blur-md border border-emerald-600/30 
            text-gray-100 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-yellow-400" />

            <div className="p-6 flex flex-col items-start gap-4">
              <div className="flex items-center gap-2">
                <Cookie className="text-emerald-400 w-6 h-6" />
                <h3 className="text-lg font-semibold text-yellow-400">Cookies & Privacy</h3>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">
                We use cookies to enhance your browsing experience, serve personalized content, and
                analyze our traffic. By accepting, you consent to our cookies.
              </p>

              <div className="flex justify-end w-full gap-3 pt-2">
                <button
                  onClick={handleDecline}
                  className="px-4 py-2 rounded-xl font-medium text-gray-300 
                  border border-gray-700 hover:border-red-500 hover:text-red-400 
                  transition-all duration-300"
                >
                  Decline
                </button>

                <button
                  onClick={handleAccept}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-semibold 
                  hover:bg-emerald-500 hover:scale-105 active:scale-95 
                  shadow-md hover:shadow-emerald-500/40 transition-all duration-300 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Accept
                </button>
              </div>
            </div>

            <div className="absolute inset-0 -z-10 blur-3xl bg-emerald-500/10 rounded-2xl"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
