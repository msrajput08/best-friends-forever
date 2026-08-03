import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  type: 'sparkle' | 'heart' | 'ribbon';
}

interface VideoAmbientCanvasProps {
  isEnded: boolean;
  isUnlocked: boolean;
}

export const VideoAmbientCanvas: React.FC<VideoAmbientCanvasProps> = ({ isEnded, isUnlocked }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];
    const colors = ['#f472b6', '#fbbf24', '#a855f7', '#38bdf8', '#fef08a'];

    // Create ambient particles around outer margin
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.5 - 0.2,
        alpha: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: Math.random() > 0.8 ? 'heart' : 'sparkle',
      });
    }

    const render = () => {
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerExclusionWidth = Math.min(canvas.width * 0.75, 700);
      const centerExclusionHeight = Math.min(canvas.height * 0.65, 450);
      const exclusionLeft = (canvas.width - centerExclusionWidth) / 2;
      const exclusionRight = exclusionLeft + centerExclusionWidth;
      const exclusionTop = (canvas.height - centerExclusionHeight) / 2;
      const exclusionBottom = exclusionTop + centerExclusionHeight;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        // Check if particle overlaps video area. If inside, push to border
        if (
          isUnlocked &&
          p.x > exclusionLeft &&
          p.x < exclusionRight &&
          p.y > exclusionTop &&
          p.y < exclusionBottom
        ) {
          // Push outward to sides
          if (Math.abs(p.x - canvas.width / 2) < Math.abs(p.y - canvas.height / 2)) {
            p.y = p.y < canvas.height / 2 ? exclusionTop - 10 : exclusionBottom + 10;
          } else {
            p.x = p.x < canvas.width / 2 ? exclusionLeft - 10 : exclusionRight + 10;
          }
        }

        ctx.save();
        ctx.globalAlpha = isEnded ? Math.min(1, p.alpha * 1.8) : p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = isEnded ? 15 : 8;

        if (p.type === 'heart') {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          const topCurveHeight = p.size * 0.3;
          ctx.moveTo(p.x, p.y + topCurveHeight);
          ctx.bezierCurveTo(p.x, p.y, p.x - p.size, p.y, p.x - p.size, p.y + topCurveHeight);
          ctx.bezierCurveTo(p.x - p.size, p.y + (p.size * 2) / 2, p.x, p.y + p.size * 2, p.x, p.y + p.size * 2);
          ctx.bezierCurveTo(p.x, p.y + p.size * 2, p.x + p.size, p.y + (p.size * 2) / 2, p.x + p.size, p.y + topCurveHeight);
          ctx.bezierCurveTo(p.x + p.size, p.y, p.x, p.y, p.x, p.y + topCurveHeight);
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, isEnded ? p.size * 1.4 : p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isEnded, isUnlocked]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
};
