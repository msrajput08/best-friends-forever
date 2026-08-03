import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scene1Phase } from '../../types';
import { InteractionHint } from '../common/InteractionHint';

interface FinalMessageProps {
  phase: Scene1Phase;
  onClickBegin: () => void;
}

export const FinalMessage: React.FC<FinalMessageProps> = ({ phase, onClickBegin }) => {
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showActionPrompt, setShowActionPrompt] = useState(false);

  useEffect(() => {
    if (phase === 'CELEBRATION' || phase === 'SCENE1_COMPLETE') {
      const timer1 = setTimeout(() => {
        setShowSubtitle(true);
      }, 800);

      const timer2 = setTimeout(() => {
        setShowActionPrompt(true);
      }, 2200);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setShowSubtitle(false);
      setShowActionPrompt(false);
    }
  }, [phase]);

  if (phase !== 'CELEBRATION' && phase !== 'SCENE1_COMPLETE') {
    return null;
  }

  return (
    <div className="absolute bottom-20 sm:bottom-24 md:bottom-28 inset-x-0 flex flex-col items-center justify-center z-30 pointer-events-none px-6 text-center">
      {/* Subtitle Message */}
      {/* <AnimatePresence>
        {showSubtitle && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="font-cormorant text-lg sm:text-2xl md:text-3xl italic text-amber-100/90 font-normal tracking-wide max-w-2xl text-shadow-sm mb-6 select-none"
          >
            &ldquo;A journey made with memories, laughter and friendship.&rdquo;
          </motion.p>
        )}
      </AnimatePresence> */}

      {/* Action Prompt */}
      <AnimatePresence>
        {showActionPrompt && (
         <div
  className="pointer-events-auto"
  style={{
    transform: "translate(380px,80px)"
  }}
>
  <InteractionHint
    label="Begin Our Journey"
    variant="orb"
    onClick={onClickBegin}
  />
</div>
        )}
      </AnimatePresence>
    </div>
  );
};

