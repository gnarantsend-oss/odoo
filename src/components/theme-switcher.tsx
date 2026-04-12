'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme, type Theme } from './theme-provider';
import { cn } from '@/lib/utils';

const THEMES: {
  id: Theme;
  name: string;
  emoji: string;
  primary: string;
  bg: string;
  desc: string;
}[] = [
  {
    id: 'abyss',
    name: 'Abyss',
    emoji: '🌊',
    primary: '#38d0f0',
    bg: 'linear-gradient(135deg,#0a0f2e 0%,#0d1b3e 100%)',
    desc: 'Далайн гүн цэнхэр',
  },
  {
    id: 'crimson',
    name: 'Crimson',
    emoji: '🔴',
    primary: '#e50914',
    bg: 'linear-gradient(135deg,#1a0000 0%,#2d0a0a 100%)',
    desc: 'Netflix улаан',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    emoji: '🌌',
    primary: '#a78bfa',
    bg: 'linear-gradient(135deg,#0d0520 0%,#1a0a35 100%)',
    desc: 'Хойд гэрэл нил ягаан',
  },
  {
    id: 'ember',
    name: 'Ember',
    emoji: '🔥',
    primary: '#f97316',
    bg: 'linear-gradient(135deg,#1a0800 0%,#2d1200 100%)',
    desc: 'Гал дөлийн улбар шар',
  },
  {
    id: 'forest',
    name: 'Forest',
    emoji: '🌿',
    primary: '#34d399',
    bg: 'linear-gradient(135deg,#001a0f 0%,#002d1a 100%)',
    desc: 'Ойн ногоон',
  },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold',
          'border border-white/10 bg-white/5 hover:bg-white/10',
          'transition-all duration-200 backdrop-blur-sm',
          open && 'bg-white/10 border-white/20'
        )}
        aria-label="Theme солих"
      >
        <span
          className="w-3 h-3 rounded-full ring-1 ring-white/20 flex-shrink-0"
          style={{ backgroundColor: current.primary }}
        />
        <span className="hidden sm:inline text-white/70">{current.name}</span>
        <svg
          className={cn('w-3 h-3 text-white/40 transition-transform', open && 'rotate-180')}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className={cn(
          'absolute right-0 top-full mt-2 w-52 z-[200]',
          'rounded-2xl border border-white/10 overflow-hidden',
          'shadow-2xl shadow-black/60',
          'bg-black/80 backdrop-blur-2xl',
          'animate-in fade-in slide-in-from-top-2 duration-150'
        )}>
          <div className="p-1.5 flex flex-col gap-0.5">
            {THEMES.map((t) => {
              const isActive = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => { setTheme(t.id); setOpen(false); }}
                  className={cn(
                    'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left',
                    'transition-all duration-150',
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white/90'
                  )}
                >
                  {/* Mini preview */}
                  <span
                    className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-base"
                    style={{ background: t.bg, boxShadow: isActive ? `0 0 12px ${t.primary}55` : 'none' }}
                  >
                    {t.emoji}
                  </span>

                  <span className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold leading-none mb-0.5">{t.name}</span>
                    <span className="text-xs opacity-50 truncate">{t.desc}</span>
                  </span>

                  {/* Active dot */}
                  {isActive && (
                    <span
                      className="ml-auto w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: t.primary }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom label */}
          <div className="px-4 py-2 border-t border-white/5 text-[10px] text-white/25 text-center">
            Narhan TV Themes
          </div>
        </div>
      )}
    </div>
  );
}
