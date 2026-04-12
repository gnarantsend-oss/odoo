'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

export function MongolPlayer({ movie }: { movie: MongolMovie }) {
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
