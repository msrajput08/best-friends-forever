import React, { useEffect, useRef } from 'react';

export const DeskEnvironment: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Floating dust particles in warm candle light
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dustCount = 40;
    const particles = Array.from({ length: dustCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -Math.random() * 0.3 - 0.1,
    }));

    const render = () => {
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) p.y = canvas.height;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = '#fef08a'; // Golden warm dust
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative w-full h-full bg-[radial-gradient(ellipse_at_top,_rgba(120,53,15,0.45)_0%,_rgba(28,25,23,0.95)_75%,_rgba(12,10,9,1)_100%)] text-amber-100 flex flex-col items-center justify-between overflow-x-hidden overflow-y-auto select-none py-8 px-4 pb-28 sm:pb-32">
      {/* Wood Grain Overlay Texture simulation */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_rgba(0,0,0,0.3),_transparent_40%,_rgba(0,0,0,0.7))] pointer-events-none z-0" />

      {/* Warm Flickering Candlelight Volumetric Glow at Top-Left and Top-Right */}
      <div className="absolute top-4 left-8 sm:left-16 w-48 h-48 sm:w-72 sm:h-72 rounded-full bg-amber-500/20 blur-3xl animate-pulse pointer-events-none z-0" />
      <div className="absolute top-12 right-8 sm:right-16 w-40 h-40 sm:w-60 sm:h-60 rounded-full bg-orange-600/15 blur-3xl animate-pulse pointer-events-none z-0" style={{ animationDelay: '1s' }} />

      {/* Floating Candle Dust Particle Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10 w-full h-full" />

      {/* Main Content Container with Desktop Desk Elements */}
      <div className="relative z-20 w-full max-w-6xl mx-auto flex items-center justify-center">
        {/* Left Desktop Desk Prop: Inkwell & Feather Quill */}
        <div className="hidden lg:flex flex-col items-center space-y-4 absolute left-0 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-95 transition-opacity duration-500 pointer-events-none pr-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-900/60 to-stone-900 border border-amber-600/30 p-3 shadow-2xl backdrop-blur-md flex items-center justify-center">
            <span className="text-3xl filter drop-shadow">✒️</span>
          </div>
          <span className="font-cormorant text-sm italic text-amber-300/80 tracking-widest uppercase">Vintage Inkwell</span>
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        </div>

        {/* Center Main Content */}
        <div className="w-full max-w-4xl flex flex-col items-center">
          {children}
        </div>

        {/* Right Desktop Desk Prop: Wax Seal & Journal */}
        <div className="hidden lg:flex flex-col items-center space-y-4 absolute right-0 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-95 transition-opacity duration-500 pointer-events-none pl-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-950/60 to-amber-950/80 border border-amber-600/30 p-3 shadow-2xl backdrop-blur-md flex items-center justify-center">
            <span className="text-3xl filter drop-shadow">📜</span>
          </div>
          <span className="font-cormorant text-sm italic text-amber-300/80 tracking-widest uppercase">Wax Seal & Scroll</span>
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        </div>
      </div>
    </div>
  );
};
