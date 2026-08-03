import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Scene1Phase } from '../../types';
import { soundEngine } from '../../utils/sound';
import { BrickWallCanvas } from './BrickWallCanvas';
import { ParticleSystem } from './ParticleSystem';
import { CountdownDisplay } from './CountdownDisplay';
import { LetterReveal } from './LetterReveal';
import { FinalMessage } from './FinalMessage';

interface Scene1ContainerProps {
  onSceneComplete?: () => void;
}

export const Scene1Container: React.FC<Scene1ContainerProps> = ({ onSceneComplete }) => {
  const [phase, setPhase] = useState<Scene1Phase>('BLACK_SCREEN');
  const [countdown, setCountdown] = useState<number>(5);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasStartedUserGesture, setHasStartedUserGesture] = useState<boolean>(false);
  const isVibratingRef = useRef<boolean>(false);

  // Initialize audio on first user gesture or scene load
  const handleUserInteraction = useCallback(() => {
    if (!hasStartedUserGesture) {
      setHasStartedUserGesture(true);
      soundEngine.startAmbientHum();
    }
  }, [hasStartedUserGesture]);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  // Phase progression timeline
  useEffect(() => {
    // 1. BLACK_SCREEN -> WALL_REVEAL (2 seconds)
    const timer1 = setTimeout(() => {
      setPhase('WALL_REVEAL');
      soundEngine.startAmbientHum();
    }, 2000);

    // 2. WALL_REVEAL -> COUNTDOWN (3.2 seconds)
    const timer2 = setTimeout(() => {
      setPhase('COUNTDOWN');
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Countdown timer step logic (5 -> 4 -> 3 -> 2 -> 1 -> 0)
  useEffect(() => {
    if (phase !== 'COUNTDOWN') return;

    let currentCount = 5;
    setCountdown(currentCount);
    soundEngine.playHeartbeat(currentCount);

    const interval = setInterval(() => {
      currentCount -= 1;
      setCountdown(currentCount);

      if (currentCount > 0) {
        soundEngine.playHeartbeat(currentCount);
      } else if (currentCount === 0) {
        clearInterval(interval);
        soundEngine.playHeartbeat(0);

        // Transition to SILENCE_HOLD
        setTimeout(() => {
          soundEngine.stopAllSound();
          setPhase('SILENCE_HOLD');

          // Hold silence for 1 second, then trigger ENERGY_BURST
          setTimeout(() => {
            setPhase('ENERGY_BURST');
            soundEngine.playEnergyBurst();

            // After energy burst shatter, start LETTER_REVEAL
            setTimeout(() => {
              setPhase('LETTER_REVEAL');
            }, 1200);
          }, 1000);
        }, 800);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [phase]);

  const handleLetterSequenceComplete = useCallback(() => {
    setPhase('TITLE_FORMATION');
    setTimeout(() => {
      setPhase('CELEBRATION');
    }, 600);
  }, []);

  const handleClickBegin = useCallback(() => {
    soundEngine.playClickSound();
    setPhase('SCENE1_COMPLETE');
    if (onSceneComplete) {
      onSceneComplete();
    }
  }, [onSceneComplete]);

  // Determine wall vibration intensity during countdown
  const getVibrationClass = () => {
    if (phase === 'COUNTDOWN') {
      if (countdown <= 2) return 'animate-vibrate-intense';
      if (countdown <= 4) return 'animate-vibrate-subtle';
    }
    return '';
  };

  return (
    <div
      onClick={() => {
        handleUserInteraction();
        if (phase === 'CELEBRATION' || phase === 'SCENE1_COMPLETE') {
          handleClickBegin();
        }
      }}
      className={`relative w-full h-full bg-black overflow-hidden select-none cursor-pointer ${getVibrationClass()}`}
    >
      {/* Audio Mute/Unmute Toggle */}
      <button
        onClick={toggleAudio}
        aria-label="Toggle Sound"
        className="absolute top-20 right-4 z-30 p-3 rounded-full bg-black/40 border border-amber-500/30 text-amber-300/80 hover:text-amber-200 hover:border-amber-400 backdrop-blur-md transition-all duration-300 box-glow-gold focus:outline-none"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      {/* Layer 0: Brick Wall Canvas & Destruction Physics */}
      <BrickWallCanvas phase={phase} countdown={countdown} />

      {/* Layer 1: Atmospheric Dust & Celebration Particles */}
      <ParticleSystem phase={phase} countdown={countdown} />

      {/* Layer 2: Digital Countdown Display (5, 4, 3, 2, 1, 0) */}
      <CountdownDisplay countdown={countdown} isVisible={phase === 'COUNTDOWN'} />

      {/* Layer 3: Sequential Letter Reveal & Title Alignment */}
      <LetterReveal
        phase={phase}
        onSequenceComplete={handleLetterSequenceComplete}
      />

      {/* Layer 4: Final Subtitle & Action Prompt */}
      <FinalMessage phase={phase} onClickBegin={handleClickBegin} />

      {/* Golden Pulse Light Flash overlay during ENERGY_BURST */}
      {phase === 'ENERGY_BURST' && (
        <div className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-r from-amber-200/40 via-white/70 to-amber-200/40 animate-ping opacity-75 transition-opacity duration-700" />
      )}
    </div>
  );
};
