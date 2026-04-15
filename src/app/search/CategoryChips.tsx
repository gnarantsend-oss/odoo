'use client';

import { CATEGORIES } from '@/lib/types';

export function CategoryChips({
  activeCat,
  onToggle,
}: {
  activeCat: string | null;
  onToggle: (catKey: string) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onToggle(cat.key)}
          style={{
            padding: '7px 14px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            border: '0.5px solid',
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
  );
}

