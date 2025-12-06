'use client';

import { motion } from 'framer-motion';
import { Chapter } from '@/types';
import { formatDateShort } from '@/lib/utils';
import { hoverLift } from '@/lib/animations';

interface TimelineMapProps {
  chapters: Chapter[];
  currentIndex: number;
  onChapterClick: (index: number) => void;
}

export default function TimelineMap({ chapters, currentIndex, onChapterClick }: TimelineMapProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Animated Timeline Line */}
        <div className="absolute left-0 right-0 h-1 bg-warm-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-rose-400 via-rose-500 to-amber-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentIndex / (chapters.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        
        {/* Chapter Dots */}
        {chapters.map((chapter, index) => (
          <motion.button
            key={chapter.id}
            onClick={() => onChapterClick(index)}
            whileHover={{ ...hoverLift, scale: 1.4 }}
            whileTap={{ scale: 0.9 }}
            className={`relative z-10 rounded-full transition-all ${
              index <= currentIndex
                ? 'bg-gradient-to-br from-rose-500 to-amber-500 shadow-lg glow'
                : 'bg-warm-gray-300'
            }`}
            style={{
              width: index === currentIndex ? '16px' : '12px',
              height: index === currentIndex ? '16px' : '12px',
            }}
            title={chapter.title}
          >
            {/* Pulse animation for current */}
            {index === currentIndex && (
              <motion.div
                className="absolute inset-0 rounded-full bg-rose-500"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}
            
            {/* Hover Preview */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              whileHover={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 glass rounded-xl shadow-2xl p-4 pointer-events-none border border-white/20"
            >
              <p className="text-sm font-bold text-warm-gray-800 mb-1">
                {chapter.title}
              </p>
              <p className="text-xs text-warm-gray-500">
                {formatDateShort(chapter.date)}
              </p>
              {chapter.place && (
                <p className="text-xs text-rose-500 mt-1">📍 {chapter.place}</p>
              )}
            </motion.div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
