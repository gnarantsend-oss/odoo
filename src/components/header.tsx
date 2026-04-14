'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      height: '62px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 4%',
      background: scrolled ? 'rgba(11,14,26,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px) saturate(150%)' : 'none',
      borderBottom: scrolled ? '0.5px solid rgba(255,255,255,0.05)' : 'none',
      transition: 'background 0.35s, backdrop-filter 0.35s',
    }}>

      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontSize: '21px', fontWeight: 900, letterSpacing: '0.08em', color: '#e50914', fontStyle: 'italic' }}>NARHAN</span>
          <span style={{ fontSize: '6px', fontWeight: 400, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginTop: '2px' }}>МОНГОЛ ТВ</span>
        </div>
      </Link>

      {/* Telegram — ганц товч */}
      <a
        href="https://t.me/Bannerbairluul"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '8px 16px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #229ED9, #1a7cbf)',
          color: '#fff', fontSize: '13px', fontWeight: 700,
          textDecoration: 'none', whiteSpace: 'nowrap',
          boxShadow: '0 2px 14px rgba(34,158,217,0.3)',
          transition: 'opacity 0.2s, transform 0.2s',
        }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.opacity = '0.85'; el.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
        Telegram
      </a>
    </header>
  );
}
