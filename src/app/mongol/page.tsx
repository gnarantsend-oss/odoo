import Header from '@/components/header';
import SnapRow from '@/components/snap-row';
import { CATEGORIES } from '@/lib/types';
import { getMongolMoviesFromBunny } from '@/lib/bunny';

export const revalidate = 300;
export const dynamic = 'force-dynamic';

export default async function MongolPage() {
  const MOVIES = await getMongolMoviesFromBunny();
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
