import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, CheckCircle2, ShieldCheck, Feather } from 'lucide-react';
import { DeskEnvironment } from '../LivingLetter/DeskEnvironment';
import { WaxSealAnimation } from '../LivingLetter/WaxSealAnimation';
import { savePromiseAcceptance } from '../../lib/supabase';
import { soundEngine } from '../../utils/sound';

interface FriendshipPromiseSceneProps {
  chapterBadge?: string;
  title?: string;
  promiseParagraph?: string;
  personAName?: string;
  personBName?: string;
  onComplete: () => void;
}

export const FriendshipPromiseScene: React.FC<FriendshipPromiseSceneProps> = ({
  chapterBadge = 'CHAPTER 10 • THE FRIENDSHIP PROMISE',
  title = 'Our Sacred Friendship Promise',
  promiseParagraph = 'We promise to stand by each other through all seasons of life, sharing every joy, holding each other up in hard times, and nurturing this sacred bond of friendship with honesty, loyalty, and unconditional love. Distance may separate our footsteps, but our hearts remain forever connected.',
  personAName = 'Me',
  personBName = 'My Best Friend',
  onComplete,
}) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isFolding, setIsFolding] = useState(false);
  const [isSealed, setIsSealed] = useState(false);
  const [fallingHearts, setFallingHearts] = useState<
    { id: number; x: number; delay: number; scale: number; speed: number }[]
  >([]);

  // Generate falling hearts on acceptance
  useEffect(() => {
    if (isAccepted) {
      const hearts = Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: Math.random() * 90 + 5, // percent
        delay: Math.random() * 1.5,
        scale: Math.random() * 0.6 + 0.6,
        speed: Math.random() * 3 + 3,
      }));
      setFallingHearts(hearts);
    }
  }, [isAccepted]);

  const handleAcceptPromise = async () => {
    if (isAccepted) return;

    soundEngine.playHeartbeat(1);
    setIsAccepted(true);

    // Save acceptance to Supabase
    await savePromiseAcceptance(promiseParagraph, `${personAName} & ${personBName}`);

    // Sequence: Golden ink stroke -> Glow -> Heartbeat -> Origami fold -> Wax Seal -> Transition
    setTimeout(() => {
      soundEngine.playPageFlip();
      setIsFolding(true);
    }, 1800);

    setTimeout(() => {
      soundEngine.playVaultUnlock();
      setIsSealed(true);
    }, 3200);

    setTimeout(() => {
      onComplete();
    }, 5000);
  };

  return (
    <DeskEnvironment>
      {/* Falling Golden Hearts Canvas / Animation */}
      {isAccepted && (
        <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
          {fallingHearts.map((h) => (
            <motion.div
              key={h.id}
              initial={{ y: '-10vh', opacity: 0, x: `${h.x}vw` }}
              animate={{ y: '110vh', opacity: [0, 0.9, 0.9, 0] }}
              transition={{
                duration: h.speed,
                delay: h.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"
              style={{ scale: h.scale }}
            >
              <Heart className="w-5 h-5 fill-amber-300/80" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Header Badge */}
      <div className="text-center mt-2 mb-6">
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
          {title}
        </motion.h2>
      </div>

      {/* MAIN PROMISE PAPER CONTAINER */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 40 }}
        animate={{
          opacity: 1,
          scale: isFolding ? [1, 0.9, 0.85] : 1,
          rotateX: isFolding ? [0, 15, 60, 90] : [0, 1, -1, 0],
          y: isFolding ? [0, -20, 20] : 0,
        }}
        transition={{
          duration: isFolding ? 1.4 : 6,
        
          ease: 'easeInOut',
        }}
        className={`relative w-full max-w-2xl bg-amber-50/95 text-neutral-900 rounded-2xl border-4 p-4 sm:p-8 md:p-10 my-2 sm:my-4 shadow-[0_30px_70px_rgba(0,0,0,0.85)] flex flex-col justify-between transition-all duration-700 scene-card custom-scrollbar ${
          isAccepted
            ? 'border-amber-400/90 shadow-[0_0_50px_rgba(245,158,11,0.5)]'
            : 'border-amber-200/80'
        }`}
        style={{
          backgroundImage:
            'radial-gradient(#d97706 0.5px, transparent 0.5px), radial-gradient(#d97706 0.5px, #fffbeb 0.5px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px',
        }}
      >
        {/* Parchment Fiber Texture Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(180,83,9,0.06)_100%)] pointer-events-none" />

        {/* Paper Header */}
        <div className="w-full border-b-2 border-amber-300/60 pb-4 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-amber-800" />
            <span className="font-sans text-xs font-extrabold uppercase tracking-widest text-amber-900/80">
              Covenant of Friendship
            </span>
          </div>

          <div className="flex items-center space-x-1.5 text-xs font-sans text-amber-900/80 font-bold">
            <Feather className="w-4 h-4 text-amber-700" />
            <span>{personAName} & {personBName}</span>
          </div>
        </div>

        {/* PROMISE PARAGRAPH CONTENT (Unlimited length supported) */}
        <div className="w-full min-h-[200px] max-h-[400px] overflow-y-auto pr-2 py-2 my-2 custom-scrollbar">
          <p className="font-cormorant text-2xl sm:text-3xl leading-relaxed italic font-medium text-neutral-900 text-center sm:text-left whitespace-pre-wrap">
            &ldquo;{promiseParagraph}&rdquo;
          </p>
        </div>

        {/* GOLDEN INK ANIMATED STROKE AT BOTTOM */}
        <div className="relative w-full h-2 my-4 rounded-full bg-amber-200/60 overflow-hidden">
          {isAccepted && (
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-300 shadow-[0_0_12px_rgba(245,158,11,1)] rounded-full"
            />
          )}
        </div>

        {/* PROMISE CONFIRMATION ACTION */}
        <div className="w-full border-t-2 border-amber-300/60 pt-6 mt-4 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {!isAccepted ? (
              <motion.button
                key="accept-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAcceptPromise}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-amber-100 border-2 border-amber-400/50 shadow-[0_10px_30px_rgba(180,83,9,0.5)] font-sans text-sm font-bold uppercase tracking-widest hover:border-amber-300 hover:text-white transition-all flex items-center space-x-3 group"
              >
                <Heart className="w-5 h-5 text-amber-300 fill-amber-300/80 group-hover:scale-125 transition-transform" />
                <span>I Accept This Friendship Promise</span>
              </motion.button>
            ) : (
              <motion.div
                key="accepted-status"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-3 text-amber-900 font-sans text-sm font-bold uppercase tracking-widest bg-amber-200/80 px-6 py-3 rounded-full border border-amber-400/60 shadow-md"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>Promise Forever Sealed</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Wax Seal Overlay when folded */}
        {isSealed && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute inset-0 bg-amber-950/80 backdrop-blur-md flex flex-col items-center justify-center z-40"
          >
            <WaxSealAnimation isSaving={false} />
            <p className="font-cinzel text-xl font-bold text-amber-200 tracking-wider mt-4">
              Eternal Covenant Preserved
            </p>
          </motion.div>
        )}
      </motion.div>
    </DeskEnvironment>
  );
};
