'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ThemeSwitcher } from './theme-switcher';

const NAV = [
  { href: '/',            label: 'Нүүр' },
  { href: '/mongol',      label: 'Кино' },
  { href: '/?cat=drama',  label: 'Драм' },
  { href: '/?cat=horror', label: 'Аймшиг' },
  { href: '/?cat=comedy', label: 'Инээдэм' },
];

export default function Header() {
  const path   = usePathname();
  const router = useRouter();
  const [scrolled,   setScrolled]   = useState(false);
  const [searching,  setSearching]  = useState(false);
  const [query,      setQuery]      = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setSearching(false); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  const openSearch = () => { setSearching(true); setTimeout(() => inputRef.current?.focus(), 60); };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) { router.push(`/search?q=${encodeURIComponent(query.trim())}`); setSearching(false); setQuery(''); }
  };

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      height: '62px', display: 'flex', alignItems: 'center', padding: '0 4%', gap: '2rem',
      background: scrolled ? 'rgba(11,14,26,0.96)' : 'linear-gradient(to bottom,rgba(0,0,0,0.75) 0%,transparent 100%)',
      backdropFilter: scrolled ? 'blur(22px) saturate(160%)' : 'none',
      borderBottom: scrolled ? '0.5px solid rgba(255,255,255,0.05)' : 'none',
      transition: 'background 0.3s, backdrop-filter 0.3s',
    }}>

      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '0.1em', color: '#e50914', fontStyle: 'italic' }}>NARHAN</span>
          <span style={{ fontSize: '6.5px', fontWeight: 400, letterSpacing: '0.35em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginTop: '2px' }}>МОНГОЛ ТВ</span>
        </div>
      </Link>

      {/* Nav */}
      <nav className="hidden sm:flex" style={{ gap: 0, flex: 1 }}>
        {NAV.map(({ href, label }) => {
          const active = href === '/' ? path === '/' : path.startsWith(href.split('?')[0]);
          return (
            <Link key={href} href={href} style={{
              textDecoration: 'none', color: active ? '#fff' : 'rgba(255,255,255,0.52)',
              fontSize: '13px', fontWeight: active ? 600 : 400,
              padding: '0 13px', height: '62px', display: 'flex', alignItems: 'center',
              borderBottom: active ? '2px solid #e50914' : '2px solid transparent',
              transition: 'color 0.15s, border-color 0.15s',
              letterSpacing: '0.02em',
            }}>{label}</Link>
          );
        })}
      </nav>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', flexShrink: 0 }}>

        {/* Search */}
        {searching
          ? (
            <form onSubmit={submit} style={{ display: 'flex', alignItems: 'center', background: 'rgba(11,14,26,0.8)', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: '8px', overflow: 'hidden' }}>
              <svg style={{ marginLeft: '11px', color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Кино хайх..." style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontFamily: 'inherit', fontSize: '13px', padding: '8px 12px', width: '170px' }} />
            </form>
          ) : (
            <button onClick={openSearch} style={{ width: '34px', height: '34px', borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.07)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          )
        }

        {/* Telegram */}
        <a href="https://t.me/Bannerbairluul" target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 13px', borderRadius: '8px', background: 'linear-gradient(135deg,#229ED9,#1a7cbf)', color: '#fff', fontSize: '12px', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, transition: 'opacity 0.2s, transform 0.2s', boxShadow: '0 2px 12px rgba(34,158,217,0.3)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.88'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
          <span className="hidden sm:inline">Telegram</span>
        </a>

        <ThemeSwitcher />
      </div>
    </header>
  );
}
