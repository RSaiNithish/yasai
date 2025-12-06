'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Chapter } from '@/types';
import MemoryFlip from '@/components/interactions/MemoryFlip';
import ThenNowSlider from '@/components/interactions/ThenNowSlider';
import QuizPop from '@/components/interactions/QuizPop';
import { parallaxVariants, fadeInOnScroll, pageTransition } from '@/lib/animations';

interface JourneyCanvasProps {
  chapter: Chapter;
}

export default function JourneyCanvas({ chapter }: JourneyCanvasProps) {
  const renderInteraction = () => {
    switch (chapter.interactionType) {
      case 'flip':
        return (
          <MemoryFlip
            frontImage={chapter.photos[0] || '/images/placeholder-1.jpg'}
            backText={chapter.text}
            frontLabel={chapter.title}
          />
        );
      case 'slider':
        return (
          <ThenNowSlider
            thenImage={chapter.photos[0] || '/images/placeholder-1.jpg'}
            nowImage={chapter.photos[1] || chapter.photos[0] || '/images/placeholder-2.jpg'}
            thenLabel="Then"
            nowLabel="Now"
          />
        );
      case 'quiz':
        return chapter.quiz ? (
          <QuizPop
            question={chapter.quiz.question}
            options={chapter.quiz.options}
            answerIndex={chapter.quiz.answerIndex}
          />
        ) : null;
      default:
        return null;
    }
  };

  const renderLayout = () => {
    switch (chapter.layoutHint) {
      case 'full-bleed':
        return (
          <div className="w-full h-full relative">
            {chapter.photos[0] && (
              <Image
                src={chapter.photos[0]}
                alt={chapter.title}
                fill
                className="object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center text-white px-8">
                <h2 className="text-4xl font-bold mb-4">{chapter.title}</h2>
                {chapter.place && (
                  <p className="text-xl opacity-90">{chapter.place}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'two-column-left':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            <div className="relative h-64 md:h-full">
              {chapter.photos[0] && (
                <Image
                  src={chapter.photos[0]}
                  alt={chapter.title}
                  fill
                  className="object-cover rounded-lg"
                />
              )}
            </div>
            <div className="flex flex-col justify-center space-y-4">
              {chapter.photos.slice(1).map((photo, idx) => (
                <div key={idx} className="relative h-32">
                  <Image
                    src={photo}
                    alt={`${chapter.title} ${idx + 2}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'two-column-right':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            <div className="flex flex-col justify-center space-y-4">
              {chapter.photos.slice(0, -1).map((photo, idx) => (
                <div key={idx} className="relative h-32">
                  <Image
                    src={photo}
                    alt={`${chapter.title} ${idx + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
            <div className="relative h-64 md:h-full">
              {chapter.photos[chapter.photos.length - 1] && (
                <Image
                  src={chapter.photos[chapter.photos.length - 1]}
                  alt={chapter.title}
                  fill
                  className="object-cover rounded-lg"
                />
              )}
            </div>
          </div>
        );

      case 'centered':
      default:
        return (
          <div className="flex flex-col items-center justify-center space-y-6 h-full">
            {chapter.photos.map((photo, idx) => (
              <motion.div
                key={idx}
                variants={fadeInOnScroll}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative w-full max-w-2xl h-64 md:h-96 group cursor-pointer"
              >
                <motion.div
                  whileHover={{ boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}
                  className="relative w-full h-full rounded-2xl overflow-hidden"
                >
                  <Image
                    src={photo}
                    alt={`${chapter.title} ${idx + 1}`}
                    fill
                    className="object-cover rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        );
    }
  };

  return (
    <motion.div
      key={chapter.id}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="w-full h-full relative overflow-hidden"
    >
      {/* Main Visual Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={chapter.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          {chapter.interactionType !== 'none' && chapter.interactionType !== 'quiz' ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full h-full flex items-center justify-center p-8"
            >
              {renderInteraction()}
            </motion.div>
          ) : (
            renderLayout()
          )}
        </motion.div>
      </AnimatePresence>

      {/* Quiz overlay */}
      {chapter.interactionType === 'quiz' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 z-10"
        >
          {renderInteraction()}
        </motion.div>
      )}
    </motion.div>
  );
}
