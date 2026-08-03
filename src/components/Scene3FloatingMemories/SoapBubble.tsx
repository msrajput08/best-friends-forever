import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BubbleData } from '../../types';

interface SoapBubbleProps {
  bubble: BubbleData;
  onPop: (bubble: BubbleData, clientX: number, clientY: number) => void;
}

export const SoapBubble: React.FC<SoapBubbleProps> = ({ bubble, onPop }) => {
  const [isPopping, setIsPopping] = useState(false);

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (isPopping) return;
    e.stopPropagation();

    let clientX = e.clientX || 0;
    let clientY = e.clientY || 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('changedTouches' in e && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    }

    setIsPopping(true);
    onPop(bubble, clientX, clientY);
  };

  if (isPopping) return null;

  return (
    <motion.div
      style={{
        left: `${bubble.x}%`,
        bottom: `${bubble.y}%`,
        width: `${bubble.pixelSize}px`,
        height: `${bubble.pixelSize}px`,
      }}
      animate={{
        y: [0, -120, -240, -360],
        x: [
          0,
          bubble.swayAmplitude,
          -bubble.swayAmplitude,
          bubble.swayAmplitude / 2,
          0,
        ],
        scale: [1, 1.03, 0.97, 1.02, 1],
        rotate: [0, 4, -4, 2, 0],
      }}
      transition={{
        y: {
          duration: bubble.speedY,
          repeat: Infinity,
          ease: 'linear',
        },
        x: {
          duration: bubble.speedX,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        scale: {
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        rotate: {
          duration: 4 + Math.random() * 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
      whileHover={{ scale: 1.12, rotate: 6 }}
      whileTap={{ scale: 0.85 }}
      onClick={handleClick}
      onTouchStart={handleClick}
      className="absolute cursor-pointer select-none group z-20 focus:outline-none"
    >
      {/* SOAP BUBBLE SPHERE WITH IRIDESCENT SHEEN */}
      <div
        className="w-full h-full rounded-full relative overflow-hidden backdrop-blur-[2px] transition-all duration-300 shadow-[0_0_20px_rgba(236,72,153,0.3)] group-hover:shadow-[0_0_35px_rgba(56,189,248,0.6)]"
        style={{
          background:
            'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.4) 0%, rgba(236, 72, 153, 0.15) 30%, rgba(56, 189, 248, 0.2) 60%, rgba(168, 85, 247, 0.25) 85%, rgba(255, 255, 255, 0.5) 100%)',
          boxShadow:
            'inset 0 0 15px rgba(255, 255, 255, 0.6), inset -5px -5px 12px rgba(168, 85, 247, 0.4), 0 0 18px rgba(236, 72, 153, 0.25)',
          border: '1.5px solid rgba(255, 255, 255, 0.5)',
        }}
      >
        {/* Curved Glass Highlight Lens Top Left */}
        <div className="absolute top-[12%] left-[15%] w-[35%] h-[20%] rounded-[50%] bg-white/70 blur-[1px] rotate-[-25deg]" />

        {/* Curved Secondary Highlight Bottom Right */}
        <div className="absolute bottom-[10%] right-[15%] w-[30%] h-[15%] rounded-[50%] bg-amber-200/50 blur-[1px] rotate-[30deg]" />

        {/* Rainbow Shimmer Ring */}
        <div className="absolute inset-0 rounded-full border border-pink-400/30 opacity-70 group-hover:opacity-100 transition-opacity" />

        {/* Subtle Hidden Hint Glow inside if bubble contains a surprise */}
        {bubble.contentType !== 'NONE' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-300/80 shadow-[0_0_12px_#fbbf24] animate-ping" />
          </div>
        )}
      </div>
    </motion.div>
  );
};
