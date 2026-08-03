import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';

interface WaxSealProps {
  isSaving?: boolean;
}

export const WaxSealAnimation: React.FC<WaxSealProps> = ({ isSaving }) => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -30, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="relative flex flex-col items-center justify-center my-4 select-none"
    >
      {/* Wax Pool Base */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-red-800 via-rose-900 to-amber-950 border-4 border-red-950 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center justify-center p-2 group">
        {/* Outer Wax Irregular Edge Ring */}
        <div className="absolute inset-1 rounded-full border border-rose-400/30 opacity-70" />

        {/* Inner Stamped Emblem */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-rose-900 to-red-950 border border-red-700/60 flex flex-col items-center justify-center shadow-inner">
          <Heart className="w-6 h-6 text-amber-200 fill-amber-200/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
          <span className="font-serif text-[8px] font-bold uppercase tracking-widest text-amber-300/80 mt-0.5">
            SEALED
          </span>
        </div>

        {/* Shimmer Sparkles while saving */}
        {isSaving && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <Sparkles className="w-24 h-24 text-amber-300/60" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
