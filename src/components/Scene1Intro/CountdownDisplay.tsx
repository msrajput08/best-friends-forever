import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CountdownDisplayProps {
  countdown: number;
  isVisible: boolean;
}

export const CountdownDisplay: React.FC<CountdownDisplayProps> = ({
  countdown,
  isVisible,
}) => {
  if (!isVisible || countdown < 0) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={countdown}
          initial={{ opacity: 0, scale: 0.6, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.4, filter: 'blur(12px)' }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative flex items-center justify-center"
        >
          {/* Subtle glowing halo behind digit */}
          <div className="absolute w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-amber-600/20 blur-3xl animate-pulse" />

          {/* Main Amber Digital Number */}
          <span
            className="font-cinzel text-8xl sm:text-9xl md:text-[12rem] font-bold tracking-widest text-amber-500 text-glow-amber drop-shadow-[0_0_35px_rgba(245,158,11,0.8)] select-none"
          >
            {countdown}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
