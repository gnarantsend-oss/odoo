'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Info, ChevronLeft, ChevronRight, Plus, Check, Volume2 } from 'lucide-react';
import moviesJson from '@/lib/mongol_movies.json';
import { getWatchlist, toggleWatchlist, getCW } from '@/lib/watchlist';

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
const CAT_LABEL: Record<string, string> = { drama:'Драм', horror:'Аймшиг', comedy:'Инээдэм', trailer:'Трейлер' };

// ── TOAST ─────────────────────────────────────────────────────────────────────
let _toastTimer: ReturnType<typeof setTimeout>;
function useToast() {
  const [t, setT] = useState({ msg: '', show: false });
  const fire = (msg: string) => {
    setT({ msg, show: true });
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => setT(x => ({ ...x, show: false })), 2000);
  };
  return { toast: t, fire };
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero({ movies }: { movies: MongolMovie[] }) {
  const featured = movies.filter(m => m.category !== 'trailer').slice(0, 8);
  const [idx, setIdx]     = useState(0);
  const [fading, setFading] = useState(false);
  const [wl, setWl]       = useState<number[]>([]);
  const { toast, fire }   = useToast();
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { setWl(getWatchlist()); }, []);

  const goTo = useCallback((n: number) => {
    setFading(true);
    setTimeout(() => { setIdx(n); setFading(false); }, 260);
  }, []);

  useEffect(() => {
    if (featured.length < 2) return;
    timer.current = setInterval(() => goTo((idx + 1) % featured.length), 5500);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [idx, featured.length, goTo]);

  const stop  = () => { if (timer.current) clearInterval(timer.current); };
  const start = () => { timer.current = setInterval(() => goTo((idx + 1) % featured.length), 5500); };

  if (!featured.length) return null;
  const m    = featured[idx];
  const prev = featured[(idx - 1 + featured.length) % featured.length];
  const next = featured[(idx + 1) % featured.length];
  const href = `/mongol/watch/${m.id}`;
  const inWL = wl.includes(m.id);

  const toggleWL = () => {
    const added = toggleWatchlist(m.id);
    setWl(getWatchlist());
    fire(added ? '✅ Жагсаалтад нэмлээ' : '❌ Жагсаалтаас хаслаа');
  };

  return (
    <section style={{ position: 'relative', width: '100%', height: 'clamp(600px, 88vh, 900px)', overflow: 'hidden', background: '#0b0e1a' }}
      onMouseEnter={stop} onMouseLeave={start}>

      {/* Ambilight blur BG */}
      <div key={`a${m.id}`} style={{
        position: 'absolute', inset: '-60px',
        backgroundImage: `url(${m.poster})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(90px) saturate(2.5) brightness(0.28)',
        opacity: fading ? 0 : 0.75, transition: 'opacity 0.7s',
        transform: 'scale(1.2)', zIndex: 0,
      }} />

      {/* Vignette gradients */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to top, #0b0e1a 0%, rgba(11,14,26,0.6) 45%, rgba(11,14,26,0.05) 75%, transparent 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to right, rgba(11,14,26,0.65) 0%, transparent 55%)' }} />

      {/* ── 3-poster 3D carousel ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '62px', gap: '20px' }}>

        {/* Prev */}
        <div onClick={() => { stop(); goTo((idx - 1 + featured.length) % featured.length); }}
          style={{
            flexShrink: 0, width: 'clamp(90px,12vw,165px)', aspectRatio: '2/3',
            borderRadius: '10px', overflow: 'hidden', cursor: 'pointer',
            opacity: 0.4, filter: 'brightness(0.6)',
            transform: 'scale(0.84) perspective(600px) rotateY(12deg) translateX(6%)',
            transition: 'all 0.5s cubic-bezier(.22,.68,0,1.2)',
            boxShadow: '8px 12px 40px rgba(0,0,0,0.7)',
          }}>
          <img src={prev.poster} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Main — 3D lifted */}
        <div style={{
          flexShrink: 0, width: 'clamp(170px,22vw,280px)', aspectRatio: '2/3',
          borderRadius: '14px', overflow: 'hidden',
          opacity: fading ? 0 : 1, transition: 'opacity 0.3s, transform 0.5s cubic-bezier(.22,.68,0,1.2)',
          transform: 'perspective(800px) rotateY(0deg) scale(1)',
          boxShadow: '0 30px 90px rgba(0,0,0,0.9), 0 0 0 1.5px rgba(255,255,255,0.09), 0 0 60px rgba(229,9,20,0.12)',
        }}>
          <img src={m.poster} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Next */}
        <div onClick={() => { stop(); goTo((idx + 1) % featured.length); }}
          style={{
            flexShrink: 0, width: 'clamp(90px,12vw,165px)', aspectRatio: '2/3',
            borderRadius: '10px', overflow: 'hidden', cursor: 'pointer',
            opacity: 0.4, filter: 'brightness(0.6)',
            transform: 'scale(0.84) perspective(600px) rotateY(-12deg) translateX(-6%)',
            transition: 'all 0.5s cubic-bezier(.22,.68,0,1.2)',
            boxShadow: '-8px 12px 40px rgba(0,0,0,0.7)',
          }}>
          <img src={next.poster} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>

      {/* Arrows */}
      {(['left','right'] as const).map(dir => (
        <button key={dir} className="hidden md:flex" onClick={() => { stop(); goTo(dir === 'left' ? (idx - 1 + featured.length) % featured.length : (idx + 1) % featured.length); }}
          style={{ position: 'absolute', [dir]: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.15)', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', transition: 'background 0.2s' }}>
          {dir === 'left' ? <ChevronLeft size={22} color="white" /> : <ChevronRight size={22} color="white" />}
        </button>
      ))}

      {/* ── Info ── */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5, padding: '0 5% 44px' }}>
        {/* Badge row */}
        <div className="hero-badge-anim" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', color: 'white', background: 'rgba(229,9,20,0.25)', backdropFilter: 'blur(6px)', padding: '3px 10px', borderRadius: '4px', border: '0.5px solid rgba(229,9,20,0.5)' }}>🇲🇳 МОНГОЛ КИНО</span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{CAT_LABEL[m.category]}</span>
          {m.episodes && <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{m.episodes.length} анги</span>}
        </div>

        {/* Title */}
        <h1 className="hero-title-anim" style={{ fontSize: 'clamp(28px,6.5vw,62px)', fontWeight: 900, lineHeight: 1.04, letterSpacing: '-0.025em', color: 'white', textShadow: '0 4px 40px rgba(0,0,0,0.95)', marginBottom: '22px', maxWidth: '680px' }}>
          {m.name}
        </h1>

        {/* Buttons — цөөхөн товч */}
        <div className="hero-btns-anim" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href={href}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', color: '#0b0e1a', padding: '13px 32px', borderRadius: '7px', fontWeight: 800, fontSize: '16px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 28px rgba(0,0,0,0.55)', transition: 'transform 0.15s, opacity 0.15s', fontFamily: 'inherit' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}>
              <Play size={19} fill="#0b0e1a" />
              {m.episodes ? 'Үзэх' : 'Тоглуулах'}
            </button>
          </Link>

          <button onClick={toggleWL} style={{ display: 'flex', alignItems: 'center', gap: '9px', background: inWL ? 'rgba(56,208,240,0.15)' : 'rgba(109,109,110,0.55)', color: 'white', padding: '13px 22px', borderRadius: '7px', fontWeight: 700, fontSize: '15px', border: `1px solid ${inWL ? 'rgba(56,208,240,0.5)' : 'rgba(255,255,255,0.15)'}`, cursor: 'pointer', backdropFilter: 'blur(10px)', transition: 'all 0.2s', fontFamily: 'inherit' }}>
            {inWL ? <Check size={17} /> : <Plus size={17} />}
            {inWL ? 'Жагсаалтад' : 'Жагсаалт'}
          </button>
        </div>
      </div>

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: '18px', right: '5%', zIndex: 10, display: 'flex', gap: '5px' }}>
        {featured.map((_, i) => (
          <button key={i} onClick={() => { stop(); goTo(i); }} style={{ width: i === idx ? '22px' : '6px', height: '6px', borderRadius: '3px', background: i === idx ? '#e50914' : 'rgba(255,255,255,0.25)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s' }} />
        ))}
      </div>

      {/* Toast */}
      <div style={{ position: 'absolute', bottom: '80px', left: '50%', transform: `translateX(-50%) translateY(${toast.show ? 0 : '10px'})`, background: 'rgba(20,20,28,0.95)', border: '0.5px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', fontWeight: 500, padding: '9px 18px', borderRadius: '8px', zIndex: 50, backdropFilter: 'blur(12px)', opacity: toast.show ? 1 : 0, transition: 'all 0.25s', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
        {toast.msg}
      </div>
    </section>
  );
}

// ── CONTINUE WATCHING ─────────────────────────────────────────────────────────
function ContinueRow({ movies }: { movies: MongolMovie[] }) {
  const [cw, setCw] = useState<{ id: number; ep: number; progress?: number }[]>([]);
  useEffect(() => { setCw(getCW()); }, []);
  const list = cw.map(({ id, ep, progress }) => ({ m: movies.find(x => x.id === id), ep, p: progress ?? 20 })).filter(x => x.m) as { m: MongolMovie; ep: number; p: number }[];
  if (!list.length) return null;

  return (
    <section style={{ marginBottom: '28px' }}>
      <RowHeader title="▶ Үргэлжлүүлэх" count={list.length} showAll={false} />
      <div className="scrollbar-hide" style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '0 4% 6px' }}>
        {list.map(({ m, ep, p }) => (
          <Link key={m.id} href={`/mongol/watch/${m.id}`} className="flex-shrink-0" style={{ textDecoration: 'none', width: '176px', borderRadius: '10px', overflow: 'hidden', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.06)', transition: 'transform 0.22s', display: 'block' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
            <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
              <img src={m.poster} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.12)' }}>
                <div style={{ height: '100%', width: `${p}%`, background: '#e50914', borderRadius: '2px' }} />
              </div>
              {m.episodes && <span style={{ position: 'absolute', top: '6px', left: '6px', background: 'rgba(0,0,0,0.72)', color: 'white', fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '4px', border: '0.5px solid rgba(255,255,255,0.15)' }}>{ep + 1}-р анги</span>}
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
      {showAll && <span style={{ fontSize: '12px', color: '#e50914', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em', transition: 'opacity 0.15s' }}>Бүгд ›</span>}
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
    const added = toggleWatchlist(movie.id);
    setWl(added);
  };

  return (
    <div
      className="flex-shrink-0"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        width: 'clamp(135px,16vw,185px)',
        position: 'relative',
        zIndex: hovered ? 30 : 1,
        transition: 'z-index 0s',
      }}
    >
      {/* Card body */}
      <div style={{
        borderRadius: '10px', overflow: 'hidden',
        background: 'rgba(255,255,255,0.04)',
        border: '0.5px solid rgba(255,255,255,0.07)',
        transform: hovered ? 'scale(1.1) translateY(-8px) perspective(600px) rotateX(2deg)' : 'scale(1) translateY(0) perspective(600px) rotateX(0deg)',
        boxShadow: hovered ? '0 28px 70px rgba(0,0,0,0.8), 0 0 0 1.5px rgba(229,9,20,0.35), 0 0 40px rgba(229,9,20,0.1)' : '0 4px 16px rgba(0,0,0,0.4)',
        transition: 'transform 0.35s cubic-bezier(.22,.68,0,1.2), box-shadow 0.35s ease',
      }}>
        {/* Poster */}
        <Link href={href} style={{ display: 'block', aspectRatio: '2/3', position: 'relative', overflow: 'hidden' }}>
          <img src={movie.poster} alt={movie.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.5s ease' }} />

          {/* Preview gif */}
          {movie.preview && hovered && <img src={movie.preview} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}

          {/* Hover overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.5)', transform: hovered ? 'scale(1)' : 'scale(0.7)', transition: 'transform 0.3s cubic-bezier(.22,.68,0,1.2)' }}>
              <Play size={16} fill="#0b0e1a" color="#0b0e1a" />
            </div>
          </div>

          {/* Episode badge */}
          {movie.episodes && <span style={{ position: 'absolute', top: '7px', left: '7px', background: 'rgba(0,0,0,0.78)', color: 'white', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', border: '0.5px solid rgba(255,255,255,0.15)' }}>{movie.episodes.length} анги</span>}

          {/* Watchlist btn */}
          <button onClick={handleWL} style={{ position: 'absolute', top: '7px', right: '7px', width: '26px', height: '26px', borderRadius: '50%', background: wl ? 'rgba(56,208,240,0.25)' : 'rgba(0,0,0,0.65)', border: `1px solid ${wl ? 'rgba(56,208,240,0.6)' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(6px)', opacity: hovered ? 1 : 0, transform: hovered ? 'scale(1)' : 'scale(0.7)', transition: 'all 0.25s' }}>
            {wl ? <Check size={11} color="#38d0f0" /> : <Plus size={11} color="white" />}
          </button>
        </Link>

        {/* Info panel — slides up on hover */}
        <div style={{
          padding: hovered ? '10px' : '8px 10px',
          maxHeight: hovered ? '80px' : '44px',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease, padding 0.3s ease',
          background: hovered ? 'rgba(18,20,32,1)' : 'transparent',
        }}>
          <Link href={href} style={{ textDecoration: 'none' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.88)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: hovered ? '5px' : '2px' }}>{movie.name}</p>
          </Link>
          {hovered && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.38)', fontWeight: 500 }}>{CAT_LABEL[movie.category]}</span>
              <Link href={href}>
                <span style={{ fontSize: '10px', color: '#e50914', fontWeight: 700, cursor: 'pointer' }}>Үзэх →</span>
              </Link>
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
            {(['l','r'] as const).map(d => (
              <button key={d} onClick={() => scroll(d)} style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'background 0.15s' }}>
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
        {CATEGORIES.map(cat => <Row key={cat.key} cat={cat} movies={movies.filter(m => m.category === cat.key)} />)}
      </div>
    </>
  );
}
