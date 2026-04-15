// ── Watchlist & Continue-Watching localStorage utils ──────────────────────────

const WL_KEY = 'ntv_wl';
const CW_KEY = 'narhan-continue';

export function getWatchlist(): string[] {
  try { return JSON.parse(localStorage.getItem(WL_KEY) || '[]'); } catch { return []; }
}

export function toggleWatchlist(id: string): boolean {
  const list = getWatchlist();
  const idx = list.indexOf(id);
  if (idx === -1) { list.push(id); localStorage.setItem(WL_KEY, JSON.stringify(list)); return true; }
  list.splice(idx, 1); localStorage.setItem(WL_KEY, JSON.stringify(list)); return false;
}

export function isInWatchlist(id: string): boolean {
  return getWatchlist().includes(id);
}

export type CWEntry = { id: string; ep: number; progress?: number };

export function getCW(): CWEntry[] {
  try { return JSON.parse(localStorage.getItem(CW_KEY) || '[]'); } catch { return []; }
}

export function saveCW(movieId: string, ep: number, progress = 0) {
  try {
    const list = getCW().filter(x => x.id !== movieId);
    list.unshift({ id: movieId, ep, progress });
    localStorage.setItem(CW_KEY, JSON.stringify(list.slice(0, 20)));
  } catch {}
}
