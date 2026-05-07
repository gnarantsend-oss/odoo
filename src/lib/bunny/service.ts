import type { MongolMovie } from '@/lib/types';
import { getBunnyCollections, listAllBunnyVideos } from './api';
import { buildCollectionMap, bunnyVideoToMovie } from './mappers';

/**
 * Bunny-гаас бүх кино татаж, фолдерийн нэрээр категори тодорхойлно.
 *
 * Логик:
 *  1. Бүх коллекц (фолдер) татна          → { guid, name }[]
 *  2. collectionId → categoryKey Map бүтээнэ
 *  3. Бүх видео татна
 *  4. Видео бүрийн collectionId-г Map-аас хайж категори олно
 *     (олдохгүй бол title-ээс таана — fallback)
 */
export async function getMongolMoviesFromBunny(): Promise<MongolMovie[]> {
  try {
    // Коллекц болон видеог зэрэг татна
    const [collections, videos] = await Promise.all([
      getBunnyCollections(),
      listAllBunnyVideos(),
    ]);

    const collectionMap = buildCollectionMap(collections);

    return videos.map((v) => bunnyVideoToMovie(v, collectionMap));
  } catch (err) {
    console.error('[bunny] getMongolMoviesFromBunny failed:', err);
    return [];
  }
}
