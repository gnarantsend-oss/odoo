// Pure utility — no 'use server' / 'use client' directive
// Client болон Server component-д аль алинд нь import хийж болно

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

export function getTMDBImageUrl(path: string | null, size: 'w500' | 'original' = 'w500') {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
}
