import { getMongolMoviesFromBunny } from '@/lib/bunny';
import WatchlistClient from './watchlist-client';

export const revalidate = 300;

export default async function WatchlistPage() {
  const moviesAll = await getMongolMoviesFromBunny().catch((err) => {
    console.error('[watchlist] failed to load bunny movies', err);
    return [];
  });
  return <WatchlistClient moviesAll={moviesAll} />;
}
