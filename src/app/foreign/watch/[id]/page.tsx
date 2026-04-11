'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Episode = { ep: number; title: string; iframe: string };
type ForeignMovie = {
  id: number;
  name: string;
  category: string;
  poster: string;
  iframe?: string;
  preview?: string;
  episodes?: Episode[];
};

export default function ForeignWatchPage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<ForeignMovie | null | undefined>(undefined);
  const [epIndex, setEpIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/foreign_movies.json')
      .then(r => r.json())
      .then((movies: ForeignMovie[]) => {
        const found = movies.find(m => m.id === Number(params.id));
        setMovie(found ?? null);
      });
  }, [params.id]);

  if (movie === undefined) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-4">
          <p className="text-xl">Кино олдсонгүй</p>
          <Button onClick={() => router.push('/foreign')}>Буцах</Button>
        </div>
      </div>
    );
  }

  const isSerial = !!movie.episodes;
  const episodes = movie.episodes || [];
  const currentEp = episodes[epIndex];
  const iframeSrc = isSerial ? currentEp?.iframe : movie.iframe;

  return (
    <div className="flex h-screen flex-col bg-black text-white">
      <header className="flex items-center gap-4 px-4 py-3 bg-background/90 backdrop-blur border-b border-border/40">
        <Button variant="outline" size="icon" onClick={() => router.push('/foreign')}>
          <ArrowLeft />
        </Button>
        <div className="flex flex-col overflow-hidden">
          <h1 className="truncate font-semibold text-foreground">{movie.name}</h1>
          {isSerial && (
            <span className="text-sm text-muted-foreground">
              {epIndex + 1}-р анги / {episodes.length}
            </span>
          )}
        </div>
      </header>

      {isSerial && (
        <div className="flex gap-2 overflow-x-auto px-4 py-3 bg-background/80 border-b border-border/40">
          {episodes.map((ep, i) => (
            <button
              key={ep.ep}
              onClick={() => { setEpIndex(i); setLoading(true); }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                i === epIndex
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {ep.ep}-р анги
            </button>
          ))}
        </div>
      )}

      <main className="flex flex-1 items-center justify-center overflow-hidden bg-black">
        {loading && (
          <div className="absolute flex items-center justify-center w-full h-full">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}
        {iframeSrc ? (
          <iframe
            key={iframeSrc}
            src={iframeSrc}
            onLoad={() => setLoading(false)}
            allowFullScreen
            className="h-full w-full border-0"
            title={movie.name}
          />
        ) : (
          <p className="text-muted-foreground">Видео холбоос байхгүй байна</p>
        )}
      </main>

      {isSerial && (
        <footer className="flex items-center justify-between p-4 bg-background/90 border-t border-border/40">
          <Button
            variant="secondary"
            onClick={() => { setEpIndex(i => i - 1); setLoading(true); }}
            disabled={epIndex <= 0}
          >
            <ChevronLeft className="mr-2" /> Өмнөх
          </Button>
          <Button
            variant="secondary"
            onClick={() => { setEpIndex(i => i + 1); setLoading(true); }}
            disabled={epIndex >= episodes.length - 1}
          >
            Дараах <ChevronRight className="ml-2" />
          </Button>
        </footer>
      )}
    </div>
  );
}
