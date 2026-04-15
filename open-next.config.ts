import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import { withRegionalCache } from '@opennextjs/cloudflare/overrides/cache';

/**
 * Regional Cache идэвхжүүлсэн — энэ л хамгийн чухал засвар.
 *
 * withRegionalCache:
 *   - ISR/SSR хариуг Cloudflare Edge Cache API-д хадгалдаг
 *   - Дараагийн request тэр PoP-оос шууд хариу авна (R2/D1 дуудалт байхгүй)
 *   - Монгол хэрэглэгч ойрын datacenter-с авна → маш хурдан
 *
 * Хэрэв withRegionalCache import алдаа гарвал (@opennextjs/cloudflare version):
 *   defineCloudflareConfig({}) гэж буцааж хасаад, wrangler.jsonc-д
 *   cache_api_enabled: true нэмж болно.
 */
export default defineCloudflareConfig({
  default: {
    incrementalCache: withRegionalCache,
  },
});
