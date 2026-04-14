'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Play, ChevronLeft, ChevronRight, Plus, Check } from 'lucide-react';
import moviesJson from '@/lib/mongol_movies.json';
import { getWatchlist, toggleWatchlist, getCW } from '@/lib/watchlist';
import BANNERS from '@/lib/banners';
import SnapRow from '@/components/snap-row';

type MongolMovie = {
  id: number; name: string; category: string; poster: string;
  iframe?: string; preview?: string; episodes?: { ep: number; title: string; iframe: string }[];
};

const CATEGORIES = [
  { key: 'drama',   label: '🎭 Драм' },
  { key: 'horror',  label: '👻 Аймшиг' },
  { key: 'comedy',  label: '😂 Инээдэм' },
  { key: 'trailer', label: '🎞 Трейлер' },
];
const CAT_LABEL: Record<string, string> = { drama: 'Драм', horror: 'Аймшиг', comedy: 'Инээдэм', trailer: 'Трейлер' };

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

// ── 3D CARD ───────────────────────────────────────────────────────────────────
function Card({ movie }: { movie: MongolMovie }) {
  const [hovered, setHovered] = useState(false);
  const [wl, setWl]           = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const href = `/mongol/watch/${movie.id}`;

  useEffect(() => { setWl(getWatchlist().includes(movie.id)); }, [movie.id]);

  const onMouseEnter = () => { hoverTimer.current = setTimeout(() => setHovered(true), 180); };
  const onMouseLeave = () => { if (hoverTimer.current) clearTimeout(hoverTimer.current); setHovered(false); };

  const handleWL = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setWl(toggleWatchlist(movie.id));
  };

  return (
    <div className="flex-shrink-0" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
      style={{ width: 'clamp(135px,16vw,185px)', position: 'relative', zIndex: hovered ? 30 : 1 }}>
      <div style={{
        borderRadius: '10px', overflow: 'hidden',
        background: 'rgba(255,255,255,0.04)',
        border: '0.5px solid rgba(255,255,255,0.07)',
        transform: hovered ? 'scale(1.1) translateY(-8px) perspective(600px) rotateX(2deg)' : 'scale(1)',
        boxShadow: hovered ? '0 28px 70px rgba(0,0,0,0.8), 0 0 0 1.5px rgba(229,9,20,0.35)' : '0 4px 16px rgba(0,0,0,0.4)',
        transition: 'transform 0.35s cubic-bezier(.22,.68,0,1.2), box-shadow 0.35s ease',
      }}>
        <Link href={href} style={{ display: 'block', aspectRatio: '2/3', position: 'relative', overflow: 'hidden' }}>
          <img src={movie.poster} alt={movie.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.5s ease' }} />
          {movie.preview && hovered && <img src={movie.preview} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: hovered ? 'scale(1)' : 'scale(0.7)', transition: 'transform 0.3s cubic-bezier(.22,.68,0,1.2)' }}>
              <Play size={16} fill="#0b0e1a" color="#0b0e1a" />
            </div>
          </div>
          {movie.episodes && <span style={{ position: 'absolute', top: '7px', left: '7px', background: 'rgba(0,0,0,0.78)', color: 'white', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px' }}>{movie.episodes.length} анги</span>}
          <button onClick={handleWL} style={{ position: 'absolute', top: '7px', right: '7px', width: '26px', height: '26px', borderRadius: '50%', background: wl ? 'rgba(56,208,240,0.25)' : 'rgba(0,0,0,0.65)', border: `1px solid ${wl ? 'rgba(56,208,240,0.6)' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(6px)', opacity: hovered ? 1 : 0, transform: hovered ? 'scale(1)' : 'scale(0.7)', transition: 'all 0.25s' }}>
            {wl ? <Check size={11} color="#38d0f0" /> : <Plus size={11} color="white" />}
          </button>
        </Link>
        <div style={{ padding: hovered ? '10px' : '8px 10px', maxHeight: hovered ? '80px' : '44px', overflow: 'hidden', transition: 'max-height 0.3s ease, padding 0.3s ease', background: hovered ? 'rgba(18,20,32,1)' : 'transparent' }}>
          <Link href={href} style={{ textDecoration: 'none' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.88)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: hovered ? '5px' : '2px' }}>{movie.name}</p>
          </Link>
          {hovered && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.38)' }}>{CAT_LABEL[movie.category]}</span>
              <Link href={href}><span style={{ fontSize: '10px', color: '#e50914', fontWeight: 700, cursor: 'pointer' }}>Үзэх →</span></Link>
            </div>
          )}
          {!hovered && <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.32)' }}>{CAT_LABEL[movie.category]}</p>}
        </div>
      </div>
    </div>
  );
}

// ── CATEGORY ROW ──────────────────────────────────────────────────────────────
function Row({ cat, movies }: { cat: { key: string; label: string }; movies: MongolMovie[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: 'l' | 'r') => ref.current?.scrollBy({ left: d === 'l' ? -420 : 420, behavior: 'smooth' });
  if (!movies.length) return null;

  return (
    <section className="row-section" style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4%', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <h2 style={{ fontSize: '19px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{cat.label}</h2>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{movies.length}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#e50914', fontWeight: 700, cursor: 'pointer' }}>Бүгд ›</span>
          <div className="hidden sm:flex" style={{ gap: '4px' }}>
            {(['l', 'r'] as const).map(d => (
              <button key={d} onClick={() => scroll(d)} style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                {d === 'l' ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div ref={ref} className="scrollbar-hide" style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '12px 4% 16px', cursor: 'grab' }}>
        {movies.map(m => <Card key={m.id} movie={m} />)}
      </div>
    </section>
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
