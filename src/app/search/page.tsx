import { getMongolMoviesFromBunny } from '@/lib/bunny';
import SearchClient from './search-client';

export const revalidate = 300;

export default async function SearchPage() {
  const movies = await getMongolMoviesFromBunny();
  return <SearchClient movies={movies} />;
}
