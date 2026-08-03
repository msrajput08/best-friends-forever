import React from 'react';
import { motion } from 'motion/react';
import { User } from 'lucide-react';

interface QuestionPlaqueProps {
  name: string;
  active: boolean;
  align: 'left' | 'right';
}

/**
 * Desktop side-rail accent for the Two Questions scene. Renders as a named
 * plaque that glows while that person's question is active, giving the
 * scene a "duel" identity distinct from the writing-desk / ceremony scenes.
 */
export const QuestionPlaque: React.FC<QuestionPlaqueProps> = ({ name, active, align }) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <motion.div
        animate={{
          scale: active ? [1, 1.06, 1] : 1,
          boxShadow: active
            ? '0 0 40px rgba(139,92,246,0.55)'
            : '0 0 12px rgba(139,92,246,0.15)',
        }}
        transition={{ duration: 2, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
        className={`w-20 h-20 rounded-full border-2 flex items-center justify-center backdrop-blur-md transition-colors duration-500 ${
          active
            ? 'bg-violet-500/20 border-violet-300/70 text-violet-100'
            : 'bg-neutral-900/60 border-violet-500/20 text-violet-300/40'
        }`}
      >
        <User className="w-9 h-9" />
      </motion.div>
      <div className="text-center">
        <span
          className={`block font-cinzel text-sm font-bold tracking-widest uppercase transition-colors duration-500 ${
            active ? 'text-violet-200' : 'text-violet-400/40'
          }`}
        >
          {name}
        </span>
        <span className="block font-sans text-[10px] text-violet-300/50 tracking-wider uppercase mt-1">
          {align === 'left' ? 'Question One' : 'Question Two'}
        </span>
      </div>
      <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
    </div>
  );
};
