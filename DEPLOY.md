# Narhan TV — Deployment Guide

## Нэг удаа хийх зүйлүүд (Cloudflare Dashboard)

### 1. R2 Bucket үүсгэх
```bash
wrangler r2 bucket create narhan-cache
```

### 2. Dependencies шинэчлэх
```bash
bun install
```

### 3. Deploy
```bash
bun run deploy
```

---

## Хийсэн өөрчлөлтүүд

| Файл | Өөрчлөлт |
|---|---|
| `package.json` | React 18 → 19.2, patch-package устгасан |
| `next.config.ts` | CSP, Permissions-Policy, XSS-Protection нэмсэн |
| `open-next.config.ts` | R2 incremental cache идэвхжүүлсэн |
| `wrangler.jsonc` | R2 bucket нэмсэн, service name зассан |
| `wrangler.toml` | compatibility_date шинэчилсэн, R2 нэмсэн |
| `src/instrumentation.ts` | Шинэ — server error logging |
| `public/sw.js` | 3rd party ad SW → өөрийн cache SW |
| `src/app/api/vast/` | Устгасан (реклам байхгүй) |

## Environment Variables (.env.local)

```env
TMDB_API_KEY=your_tmdb_api_key_here
```
