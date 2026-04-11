'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Home, Clock, Shuffle, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Home',     href: '/',              icon: Home,    exact: true  },
  { label: 'Movies',   href: '/?tab=movies',   icon: Clock,   exact: false },
  { label: 'Anime',    href: '/?tab=anime',    icon: Shuffle, exact: false },
  { label: 'Монгол',   href: '/?tab=mongol',   icon: Download,exact: false },
];

function MobileNavInner() {
  const pathname  = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  const isActive = (item: typeof NAV[0]) => {
    if (item.exact)                          return pathname === '/' && !tab;
    if (item.href.includes('tab=movies'))    return pathname === '/' && tab === 'movies';
    if (item.href.includes('tab=anime'))     return pathname === '/' && (tab === 'anime' || tab === null && false);
    if (item.href.includes('tab=mongol'))    return pathname === '/' && tab === 'mongol';
    return false;
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: 'rgba(0,0,0,0.96)',
        backdropFilter: 'blur(20px)',
        borderTop: '0.5px solid rgba(255,255,255,0.08)',
        height: '60px',
        paddingBottom: 'env(safe-area-inset-bottom)',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      {NAV.map((item) => {
        const active = isActive(item);
        const Icon   = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            style={{ position: 'relative' }}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-[3px] px-1 transition-all duration-150',
              active ? 'text-white' : 'text-white/35 hover:text-white/55'
            )}
          >
            {/* ✅ Active indicator — дээр (Netflix style) */}
            {active && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '24px',
                  height: '2px',
                  borderRadius: '0 0 2px 2px',
                  background: 'white',
                }}
              />
            )}

            <Icon
              className="w-[22px] h-[22px]"
              strokeWidth={active ? 2.2 : 1.8}
            />
            <span
              style={{
                fontSize: '9.5px',
                fontWeight: active ? 600 : 400,
                letterSpacing: '0.02em',
                lineHeight: 1,
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function MobileNav() {
  return (
    <Suspense fallback={null}>
      <MobileNavInner />
    </Suspense>
  );
}
