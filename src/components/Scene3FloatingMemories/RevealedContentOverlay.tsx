import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

export interface ActiveReveal {
  id: string;
  type: 'IMAGE' | 'MESSAGE' | 'HEARTS';
  x: number;
  y: number;
  data?: {
    imageUrl?: string;
    message?: string;
  };
}

interface RevealedContentOverlayProps {
  reveals: ActiveReveal[];
  onRevealFinished: (id: string) => void;
}

export const RevealedContentOverlay: React.FC<RevealedContentOverlayProps> = ({
  reveals,
  onRevealFinished,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      <AnimatePresence>
        {reveals.map((reveal) => (
          <RevealItem
            key={reveal.id}
            reveal={reveal}
            onFinish={() => onRevealFinished(reveal.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const RevealItem: React.FC<{ reveal: ActiveReveal; onFinish: () => void }> = ({
  reveal,
  onFinish,
}) => {
  const [typedMessage, setTypedMessage] = useState('');

  useEffect(() => {
    // Auto finish after 3.8 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 3800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  // Typewriter effect for MESSAGE
  useEffect(() => {
    if (reveal.type !== 'MESSAGE') return;

    const fullText = reveal.data?.message || 'A timeless memory captured in a heartbeat.';
    let idx = 0;
    const interval = setInterval(() => {
      if (idx <= fullText.length) {
        setTypedMessage(fullText.slice(0, idx));
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [reveal]);

  if (reveal.type === 'HEARTS') {
    return (
      <div
        className="absolute pointer-events-none"
        style={{ left: reveal.x, top: reveal.y }}
      >
        {Array.from({ length: 7 }).map((_, i) => {
          const offsetX = (i - 3) * 28;
          return (
            <motion.div
              key={`heart-${i}`}
              initial={{ opacity: 0, scale: 0.4, y: 0, x: offsetX }}
              animate={{
                opacity: [0, 1, 0.9, 0],
                scale: [0.4, 1.2, 1],
                y: -140 - i * 20,
                x: offsetX + (i % 2 === 0 ? 15 : -15),
                rotate: [0, i % 2 === 0 ? 15 : -15],
              }}
              transition={{
                duration: 2.5 + i * 0.2,
                ease: 'easeOut',
              }}
              className="absolute text-pink-400 drop-shadow-[0_0_12px_rgba(244,114,182,0.8)]"
            >
              <Heart className="w-8 h-8 fill-pink-400/80 stroke-pink-200" />
            </motion.div>
          );
        })}
      </div>
    );
  }

  if (reveal.type === 'IMAGE') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 20, rotate: -6 }}
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [0.5, 1, 1, 0.8],
          y: [20, -10, -20, -50],
          rotate: [-6, 2, -2, 5],
        }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 3.6, times: [0, 0.2, 0.85, 1], ease: 'easeInOut' }}
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          left: `clamp(150px, ${reveal.x}px, calc(100vw - 150px))`,
          top: `clamp(120px, ${reveal.y}px, calc(100dvh - 120px))`,
        }}
      >
        {/* Floating Polaroid Photograph Card */}
        <div className="w-60 sm:w-72 bg-stone-100 border-4 border-white rounded-lg p-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center">
          <div className="relative w-full aspect-[4/3] rounded overflow-hidden bg-neutral-900 border border-neutral-200 shadow-inner">
            <img
              src={reveal.data?.imageUrl || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80'}
              alt="Memory reveal"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="pt-3 pb-1 flex items-center space-x-1 text-xs font-sans font-bold text-neutral-800 tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Found Memory</span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (reveal.type === 'MESSAGE') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [0.6, 1, 1, 0.9],
          y: [20, -10, -15, -40],
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 3.6, times: [0, 0.2, 0.85, 1], ease: 'easeInOut' }}
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          left: `clamp(160px, ${reveal.x}px, calc(100vw - 160px))`,
          top: `clamp(120px, ${reveal.y}px, calc(100dvh - 120px))`,
        }}
      >
        {/* Handwritten Note Card */}
        <div className="w-64 sm:w-80 bg-gradient-to-br from-amber-50 via-amber-100/90 to-stone-200 border-2 border-amber-300/80 rounded-2xl p-5 shadow-[0_20px_45px_rgba(0,0,0,0.7)] flex flex-col items-center text-center">
          <div className="w-full border-b border-amber-300/60 pb-2 mb-3 flex items-center justify-between">
            <span className="font-sans text-[10px] font-extrabold uppercase tracking-widest text-amber-900/80">
              Secret Note
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          </div>

          <p className="font-cormorant text-lg sm:text-xl italic font-semibold text-neutral-900 leading-relaxed min-h-[3.5rem]">
            &ldquo;{typedMessage}&rdquo;
          </p>
        </div>
      </motion.div>
    );
  }

  return null;
};
