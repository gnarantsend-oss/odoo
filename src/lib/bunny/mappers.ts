import type { MongolMovie } from '@/lib/types';
import type { BunnyVideoListItem } from './types';
import { getBunnyCdnHostname, getBunnyLibraryId } from './env';

function bunnyThumbUrl(libraryId: string, guid: string, thumbnailFileName?: string | null) {
  const file = thumbnailFileName || 'thumbnail.jpg';
  const host = getBunnyCdnHostname(libraryId);
  return `https://${host}/${guid}/${file}`;
}

function bunnyEmbedUrl(libraryId: string, guid: string) {
  return `https://iframe.mediadelivery.net/embed/${libraryId}/${guid}`;
}

function bunnyPreviewWebpUrl(libraryId: string, guid: string) {
  const host = getBunnyCdnHostname(libraryId);
  return `https://${host}/${guid}/preview.webp`;
}

function guessCategory(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('trailer') || t.includes('трейлер')) return 'trailer';
  if (t.includes('horror') || t.includes('аймшиг')) return 'horror';
  if (t.includes('comedy') || t.includes('инээдэм')) return 'comedy';
  return 'drama';
}

export function bunnyVideoToMovie(v: BunnyVideoListItem): MongolMovie {
  const libraryId = getBunnyLibraryId();
  return {
    id: v.guid,
    name: v.title,
    category: guessCategory(v.title),
    poster: bunnyThumbUrl(libraryId, v.guid, v.thumbnailFileName),
    preview: bunnyPreviewWebpUrl(libraryId, v.guid),
    iframe: bunnyEmbedUrl(libraryId, v.guid),
  };
}

