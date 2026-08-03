import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

interface BubbleParticlesCanvasProps {
  burstEvent: { x: number; y: number; color?: string } | null;
}

export const BubbleParticlesCanvas: React.FC<BubbleParticlesCanvasProps> = ({ burstEvent }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const ambientStarsRef = useRef<{ x: number; y: number; size: number; alpha: number; speed: number }[]>([]);

  // Initialize ambient stars / dust
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 60; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.2 + 0.05,
      });
    }
    ambientStarsRef.current = stars;
  }, []);

  // Trigger burst particles when burstEvent changes
  useEffect(() => {
    if (!burstEvent) return;

    const newParticles: Particle[] = [];
    const count = 24;
    const colors = ['#f472b6', '#38bdf8', '#fbbf24', '#a855f7', '#34d399', '#ffffff'];

    for (let i = 0; i < count; i++) {
      const angle = (i * Math.PI * 2) / count + (Math.random() - 0.5);
      const speed = Math.random() * 4 + 1.5;
      newParticles.push({
        x: burstEvent.x,
        y: burstEvent.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1, // slight gravity drop
        size: Math.random() * 3 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015,
      });
    }

    particlesRef.current.push(...newParticles);
  }, [burstEvent]);

  // Animation Loop
  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render Ambient Stars / Floating Dust
      ambientStarsRef.current.forEach((star) => {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 207, 232, ${star.alpha})`;
        ctx.fill();
      });

      // Render Burst Droplets / Sparkles
      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0);

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.alpha -= p.decay;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.1, p.size), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
};
