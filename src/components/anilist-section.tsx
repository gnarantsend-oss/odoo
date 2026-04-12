'use client';

import { useEffect, useState } from 'react';
import { fetchFromAniList } from '@/lib/anilist';
import { type Media } from '@/lib/types';
import MediaCarousel from './media-carousel';
import HeroCarousel from './hero-carousel';

export default function AniListSection({ type }: { type: 'ANIME' | 'MANGA' }) {
  const [trending, setTrending] = useState<Media[]>([]);
  const [popular, setPopular] = useState<Media[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      fetchFromAniList({ type, sort: ['TRENDING_DESC', 'POPULARITY_DESC'], perPage: 20 }),
      fetchFromAniList({ type, sort: ['POPULARITY_DESC'], perPage: 20 }),
    ]).then(([t, p]) => {
      if (t.status === 'fulfilled') setTrending(t.value);
      if (p.status === 'fulfilled') setPopular(p.value);
      setLoaded(true);
    });
  }, [type]);

  if (!loaded) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );

  const label = type === 'ANIME' ? 'Anime' : 'Manga';

  return (
    <>
      {trending.length > 0 && <HeroCarousel items={trending.slice(0, 5)} />}
      <div className="py-4 space-y-2">
        {trending.length > 0 && <MediaCarousel title={`Trending ${label}`} items={trending} />}
        {popular.length > 0  && <MediaCarousel title={`Popular ${label}`}  items={popular}  />}
        {trending.length === 0 && popular.length === 0 && (
          <div className="text-center py-24 text-muted-foreground">Өгөгдөл олдсонгүй</div>
        )}
      </div>
    </>
  );
}
