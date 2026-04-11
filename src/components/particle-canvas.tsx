'use client';

import { useEffect, useRef } from 'react';

interface ParticleCanvasProps {
  className?: string;
  count?: number;
}

/**
 * ParticleCanvas — хөдөлдөг цэгүүд + тэдгээрийн холбоос зурдаг canvas.
 * wave-bg дотор байрлана, z-index: 1.
 */
export default function ParticleCanvas({ className = '', count = 60 }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const c = canvas as HTMLCanvasElement;
    const cx = ctx as CanvasRenderingContext2D;

    let animId: number;

    type Pt = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    let pts: Pt[] = [];

    function init(W: number, H: number) {
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r:  Math.random() * 1.4 + 0.3,
        a:  Math.random() * 0.45 + 0.12,
      }));
    }

    function resize() {
      const W = c.offsetWidth;
      const H = c.offsetHeight;
      c.width  = W;
      c.height = H;
      init(W, H);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(c.parentElement ?? c);
    resize();

    function draw() {
      const W = c.width;
      const H = c.height;
      cx.clearRect(0, 0, W, H);

      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
      });

      pts.forEach(p => {
        cx.beginPath();
        cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cx.fillStyle = `rgba(56,208,240,${p.a})`;
        cx.fill();
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 90) {
            cx.beginPath();
            cx.moveTo(a.x, a.y);
            cx.lineTo(b.x, b.y);
            cx.strokeStyle = `rgba(56,208,240,${0.07 * (1 - d / 90)})`;
            cx.lineWidth = 0.5;
            cx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [count]);

  return <canvas ref={canvasRef} className={className} style={{ width: '100%', height: '100%' }} />;
}
