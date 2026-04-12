import { fetchFromAniList } from '@/lib/anilist';
import { fetchFromTMDB } from '@/lib/tmdb';
import { getTMDBImageUrl } from '@/lib/tmdb-image';
import type { Media, Movie, TVShow } from '@/lib/types';
import Header from '@/components/header';
import MongolTab from '@/components/mongol-tab';
import Link from 'next/link';
import Image from 'next/image';
import { slugify } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ── Generic horizontal row ────────────────────────────────────────────────────
function SectionRow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3 px-4 md:px-12">
        <h2 className="text-base font-bold text-foreground">{title}</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 px-4 md:px-12"
           style={{ scrollbarWidth: 'none' }}>
        {children}
      </div>
    </section>
  );
}

// ── Anime card ────────────────────────────────────────────────────────────────
function AnimeCard({ item }: { item: Media }) {
  const title = item.title.english || item.title.romaji;
  const href = `/media/${item.type.toLowerCase()}/${item.id}-${slugify(title)}`;
  return (
    <Link href={href} className="flex-shrink-0 w-[130px] sm:w-[150px] group">
      <div className="aspect-[2/3] relative rounded-xl overflow-hidden mb-2"
           style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
        <Image src={item.coverImage.large} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
      </div>
      <p className="text-xs font-medium truncate px-1">{title}</p>
    </Link>
  );
}

// ── Movie card ────────────────────────────────────────────────────────────────
function MovieCard({ item }: { item: Movie }) {
  const href = `/media/movie/${item.id}-${slugify(item.title)}`;
  const poster = getTMDBImageUrl(item.poster_path, 'w300');
  return (
    <Link href={href} className="flex-shrink-0 w-[130px] sm:w-[150px] group">
      <div className="aspect-[2/3] relative rounded-xl overflow-hidden mb-2"
           style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
        {poster
          ? <Image src={poster} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
          : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
        }
      </div>
      <p className="text-xs font-medium truncate px-1">{item.title}</p>
    </Link>
  );
}

// ── TV card ───────────────────────────────────────────────────────────────────
function TvCard({ item }: { item: TVShow }) {
  const href = `/media/tv/${item.id}-${slugify(item.name)}`;
  const poster = getTMDBImageUrl(item.poster_path, 'w300');
  return (
    <Link href={href} className="flex-shrink-0 w-[130px] sm:w-[150px] group">
      <div className="aspect-[2/3] relative rounded-xl overflow-hidden mb-2"
           style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
        {poster
          ? <Image src={poster} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
          : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
        }
      </div>
      <p className="text-xs font-medium truncate px-1">{item.name}</p>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function Home() {
  let trendingAnime: Media[]  = [];
  let popularAnime: Media[]   = [];
  let trendingManga: Media[]  = [];
  let popularManga: Media[]   = [];
  let trendingMovies: Movie[] = [];
  let popularMovies: Movie[]  = [];
  let nowPlayingMovies: Movie[] = [];
  let topRatedMovies: Movie[] = [];
  let trendingTv: TVShow[]    = [];
  let popularTv: TVShow[]     = [];

  const results = await Promise.allSettled([
    fetchFromAniList({ type: 'ANIME', sort: ['TRENDING_DESC'], perPage: 20 }),
    fetchFromAniList({ type: 'ANIME', sort: ['POPULARITY_DESC'], perPage: 20 }),
    fetchFromAniList({ type: 'MANGA', sort: ['TRENDING_DESC'], perPage: 20 }),
    fetchFromAniList({ type: 'MANGA', sort: ['POPULARITY_DESC'], perPage: 20 }),
    fetchFromTMDB('/trending/movie/week'),
    fetchFromTMDB('/movie/popular'),
    fetchFromTMDB('/movie/now_playing'),
    fetchFromTMDB('/movie/top_rated'),
    fetchFromTMDB('/trending/tv/week'),
    fetchFromTMDB('/tv/popular'),
  ]);

  const get = (r: PromiseSettledResult<any>) => r.status === 'fulfilled' ? r.value : [];
  [trendingAnime, popularAnime, trendingManga, popularManga,
   trendingMovies, popularMovies, nowPlayingMovies, topRatedMovies,
   trendingTv, popularTv] = results.map(get) as any;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* ── Mongolian content ── */}
        <MongolTab />

        {/* ── Divider ── */}
        <div className="mx-4 md:mx-12 my-8 border-t border-border/40" />

        {/* ── Anime & Manga ── */}
        {trendingAnime.length > 0 && (
          <SectionRow title="Trending Anime">
            {trendingAnime.map((m: Media) => <AnimeCard key={m.id} item={m} />)}
          </SectionRow>
        )}
        {popularAnime.length > 0 && (
          <SectionRow title="Popular Anime">
            {popularAnime.map((m: Media) => <AnimeCard key={m.id} item={m} />)}
          </SectionRow>
        )}
        {trendingManga.length > 0 && (
          <SectionRow title="Trending Manga">
            {trendingManga.map((m: Media) => <AnimeCard key={m.id} item={m} />)}
          </SectionRow>
        )}
        {popularManga.length > 0 && (
          <SectionRow title="Popular Manga">
            {popularManga.map((m: Media) => <AnimeCard key={m.id} item={m} />)}
          </SectionRow>
        )}

        {/* ── Movies ── */}
        {trendingMovies.length > 0 && (
          <SectionRow title="Trending Movies">
            {trendingMovies.map((m: Movie) => <MovieCard key={m.id} item={m} />)}
          </SectionRow>
        )}
        {popularMovies.length > 0 && (
          <SectionRow title="Popular Movies">
            {popularMovies.map((m: Movie) => <MovieCard key={m.id} item={m} />)}
          </SectionRow>
        )}
        {nowPlayingMovies.length > 0 && (
          <SectionRow title="Now Playing">
            {nowPlayingMovies.map((m: Movie) => <MovieCard key={m.id} item={m} />)}
          </SectionRow>
        )}
        {topRatedMovies.length > 0 && (
          <SectionRow title="Top Rated Movies">
            {topRatedMovies.map((m: Movie) => <MovieCard key={m.id} item={m} />)}
          </SectionRow>
        )}

        {/* ── TV Shows ── */}
        {trendingTv.length > 0 && (
          <SectionRow title="Trending TV Shows">
            {trendingTv.map((m: TVShow) => <TvCard key={m.id} item={m} />)}
          </SectionRow>
        )}
        {popularTv.length > 0 && (
          <SectionRow title="Popular TV Shows">
            {popularTv.map((m: TVShow) => <TvCard key={m.id} item={m} />)}
          </SectionRow>
        )}
      </main>
    </div>
  );
}
