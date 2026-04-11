'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { fetchMediaById } from '@/lib/anilist';
import { slugify } from '@/lib/utils';
import Header from '@/components/header';
import { SeasonEpisodeSelector } from '@/components/season-episode-selector';
import { Badge } from '@/components/ui/badge';
import RelatedMedia from '@/components/related-media';
import RecommendedMedia from '@/components/recommended-media';
import type { Media } from '@/lib/types';

export default function MediaDetailsPage() {
  const params = useParams();
  const type  = params['type'] as string;
  const idSlug = params['id-slug'] as string;

  const [media, setMedia]   = useState<Media | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(false);

  useEffect(() => {
    if (!idSlug) return;
    const id = parseInt(idSlug.split('-')[0], 10);
    if (isNaN(id) || !['anime', 'manga'].includes(type)) {
      setError(true); setLoading(false); return;
    }
    fetchMediaById(id)
      .then(data => {
        if (!data) { setError(true); }
        else { setMedia(data); }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [idSlug, type]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </main>
      </div>
    );
  }

  if (error || !media) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="text-muted-foreground">Хуудас олдсонгүй</p>
          <Link href="/" className="text-primary hover:underline">Нүүр хуудас руу буцах</Link>
        </main>
      </div>
    );
  }

  const title       = media.title.english || media.title.romaji;
  const description = media.description?.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '') || 'Тайлбар байхгүй.';
  const isAnime     = media.type === 'ANIME';

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="relative h-[30vh] w-full sm:h-[40vh] md:h-[50vh]">
          {media.bannerImage && (
            <Image
              src={media.bannerImage}
              alt={`Backdrop for ${title}`}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
        </div>

        <div className="container mx-auto max-w-5xl -mt-16 px-4 pb-8 sm:px-6 lg:-mt-24 lg:px-8">
          <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end">
            <div className="w-full max-w-[150px] shrink-0 md:max-w-[200px]">
              {media.coverImage.extraLarge && (
                <Image
                  src={media.coverImage.extraLarge}
                  alt={`Poster for ${title}`}
                  width={200}
                  height={300}
                  className="rounded-lg shadow-xl"
                  unoptimized
                />
              )}
            </div>
            <div className="flex flex-col gap-2 py-4">
              <h1 className="text-2xl font-bold text-foreground md:text-4xl">{title}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <Badge>{media.type}</Badge>
                {media.startDate?.year && <Badge variant="outline">{media.startDate.year}</Badge>}
                {media.format && <Badge variant="outline">{media.format}</Badge>}
                {media.status && <Badge variant="outline">{media.status}</Badge>}
                {media.episodes && <Badge variant="outline">{media.episodes} Episodes</Badge>}
                {media.chapters && <Badge variant="outline">{media.chapters} Chapters</Badge>}
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="md:col-span-2 space-y-4">
                <h2 className="text-2xl font-bold">Synopsis</h2>
                <p className="whitespace-pre-line text-foreground/80">{description}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {isAnime ? 'Watch Now' : 'Read Now'}
                </h2>
                <SeasonEpisodeSelector media={media} />
              </div>
            </div>

            {media.relations && <RelatedMedia relations={media.relations} />}
            <RecommendedMedia media={media} />
          </div>
        </div>
      </main>
    </div>
  );
}
