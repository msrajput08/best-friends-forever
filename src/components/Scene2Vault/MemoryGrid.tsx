import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { MemoryItem } from '../../types';
import { soundEngine } from '../../utils/sound';

interface MemoryGridProps {
  memories: MemoryItem[];
  exploredIds: number[];
  onSelectEnvelope: (memory: MemoryItem) => void;
}

export const MemoryGrid: React.FC<MemoryGridProps> = ({
  memories,
  exploredIds,
  onSelectEnvelope,
}) => {
  return (
    <div className="w-full max-w-5xl px-4 sm:px-6 py-4 z-20">
      {/* Grid Layout: Desktop 3 cols x 2 rows; Mobile 1 col */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
        {memories.map((mem, index) => {
          const isExplored = exploredIds.includes(mem.id);

          return (
            <motion.div
              key={mem.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: index * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -8, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                soundEngine.playClickSound();
                onSelectEnvelope(mem);
              }}
              className="relative cursor-pointer group select-none"
            >
              {/* Floating Idle Animation Container */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 4 + index,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative w-full aspect-[1.5/1] rounded-2xl bg-gradient-to-br from-amber-100 via-amber-50 to-stone-200 border-2 border-amber-400/60 p-5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] group-hover:shadow-[0_20px_45px_rgba(245,158,11,0.35)] transition-all duration-500 overflow-hidden flex flex-col justify-between"
              >
                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#78350f_1px,transparent_1px)] [background-size:12px_12px]" />

                {/* Envelope Top Triangular Flap Simulation */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-amber-200/90 to-amber-100/40 border-b border-amber-300/60 [clip-path:polygon(0_0,100%_0,50%_100%)] shadow-sm" />

                {/* Wax Seal Center Ornament */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-red-700 via-red-800 to-amber-950 border-2 border-amber-300 shadow-xl flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-8 h-8 rounded-full border border-amber-400/50 flex items-center justify-center text-amber-200 font-cinzel text-xs font-bold shadow-inner">
                    🗝️
                  </div>
                </div>

                {/* Header Tag */}
                <div className="relative z-0 flex items-center justify-between">
                  <span className="font-sans text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-amber-900/80">
                    {mem.dateTag}
                  </span>

                  {isExplored && (
                    <span className="inline-flex items-center space-x-1 bg-amber-900/10 border border-amber-700/30 px-2 py-0.5 rounded-full text-[10px] font-sans font-bold text-amber-900">
                      <Check className="w-3 h-3 text-amber-700" />
                      <span>Unlocked</span>
                    </span>
                  )}
                </div>

                {/* Bottom Title Label */}
                <div className="relative z-0 pt-6">
                  <h4 className="font-cinzel text-sm sm:text-base font-bold text-neutral-900 line-clamp-1 group-hover:text-amber-900 transition-colors">
                    {mem.title}
                  </h4>
                  <p className="font-cormorant text-xs sm:text-sm italic text-neutral-700/80 line-clamp-1">
                    {mem.stampLabel}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
