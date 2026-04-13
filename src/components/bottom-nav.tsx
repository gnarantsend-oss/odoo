'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Film, Search } from 'lucide-react';

const TABS = [
  { href: '/',       icon: Home,   label: 'Нүүр' },
  { href: '/mongol', icon: Film,   label: 'Кино' },
  { href: '/search', icon: Search, label: 'Хайх' },
];

function TelegramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

export default function BottomNav() {
  const path = usePathname();
  if (path.startsWith('/mongol/watch')) return null;

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
      background: 'rgba(11,14,26,0.95)',
      backdropFilter: 'blur(20px) saturate(160%)',
      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      borderTop: '0.5px solid rgba(255,255,255,0.07)',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      height: '60px',
    }} className="md:hidden safe-bottom">

      {TABS.map(({ href, icon: Icon, label }) => {
        const active = href === '/' ? path === '/' : path.startsWith(href);
        return (
          <Link key={href} href={href} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '3px', flex: 1, padding: '8px 0',
            color: active ? '#e50914' : 'rgba(255,255,255,0.45)',
            textDecoration: 'none', transition: 'color 0.18s', position: 'relative',
          }}>
            <Icon size={20} strokeWidth={active ? 2.2 : 1.6}
              style={{ transform: active ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.18s' }}
            />
            <span style={{ fontSize: '10px', fontWeight: active ? 700 : 400 }}>{label}</span>
            {active && (
              <span style={{
                position: 'absolute', bottom: '6px',
                width: '4px', height: '4px', borderRadius: '50%',
                background: '#e50914', boxShadow: '0 0 6px rgba(229,9,20,0.7)',
              }} />
            )}
          </Link>
        );
      })}

      <a
        href="https://t.me/Bannerbairluul"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '3px', flex: 1, padding: '8px 0',
          color: '#229ED9', textDecoration: 'none', transition: 'opacity 0.18s',
        }}
        onTouchStart={e => { (e.currentTarget as HTMLElement).style.opacity = '0.65'; }}
        onTouchEnd={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
      >
        <TelegramIcon />
        <span style={{ fontSize: '10px', fontWeight: 400 }}>Telegram</span>
      </a>
    </nav>
  );
}
