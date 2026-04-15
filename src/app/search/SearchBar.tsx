'use client';

import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SearchBar({
  query,
  onChange,
  onClear,
}: {
  query: string;
  onChange: (value: string) => void;
  onClear: () => void;
}) {
  const router = useRouter();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
      <button
        onClick={() => router.back()}
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '0.5px solid rgba(255,255,255,0.12)',
          borderRadius: '8px',
          padding: '10px 12px',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <ArrowLeft size={16} />
      </button>

      <div style={{ flex: 1, position: 'relative', maxWidth: '520px' }}>
        <SearchIcon
          size={16}
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'rgba(255,255,255,0.3)',
            pointerEvents: 'none',
          }}
        />
        <input
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Кино нэрээр хайх..."
          autoFocus
          style={{
            width: '100%',
            boxSizing: 'border-box',
            background: 'rgba(255,255,255,0.08)',
            border: '0.5px solid rgba(255,255,255,0.15)',
            borderRadius: '12px',
            padding: '12px 16px 12px 40px',
            color: '#fff',
            fontSize: '15px',
            outline: 'none',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(229,9,20,0.5)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
          }}
        />
        {query && (
          <button
            onClick={onClear}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

