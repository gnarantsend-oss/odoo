'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Film, Search } from 'lucide-react';

const TABS = [
  { href: '/',        icon: Home,   label: 'Нүүр' },
  { href: '/mongol',  icon: Film,   label: 'Кино' },
  { href: '/search',  icon: Search, label: 'Хайх' },
];

export default function BottomNav() {
  const path = usePathname();
  const isWatch = path.startsWith('/mongol/watch');
  if (isWatch) return null;

  return (
    <nav
      className="safe-bottom md:hidden"
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: 'color-mix(in oklch, var(--background) 82%, transparent)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        borderTop: '0.5px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '60px',
      }}
    >
      {TABS.map(({ href, icon: Icon, label }) => {
        const active = path === href || (href !== '/' && path.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '3px', flex: 1, padding: '8px 0',
              color: active ? 'var(--primary)' : 'var(--muted-foreground)',
              transition: 'color 0.18s ease',
              textDecoration: 'none',
            }}
          >
            <Icon
              size={20}
              strokeWidth={active ? 2.2 : 1.6}
              style={{
                transform: active ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform 0.18s ease',
              }}
            />
            <span style={{ fontSize: '10px', fontWeight: active ? 600 : 400 }}>{label}</span>
            {active && (
              <span style={{
                position: 'absolute', bottom: '6px',
                width: '4px', height: '4px', borderRadius: '50%',
                background: 'var(--primary)',
                boxShadow: '0 0 6px color-mix(in oklch, var(--primary) 60%, transparent)',
              }} />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
