import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, MapPin, ChevronDown, Sparkles, Heart } from 'lucide-react';
import { ActiveScene } from '../types';
import { soundEngine } from '../utils/sound';

interface NavigationOverlayProps {
  activeScene: ActiveScene;
  onSelectScene: (scene: ActiveScene) => void;
}

const CHAPTERS: { id: ActiveScene; title: string; subtitle: string }[] = [
  { id: 'SCENE_1', title: 'Chapter 01', subtitle: 'The Invitation' },
  { id: 'SCENE_2', title: 'Chapter 02', subtitle: 'The Memory Vault' },
  { id: 'SCENE_3', title: 'Chapter 03', subtitle: 'Floating Memories' },
  { id: 'SCENE_4', title: 'Chapter 04', subtitle: 'Video From Me' },
  { id: 'SCENE_5', title: 'Chapter 05', subtitle: 'Video From Best Friend' },
  { id: 'SCENE_6', title: 'Chapter 06', subtitle: 'Letter From Me' },
  { id: 'SCENE_7', title: 'Chapter 07', subtitle: 'Letter From Best Friend' },
  { id: 'SCENE_8', title: 'Chapter 08', subtitle: 'Award For Best Friend' },
  { id: 'SCENE_9', title: 'Chapter 09', subtitle: 'Award For Me' },
  { id: 'SCENE_10', title: 'Chapter 10', subtitle: 'The Friendship Promise' },
  { id: 'SCENE_11', title: 'Chapter 11', subtitle: 'The Two Questions' },
  { id: 'SCENE_12', title: 'Chapter 12', subtitle: 'The Result' },
  { id: 'SCENE_13', title: 'Chapter 13', subtitle: 'Eternal Bound' },
];

export const NavigationOverlay: React.FC<NavigationOverlayProps> = ({
  activeScene,
  onSelectScene,
}) => {
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const currentChapter = CHAPTERS.find((c) => c.id === activeScene) || CHAPTERS[0];

  // Close the dropdown on outside click or Escape
  useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const toggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleSelect = (scene: ActiveScene) => {
    soundEngine.playClickSound();
    onSelectScene(scene);
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed top-4 inset-x-4 z-50 flex items-center justify-between gap-2 pointer-events-none select-none">
      {/* CHAPTER INDICATOR & QUICK MENU DROP-DOWN */}
      <div ref={menuRef} className="relative min-w-0 pointer-events-auto">
        <button
          onClick={() => {
            soundEngine.playClickSound();
            setIsMenuOpen(!isMenuOpen);
          }}
          aria-haspopup="true"
          aria-expanded={isMenuOpen}
          className="flex items-center min-w-0 max-w-[70vw] sm:max-w-none space-x-2 sm:space-x-2.5 px-3 sm:px-4 py-2 rounded-full bg-neutral-900/80 backdrop-blur-md border border-amber-500/30 text-amber-200 hover:text-white hover:border-amber-400/60 shadow-[0_8px_25px_rgba(0,0,0,0.6)] transition-all group"
        >
          <Sparkles className="w-4 h-4 shrink-0 text-amber-400 animate-pulse" />
          <span className="font-sans text-[11px] sm:text-xs font-bold uppercase tracking-wider truncate">
            {currentChapter.title}: {currentChapter.subtitle}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 shrink-0 text-amber-300 transition-transform duration-300 ${
              isMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-12 left-0 w-64 max-w-[80vw] max-h-[70vh] bg-neutral-900/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col space-y-1 z-50 overflow-y-auto custom-scrollbar"
            >
              <div className="px-3 py-2 border-b border-amber-500/20 text-[10px] font-sans font-bold uppercase tracking-widest text-amber-400/80 flex items-center justify-between">
                <span>Journey Timeline</span>
                <Heart className="w-3 h-3 text-pink-400 fill-pink-400/80" />
              </div>

              {CHAPTERS.map((chap) => {
                const isActive = chap.id === activeScene;
                return (
                  <button
                    key={chap.id}
                    onClick={() => handleSelect(chap.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`w-full px-3 py-2 rounded-xl text-left font-sans text-xs flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-200 font-bold border border-amber-400/40 shadow-inner'
                        : 'text-neutral-300 hover:bg-neutral-800/80 hover:text-amber-100'
                    }`}
                  >
                    <div>
                      <span className="block font-bold">{chap.title}</span>
                      <span className="text-[10px] text-neutral-400">{chap.subtitle}</span>
                    </div>
                    {isActive && <MapPin className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AUDIO MUTE / UNMUTE BUTTON */}
      <div className="shrink-0 pointer-events-auto">
        <button
          onClick={toggleSound}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className={`p-2.5 rounded-full backdrop-blur-md border shadow-[0_8px_25px_rgba(0,0,0,0.6)] transition-all flex items-center justify-center group ${
            isMuted
              ? 'bg-neutral-900/80 border-red-500/40 text-red-400'
              : 'bg-neutral-900/80 border-amber-500/40 text-amber-300 hover:scale-105'
          }`}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5 group-hover:animate-pulse" />
          )}
        </button>
      </div>
    </div>
  );
};
