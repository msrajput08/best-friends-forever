import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { soundEngine } from '../../utils/sound';
import { InteractionHint } from '../common/InteractionHint';

interface Scene3CompletionProps {
  onContinue: () => void;
}

export const Scene3Completion: React.FC<Scene3CompletionProps> = ({ onContinue }) => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (!showPrompt) return;
    soundEngine.playClickSound();
    onContinue();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      onClick={handleClick}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md px-6 text-center cursor-pointer select-none"
    >
      <div className="max-w-2xl space-y-6">
        {/* Main Glowing Quote */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="font-cormorant text-2xl sm:text-4xl md:text-5xl italic font-medium text-pink-200 text-glow-gold leading-relaxed"
        >
          &ldquo;Some memories are found only when you chase them...&rdquo;
        </motion.p>

        {/* Interaction Hint */}
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="pt-6"
          >
            <InteractionHint
              label="Carry This Memory Forward"
              variant="orb"
              onClick={handleClick}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

