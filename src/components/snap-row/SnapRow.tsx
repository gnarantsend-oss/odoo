'use client';

import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { MongolMovie } from '@/lib/types';
import { SnapCard } from './SnapCard';
import { useSnapRowDragScroll, useSnapRowObserver } from './useSnapRow';

export default function SnapRow({
  cat,
  movies,
}: {
  cat: { key: string; label: string };
  movies: MongolMovie[];
}) {
  const itemIds = useMemo(() => movies.map((m) => m.id), [movies]);
  const { scrollRef, activeId } = useSnapRowObserver({ itemIds });
  const { onPointerDown, onPointerMove, onPointerUp, onClickCapture } = useSnapRowDragScroll(scrollRef);

  const scroll = (dir: 'l' | 'r') => {
    scrollRef.current?.scrollBy({
      left: dir === 'l' ? -420 : 420,
      behavior: 'smooth',
    });
  };

  if (!movies.length) return null;

  return (
    <section style={{ marginBottom: '28px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 4%',
          marginBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <h2
            style={{
              fontSize: '19px',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-0.02em',
            }}
          >
            {cat.label}
          </h2>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{movies.length}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {(['l', 'r'] as const).map((d) => (
            <button
              key={d}
              onClick={() => scroll(d)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.07)',
                border: '0.5px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              {d === 'l' ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
        className="scrollbar-hide"
        style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          padding: '14px 4% 20px',
          cursor: 'grab',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {movies.map((m) => (
          <SnapCard key={m.id} movie={m} isActive={activeId === m.id} dataId={m.id} />
        ))}
      </div>
    </section>
  );
}

