'use client';

import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface SurpriseButtonProps {
  onCelebrate: () => void;
}

export default function SurpriseButton({ onCelebrate }: SurpriseButtonProps) {
  const handleClick = () => {
    // Confetti animation
    const duration = 3000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f43f5e', '#fbbf24', '#95e1d3', '#c7ceea'],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f43f5e', '#fbbf24', '#95e1d3', '#c7ceea'],
      });
    }, 25);

    // Burst confetti
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fbbf24', '#95e1d3', '#c7ceea'],
      });
    }, 500);

    onCelebrate();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="px-12 py-6 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 text-white text-2xl font-bold rounded-full shadow-2xl hover:shadow-rose-500/50 transition-all duration-300 animate-pulse"
    >
      Click to Celebrate! 🎉
    </motion.button>
  );
}
