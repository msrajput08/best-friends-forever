import React from 'react';
import { motion } from 'motion/react';
import { Scene2Phase } from '../../types';

interface VaultDoorProps {
  phase: Scene2Phase;
  isError: boolean;
}

export const VaultDoor: React.FC<VaultDoorProps> = ({ phase, isError }) => {
  const isOpen =
    phase === 'VAULT_DOORS_OPEN' ||
    phase === 'ENVELOPES_ARRIVE' ||
    phase === 'ENVELOPES_INTERACTIVE' ||
    phase === 'SCENE2_ALL_EXPLORED' ||
    phase === 'SCENE2_COMPLETE';

  const isUnlocking = phase === 'UNLOCKING_ANIMATION';

  return (
    <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] flex items-center justify-center select-none">
      {/* Outer Metallic Vault Rim / Frame */}
      <div
        className={`absolute inset-0 rounded-full border-8 sm:border-[12px] border-neutral-800 bg-neutral-900/90 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex items-center justify-center overflow-hidden transition-all duration-500 ${
          isError ? 'border-red-600/80 shadow-[0_0_40px_rgba(220,38,38,0.6)]' : 'border-neutral-800'
        }`}
      >
        {/* Subtle Brushed Metal Texture & Rivets */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_transparent_70%)]" />

        {/* Outer Ring Rivets */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 360) / 12;
          return (
            <div
              key={`rivet-${i}`}
              className="rivet-ring-item absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-amber-200/40 via-neutral-600 to-neutral-800 border border-neutral-700 shadow-inner"
              style={{
                transform: `rotate(${angle}deg) translateY(var(--rivet-radius))`,
              }}
            />
          );
        })}

        {/* Intense Golden Interior Light Beam (Revealed when doors swing open) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isOpen ? { opacity: 1, scale: 1.1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 shadow-[0_0_120px_rgba(251,191,36,0.95)] z-0 flex items-center justify-center overflow-hidden"
        >
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.9)_0%,_rgba(245,158,11,0.6)_60%,_rgba(0,0,0,0)_100%)] animate-pulse" />
        </motion.div>

        {/* LEFT VAULT DOOR HALF */}
        <motion.div
          initial={{ x: 0 }}
          animate={isOpen ? { x: '-105%' } : { x: 0 }}
          transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
          className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-950 border-r-2 border-amber-500/30 z-10 overflow-hidden shadow-[10px_0_30px_rgba(0,0,0,0.8)]"
        >
          {/* Engraved Keepsake Pattern Left */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-24 rounded-full bg-gradient-to-b from-amber-400/40 via-amber-600/30 to-amber-400/40 border border-amber-500/20" />
        </motion.div>

        {/* RIGHT VAULT DOOR HALF */}
        <motion.div
          initial={{ x: 0 }}
          animate={isOpen ? { x: '105%' } : { x: 0 }}
          transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
          className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-neutral-900 via-neutral-800 to-neutral-950 border-l-2 border-amber-500/30 z-10 overflow-hidden shadow-[-10px_0_30px_rgba(0,0,0,0.8)]"
        >
          {/* Engraved Keepsake Pattern Right */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-24 rounded-full bg-gradient-to-b from-amber-400/40 via-amber-600/30 to-amber-400/40 border border-amber-500/20" />
        </motion.div>

        {/* CENTER MECHANICAL WHEEL & DIAL LOCK */}
        <motion.div
          animate={
            isUnlocking
              ? { rotate: 720 }
              : isError
              ? { rotate: [-10, 10, -8, 8, 0] }
              : isOpen
              ? { scale: 0.9, opacity: 0 }
              : { rotate: 0 }
          }
          transition={
            isUnlocking
              ? { duration: 1.2, ease: 'easeInOut' }
              : isError
              ? { duration: 0.4 }
              : { duration: 0.8 }
          }
          className="absolute z-20 w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-neutral-900 via-amber-950/40 to-neutral-800 border-4 sm:border-8 border-amber-500/40 shadow-[0_0_30px_rgba(0,0,0,0.9)] flex items-center justify-center cursor-pointer box-glow-gold"
        >
          {/* Wheel Spokes */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`spoke-${i}`}
              className="absolute w-1.5 sm:w-2 h-full bg-gradient-to-b from-amber-500/40 via-neutral-700 to-amber-500/40 rounded-full"
              style={{ transform: `rotate(${i * 60}deg)` }}
            />
          ))}

          {/* Center Brass Emblem */}
          <div className="relative w-16 h-16 sm:w-22 sm:h-22 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 border-2 border-amber-200 flex items-center justify-center shadow-lg z-10">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-neutral-950 border border-amber-400/60 flex items-center justify-center text-amber-300 font-cinzel font-bold text-xs sm:text-sm">
              🔑
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
