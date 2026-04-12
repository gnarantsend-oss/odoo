import { fetchFromAniList } from '@/lib/anilist';
import { fetchFromTMDB } from '@/lib/tmdb';
import type { Media, Movie, TVShow } from '@/lib/types';
import Header from '@/components/header';
import dynamic from 'next/dynamic';

const MediaCarousel     = dynamic(() => import('@/components/media-carousel'));
const MediaGrid         = dynamic(() => import('@/components/media-grid'));
const MovieCarousel     = dynamic(() => import('@/components/movie-carousel'));
const TvCarousel        = dynamic(() => import('@/components/tv-carousel'));
const MovieGrid         = dynamic(() => import('@/components/movie-grid'));
const TvGrid            = dynamic(() => import('@/components/tv-grid'));
const HeroCarousel      = dynamic(() => import('@/components/hero-carousel'));
const MovieHeroCarousel = dynamic(() => import('@/components/movie-hero-carousel'));
const TvHeroCarousel    = dynamic(() => import('@/components/tv-hero-carousel'));
const AdvertiseBanner   = dynamic(() => import('@/components/advertise-banner'));
const MongolTab         = dynamic(() => import('@/components/mongol-tab'));

// revalidate байхгүй — cacheComponents: true-тай нийцдэггүй тул хасав
// Ani-main загвар: шууд server-side fetchFromAniList ашиглана

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; tab?: string }>;
}) {
  // Next.js 16: searchParams бол Promise
  const sp    = await searchParams;
  const query = sp?.query || '';
  const tab   = sp?.tab   || 'anime';

  let trendingAnime: Media[]  = [];
  let popularAnime: Media[]   = [];
  let trendingManga: Media[]  = [];
  let popularManga: Media[]   = [];
  let trendingMovies: Movie[] = [];
  let popularMovies: Movie[]  = [];
  let topRatedMovies: Movie[] = [];
  let nowPlayingMovies: Movie[] = [];
  let upcomingMovies: Movie[] = [];
  let trendingTv: TVShow[]    = [];
  let popularTv: TVShow[]     = [];

  let animeSearchResults: Media[]  = [];
  let mangaSearchResults: Media[]  = [];
  let movieSearchResults: Movie[]  = [];
  let tvSearchResults: TVShow[]    = [];

  try {
    if (query) {
      // Хайлт — зөвхөн идэвхтэй tab-н дата татна
      if (tab === 'anime') {
        animeSearchResults = await fetchFromAniList({ search: query, type: 'ANIME', sort: ['SEARCH_MATCH'], perPage: 40 });
      } else if (tab === 'manga') {
        mangaSearchResults = await fetchFromAniList({ search: query, type: 'MANGA', sort: ['SEARCH_MATCH'], perPage: 40 });
      } else if (tab === 'movies') {
        movieSearchResults = await fetchFromTMDB('/search/movie', { query });
      } else if (tab === 'tv') {
        tvSearchResults = await fetchFromTMDB('/search/tv', { query });
      }
    } else {
      // Ani-main загвар: бүгдийг нэгэн зэрэг Promise.allSettled-аар татна
      const results = await Promise.allSettled([
        fetchFromAniList({ type: 'ANIME', sort: ['TRENDING_DESC', 'POPULARITY_DESC'], perPage: 10 }),
        fetchFromAniList({ type: 'ANIME', sort: ['POPULARITY_DESC'], perPage: 20 }),
        fetchFromAniList({ type: 'MANGA', sort: ['TRENDING_DESC', 'POPULARITY_DESC'], perPage: 10 }),
        fetchFromAniList({ type: 'MANGA', sort: ['POPULARITY_DESC'], perPage: 20 }),
        fetchFromTMDB('/trending/movie/week'),
        fetchFromTMDB('/movie/popular'),
        fetchFromTMDB('/movie/top_rated'),
        fetchFromTMDB('/movie/now_playing'),
        fetchFromTMDB('/movie/upcoming'),
        fetchFromTMDB('/trending/tv/week'),
        fetchFromTMDB('/tv/popular'),
      ]);

      const get = (r: PromiseSettledResult<any>) => r.status === 'fulfilled' ? r.value : [];
      [trendingAnime, popularAnime, trendingManga, popularManga,
       trendingMovies, popularMovies, topRatedMovies, nowPlayingMovies, upcomingMovies,
       trendingTv, popularTv] = results.map(get) as [
        Media[], Media[], Media[], Media[],
        Movie[], Movie[], Movie[], Movie[], Movie[],
        TVShow[], TVShow[]
      ];
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {query ? (
          <div className="px-4 md:px-12 py-8 space-y-12">
            {animeSearchResults.length > 0  && <MediaGrid title="Anime Results"    items={animeSearchResults}  />}
            {mangaSearchResults.length > 0  && <MediaGrid title="Manga Results"    items={mangaSearchResults}  />}
            {movieSearchResults.length > 0  && <MovieGrid title="Movie Results"    items={movieSearchResults}  />}
            {tvSearchResults.length > 0     && <TvGrid    title="TV Show Results"  items={tvSearchResults}     />}
            {animeSearchResults.length === 0 && mangaSearchResults.length === 0 &&
             movieSearchResults.length === 0 && tvSearchResults.length === 0 && (
              <div className="text-center py-24">
                <h2 className="text-2xl font-bold">"{query}" — Хайлтын үр дүн олдсонгүй</h2>
                <p className="text-muted-foreground mt-2">Өөр нэртэй хайж үзнэ үү.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Hero */}
            {tab === 'anime'  && trendingAnime.length > 0  && <HeroCarousel       items={trendingAnime.slice(0, 5)}  />}
            {tab === 'manga'  && trendingManga.length > 0  && <HeroCarousel       items={trendingManga.slice(0, 5)}  />}
            {tab === 'movies' && trendingMovies.length > 0 && <MovieHeroCarousel  items={trendingMovies.slice(0, 5)} />}
            {tab === 'tv'     && trendingTv.length > 0     && <TvHeroCarousel     items={trendingTv.slice(0, 5)}     />}
            {tab === 'mongol' && <MongolTab />}

            {tab !== 'mongol' && tab !== 'anime' && tab !== 'manga' && <AdvertiseBanner />}

            {/* Anime */}
            {tab === 'anime' && (
              <div className="py-4 space-y-2">
                {trendingAnime.length > 0 && <MediaCarousel title="Trending Anime" items={trendingAnime} />}
                {popularAnime.length > 0  && <MediaCarousel title="Popular Anime"  items={popularAnime}  />}
              </div>
            )}

            {/* Manga */}
            {tab === 'manga' && (
              <div className="py-4 space-y-2">
                {trendingManga.length > 0 && <MediaCarousel title="Trending Manga" items={trendingManga} />}
                {popularManga.length > 0  && <MediaCarousel title="Popular Manga"  items={popularManga}  />}
                {trendingManga.length === 0 && popularManga.length === 0 && (
                  <div className="text-center py-24 text-muted-foreground">
                    Өгөгдөл татахад алдаа гарлаа. Дахин оролдоно уу.
                  </div>
                )}
              </div>
            )}

            {/* Movies */}
            {tab === 'movies' && (
              <div className="py-4 space-y-2">
                <MovieCarousel title="Trending Movies" items={trendingMovies}   />
                <MovieCarousel title="Popular Movies"  items={popularMovies}    />
                <MovieCarousel title="Now Playing"     items={nowPlayingMovies} />
                <MovieCarousel title="Top Rated"       items={topRatedMovies}   />
                <MovieCarousel title="Coming Soon"     items={upcomingMovies}   />
              </div>
            )}

            {/* TV */}
            {tab === 'tv' && (
              <div className="py-4 space-y-2">
                <TvCarousel title="Trending TV Shows" items={trendingTv} />
                <TvCarousel title="Popular TV Shows"  items={popularTv}  />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
