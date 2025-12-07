'use client';

import { motion, useScroll, useTransform, useMotionValue, animate, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fadeIn, slideUp, staggerContainer, textReveal, messageTransition } from '@/lib/animations';
import { getMessages, getVideos, getAudios } from '@/lib/data';
import MessageCard from '@/components/messages/MessageCard';
import MessageModal from '@/components/messages/MessageModal';
import { Message, Video, Audio } from '@/types';

export default function Home() {
  const [password, setPassword] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState<Array<{ width: number; height: number; left: number; top: number; color: string; x: number; duration: number; delay: number }>>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [zoomTriggered, setZoomTriggered] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [visibleMessageIndex, setVisibleMessageIndex] = useState(0);
  const messagesScrollProgress = useMotionValue(0);
  const audioScrollProgress = useMotionValue(0);
  const sitePassword = process.env.NEXT_PUBLIC_SITE_PASSWORD || '';
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const audioSectionRef = useRef<HTMLDivElement>(null);
  const zoomProgress = useMotionValue(0);
  
  // Get messages, videos, and audio for embedded messages page
  const allMessages = getMessages();
  const allVideos = getVideos();
  const allAudios = getAudios();
  const sortedMessages = useMemo(() => {
    return [...allMessages].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }, [allMessages]);
  const { scrollYProgress } = useScroll({
    offset: ['start start', 'end end']
  });
  
      // Auto-complete zoom once scrolling starts
      useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (latest) => {
          if (latest > 0.1 && !zoomTriggered) {
            setZoomTriggered(true);
            // Smoothly animate to full zoom with very smooth easing - slower and smoother
            animate(zoomProgress, 1, {
              duration: 5,
              ease: [0.12, 0.8, 0.2, 1], // Slower, smoother cinematic easing
            });
          }
        });
        return () => unsubscribe();
      }, [scrollYProgress, zoomTriggered, zoomProgress]);
  
  // Combine scroll progress with auto zoom progress
  const combinedProgress = useTransform(
    [scrollYProgress, zoomProgress],
    ([scroll, auto]: [number, number]) => Math.max(scroll, auto)
  );

      // Phase 1: Landing page visible (0 to 0.1 scroll)
      const heroOpacity = useTransform(combinedProgress, [0, 0.08, 0.5], [1, 1, 0]);

      // Phase 2: Zoom into LOVE to reveal message (0.1 to 0.5 scroll) - much slower, more dramatic
      // The zoom should happen on the hero section, revealing the message behind it
      const heroZoom = useTransform(combinedProgress, 
        [0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5], 
        [1, 1.3, 1.7, 2.2, 2.8, 3.5, 4.3, 5.2, 6.5], 
        {
          clamp: true,
        }
      );
      const messageOpacity = useTransform(combinedProgress, 
        [0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5], 
        [0, 0.1, 0.2, 0.35, 0.5, 0.7, 0.85, 1]
      );
      
      // Add blur effect during zoom for more dramatic effect
      const heroBlur = useTransform(combinedProgress, [0.1, 0.3, 0.5], [0, 2, 0]);
      const heroBlurString = useTransform(heroBlur, (blur) => `blur(${blur}px)`);

      // Phase 3: Slide transition - message page left, messages from right (0.3 to 0.6 scroll)
      // Only based on scroll, not auto-complete
      const messagePageX = useTransform(scrollYProgress, [0.3, 0.45, 0.6], [0, -100, -100]);
      const messagesPageX = useTransform(scrollYProgress, [0.3, 0.45, 0.6], [100, 0, 0]);
  
  // Convert to percentage strings for CSS
  const messagePageXPercent = useTransform(messagePageX, (v) => `${v}%`);
  const messagesPageXPercent = useTransform(messagesPageX, (v) => `${v}%`);
  
      // LOVE stays visible during zoom
      const loveOpacity = useTransform(combinedProgress, [0, 0.1, 0.5], [1, 1, 0]);

  // Track scroll in messages container to update visible message and calculate scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!messagesContainerRef.current) return;
      const container = messagesContainerRef.current;
      const scrollTop = container.scrollTop;
      const sectionHeight = container.clientHeight;
      const totalHeight = sortedMessages.length * sectionHeight;
      
      // Calculate which section is currently in view
      const currentSection = Math.round(scrollTop / sectionHeight);
      const newIndex = Math.min(
        Math.max(0, currentSection),
        sortedMessages.length - 1
      );
      
      if (newIndex !== visibleMessageIndex && newIndex >= 0 && newIndex < sortedMessages.length) {
        setVisibleMessageIndex(newIndex);
      }
      
    // Calculate scroll progress (0 to 1, where 1 means scrolled past the last message)
    // Only reach 1.0 when user has scrolled past the last message
    const maxScroll = totalHeight - sectionHeight;
    const progress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;
    // Only set to 1.0 when we're actually past the last message
    const finalProgress = scrollTop >= maxScroll - 10 ? 1.0 : progress;
    messagesScrollProgress.set(finalProgress);
    };

    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [sortedMessages.length, visibleMessageIndex]);


  // Generate particles only on client side to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    const particleData = Array.from({ length: 50 }, (_, i) => ({
      width: Math.random() * 4 + 2,
      height: Math.random() * 4 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      color: i % 3 === 0 ? 'rgba(236, 72, 153, 0.5)' : i % 3 === 1 ? 'rgba(245, 158, 11, 0.5)' : 'rgba(255, 255, 255, 0.3)',
      x: Math.random() * 20 - 10,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
    }));
    setParticles(particleData);
  }, []);


  const handleBegin = () => {
    if (sitePassword && password !== sitePassword) {
      alert('Incorrect password');
      return;
    }
    router.push('/journey');
  };

  return (
    <div 
      ref={containerRef}
          className="min-h-[250vh] bg-gradient-to-br from-rose-50 via-amber-50 to-warm-gray-50 relative"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >



      {/* Landing Page - 25 Years of LOVE Yamini & Sai - Zooms in on scroll */}
      <motion.div
        style={{ 
          opacity: heroOpacity,
          scale: heroZoom,
          filter: heroBlurString,
          willChange: 'transform, opacity, filter',
          transformOrigin: 'center center',
        }}
        className="fixed inset-0 z-10 h-screen w-screen flex flex-col items-center justify-center px-4"
      >
        {/* Hero Text - 25 Years of Love - Cinematic Sequential Animation */}
        <div className="text-center flex flex-col justify-center h-full w-full relative">
          {/* 25 - First to appear with dramatic zoom */}
          <motion.div
            initial={{ opacity: 0, scale: 1.5, y: 50, filter: 'blur(30px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ 
              duration: 2, 
              delay: 0.5, 
              ease: [0.16, 1, 0.3, 1]
            }}
            className="mb-2 relative"
          >
            {/* Glow effect behind text */}
            <motion.div
              className="absolute inset-0 blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(244, 63, 94, 0.5) 0%, transparent 70%)',
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: [0, 0.8, 0.6, 0.8, 0.6],
                scale: [0.5, 1.2, 1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                delay: 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.h1
              className="font-black leading-none relative z-10"
              style={{
                fontSize: 'clamp(8rem, 25vw, 35vw)',
                background: 'linear-gradient(135deg, #ec4899 0%, #f59e0b 50%, #ec4899 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 80px rgba(236, 72, 153, 0.8))',
                lineHeight: '0.8',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                filter: [
                  'drop-shadow(0 0 80px rgba(236, 72, 153, 0.8))',
                  'drop-shadow(0 0 120px rgba(245, 158, 11, 0.9))',
                  'drop-shadow(0 0 80px rgba(236, 72, 153, 0.8))',
                ],
              }}
              transition={{
                backgroundPosition: { 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: 'linear',
                  delay: 2.5 
                },
                filter: {
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 2.5,
                },
              }}
            >
              25
            </motion.h1>
          </motion.div>

          {/* years of - Second to appear */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ 
              duration: 1.5, 
              delay: 1.5, 
              ease: [0.16, 1, 0.3, 1]
            }}
            className="mb-2 relative"
          >
            <motion.div
              className="flex items-baseline justify-center gap-2"
            >
              <motion.span
                className="font-semibold leading-none relative z-10"
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 8vw)',
                  color: 'rgba(120, 113, 108, 0.9)',
                  lineHeight: '0.8',
                  fontFamily: 'var(--font-dancing-script), "Brush Script MT", "Lucida Handwriting", cursive',
                }}
              >
                years
              </motion.span>
              <motion.span
                className="font-semibold leading-none relative z-10"
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 8vw)',
                  color: 'rgba(120, 113, 108, 0.9)',
                  lineHeight: '0.8',
                  fontFamily: 'var(--font-dancing-script), "Brush Script MT", "Lucida Handwriting", cursive',
                }}
              >
                of
              </motion.span>
            </motion.div>
          </motion.div>

          {/* LOVE - Second to appear with magical cinematic reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.3, y: 50, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ 
              duration: 3, 
              delay: 2.5, 
              ease: [0.16, 1, 0.3, 1],
            }}
            className="my-4 relative"
            style={{ perspective: '1000px' }}
          >
            {/* Enhanced particle burst effect */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  background: `radial-gradient(circle, ${
                    i % 2 === 0 ? 'rgba(236, 72, 153, 0.8)' : 'rgba(245, 158, 11, 0.8)'
                  } 0%, transparent 70%)`,
                  boxShadow: `0 0 20px ${
                    i % 2 === 0 ? 'rgba(236, 72, 153, 0.6)' : 'rgba(245, 158, 11, 0.6)'
                  }`,
                }}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0.8, 0],
                  scale: [0, 1.5, 1, 0],
                  x: Math.cos((i / 30) * Math.PI * 2) * 250,
                  y: Math.sin((i / 30) * Math.PI * 2) * 250,
                }}
                transition={{
                  duration: 2,
                  delay: 2.5 + i * 0.03,
                  ease: 'easeOut',
                }}
              />
            ))}


            {/* Glowing orb behind LOVE */}
            <motion.div
              className="absolute inset-0 blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, rgba(236, 72, 153, 0.3) 50%, transparent 80%)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.8, 0.6, 0.8, 0.6],
                scale: [0, 1.5, 1.2, 1.5, 1.2],
              }}
              transition={{
                duration: 4,
                delay: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Shimmer sweep effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-200/30 to-transparent"
              initial={{ x: '-200%', opacity: 0 }}
              animate={{
                x: ['-200%', '200%'],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: 5,
                repeat: Infinity,
                repeatDelay: 4,
                ease: 'easeInOut',
              }}
            />

            {/* LOVE text with enhanced dramatic effects - stays centered during zoom */}
            <motion.h2
              className="font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400 relative z-10"
              style={{
                fontSize: 'clamp(5rem, 15vw, 22vw)',
                backgroundSize: '200% 200%',
                filter: 'drop-shadow(0 0 100px rgba(244, 63, 94, 0.9))',
                lineHeight: '0.9',
                textShadow: '0 0 100px rgba(244, 63, 94, 0.5)',
                fontWeight: 900,
                WebkitTextStroke: '2px transparent',
                letterSpacing: '0.05em',
                opacity: loveOpacity,
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                filter: [
                  'drop-shadow(0 0 100px rgba(244, 63, 94, 0.9)) drop-shadow(0 0 180px rgba(236, 72, 153, 0.6)) drop-shadow(0 0 250px rgba(244, 63, 94, 0.4))',
                  'drop-shadow(0 0 150px rgba(244, 63, 94, 1)) drop-shadow(0 0 250px rgba(236, 72, 153, 0.8)) drop-shadow(0 0 350px rgba(244, 63, 94, 0.6))',
                  'drop-shadow(0 0 100px rgba(244, 63, 94, 0.9)) drop-shadow(0 0 180px rgba(236, 72, 153, 0.6)) drop-shadow(0 0 250px rgba(244, 63, 94, 0.4))',
                ],
                rotateY: [0, 8, -8, 5, -5, 0],
                rotateX: [0, 3, -3, 0],
              }}
              transition={{
                backgroundPosition: { 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: 'linear',
                  delay: 5 
                },
                filter: { 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: [0.4, 0, 0.2, 1],
                  delay: 5 
                },
                rotateY: {
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 5,
                },
                rotateX: {
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 5,
                },
              }}
            >
              LOVE
            </motion.h2>

            {/* Pulsing rings around LOVE */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 border-2 rounded-full"
                style={{
                  borderColor: i % 2 === 0 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(236, 72, 153, 0.3)',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: [0, 0.6, 0],
                  scale: [0.5, 2 + i * 0.5, 2.5 + i * 0.5],
                }}
                transition={{
                  duration: 3,
                  delay: 5 + i * 0.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: 'easeOut',
                }}
              />
            ))}
          </motion.div>

          {/* Yamini & Sai - Third to appear with cinematic slide */}
          <motion.div
            initial={{ opacity: 0, x: -100, filter: 'blur(20px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ 
              duration: 2, 
              delay: 4.5, 
              ease: [0.16, 1, 0.3, 1]
            }}
            className="mt-8 relative"
          >
            {/* Shimmer effect - one time only */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-200/30 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 1.5,
                delay: 4.5,
                ease: 'easeInOut',
              }}
            />
            <motion.p
              className="text-neutral-700 relative z-10"
              style={{
                fontSize: 'clamp(3rem, 8vw, 12vw)',
                fontFamily: 'var(--font-dancing-script), "Brush Script MT", "Lucida Handwriting", cursive',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}
            >
              Yamini & Sai
            </motion.p>
          </motion.div>
        </div>

        {/* Password Gate and Button - Positioned at bottom */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 flex flex-col items-center gap-6">
          {/* Password Gate (if enabled) */}
          {sitePassword && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="w-full"
            >
              <motion.input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleBegin()}
                whileFocus={{ scale: 1.02 }}
                className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border border-rose-300/50 rounded-xl text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                placeholder="Enter password"
              />
            </motion.div>
          )}

          {/* Begin Journey Button - Cinematic reveal */}
          <motion.button
            initial={{ opacity: 0, y: 30, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, delay: 6.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.08, y: -8 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={handleBegin}
            className="relative px-12 py-6 bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 rounded-full text-white font-bold text-xl md:text-2xl shadow-2xl overflow-hidden group"
            style={{
              backgroundSize: '200% 200%',
            }}
            animate={{
              backgroundPosition: isHovering ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%',
              boxShadow: isHovering
                ? '0 25px 80px rgba(244, 63, 94, 0.8), 0 0 60px rgba(251, 191, 36, 0.6), 0 0 100px rgba(244, 63, 94, 0.4)'
                : '0 15px 50px rgba(244, 63, 94, 0.5), 0 0 30px rgba(251, 191, 36, 0.3)',
            }}
            transition={{
              backgroundPosition: { duration: 2, repeat: Infinity, ease: 'linear' },
              boxShadow: { duration: 0.4 },
            }}
          >
            <span className="relative z-10 flex items-center gap-3">
              Begin the Journey
              <motion.span
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-amber-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
            {/* Shine sweep on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              initial={{ x: '-100%' }}
              animate={isHovering ? { x: '100%' } : { x: '-100%' }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          </motion.button>
        </div>

        {/* Scroll indicator - Cinematic reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 7.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.p
            className="text-sm text-neutral-500 uppercase tracking-wider"
            animate={{ opacity: [0.4, 1, 0.6, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            Scroll
          </motion.p>
          <motion.div
            animate={{ 
              y: [0, 12, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-12 bg-gradient-to-b from-rose-400 via-amber-400 to-transparent"
          />
        </motion.div>
      </motion.div>

      {/* Message from daughters - Revealed by zoom into LOVE, then slides left */}
      <motion.div
        style={{
          opacity: messageOpacity,
          x: messagePageXPercent,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        className="fixed inset-0 z-0 w-full h-screen flex flex-col items-center justify-center px-4 overflow-y-auto scrollbar-hide"
      >
        {/* Subtle background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating orbs */}
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 rounded-full bg-rose-200/20 blur-3xl"
            animate={{
              y: [0, 30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-amber-200/20 blur-3xl"
            animate={{
              y: [0, -30, 0],
              x: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          />
          <motion.div
            className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-rose-100/15 blur-3xl"
            animate={{
              y: [0, 20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
          />
        </div>

        <div className="max-w-4xl w-full relative z-10 flex items-center justify-center min-h-screen px-6 md:px-8">
          {/* Daughters' Message - Only visible when zooming */}
          <motion.div
            style={{
              opacity: messageOpacity,
            }}
            className="w-full text-center space-y-12 md:space-y-16"
          >
            {/* Greeting */}
            <p
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-neutral-700 mb-4"
              style={{
                fontFamily: 'var(--font-dancing-script), "Brush Script MT", "Lucida Handwriting", cursive',
                letterSpacing: '0.02em',
              }}
            >
              To our beloved parents,
            </p>

            {/* Anniversary Wish */}
            <p
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-neutral-800 mb-8 md:mb-10"
            >
              Happiest 25th Anniversary.
            </p>

            {/* Main Message */}
            <div
              className="space-y-6 md:space-y-8 text-xl md:text-2xl lg:text-3xl text-neutral-700 leading-relaxed md:leading-loose font-light"
            >
              <p className="px-2">
                May you continue you to lead many more years of love laughter and bliss together. Your journey has been a true inspiration to us. Thank you for being so unconditional and teaching us your values and bringing us up in the best way possible. You have given us the best life and we are truly thankful to Swami for choosing you both as our parents. We wish pray and hope that in every birth we take, we share this journey with you all over again!
              </p>
            </div>

            {/* Signature */}
            <p
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-neutral-700 pt-8 md:pt-10 mt-10 md:mt-12"
              style={{
                fontFamily: 'var(--font-dancing-script), "Brush Script MT", "Lucida Handwriting", cursive',
                letterSpacing: '0.02em',
              }}
            >
              Love Krupa and Kumari
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Messages Page - Slides in from right */}
      <motion.div
        style={{
          x: messagesPageXPercent,
        }}
        className="fixed inset-0 z-30 h-screen w-screen bg-gradient-to-br from-neutral-50 via-rose-50/30 to-amber-50/20 overflow-y-auto scrollbar-hide"
      >
        {/* Messages Page Background */}
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

        {/* Messages Page Header - Hidden */}
        <motion.header
          className="sticky top-0 z-50 glass border-b border-white/20 px-8 py-6 hidden"
          style={{ display: 'none' }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold text-neutral-700 hover:text-neutral-900 transition-colors flex items-center gap-2">
              ← Home
            </Link>
            <div className="flex items-center gap-8">
              {['Journey', 'Videos', 'Surprise'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium text-sm uppercase tracking-wider"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </motion.header>

        {/* Messages Page Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-16 min-h-full flex flex-col items-center">
          <motion.div 
            className="text-center mb-16 w-full"
          >
            <motion.h1
              className="text-7xl md:text-8xl font-bold text-neutral-900 mb-6 tracking-tight"
            >
              Messages
            </motion.h1>
            <motion.p
              className="text-xl text-neutral-600 font-light tracking-wide"
            >
              Wishes from friends & family
            </motion.p>
          </motion.div>

          {/* Messages List - Same structure as messages page */}
          <motion.div
            ref={messagesContainerRef}
            className="relative h-[80vh] overflow-y-scroll scrollbar-hide snap-y snap-mandatory w-full max-w-6xl"
            style={{ 
              scrollSnapType: 'y mandatory',
            }}
          >
            {sortedMessages.map((message, index) => {
              const isVisible = index === visibleMessageIndex;
              
              return (
                <section
                  key={message.id}
                  className="h-[80vh] snap-start snap-always flex items-center justify-center px-2 md:px-4 w-full"
                >
                  <motion.div
                    variants={messageTransition}
                    initial="initial"
                    animate={isVisible ? "animate" : "exit"}
                    className="w-full max-w-6xl mx-auto"
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
                  <p className="text-neutral-500 text-xl font-light mb-2">
                    No messages found
                  </p>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Progress Indicator */}
          {sortedMessages.length > 1 && (
            <motion.div 
              className="mt-8 flex items-center justify-center gap-2"
            >
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
                  transition={{ duration: 0.4 }}
                />
              ))}
            </motion.div>
          )}

          {/* Audio & Video Messages Section - Combined, After Text Messages */}
          {((allAudios && allAudios.length > 0) || (allVideos && allVideos.length > 0)) && (
            <motion.div
              ref={audioSectionRef}
              className="mt-16 md:mt-20 mb-24 w-full max-w-6xl"
              style={{
                opacity: useTransform(messagesScrollProgress, (v) => {
                  // Only reveal when messages are completely done (at 1.0 progress)
                  return v >= 1.0 ? 1 : 0;
                }),
                pointerEvents: useTransform(messagesScrollProgress, (v) => {
                  // Disable interaction until messages are done
                  return v >= 1.0 ? 'auto' : 'none';
                }),
              }}
            >
              {/* Audio Messages */}
              {allAudios && allAudios.length > 0 && (
                <div className="mb-24 md:mb-32">
                  <motion.div
                    className="text-center mb-16 md:mb-20 w-full"
                  >
                    <motion.h2
                      className="text-6xl md:text-7xl font-bold text-neutral-900 mb-6 tracking-tight"
                    >
                      Audio Messages
                    </motion.h2>
                    <motion.p
                      className="text-xl text-neutral-600 font-light"
                    >
                      Voice wishes from loved ones
                    </motion.p>
                  </motion.div>

                  {/* Audio Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {allAudios.map((audio, index) => (
                      <motion.div
                        key={audio.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                        className="flex-shrink-0 w-full"
                      >
                        <div className="glass-soft rounded-3xl border border-white/30 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group p-8 md:p-10 w-full">
                          {/* Audio Player */}
                          <div className="w-full">
                            <audio
                              controls
                              className="w-full"
                              preload="metadata"
                            >
                              <source src={encodeURI(audio.audioUrl)} type="audio/mpeg" />
                              <source src={encodeURI(audio.audioUrl)} type="audio/mp3" />
                              <source src={encodeURI(audio.audioUrl)} type="audio/wav" />
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Messages */}
              {allVideos && allVideos.length > 0 && (
                <div>
                  <motion.div
                    className="text-center mb-16 md:mb-20 w-full"
                  >
                    <motion.h2
                      className="text-6xl md:text-7xl font-bold text-neutral-900 mb-6 tracking-tight"
                    >
                      Video Messages
                    </motion.h2>
                    <motion.p
                      className="text-xl text-neutral-600 font-light"
                    >
                      Wishes from loved ones
                    </motion.p>
                  </motion.div>

                  {/* Video Cards Grid - Bigger cards, video only */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {allVideos.map((video, index) => (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                        className="flex-shrink-0"
                      >
                        <div className="glass-soft rounded-3xl border border-white/30 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                          {/* Video Player - Handles both vertical and horizontal, bigger */}
                          <div className="relative w-full bg-black flex items-center justify-center overflow-hidden">
                            {video.videoUrl ? (
                              <video
                                className="w-full h-auto max-h-[600px] object-contain"
                                controls
                                preload="metadata"
                                poster={video.thumbnail || undefined}
                                style={{ 
                                  maxWidth: '100%',
                                  height: 'auto',
                                }}
                              >
                                <source src={encodeURI(video.videoUrl)} type="video/mp4" />
                                <source src={encodeURI(video.videoUrl)} type="video/webm" />
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              <div className="relative w-full aspect-video bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center overflow-hidden min-h-[400px]">
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-200/20 to-amber-200/20" />
                                <motion.div
                                  whileHover={{ scale: 1.15 }}
                                  className="relative z-10 w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg"
                                >
                                  <svg
                                    className="w-10 h-10 text-rose-500 ml-1"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </motion.div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Message Modal */}
        <MessageModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      </motion.div>
    </div>
  );
}
