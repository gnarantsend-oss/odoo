import crypto from 'crypto';

/**
 * Bunny Stream — Token Authentication
 * Docs: https://docs.bunny.net/docs/stream-embed-token-authentication
 *
 * Token = SHA256( AuthKey + VideoGuid + Expires ) → HEX
 * Signed URL: https://iframe.mediadelivery.net/embed/{lib}/{guid}?token={token}&expires={ts}
 *
 * Env var: BUNNY_STREAM_TOKEN_KEY  (Video Library → Security → Authentication Key)
 */
export function signBunnyIframe(iframeSrc: string, expiresInSeconds = 21600): string {
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

export function signMovieIframes<T extends { iframe?: string; episodes?: { iframe: string }[] }>(
  movie: T,
  expiresInSeconds = 21600,
): T {
  return {
    ...movie,
    iframe: movie.iframe ? signBunnyIframe(movie.iframe, expiresInSeconds) : movie.iframe,
    episodes: movie.episodes?.map((ep) => ({
      ...ep,
      iframe: signBunnyIframe(ep.iframe, expiresInSeconds),
    })),
  };
}

