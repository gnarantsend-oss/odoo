'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Play, ChevronLeft, ChevronRight, Plus, Check } from 'lucide-react';
import moviesJson from '@/lib/mongol_movies.json';
import { getWatchlist, toggleWatchlist, getCW } from '@/lib/watchlist';
import BANNERS from '@/lib/banners';
import type { MongolMovie } from '@/lib/types';
import { CAT_LABEL, CATEGORIES } from '@/lib/types';
import SnapRow from '@/components/snap-row';



// ══════════════════════════════════════════════════════

// ── Poster-н хэмжээний загвар (8-ийн циклээр давтагдана)
// Эх зураг нь 16:9 thumbnail тул width-ийг л өөрчилнө
const SIZE_PATTERN = [
  { w: '120px', h: '170px' }, // portrait жижиг
  { w: '220px', h: '170px' }, // landscape дунд
  { w: '140px', h: '170px' }, // portrait дунд
  { w: '120px', h: '170px' }, // portrait жижиг
  { w: '260px', h: '170px' }, // landscape том
  { w: '130px', h: '170px' }, // portrait жижиг
  { w: '180px', h: '170px' }, // landscape жижиг
  { w: '140px', h: '170px' }, // portrait дунд
];

// ── MOSAIC HERO ──────────────────────────────────────────────────────────────
function Hero({ movies }: { movies: MongolMovie[] }) {
  const all = movies.filter(m => m.category !== 'trailer');
  const n = all.length;

  // 5 эгнээ — өөр өөр эхлэлтэй, бүгд давхарлагдсан (seamless loop)
  const makeLane = (offset: number) => {
    const shifted = [...all.slice(offset % n), ...all.slice(0, offset % n)];
    return [...shifted, ...shifted];
  };

  const lanes = [
    { items: makeLane(0),                dir: 'left',  speed: '62s', rowH: '160px', offset: 0  },
    { items: makeLane(Math.floor(n*.18)), dir: 'right', speed: '48s', rowH: '185px', offset: 1  },
    { items: makeLane(Math.floor(n*.36)), dir: 'left',  speed: '55s', rowH: '160px', offset: 2  },
    { items: makeLane(Math.floor(n*.54)), dir: 'right', speed: '70s', rowH: '175px', offset: 3  },
    { items: makeLane(Math.floor(n*.72)), dir: 'left',  speed: '50s', rowH: '160px', offset: 4  },
  ] as const;

  return (
    <section style={{ position: 'relative', width: '100%', height: 'calc(100vh - 62px)', overflow: 'hidden', background: '#080b18' }}>
      <style>{`
        @keyframes ms-left  { from{transform:translateX(0)}    to{transform:translateX(-50%)} }
        @keyframes ms-right { from{transform:translateX(-50%)} to{transform:translateX(0)}    }

        .ms-track { display:flex; gap:8px; width:max-content; will-change:transform; }
        .ms-left  { animation: ms-left  var(--spd) linear infinite; }
        .ms-right { animation: ms-right var(--spd) linear infinite; }

        .ms-card {
          flex-shrink: 0;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
        }
        .ms-card img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          transition: transform 0.6s ease;
          pointer-events: none;
          user-select: none;
        }

        @keyframes hint-bounce {
          0%,100% { transform:translateX(-50%) translateY(0);   }
          55%      { transform:translateX(-50%) translateY(10px); }
        }
        .hint-anim { animation: hint-bounce 2.4s ease-in-out infinite; }
      `}</style>

      {/* ── Тэгш бус эгнээнүүд — бүхэлдээ эргүүлэх ── */}
      <div style={{
        position: 'absolute', inset: '-30% -20%',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', gap: '8px',
        transform: 'rotate(-6deg)',
        zIndex: 1,
      }}>
        {lanes.map((lane, ri) => (
          <div key={ri} style={{ overflow: 'hidden', flexShrink: 0 }}>
            <div
              className={`ms-track ms-${lane.dir}`}
              style={{ '--spd': lane.speed } as React.CSSProperties}
            >
              {lane.items.map((m, i) => {
                const sz = SIZE_PATTERN[(i + lane.offset * 3) % SIZE_PATTERN.length];
                return (
                  <div
                    key={`${ri}-${i}`}
                    className="ms-card"
                    style={{ width: sz.w, height: lane.rowH }}
                  >
                    <img
                      src={m.poster}
                      alt=""
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Overlay давхаргууд ── */}
      {/* Ерөнхий харанхуй */}
      <div style={{ position:'absolute', inset:0, zIndex:2, background:'rgba(8,11,24,0.18)' }} />
      {/* Дээд */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'42%', zIndex:3, background:'linear-gradient(to bottom, #080b18 0%, rgba(8,11,24,0.55) 40%, transparent 100%)' }} />
      {/* Доод */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'42%', zIndex:3, background:'linear-gradient(to top, #080b18 0%, rgba(8,11,24,0.55) 40%, transparent 100%)' }} />
      {/* Зүүн */}
      <div style={{ position:'absolute', top:0, left:0, bottom:0, width:'18%', zIndex:3, background:'linear-gradient(to right, #080b18 0%, transparent 100%)' }} />
      {/* Баруун */}
      <div style={{ position:'absolute', top:0, right:0, bottom:0, width:'18%', zIndex:3, background:'linear-gradient(to left, #080b18 0%, transparent 100%)' }} />

      {/* ── Голд гарчиг ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', gap: '16px', pointerEvents: 'none',
      }}>
        <p style={{
          fontSize: 'clamp(10px, 1vw, 13px)', fontWeight: 600,
          letterSpacing: '0.5em', color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase',
        }}>
          🇲🇳 Монгол кино
        </p>

        <h1 style={{
          fontSize: 'clamp(52px, 9vw, 108px)', fontWeight: 900,
          letterSpacing: '-0.035em', lineHeight: 1,
          color: '#fff',
          textShadow: '0 0 80px rgba(0,0,0,1), 0 4px 40px rgba(0,0,0,0.8)',
        }}>
          NARHAN <span style={{ color: '#e50914' }}>TV</span>
        </h1>

        <p style={{
          fontSize: 'clamp(12px, 1.3vw, 16px)',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.05em',
        }}>
          Монгол кино үнэгүй үзнэ үү
        </p>
      </div>

      {/* ── Доош гүйлгэх заалт ── */}
      <div className="hint-anim" style={{
        position: 'absolute', bottom: '30px', left: '50%',
        zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        pointerEvents: 'none',
      }}>
        <span style={{ fontSize: '9px', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>
          Доош гүйлгэх
        </span>
        <svg width="20" height="12" viewBox="0 0 24 14" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 2l10 10L22 2"/>
        </svg>
      </div>
    </section>
  );
}

// ── CONTINUE WATCHING ─────────────────────────────────────────────────────────
function ContinueRow({ movies }: { movies: MongolMovie[] }) {
  const [cw, setCw] = useState<{ id: number; ep: number; progress?: number }[]>([]);
  useEffect(() => { setCw(getCW()); }, []);
  const list = cw
    .map(({ id, ep, progress }) => ({ m: movies.find(x => x.id === id), ep, p: progress ?? 20 }))
    .filter(x => x.m) as { m: MongolMovie; ep: number; p: number }[];
  if (!list.length) return null;

  return (
    <section style={{ marginBottom: '28px' }}>
      <RowHeader title="▶ Үргэлжлүүлэх" count={list.length} showAll={false} />
      <div className="scrollbar-hide" style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '0 4% 6px' }}>
        {list.map(({ m, ep, p }) => (
          <Link key={m.id} href={`/mongol/watch/${m.id}`} className="flex-shrink-0"
            style={{ textDecoration: 'none', width: '176px', borderRadius: '10px', overflow: 'hidden', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.06)', transition: 'transform 0.22s', display: 'block' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
            <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
              <img src={m.poster} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.12)' }}>
                <div style={{ height: '100%', width: `${p}%`, background: '#e50914', borderRadius: '2px' }} />
              </div>
              {m.episodes && <span style={{ position: 'absolute', top: '6px', left: '6px', background: 'rgba(0,0,0,0.72)', color: 'white', fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '4px' }}>{ep + 1}-р анги</span>}
            </div>
            <div style={{ padding: '7px 9px' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.82)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</p>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{p}% үзсэн</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── ROW HEADER ────────────────────────────────────────────────────────────────
function RowHeader({ title, count, showAll = true }: { title: string; count: number; showAll?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4%', marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
        <h2 style={{ fontSize: '19px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{title}</h2>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{count}</span>
      </div>
      {showAll && <span style={{ fontSize: '12px', color: '#e50914', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em' }}>Бүгд ›</span>}
    </div>
  );
}



// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function MongolTab() {
  const movies = moviesJson as MongolMovie[];
  if (!movies.length) return <div style={{ textAlign: 'center', padding: '96px', color: 'rgba(255,255,255,0.3)' }}>Кино байхгүй байна</div>;

  return (
    <>
      <Hero movies={movies} />
      <div style={{ paddingTop: '28px', paddingBottom: '60px' }}>
        <ContinueRow movies={movies} />
        {CATEGORIES.map((cat, i) => (
          <div key={cat.key}>
            {BANNERS[i] && (
              <div style={{ padding: '0 16px', marginBottom: '28px' }}>
                <a
                  href={BANNERS[i].href}
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
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.88'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                >
                  <img
                    src={BANNERS[i].img}
                    alt={BANNERS[i].alt ?? 'Зар'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </a>
              </div>
            )}
            <SnapRow cat={cat} movies={movies.filter(m => m.category === cat.key)} />
          </div>
        ))}
      </div>
    </>
  );
}
