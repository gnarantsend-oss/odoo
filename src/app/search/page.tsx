import { getMongolMoviesCached } from '@/lib/bunny';
import SearchClient from './search-client';

export const revalidate = 300;

export default async function SearchPage() {
  const movies = await getMongolMoviesCached().catch((err) => {
    console.error('[search] failed to load bunny movies', err);
    return [];
  });
  return <SearchClient movies={movies} />;
}
