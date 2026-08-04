import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Scene1Phase } from '../../types';
import { soundEngine } from '../../utils/sound';

interface LetterRevealProps {
  phase: Scene1Phase;
  onSequenceComplete: () => void;
}

const LINE_1 = ['A'];
const LINE_2 = ['F', 'R', 'I', 'E', 'N', 'D', 'S', 'H', 'I', 'P'];
const LINE_3 = ['T', 'H', 'A', 'T', 'N', 'E', 'V', 'E', 'R'];
const LINE_4 = ['G', 'I', 'V', 'E', 'S', 'U', 'P','💗'];

export const LetterReveal: React.FC<LetterRevealProps> = ({ phase, onSequenceComplete }) => {
  const [visibleCount1, setVisibleCount1] = useState(0);
  const [visibleCount2, setVisibleCount2] = useState(0);
  const [visibleCount3, setVisibleCount3] = useState(0);
  const [visibleCount4, setVisibleCount4] = useState(0);

  useEffect(() => {
    if (phase !== 'LETTER_REVEAL') return;

    let idx1 = 0;
    let idx2 = 0;
    let idx3 = 0;
    let idx4 = 0;

    // Step 1: Reveal HAPPY
const timer1 = setInterval(() => {
  if (idx1 < LINE_1.length) {
    idx1++;
    setVisibleCount1(idx1);
    soundEngine.playLetterShimmer();
  } else {
    clearInterval(timer1);

    // Reveal LINE 2
    setTimeout(() => {
      const timer2 = setInterval(() => {
        if (idx2 < LINE_2.length) {
          idx2++;
          setVisibleCount2(idx2);
          soundEngine.playLetterShimmer();
        } else {
          clearInterval(timer2);

          // Reveal LINE 3
          setTimeout(() => {
            const timer3 = setInterval(() => {
              if (idx3 < LINE_3.length) {
                idx3++;
                setVisibleCount3(idx3);
                soundEngine.playLetterShimmer();
              } else {
                clearInterval(timer3);

                // Reveal LINE 4
                setTimeout(() => {
                  const timer4 = setInterval(() => {
                    if (idx4 < LINE_4.length) {
                      idx4++;
                      setVisibleCount4(idx4);
                      soundEngine.playLetterShimmer();
                    } else {
                      clearInterval(timer4);

                      // All letters revealed
                      setTimeout(() => {
                        onSequenceComplete();
                      }, 600);
                    }
                  }, 110);
                }, 250);
              }
            }, 110);
          }, 250);
        }
      }, 90);
    }, 250);
  }
}, 110);

    return () => {
      clearInterval(timer1);
    };
  }, [phase, onSequenceComplete]);

  // If in title formation or celebration, force all letters visible
  const showAll =
    phase === 'TITLE_FORMATION' || phase === 'CELEBRATION' || phase === 'SCENE1_COMPLETE';

  if (
    phase === 'BLACK_SCREEN' ||
    phase === 'WALL_REVEAL' ||
    phase === 'COUNTDOWN' ||
    phase === 'SILENCE_HOLD' ||
    phase === 'ENERGY_BURST'
  ) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none px-4">
      {/* Title Container */}
      <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-4 md:space-y-6 text-center">
        {/* Line 1: HAPPY */}
        <div className="flex items-center justify-center space-x-1 sm:space-x-3 md:space-x-5">
          {LINE_1.map((char, idx) => {
            const isVisible = showAll || idx < visibleCount1;
            return (
              <motion.span
                key={`line1-${idx}`}
                initial={{ opacity: 0, y: 25, scale: 0.5, filter: 'blur(8px)' }}
                animate={
                  isVisible
                    ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
                    : { opacity: 0, y: 25, scale: 0.5, filter: 'blur(8px)' }
                }
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="font-cinzel text-[clamp(1.8rem,8vw,5rem)] font-extrabold text-amber-200 text-glow-gold tracking-wider select-none drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]"
              >
                {char}
              </motion.span>
            );
          })}
        </div>

        {/* Line 2: FRIENDSHIP */}
        <div className="flex items-center justify-center space-x-1 sm:space-x-2 md:space-x-4">
          {LINE_2.map((char, idx) => {
            const isVisible = showAll || idx < visibleCount2;
            return (
              <motion.span
                key={`line2-${idx}`}
                initial={{ opacity: 0, y: 25, scale: 0.5, filter: 'blur(8px)' }}
                animate={
                  isVisible
                    ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
                    : { opacity: 0, y: 25, scale: 0.5, filter: 'blur(8px)' }
                }
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="font-cinzel text-[clamp(1.4rem,6.5vw,6rem)] font-extrabold text-amber-100 text-glow-gold tracking-wider select-none drop-shadow-[0_0_25px_rgba(245,158,11,0.7)]"
              >
                {char}
              </motion.span>
            );
          })}
        </div>

        {/* Line 3: DAY */}
        <div className="flex items-center justify-center space-x-1 sm:space-x-3 md:space-x-5">
          {LINE_3.map((char, idx) => {
            const isVisible = showAll || idx < visibleCount3;
            return (
              <motion.span
                key={`line3-${idx}`}
                initial={{ opacity: 0, y: 25, scale: 0.5, filter: 'blur(8px)' }}
                animate={
                  isVisible
                    ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
                    : { opacity: 0, y: 25, scale: 0.5, filter: 'blur(8px)' }
                }
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="font-cinzel text-[clamp(2.25rem,10vw,7.5rem)] font-extrabold text-amber-200 text-glow-gold tracking-wider select-none drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]"
              >
                {char}
              </motion.span>
            );
          })}
        </div>
        <div className="flex items-center justify-center space-x-1 sm:space-x-3 md:space-x-5">
  {LINE_4.map((char, idx) => {
    const isVisible = showAll || idx < visibleCount4;

    return (
      <motion.span
        key={`line4-${idx}`}
        initial={{ opacity: 0, y: 25, scale: 0.5, filter: 'blur(8px)' }}
        animate={
          isVisible
            ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
            : { opacity: 0, y: 25, scale: 0.5, filter: 'blur(8px)' }
        }
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="font-cinzel text-[clamp(2rem,8vw,5.5rem)] font-extrabold text-amber-200 text-glow-gold tracking-wider select-none drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]"
      >
        {char}
      </motion.span>
    );
  })}
</div>
      </div>
    </div>
  );
};
