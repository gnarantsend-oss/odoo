import { notFound } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Metadata } from 'next';

// JSON-г server-side import — client-д 52KB fetch хийхгүй болно
import moviesData from '@/lib/mongol_movies.json';

type Episode = { ep: number; title: string; iframe: string };
type MongolMovie = {
  id: number;
  name: string;
  category: string;
  poster: string;
  iframe?: string;
  preview?: string;
  episodes?: Episode[];
};

const movies: MongolMovie[] = moviesData as MongolMovie[];

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const movie = movies.find((m) => m.id === Number(id));
  if (!movie) return { title: 'Кино олдсонгүй' };
  return {
    title: `${movie.name} — Narhan TV`,
    description: `${movie.name} — Монгол кино үзнэ үү.`,
  };
}

export default async function MongolWatchPage({ params }: Props) {
  const { id } = await params;
  const movie = movies.find((m) => m.id === Number(id));

  if (!movie) notFound();

  const isSerial = !!movie.episodes && movie.episodes.length > 0;

  return (
    <div className="flex h-screen flex-col bg-black text-white">
      {/* Header */}
      <header className="flex items-center gap-4 px-4 py-3 bg-background/90 backdrop-blur border-b border-border/40">
        <Link href="/mongol">
          <Button variant="outline" size="icon" aria-label="Буцах">
            <ArrowLeft />
          </Button>
        </Link>
        <div className="flex flex-col overflow-hidden">
          <h1 className="truncate font-semibold text-foreground">{movie.name}</h1>
          {isSerial && (
            <span className="text-sm text-muted-foreground">
              {movie.episodes!.length} анги
            </span>
          )}
        </div>
      </header>

      {/* Player — client island */}
      <MongolPlayer movie={movie} />
    </div>
  );
}

// Client island — зөвхөн iframe болон episode navigation-д зориулсан
// Ингэснээр бүх data server-side-аас ирж, client bundle жижигхэн байна
'use client';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

function MongolPlayer({ movie }: { movie: MongolMovie }) {
  const isSerial = !!movie.episodes && movie.episodes.length > 0;
  const episodes = movie.episodes || [];

  const [epIndex, setEpIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const iframeSrc = isSerial ? episodes[epIndex]?.iframe : movie.iframe;

  return (
    <>
      {/* Episode selector */}
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

      {/* Iframe */}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-black">
        {loading && (
          <div className="absolute flex items-center justify-center w-full h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

      {/* Episode navigation */}
      {isSerial && (
        <footer className="flex items-center justify-between p-4 bg-background/90 border-t border-border/40">
          <Button
            variant="secondary"
            onClick={() => { setEpIndex(i => i - 1); setLoading(true); }}
            disabled={epIndex <= 0}
          >
            <ChevronLeft className="mr-2" /> Өмнөх
          </Button>
          <span className="text-sm text-muted-foreground">
            {epIndex + 1} / {episodes.length}
          </span>
          <Button
            variant="secondary"
            onClick={() => { setEpIndex(i => i + 1); setLoading(true); }}
            disabled={epIndex >= episodes.length - 1}
          >
            Дараах <ChevronRight className="ml-2" />
          </Button>
        </footer>
      )}
    </>
  );
}
