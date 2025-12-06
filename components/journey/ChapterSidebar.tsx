'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Chapter } from '@/types';
import { formatDate } from '@/lib/utils';
import { slideInRight, textReveal, staggerText, hoverLift } from '@/lib/animations';

interface ChapterSidebarProps {
  chapter: Chapter;
  currentIndex: number;
  totalChapters: number;
  onNext: () => void;
  onPrev: () => void;
  messages?: Array<{ id: string; author: string; text: string }>;
}

export default function ChapterSidebar({
  chapter,
  currentIndex,
  totalChapters,
  onNext,
  onPrev,
  messages = [],
}: ChapterSidebarProps) {
  return (
    <motion.div
      variants={slideInRight}
      initial="hidden"
      animate="visible"
      className="h-screen sticky top-0 bg-white/95 backdrop-blur-sm border-l border-warm-gray-200 p-8 overflow-y-auto"
    >
      <div className="max-w-md mx-auto space-y-6">
        {/* Chapter Number */}
        <div className="text-sm text-warm-gray-500 font-medium">
          Chapter {currentIndex + 1} of {totalChapters}
        </div>

        {/* Title */}
        <AnimatePresence mode="wait">
          <motion.h2
            key={chapter.id}
            variants={textReveal}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="text-4xl md:text-5xl font-bold text-gradient mb-2"
          >
            {chapter.title}
          </motion.h2>
        </AnimatePresence>

        {/* Date */}
        <div className="flex items-center gap-2 text-warm-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-medium">{formatDate(chapter.date)}</span>
        </div>

        {/* Place */}
        {chapter.place && (
          <div className="flex items-center gap-2 text-warm-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{chapter.place}</span>
          </div>
        )}

        {/* Anecdote */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`text-${chapter.id}`}
            variants={textReveal}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ delay: 0.2 }}
            className="text-lg text-warm-gray-700 leading-relaxed"
          >
            {chapter.text}
          </motion.p>
        </AnimatePresence>

        {/* Messages Preview */}
        {messages.length > 0 && (
          <div className="border-t border-warm-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-warm-gray-500 uppercase mb-3">
              Messages from Friends
            </h3>
            <div className="space-y-3">
              {messages.slice(0, 2).map((msg) => (
                <div key={msg.id} className="bg-rose-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-warm-gray-800 mb-1">
                    {msg.author}
                  </p>
                  <p className="text-sm text-warm-gray-700 line-clamp-2">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 pt-6 border-t border-warm-gray-200">
          <motion.button
            whileHover={currentIndex > 0 ? { ...hoverLift, x: -5 } : {}}
            whileTap={{ scale: 0.95 }}
            onClick={onPrev}
            disabled={currentIndex === 0}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              currentIndex === 0
                ? 'bg-warm-gray-100 text-warm-gray-400 cursor-not-allowed'
                : 'bg-warm-gray-200 text-warm-gray-800 hover:bg-warm-gray-300 shadow-md hover:shadow-lg'
            }`}
          >
            ← Previous
          </motion.button>
          <motion.button
            whileHover={currentIndex < totalChapters - 1 ? { ...hoverLift, x: 5 } : {}}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            disabled={currentIndex === totalChapters - 1}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              currentIndex === totalChapters - 1
                ? 'bg-warm-gray-100 text-warm-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-rose-500 to-amber-500 text-white hover:shadow-xl glow'
            }`}
          >
            Next →
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
