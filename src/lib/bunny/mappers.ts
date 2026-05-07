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

/**
 * Bunny фолдерийн нэрийг категорийн түлхүүр болгон хөрвүүлнэ.
 * Жишээ: "Action" → "action", "Аймшиг" → "horror"
 */
export function folderNameToCategory(folderName: string): string {
  const n = folderName.trim().toLowerCase();

  // English folder names
  if (n === 'action')         return 'action';
  if (n === 'adventure')      return 'adventure';
  if (n === 'animation')      return 'animation';
  if (n === 'comedy')         return 'comedy';
  if (n === 'crime')          return 'crime';
  if (n === 'documentary')    return 'documentary';
  if (n === 'drama')          return 'drama';
  if (n === 'family')         return 'family';
  if (n === 'fantasy')        return 'fantasy';
  if (n === 'history')        return 'history';
  if (n === 'horror')         return 'horror';
  if (n === 'music')          return 'music';
  if (n === 'mystery')        return 'mystery';
  if (n === 'romance')        return 'romance';
  if (n === 'scifi' || n === 'sci-fi' || n === 'science fiction') return 'scifi';
  if (n === 'thriller')       return 'thriller';
  if (n === 'war')            return 'war';
  if (n === 'western')        return 'western';
  if (n === 'series')         return 'series';
  if (n === 'adult' || n === '+18') return 'adult';
  if (n === 'trailer')        return 'trailer';

  // Mongolian folder names
  if (n === 'экшн')           return 'action';
  if (n === 'адал явдал')     return 'adventure';
  if (n === 'анимэйшн')       return 'animation';
  if (n === 'инээдэм')        return 'comedy';
  if (n === 'гэмт хэрэг')     return 'crime';
  if (n === 'баримтат')       return 'documentary';
  if (n === 'драм')           return 'drama';
  if (n === 'гэр бүл')        return 'family';
  if (n === 'фэнтэзи')        return 'fantasy';
  if (n === 'түүх')           return 'history';
  if (n === 'аймшиг')         return 'horror';
  if (n === 'хөгжим')         return 'music';
  if (n === 'нууц')           return 'mystery';
  if (n === 'романтик')       return 'romance';
  if (n === 'шинжлэх ухаан')  return 'scifi';
  if (n === 'триллер')        return 'thriller';
  if (n === 'дайн')           return 'war';
  if (n === 'вестерн')        return 'western';
  if (n === 'цуврал' || n === 'барууны цуврал') return 'series';
  if (n === 'трейлер')        return 'trailer';

  // Тодорхойгүй бол нэрийг хэвээр буцаана (slug байдлаар)
  return n.replace(/\s+/g, '-');
}

/**
 * collectionId → categoryKey харьцааг бүтээнэ.
 * service.ts-ээс дуудаж өгнө.
 */
export function buildCollectionMap(
  collections: { guid: string; name: string }[]
): Map<string, string> {
  const map = new Map<string, string>();
  for (const col of collections) {
    map.set(col.guid, folderNameToCategory(col.name));
  }
  return map;
}

/**
 * Bunny видеог MongolMovie болгон хөрвүүлнэ.
 *
 * @param collectionMap  buildCollectionMap()-аас гарсан Map.
 *                       Байхгүй бол категорийг title-ээс таана (хуучин fallback).
 */
export function bunnyVideoToMovie(
  v: BunnyVideoListItem,
  collectionMap?: Map<string, string>
): MongolMovie {
  const libraryId = getBunnyLibraryId();

  // 1. Фолдерийн нэрээр категори тодорхойлно
  let category: string | undefined;
  if (collectionMap && v.collectionId) {
    category = collectionMap.get(v.collectionId);
  }

  // 2. Фолдер байхгүй бол title-ээс таана (хуучин аргыг fallback болгож үлдээнэ)
  if (!category) {
    category = guessCategoryFromTitle(v.title);
  }

  return {
    id: v.guid,
    name: v.title.split(' - ')[0].trim(),
    category,
    poster: bunnyThumbUrl(libraryId, v.guid, v.thumbnailFileName),
    preview: bunnyPreviewWebpUrl(libraryId, v.guid),
    iframe: bunnyEmbedUrl(libraryId, v.guid),
  };
}

/**
 * Хуучин title-ээс таах логик — фолдер олдохгүй үед fallback болно.
 */
function guessCategoryFromTitle(title: string): string {
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
