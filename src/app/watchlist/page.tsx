'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Trash2, ArrowLeft } from 'lucide-react';
import moviesJson from '@/lib/mongol_movies.json';
import { getWatchlist, toggleWatchlist } from '@/lib/watchlist';
import type { MongolMovie } from '@/lib/types';
import { CAT_LABEL } from '@/lib/types';
import Header from '@/components/header';

const MOVIES = moviesJson as MongolMovie[];

export default function WatchlistPage() {
  const [wl, setWl] = useState<number[]>([]);
  useEffect(() => { setWl(getWatchlist()); }, []);

  const movies = MOVIES.filter(m => wl.includes(m.id));

  const remove = (id: number) => {
    toggleWatchlist(id);
    setWl(getWatchlist());
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b0e1a', color: '#fff', paddingTop: '62px' }}>
      <Header />
      <div style={{ padding: '32px 4% 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
          <Link href="/" style={{ background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '8px 12px', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <ArrowLeft size={16} /> Буцах
          </Link>
          <h1 style={{ fontSize: '22px', fontWeight: 800 }}>Миний жагсаалт</h1>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{movies.length} кино</span>
        </div>

        {movies.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎬</div>
            <p style={{ fontSize: '16px' }}>Жагсаалт хоосон байна</p>
            <Link href="/" style={{ color: '#e50914', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginTop: '12px' }}>Кино нэмэх →</Link>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
          {movies.map(m => (
            <div key={m.id} style={{ borderRadius: '10px', overflow: 'hidden', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.07)', position: 'relative' }} className="group">
              <Link href={`/mongol/watch/${m.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ aspectRatio: '2/3', position: 'relative', overflow: 'hidden' }}>
                  <Image src={m.poster} alt={m.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized loading="lazy" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
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
              <button onClick={() => remove(m.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(229,9,20,0.85)', border: 'none', borderRadius: '6px', padding: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={12} color="white" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
