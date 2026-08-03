import React, { useEffect, useRef } from 'react';
import { BrickFragment, Scene1Phase } from '../../types';

interface BrickWallCanvasProps {
  phase: Scene1Phase;
  countdown: number;
  onShatterComplete?: () => void;
}

export const BrickWallCanvas: React.FC<BrickWallCanvasProps> = ({
  phase,
  countdown,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fragmentsRef = useRef<BrickFragment[]>([]);
  const shatterTriggeredRef = useRef<boolean>(false);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initialize brick wall fragments if not already built
    const generateFragments = () => {
      const rows = Math.ceil(height / 36);
      const cols = Math.ceil(width / 75);
      const brickWidth = width / cols;
      const brickHeight = height / rows;
      const frags: BrickFragment[] = [];

      const cx = width / 2;
      const cy = height / 2;

      for (let r = 0; r < rows; r++) {
        const offset = r % 2 === 0 ? 0 : brickWidth / 2;
        for (let c = -1; c <= cols; c++) {
          const bx = c * brickWidth + offset;
          const by = r * brickHeight;

          // Distance from center blast point
          const dx = bx + brickWidth / 2 - cx;
          const dy = by + brickHeight / 2 - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);

          // Force speed based on distance (closer = faster blast)
          const speed = (1 - Math.min(dist / (Math.max(width, height) * 0.7), 1)) * 18 + 4;

          // Brick color variations (aged terracotta, charcoal undertones, weathered stone)
          const hue = 18 + Math.random() * 12;
          const sat = 25 + Math.random() * 20;
          const light = 18 + Math.random() * 14;
          const color = `hsl(${hue}, ${sat}%, ${light}%)`;

          frags.push({
            x: bx,
            y: by,
            width: brickWidth - 2,
            height: brickHeight - 2,
            vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 3,
            vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 3 - 2,
            vz: Math.random() * 8 + 2,
            rotX: (Math.random() - 0.5) * 0.2,
            rotY: (Math.random() - 0.5) * 0.2,
            rotZ: (Math.random() - 0.5) * 0.2,
            vRotX: (Math.random() - 0.5) * 0.1,
            vRotY: (Math.random() - 0.5) * 0.1,
            vRotZ: (Math.random() - 0.5) * 0.12,
            color,
            opacity: 1,
          });
        }
      }
      fragmentsRef.current = frags;
    };

    generateFragments();

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // If in initial black screen phase, leave dark
      if (phase === 'BLACK_SCREEN') {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const isShattered =
        phase === 'ENERGY_BURST' ||
        phase === 'LETTER_REVEAL' ||
        phase === 'TITLE_FORMATION' ||
        phase === 'CELEBRATION' ||
        phase === 'SCENE1_COMPLETE';

      if (!isShattered) {
        // --- DRAW SOLID AGED BRICK WALL ---
        const brickH = 36;
        const brickW = 75;
        const rows = Math.ceil(height / brickH);
        const cols = Math.ceil(width / brickW) + 2;

        // Background mortar tint
        ctx.fillStyle = '#141212';
        ctx.fillRect(0, 0, width, height);

        for (let r = 0; r < rows; r++) {
          const rowOffset = r % 2 === 0 ? 0 : brickW / 2;
          const y = r * brickH;

          for (let c = -1; c < cols; c++) {
            const x = c * brickW + rowOffset;

            // Subtle color variance
            const colorIndex = (r * 7 + c * 13) % 5;
            const colors = ['#2b221e', '#362a25', '#241c19', '#3f2f28', '#2e2521'];
            ctx.fillStyle = colors[colorIndex];
            ctx.fillRect(x, y, brickW - 2, brickH - 2);

            // Weathering texture highlights
            ctx.fillStyle = 'rgba(0,0,0,0.25)';
            ctx.fillRect(x, y + brickH - 5, brickW - 2, 3);
            ctx.fillStyle = 'rgba(255,255,255,0.03)';
            ctx.fillRect(x, y, brickW - 2, 2);
          }
        }

        // Vignette & Center Spotlight
        const radGrad = ctx.createRadialGradient(
          width / 2,
          height / 2,
          50,
          width / 2,
          height / 2,
          Math.max(width, height) * 0.7
        );
        const glowOpacity = (5 - countdown) * 0.08 + 0.15;
        radGrad.addColorStop(0, `rgba(245, 158, 11, ${glowOpacity})`);
        radGrad.addColorStop(0.5, 'rgba(15, 12, 12, 0.4)');
        radGrad.addColorStop(1, 'rgba(0, 0, 0, 0.92)');
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, width, height);

        // --- DRAW SPREADING HAIRLINE CRACKS DURING COUNTDOWN ---
        if (countdown < 5) {
          const crackIntensity = (5 - countdown) / 5; // 0.2 to 1.0
          const cx = width / 2;
          const cy = height / 2;

          ctx.save();
          ctx.strokeStyle = `rgba(251, 191, 36, ${0.4 + crackIntensity * 0.5})`;
          ctx.shadowColor = 'rgba(245, 158, 11, 0.9)';
          ctx.shadowBlur = 10 + crackIntensity * 15;
          ctx.lineWidth = 1.5 + crackIntensity * 2;

          // Main crack branches radiating from center
          const crackAngles = [0, 0.7, 1.4, 2.2, 3.1, 4.0, 4.9, 5.7];
          crackAngles.forEach((baseAngle) => {
            ctx.beginPath();
            let currX = cx;
            let currY = cy;
            ctx.moveTo(currX, currY);

            const steps = Math.floor(10 + crackIntensity * 12);
            const stepLen = (Math.max(width, height) * 0.35 * crackIntensity) / steps;

            for (let i = 0; i < steps; i++) {
              const jitter = (Math.random() - 0.5) * 0.6;
              const angle = baseAngle + jitter;
              currX += Math.cos(angle) * stepLen;
              currY += Math.sin(angle) * stepLen;
              ctx.lineTo(currX, currY);
            }
            ctx.stroke();
          });
          ctx.restore();
        }
      } else {
        // --- SHATTER ANIMATION (BRICK FRAGMENTS FLYING OUTWARD) ---
        if (!shatterTriggeredRef.current) {
          shatterTriggeredRef.current = true;
        }

        // Deep hole light rays background
        const lightGrad = ctx.createRadialGradient(
          width / 2,
          height / 2,
          0,
          width / 2,
          height / 2,
          width * 0.6
        );
        lightGrad.addColorStop(0, 'rgba(254, 243, 199, 0.35)');
        lightGrad.addColorStop(0.3, 'rgba(245, 158, 11, 0.15)');
        lightGrad.addColorStop(1, 'rgba(0, 0, 0, 1)');
        ctx.fillStyle = lightGrad;
        ctx.fillRect(0, 0, width, height);

        // Render flying brick fragments
        const frags = fragmentsRef.current;
        for (let i = 0; i < frags.length; i++) {
          const f = frags[i];
          if (f.opacity <= 0.01) continue;

          // Update fragment position
          f.x += f.vx;
          f.y += f.vy;
          f.rotZ += f.vRotZ;
          f.vx *= 0.98;
          f.vy += 0.15; // mild gravity
          f.opacity *= 0.985;

          ctx.save();
          ctx.translate(f.x + f.width / 2, f.y + f.height / 2);
          ctx.rotate(f.rotZ);
          ctx.globalAlpha = Math.max(0, f.opacity);

          ctx.fillStyle = f.color;
          ctx.fillRect(-f.width / 2, -f.height / 2, f.width, f.height);

          // Subtle fragment border highlight
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
          ctx.lineWidth = 1;
          ctx.strokeRect(-f.width / 2, -f.height / 2, f.width, f.height);

          ctx.restore();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [phase, countdown]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-1000"
    />
  );
};
