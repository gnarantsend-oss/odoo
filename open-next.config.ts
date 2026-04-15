import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache';
import { withRegionalCache } from '@opennextjs/cloudflare/overrides/incremental-cache/regional-cache';
import doShardedTagCache from '@opennextjs/cloudflare/overrides/tag-cache/do-sharded-tag-cache';
import doQueue from '@opennextjs/cloudflare/overrides/queue/do-queue';
import { purgeCache } from '@opennextjs/cloudflare/overrides/cache-purge/index';

/**
 * Smart Cache тохиргоо (2026-04-15 шинэчлэл):
 *
 *  1. withRegionalCache — Cloudflare edge (CF Cache API) дотор
 *     long-lived горимд кэш хадгалдаг. R2-с зөвхөн cache miss-д уншдаг.
 *     Монгол хэрэглэгч ойрын datacenter-с авна → хурдан.
 *
 *  2. r2IncrementalCache — ISR/SSG cache-ийн үндсэн хадгалах газар.
 *     Regional cache miss болбол R2-с авна.
 *
 *  3. doQueue — ISR revalidation request-уудыг давхардуулахгүй,
 *     нэг л background refresh хийнэ (Durable Objects Queue).
 *
 *  4. doShardedTagCache — revalidateTag / revalidatePath-ийн тулд
 *     tag → path харьцааг Durable Objects (SQLite) дотор хадгалдаг.
 *     Deploy болгонд R2 устгахын оронд зөвхөн tag-аар invalidate хийнэ.
 *
 *  5. purgeCache — revalidation болох үед CF edge cache-г автоматаар
 *     цэвэрлэнэ. Гар аргаар cache устгах шаардлагагүй болно.
 *
 *  6. enableCacheInterception — Cached ISR/SSG route-д NextServer-г
 *     бүрмөсөн тойрч гарна → cold start хурдасна.
 *
 * ─── On-demand revalidation дуудах жишээ ──────────────────────────────────
 *
 *   Шинэ кино нэмэх үед (бүх кино жагсаалт шинэчлэгдэнэ):
 *     POST https://narhantv.com/api/revalidate?secret=XXX&tag=movies
 *
 *   Тодорхой кино засварлах үед:
 *     POST https://narhantv.com/api/revalidate?secret=XXX&tag=movie-42
 *
 *   Бүх хуудас (layout өөрчлөгдвөл):
 *     POST https://narhantv.com/api/revalidate?secret=XXX&path=/
 *
 * ─── Кино хуудасны fetch-д tag тохируулах жишээ ──────────────────────────
 *
 *   // page.tsx дотор fetch дуудах үед:
 *   const data = await fetch('/api/movies', { next: { tags: ['movies'] } });
 *
 * ─────────────────────────────────────────────────────────────────────────
 */
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, {
    // long-lived: cache-д байвал шууд буцаана, дэвсгэрт R2-с шинэчилнэ
    mode: 'long-lived',
  }),
  queue: doQueue,
  // Tag-based invalidation: deploy болгонд R2 бүрэн устгахгүй
  tagCache: doShardedTagCache({ baseShardSize: 12 }),
  // revalidation болоход edge cache автоматаар цэвэрлэгдэнэ
  cachePurge: purgeCache({ type: 'direct' }),
  enableCacheInterception: true,
});
