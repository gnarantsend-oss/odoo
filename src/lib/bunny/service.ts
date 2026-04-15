import type { MongolMovie } from '@/lib/types';
import { listAllBunnyVideos } from './api';
import { bunnyVideoToMovie } from './mappers';

export async function getMongolMoviesFromBunny(): Promise<MongolMovie[]> {
  const videos = await listAllBunnyVideos();
  return videos.map(bunnyVideoToMovie);
}

