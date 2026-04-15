import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cache } from 'react';
import type { Metadata } from 'next';
import { MongolPlayer } from './mongol-player';
import { signMovieIframes, getBunnyVideo, bunnyVideoToMovie } from '@/lib/bunny';

type Props = { params: Promise<{ id: string }> };

// ISR: 30 минут — force-dynamic ХАСАВ (тэр нь revalidate-г дарж байсан!)
// Token 6 цаг хүчинтэй, ISR 30 мин → аюулгүй зай.
export const revalidate = 1800;

// React cache() — generateMetadata + page хоёулаа getBunnyVideo дуудна.
// cache() тул нэг render дотор зөвхөн НЭГ API дуудалт болно.
const getMovie = cache(async (id: string) => {
  const v = await getBunnyVideo(id);
  return v ? bunnyVideoToMovie(v) : null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovie(id);
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
  const movie = await getMovie(id);

  if (!movie) notFound();

  // Server-side дээр 6 цаг хүчинтэй Token-той signed URL үүсгэнэ.
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
