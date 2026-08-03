import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check } from 'lucide-react';
import { MemoryItem } from '../../types';
import { soundEngine } from '../../utils/sound';

interface EnvelopeModalProps {
  memory: MemoryItem | null;
  onClose: () => void;
}

export const EnvelopeModal: React.FC<EnvelopeModalProps> = ({ memory, onClose }) => {
  const [isOpenStage, setIsOpenStage] = useState<'SEAL_BREAKING' | 'FLAP_OPEN' | 'PHOTO_SLIDE' | 'CAPTION_TYPING'>('SEAL_BREAKING');
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    if (!memory) return;

    setIsOpenStage('SEAL_BREAKING');
    setTypedText('');

    // Step 1: Crack Wax Seal + sound
    const timer1 = setTimeout(() => {
      soundEngine.playWaxCrack();
      setIsOpenStage('FLAP_OPEN');

      // Step 2: Open Envelope Flap + Slide Photo + sound
      const timer2 = setTimeout(() => {
        soundEngine.playEnvelopeSlide();
        setIsOpenStage('PHOTO_SLIDE');

        // Step 3: Type Caption Text
        const timer3 = setTimeout(() => {
          setIsOpenStage('CAPTION_TYPING');
        }, 600);

        return () => clearTimeout(timer3);
      }, 500);

      return () => clearTimeout(timer2);
    }, 400);

    return () => clearTimeout(timer1);
  }, [memory]);

  // Typewriter effect for caption
  useEffect(() => {
    if (isOpenStage !== 'CAPTION_TYPING' || !memory) return;

    let index = 0;
    const text = memory.caption;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setTypedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [isOpenStage, memory]);

  const handleCloseModal = () => {
    soundEngine.playEnvelopeSlide();
    onClose();
  };

  if (!memory) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseModal}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl z-0"
        />

        {/* Modal Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 40 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-xl bg-gradient-to-b from-stone-900 via-neutral-900 to-stone-950 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.2)] flex flex-col items-center my-auto"
        >
          {/* Close Button */}
          <button
            onClick={handleCloseModal}
            aria-label="Close memory"
            className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800/80 border border-amber-500/30 text-amber-200 hover:text-white hover:bg-neutral-700 transition-colors z-30"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Chapter Stamp Badge */}
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-sans font-bold tracking-widest text-amber-300 uppercase mb-4">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{memory.dateTag} • {memory.stampLabel}</span>
          </div>

          {/* Envelope & Photograph Holder */}
          <div className="relative w-full aspect-[4/3] max-h-72 sm:max-h-80 my-2 rounded-xl bg-neutral-950 border border-amber-500/20 p-3 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
            {/* Sliding Photograph Card */}
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={
                isOpenStage === 'PHOTO_SLIDE' || isOpenStage === 'CAPTION_TYPING'
                  ? { y: 0, opacity: 1 }
                  : { y: 80, opacity: 0 }
              }
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="relative w-full h-full rounded-lg overflow-hidden border-4 border-amber-100/90 shadow-2xl bg-stone-100 p-2 flex flex-col items-center"
            >
              <img
                src={memory.imageUrl}
                alt={memory.title}
                className="w-full h-full object-contain rounded shadow-inner"
              />
            </motion.div>
          </div>

          {/* Title */}
          <h3 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-100 text-glow-gold text-center mt-4 mb-2">
            {memory.title}
          </h3>

          {/* Handwritten Caption Typing Reveal */}
          <div className="w-full min-h-[4rem] flex items-center justify-center px-4 text-center">
            <p className="font-cormorant text-lg sm:text-xl md:text-2xl italic text-amber-200/90 font-medium leading-relaxed">
              &ldquo;{typedText}&rdquo;
            </p>
          </div>

          {/* Done Exploring indicator */}
          <div className="mt-4 pt-4 border-t border-amber-500/20 w-full flex items-center justify-center space-x-2 text-xs font-sans text-amber-300/70">
            <Check className="w-4 h-4 text-amber-400" />
            <span>Memory Unlocked & Preserved</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
