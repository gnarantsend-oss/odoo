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
  action:         'Экшн',
  adventure:      'Адал явдал',
  animation:      'Анимэйшн',
  comedy:         'Инээдэм',
  crime:          'Гэмт хэрэг',
  documentary:    'Баримтат',
  drama:          'Драм',
  family:         'Гэр бүл',
  fantasy:        'Фэнтэзи',
  history:        'Түүх',
  horror:         'Аймшиг',
  music:          'Хөгжим',
  mystery:        'Нууц',
  romance:        'Романтик',
  scifi:          'Шинжлэх ухаан',
  thriller:       'Триллер',
  war:            'Дайн',
  western:        'Вестерн',
  series:         'Барууны цуврал',
  adult:          '+18',
  trailer:        'Трейлер',
};

export const CATEGORIES = [
  { key: 'action',      label: '💥 Экшн' },
  { key: 'adventure',   label: '🗺 Адал явдал' },
  { key: 'animation',   label: '🎨 Анимэйшн' },
  { key: 'comedy',      label: '😂 Инээдэм' },
  { key: 'crime',       label: '🔫 Гэмт хэрэг' },
  { key: 'documentary', label: '🎥 Баримтат' },
  { key: 'drama',       label: '🎭 Драм' },
  { key: 'family',      label: '👨‍👩‍👧 Гэр бүл' },
  { key: 'fantasy',     label: '🧙 Фэнтэзи' },
  { key: 'history',     label: '📜 Түүх' },
  { key: 'horror',      label: '👻 Аймшиг' },
  { key: 'music',       label: '🎵 Хөгжим' },
  { key: 'mystery',     label: '🔍 Нууц' },
  { key: 'romance',     label: '❤️ Романтик' },
  { key: 'scifi',       label: '🚀 Шинжлэх ухаан' },
  { key: 'thriller',    label: '😰 Триллер' },
  { key: 'war',         label: '⚔️ Дайн' },
  { key: 'western',     label: '🤠 Вестерн' },
  { key: 'series',      label: '📺 Барууны цуврал' },
  { key: 'adult',       label: '🔞 +18' },
  { key: 'trailer',     label: '🎞 Трейлер' },
] as const;
