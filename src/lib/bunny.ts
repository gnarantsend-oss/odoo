import crypto from 'crypto';
import type { MongolMovie } from '@/lib/types';

/**
 * Bunny Stream — Token Authentication
 * Docs: https://docs.bunny.net/docs/stream-embed-token-authentication
 *
 * Token = SHA256( AuthKey + VideoGuid + Expires ) → HEX
 * Signed URL: https://iframe.mediadelivery.net/embed/{lib}/{guid}?token={token}&expires={ts}
 *
 * Env var: BUNNY_STREAM_TOKEN_KEY  (Video Library → Security → Authentication Key)
 *
 * 500k хэрэглэгчид зориулсан тохиргоо:
 * - Token 6 цаг хүчинтэй (Cloudflare edge 30 мин cache + аюулгүй зай)
 * - Cloudflare edge cache нь ижил токентой хуудсыг 30 мин дахин ашиглана
 */
export function signBunnyIframe(
  iframeSrc: string,
  expiresInSeconds = 21600, // 6 цаг (6 * 60 * 60)
): string {
  const authKey = process.env.BUNNY_STREAM_TOKEN_KEY;

  // Key тохируулаагүй бол оригинал URL (dev mode)
  if (!authKey) return iframeSrc;

  // URL-с videoGuid задална: /embed/{libraryId}/{videoGuid}
  const match = iframeSrc.match(/\/embed\/(\d+)\/([a-f0-9-]{36})/i);
  if (!match) return iframeSrc;

  const videoGuid = match[2];
  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;

  const token = crypto
    .createHash('sha256')
    .update(authKey + videoGuid + expires)
    .digest('hex');

  const url = new URL(iframeSrc);
  url.searchParams.set('token', token);
  url.searchParams.set('expires', String(expires));

  return url.toString();
}

/**
 * Movie объектын бүх iframe URL-ийг sign хийнэ
 */
export function signMovieIframes<
  T extends { iframe?: string; episodes?: { iframe: string }[] },
>(movie: T, expiresInSeconds = 21600): T {
  return {
    ...movie,
    iframe: movie.iframe
      ? signBunnyIframe(movie.iframe, expiresInSeconds)
      : movie.iframe,
    episodes: movie.episodes?.map((ep) => ({
      ...ep,
      iframe: signBunnyIframe(ep.iframe, expiresInSeconds),
    })),
  };
}

// ── Bunny Stream API (Video list) ──────────────────────────────────────────────
type BunnyVideoListItem = {
  guid: string;
  title: string;
  videoLibraryId?: number;
  thumbnailFileName?: string | null;
  collectionId?: string | null;
};

type BunnyVideoDetail = BunnyVideoListItem & {
  length?: number;
  status?: number;
};

type BunnyPaginated<T> = {
  items?: T[];
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
};

function getBunnyLibraryId(): string {
  return process.env.BUNNY_LIBRARY_ID || '12345';
}

function getBunnyApiKey(): string | undefined {
  return process.env.BUNNY_STREAM_API_KEY;
}

function getBunnyCdnHostname(libraryId: string): string {
  // Bunny dashboard дээр "CDN hostname" гэж гардаг (ж: vz-e6562a2b-a7e.b-cdn.net)
  // Тохируулаагүй бол хуучин хэв маягийн vz-{libraryId}.b-cdn.net гэж үзнэ.
  return process.env.BUNNY_CDN_HOSTNAME || `vz-${libraryId}.b-cdn.net`;
}

function bunnyThumbUrl(libraryId: string, guid: string, thumbnailFileName?: string | null) {
  const file = thumbnailFileName || 'thumbnail.jpg';
  // Bunny Stream storage structure: https://docs.bunny.net/docs/stream-video-storage-structure
  const host = getBunnyCdnHostname(libraryId);
  return `https://${host}/${guid}/${file}`;
}

function bunnyEmbedUrl(libraryId: string, guid: string) {
  return `https://iframe.mediadelivery.net/embed/${libraryId}/${guid}`;
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
    iframe: bunnyEmbedUrl(libraryId, v.guid),
  };
}

export async function getBunnyVideos(opts?: {
  page?: number;
  itemsPerPage?: number;
  search?: string;
  orderBy?: string;
}): Promise<BunnyVideoListItem[]> {
  const libraryId = getBunnyLibraryId();
  const apiKey = getBunnyApiKey();
  if (!apiKey) {
    // Production дээр энэ алдаа гарах ёсгүй — Cloudflare Secrets дээр тохируулна.
    throw new Error('Missing env: BUNNY_STREAM_API_KEY');
  }
  if (!process.env.BUNNY_LIBRARY_ID) {
    // Түр fallback (12345) нь ихэнхдээ 401/404 үүсгэдэг → алдааг ил гаргана
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
    // Next.js App Router cache control (SSR/ISR friendly)
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

export async function getMongolMoviesFromBunny(): Promise<MongolMovie[]> {
  const videos = await getBunnyVideos({ itemsPerPage: 100 });
  // UI нь categories-ээр grouped; бүх видео "drama" гэж очвол ч ажиллана
  return videos.map(bunnyVideoToMovie);
}
