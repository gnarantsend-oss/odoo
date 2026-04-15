import { getMongolMoviesFromBunny } from '@/lib/bunny';
import WatchlistClient from './watchlist-client';

// 5 минут ISR — force-dynamic хасав
export const revalidate = 300;

export default async function WatchlistPage() {
  const moviesAll = await getMongolMoviesFromBunny();
  return <WatchlistClient moviesAll={moviesAll} />;
}
