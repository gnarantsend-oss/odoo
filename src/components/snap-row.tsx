'use client';

/**
 * snap-row.tsx
 * ─────────────────────────────────────────────────────────────
 * Netflix-style horizontal scroll row with:
 *  • CSS scroll-snap  → scroll зогсоход card тэгшилнэ
 *  • Intersection Observer → голд байгаа card томорно
 *  • Grab cursor + momentum scroll → гараар чирэхэд мэдрэмжтэй
 *
 * Ашиглах (mongol-tab.tsx):
 *   import SnapRow from '@/components/snap-row';
 *   // дараа нь <Row> -г <SnapRow> болгон солино
 * ─────────────────────────────────────────────────────────────
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Play, ChevronLeft, ChevronRight, Plus, Check } from 'lucide-react';
import { getWatchlist, toggleWatchlist } from '@/lib/watchlist';
import type { MongolMovie } from '@/lib/types';
import { CAT_LABEL } from '@/lib/types';

// ── Snap Card ────────────────────────────────────────────────
function SnapCard({
  movie,
  isActive,
  'data-id': dataId,
}: {
  movie: MongolMovie;
  isActive: boolean;
  'data-id'?: string;
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

  // Active card (голд байгаа) → томорно, хажуудах нь жижигрэнэ
  const scale = isActive ? 1.1 : hovered ? 1.04 : 1;
  const shadow = isActive
    ? '0 20px 60px rgba(0,0,0,0.85), 0 0 0 1.5px rgba(229,9,20,0.4)'
    : '0 4px 16px rgba(0,0,0,0.4)';

  return (
    <div
      // scroll-snap-align: center → энэ card scroll-н голд тэгшилнэ
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
          // cubic-bezier нь Netflix-н "живэх" мэдрэмж өгдөг
          transition:
            'transform 0.35s cubic-bezier(.22,.68,0,1.2), box-shadow 0.35s ease, border-color 0.3s ease',
        }}
      >
        {/* Poster */}
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
            loading="lazy"
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: isActive ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.5s ease',
            }}
          />

          {/* Active gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 55%)',
              opacity: isActive || hovered ? 1 : 0,
              transition: 'opacity 0.3s',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: '12px',
            }}
          >
            {/* Play товч */}
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

          {/* Episode тэмдэглэгээ */}
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

          {/* Watchlist товч */}
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
            {wl ? (
              <Check size={11} color="#38d0f0" />
            ) : (
              <Plus size={11} color="white" />
            )}
          </button>
        </Link>

        {/* Info */}
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

// ── Snap Row (Main Export) ────────────────────────────────────
export default function SnapRow({
  cat,
  movies,
}: {
  cat: { key: string; label: string };
  movies: MongolMovie[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // ── Grab scroll (хуруугаараар чирэх) ──────────────────────
  // moved: үнэхээр чирсэн эсэх — click-тэй ялгахад хэрэглэнэ
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });

  const onPointerDown = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, scrollLeft: el.scrollLeft, moved: false };
    el.style.cursor = 'grabbing';
    // setPointerCapture эндээс хасав — drag эхэлсэн үед л хийнэ
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active || !scrollRef.current) return;
    const dx = Math.abs(e.clientX - drag.current.startX);
    if (dx > 6) {
      drag.current.moved = true;
      if (!scrollRef.current.hasPointerCapture(e.pointerId)) {
        scrollRef.current.setPointerCapture(e.pointerId);
      }
      scrollRef.current.scrollLeft =
        drag.current.scrollLeft - (e.clientX - drag.current.startX);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    drag.current.active = false;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  };

  // Drag хийсэн бол click-г зогсооно
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      drag.current.moved = false;
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // ── Intersection Observer — голд байгаа card илрүүлэх ──────
  const observerRef = useRef<IntersectionObserver | null>(null);
  // Бүх card-н ratio-г хадгална — entries зөвхөн өөрчлөгдсөнийг агуулдаг
  const ratioMap = useRef<Map<string, number>>(new Map());

  const setupObserver = useCallback(() => {
    observerRef.current?.disconnect();
    ratioMap.current.clear();

    const el = scrollRef.current;
    if (!el) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Өөрчлөгдсөн card-уудын ratio шинэчилнэ
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).dataset.id;
          if (id) ratioMap.current.set(id, entry.intersectionRatio);
        });
        // Бүх card-с хамгийн их ratio-тайг олно
        let bestId: string | null = null;
        let bestRatio = 0;
        ratioMap.current.forEach((ratio, id) => {
          if (ratio > bestRatio) { bestRatio = ratio; bestId = id; }
        });
        if (bestId !== null && bestRatio > 0.3) setActiveId(bestId);
      },
      {
        root: el,
        rootMargin: '0px -20% 0px -20%',
        threshold: [0, 0.25, 0.5, 0.75, 1.0],
      }
    );

    el.querySelectorAll<HTMLElement>('[data-id]').forEach((card) => {
      observerRef.current!.observe(card);
    });
  }, []);

  useEffect(() => {
    // Card-ууд render болсны дараа Observer тохируулна
    const timer = setTimeout(setupObserver, 100);
    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, [movies, setupObserver]);

  // ── Arrow scroll ───────────────────────────────────────────
  const scroll = (dir: 'l' | 'r') => {
    scrollRef.current?.scrollBy({
      left: dir === 'l' ? -420 : 420,
      behavior: 'smooth',
    });
  };

  if (!movies.length) return null;

  return (
    <section style={{ marginBottom: '28px' }}>
      {/* Header */}
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
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
            {movies.length}
          </span>
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
              {d === 'l' ? (
                <ChevronLeft size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll container */}
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

          // ── Netflix scroll-snap тохиргоо ──────────────────
          scrollSnapType: 'x mandatory',   // scroll зогсоход snap
          WebkitOverflowScrolling: 'touch', // iOS momentum scroll
          // scrollBehavior: 'smooth' — mandatory snap-тай зөрчилддөг тул хасав
          // ─────────────────────────────────────────────────
        }}
      >
        {movies.map((m) => (
          <SnapCard key={m.id} movie={m} isActive={activeId === m.id} data-id={m.id} />
        ))}
      </div>
    </section>
  );
}
