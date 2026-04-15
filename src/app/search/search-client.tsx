'use client';
import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Play, ArrowLeft, Search as SearchIcon } from 'lucide-react';
import Header from '@/components/header';
import type { MongolMovie } from '@/lib/types';
import { CAT_LABEL, CATEGORIES } from '@/lib/types';

function SearchContent({ movies }: { movies: MongolMovie[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string | null>(null);

  // Filter logic: by query OR by category chip
  const results = (() => {
    let list = movies;
    if (activeCat) list = list.filter(m => m.category === activeCat);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q));
    }
    return list;
  })();

  const hasFilter = query.trim() !== '' || activeCat !== null;

  return (
    <div style={{ minHeight: '100vh', background: '#0b0e1a', color: '#fff', paddingTop: '62px' }}>
      <Header />

      <div style={{ padding: '24px 4% 80px' }}>
        {/* Search bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => router.back()}
            style={{
              background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.12)',
              borderRadius: '8px', padding: '10px 12px', color: '#fff',
              cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0,
            }}
          >
            <ArrowLeft size={16} />
          </button>

          <div style={{ flex: 1, position: 'relative', maxWidth: '520px' }}>
            <SearchIcon
              size={16}
              style={{
                position: 'absolute', left: '14px', top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.3)', pointerEvents: 'none',
              }}
            />
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setActiveCat(null); }}
              placeholder="Кино нэрээр хайх..."
              autoFocus
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.08)',
                border: '0.5px solid rgba(255,255,255,0.15)',
                borderRadius: '12px', padding: '12px 16px 12px 40px',
                color: '#fff', fontSize: '15px', outline: 'none',
                fontFamily: 'inherit',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(229,9,20,0.5)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.15)', border: 'none',
                  borderRadius: '50%', width: '18px', height: '18px',
                  color: 'white', cursor: 'pointer', fontSize: '11px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >✕</button>
            )}
          </div>
        </div>

        {/* Category chips */}
        {!query && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCat(activeCat === cat.key ? null : cat.key)}
                style={{
                  padding: '7px 14px', borderRadius: '20px', cursor: 'pointer',
                  fontSize: '13px', fontWeight: 600, border: '0.5px solid',
                  transition: 'all 0.18s',
                  background: activeCat === cat.key ? '#e50914' : 'rgba(255,255,255,0.07)',
                  borderColor: activeCat === cat.key ? '#e50914' : 'rgba(255,255,255,0.12)',
                  color: activeCat === cat.key ? 'white' : 'rgba(255,255,255,0.7)',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Result count */}
        {hasFilter && (
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginBottom: '16px' }}>
            {results.length} үр дүн
          </p>
        )}

        {/* Empty state */}
        {!hasFilter && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: '44px', marginBottom: '12px' }}>🔍</div>
            <p style={{ fontSize: '15px' }}>Кино нэрээр хайна уу</p>
            <p style={{ fontSize: '12px', marginTop: '6px', opacity: 0.6 }}>
              эсвэл ангилал сонгоно уу
            </p>
          </div>
        )}

        {/* No results */}
        {hasFilter && results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: '44px', marginBottom: '12px' }}>😕</div>
            <p style={{ fontSize: '15px' }}>«{query}» олдсонгүй</p>
          </div>
        )}

        {/* Results grid */}
        {results.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '12px',
          }}>
            {results.map(m => (
              <Link
                key={m.id}
                href={`/mongol/watch/${m.id}`}
                style={{
                  textDecoration: 'none', borderRadius: '10px', overflow: 'hidden',
                  background: 'rgba(255,255,255,0.04)',
                  border: '0.5px solid rgba(255,255,255,0.07)', display: 'block',
                }}
              >
                <div style={{ aspectRatio: '2/3', position: 'relative', overflow: 'hidden' }}>
                  <Image
                    src={m.poster} alt={m.name} fill
                    className="object-cover"
                    unoptimized loading="lazy"
                    sizes="130px"
                  />
                  <div
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(0,0,0,0.4)',
                    }}
                  >
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.9)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Play size={14} fill="black" color="black" />
                    </div>
                  </div>
                  {m.episodes && (
                    <span style={{
                      position: 'absolute', top: '6px', left: '6px',
                      background: 'rgba(0,0,0,0.75)', color: 'white',
                      fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px',
                    }}>
                      {m.episodes.length} анги
                    </span>
                  )}
                </div>
                <div style={{ padding: '8px 9px' }}>
                  <p style={{
                    fontSize: '11px', fontWeight: 600,
                    color: 'rgba(255,255,255,0.85)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {m.name}
                  </p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
                    {CAT_LABEL[m.category] ?? ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchClient({ movies }: { movies: MongolMovie[] }) {
  return (
    <Suspense>
      <SearchContent movies={movies} />
    </Suspense>
  );
}

