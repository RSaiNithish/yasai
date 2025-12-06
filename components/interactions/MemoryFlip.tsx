'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

interface MemoryFlipProps {
  frontImage: string;
  backText: string;
  frontLabel?: string;
}

export default function MemoryFlip({ frontImage, backText, frontLabel = 'Click to flip' }: MemoryFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="perspective-1000 w-full h-64 md:h-80"
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        whileHover={{ scale: 1.05 }}
        transition={{ 
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        style={{ transformStyle: 'preserve-3d' }}
        onClick={() => setIsFlipped(!isFlipped)}
        onKeyDown={(e) => e.key === 'Enter' && setIsFlipped(!isFlipped)}
        tabIndex={0}
        role="button"
        aria-label="Flip memory card"
      >
        {/* Front */}
        <motion.div
          className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl"
          style={{ backfaceVisibility: 'hidden' }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative w-full h-full">
            <Image
              src={frontImage}
              alt={frontLabel}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/20 flex items-center justify-center backdrop-blur-sm">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white font-bold text-xl md:text-2xl drop-shadow-lg text-center px-4"
              >
                {frontLabel}
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Back */}
        <motion.div
          className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-rose-50 via-amber-50 to-rose-50 p-8 flex items-center justify-center shadow-2xl"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
          whileHover={{ scale: 1.02 }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-warm-gray-800 text-center text-lg md:text-xl leading-relaxed font-medium"
          >
            {backText}
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
