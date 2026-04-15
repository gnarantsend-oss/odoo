'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';
import type { MongolMovie } from '@/lib/types';
import { CAT_LABEL } from '@/lib/types';

export function ResultsGrid({ results }: { results: MongolMovie[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: '12px',
      }}
    >
      {results.map((m) => (
        <Link
          key={m.id}
          href={`/mongol/watch/${m.id}`}
          style={{
            textDecoration: 'none',
            borderRadius: '10px',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.04)',
            border: '0.5px solid rgba(255,255,255,0.07)',
            display: 'block',
          }}
        >
          <div style={{ aspectRatio: '2/3', position: 'relative', overflow: 'hidden' }}>
            <Image
              src={m.poster}
              alt={m.name}
              fill
              className="object-cover"
              unoptimized
              loading="lazy"
              sizes="130px"
            />
            <div
              className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.4)',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Play size={14} fill="black" color="black" />
              </div>
            </div>
            {m.episodes && (
              <span
                style={{
                  position: 'absolute',
                  top: '6px',
                  left: '6px',
                  background: 'rgba(0,0,0,0.75)',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                {m.episodes.length} анги
              </span>
            )}
          </div>
          <div style={{ padding: '8px 9px' }}>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.85)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {m.name}
            </p>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
              {CAT_LABEL[m.category] ?? ''}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

