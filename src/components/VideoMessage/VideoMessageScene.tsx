import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Sparkles, Heart, KeyRound } from 'lucide-react';
import { CustomVideoPlayer } from './CustomVideoPlayer';
import { VideoAmbientCanvas } from './VideoAmbientCanvas';
import { soundEngine } from '../../utils/sound';
import { InteractionHint } from '../common/InteractionHint';

export interface VideoMessageConfig {
  sceneId: 'SCENE_4' | 'SCENE_5';
  headerPrefix: string;
  recipientName: string;
  lockQuestion: string;
  correctAnswer: string;
  videoUrl: string;
  posterUrl?: string;
  chapterBadge: string;
  onComplete: () => void;
}

type VideoScenePhase =
  | 'FRAME_DRAWING'
  | 'LOCK_APPEAR'
  | 'ANSWER_INPUT'
  | 'UNLOCKING'
  | 'FRAME_ACTIVATING'
  | 'VIDEO_REVEAL'
  | 'VIDEO_PLAYING'
  | 'VIDEO_ENDED'
  | 'COMPLETE';

export const VideoMessageScene: React.FC<VideoMessageConfig> = ({
  headerPrefix,
  recipientName,
  lockQuestion,
  correctAnswer,
  videoUrl,
  posterUrl,
  chapterBadge,
  onComplete,
}) => {
  const [phase, setPhase] = useState<VideoScenePhase>('FRAME_DRAWING');
  const [inputAnswer, setInputAnswer] = useState('');
  const [isError, setIsError] = useState(false);
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);

  // Transition timeline: Frame drawing -> Lock appear -> Answer input
  useEffect(() => {
    if (phase === 'FRAME_DRAWING') {
      const timer = setTimeout(() => {
        setPhase('LOCK_APPEAR');
      }, 1200);
      return () => clearTimeout(timer);
    }

    if (phase === 'LOCK_APPEAR') {
      const timer = setTimeout(() => {
        setPhase('ANSWER_INPUT');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check answer (case-insensitive or allow quick demo auto-fill)
    const normalize = (text: string) =>
  text
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

const isCorrect =
  normalize(inputAnswer) === normalize(correctAnswer);

    if (!isCorrect) {
      soundEngine.playVaultError();
      setIsError(true);
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      setTimeout(() => setIsError(false), 800);
      return;
    }

    // Unlock sequence
    soundEngine.playVaultUnlock();
    setIsError(false);
    setPhase('UNLOCKING');

    // Light travels around frame -> Frame activates -> Video Reveal
    setTimeout(() => {
      setPhase('FRAME_ACTIVATING');
      soundEngine.playDoorsOpen();

      setTimeout(() => {
        setPhase('VIDEO_REVEAL');

        setTimeout(() => {
          setPhase('VIDEO_PLAYING');
        }, 1000);
      }, 1200);
    }, 1200);
  };

  // const handleQuickAutofill = () => {
  //   soundEngine.playClickSound();
  //   setInputAnswer(correctAnswer);
  // };

  const handleVideoEnded = () => {
    setPhase('VIDEO_ENDED');

    // Reveal "Click Anywhere To Continue" after short pause
    setTimeout(() => {
      setShowContinuePrompt(true);
    }, 1200);
  };

  const handleContinueClick = () => {
    if (!showContinuePrompt) return;
    soundEngine.playClickSound();
    setPhase('COMPLETE');
    onComplete();
  };

  return (
    <div
      onClick={phase === 'VIDEO_ENDED' ? handleContinueClick : undefined}
      className={`relative w-full h-full bg-neutral-950 text-amber-100 flex flex-col items-center justify-between overflow-x-hidden overflow-y-auto py-10 px-4 sm:px-6 md:px-8 pb-28 sm:pb-32 select-none ${
        phase === 'VIDEO_ENDED' ? 'cursor-pointer' : ''
      }`}
    >
      {/* Background Volumetric Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(88,28,135,0.25)_0%,_rgba(10,10,10,0.95)_80%)] pointer-events-none z-0" />

      {/* Ambient Particle Canvas (Outer boundary particles around frame) */}
      <VideoAmbientCanvas
        isEnded={phase === 'VIDEO_ENDED'}
        isUnlocked={
          phase === 'VIDEO_REVEAL' || phase === 'VIDEO_PLAYING' || phase === 'VIDEO_ENDED'
        }
      />

      {/* HEADER SECTION */}
      <div className="relative z-20 text-center mt-2 max-w-xl">
        {/* Chapter Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-sans font-bold tracking-widest text-amber-300 uppercase mb-3"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{chapterBadge}</span>
        </motion.div>

        {/* Heading Title */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-100 tracking-wider text-glow-gold"
        >
          {headerPrefix}
        </motion.h2>

        {/* Recipient Placeholder */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-cormorant text-xl sm:text-2xl md:text-3xl italic font-semibold text-amber-300/90 mt-1"
        >
          {recipientName}
        </motion.p>
      </div>

      {/* CENTER CINEMATIC FRAME CONTAINER */}
      <div className="relative z-20 my-auto translate-y-15 w-full max-w-6xl px-2 sm:px-4 flex items-center justify-center">
        {/* Left Desktop Side Accent: Cinematic Film Reel */}
        <div className="hidden lg:flex flex-col items-center space-y-4 absolute left-0 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-95 transition-opacity duration-500 pointer-events-none pr-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-900/60 to-stone-900 border border-amber-500/30 p-3 shadow-2xl backdrop-blur-md flex flex-col items-center justify-center text-amber-300">
            <span className="text-3xl">🎬</span>
          </div>
          <span className="font-cinzel text-xs font-bold tracking-widest text-amber-300/80 uppercase">Cinematic Vault</span>
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        </div>

        {/* Center Video Frame */}
        <div className="w-full max-w-3xl h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] flex flex-col items-center justify-center shadow-[0_20px_70px_rgba(0,0,0,0.9)]">
          {/* Floating Glass Frame Wrapper with Idle Breathing */}
          <motion.div
            animate={{
              y: [0, -6, 0],
              boxShadow:
                phase === 'UNLOCKING' || phase === 'FRAME_ACTIVATING'
                  ? '0 0 80px rgba(245,158,11,0.8)'
                  : '0 0 50px rgba(0,0,0,0.8)',
            }}
            transition={{
              y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
              boxShadow: { duration: 0.8 },
            }}
            className={`relative w-full h-full rounded-3xl p-2 sm:p-3 bg-neutral-900/90 border-2 sm:border-4 transition-all duration-700 flex items-center justify-center ${
              isError
                ? 'border-red-600/80 shadow-[0_0_50px_rgba(220,38,38,0.6)]'
                : phase === 'UNLOCKING' || phase === 'FRAME_ACTIVATING'
                ? 'border-amber-300 shadow-[0_0_80px_rgba(251,191,36,0.9)]'
                : 'border-amber-500/40'
            }`}
          >
          {/* Glass Edges Highlight Layer */}
          <div className="absolute inset-0 rounded-3xl border border-white/20 pointer-events-none" />

          {/* Shimmering Outline Drawing State */}
          {phase === 'FRAME_DRAWING' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 rounded-2xl bg-amber-500/10 border border-amber-400/50 animate-pulse flex items-center justify-center"
            >
              <div className="w-12 h-12 rounded-full border-2 border-amber-300 border-t-transparent animate-spin" />
            </motion.div>
          )}

          {/* LOCKED / ANSWER INPUT STATE */}
          {(phase === 'LOCK_APPEAR' ||
            phase === 'ANSWER_INPUT' ||
            phase === 'UNLOCKING' ||
            phase === 'FRAME_ACTIVATING') && (
            <div className="w-full h-full rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900 border border-amber-500/20 p-6 flex flex-col items-center justify-center text-center">
              {/* Floating Lock Icon */}
              <motion.div
                animate={
                  isError
                    ? { x: [-8, 8, -6, 6, 0] }
                    : phase === 'UNLOCKING'
                    ? { scale: [1, 1.3, 0], rotate: [0, 180, 360], opacity: [1, 1, 0] }
                    : { y: [0, -4, 0] }
                }
                transition={
                  isError
                    ? { duration: 0.4 }
                    : phase === 'UNLOCKING'
                    ? { duration: 1.2 }
                    : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                }
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 border-2 border-amber-200 flex items-center justify-center shadow-xl mb-4"
              >
                <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-950" />
              </motion.div>

              {/* Question Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-cormorant text-xl sm:text-2xl font-semibold text-amber-200 mb-4 max-w-md"
              >
                &ldquo;{lockQuestion}&rdquo;
              </motion.p>

              {/* Single Input Form */}
              <AnimatePresence>
                {(phase === 'ANSWER_INPUT' || phase === 'UNLOCKING') && (
                  <form onSubmit={handleAnswerSubmit} className="w-full max-w-xs space-y-3">
                    <input
                      type="text"
                      value={inputAnswer}
                      onChange={(e) => setInputAnswer(e.target.value)}
                      placeholder="Type your answer..."
                      disabled={phase === 'UNLOCKING'}
                      className="w-full bg-neutral-950/80 border border-amber-500/40 rounded-xl px-4 py-2.5 text-center text-amber-100 placeholder-amber-400/30 focus:outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-400/30 font-sans text-sm sm:text-base box-glow-gold"
                    />

                    <button
                      type="submit"
                      disabled={phase === 'UNLOCKING'}
                      className="w-full rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 border border-amber-300/50 py-2.5 px-4 font-sans text-xs sm:text-sm font-bold uppercase tracking-widest text-neutral-950 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>{phase === 'UNLOCKING' ? 'Unlocking...' : 'Unlock Video'}</span>
                    </button>

                    {/* <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleQuickAutofill}
                        className="text-xs font-sans text-amber-300/60 hover:text-amber-200 transition-colors"
                      >
                        ⚡ Use Demo Answer (Auto-Fill)
                      </button>
                    </div> */}
                  </form>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* VIDEO PLAYER REVEAL STATE */}
          {(phase === 'VIDEO_REVEAL' || phase === 'VIDEO_PLAYING' || phase === 'VIDEO_ENDED') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full"
            >
              <CustomVideoPlayer
                videoUrl={videoUrl}
                posterUrl={posterUrl}
                onEnded={handleVideoEnded}
              />
            </motion.div>
          )}
        </motion.div>
        </div>

        {/* Right Desktop Side Accent: Projector / Ambient Light */}
        <div className="hidden lg:flex flex-col items-center space-y-4 absolute right-0 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-95 transition-opacity duration-500 pointer-events-none pl-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-900/40 to-stone-900 border border-amber-500/30 p-3 shadow-2xl backdrop-blur-md flex flex-col items-center justify-center text-amber-300">
            <span className="text-3xl">✨</span>
          </div>
          <span className="font-cinzel text-xs font-bold tracking-widest text-amber-300/80 uppercase">Sound & Glow</span>
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        </div>
      </div>

      {/* FOOTER / AFTER VIDEO COMPLETION MESSAGE */}
      <div className="relative z-30 min-h-[4rem] flex flex-col items-center justify-center text-center px-4">
        {phase === 'VIDEO_ENDED' && showContinuePrompt && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center space-y-3"
          >
            <div className="flex items-center space-x-2 text-pink-300 font-cormorant text-lg sm:text-xl italic">
              <Heart className="w-4 h-4 fill-pink-400 stroke-pink-200 animate-pulse" />
              <span>A moment kept forever in time.</span>
            </div>

            <InteractionHint
              label="Step Into The Next Chapter"
              variant="pulse"
              onClick={handleContinueClick}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};
