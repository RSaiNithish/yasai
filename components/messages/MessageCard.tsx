'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Message } from '@/types';
import { useState, useEffect } from 'react';

interface MessageCardProps {
  message: Message;
  onClick: () => void;
  isFeatured?: boolean;
}

export default function MessageCard({ message, onClick, isFeatured = false }: MessageCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
  const tiltRotateY = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
  
  // Flip rotation with spring animation
  const flipRotation = useSpring(useMotionValue(0), { stiffness: 100, damping: 20 });
  
  // Combine flip rotation with tilt rotation
  const finalRotateY = useTransform(
    [flipRotation, tiltRotateY],
    ([flip, tilt]) => flip + tilt
  );

  // Reset flip state when message changes
  useEffect(() => {
    setIsFlipped(false);
    flipRotation.set(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message.id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;

    mouseX.set(x);
    mouseY.set(y);
    rotateX.set(y / 25);
    // When flipped, reverse the Y rotation to account for the 180deg flip
    tiltRotateY.set(isFlipped ? x / 25 : -x / 25);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    tiltRotateY.set(0);
    setIsHovered(false);
  };

  const handleClick = () => {
    // Toggle flip state and update rotation
    const newFlippedState = !isFlipped;
    setIsFlipped(newFlippedState);
    flipRotation.set(newFlippedState ? 180 : 0);
  };

  return (
    <div className="perspective-1000 w-full max-w-6xl h-full flex items-center justify-center">
      <motion.div
        className="relative w-full cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ 
          transformStyle: 'preserve-3d',
          height: '100%',
          maxHeight: '100%',
          minHeight: '500px',
          rotateX: rotateX,
          rotateY: finalRotateY,
        }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={handleClick}
      >
        {/* Front - Message Only */}
        <motion.div
          className="absolute inset-0 backface-hidden glass-soft rounded-3xl border border-white/30 shadow-2xl w-full h-full flex flex-col"
          style={{ 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            overflow: 'hidden',
            maxHeight: '100%',
            paddingBottom: '0.5rem',
          }}
          animate={isHovered && !isFlipped ? {
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5)',
          } : {}}
          transition={{ duration: 0.3 }}
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 opacity-20 pointer-events-none"
            animate={{
              background: [
                'radial-gradient(circle at 0% 0%, rgba(244, 63, 94, 0.3), transparent)',
                'radial-gradient(circle at 100% 100%, rgba(251, 191, 36, 0.3), transparent)',
                'radial-gradient(circle at 0% 0%, rgba(244, 63, 94, 0.3), transparent)',
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          />

          {/* Message Text Only - Scrollable */}
          <div 
            className="relative z-10 overflow-y-auto scrollbar-hide" 
            style={{ 
              padding: '4rem 5rem',
              paddingBottom: '5rem',
              WebkitOverflowScrolling: 'touch',
              height: '100%',
              maxHeight: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center justify-center min-h-full py-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center w-full"
              >
                <motion.p
                  className="text-neutral-700 text-2xl md:text-3xl leading-relaxed font-light whitespace-pre-line"
                  style={{ 
                    wordBreak: 'break-word',
                    lineHeight: '1.8',
                    paddingBottom: '0.5em',
                    textAlign: 'center',
                  }}
                >
                  {message.text}
                </motion.p>
                
                {/* Click hint */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-12 flex items-center justify-center gap-2 text-neutral-400 text-sm font-light flex-shrink-0"
                >
                  <span>Click to reveal sender</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Decorative elements - enhanced on hover */}
          <motion.div
            animate={isHovered && !isFlipped ? {
              scale: 1.2,
              opacity: 0.4,
            } : {
              scale: 1,
              opacity: 0.2,
            }}
            transition={{ duration: 0.4 }}
            className="absolute top-0 right-0 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={isHovered && !isFlipped ? {
              scale: 1.2,
              opacity: 0.4,
            } : {
              scale: 1,
              opacity: 0.2,
            }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-0 left-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl"
          />
        </motion.div>

        {/* Back - Name Only */}
        <motion.div
          className="absolute inset-0 backface-hidden glass-soft rounded-3xl border border-white/30 shadow-2xl overflow-hidden w-full h-full"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          animate={isHovered && isFlipped ? {
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5)',
          } : {}}
          transition={{ duration: 0.3 }}
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                'radial-gradient(circle at 100% 100%, rgba(251, 191, 36, 0.3), transparent)',
                'radial-gradient(circle at 0% 0%, rgba(244, 63, 94, 0.3), transparent)',
                'radial-gradient(circle at 100% 100%, rgba(251, 191, 36, 0.3), transparent)',
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          />

          {/* Name Only */}
          <div className="relative z-10 flex items-center justify-center h-full" style={{ padding: '6rem 5rem' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center"
            >
              <motion.h3
                className="text-5xl md:text-7xl font-bold text-gradient mb-8"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {message.author}
              </motion.h3>
              
            </motion.div>
          </div>

          {/* Decorative elements - enhanced on hover */}
          <motion.div
            animate={isHovered && isFlipped ? {
              scale: 1.2,
              opacity: 0.4,
            } : {
              scale: 1,
              opacity: 0.2,
            }}
            transition={{ duration: 0.4 }}
            className="absolute top-0 right-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={isHovered && isFlipped ? {
              scale: 1.2,
              opacity: 0.4,
            } : {
              scale: 1,
              opacity: 0.2,
            }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-0 left-0 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl"
          />
        </motion.div>

        {/* Enhanced glow effect on hover */}
        {isFeatured && (
          <motion.div
            animate={isHovered ? {
              opacity: 0.3,
              scale: 1.05,
            } : {
              opacity: 0,
              scale: 1,
            }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-gradient-to-r from-rose-500/30 to-amber-500/30 rounded-3xl blur-3xl -z-10"
          />
        )}

        {/* Border glow on hover */}
        <motion.div
          animate={isHovered ? {
            opacity: 1,
          } : {
            opacity: 0,
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-3xl border-2 border-rose-400/30 pointer-events-none -z-10"
        />
      </motion.div>
    </div>
  );
}