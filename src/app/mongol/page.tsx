'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/header';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlayCircle, ChevronLeft, ChevronRight } from 'lucide-react';

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
  { key: 'trailer', label: 'Трейлер' },
  { key: 'comedy',  label: 'Комеди' },
  { key: 'serial',  label: 'Сериал' },
];

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
      if (movie.preview) {
        setPreview(true);
        didPreview.current = true;
      }
    }, 300);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchTimer.current) clearTimeout(touchTimer.current);
    if (touchStart.current) {
      const dx = Math.abs(e.changedTouches[0].clientX - touchStart.current.x);
      const dy = Math.abs(e.changedTouches[0].clientY - touchStart.current.y);
      if (dx > 8 || dy > 8) {
        setPreview(false);
        didPreview.current = false;
        return;
      }
    }
    if (didPreview.current) {
      setTimeout(() => {
        setPreview(false);
        router.push(href);
      }, 600);
    }
  };

  const handleTouchCancel = () => {
    if (touchTimer.current) clearTimeout(touchTimer.current);
    setPreview(false);
    didPreview.current = false;
    touchStart.current = null;
  };

  return (
    <div className="group flex-shrink-0 w-[140px] sm:w-[160px] flex flex-col rounded-xl overflow-hidden border border-transparent hover:border-primary/40 hover:-translate-y-1 transition-all hover:shadow-xl hover:shadow-primary/10 bg-card">
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
        <Image
          src={movie.poster}
          alt={movie.name}
          fill
          className="object-cover rounded-t-xl"
          unoptimized
        />
        {movie.preview && preview && (
          <img
            src={movie.preview}
            alt="preview"
            className="absolute inset-0 w-full h-full object-cover rounded-t-xl animate-fade-in"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Badge className="absolute top-2 right-2 capitalize text-xs">{movie.category}</Badge>
        {movie.episodes && (
          <Badge variant="outline" className="absolute top-2 left-2 bg-black/60 text-xs">
            {movie.episodes.length} анги
          </Badge>
        )}
      </Link>
      <div className="p-2 flex flex-col gap-2 flex-1">
        <Link href={href}>
          <h3 className="font-semibold text-xs truncate hover:text-primary transition-colors">{movie.name}</h3>
        </Link>
        <Button asChild size="sm" className="w-full mt-auto text-xs h-8">
          <Link href={href}>
            <PlayCircle className="mr-1 h-3 w-3" />
            {movie.episodes ? 'Үзэх' : 'Тоглуулах'}
          </Link>
        </Button>
      </div>
    </div>
  );
}

function CategoryRow({ cat, movies }: { cat: { key: string; label: string }; movies: MongolMovie[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  if (movies.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-baseline gap-3">
          <h2 className="text-xl font-bold text-foreground">{cat.label}</h2>
          <span className="text-sm text-muted-foreground">{movies.length} кино</span>
        </div>
        <div className="hidden sm:flex gap-1">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

export default function MongolPage() {
  const [movies, setMovies] = useState<MongolMovie[]>([]);

  useEffect(() => {
    fetch('/mongol_movies.json')
      .then(r => r.json())
      .then(setMovies);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground">🇲🇳 Монгол Кино</h1>
          <p className="text-muted-foreground mt-1">{movies.length} кино нэмэгдсэн байна</p>
        </div>

        {CATEGORIES.map(cat => (
          <CategoryRow
            key={cat.key}
            cat={cat}
            movies={movies.filter(m => m.category === cat.key)}
          />
        ))}
      </main>
    </div>
  );
}
