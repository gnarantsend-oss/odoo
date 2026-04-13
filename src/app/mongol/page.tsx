'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, ChevronLeft, ChevronRight, Plus, Check } from 'lucide-react';
import Header from '@/components/header';
import moviesJson from '@/lib/mongol_movies.json';
import { getWatchlist, toggleWatchlist } from '@/lib/watchlist';

type MongolMovie = {
  id: number; name: string; category: string; poster: string;
  iframe?: string; preview?: string;
  episodes?: { ep: number; title: string; iframe: string }[];
};

const MOVIES = moviesJson as MongolMovie[];

const CATEGORIES = [
  { key: 'drama',   label: '🎭 Драм' },
  { key: 'horror',  label: '👻 Аймшиг' },
  { key: 'comedy',  label: '😂 Инээдэм' },
  { key: 'trailer', label: '🎞 Трейлер' },
];

const CAT_LABEL: Record<string, string> = {
  drama: 'Драм', horror: 'Аймшиг', comedy: 'Инээдэм', trailer: 'Трейлер',
};

// ── CARD ─────────────────────────────────────────────────────────────────────
function Card({ movie }: { movie: MongolMovie }) {
  const [hovered, setHovered] = useState(false);
  const [wl, setWl] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const href = `/mongol/watch/${movie.id}`;

  useEffect(() => { setWl(getWatchlist().includes(movie.id)); }, [movie.id]);

  const handleWL = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setWl(toggleWatchlist(movie.id));
  };

  return (
    <div
      className="flex-shrink-0"
      style={{ width: 'clamp(130px,15vw,175px)', position: 'relative', zIndex: hovered ? 30 : 1 }}
      onMouseEnter={() => { timer.current = setTimeout(() => setHovered(true), 160); }}
      onMouseLeave={() => { if (timer.current) clearTimeout(timer.current); setHovered(false); }}
    >
      <div style={{
        borderRadius: '10px', overflow: 'hidden',
        background: 'rgba(255,255,255,0.04)',
        border: '0.5px solid rgba(255,255,255,0.07)',
        transform: hovered ? 'scale(1.1) translateY(-8px)' : 'scale(1)',
        boxShadow: hovered
          ? '0 28px 70px rgba(0,0,0,0.8), 0 0 0 1.5px rgba(229,9,20,0.35)'
          : '0 4px 16px rgba(0,0,0,0.4)',
        transition: 'transform 0.32s cubic-bezier(.22,.68,0,1.2), box-shadow 0.32s ease',
      }}>
        <Link href={href} style={{ display: 'block', aspectRatio: '2/3', position: 'relative', overflow: 'hidden' }}>
          <Image
            src={movie.poster} alt={movie.name} fill
            className="object-cover"
            style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.5s ease' }}
            unoptimized loading="lazy"
          />
          {/* Hover overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)',
            opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '12px',
          }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: hovered ? 'scale(1)' : 'scale(0.7)',
              transition: 'transform 0.3s cubic-bezier(.22,.68,0,1.2)',
            }}>
              <Play size={16} fill="#0b0e1a" color="#0b0e1a" />
            </div>
          </div>

          {/* Episode badge */}
          {movie.episodes && (
            <span style={{
              position: 'absolute', top: '7px', left: '7px',
              background: 'rgba(0,0,0,0.78)', color: 'white',
              fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px',
            }}>
              {movie.episodes.length} анги
            </span>
          )}

          {/* Watchlist button */}
          <button onClick={handleWL} style={{
            position: 'absolute', top: '7px', right: '7px',
            width: '26px', height: '26px', borderRadius: '50%',
            background: wl ? 'rgba(56,208,240,0.25)' : 'rgba(0,0,0,0.65)',
            border: `1px solid ${wl ? 'rgba(56,208,240,0.6)' : 'rgba(255,255,255,0.2)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(6px)',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'scale(1)' : 'scale(0.7)',
            transition: 'all 0.25s',
          }}>
            {wl ? <Check size={11} color="#38d0f0" /> : <Plus size={11} color="white" />}
          </button>
        </Link>

        <div style={{
          padding: '8px 10px',
          background: hovered ? 'rgba(18,20,32,1)' : 'transparent',
          transition: 'background 0.3s',
        }}>
          <p style={{
            fontSize: '11px', fontWeight: 700,
            color: 'rgba(255,255,255,0.88)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            marginBottom: '2px',
          }}>
            {movie.name}
          </p>
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.32)' }}>
            {CAT_LABEL[movie.category]}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── CATEGORY ROW ──────────────────────────────────────────────────────────────
function Row({ cat, movies }: { cat: { key: string; label: string }; movies: MongolMovie[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: 'l' | 'r') =>
    ref.current?.scrollBy({ left: d === 'l' ? -420 : 420, behavior: 'smooth' });

  if (!movies.length) return null;

  return (
    <section style={{ marginBottom: '32px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 4%', marginBottom: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <h2 style={{ fontSize: '19px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
            {cat.label}
          </h2>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{movies.length}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div className="hidden sm:flex" style={{ gap: '4px' }}>
            {(['l', 'r'] as const).map(d => (
              <button key={d} onClick={() => scroll(d)} style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.07)',
                border: '0.5px solid rgba(255,255,255,0.1)',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: 'white',
              }}>
                {d === 'l' ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={ref}
        className="scrollbar-hide"
        style={{
          display: 'flex', gap: '10px', overflowX: 'auto',
          padding: '12px 4% 16px', cursor: 'grab',
        }}
      >
        {movies.map(m => <Card key={m.id} movie={m} />)}
      </div>
    </section>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function MongolPage() {
  const total = MOVIES.length;

  return (
    <div style={{ minHeight: '100vh', background: '#0b0e1a', color: '#fff' }}>
      <Header />

      <main style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        {/* Page title */}
        <div style={{ padding: '0 4%', marginBottom: '28px' }}>
          <h1 style={{
            fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 900,
            color: 'white', letterSpacing: '-0.03em',
          }}>
            🎬 Монгол кино
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginTop: '6px' }}>
            {total} кино нийт
          </p>
        </div>

        {/* Category rows */}
        {CATEGORIES.map(cat => (
          <Row
            key={cat.key}
            cat={cat}
            movies={MOVIES.filter(m => m.category === cat.key)}
          />
        ))}
      </main>
    </div>
  );
}
