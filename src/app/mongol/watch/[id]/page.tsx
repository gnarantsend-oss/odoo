import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MongolPlayer } from './mongol-player';
import { signMovieIframes } from '@/lib/bunny';

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

// ── Бүх кино хуудсыг build үед pre-render хийнэ ─────────────────────────────
// Cloudflare edge-д static shell-ийг cache хийж, 500k хэрэглэгчийг серверт
// хүрэхгүйгээр үйлчилнэ. Token нь request үед динамикаар үүснэ.
export async function generateStaticParams() {
  return movies.map((m) => ({ id: String(m.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const movie = movies.find((m) => m.id === Number(id));
  if (!movie) return { title: 'Кино олдсонгүй' };
  return {
    title: `${movie.name} — Narhan TV`,
    description: `${movie.name} — Монгол кино үзнэ үү.`,
    openGraph: {
      title: `${movie.name} — Narhan TV`,
      description: `${movie.name} — Монгол кино үзнэ үү.`,
      images: movie.poster ? [{ url: movie.poster }] : [],
    },
  };
}

export default async function MongolWatchPage({ params }: Props) {
  const { id } = await params;
  const movie = movies.find((m) => m.id === Number(id));

  if (!movie) notFound();

  // Server-side дээр 6 цаг хүчинтэй Token-той signed URL үүсгэнэ.
  // Cloudflare edge 30 мин cache хийх тул token 5.5 цаг хүчинтэй үлдэнэ.
  const signedMovie = signMovieIframes(movie, 21600);

  const isSerial = !!movie.episodes && movie.episodes.length > 0;

  return (
    <div className="flex h-screen flex-col bg-black text-white">
      <header className="flex items-center gap-4 px-4 py-3 bg-background/90 backdrop-blur border-b border-border/40">
        <Link href="/">
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

      <MongolPlayer movie={signedMovie} />
    </div>
  );
}
