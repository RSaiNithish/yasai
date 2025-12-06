'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getChapters, getMessages } from '@/lib/data';
import { useScrollSnap } from '@/hooks/useScrollSnap';
import { useKeyboard } from '@/hooks/useKeyboard';
import JourneyCanvas from '@/components/journey/JourneyCanvas';
import ChapterSidebar from '@/components/journey/ChapterSidebar';
import TimelineMap from '@/components/journey/TimelineMap';
import ProgressIndicator from '@/components/journey/ProgressIndicator';
import Link from 'next/link';
import { pageTransition } from '@/lib/animations';

export default function JourneyPage() {
  const chapters = getChapters();
  const { containerRef, currentSection, scrollToSection, nextSection, prevSection } = useScrollSnap(chapters.length);

  useKeyboard({
    onArrowLeft: prevSection,
    onArrowRight: nextSection,
  });

  const currentChapter = chapters[currentSection];
  const chapterMessages = getMessages({ chapterId: currentChapter?.id });

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen bg-gradient-to-br from-warm-gray-50 via-rose-50/30 to-amber-50/30"
    >
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="sticky top-0 z-50 glass border-b border-white/20 px-8 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="text-xl font-bold text-warm-gray-800 hover:text-rose-500 transition-colors flex items-center gap-2 group">
              <motion.span
                animate={{ x: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                ←
              </motion.span>
              <span>Home</span>
            </Link>
          </motion.div>
          <div className="flex items-center gap-6">
            {['Messages', 'Videos', 'Surprise'].map((item) => (
              <motion.div
                key={item}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={`/${item.toLowerCase()}`}
                  className="text-warm-gray-700 hover:text-rose-500 transition-colors font-medium relative group"
                >
                  {item}
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-500 group-hover:w-full transition-all duration-300"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Progress Indicator */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="sticky top-[73px] z-40 glass px-8 py-3"
      >
        <div className="max-w-7xl mx-auto">
          <ProgressIndicator current={currentSection} total={chapters.length} />
        </div>
      </motion.div>

      {/* Timeline Map */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="sticky top-[121px] z-30 glass px-8 py-4"
      >
        <div className="max-w-7xl mx-auto">
          <TimelineMap
            chapters={chapters}
            currentIndex={currentSection}
            onChapterClick={scrollToSection}
          />
        </div>
      </motion.div>

      {/* Main Content - Two Panel Layout */}
      <div className="flex relative">
        {/* Left Panel - Canvas */}
        <div className="flex-1 relative">
          <div
            ref={containerRef}
            className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
            style={{ scrollSnapType: 'y mandatory' }}
          >
            <AnimatePresence mode="wait">
              {chapters.map((chapter, index) => (
                <motion.section
                  key={`${chapter.id}-${index}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="h-screen snap-start snap-always flex items-center justify-center p-8 relative"
                >
                  <div className="w-full h-full max-w-6xl">
                    {index === currentSection && (
                      <JourneyCanvas chapter={chapter} />
                    )}
                  </div>
                </motion.section>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Panel - Sidebar */}
        <div className="hidden lg:block w-96 flex-shrink-0">
          <ChapterSidebar
            chapter={currentChapter}
            currentIndex={currentSection}
            totalChapters={chapters.length}
            onNext={nextSection}
            onPrev={prevSection}
            messages={chapterMessages.map(msg => ({
              id: msg.id,
              author: msg.author,
              text: msg.text,
            }))}
          />
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/20 p-4"
      >
        <div className="flex items-center justify-between max-w-md mx-auto">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevSection}
            disabled={currentSection === 0}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              currentSection === 0
                ? 'bg-warm-gray-100 text-warm-gray-400 cursor-not-allowed'
                : 'bg-warm-gray-200 text-warm-gray-800 hover:bg-warm-gray-300'
            }`}
          >
            ← Prev
          </motion.button>
          <motion.span
            key={currentSection}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-sm font-semibold text-warm-gray-700 bg-white/50 px-4 py-2 rounded-full"
          >
            {currentSection + 1} / {chapters.length}
          </motion.span>
          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextSection}
            disabled={currentSection === chapters.length - 1}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              currentSection === chapters.length - 1
                ? 'bg-warm-gray-100 text-warm-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-rose-500 to-amber-500 text-white hover:shadow-lg glow'
            }`}
          >
            Next →
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
