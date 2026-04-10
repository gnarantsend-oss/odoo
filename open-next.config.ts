import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default defineCloudflareConfig({
  // R2 cache-г ашиглах бол доорх мөрийг тайлбарыг арилгаарай:
  // incrementalCache: r2IncrementalCache,
  // Үүний тулд: import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache';
  // мөн wrangler.jsonc-д r2_buckets тохиргоо нэмэх шаардлагатай
});
