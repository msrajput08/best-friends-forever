import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Sun, Flame } from 'lucide-react';
import { DeskEnvironment } from '../LivingLetter/DeskEnvironment';
import { soundEngine } from '../../utils/sound';

interface ConditionalResultSceneProps {
  answer1: 'YES' | 'NO';
  answer2: 'YES' | 'NO';
  yesYesMessage?: string;
  noNoMessage?: string;
  mixedMessage?: string;
  chapterBadge?: string;
  onComplete: () => void;
}

export const ConditionalResultScene: React.FC<ConditionalResultSceneProps> = ({
  answer1,
  answer2,
  yesYesMessage = 'A sacred bond built on mutual love, deep respect, and unbreakable trust. Your connection shines brighter than the stars!',
  noNoMessage = 'True friendship takes time, understanding, and patience. The journey of growing closer is just beginning.',
  mixedMessage = 'Every great friendship has its unique melody and rhythm. Love grows in unexpected ways when given heart and time.',
  chapterBadge = 'CHAPTER 12 • THE RESULT',
  onComplete,
}) => {
  const [showContinue, setShowContinue] = useState(false);

  // Determine outcome case
  let outcomeText = mixedMessage;
  let outcomeTitle = 'Harmonious Journey';
  let IconComponent = Sun;

  if (answer1 === 'YES' && answer2 === 'YES') {
    outcomeText = yesYesMessage;
    outcomeTitle = 'Unconditional Love & Friendship';
    IconComponent = Heart;
  } else if (answer1 === 'NO' && answer2 === 'NO') {
    outcomeText = noNoMessage;
    outcomeTitle = 'A Growing Spark';
    IconComponent = Flame;
  }

  // Trigger continue button after brief pause
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowContinue(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleProceedToFinale = () => {
    soundEngine.playClickSound();
    onComplete();
  };

  return (
    <DeskEnvironment>
      {/* Header Badge */}
      <div className="text-center mt-2 mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-400/30 px-4 py-1 rounded-full text-xs font-sans font-bold tracking-widest text-amber-300 uppercase mb-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{chapterBadge}</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-100 tracking-wider text-glow-gold"
        >
          {outcomeTitle}
        </motion.h2>
      </div>

      {/* OUTCOME MESSAGE PAPER CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-xl bg-amber-50/95 text-neutral-900 border-4 border-amber-300/80 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] my-2 sm:my-4 flex flex-col items-center justify-between text-center space-y-6 scene-card custom-scrollbar"
        style={{
          backgroundImage:
            'radial-gradient(#d97706 0.5px, transparent 0.5px), radial-gradient(#d97706 0.5px, #fffbeb 0.5px)',
          backgroundSize: '20px 20px',
        }}
      >
        <div className="w-16 h-16 rounded-full bg-amber-200/80 border-2 border-amber-500/50 flex items-center justify-center text-amber-800 shadow-md">
          <IconComponent className="w-8 h-8 fill-amber-500/30" />
        </div>

        {/* ELEGANT FADE HANDWRITTEN APPEARANCE */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.4 }}
          className="font-cormorant text-2xl sm:text-3xl font-bold italic text-neutral-900 leading-relaxed"
        >
          &ldquo;{outcomeText}&rdquo;
        </motion.p>

        {/* CONTINUATION PROMPT */}
        {showContinue && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-4 border-t-2 border-amber-300/60 w-full flex flex-col items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleProceedToFinale}
              className="px-8 py-3.5 rounded-2xl bg-amber-900 text-amber-100 font-sans text-xs font-bold uppercase tracking-widest hover:bg-amber-800 shadow-lg transition-all flex items-center space-x-2"
            >
              <span>Step Into The Finale</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </DeskEnvironment>
  );
};
