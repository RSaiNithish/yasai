'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '@/types';
import { formatDate } from '@/lib/utils';

interface MessageModalProps {
  message: Message | null;
  onClose: () => void;
}

export default function MessageModal({ message, onClose }: MessageModalProps) {
  return (
    <AnimatePresence>
      {message && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl glass rounded-3xl border border-white/30 shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-8 md:p-12 overflow-y-auto max-h-[90vh] scrollbar-hide">
              {/* Close Button */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white border border-neutral-200 transition-colors shadow-lg"
              >
                <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Content */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-3">
                    {message.author}
                  </h2>
                  <p className="text-neutral-600 uppercase tracking-widest text-sm font-light mb-2">
                    {message.relation}
                  </p>
                  <p className="text-sm text-neutral-500 font-light">
                    {formatDate(message.date)}
                  </p>
                </div>

                <div className="border-t border-neutral-200 pt-8">
                  <p className="text-lg md:text-xl text-neutral-700 leading-relaxed whitespace-pre-wrap font-light">
                    {message.text}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
