'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Play, Plus, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import moviesJson from '@/lib/mongol_movies.json';

type MongolMovie = {
  id: number;
  name: string;
  category: string;
  poster: string;
  iframe?: string;
  preview?: string;
  episodes?: { ep: number; title: string; iframe: string }[];
};

const CATEGORIES = [
  { key: 'drama',   label: '🎭 Драм' },
  { key: 'horror',  label: '👻 Хорор' },
  { key: 'comedy',  label: '😂 Комеди' },
  { key: 'trailer', label: '🎬 Трейлер' },
];

// ── Continue watching ─────────────────────────────────────────────────────────
const CW_KEY = 'narhan-continue';

function getCW(): { id: number; ep: number }[] {
  try { return JSON.parse(localStorage.getItem(CW_KEY) || '[]'); } catch { return []; }
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function MongolHero({ movies }: { movies: MongolMovie[] }) {
  const featured = movies.filter(m => m.category !== 'trailer').slice(0, 5);
  const [idx, setIdx]       = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((next: number) => {
    setFading(true);
    setTimeout(() => { setIdx(next); setFading(false); }, 280);
  }, []);

  useEffect(() => {
    if (featured.length < 2) return;
    timerRef.current = setInterval(() => goTo((idx + 1) % featured.length), 6000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [idx, featured.length, goTo]);

  if (!featured.length) return null;

  const movie    = featured[idx];
  const href     = `/mongol/watch/${movie.id}`;
  const catLabel = CATEGORIES.find(c => c.key === movie.category)?.label?.replace(/^\S+\s/, '') ?? movie.category;

  return (
    <div
      className="relative w-full overflow-hidden -mb-12 sm:-mb-16 md:-mb-24"
      style={{ height: 'clamp(520px, 75vh, 800px)' }}
    >
      {/* Ambilight — постерийн өнгө фон болж гэрэлтнэ */}
      <div
        key={`amb-${movie.id}`}
        aria-hidden
        style={{
          position: 'absolute', inset: '-40px',
          backgroundImage: `url(${movie.poster})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'blur(80px) saturate(2) brightness(0.35)',
          opacity: fading ? 0 : 0.7,
          transition: 'opacity 0.8s ease',
          transform: 'scale(1.15)',
          zIndex: 0,
        }}
      />

      {/* BG poster */}
      <div
        key={movie.id}
        className="absolute inset-0 transition-opacity duration-300"
        style={{ opacity: fading ? 0 : 1, zIndex: 1 }}
      >
        <img
          src={movie.poster}
          alt={movie.name}
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ opacity: 0.6 }}
        />
      </div>

      {/* Gradients */}
      <div className="absolute inset-0 z-10"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.02) 70%, transparent 100%)' }} />
      <div className="absolute inset-0 z-10 hidden md:block"
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, transparent 55%)' }} />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-20 md:pb-32 md:px-12">
        <div className="mb-3 flex items-center gap-2 hero-badge-anim">
          <span style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', color: 'white',
            background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)',
            padding: '3px 10px', borderRadius: '4px', border: '0.5px solid rgba(255,255,255,0.2)',
          }}>🇲🇳 МОНГОЛ КИНО</span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>{catLabel}</span>
          {movie.episodes && (
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>
              {movie.episodes.length} анги
            </span>
          )}
        </div>

        <h1 className="line-clamp-2 hero-title-anim" style={{
          fontSize: 'clamp(28px, 7vw, 60px)', fontWeight: 800, lineHeight: 1.05,
          letterSpacing: '-0.02em', color: 'white',
          textShadow: '0 2px 32px rgba(0,0,0,0.9)', marginBottom: '16px',
        }}>{movie.name}</h1>

        <div className="flex items-center gap-3 hero-btns-anim">
          <Link href={href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', minWidth: '48px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.14)', border: '1.5px solid rgba(255,255,255,0.28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)',
            }}>
              <Plus size={18} color="white" />
            </div>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap' }}>Жагсаалт</span>
          </Link>

          <Link href={href}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '9px',
              background: 'white', color: 'black', padding: '11px 28px',
              borderRadius: '6px', fontWeight: 700, fontSize: '15px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
            }}>
              <Play size={18} fill="black" />
              {movie.episodes ? 'Үзэх' : 'Тоглуулах'}
            </div>
          </Link>

          <Link href={href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', minWidth: '48px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.14)', border: '1.5px solid rgba(255,255,255,0.28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)',
            }}>
              <Info size={18} color="white" />
            </div>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)' }}>Дэлгэрэнгүй</span>
          </Link>
        </div>
      </div>

      {/* Dots */}
      {featured.length > 1 && (
        <div className="absolute bottom-14 md:bottom-20 right-5 z-30 flex gap-1.5">
          {featured.map((_, i) => (
            <button key={i}
              onClick={() => { if (timerRef.current) clearInterval(timerRef.current); goTo(i); }}
              style={{
                width: i === idx ? '20px' : '6px', height: '6px', borderRadius: '3px',
                background: i === idx ? 'white' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.3s', border: 'none', cursor: 'pointer', padding: 0,
              }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Continue Watching Row ─────────────────────────────────────────────────────
function ContinueWatchingRow({ movies }: { movies: MongolMovie[] }) {
  const [cwIds, setCwIds] = useState<{ id: number; ep: number }[]>([]);

  useEffect(() => { setCwIds(getCW()); }, []);

  const cwMovies = cwIds
    .map(({ id, ep }) => ({ movie: movies.find(m => m.id === id), ep }))
    .filter(x => x.movie) as { movie: MongolMovie; ep: number }[];

  if (!cwMovies.length) return null;

  return (
    <section className="mb-4 row-section">
      <div className="flex items-baseline gap-2 mb-2 px-4 md:px-12">
        <h2 className="text-base font-bold text-foreground">▶ Үргэлжлүүлэх</h2>
        <span className="text-xs text-muted-foreground">{cwMovies.length} кино</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 px-4 md:px-12 scrollbar-hide">
        {cwMovies.map(({ movie, ep }) => {
          const href = `/mongol/watch/${movie.id}`;
          return (
            <Link
              key={movie.id}
              href={href}
              className="flex-shrink-0 card-hover rounded-xl overflow-hidden"
              style={{
                width: '180px',
                background: 'rgba(255,255,255,0.04)',
                border: '0.5px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="aspect-[2/3] relative overflow-hidden">
                <Image src={movie.poster} alt={movie.name} fill className="object-cover" unoptimized loading="lazy" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(0,0,0,0.45)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Play size={16} fill="black" color="black" />
                  </div>
                </div>
                {movie.episodes && (
                  <Badge variant="outline" className="absolute top-2 left-2 bg-black/70 text-xs border-white/20">
                    {ep + 1}-р анги
                  </Badge>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs font-medium truncate">{movie.name}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ── Card — 2026: том хэмжээ ──────────────────────────────────────────────────
function MongolCard({ movie }: { movie: MongolMovie }) {
  const router = useRouter();
  const [preview, setPreview] = useState(false);
  const touchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didPreview = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const href = `/mongol/watch/${movie.id}`;

  const onTouchStart = (e: React.TouchEvent) => {
    didPreview.current = false;
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    touchTimer.current = setTimeout(() => {
      if (movie.preview) { setPreview(true); didPreview.current = true; }
    }, 300);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchTimer.current) clearTimeout(touchTimer.current);
    if (touchStart.current) {
      const dx = Math.abs(e.changedTouches[0].clientX - touchStart.current.x);
      const dy = Math.abs(e.changedTouches[0].clientY - touchStart.current.y);
      if (dx > 8 || dy > 8) { setPreview(false); didPreview.current = false; return; }
    }
    if (didPreview.current) setTimeout(() => { setPreview(false); router.push(href); }, 600);
  };
  const onTouchCancel = () => {
    if (touchTimer.current) clearTimeout(touchTimer.current);
    setPreview(false); didPreview.current = false; touchStart.current = null;
  };

  return (
    <div
      className="group flex-shrink-0 card-hover rounded-xl overflow-hidden"
      style={{
        width: 'clamp(150px, 18vw, 200px)',
        background: 'rgba(255,255,255,0.04)',
        border: '0.5px solid rgba(255,255,255,0.08)',
      }}
    >
      <Link
        href={href}
        className="block aspect-[2/3] relative overflow-hidden select-none"
        onMouseEnter={() => setPreview(true)}
        onMouseLeave={() => setPreview(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
        draggable={false}
      >
        <Image src={movie.poster} alt={movie.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized loading="lazy" />
        {movie.preview && preview && (
          <img src={movie.preview} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Play size={15} fill="black" color="black" />
          </div>
        </div>
        {movie.episodes && (
          <Badge variant="outline" className="absolute top-2 left-2 bg-black/70 text-xs border-white/20">
            {movie.episodes.length} анги
          </Badge>
        )}
      </Link>
      <div className="p-2.5">
        <Link href={href}>
          <p className="text-xs font-medium truncate hover:text-primary transition-colors">{movie.name}</p>
        </Link>
      </div>
    </div>
  );
}

// ── Row ───────────────────────────────────────────────────────────────────────
function MongolRow({ cat, movies }: { cat: { key: string; label: string }; movies: MongolMovie[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (d: 'left' | 'right') =>
    scrollRef.current?.scrollBy({ left: d === 'left' ? -380 : 380, behavior: 'smooth' });
  if (!movies.length) return null;

  return (
    <section className="mb-6 row-section">
      <div className="flex items-center justify-between mb-2 px-4 md:px-12">
        <div className="flex items-baseline gap-2">
          <h2 className="text-base font-bold text-foreground">{cat.label}</h2>
          <span className="text-xs text-muted-foreground">{movies.length} кино</span>
        </div>
        <div className="hidden sm:flex gap-1">
          <button onClick={() => scroll('left')} className="p-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => scroll('right')} className="p-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 px-4 md:px-12 scrollbar-hide">
        {movies.map(m => <MongolCard key={m.id} movie={m} />)}
      </div>
    </section>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function MongolTab() {
  const movies = moviesJson as MongolMovie[];
  if (!movies.length) return (
    <div className="text-center py-24 text-muted-foreground">Кино байхгүй байна</div>
  );

  return (
    <>
      <MongolHero movies={movies} />
      <div className="py-4 space-y-2">
        <ContinueWatchingRow movies={movies} />
        {CATEGORIES.map(cat => (
          <MongolRow key={cat.key} cat={cat} movies={movies.filter(m => m.category === cat.key)} />
        ))}
      </div>
    </>
  );
}
