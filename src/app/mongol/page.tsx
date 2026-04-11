'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Header from '@/components/header';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Play, Plus, Info, ChevronLeft, ChevronRight } from 'lucide-react';

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
  { key: 'drama',   label: 'Драм' },
  { key: 'horror',  label: 'Хорор' },
  { key: 'comedy',  label: 'Комеди' },
  { key: 'serial',  label: 'Сериал' },
  { key: 'trailer', label: 'Трейлер' },
];

// ── Hero ──────────────────────────────────────────────────────────────────────
function MongolHero({ movies }: { movies: MongolMovie[] }) {
  const featured = movies.filter(m => m.category !== 'trailer' && m.preview).slice(0, 5);
  const [idx, setIdx]         = useState(0);
  const [fading, setFading]   = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((next: number) => {
    setFading(true);
    setTimeout(() => {
      setIdx(next);
      setFading(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (featured.length < 2) return;
    timerRef.current = setInterval(() => {
      goTo((idx + 1) % featured.length);
    }, 6000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [idx, featured.length, goTo]);

  if (featured.length === 0) return null;

  const movie = featured[idx];
  const href  = `/mongol/watch/${movie.id}`;
  const catLabel = CATEGORIES.find(c => c.key === movie.category)?.label ?? movie.category;

  return (
    <div className="relative w-full overflow-hidden -mb-12 sm:-mb-16"
         style={{ height: 'clamp(500px, 70vh, 760px)' }}>

      {/* Blurred poster background */}
      <div
        key={movie.id}
        className="absolute inset-0 transition-opacity duration-300"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <img
          src={movie.poster}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover scale-110"
          style={{ filter: 'blur(28px) brightness(0.45)', transformOrigin: 'center' }}
        />
        {/* Sharp poster center */}
        <img
          src={movie.poster}
          alt={movie.name}
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ opacity: 0.55 }}
        />
      </div>

      {/* Gradients */}
      <div className="absolute inset-0 z-10"
           style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.1) 75%, transparent 100%)' }} />
      <div className="absolute inset-0 z-10"
           style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, transparent 60%)' }} />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-16 md:pb-24 md:px-12">
        {/* Badge */}
        <div className="mb-2 flex items-center gap-2">
          <span style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em',
            background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)',
            padding: '2px 8px', borderRadius: '4px', border: '0.5px solid rgba(255,255,255,0.2)',
            color: 'white',
          }}>🇲🇳 МОНГОЛ КИНО</span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{catLabel}</span>
        </div>

        {/* Title */}
        <h1 className="line-clamp-2" style={{
          fontSize: 'clamp(28px, 6vw, 56px)', fontWeight: 800, lineHeight: 1.05,
          letterSpacing: '-0.01em', color: 'white',
          textShadow: '0 2px 24px rgba(0,0,0,0.9)', marginBottom: '16px',
        }}>
          {movie.name}
        </h1>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          {/* My List */}
          <Link href={href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', minWidth: '48px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(6px)',
            }}>
              <Plus size={18} color="white" />
            </div>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>My List</span>
          </Link>

          {/* Play */}
          <Link href={href}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'white', color: 'black',
              padding: '10px 24px', borderRadius: '4px',
              fontWeight: 700, fontSize: '15px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}>
              <Play size={18} fill="black" />
              {movie.episodes ? 'Үзэх' : 'Тоглуулах'}
            </div>
          </Link>

          {/* Info */}
          <Link href={href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', minWidth: '48px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(6px)',
            }}>
              <Info size={18} color="white" />
            </div>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>Info</span>
          </Link>
        </div>
      </div>

      {/* Slide dots */}
      {featured.length > 1 && (
        <div className="absolute bottom-6 right-5 z-30 flex gap-1.5">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => { if (timerRef.current) clearInterval(timerRef.current); goTo(i); }}
              style={{
                width: i === idx ? '18px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === idx ? 'white' : 'rgba(255,255,255,0.35)',
                transition: 'all 0.3s ease',
                border: 'none', cursor: 'pointer', padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Movie Card ────────────────────────────────────────────────────────────────
function MovieCard({ movie }: { movie: MongolMovie }) {
  const router = useRouter();
  const [preview, setPreview] = useState(false);
  const touchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didPreview = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const href = `/mongol/watch/${movie.id}`;

  const handleTouchStart = (e: React.TouchEvent) => {
    didPreview.current = false;
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    touchTimer.current = setTimeout(() => {
      if (movie.preview) { setPreview(true); didPreview.current = true; }
    }, 300);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchTimer.current) clearTimeout(touchTimer.current);
    if (touchStart.current) {
      const dx = Math.abs(e.changedTouches[0].clientX - touchStart.current.x);
      const dy = Math.abs(e.changedTouches[0].clientY - touchStart.current.y);
      if (dx > 8 || dy > 8) { setPreview(false); didPreview.current = false; return; }
    }
    if (didPreview.current) {
      setTimeout(() => { setPreview(false); router.push(href); }, 600);
    }
  };
  const handleTouchCancel = () => {
    if (touchTimer.current) clearTimeout(touchTimer.current);
    setPreview(false); didPreview.current = false; touchStart.current = null;
  };

  return (
    <div className="group flex-shrink-0 w-[130px] sm:w-[150px] flex flex-col rounded-xl overflow-hidden"
         style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.2s', cursor: 'pointer' }}
         onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)')}
         onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
      <Link
        href={href}
        className="block aspect-[2/3] relative overflow-hidden select-none"
        onMouseEnter={() => setPreview(true)}
        onMouseLeave={() => setPreview(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        draggable={false}
      >
        <Image src={movie.poster} alt={movie.name} fill className="object-cover" unoptimized />
        {movie.preview && preview && (
          <img src={movie.preview} alt="preview"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ animation: 'fadeIn 0.2s ease' }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
          }}>
            <Play size={14} fill="black" color="black" />
          </div>
        </div>
        {movie.episodes && (
          <Badge variant="outline" className="absolute top-2 left-2 bg-black/70 text-xs border-white/20">
            {movie.episodes.length} анги
          </Badge>
        )}
      </Link>
      <div className="p-2">
        <Link href={href}>
          <p className="text-xs font-medium truncate hover:text-primary transition-colors leading-tight">
            {movie.name}
          </p>
        </Link>
      </div>
    </div>
  );
}

// ── Category Row ──────────────────────────────────────────────────────────────
function CategoryRow({ cat, movies }: { cat: { key: string; label: string }; movies: MongolMovie[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };
  if (movies.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3 px-4 md:px-0">
        <div className="flex items-baseline gap-2">
          <h2 className="text-lg font-bold text-foreground">{cat.label}</h2>
          <span className="text-xs text-muted-foreground">{movies.length} кино</span>
        </div>
        <div className="hidden sm:flex gap-1">
          <button onClick={() => scroll('left')}
            className="p-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => scroll('right')}
            className="p-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 px-4 md:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MongolPage() {
  const [movies, setMovies] = useState<MongolMovie[]>([]);

  useEffect(() => {
    fetch('/mongol_movies.json')
      .then(r => r.json())
      .then(setMovies)
      .catch(() => setMovies([]));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {movies.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <MongolHero movies={movies} />
            <div className="container mx-auto max-w-7xl py-8 sm:px-6 lg:px-8">
              <div className="mb-6 px-4 md:px-0">
                <h1 className="text-2xl font-bold text-foreground">🇲🇳 Монгол Кино</h1>
                <p className="text-muted-foreground text-sm mt-1">{movies.length} кино нэмэгдсэн байна</p>
              </div>
              {CATEGORIES.map(cat => (
                <CategoryRow
                  key={cat.key}
                  cat={cat}
                  movies={movies.filter(m => m.category === cat.key)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
