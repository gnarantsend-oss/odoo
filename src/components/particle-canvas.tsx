'use client';

import { useEffect, useRef } from 'react';

export default function ParticleCanvas({ className = '', count = 30 }: { className?: string; count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use non-null assertion since we checked above
    const c = canvas;
    const cx = ctx;

    let animId: number;
    let W = 0, H = 0;

    type Pt = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    let pts: Pt[] = [];

    function init() {
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.2 + 0.3,
        a: Math.random() * 0.35 + 0.1,
      }));
    }

    function resize() {
      W = c.offsetWidth; H = c.offsetHeight;
      c.width = W; c.height = H;
      init();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(c.parentElement ?? c);
    resize();

    const DIST2 = 80 * 80;

    function draw() {
      cx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; else if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; else if (p.y > H) p.y = 0;
        cx.beginPath();
        cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cx.fillStyle = `rgba(56,208,240,${p.a})`;
        cx.fill();
      }
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < DIST2) {
            cx.beginPath();
            cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y);
            cx.strokeStyle = `rgba(56,208,240,${0.06 * (1 - d2 / DIST2)})`;
            cx.lineWidth = 0.5;
            cx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(animId);
      else draw();
    };
    document.addEventListener('visibilitychange', onVisibility);
    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [count]);

  return <canvas ref={canvasRef} className={className} style={{ width: '100%', height: '100%' }} />;
}
