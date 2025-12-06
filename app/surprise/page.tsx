'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import SurpriseButton from '@/components/surprise/SurpriseButton';
import FinalMontage from '@/components/surprise/FinalMontage';
import Link from 'next/link';
import { fadeIn } from '@/lib/animations';

export default function SurprisePage() {
  const [hasCelebrated, setHasCelebrated] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-warm-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-warm-gray-200 px-8 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-warm-gray-800 hover:text-rose-500 transition-colors">
            ← Home
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/journey" className="text-warm-gray-700 hover:text-rose-500 transition-colors">
              Journey
            </Link>
            <Link href="/messages" className="text-warm-gray-700 hover:text-rose-500 transition-colors">
              Messages
            </Link>
            <Link href="/videos" className="text-warm-gray-700 hover:text-rose-500 transition-colors">
              Videos
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {!hasCelebrated ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-8 py-12"
        >
          <div className="text-center space-y-8 max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-8xl font-bold text-warm-gray-800"
            >
              Surprise!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl text-warm-gray-600"
            >
              You've reached the end of our journey together
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-warm-gray-500"
            >
              Click the button below to celebrate 25 years of love, laughter, and beautiful memories
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
            >
              <SurpriseButton onCelebrate={() => setHasCelebrated(true)} />
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <FinalMontage hasCelebrated={hasCelebrated} />
      )}
    </div>
  );
}
