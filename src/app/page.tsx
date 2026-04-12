import { fetchFromTMDB } from '@/lib/tmdb';
import type { Movie, TVShow } from '@/lib/types';
import Header from '@/components/header';
import dynamic from 'next/dynamic';

// AniList data — client-side дээр AniListSection component ашиглана
// (server-side rate limit-с зайлсхийхийн тулд)
const AniListSection    = dynamic(() => import('@/components/anilist-section'));
const MovieCarousel     = dynamic(() => import('@/components/movie-carousel'));
const TvCarousel        = dynamic(() => import('@/components/tv-carousel'));
const MovieGrid         = dynamic(() => import('@/components/movie-grid'));
const TvGrid            = dynamic(() => import('@/components/tv-grid'));
const MovieHeroCarousel = dynamic(() => import('@/components/movie-hero-carousel'));
const TvHeroCarousel    = dynamic(() => import('@/components/tv-hero-carousel'));
const AdvertiseBanner   = dynamic(() => import('@/components/advertise-banner'));
const MongolTab         = dynamic(() => import('@/components/mongol-tab'));

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; tab?: string }>;
}) {
  const sp = await searchParams;
  const query = sp?.query || '';
  const tab = sp?.tab || 'anime';

  // Зөвхөн TMDB датаг сервер талд татна — найдвартай
  let trendingMovies: Movie[] = [];
  let popularMovies: Movie[]  = [];
  let topRatedMovies: Movie[] = [];
  let nowPlayingMovies: Movie[] = [];
  let upcomingMovies: Movie[] = [];
  let trendingTv: TVShow[]   = [];
  let popularTv: TVShow[]    = [];

  let movieSearchResults: Movie[]  = [];
  let tvSearchResults: TVShow[]    = [];

  try {
    if (query && (tab === 'movies' || tab === 'tv')) {
      if (tab === 'movies') {
        movieSearchResults = await fetchFromTMDB('/search/movie', { query });
      } else if (tab === 'tv') {
        tvSearchResults = await fetchFromTMDB('/search/tv', { query });
      }
    } else if (!query && (tab === 'movies' || tab === 'tv')) {
      const results = await Promise.allSettled([
        fetchFromTMDB('/trending/movie/week'),
        fetchFromTMDB('/movie/popular'),
        fetchFromTMDB('/movie/top_rated'),
        fetchFromTMDB('/movie/now_playing'),
        fetchFromTMDB('/movie/upcoming'),
        fetchFromTMDB('/trending/tv/week'),
        fetchFromTMDB('/tv/popular'),
      ]);

      const get = (r: PromiseSettledResult<any>) => r.status === 'fulfilled' ? r.value : [];
      [trendingMovies, popularMovies, topRatedMovies, nowPlayingMovies, upcomingMovies,
       trendingTv, popularTv] = results.map(get) as [
        Movie[], Movie[], Movie[], Movie[], Movie[], TVShow[], TVShow[]
      ];
    }
  } catch (error) {
    console.error('Failed to fetch TMDB data:', error);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {query ? (
          <div className="px-4 md:px-12 py-8 space-y-12">
            {/* AniList хайлт — client-side API route ашиглана */}
            {(tab === 'anime' || tab === 'manga') && (
              <AniListSection type={tab === 'anime' ? 'ANIME' : 'MANGA'} searchQuery={query} />
            )}
            {movieSearchResults.length > 0 && <MovieGrid title="Movie Results" items={movieSearchResults} />}
            {tvSearchResults.length > 0 && <TvGrid title="TV Show Results" items={tvSearchResults} />}
            {tab !== 'anime' && tab !== 'manga' &&
             movieSearchResults.length === 0 && tvSearchResults.length === 0 && (
              <div className="text-center py-24">
                <h2 className="text-2xl font-bold">"{query}" — Хайлтын үр дүн олдсонгүй</h2>
                <p className="text-muted-foreground mt-2">Өөр нэртэй хайж үзнэ үү.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Anime / Manga — client-side AniListSection */}
            {tab === 'anime' && <AniListSection type="ANIME" />}
            {tab === 'manga' && <AniListSection type="MANGA" />}

            {tab === 'mongol' && <MongolTab />}

            {tab !== 'mongol' && tab !== 'anime' && tab !== 'manga' && <AdvertiseBanner />}

            {/* Movies */}
            {tab === 'movies' && (
              <>
                {trendingMovies.length > 0 && <MovieHeroCarousel items={trendingMovies.slice(0, 5)} />}
                <div className="py-4 space-y-2">
                  <MovieCarousel title="Trending Movies" items={trendingMovies}   />
                  <MovieCarousel title="Popular Movies"  items={popularMovies}    />
                  <MovieCarousel title="Now Playing"     items={nowPlayingMovies} />
                  <MovieCarousel title="Top Rated"       items={topRatedMovies}   />
                  <MovieCarousel title="Coming Soon"     items={upcomingMovies}   />
                </div>
              </>
            )}

            {/* TV */}
            {tab === 'tv' && (
              <>
                {trendingTv.length > 0 && <TvHeroCarousel items={trendingTv.slice(0, 5)} />}
                <div className="py-4 space-y-2">
                  <TvCarousel title="Trending TV Shows" items={trendingTv} />
                  <TvCarousel title="Popular TV Shows"  items={popularTv}  />
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
