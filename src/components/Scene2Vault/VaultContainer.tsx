import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scene2Phase, MemoryItem } from '../../types';
import { VaultDoor } from './VaultDoor';
import { AuthInputs } from './AuthInputs';
import { MemoryGrid } from './MemoryGrid';
import { EnvelopeModal } from './EnvelopeModal';
import { Scene2Completion } from './Scene2Completion';
import { memoryPoolService } from '../../utils/memoryPool';
import { soundEngine } from '../../utils/sound';

interface VaultContainerProps {
  onScene2Complete: () => void;
}

const CORRECT_BIRTHDAY_1 = "2004-11-08";
const CORRECT_BIRTHDAY_2 = "2004-03-28";

export const VaultContainer: React.FC<VaultContainerProps> = ({ onScene2Complete }) => {
  const [phase, setPhase] = useState<Scene2Phase>('TRANSITION_SPIRAL');
  const [isError, setIsError] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [exploredIds, setExploredIds] = useState<number[]>([]);
  const [memories] = useState<MemoryItem[]>(() => memoryPoolService.generateVaultMemories(6));

  // Phase sequence timeline
  useEffect(() => {
    if (phase === 'TRANSITION_SPIRAL') {
      const timer = setTimeout(() => {
        setPhase('VAULT_APPEAR');
      }, 1200);
      return () => clearTimeout(timer);
    }

    if (phase === 'VAULT_APPEAR') {
      const timer = setTimeout(() => {
        setPhase('AUTH_FORM');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Handle Auth submission
  const handleUnlockAttempt = (d1: string, d2: string) => {
    // If either is empty and not quick filled, gentle error shake
    if (
    d1 !== CORRECT_BIRTHDAY_1 ||
    d2 !== CORRECT_BIRTHDAY_2
) {

    soundEngine.playVaultError();

    setIsError(true);

    if (navigator.vibrate) {
        navigator.vibrate([100,50,100]);
    }

    setTimeout(() => {
        setIsError(false);
    },800);

    return;
}

    // Trigger unlocking sequence
    setIsError(false);
    setPhase('UNLOCKING_ANIMATION');
    soundEngine.playVaultUnlock();

    // After gears turn, heavy doors swing open
    setTimeout(() => {
      setPhase('VAULT_DOORS_OPEN');
      soundEngine.playDoorsOpen();

      // Envelopes float out
      setTimeout(() => {
        setPhase('ENVELOPES_ARRIVE');

        setTimeout(() => {
          setPhase('ENVELOPES_INTERACTIVE');
        }, 1200);
      }, 1500);
    }, 1400);
  };

  // Handle Envelope Selection
  const handleSelectEnvelope = (mem: MemoryItem) => {
    setSelectedMemory(mem);
    if (!exploredIds.includes(mem.id)) {
      setExploredIds((prev) => [...prev, mem.id]);
    }
  };

  // Handle Envelope Close
  const handleCloseEnvelope = () => {
    setSelectedMemory(null);

    // Check if all 6 envelopes explored
    if (exploredIds.length >= memories.length && phase === 'ENVELOPES_INTERACTIVE') {
      setTimeout(() => {
        setPhase('SCENE2_ALL_EXPLORED');
      }, 800);
    }
  };

  return (
    <div className="relative w-full h-full bg-stone-950 text-amber-100 flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto pt-10 pb-10 sm:pb-6 px-4 select-none">
      {/* Background Volumetric Fog & Subtle Dust Particles */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(120,53,15,0.25)_0%,_rgba(10,10,10,0.95)_80%)] pointer-events-none z-0" />

      {/* Floating Dust Particle Canvas Overlay */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Center Vault Section */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl mt-8 mb-10">
        {/* Vault Unlocking Entrance / Auth Layout (Split view on Desktop, Stacked on Mobile) */}
        {(phase === 'TRANSITION_SPIRAL' ||
          phase === 'VAULT_APPEAR' ||
          phase === 'AUTH_FORM' ||
          phase === 'UNLOCKING_ANIMATION' ||
          phase === 'VAULT_DOORS_OPEN') && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center justify-center">
            {/* Left Side: Storytelling & Auth Inputs */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1"
            >
              <AnimatePresence>
                {(phase === 'AUTH_FORM' || phase === 'UNLOCKING_ANIMATION') && (
                  <AuthInputs
                    onUnlockAttempt={handleUnlockAttempt}
                    isUnlocking={phase === 'UNLOCKING_ANIMATION'}
                  />
                )}
              </AnimatePresence>
            </motion.div>

            {/* Right Side: Animated 3D Vault Door */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex items-center justify-center order-1 lg:order-2"
            >
              <VaultDoor phase={phase} isError={isError} />
            </motion.div>
          </div>
        )}

        {/* Memory Grid (revealed after vault doors open) */}
        {(phase === 'ENVELOPES_ARRIVE' ||
          phase === 'ENVELOPES_INTERACTIVE' ||
          phase === 'SCENE2_ALL_EXPLORED' ||
          phase === 'SCENE2_COMPLETE') && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="w-full flex flex-col items-center"
          >
            {/* Header for Memory Vault */}
            <div className="text-center mt-18 mb-7">
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-200 tracking-wider text-glow-gold">
                The Memory Envelopes
              </h3>
              <p className="font-cormorant text-sm sm:text-base italic text-amber-100/70">
                Select an envelope to reveal a precious moment. ({exploredIds.length} of {memories.length} Unlocked)
              </p>
            </div>

            <MemoryGrid
              memories={memories}
              exploredIds={exploredIds}
              onSelectEnvelope={handleSelectEnvelope}
            />
          </motion.div>
        )}
      </div>

      {/* Envelope Modal */}
      <EnvelopeModal memory={selectedMemory} onClose={handleCloseEnvelope} />

      {/* Completion Scene Message when all 6 explored */}
      {phase === 'SCENE2_ALL_EXPLORED' && (
        <Scene2Completion
          onContinue={() => {
            setPhase('SCENE2_COMPLETE');
            onScene2Complete();
          }}
        />
      )}
    </div>
  );
};
