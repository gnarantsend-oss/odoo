import { getMongolMoviesFromBunny } from '@/lib/bunny';
import SearchClient from './search-client';

export const revalidate = 300;
export const dynamic = 'force-dynamic';

export default async function SearchPage() {
  const movies = await getMongolMoviesFromBunny();
  return <SearchClient movies={movies} />;
}
