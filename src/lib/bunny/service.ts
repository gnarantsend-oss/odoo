import { unstable_cache } from 'next/cache';
import type { MongolMovie } from '@/lib/types';
import { getBunnyVideo, listAllBunnyVideos } from './api';
import { bunnyVideoToMovie } from './mappers';

export async function getMongolMoviesFromBunny(): Promise<MongolMovie[]> {
  const videos = await listAllBunnyVideos();
  return videos.map(bunnyVideoToMovie);
}

const getCachedMovies = unstable_cache(
  async () => getMongolMoviesFromBunny(),
  ['bunny-movies-v1'],
  { revalidate: 300, tags: ['movies'] },
);

export async function getMongolMoviesCached(): Promise<MongolMovie[]> {
  return getCachedMovies();
}

export async function getMongolMovieByIdCached(id: string): Promise<MongolMovie | null> {
  const getCachedById = unstable_cache(
    async () => {
      const video = await getBunnyVideo(id);
      return video ? bunnyVideoToMovie(video) : null;
    },
    ['bunny-movie-v1', id],
    { revalidate: 1800, tags: [`movie-${id}`] },
  );

  return getCachedById();
}

