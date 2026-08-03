import React, { useEffect, useRef } from 'react';
import { Firework, Particle, Point2D, Scene1Phase } from '../../types';
import { soundEngine } from '../../utils/sound';

interface ParticleSystemProps {
  phase: Scene1Phase;
  countdown: number;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ phase, countdown }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const fireworksRef = useRef<Firework[]>([]);
  const heartParticlesRef = useRef<Particle[]>([]);
  const heartProgressRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const lastFireworkTimeRef = useRef<number>(0);

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

    // Generate ambient floating dust motes
    const initAmbientParticles = () => {
      const count = Math.min(Math.floor((width * height) / 12000), 80);
      const particles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -Math.random() * 0.4 - 0.1,
          size: Math.random() * 2 + 1,
          color: Math.random() > 0.4 ? '#fef08a' : '#f59e0b',
          alpha: Math.random() * 0.4 + 0.1,
          maxAlpha: Math.random() * 0.5 + 0.2,
          life: 0,
          maxLife: 300 + Math.random() * 200,
          decay: 0.002,
        });
      }
      particlesRef.current = particles;
    };

    initAmbientParticles();

    // Heart path mathematical function (parametric heart)
    const getHeartPoint = (t: number, scale: number, centerX: number, centerY: number): Point2D => {
      // Parametric heart formula:
      // x = 16 * sin^3(t)
      // y = -(13 * cos(t) - 5 * cos(2t) - 2 * cos(3t) - cos(4t))
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      return {
        x: centerX + x * scale,
        y: centerY + y * scale,
      };
    };

    // Spawn a firework from left or right bottom corner
    const launchFirework = () => {
      const isLeft = Math.random() > 0.5;
      const startX = isLeft ? width * 0.15 + Math.random() * (width * 0.1) : width * 0.75 + Math.random() * (width * 0.1);
      const targetY = height * 0.2 + Math.random() * (height * 0.25);
      const color = ['#fde047', '#fbbf24', '#f59e0b', '#ffffff', '#fef08a'][Math.floor(Math.random() * 5)];

      fireworksRef.current.push({
        x: startX,
        y: height,
        targetY,
        vx: (isLeft ? 1 : -1) * (1.5 + Math.random() * 1.5),
        vy: - (11 + Math.random() * 3),
        color,
        exploded: false,
        particles: [],
      });

      soundEngine.playFireworkLaunch();
    };

    // Render loop
    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // --- 1. COUNTDOWN CRACK EMBERS SPAWNING ---
      if (phase === 'COUNTDOWN' && countdown < 5) {
        const crackEmbers = Math.floor((5 - countdown) * 1.5);
        for (let i = 0; i < crackEmbers; i++) {
          if (particlesRef.current.length < 150) {
            particlesRef.current.push({
              x: width / 2 + (Math.random() - 0.5) * 80,
              y: height / 2 + (Math.random() - 0.5) * 80,
              vx: (Math.random() - 0.5) * 2,
              vy: (Math.random() - 0.5) * 2 - 0.5,
              size: Math.random() * 2.5 + 1,
              color: '#fbbf24',
              alpha: 0.9,
              maxAlpha: 0.9,
              life: 0,
              maxLife: 60 + Math.random() * 40,
              decay: 0.02,
            });
          }
        }
      }

      // --- 2. ENERGY BURST GOLD PARTICLES ---
      if (phase === 'ENERGY_BURST' && particlesRef.current.length < 250) {
        for (let i = 0; i < 60; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 12 + 2;
          particlesRef.current.push({
            x: width / 2,
            y: height / 2,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 4 + 1.5,
            color: Math.random() > 0.3 ? '#fde047' : '#ffffff',
            alpha: 1,
            maxAlpha: 1,
            life: 0,
            maxLife: 100 + Math.random() * 60,
            decay: 0.015,
          });
        }
      }

      // --- 3. RENDER & UPDATE STANDARD AMBIENT / BURST PARTICLES ---
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * 2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // --- 4. HEART OUTLINE PARTICLE DRAWING DURING CELEBRATION ---
      if (phase === 'CELEBRATION' || phase === 'SCENE1_COMPLETE') {
        if (heartProgressRef.current < 1) {
          heartProgressRef.current += 0.008; // smooth drawing
        }

        const currentMaxT = heartProgressRef.current * Math.PI * 2;
        const scale = Math.min(width, height) * 0.022;
        const cx = width / 2;
        const cy = height * 0.42;

        // Draw glowing heart outline particles
        ctx.save();
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 15;

        for (let t = 0; t <= currentMaxT; t += 0.04) {
          const pt = getHeartPoint(t, scale, cx, cy);
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Spawn soft golden falling confetti
        if (Math.random() < 0.35) {
          particlesRef.current.push({
            x: Math.random() * width,
            y: -10,
            vx: (Math.random() - 0.5) * 1.5,
            vy: Math.random() * 2 + 1,
            size: Math.random() * 3 + 2,
            color: ['#fde047', '#fbbf24', '#ffffff', '#fef08a'][Math.floor(Math.random() * 4)],
            alpha: 0.9,
            maxAlpha: 0.9,
            life: 0,
            maxLife: 300,
            decay: 0.003,
            shape: 'confetti',
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.1,
          });
        }

        // Periodically launch fireworks
        if (time - lastFireworkTimeRef.current > 1200) {
          launchFirework();
          lastFireworkTimeRef.current = time;
        }
      }

      // --- 5. FIREWORKS UPDATE & RENDER ---
      const fireworks = fireworksRef.current;
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];
        if (!fw.exploded) {
          fw.x += fw.vx;
          fw.y += fw.vy;

          // Trail
          ctx.save();
          ctx.fillStyle = fw.color;
          ctx.shadowColor = fw.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          if (fw.y <= fw.targetY || fw.vy >= 0) {
            fw.exploded = true;
            // Spawn explosion particles
            const particleCount = 45 + Math.floor(Math.random() * 25);
            for (let k = 0; k < particleCount; k++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = Math.random() * 6 + 1.5;
              fw.particles.push({
                x: fw.x,
                y: fw.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 2.5 + 1,
                color: fw.color,
                alpha: 1,
                maxAlpha: 1,
                life: 0,
                maxLife: 60 + Math.random() * 30,
                decay: 0.02,
              });
            }
          }
        } else {
          // Render explosion starburst
          for (let j = fw.particles.length - 1; j >= 0; j--) {
            const p = fw.particles[j];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // gravity
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
              fw.particles.splice(j, 1);
              continue;
            }

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = p.size * 3;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          if (fw.particles.length === 0) {
            fireworks.splice(i, 1);
          }
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
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
};
