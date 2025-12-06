'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { getChapters } from '@/lib/data';
import { staggerContainer, parallaxVariants } from '@/lib/animations';

interface FinalMontageProps {
  hasCelebrated: boolean;
}

export default function FinalMontage({ hasCelebrated }: FinalMontageProps) {
  const chapters = getChapters();
  const allPhotos = chapters.flatMap(ch => ch.photos).slice(0, 12);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-rose-100 via-amber-100 to-warm-gray-100 p-8">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={hasCelebrated ? 'visible' : 'hidden'}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {allPhotos.map((photo, index) => (
          <motion.div
            key={index}
            variants={parallaxVariants}
            className="relative aspect-square rounded-lg overflow-hidden shadow-xl"
            style={{
              transform: `rotate(${(index % 3 - 1) * 5}deg)`,
            }}
          >
            <Image
              src={photo || '/images/placeholder-1.jpg'}
              alt={`Memory ${index + 1}`}
              fill
              className="object-cover"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Overlay Message */}
      {hasCelebrated && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black/40"
        >
          <div className="text-center text-white px-8 max-w-3xl">
            <motion.h2
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5, type: 'spring' }}
              className="text-6xl md:text-8xl font-bold mb-6"
            >
              25 Years
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="text-2xl md:text-4xl mb-4"
            >
              Here's to 25 years and many more!
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="text-xl md:text-2xl"
            >
              Thank you for being part of our journey.
            </motion.p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
