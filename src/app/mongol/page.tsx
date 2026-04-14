'use client';

import Header from '@/components/header';
import moviesJson from '@/lib/mongol_movies.json';
import SnapRow from '@/components/snap-row';

type MongolMovie = {
  id: number; name: string; category: string; poster: string;
  iframe?: string; preview?: string;
  episodes?: { ep: number; title: string; iframe: string }[];
};

const MOVIES = moviesJson as MongolMovie[];

const CATEGORIES = [
  { key: 'drama',   label: '🎭 Драм' },
  { key: 'horror',  label: '👻 Аймшиг' },
  { key: 'comedy',  label: '😂 Инээдэм' },
  { key: 'trailer', label: '🎞 Трейлер' },
];

export default function MongolPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0b0e1a', color: '#fff' }}>
      <Header />
      <main style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div style={{ padding: '0 4%', marginBottom: '28px' }}>
          <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>
            🎬 Монгол кино
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginTop: '6px' }}>
            {MOVIES.length} кино нийт
          </p>
        </div>
        {CATEGORIES.map(cat => (
          <SnapRow
            key={cat.key}
            cat={cat}
            movies={MOVIES.filter(m => m.category === cat.key)}
          />
        ))}
      </main>
    </div>
  );
}
