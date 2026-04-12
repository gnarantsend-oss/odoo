'use client';

import { useEffect, useState } from 'react';
import { type Media } from '@/lib/types';
import MediaCarousel from './media-carousel';
import HeroCarousel from './hero-carousel';

async function fetchAniList(type: 'ANIME' | 'MANGA', sort: string, perPage = 20): Promise<Media[]> {
  const params = new URLSearchParams({ type, sort, perPage: String(perPage) });
  const res = await fetch(`/api/anilist?${params}`);
  if (!res.ok) return [];
  return res.json();
}

export default function AniListSection({ type }: { type: 'ANIME' | 'MANGA' }) {
  const [trending, setTrending] = useState<Media[]>([]);
  const [popular, setPopular] = useState<Media[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      fetchAniList(type, 'TRENDING_DESC', 20),
      fetchAniList(type, 'POPULARITY_DESC', 20),
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
