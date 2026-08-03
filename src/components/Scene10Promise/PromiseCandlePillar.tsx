import React from 'react';
import { motion } from 'motion/react';
import { Flame } from 'lucide-react';

interface PromiseCandlePillarProps {
  side: 'left' | 'right';
  label: string;
  isLit: boolean;
}

/**
 * A tall ceremonial candle rendered in pure CSS/SVG, used as the desktop
 * side-rail accent for the Friendship Promise scene. Distinct in silhouette,
 * color language (emerald + gold vs. amber writing-desk props) and motion
 * from every other scene's side accent.
 */
export const PromiseCandlePillar: React.FC<PromiseCandlePillarProps> = ({ side, label, isLit }) => {
  return (
    <div className={`flex flex-col items-center space-y-5 ${side === 'left' ? '' : ''}`}>
      <motion.div
        animate={{
          boxShadow: isLit
            ? [
                '0 0 25px rgba(16,185,129,0.35)',
                '0 0 45px rgba(251,191,36,0.5)',
                '0 0 25px rgba(16,185,129,0.35)',
              ]
            : '0 0 10px rgba(16,185,129,0.15)',
        }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative flex flex-col items-center"
      >
        {/* Flame */}
        <motion.div
          animate={
            isLit
              ? { scaleY: [1, 1.15, 0.95, 1.08, 1], scaleX: [1, 0.92, 1.05, 0.97, 1] }
              : { opacity: 0, scaleY: 0 }
          }
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-0.5 text-amber-300"
          style={{ transformOrigin: 'bottom center' }}
        >
          <Flame className="w-5 h-5 fill-amber-400/80 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
        </motion.div>

        {/* Wick */}
        <div className="w-0.5 h-2 bg-neutral-700" />

        {/* Candle Body */}
        <div className="w-9 h-32 rounded-sm bg-gradient-to-b from-emerald-50 via-emerald-100 to-emerald-200/90 border border-emerald-900/10 shadow-[inset_2px_0_4px_rgba(0,0,0,0.08)] relative overflow-hidden">
          <div className="absolute inset-x-0 top-3 h-px bg-amber-600/40" />
          <div className="absolute inset-x-0 top-[4.5rem] h-px bg-amber-600/40" />
        </div>

        {/* Brass Base */}
        <div className="w-14 h-3 rounded-full bg-gradient-to-b from-amber-500 to-amber-800 shadow-lg -mt-0.5" />
        <div className="w-20 h-1.5 rounded-full bg-gradient-to-b from-amber-700 to-amber-950 shadow-md" />
      </motion.div>

      <span className="font-cormorant text-sm italic text-emerald-200/80 tracking-widest uppercase text-center max-w-[10rem]">
        {label}
      </span>
      <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
    </div>
  );
};
