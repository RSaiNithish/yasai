'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getVideos } from '@/lib/data';
import VideoPolaroid from '@/components/videos/VideoPolaroid';
import VideoLightbox from '@/components/videos/VideoLightbox';
import { Video } from '@/types';
import Link from 'next/link';
import { pageTransition, staggerContainer, textReveal, fadeInOnScroll } from '@/lib/animations';

export default function VideosPage() {
  const videos = getVideos();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-warm-gray-50 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{
              background: i % 3 === 0
                ? 'radial-gradient(circle, rgba(244, 63, 94, 0.4), transparent)'
                : i % 3 === 1
                ? 'radial-gradient(circle, rgba(251, 191, 36, 0.4), transparent)'
                : 'radial-gradient(circle, rgba(149, 225, 211, 0.3), transparent)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, 100, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 25 + Math.random() * 15,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 glass border-b border-white/20 px-8 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="text-xl font-bold text-warm-gray-800 hover:text-rose-500 transition-colors flex items-center gap-2">
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
            {['Journey', 'Messages', 'Surprise'].map((item) => (
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
            className="text-6xl md:text-8xl font-bold text-gradient mb-6 drop-shadow-lg"
          >
            Video Messages
          </motion.h1>
          <motion.p
            variants={textReveal}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl text-warm-gray-600 font-light mb-4"
          >
            Heartfelt messages from friends and family
          </motion.p>
          <motion.div
            variants={textReveal}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-3"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-3xl"
            >
              🎬
            </motion.div>
            <span className="text-sm text-warm-gray-500 font-medium">
              {videos.length} {videos.length === 1 ? 'video' : 'videos'}
            </span>
            <motion.div
              animate={{ scale: [1, 1.3, 1], rotate: [360, 180, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-3xl"
            >
              💝
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Video Grid with Masonry-like Layout */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10"
        >
          <AnimatePresence mode="popLayout">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                layout
                variants={fadeInOnScroll}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, margin: "-100px" }}
                onHoverStart={() => setHoveredVideo(video.id)}
                onHoverEnd={() => setHoveredVideo(null)}
                transition={{
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 100,
                }}
                className="relative"
                style={{
                  transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)`,
                }}
              >
                <VideoPolaroid
                  video={video}
                  onClick={() => setSelectedVideo(video)}
                  isHovered={hoveredVideo === video.id}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {videos.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl mb-6"
            >
              📹
            </motion.div>
            <p className="text-warm-gray-700 text-xl font-medium mb-2">
              No video messages available yet.
            </p>
            <p className="text-warm-gray-500">
              Check back soon for heartfelt video messages!
            </p>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <VideoLightbox
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </motion.div>
  );
}