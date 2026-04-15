'use client';

import type { Banner } from '@/lib/types';

export function BannerBlock({ banner }: { banner: Banner }) {
  return (
    <div style={{ padding: '0 16px', marginBottom: '28px' }}>
      <a
        href={banner.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          overflow: 'hidden',
          borderRadius: '10px',
          height: 'clamp(120px, 30vw, 250px)',
          border: '0',
          cursor: 'pointer',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.opacity = '0.88';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.opacity = '1';
        }}
      >
        <img
          src={banner.img}
          alt={banner.alt ?? 'Зар'}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </a>
    </div>
  );
}

