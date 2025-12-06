'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Video } from '@/types';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';

interface VideoLightboxProps {
  video: Video | null;
  onClose: () => void;
}

export default function VideoLightbox({ video, onClose }: VideoLightboxProps) {
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <AnimatePresence>
      {video && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50"
          />

          {/* Lightbox */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-5xl z-50 bg-black rounded-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Player */}
            <div className="relative w-full aspect-video bg-black">
              <video
                src={video.videoUrl}
                controls
                className="w-full h-full"
                autoPlay
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Info */}
            <div className="bg-white p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-warm-gray-800 mb-1">
                    {video.author}
                  </h2>
                  <p className="text-warm-gray-600">{formatDate(video.date)}</p>
                </div>
                {video.transcript && (
                  <button
                    onClick={() => setShowTranscript(!showTranscript)}
                    className="px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors"
                  >
                    {showTranscript ? 'Hide' : 'Show'} Transcript
                  </button>
                )}
              </div>

              {/* Transcript */}
              {showTranscript && video.transcript && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-warm-gray-50 rounded-lg border border-warm-gray-200"
                >
                  <p className="text-warm-gray-700 leading-relaxed whitespace-pre-wrap">
                    {video.transcript}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
