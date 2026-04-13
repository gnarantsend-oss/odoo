'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Film, Search, Bookmark } from 'lucide-react';

const TABS = [
  { href: '/',         icon: Home,     label: 'Нүүр' },
  { href: '/mongol',   icon: Film,     label: 'Кино' },
  { href: '/search',   icon: Search,   label: 'Хайх' },
  { href: '/watchlist',icon: Bookmark, label: 'Жагсаалт' },
];

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
            textDecoration: 'none', transition: 'color 0.18s',
          }}>
            <Icon size={20} strokeWidth={active ? 2.2 : 1.6} style={{ transform: active ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.18s' }} />
            <span style={{ fontSize: '10px', fontWeight: active ? 700 : 400 }}>{label}</span>
            {active && <span style={{ position: 'absolute', bottom: '6px', width: '4px', height: '4px', borderRadius: '50%', background: '#e50914', boxShadow: '0 0 6px rgba(229,9,20,0.7)' }} />}
          </Link>
        );
      })}
    </nav>
  );
}
