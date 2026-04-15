import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MongolPlayer } from './mongol-player';
import { signMovieIframes, getBunnyVideo, bunnyVideoToMovie } from '@/lib/bunny';

type Props = { params: Promise<{ id: string }> };

// ── ISR: 30 минут тутам шинэчлэгдэнэ ────────────────────────────────────────
// Token 6 цаг хүчинтэй, ISR 30 мин → аюулгүй зай.
// Regional cache edge-д хадгалагдана, R2 load бага байна.
// Deploy хийхэд cache устгагддаггүй — ISR автоматаар шинэчилнэ.
export const revalidate = 1800; // 30 минут

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const v = await getBunnyVideo(id);
  const movie = v ? bunnyVideoToMovie(v) : null;
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
  const v = await getBunnyVideo(id);
  const movie = v ? bunnyVideoToMovie(v) : null;

  if (!movie) notFound();

  // Server-side дээр 6 цаг хүчинтэй Token-той signed URL үүсгэнэ.
  // ISR 30 мин тутам шинэ token авна → token 5.5 цаг хүчинтэй үлдэнэ.
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
