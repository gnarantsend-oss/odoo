'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Header from '@/components/header';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';

type ForeignMovie = {
  id: number;
  name: string;
  category: string;
  poster: string;
  iframe?: string;
  preview?: string;
  episodes?: { ep: number; title: string; iframe: string }[];
};

const TABS = [
  { key: 'all',      label: 'Бүгд' },
  { key: 'action',   label: '💥 Экшн' },
  { key: 'drama',    label: '🎭 Драм' },
  { key: 'comedy',   label: '😂 Комеди' },
  { key: 'horror',   label: '👻 Хорор' },
  { key: 'romance',  label: '💕 Романтик' },
  { key: 'sci-fi',   label: '🚀 Фантаст' },
  { key: 'animation',label: '🎨 Анимэйшн' },
  { key: 'korean',   label: '🇰🇷 Солонгос' },
  { key: 'serial',   label: '📺 Сериал' },
];

function MovieCard({ movie }: { movie: ForeignMovie }) {
  const router = useRouter();
  const [preview, setPreview] = useState(false);
  const touchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didPreview = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const href = `/foreign/watch/${movie.id}`;

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
    <div className="group flex flex-col rounded-xl overflow-hidden border border-transparent hover:border-primary/40 hover:-translate-y-1 transition-all hover:shadow-xl hover:shadow-primary/10 bg-card">
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
      <div className="p-3 flex flex-col gap-2 flex-1">
        <Link href={href}>
          <h3 className="font-semibold text-sm truncate hover:text-primary transition-colors leading-tight">
            {movie.name}
          </h3>
        </Link>
        <Button asChild size="sm" className="w-full mt-auto">
          <Link href={href}>
            <PlayCircle className="mr-2 h-4 w-4" />
            {movie.episodes ? 'Үзэх' : 'Тоглуулах'}
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function ForeignPage() {
  const [movies, setMovies] = useState<ForeignMovie[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetch('/foreign_movies.json')
      .then(r => r.json())
      .then(setMovies)
      .catch(() => setMovies([]));
  }, []);

  const filtered = useMemo(() =>
    activeTab === 'all' ? movies : movies.filter(m => m.category === activeTab),
    [activeTab, movies]
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Гарчиг */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">🌍 Гадаад Кино</h1>
          <p className="text-muted-foreground mt-1">{movies.length} кино нэмэгдсэн байна</p>
        </div>

        {/* Ангиллын tab - хэвтээ гүйлгэх */}
        <div className="mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {TABS.map(tab => {
              const count = tab.key === 'all'
                ? movies.length
                : movies.filter(m => m.category === tab.key).length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    activeTab === tab.key
                      ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/30'
                      : 'bg-secondary/50 text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {tab.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.key
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Кино grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-4xl mb-4">🎬</p>
            <p className="text-muted-foreground text-lg">
              {movies.length === 0 ? 'Кино ачаалж байна...' : 'Энэ ангилалд кино байхгүй байна'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filtered.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
