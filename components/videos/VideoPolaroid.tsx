'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';
import { Video } from '@/types';
import { formatDateShort, formatDuration } from '@/lib/utils';
import { hoverLift, hoverGlow } from '@/lib/animations';
import { useState, useRef } from 'react';

interface VideoPolaroidProps {
  video: Video;
  onClick: () => void;
  isHovered?: boolean;
}

export default function VideoPolaroid({ video, onClick, isHovered = false }: VideoPolaroidProps) {
  const [isLocalHovered, setIsLocalHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    
    mouseX.set(x);
    mouseY.set(y);
    rotateX.set(y / 15);
    rotateY.set(-x / 15);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setIsLocalHovered(false);
  };

  const hovered = isHovered || isLocalHovered;
  const rotation = Math.random() * 4 - 2; // Random rotation between -2 and 2 degrees

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsLocalHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ 
        ...hoverLift, 
        ...hoverGlow,
        scale: 1.08,
        z: 50,
      }}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transform: `rotate(${rotation}deg)`,
      }}
      className="relative cursor-pointer"
    >
      {/* Polaroid Frame */}
      <div className="bg-white p-4 md:p-6 shadow-2xl relative overflow-hidden">
        {/* Polaroid texture overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              currentColor 2px,
              currentColor 4px
            )`,
          }}
        />

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
          initial={{ x: '-100%' }}
          animate={hovered ? { x: '100%' } : { x: '-100%' }}
          transition={{ duration: 0.8 }}
        />

        {/* Image Container */}
        <motion.div 
          className="relative w-full aspect-[4/3] mb-4 bg-gradient-to-br from-warm-gray-200 to-warm-gray-300 rounded overflow-hidden group"
          whileHover={{ scale: 1.02 }}
        >
          <Image
            src={video.thumbnail}
            alt={video.author}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play Button Overlay with Animation */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm group-hover:bg-black/20 transition-colors duration-300"
            animate={hovered ? {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            } : {}}
          >
            <motion.div
              className="w-20 h-20 md:w-24 md:h-24 bg-white/95 rounded-full flex items-center justify-center shadow-2xl group-hover:bg-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={hovered ? {
                boxShadow: [
                  '0 0 0px rgba(244, 63, 94, 0.5)',
                  '0 0 30px rgba(244, 63, 94, 0.8)',
                  '0 0 0px rgba(244, 63, 94, 0.5)',
                ],
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <motion.svg
                className="w-10 h-10 md:w-12 md:h-12 text-rose-500 ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
                animate={hovered ? {
                  x: [0, 3, 0],
                } : {}}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                <path d="M8 5v14l11-7z" />
              </motion.svg>
            </motion.div>
          </motion.div>

          {/* Duration Badge */}
          <motion.div
            className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-semibold"
            whileHover={{ scale: 1.1 }}
          >
            {formatDuration(video.durationSec)}
          </motion.div>

          {/* Play indicator on hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={hovered ? { opacity: 1 } : { opacity: 0 }}
            className="absolute top-3 left-3 bg-rose-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1"
          >
            <motion.span
              animate={hovered ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              ▶
            </motion.span>
            Play
          </motion.div>
        </motion.div>

        {/* Info Section with Enhanced Design */}
        <div className="text-center space-y-2">
          <motion.h3
            whileHover={{ scale: 1.05 }}
            className="font-bold text-warm-gray-800 text-lg md:text-xl"
          >
            {video.author}
          </motion.h3>
          <motion.p
            whileHover={{ scale: 1.05 }}
            className="text-xs md:text-sm text-warm-gray-500 font-medium"
          >
            {formatDateShort(video.date)}
          </motion.p>
        </div>

        {/* Polaroid bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-warm-gray-200 to-transparent" />

        {/* Decorative tape corners */}
        <div className="absolute -top-2 -left-2 w-8 h-8 bg-amber-200/60 rotate-45 opacity-60" />
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-rose-200/60 rotate-45 opacity-60" />
      </div>

      {/* Shadow underneath */}
      <motion.div
        className="absolute inset-0 bg-black/20 blur-xl -z-10 rounded-lg"
        animate={hovered ? {
          scale: 1.2,
          opacity: 0.4,
        } : {
          scale: 1,
          opacity: 0.2,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}