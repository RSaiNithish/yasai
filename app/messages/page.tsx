'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { getMessages } from '@/lib/data';
import MessageCard from '@/components/messages/MessageCard';
import MessageModal from '@/components/messages/MessageModal';
import { Message } from '@/types';
import Link from 'next/link';
import { pageTransition, staggerContainer, textReveal, messageTransition, elegantEase } from '@/lib/animations';

export default function MessagesPage() {
  const allMessages = getMessages();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [visibleMessageIndex, setVisibleMessageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  // Sort messages by newest first
  const sortedMessages = useMemo(() => {
    return [...allMessages].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }, [allMessages]);

  // Update visible message based on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const sectionHeight = container.clientHeight;
      
      // Calculate which section is currently in view
      const currentSection = Math.round(scrollTop / sectionHeight);
      const newIndex = Math.min(
        Math.max(0, currentSection),
        sortedMessages.length - 1
      );
      
      if (newIndex !== visibleMessageIndex && newIndex >= 0 && newIndex < sortedMessages.length) {
        setVisibleMessageIndex(newIndex);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      // Initial check
      handleScroll();
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [sortedMessages.length, visibleMessageIndex]);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen bg-gradient-to-br from-neutral-50 via-rose-50/30 to-amber-50/20 relative overflow-hidden"
    >
      {/* Subtle animated background with refined colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 30%, rgba(244, 63, 94, 0.08), transparent 50%)',
              'radial-gradient(circle at 80% 70%, rgba(251, 191, 36, 0.06), transparent 50%)',
              'radial-gradient(circle at 50% 50%, rgba(244, 63, 94, 0.08), transparent 50%)',
            ],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0"
        />
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.06), transparent 50%)',
              'radial-gradient(circle at 20% 80%, rgba(244, 63, 94, 0.08), transparent 50%)',
              'radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.06), transparent 50%)',
            ],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0"
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 glass border-b border-white/20 px-8 py-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="text-lg font-semibold text-neutral-700 hover:text-neutral-900 transition-colors flex items-center gap-2">
              <motion.span
                animate={{ x: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                ←
              </motion.span>
              <span>Home</span>
            </Link>
          </motion.div>
          <div className="flex items-center gap-8">
            {['Journey', 'Videos', 'Surprise'].map((item) => (
              <motion.div
                key={item}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={`/${item.toLowerCase()}`}
                  className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium relative group text-sm uppercase tracking-wider"
                >
                  {item}
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-rose-500 to-amber-500 group-hover:w-full transition-all duration-300"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-16 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <motion.h1
            variants={textReveal}
            className="text-7xl md:text-8xl font-bold text-neutral-900 mb-6 tracking-tight"
          >
            Messages
          </motion.h1>
          <motion.p
            variants={textReveal}
            transition={{ delay: 0.2 }}
            className="text-xl text-neutral-600 font-light tracking-wide"
          >
            Wishes from friends & family
          </motion.p>
          <motion.div
            variants={textReveal}
            transition={{ delay: 0.4 }}
            className="mt-8 flex items-center justify-center gap-4"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 0.6, duration: 0.8, ease: elegantEase }}
              className="h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"
            />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-sm text-neutral-500 font-light"
            >
              {sortedMessages.length} {sortedMessages.length === 1 ? 'message' : 'messages'}
            </motion.span>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 0.6, duration: 0.8, ease: elegantEase }}
              className="h-px bg-gradient-to-l from-transparent via-neutral-300 to-transparent"
            />
          </motion.div>
        </motion.div>

        {/* Single Message View with Scroll */}
        <div
          ref={containerRef}
          className="relative h-[80vh] overflow-y-scroll scrollbar-hide snap-y snap-mandatory"
          style={{ scrollSnapType: 'y mandatory' }}
        >
          {sortedMessages.map((message, index) => {
            const isVisible = index === visibleMessageIndex;
            
            return (
              <section
                key={message.id}
                className="h-[80vh] snap-start snap-always flex items-center justify-center px-4"
              >
                <motion.div
                  variants={messageTransition}
                  initial="initial"
                  animate={isVisible ? "animate" : "exit"}
                  className="w-full max-w-5xl"
                >
                  {isVisible && (
                    <MessageCard
                      message={message}
                      onClick={() => setSelectedMessage(message)}
                      isFeatured
                    />
                  )}
                </motion.div>
              </section>
            );
          })}

          {sortedMessages.length === 0 && (
            <div className="h-[80vh] flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <p className="text-white/60 text-xl font-light mb-2">
                  No messages found
                </p>
                <p className="text-white/40 text-sm">
                  Try adjusting your filters
                </p>
              </motion.div>
            </div>
          )}
        </div>

        {/* Scroll Indicator */}
        {sortedMessages.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-neutral-500 text-sm font-light tracking-wider uppercase"
            >
              Scroll to see more
            </motion.div>
            <motion.div
              animate={{ scaleY: [1, 1.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-12 bg-gradient-to-b from-rose-400/60 via-amber-400/60 to-transparent"
            />
          </motion.div>
        )}

        {/* Progress Indicator */}
        {sortedMessages.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {sortedMessages.map((_, index) => (
              <motion.div
                key={index}
                className={`h-1 rounded-full transition-all ${
                  index === visibleMessageIndex
                    ? 'w-8 bg-gradient-to-r from-rose-500 to-amber-500'
                    : 'w-1 bg-neutral-300'
                }`}
                animate={{
                  width: index === visibleMessageIndex ? 32 : 4,
                  opacity: index === visibleMessageIndex ? 1 : 0.4,
                }}
                transition={{ duration: 0.4, ease: elegantEase }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <MessageModal
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />
    </motion.div>
  );
}