'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { saveCW, getCW } from '@/lib/watchlist';
import type { MongolMovie } from '@/lib/types';


// ── Auto-next banner ──────────────────────────────────────────────────────────
function AutoNextBanner({ epTitle, onConfirm, onCancel }: {
  epTitle: string; onConfirm: () => void; onCancel: () => void;
}) {
  const [sec, setSec] = useState(10);
  useEffect(() => {
    if (sec <= 0) { onConfirm(); return; }
    const t = setTimeout(() => setSec(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [sec, onConfirm]);

  return (
    <div className="glass-control modal-enter" style={{
      position: 'absolute', bottom: '80px', right: '20px', zIndex: 50,
      borderRadius: '12px', padding: '16px 20px', minWidth: '260px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '11px', color: 'var(--muted-foreground)', letterSpacing: '0.08em' }}>ДАРААГИЙН АНГИ</span>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', padding: 0 }}>
          <X size={14} />
        </button>
      </div>
      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '14px', lineHeight: 1.3 }}>{epTitle}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <svg width="36" height="36" viewBox="0 0 36 36" style={{ flexShrink: 0 }}>
          <circle cx="18" cy="18" r="15" fill="none" stroke="var(--border)" strokeWidth="3"/>
          <circle cx="18" cy="18" r="15" fill="none" stroke="var(--primary)" strokeWidth="3"
            strokeDasharray={`${(sec / 10) * 94.25} 94.25`} strokeLinecap="round"
            transform="rotate(-90 18 18)" style={{ transition: 'stroke-dasharray 1s linear' }} />
          <text x="18" y="22" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">{sec}</text>
        </svg>
        <button onClick={onConfirm} style={{
          flex: 1, background: 'var(--primary)', color: 'var(--primary-foreground)',
          border: 'none', borderRadius: '6px', padding: '8px 12px',
          fontSize: '13px', fontWeight: 700, cursor: 'pointer',
        }}>Одоо үзэх</button>
      </div>
    </div>
  );
}

// ── Player ────────────────────────────────────────────────────────────────────
export function MongolPlayer({ movie }: { movie: MongolMovie }) {
  const isSerial = !!movie.episodes && movie.episodes.length > 0;
  const episodes = movie.episodes || [];

  const [epIndex, setEpIndex] = useState(() => {
    try {
      const list = getCW();
      const found = list.find(x => x.id === movie.id);
      if (found && found.ep < (movie.episodes?.length ?? 1)) return found.ep;
    } catch {}
    return 0;
  });

  const [loading, setLoading] = useState(true);
  const [showAutoNext, setShowAutoNext] = useState(false);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const iframeSrc = isSerial ? episodes[epIndex]?.iframe : movie.iframe;

  useEffect(() => {
    if (isSerial) saveCW(movie.id, epIndex);
  }, [movie.id, epIndex, isSerial]);

  useEffect(() => {
    if (!isSerial || epIndex >= episodes.length - 1) return;
    setShowAutoNext(false);
    if (autoTimer.current) clearTimeout(autoTimer.current);
    autoTimer.current = setTimeout(() => setShowAutoNext(true), 8000);
    return () => { if (autoTimer.current) clearTimeout(autoTimer.current); };
  }, [epIndex, isSerial, episodes.length]);

  const goNext = useCallback(() => {
    setShowAutoNext(false);
    setEpIndex(i => i + 1);
    setLoading(true);
  }, []);

  const cancelAutoNext = useCallback(() => {
    setShowAutoNext(false);
    if (autoTimer.current) clearTimeout(autoTimer.current);
  }, []);

  return (
    <>
      {isSerial && (
        <div className="flex gap-2 overflow-x-auto px-4 py-3 bg-background/80 border-b border-border/40 scrollbar-hide">
          {episodes.map((ep, i) => (
            <button key={ep.ep}
              onClick={() => { setEpIndex(i); setLoading(true); setShowAutoNext(false); }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                i === epIndex ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}>
              {ep.ep}-р анги
            </button>
          ))}
        </div>
      )}

      <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-black">
        {/* Ambilight */}
        <div aria-hidden style={{
          position: 'absolute', inset: '-30px',
          backgroundImage: `url(${movie.poster})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'blur(60px) saturate(1.8) brightness(0.45)',
          opacity: loading ? 0 : 0.4,
          transition: 'opacity 1.2s ease',
          zIndex: 0, transform: 'scale(1.1)',
        }} />

        {loading && (
          <div className="absolute flex items-center justify-center w-full h-full z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {iframeSrc ? (
          <iframe key={iframeSrc} src={iframeSrc} onLoad={() => setLoading(false)}
            allowFullScreen style={{ position: 'relative', zIndex: 1 }}
            className="h-full w-full border-0" title={movie.name} />
        ) : (
          <p className="text-muted-foreground relative z-10">Видео холбоос байхгүй байна</p>
        )}

        {showAutoNext && isSerial && epIndex < episodes.length - 1 && (
          <AutoNextBanner
            epTitle={episodes[epIndex + 1]?.title || `${episodes[epIndex + 1]?.ep}-р анги`}
            onConfirm={goNext}
            onCancel={cancelAutoNext}
          />
        )}
      </main>

      {isSerial && (
        <footer className="flex items-center justify-between p-4 glass-control border-t border-border/40">
          <Button variant="secondary" onClick={() => { setEpIndex(i => i - 1); setLoading(true); setShowAutoNext(false); }} disabled={epIndex <= 0}>
            <ChevronLeft className="mr-2" /> Өмнөх
          </Button>
          <span className="text-sm text-muted-foreground">{epIndex + 1} / {episodes.length}</span>
          <Button variant="secondary" onClick={goNext} disabled={epIndex >= episodes.length - 1}>
            Дараах <ChevronRight className="ml-2" />
          </Button>
        </footer>
      )}
    </>
  );
}
