'use client';

import { useMemo, useState } from 'react';
import type { MongolMovie } from '@/lib/types';

export function useSearch(movies: MongolMovie[]) {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const results = useMemo(() => {
    let list = movies;
    if (activeCat) list = list.filter((m) => m.category === activeCat);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(q));
    }
    return list;
  }, [movies, activeCat, query]);

  const hasFilter = query.trim() !== '' || activeCat !== null;

  return { query, setQuery, activeCat, setActiveCat, results, hasFilter };
}

