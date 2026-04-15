'use client';

import BANNERS from '@/lib/banners';
import type { MongolMovie } from '@/lib/types';
import { CAT_LABEL, CATEGORIES } from '@/lib/types';
import SnapRow from '@/components/snap-row';
import { Hero } from './Hero';
import { ContinueRow } from './ContinueRow';
import { BannerBlock } from './BannerBlock';

export default function MongolTab({ movies }: { movies: MongolMovie[] }) {
  if (!movies.length) {
    return (
      <div style={{ textAlign: 'center', padding: '96px', color: 'rgba(255,255,255,0.3)' }}>
        Кино байхгүй байна
      </div>
    );
  }

  const known = new Map<string, string>(CATEGORIES.map((c) => [c.key, c.label]));
  const presentKeys = Array.from(new Set(movies.map((m) => m.category)));

  const orderedKeys: string[] = [];
  for (const c of CATEGORIES) {
    if (presentKeys.includes(c.key)) orderedKeys.push(c.key);
  }
  for (const k of presentKeys) {
    if (!known.has(k)) orderedKeys.push(k);
  }

  const categories = orderedKeys.map((key) => {
    const label =
      known.get(key) ??
      (CAT_LABEL[key] ? CAT_LABEL[key] : key.replace(/[-_]/g, ' ')).replace(/\b\w/g, (ch) => ch.toUpperCase());
    return { key, label };
  });

  return (
    <>
      <Hero movies={movies} />
      <div style={{ paddingTop: '28px', paddingBottom: '60px' }}>
        <ContinueRow movies={movies} />
        {categories.map((cat, i) => (
          <div key={cat.key}>
            <SnapRow cat={cat} movies={movies.filter((m) => m.category === cat.key)} />
            {BANNERS.length > 0 && BANNERS[i % BANNERS.length] && <BannerBlock banner={BANNERS[i % BANNERS.length]} />}
          </div>
        ))}
      </div>
    </>
  );
}
