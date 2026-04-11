'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { fetchMediaById } from '@/lib/anilist';
import JsonLd from '@/components/json-ld';
import Viewer from '@/components/viewer';
import Header from '@/components/header';
import Link from 'next/link';
import type { Media } from '@/lib/types';

export default function ViewPage() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const type   = params['type'] as string;
  const idSlug = params['id-slug'] as string;

  const itemNumberParam  = searchParams.get('item');
  const initialItemNumber = parseInt(itemNumberParam || '1', 10);

  const [media, setMedia]     = useState<Media | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    if (!idSlug) return;
    const id = parseInt(idSlug.split('-')[0], 10);
    if (isNaN(id) || !['anime', 'manga'].includes(type)) {
      setError(true); setLoading(false); return;
    }
    fetchMediaById(id)
      .then(data => { if (!data) setError(true); else setMedia(data); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [idSlug, type]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
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

  return (
    <>
      <JsonLd media={media} type={type as "anime" | "manga"} itemNumber={initialItemNumber} />
      <Viewer media={media} initialItemNumber={initialItemNumber} type={type as "anime" | "manga"} />
    </>
  );
}
