import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, RotateCcw, Feather, ShieldCheck } from 'lucide-react';
import { soundEngine } from '../../utils/sound';
// NOTE: adjust this import path to match where memoryPoolService actually lives in your project
// (e.g. '../../services/memoryPoolService' or '../../lib/memoryPoolService').
import { memoryPoolService } from '../../utils/memoryPool';

interface FinaleSceneProps {
  finaleSentence?: string;
  heroImageUrl?: string;
  chapterBadge?: string;
  onRestartJourney: () => void;
}

type MemoryLoopStage =
  | 'LIVE_FINALE'
  | 'FREEZE_TIME'
  | 'POLAROID_TRANSFORM'
  | 'DESK_REVEAL'
  | 'SLIDE_WALL_TRANSITION'
  | 'COMPLETED';

// Ken Burns motion presets — one per collage tile, each with its own duration,
// drift and micro-rotation so the six tiles never feel synchronized.
const KEN_BURNS_VARIANTS = [
  { scale: [1, 1.15, 1.05], x: [0, 10, -5], y: [0, -8, 4], rotate: [0, 1.4, -1], duration: 14 },
  { scale: [1.05, 1, 1.12], x: [0, -8, 6], y: [0, 6, -6], rotate: [0, -1.1, 1.2], duration: 16 },
  { scale: [1, 1.1, 1], x: [0, 6, -8], y: [0, -5, 8], rotate: [0, 1, -1.5], duration: 13 },
  { scale: [1.08, 1, 1.1], x: [0, -6, 10], y: [0, 8, -4], rotate: [0, -1.5, 1], duration: 17 },
  { scale: [1, 1.12, 1.04], x: [0, 8, -6], y: [0, -6, 6], rotate: [0, 1.2, -1], duration: 15 },
  { scale: [1.06, 1, 1.14], x: [0, -10, 5], y: [0, 5, -8], rotate: [0, -1, 1.5], duration: 18 },
] as const;

// Static ambient dust motes — generated once, purely decorative, GPU-cheap.
const DUST_PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: Math.round((Math.random() * 100 + i * 3) % 100),
  top: Math.round(Math.random() * 100),
  size: Math.random() * 2 + 1,
  duration: Math.random() * 10 + 14,
  delay: Math.random() * 6,
}));

