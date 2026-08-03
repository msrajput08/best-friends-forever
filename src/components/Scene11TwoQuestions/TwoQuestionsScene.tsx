import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, HelpCircle, Check, X } from 'lucide-react';
import { DeskEnvironment } from '../LivingLetter/DeskEnvironment';
import { saveTwoQuestionsAnswers } from '../../lib/supabase';
import { soundEngine } from '../../utils/sound';

interface TwoQuestionsSceneProps {
  personAName?: string;
  personBName?: string;
  chapterBadge?: string;
  onComplete: (answer1: 'YES' | 'NO', answer2: 'YES' | 'NO') => void;
}

export const TwoQuestionsScene: React.FC<TwoQuestionsSceneProps> = ({
  personAName = 'Person A',
  personBName = 'Person B',
  chapterBadge = 'CHAPTER 11 • THE TWO QUESTIONS',
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [answer1, setAnswer1] = useState<'YES' | 'NO' | null>(null);
  const [answer2, setAnswer2] = useState<'YES' | 'NO' | null>(null);

  const handleSelectAnswer1 = (val: 'YES' | 'NO') => {
    soundEngine.playClickSound();
    setAnswer1(val);

    // Gracefully flip Card One away after brief moment
    setTimeout(() => {
      soundEngine.playPageFlip();
      setCurrentStep(2);
    }, 600);
  };

  const handleSelectAnswer2 = async (val: 'YES' | 'NO') => {
    soundEngine.playClickSound();
    setAnswer2(val);

    const first = answer1 || 'YES';
    const second = val;

    // Save to Supabase
    await saveTwoQuestionsAnswers(first, second);

    setTimeout(() => {
      soundEngine.playVaultUnlock();
      onComplete(first, second);
    }, 800);
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
          Two Final Questions
        </motion.h2>
      </div>

      {/* FLOATING GLOWING CARDS */}
      <div className="w-full max-w-lg min-h-[380px] flex items-center justify-center my-6 relative [perspective:1000px]">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="card-1"
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateY: 90 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="w-full bg-stone-900/90 text-amber-100 border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl flex flex-col items-center justify-between text-center space-y-6 scene-card custom-scrollbar"
            >
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
                <HelpCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-amber-400/80 block">
                  Question 1 of 2
                </span>
                <p className="font-cormorant text-2xl sm:text-3xl font-bold italic text-amber-100 leading-snug">
                  Does {personAName} love {personBName}?
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-4 w-full pt-4">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectAnswer1('YES')}
                  className={`py-3.5 px-6 rounded-2xl font-sans text-xs font-bold uppercase tracking-widest border transition-all flex items-center justify-center space-x-2 ${
                    answer1 === 'YES'
                      ? 'bg-amber-500 text-neutral-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.8)]'
                      : 'bg-stone-800/80 border-amber-500/30 text-amber-200 hover:border-amber-400 hover:bg-stone-700/80'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Yes</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectAnswer1('NO')}
                  className={`py-3.5 px-6 rounded-2xl font-sans text-xs font-bold uppercase tracking-widest border transition-all flex items-center justify-center space-x-2 ${
                    answer1 === 'NO'
                      ? 'bg-amber-500 text-neutral-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.8)]'
                      : 'bg-stone-800/80 border-amber-500/30 text-amber-200 hover:border-amber-400 hover:bg-stone-700/80'
                  }`}
                >
                  <X className="w-4 h-4" />
                  <span>No</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="card-2"
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateY: 90 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="w-full bg-stone-900/90 text-amber-100 border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl flex flex-col items-center justify-between text-center space-y-6 scene-card custom-scrollbar"
            >
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
                <Heart className="w-8 h-8 fill-amber-400/40" />
              </div>

              <div className="space-y-2">
                <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-amber-400/80 block">
                  Question 2 of 2
                </span>
                <p className="font-cormorant text-2xl sm:text-3xl font-bold italic text-amber-100 leading-snug">
                  Does {personBName} love {personAName}?
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-4 w-full pt-4">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectAnswer2('YES')}
                  className={`py-3.5 px-6 rounded-2xl font-sans text-xs font-bold uppercase tracking-widest border transition-all flex items-center justify-center space-x-2 ${
                    answer2 === 'YES'
                      ? 'bg-amber-500 text-neutral-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.8)]'
                      : 'bg-stone-800/80 border-amber-500/30 text-amber-200 hover:border-amber-400 hover:bg-stone-700/80'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Yes</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectAnswer2('NO')}
                  className={`py-3.5 px-6 rounded-2xl font-sans text-xs font-bold uppercase tracking-widest border transition-all flex items-center justify-center space-x-2 ${
                    answer2 === 'NO'
                      ? 'bg-amber-500 text-neutral-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.8)]'
                      : 'bg-stone-800/80 border-amber-500/30 text-amber-200 hover:border-amber-400 hover:bg-stone-700/80'
                  }`}
                >
                  <X className="w-4 h-4" />
                  <span>No</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DeskEnvironment>
  );
};
