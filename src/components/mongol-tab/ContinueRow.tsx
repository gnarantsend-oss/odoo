'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCW } from '@/lib/watchlist';
import type { MongolMovie } from '@/lib/types';
import { RowHeader } from './RowHeader';

export function ContinueRow({ movies }: { movies: MongolMovie[] }) {
  const [cw, setCw] = useState<{ id: string; ep: number; progress?: number }[]>([]);

  useEffect(() => {
    setCw(getCW());
  }, []);

  const list = cw
    .map(({ id, ep, progress }) => ({ m: movies.find((x) => x.id === id), ep, p: progress ?? 20 }))
    .filter((x) => x.m) as { m: MongolMovie; ep: number; p: number }[];

  if (!list.length) return null;

  return (
    <section style={{ marginBottom: '28px' }}>
      <RowHeader title="▶ Үргэлжлүүлэх" count={list.length} showAll={false} />
      <div className="scrollbar-hide" style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '0 4% 6px' }}>
        {list.map(({ m, ep, p }) => (
          <Link
            key={m.id}
            href={`/mongol/watch/${m.id}`}
            className="flex-shrink-0"
            style={{
              textDecoration: 'none',
              width: '176px',
              borderRadius: '10px',
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.04)',
              border: '0.5px solid rgba(255,255,255,0.06)',
              transition: 'transform 0.22s',
              display: 'block',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
              <img src={m.poster} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'rgba(255,255,255,0.12)',
                }}
              >
                <div style={{ height: '100%', width: `${p}%`, background: '#e50914', borderRadius: '2px' }} />
              </div>
              {m.episodes && (
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    left: '6px',
                    background: 'rgba(0,0,0,0.72)',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 600,
                    padding: '2px 7px',
                    borderRadius: '4px',
                  }}
                >
                  {ep + 1}-р анги
                </span>
              )}
            </div>
            <div style={{ padding: '7px 9px' }}>
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.82)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {m.name}
              </p>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{p}% үзсэн</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

