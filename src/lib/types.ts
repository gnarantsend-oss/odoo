// ── Shared types & constants ──────────────────────────────────
// Бүх файл энэ газраас import хийнэ — давхардал байхгүй

export type Episode = { ep: number; title: string; iframe: string };

export type MongolMovie = {
  // Bunny Stream GUID (string) эсвэл бусад source-н тогтвортой id
  id: string;
  name: string;
  category: string;
  poster: string;
  iframe?: string;
  preview?: string;
  episodes?: Episode[];
};

export type Banner = {
  img:  string;
  href: string;
  alt?: string;
};

export const CAT_LABEL: Record<string, string> = {
  drama:   'Драм',
  horror:  'Аймшиг',
  comedy:  'Инээдэм',
  trailer: 'Трейлер',
};

export const CATEGORIES = [
  { key: 'drama',   label: '🎭 Драм' },
  { key: 'horror',  label: '👻 Аймшиг' },
  { key: 'comedy',  label: '😂 Инээдэм' },
  { key: 'trailer', label: '🎞 Трейлер' },
] as const;
