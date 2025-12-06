'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

interface ThenNowSliderProps {
  thenImage: string;
  nowImage: string;
  thenLabel?: string;
  nowLabel?: string;
}

export default function ThenNowSlider({ 
  thenImage, 
  nowImage, 
  thenLabel = 'Then',
  nowLabel = 'Now'
}: ThenNowSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const x = useMotionValue(sliderPosition);
  const width = useTransform(x, (value) => `${value}%`);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percentage = ((e.clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(0, Math.min(100, percentage));
    setSliderPosition(clamped);
    x.set(clamped);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const percentage = ((touch.clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(0, Math.min(100, percentage));
    setSliderPosition(clamped);
    x.set(clamped);
  };

  return (
    <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
      {/* Then Image (background) */}
      <div className="absolute inset-0">
        <Image
          src={thenImage}
          alt={thenLabel}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 left-4 bg-white/90 px-4 py-2 rounded-lg">
          <p className="text-warm-gray-800 font-semibold">{thenLabel}</p>
        </div>
      </div>

      {/* Now Image (foreground, clipped) */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={nowImage}
          alt={nowLabel}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 right-4 bg-white/90 px-4 py-2 rounded-lg">
          <p className="text-warm-gray-800 font-semibold">{nowLabel}</p>
        </div>
      </motion.div>

      {/* Slider Handle */}
      <div
        className="absolute inset-0 cursor-ew-resize"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        <motion.div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
          style={{ left: width }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-warm-gray-400 rounded-full" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
