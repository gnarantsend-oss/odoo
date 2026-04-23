import type { MongolMovie } from '@/lib/types';
import { listAllBunnyVideos } from './api';
import { bunnyVideoToMovie } from './mappers';

export async function getMongolMoviesFromBunny(): Promise<MongolMovie[]> {
  try {
    const videos = await listAllBunnyVideos();
    return videos.map(bunnyVideoToMovie);
  } catch (err) {
    console.error('[bunny] getMongolMoviesFromBunny failed:', err);
    return [];
  }
}

