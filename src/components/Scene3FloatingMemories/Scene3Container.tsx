import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { BubbleData, BubbleContentType } from '../../types';
import { SoapBubble } from './SoapBubble';
import { BubbleParticlesCanvas } from './BubbleParticlesCanvas';
import { RevealedContentOverlay, ActiveReveal } from './RevealedContentOverlay';
import { Scene3Completion } from './Scene3Completion';
import { memoryPoolService } from '../../utils/memoryPool';
import { APP_CONFIG } from '../../data/memories';
import { soundEngine } from '../../utils/sound';

interface Scene3ContainerProps {
  onScene3Complete: () => void;
}

const CONTENT_TYPES: BubbleContentType[] = ['IMAGE', 'MESSAGE', 'HEARTS', 'NONE', 'IMAGE', 'MESSAGE'];

export const Scene3Container: React.FC<Scene3ContainerProps> = ({ onScene3Complete }) => {
  const [bubbles, setBubbles] = useState<BubbleData[]>([]);
  const [burstEvent, setBurstEvent] = useState<{ x: number; y: number } | null>(null);
  const [reveals, setReveals] = useState<ActiveReveal[]>([]);
  const [discoveredCount, setDiscoveredCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Generate a random bubble object
  const createRandomBubble = useCallback((id: string, initialY?: number): BubbleData => {
    const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    let pixelSize = 75;
    if (size === 'small') pixelSize = 50 + Math.random() * 15;
    if (size === 'medium') pixelSize = 75 + Math.random() * 20;
    if (size === 'large') pixelSize = 105 + Math.random() * 25;

    const contentType = CONTENT_TYPES[Math.floor(Math.random() * CONTENT_TYPES.length)];

    let contentData;
    if (contentType === 'IMAGE') {
      contentData = {
        imageUrl: memoryPoolService.getNextPhoto(),
      };
    } else if (contentType === 'MESSAGE') {
      contentData = {
        message: memoryPoolService.getNextBubbleCaption(),
      };
    }

    return {
      id,
      x: 8 + Math.random() * 84, // percentage
      y: initialY !== undefined ? initialY : -15 - Math.random() * 20, // start below viewport
      size,
      pixelSize,
      speedY: 12 + Math.random() * 10,
      speedX: 3 + Math.random() * 4,
      swayAmplitude: 15 + Math.random() * 25,
      swayPhase: Math.random() * Math.PI * 2,
      contentType,
      contentData,
    };
  }, []);

  // Initialize bubbles field
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 9 : 14;
    const initialBubbles: BubbleData[] = [];

    for (let i = 0; i < count; i++) {
      // Distribute vertically across screen
      const startY = (i / count) * 90;
      initialBubbles.push(createRandomBubble(`bubble-init-${i}`, startY));
    }

    setBubbles(initialBubbles);
  }, [createRandomBubble]);

  // Handle Bubble Pop
  const handlePop = (bubble: BubbleData, clientX: number, clientY: number) => {
    soundEngine.playBubblePop();
    setBurstEvent({ x: clientX, y: clientY });

    // Remove popped bubble and spawn a new one from bottom
    setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));

    setTimeout(() => {
      setBubbles((prev) => [...prev, createRandomBubble(`bubble-${Date.now()}-${Math.random()}`)]);
    }, 1200);

    // If bubble contains a surprise
    if (bubble.contentType !== 'NONE') {
      const newReveal: ActiveReveal = {
        id: `reveal-${Date.now()}`,
        type: bubble.contentType as 'IMAGE' | 'MESSAGE' | 'HEARTS',
        x: clientX,
        y: clientY,
        data: bubble.contentData,
      };

      setReveals((prev) => [...prev, newReveal]);
      setDiscoveredCount((prev) => prev + 1);
    }
  };

  // Remove reveal item after animation
  const handleRevealFinished = (id: string) => {
    setReveals((prev) => prev.filter((r) => r.id !== id));
  };

  // Check completion trigger
  useEffect(() => {
    if (discoveredCount >= APP_CONFIG.bubbleCompletionCount && !isFinished) {
      const timer = setTimeout(() => {
        setIsFinished(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [discoveredCount, isFinished]);

  return (
    <div className="relative w-full min-h-screen bg-slate-950 text-indigo-100 overflow-hidden flex flex-col items-center justify-between select-none py-8">
      {/* Dreamy Night Atmosphere Background Gradient & Aurora */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950/60 to-indigo-950 pointer-events-none z-0" />

      {/* Faint Aurora Lighting Rays */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_rgba(168,85,247,0.4)_0%,_rgba(56,189,248,0.2)_50%,_transparent_100%)] pointer-events-none z-0 animate-pulse" />

      {/* Particle Canvas for Burst Sparkles & Ambient Star Dust */}
      <BubbleParticlesCanvas burstEvent={burstEvent} />

      {/* Title Header Overlay */}
      <div className="relative z-30 text-center mt-4 px-4 pointer-events-none">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-extrabold text-pink-200 tracking-wider text-glow-gold mb-1"
        >
          Floating Memories
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-cormorant text-base sm:text-lg italic text-purple-200 font-normal"
        >
          Pop the floating bubbles to uncover hidden moments. ({discoveredCount} of {APP_CONFIG.bubbleCompletionCount} Found)
        </motion.p>
      </div>

      {/* Floating Soap Bubbles Layer */}
      <div className="absolute inset-0 z-20 pointer-events-auto overflow-hidden">
        {bubbles.map((bubble) => (
          <SoapBubble key={bubble.id} bubble={bubble} onPop={handlePop} />
        ))}
      </div>

      {/* Revealed Content Overlay (Photos, Note Cards, Hearts) */}
      <RevealedContentOverlay
        reveals={reveals}
        onRevealFinished={handleRevealFinished}
      />

      {/* Scene Completion Glow & Quote */}
      {isFinished && <Scene3Completion onContinue={onScene3Complete} />}
    </div>
  );
};
