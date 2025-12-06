'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface QuizPopProps {
  question: string;
  options: string[];
  answerIndex: number;
}

export default function QuizPop({ question, options, answerIndex }: QuizPopProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    setShowResult(true);
  };

  const isCorrect = selectedIndex === answerIndex;

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-warm-gray-800 mb-4">{question}</h3>
        
        <div className="space-y-2">
          {options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => !showResult && handleSelect(index)}
              disabled={showResult}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                showResult
                  ? index === answerIndex
                    ? 'bg-green-100 border-green-500'
                    : selectedIndex === index
                    ? 'bg-red-100 border-red-500'
                    : 'bg-warm-gray-50 border-warm-gray-200'
                  : 'bg-warm-gray-50 border-warm-gray-200 hover:border-rose-400 hover:bg-rose-50'
              }`}
            >
              <span className="text-warm-gray-800">{option}</span>
              {showResult && index === answerIndex && (
                <span className="ml-2 text-green-600 font-semibold">✓</span>
              )}
              {showResult && selectedIndex === index && index !== answerIndex && (
                <span className="ml-2 text-red-600 font-semibold">✗</span>
              )}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`mt-4 p-4 rounded-lg ${
                isCorrect ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
              }`}
            >
              <p className="font-semibold">
                {isCorrect ? '🎉 Correct! Well done!' : `Not quite! The correct answer is: ${options[answerIndex]}`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
