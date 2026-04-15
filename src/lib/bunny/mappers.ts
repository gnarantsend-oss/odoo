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
  if (t.includes('трейлер')    || t.includes('trailer'))     return 'trailer';
  if (t.includes('аймшиг')     || t.includes('horror'))      return 'horror';
  if (t.includes('инээдэм')    || t.includes('comedy'))      return 'comedy';
  if (t.includes('экшн')       || t.includes('action'))      return 'action';
  if (t.includes('адал явдал') || t.includes('adventure'))   return 'adventure';
  if (t.includes('анимэйшн')   || t.includes('animation'))   return 'animation';
  if (t.includes('гэмт хэрэг') || t.includes('crime'))       return 'crime';
  if (t.includes('баримтат')   || t.includes('documentary')) return 'documentary';
  if (t.includes('гэр бүл')    || t.includes('family'))      return 'family';
  if (t.includes('фэнтэзи')    || t.includes('fantasy'))     return 'fantasy';
  if (t.includes('түүх')       || t.includes('history'))     return 'history';
  if (t.includes('хөгжим')     || t.includes('music'))       return 'music';
  if (t.includes('нууц')       || t.includes('mystery'))     return 'mystery';
  if (t.includes('романтик')   || t.includes('romance'))     return 'romance';
  if (t.includes('шинжлэх')    || t.includes('scifi')
                                || t.includes('sci-fi'))      return 'scifi';
  if (t.includes('триллер')    || t.includes('thriller'))    return 'thriller';
  if (t.includes('дайн')       || t.includes('war'))         return 'war';
  if (t.includes('вестерн')    || t.includes('western'))     return 'western';
  if (t.includes('цуврал')     || t.includes('series'))      return 'series';
  if (t.includes('+18')        || t.includes('adult'))       return 'adult';
  return 'drama';
}

export function bunnyVideoToMovie(v: BunnyVideoListItem): MongolMovie {
  const libraryId = getBunnyLibraryId();
  return {
    id: v.guid,
    name: v.title.split(' - ')[0].trim(),
    category: guessCategory(v.title),
    poster: bunnyThumbUrl(libraryId, v.guid, v.thumbnailFileName),
    preview: bunnyPreviewWebpUrl(libraryId, v.guid),
    iframe: bunnyEmbedUrl(libraryId, v.guid),
  };
}
