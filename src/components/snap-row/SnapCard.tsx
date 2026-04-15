'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Play, Plus } from 'lucide-react';
import { getWatchlist, toggleWatchlist } from '@/lib/watchlist';
import type { MongolMovie } from '@/lib/types';
import { CAT_LABEL } from '@/lib/types';

export function SnapCard({
  movie,
  isActive,
  dataId,
  prioritizeImage = false,
}: {
  movie: MongolMovie;
  isActive: boolean;
  dataId?: string;
  prioritizeImage?: boolean;
}) {
  const [wl, setWl] = useState(false);
  const [hovered, setHovered] = useState(false);
  const href = `/mongol/watch/${movie.id}`;

  useEffect(() => {
    setWl(getWatchlist().includes(movie.id));
  }, [movie.id]);

  const handleWL = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWl(toggleWatchlist(movie.id));
  };

  const scale = isActive ? 1.1 : hovered ? 1.04 : 1;
  const shadow = isActive
    ? '0 20px 60px rgba(0,0,0,0.85), 0 0 0 1.5px rgba(229,9,20,0.4)'
    : '0 4px 16px rgba(0,0,0,0.4)';

  return (
    <div
      data-id={dataId}
      style={{
        scrollSnapAlign: 'center',
        flexShrink: 0,
        width: 'clamp(130px, 15vw, 175px)',
        position: 'relative',
        zIndex: isActive ? 10 : 1,
        transition: 'z-index 0s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          borderRadius: '10px',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.04)',
          border: `0.5px solid ${isActive ? 'rgba(229,9,20,0.3)' : 'rgba(255,255,255,0.07)'}`,
          transform: `scale(${scale}) translateY(${isActive ? '-6px' : '0px'})`,
          boxShadow: shadow,
          transition:
            'transform 0.35s cubic-bezier(.22,.68,0,1.2), box-shadow 0.35s ease, border-color 0.3s ease',
        }}
      >
        <Link
          href={href}
          style={{
            display: 'block',
            aspectRatio: '2/3',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <img
            src={movie.poster}
            alt={movie.name}
            loading={prioritizeImage ? 'eager' : 'lazy'}
            fetchPriority={prioritizeImage ? 'high' : 'auto'}
            decoding="async"
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: isActive ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.5s ease',
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 55%)',
              opacity: isActive || hovered ? 1 : 0,
              transition: 'opacity 0.3s',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: '12px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: isActive || hovered ? 'scale(1)' : 'scale(0.6)',
                transition: 'transform 0.3s cubic-bezier(.22,.68,0,1.2)',
              }}
            >
              <Play size={16} fill="#0b0e1a" color="#0b0e1a" />
            </div>
          </div>

          {movie.episodes && (
            <span
              style={{
                position: 'absolute',
                top: '7px',
                left: '7px',
                background: 'rgba(0,0,0,0.78)',
                color: 'white',
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: '4px',
              }}
            >
              {movie.episodes.length} анги
            </span>
          )}

          <button
            onClick={handleWL}
            style={{
              position: 'absolute',
              top: '7px',
              right: '7px',
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: wl ? 'rgba(56,208,240,0.25)' : 'rgba(0,0,0,0.65)',
              border: `1px solid ${wl ? 'rgba(56,208,240,0.6)' : 'rgba(255,255,255,0.2)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
              opacity: isActive || hovered ? 1 : 0,
              transform: isActive || hovered ? 'scale(1)' : 'scale(0.7)',
              transition: 'all 0.25s',
            }}
          >
            {wl ? <Check size={11} color="#38d0f0" /> : <Plus size={11} color="white" />}
          </button>
        </Link>

        <div style={{ padding: '8px 10px' }}>
          <Link href={href} style={{ textDecoration: 'none' }}>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.88)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                marginBottom: '3px',
              }}
            >
              {movie.name}
            </p>
          </Link>
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.32)' }}>
            {CAT_LABEL[movie.category]}
          </p>
        </div>
      </div>
    </div>
  );
}

