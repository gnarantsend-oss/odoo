import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache';
import { withRegionalCache } from '@opennextjs/cloudflare/overrides/incremental-cache/regional-cache';
import doQueue from '@opennextjs/cloudflare/overrides/queue/do-queue';

/**
 * Smart Cache тохиргоо:
 *
 *  1. withRegionalCache — Cloudflare edge (CF Cache API) дотор
 *     30 мин хүртэл кэш хадгалдаг. R2-с зөвхөн cache miss-д л уншдаг.
 *     Монгол хэрэглэгч ойрын datacenter-с авна → хурдан.
 *
 *  2. r2IncrementalCache — ISR/SSG cache-ийн үндсэн хадгалах газар.
 *     Regional cache miss болбол R2-с авна.
 *
 *  3. doQueue — ISR revalidation request-уудыг давхардуулахгүй,
 *     нэг л background refresh хийнэ (Durable Objects Queue).
 *
 *  4. enableCacheInterception — Cached ISR/SSG route-д
 *     NextServer-г бүрмөсөн тойрч гарна → cold start хурдасна.
 */
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, {
    // long-lived: Cache-д байвал шууд буцаана, дэвсгэрт R2-с шинэчилнэ
    mode: 'long-lived',
    // Tag revalidation хийхэд edge cache-г автоматаар цэвэрлэнэ
    bypassTagCacheOnCacheHit: true,
  }),
  queue: doQueue,
  enableCacheInterception: true,
});
