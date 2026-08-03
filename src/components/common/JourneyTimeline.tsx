import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveScene } from '../../types';
import { APP_CONFIG } from '../../data/memories';
import { soundEngine } from '../../utils/sound';

interface JourneyTimelineProps {
  activeScene: ActiveScene;
  onSelectScene: (scene: ActiveScene) => void;
  className?: string;
}

export const TIMELINE_NODES: { id: ActiveScene; title: string; label: string }[] = [
  { id: 'SCENE_1', title: 'Chapter 01', label: 'Opening Memory' },
  { id: 'SCENE_2', title: 'Chapter 02', label: 'Memory Vault' },
  { id: 'SCENE_3', title: 'Chapter 03', label: 'Bubble Memories' },
  { id: 'SCENE_4', title: 'Chapter 04', label: 'Video From Me' },
  { id: 'SCENE_5', title: 'Chapter 05', label: 'Video From Best Friend' },
  { id: 'SCENE_6', title: 'Chapter 06', label: 'Letter From Me' },
  { id: 'SCENE_7', title: 'Chapter 07', label: 'Letter From Best Friend' },
  { id: 'SCENE_8', title: 'Chapter 08', label: 'Award For Best Friend' },
  { id: 'SCENE_9', title: 'Chapter 09', label: 'Award For Me' },
  { id: 'SCENE_10', title: 'Chapter 10', label: 'Friendship Promise' },
  { id: 'SCENE_11', title: 'Chapter 11', label: 'Two Questions' },
  { id: 'SCENE_12', title: 'Chapter 12', label: 'The Result' },
  { id: 'SCENE_13', title: 'Chapter 13', label: 'Final Memory' },
];

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({
  activeScene,
  onSelectScene,
  className = '',
}) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<ActiveScene | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  if (!APP_CONFIG.enableTimeline) return null;

  const currentIndex = TIMELINE_NODES.findIndex((n) => n.id === activeScene);

  const handleNodeClick = (nodeId: ActiveScene, nodeIndex: number) => {
    if (nodeId === activeScene) return;

    // Check if free navigation is allowed or if node was previously visited/completed
    const isAllowed = APP_CONFIG.allowFreeNavigation || nodeIndex <= currentIndex;
    if (!isAllowed) return;

    soundEngine.playPageFlip();
    setIsTransitioning(true);

    // Smooth cinematic transition timing
    setTimeout(() => {
      onSelectScene(nodeId);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 400);
    }, APP_CONFIG.transitionSpeed || 500);
  };

  return (
    <>
      {/* CINEMATIC CAMERA TRANSITION OVERLAY */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-0 z-[100] bg-neutral-950/90 backdrop-blur-2xl pointer-events-none flex items-center justify-center"
          >
            <div className="flex flex-col items-center space-y-3">
              <span className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
              <span className="font-cinzel text-xs font-extrabold uppercase tracking-widest text-amber-200">
                Travelling Through Memories...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LUXURIOUS HORIZONTAL JOURNEY TIMELINE BAR */}
      <div
        className={`fixed bottom-3 sm:bottom-5 inset-x-0 z-40 flex flex-col items-center justify-center pointer-events-none select-none px-4 ${className}`}
      >
        <div className="relative pointer-events-auto bg-neutral-950/80 backdrop-blur-xl border border-amber-500/30 rounded-full px-4 sm:px-6 py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.85)] flex items-center max-w-full overflow-x-auto custom-scrollbar">
          {/* Connecting Background Line */}
          <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-gradient-to-r from-amber-500/20 via-amber-400/40 to-amber-500/20 -translate-y-1/2 pointer-events-none" />

          {/* Progress Fill Line */}
          <div
            className="absolute top-1/2 left-6 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-300 -translate-y-1/2 pointer-events-none transition-all duration-700"
            style={{
              width: `calc(${((currentIndex) / (TIMELINE_NODES.length - 1)) * 100}% - 12px)`,
            }}
          />

          {/* Timeline Nodes */}
          <div className="relative z-10 flex items-center space-x-3 sm:space-x-5">
            {TIMELINE_NODES.map((node, index) => {
              const isCurrent = node.id === activeScene;
              const isCompleted = index < currentIndex;
              const isAllowed = APP_CONFIG.allowFreeNavigation || index <= currentIndex;
              const isHovered = hoveredNodeId === node.id;

              return (
                <div
                  key={node.id}
                  className="relative flex flex-col items-center"
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                >
                  {/* HOVER / TOUCH TITLE TOOLTIP BADGE */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.9 }}
                        animate={{ opacity: 1, y: -38, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full mb-1 whitespace-nowrap bg-neutral-900 border border-amber-400/60 px-3 py-1 rounded-lg text-[10px] font-sans font-bold uppercase tracking-widest text-amber-200 shadow-xl z-30 pointer-events-none"
                      >
                        <span>{node.label}</span>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* CIRCULAR MEMORY NODE BUTTON */}
                  <button
                    onClick={() => handleNodeClick(node.id, index)}
                    disabled={!isAllowed}
                    aria-label={node.label}
                    aria-current={isCurrent ? 'step' : undefined}
                    className={`relative w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCurrent
                        ? 'bg-amber-300 text-neutral-950 ring-4 ring-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.9)] scale-125'
                        : isCompleted
                        ? 'bg-amber-500/90 border border-amber-300 text-neutral-950 hover:scale-110 shadow-[0_0_8px_rgba(245,158,11,0.5)] cursor-pointer'
                        : isAllowed
                        ? 'bg-stone-900 border-2 border-amber-400/50 hover:border-amber-300 hover:scale-110 cursor-pointer'
                        : 'bg-stone-900 border border-stone-700/60 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    {/* Inner Core Accent */}
                    {isCurrent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 animate-ping" />
                    )}
                    {isCompleted && !isCurrent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-100" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