export const FinaleScene: React.FC<FinaleSceneProps> = ({
  finaleSentence = 'Every smile, every tear, every late-night conversation, every promise, every challenge, every memory, and every photograph became part of something much bigger than either of us.\n\nThey became our story—a story that time may age, but never erase.',
  heroImageUrl, // retained in the prop signature for interface compatibility; the hero no longer renders it
  chapterBadge = 'CHAPTER 13 • FOREVER BEGINS HERE',
  onRestartJourney,
}) => {
  const [stage, setStage] = useState<MemoryLoopStage>('LIVE_FINALE');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate the memory-wall collage exactly once per mount (i.e. once per page load).
  // Never regenerated on rerender — only a hard refresh produces a new set.
  const [collagePhotos] = useState<string[]>(() => [
    memoryPoolService.getNextPhoto(),
    memoryPoolService.getNextPhoto(),
    memoryPoolService.getNextPhoto(),
    memoryPoolService.getNextPhoto(),
    memoryPoolService.getNextPhoto(),
    memoryPoolService.getNextPhoto(),
  ]);

  const isCollageMode = stage === 'LIVE_FINALE' || stage === 'FREEZE_TIME';
  const finaleParagraphs = finaleSentence.split('\n\n').filter(Boolean);

  // Background Environment Particle & Firefly Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    // Fireflies & Stars
    const fireflyCount = 35;
    const fireflies = Array.from({ length: fireflyCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 2.5 + 1,
      alpha: Math.random() * 0.8 + 0.2,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      pulseSpeed: Math.random() * 0.03 + 0.01,
    }));

    // Fireworks
    const fireworks: { x: number; y: number; particles: { x: number; y: number; vx: number; vy: number; alpha: number; color: string }[] }[] = [];

    const createFirework = () => {
      const x = Math.random() * (window.innerWidth * 0.8) + window.innerWidth * 0.1;
      const y = Math.random() * (window.innerHeight * 0.4) + window.innerHeight * 0.1;
      const colors = ['#fef08a', '#f59e0b', '#fb7185', '#38bdf8', '#c084fc'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const particles = Array.from({ length: 20 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 0.5;
        return {
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
        };
      });
      fireworks.push({ x, y, particles });
    };

    let lastFireworkTime = Date.now();

    const render = () => {
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Random occasional distant firework
      if (stage === 'LIVE_FINALE' && Date.now() - lastFireworkTime > 3500) {
        if (Math.random() > 0.4) createFirework();
        lastFireworkTime = Date.now();
      }

      // Draw & update fireflies
      fireflies.forEach((f) => {
        if (stage !== 'FREEZE_TIME' && stage !== 'POLAROID_TRANSFORM') {
          f.x += f.vx;
          f.y += f.vy;
          f.alpha += Math.sin(Date.now() * f.pulseSpeed) * 0.01;

          if (f.x < 0) f.x = canvas.width;
          if (f.x > canvas.width) f.x = 0;
          if (f.y < 0) f.y = canvas.height;
          if (f.y > canvas.height) f.y = 0;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, f.alpha));
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw fireworks
      fireworks.forEach((fw, fwIndex) => {
        fw.particles.forEach((p) => {
          if (stage !== 'FREEZE_TIME') {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.012;
          }

          if (p.alpha > 0) {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });

        if (fw.particles.every((p) => p.alpha <= 0)) {
          fireworks.splice(fwIndex, 1);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [stage]);

  // Handle "Restart Our Journey" Cinematic Sequence
  const handleRestartClick = () => {
    if (isButtonDisabled) return;

    soundEngine.playClickSound();
    setIsButtonDisabled(true);

    // 1) Memory Freeze (~1 sec)
    setStage('FREEZE_TIME');

    // 2) Polaroid Transform
    setTimeout(() => {
      soundEngine.playPageFlip();
      setStage('POLAROID_TRANSFORM');
    }, 1100);

    // 3) Zoom back to Memory Desk
    setTimeout(() => {
      soundEngine.playVaultUnlock();
      setStage('DESK_REVEAL');
    }, 2800);

    // 4) Slide Memory Across Desk -> Fade to Wall
    setTimeout(() => {
      soundEngine.playDoorsOpen();
      setStage('SLIDE_WALL_TRANSITION');
    }, 4500);

    // 5) Reset to Scene 1
    setTimeout(() => {
      setStage('COMPLETED');
      onRestartJourney();
    }, 6200);
  };

  return (
    <div className="relative w-full min-h-screen bg-neutral-950 text-amber-100 flex flex-col items-center overflow-x-hidden select-none pt-4 pb-16 px-4 sm:px-6 lg:px-10">
      {/* BACKGROUND SKY CANVAS: Sunset to Starry Evening */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(217,119,6,0.35)_0%,_rgba(30,27,75,0.7)_50%,_rgba(10,10,15,1)_100%)] pointer-events-none z-0" />

      {/* Slow-breathing vignette + ambient gold glow (very subtle, cheap CSS-only animation) */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-[1] bg-[radial-gradient(ellipse_at_center,_transparent_35%,_rgba(0,0,0,0.55)_100%)]"
        animate={{ opacity: [0.7, 0.95, 0.7] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="fixed inset-0 pointer-events-none z-[1] bg-[radial-gradient(ellipse_at_50%_30%,_rgba(245,158,11,0.12)_0%,_transparent_60%)]"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Floating ambient dust particles */}
      <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
        {DUST_PARTICLES.map((d) => (
          <motion.span
            key={d.id}
            className="absolute rounded-full bg-amber-200/40"
            style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size }}
            animate={{ y: [0, -22, 0], opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />

      {/* STAGE: LIVE FINALE & POLAROID MEMORY TRANSFORMATION */}
      <div className="relative z-20 w-full max-w-6xl mx-auto flex flex-col items-center justify-start gap-5 py-4">
        {/* Header Badge */}
        <div className="text-center mt-2 mb-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: stage === 'SLIDE_WALL_TRANSITION' ? 0 : 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-400/30 px-4 py-1 rounded-full text-xs font-sans font-bold tracking-widest text-amber-300 uppercase mb-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{chapterBadge}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: stage === 'SLIDE_WALL_TRANSITION' ? 0 : 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-100 tracking-wider text-glow-gold"
          >
            Forever Begin Here 
          </motion.h2>
        </div>

        {/* HERO VISUAL FRAME / POLAROID CONTAINER */}
        <motion.div
          animate={{
            scale:
              stage === 'DESK_REVEAL'
                ? 0.55
                : stage === 'SLIDE_WALL_TRANSITION'
                ? [0.55, 0.3, 0]
                : stage === 'POLAROID_TRANSFORM'
                ? 0.82
                : 1,
            rotateZ:
              stage === 'DESK_REVEAL'
                ? -6
                : stage === 'SLIDE_WALL_TRANSITION'
                ? -25
                : 0,
            y: stage === 'DESK_REVEAL' ? 20 : 0,
          }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className={`relative w-full max-w-5xl h-[55vh] min-h-[350px] max-h-[620px] rounded-3xl transition-all duration-1000 overflow-hidden flex flex-col items-center justify-end ${
            stage === 'POLAROID_TRANSFORM' || stage === 'DESK_REVEAL' || stage === 'SLIDE_WALL_TRANSITION'
              ? 'bg-amber-50 p-4 sm:p-6 pb-12 shadow-[0_30px_90px_rgba(0,0,0,0.95)] border-8 border-stone-100/90 rounded-xl'
              : 'border-2 border-amber-400/40 shadow-[0_25px_60px_rgba(0,0,0,0.85)]'
          }`}
        >
          {/* Main Visual Content: Memory-Wall Collage, or the single Polaroid frame it becomes */}
          <div className="relative w-full flex-1 rounded-2xl overflow-hidden flex items-end justify-center bg-gradient-to-b from-indigo-950 via-purple-950 to-amber-950">
            {isCollageMode ? (
              <>
                {/* MEMORY WALL COLLAGE — 6 photos, 3x2 desktop / 2x3 mobile */}
                <div className="absolute inset-0 grid grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-2 p-3">
  {Array.from({ length: 6 }).map((_, i) => {

    // CENTER TILE
    if (i === 1) {
      return (
        <motion.div
          key="title-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: stage === 'FREEZE_TIME' ? 0 : 1,
            scale: 1
          }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative rounded-2xl border border-amber-300/25 bg-gradient-to-br from-neutral-950 via-black to-amber-950 overflow-hidden flex flex-col items-center justify-center text-center p-6"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15),transparent_70%)]" />

          <h3 className="relative z-10 font-cinzel text-2xl md:text-4xl font-extrabold text-white text-glow-gold">
            Our Journey
          </h3>

          <p className="relative z-10 mt-4 max-w-xs font-cormorant text-base md:text-xl italic text-amber-100/90 leading-relaxed">
            Every picture holds a memory.
            <br />
            Together they tell our forever.
          </p>
        </motion.div>
      );
    }

    const photoIndex = i > 1 ? i - 1 : i;

    const kb =
      KEN_BURNS_VARIANTS[
        photoIndex % KEN_BURNS_VARIANTS.length
      ];

    return (
      <motion.div
        key={photoIndex}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.9,
          delay: photoIndex * 0.12,
          ease: [0.16, 1, 0.3, 1]
        }}
        className="relative rounded-2xl overflow-hidden border border-amber-300/25 shadow-[0_10px_30px_rgba(0,0,0,0.55)] bg-neutral-900"
      >
        <motion.img
          src={collagePhotos[photoIndex]}
          alt="Shared memory"
          className="w-full h-full object-contain object-center bg-neutral-950"
          animate={{
            scale: kb.scale,
            x: kb.x,
            y: kb.y,
            rotate: kb.rotate
          }}
          transition={{
            duration: kb.duration,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut'
          }}
        />
      </motion.div>
    );
  })}
</div>

                {/* Readability overlay: top/bottom gradient + subtle vignette + gold ambient glow */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/70 via-black/10 to-black/75" />
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.45)_100%)]" />
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_35%,_rgba(245,158,11,0.16)_0%,_transparent_65%)]" />
              </>
            ) : (
              /* Collage collapses into a single Polaroid photograph for the restart sequence */
              <img
src={collagePhotos[0]}
alt="Our eternal memory"
className="w-full h-full object-contain object-center bg-neutral-900"
/>
            )}
          </div>

          {/* Polaroid Caption Footer when in memory mode */}
          {(stage === 'POLAROID_TRANSFORM' || stage === 'DESK_REVEAL' || stage === 'SLIDE_WALL_TRANSITION') && (
            <div className="w-full pt-3 text-center">
              <p className="font-cormorant text-xl font-bold italic text-neutral-900">
                &ldquo;Our Eternal Memory&rdquo;
              </p>
            </div>
          )}
        </motion.div>

        {/* EDITABLE PLACEHOLDER SENTENCE */}
        <div className="text-center mt-5 mb-4 max-w-3xl px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: stage === 'SLIDE_WALL_TRANSITION' ? 0 : 1 }}
            transition={{ duration: 1 }}
            className="font-cormorant text-xl sm:text-2xl md:text-3xl italic font-semibold text-amber-200 leading-relaxed text-glow-gold space-y-3"
          >
            {finaleParagraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </motion.div>
        </div>

        {/* RESTART OUR JOURNEY BUTTON */}
        <div className="mb-10 z-30">
          <motion.button
            whileHover={{ scale: isButtonDisabled ? 1 : 1.08 }}
            whileTap={{ scale: isButtonDisabled ? 1 : 0.94 }}
            disabled={isButtonDisabled}
            onClick={handleRestartClick}
            className={`px-8 py-4 rounded-full font-sans text-xs sm:text-sm font-extrabold uppercase tracking-widest transition-all duration-500 shadow-[0_0_35px_rgba(245,158,11,0.6)] flex items-center space-x-3 ${
              isButtonDisabled
                ? 'bg-amber-900/40 text-amber-300/50 border border-amber-500/20 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-neutral-950 border-2 border-amber-300 hover:border-white hover:shadow-[0_0_50px_rgba(245,158,11,0.9)] animate-pulse'
            }`}
          >
            <RotateCcw className="w-5 h-5 text-neutral-950" />
            <span>RELIVE OUR STORY</span>
          </motion.button>
        </div>
      </div>

      {/* MEMORY DESK OVERLAY OBJECTS (When in DESK_REVEAL stage) */}
      <AnimatePresence>
        {(stage === 'DESK_REVEAL' || stage === 'SLIDE_WALL_TRANSITION') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-40 bg-[radial-gradient(ellipse_at_center,_rgba(120,53,15,0.8)_0%,_rgba(28,25,23,0.98)_70%)] flex items-center justify-center overflow-hidden"
          >
            {/* Nostalgic Desk Accessories around Polaroid */}
            <div className="absolute top-12 left-12 p-4 bg-amber-100/90 text-neutral-900 rounded-lg shadow-2xl -rotate-12 border border-amber-300 font-cormorant text-xs italic">
              <Feather className="w-4 h-4 text-amber-800 mb-1" />
              <span>&quot;Bound by heart...&quot;</span>
            </div>

            <div className="absolute bottom-16 right-16 p-3 bg-amber-950/80 border border-amber-400/40 text-amber-200 rounded-full shadow-2xl flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest">
                Preserved Forever
              </span>
            </div>

            <div className="absolute bottom-20 left-16 text-amber-300/40 font-cormorant text-3xl italic">
              <Heart className="w-12 h-12 fill-amber-300/20" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
