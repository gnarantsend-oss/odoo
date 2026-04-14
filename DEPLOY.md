# Narhan TV — Deployment Guide

## Нэг удаа хийх зүйлүүд (Cloudflare Dashboard)

### 1. R2 Bucket үүсгэх
```bash
wrangler r2 bucket create narhan-cache
```

### 2. Cloudflare Workers Builds тохиргоо

Workers Builds → narhan TV project → Settings → Build:

| Талбар | Утга |
|---|---|
| **Build command** | `bun install && bun run ci:build` |
| **Deploy command** | `bun run ci:deploy` |

> ⚠️ `bun run deploy` нь local дээр ашиглана (build + deploy нэгт).
> CI/CD дээр `ci:build` / `ci:deploy` тусад нь ашигла — ингэснээр **build 2 дахин хийгдэхгүй**.

### 3. Build Variables (Cloudflare Workers Builds → Build Variables and secrets)

| Нэр | Төрөл | Тайлбар |
|---|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | Variable | Cloudflare dashboard дээд баруун буланд |
| `CLOUDFLARE_API_TOKEN` | Secret | wrangler-н ашигладаг token (R2 write эрхтэй) |
| `BUNNY_STREAM_TOKEN_KEY` | Secret | Bunny Stream → Security → Token key |
| `REVALIDATE_SECRET` | Secret | Дурын random string (`openssl rand -hex 32`) |

> `CLOUDFLARE_ACCOUNT_ID` болон `CLOUDFLARE_API_TOKEN` нь
> `bun run clear-cache` (R2 цэвэрлэх скрипт)-д шаардлагатай.

---

## Local дээр ажиллуулах

```bash
# Суулгах
bun install

# Dev server
bun dev        # http://localhost:9002

# Cloudflare Workers preview
bun run preview

# Production deploy (local-аас)
bun run deploy
```

---

## Хийсэн өөрчлөлтүүд (2026-04-14 шинэчлэл)

| Файл | Өөрчлөлт |
|---|---|
| `package.json` | `@types/node` v20→v22, `lucide-react` version pin, `ci:build`/`ci:deploy` script нэмсэн, `wrangler deploy` → `opennextjs-cloudflare deploy` |
| `tsconfig.json` | `jsx: preserve` → `jsx: react-jsx`, `.next/dev/types` include нэмсэн |
| `next.config.ts` | `optimizePackageImports` тайлбар нэмсэн |
| `scripts/clear-r2-cache.mjs` | `wrangler r2 object list` (байхгүй) → Cloudflare REST API |
| `wrangler.jsonc` | `compatibility_date` шинэчилсэн, DOQueueHandler тайлбар нэмсэн |
