'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Play, ArrowLeft } from 'lucide-react';
import moviesJson from '@/lib/mongol_movies.json';
import Header from '@/components/header';

type MongolMovie = { id: number; name: string; category: string; poster: string; iframe?: string; episodes?: { ep: number; title: string; iframe: string }[] };
const MOVIES = moviesJson as MongolMovie[];
const CAT_LABEL: Record<string, string> = { drama: 'Драм', horror: 'Аймшиг', comedy: 'Инээдэм', trailer: 'Трейлер' };

function SearchContent() {
  const params  = useSearchParams();
  const router  = useRouter();
  const [query, setQuery] = useState(params.get('q') || '');

  const results = query.trim()
    ? MOVIES.filter(m => m.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div style={{ minHeight: '100vh', background: '#0b0e1a', color: '#fff', paddingTop: '62px' }}>
      <Header />
      <div style={{ padding: '32px 4% 60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
          <button onClick={() => router.back()} style={{ background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '8px 12px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <ArrowLeft size={16} /> Буцах
          </button>
          <input value={query} onChange={e => setQuery(e.target.value)} autoFocus placeholder="Кино хайх..." style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '11px 16px', color: '#fff', fontSize: '15px', outline: 'none', fontFamily: 'inherit', maxWidth: '500px' }} />
          {query && <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{results.length} үр дүн</span>}
        </div>

        {!query && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
            <p style={{ fontSize: '16px' }}>Кино нэрээр хайна уу</p>
          </div>
        )}

        {query && results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>😕</div>
            <p style={{ fontSize: '16px' }}>«{query}» олдсонгүй</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
          {results.map(m => (
            <Link key={m.id} href={`/mongol/watch/${m.id}`} style={{ textDecoration: 'none', borderRadius: '10px', overflow: 'hidden', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.07)', display: 'block', transition: 'transform 0.2s', cursor: 'pointer' }}>
              <div style={{ aspectRatio: '2/3', position: 'relative', overflow: 'hidden' }}>
                <Image src={m.poster} alt={m.name} fill className="object-cover" unoptimized loading="lazy" />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)', opacity: 0, transition: 'opacity 0.2s' }} className="hover:opacity-100">
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Play size={14} fill="black" color="black" />
                  </div>
                </div>
              </div>
              <div style={{ padding: '8px 9px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</p>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{CAT_LABEL[m.category] ?? ''}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return <Suspense><SearchContent /></Suspense>;
}
