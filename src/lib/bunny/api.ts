import type { BunnyPaginated, BunnyVideoDetail, BunnyVideoListItem } from './types';
import { getBunnyApiKey, getBunnyLibraryId } from './env';

export async function getBunnyVideos(opts?: {
  page?: number;
  itemsPerPage?: number;
  search?: string;
  orderBy?: string;
}): Promise<BunnyVideoListItem[]> {
  const libraryId = getBunnyLibraryId();
  const apiKey = getBunnyApiKey();
  if (!apiKey) {
    throw new Error('Missing env: BUNNY_STREAM_API_KEY');
  }
  if (!process.env.BUNNY_LIBRARY_ID) {
    console.warn('[bunny] BUNNY_LIBRARY_ID not set; using fallback 12345');
  }

  const page = opts?.page ?? 1;
  const itemsPerPage = opts?.itemsPerPage ?? 100;
  const orderBy = opts?.orderBy ?? 'date';
  const search = opts?.search ?? '';

  const url = new URL(`https://video.bunnycdn.com/library/${libraryId}/videos`);
  url.searchParams.set('page', String(page));
  url.searchParams.set('itemsPerPage', String(itemsPerPage));
  url.searchParams.set('orderBy', orderBy);
  if (search) url.searchParams.set('search', search);

  const res = await fetch(url.toString(), {
    headers: { AccessKey: apiKey },
    next: { revalidate: 300, tags: ['movies'] },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error('[bunny] list videos failed', res.status, body.slice(0, 300));
    throw new Error(`Bunny Stream API error (${res.status}) while listing videos`);
  }

  const json = (await res.json()) as BunnyPaginated<BunnyVideoListItem> | BunnyVideoListItem[];
  if (Array.isArray(json)) return json;
  return json.items ?? [];
}

export async function getBunnyVideo(videoId: string): Promise<BunnyVideoDetail | null> {
  const libraryId = getBunnyLibraryId();
  const apiKey = getBunnyApiKey();
  if (!apiKey) throw new Error('Missing env: BUNNY_STREAM_API_KEY');

  const res = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`, {
    headers: { AccessKey: apiKey },
    next: { revalidate: 1800, tags: [`movie-${videoId}`] },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error('[bunny] get video failed', res.status, body.slice(0, 300));
    return null;
  }
  return (await res.json()) as BunnyVideoDetail;
}

export async function listAllBunnyVideos(): Promise<BunnyVideoListItem[]> {
  const itemsPerPage = 100;
  const maxPages = 50;

  let page = 1;
  const all: BunnyVideoListItem[] = [];

  while (page <= maxPages) {
    const chunk = await getBunnyVideos({ page, itemsPerPage });
    all.push(...chunk);
    if (chunk.length < itemsPerPage) break;
    page += 1;
  }

  return all;
}

