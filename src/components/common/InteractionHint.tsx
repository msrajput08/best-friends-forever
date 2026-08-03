import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Feather, ArrowRight } from 'lucide-react';

interface InteractionHintProps {
  label?: string;
  variant?: 'orb' | 'feather' | 'corner' | 'pulse';
  onClick?: () => void;
  className?: string;
}

export const InteractionHint: React.FC<InteractionHintProps> = ({
  label = 'Step Into The Story',
  variant = 'orb',
  onClick,
  className = '',
}) => {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={`group relative inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 border border-amber-400/35 backdrop-blur-md shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:border-amber-300 hover:shadow-[0_0_35px_rgba(245,158,11,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 transition-all duration-500 cursor-pointer select-none ${className}`}
    >
      {/* Outer Breathing Light Ring */}
      <span className="absolute -inset-0.5 rounded-full bg-amber-400/20 blur-md group-hover:bg-amber-300/40 animate-pulse pointer-events-none transition-all duration-700" />

      {/* Variant Icon / Breathing Orb Element */}
      <div className="relative flex items-center justify-center">
        {variant === 'feather' ? (
          <Feather className="w-4 h-4 text-amber-300 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
        ) : variant === 'corner' ? (
          <Sparkles className="w-4 h-4 text-amber-300 group-hover:scale-125 transition-transform duration-300" />
        ) : (
          <div className="relative w-3.5 h-3.5 flex items-center justify-center">
            {/* Core Orb */}
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-200 to-yellow-400 shadow-[0_0_10px_rgba(251,191,36,0.9)] animate-ping absolute opacity-75" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,1)] relative z-10" />
          </div>
        )}
      </div>

      {/* Label Typography */}
      <span className="relative z-10 font-sans text-xs sm:text-sm font-semibold tracking-widest text-amber-200 uppercase text-glow-gold group-hover:text-amber-100 transition-colors">
        {label}
      </span>

      {/* Soft Animated Forward Arrow */}
      <motion.div
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 text-amber-300 group-hover:text-amber-100"
      >
        <ArrowRight className="w-4 h-4" />
      </motion.div>
    </motion.button>
  );
};
