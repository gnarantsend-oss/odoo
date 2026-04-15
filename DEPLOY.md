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
> `bun run clear-cache` (гар аргаар R2 цэвэрлэх скрипт)-д шаардлагатай.
> CI/CD deploy-д **ашиглагдахгүй** — зөвхөн онцгой тохиолдолд.

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

## Cache шинэчлэлт (deploy шаардлагагүй)

Шинэ кино нэмэх эсвэл засварлах үед **deploy хийхгүйгээр** cache шинэчлэх:

```bash
# Бүх кино жагсаалт шинэчлэх
curl -X POST "https://narhantv.com/api/revalidate?secret=YOUR_SECRET&tag=movies"

# Тодорхой кино шинэчлэх (id=42 гэж үзвэл)
curl -X POST "https://narhantv.com/api/revalidate?secret=YOUR_SECRET&tag=movie-42"

# Бүх хуудас (layout өөрчлөгдвөл)
curl -X POST "https://narhantv.com/api/revalidate?secret=YOUR_SECRET&path=/"
```

> `YOUR_SECRET` = Cloudflare-д тохируулсан `REVALIDATE_SECRET` утга.

---

## Cache бүрэн цэвэрлэх (онцгой тохиолдол)

Зөвхөн cache бүрэн эвдэрсэн эсвэл томоохон өөрчлөлт хийгдсэн үед:

```bash
CLOUDFLARE_ACCOUNT_ID=xxx CLOUDFLARE_API_TOKEN=xxx bun run clear-cache
```

**Энгийн deploy-д ашиглахгүй.** Ердийн deploy-д R2 cache хэвээр үлддэг,
зөвхөн `revalidateTag` / `revalidatePath`-аар шаардлагатай хэсэг шинэчлэгдэнэ.

---

## Хийсэн өөрчлөлтүүд

| Огноо | Файл | Өөрчлөлт |
|---|---|---|
| 2026-04-14 | `package.json` | `@types/node` v20→v22, `ci:build`/`ci:deploy` нэмэгдсэн |
| 2026-04-14 | `wrangler.jsonc` | `compatibility_date` шинэчлэгдсэн |
| 2026-04-15 | `package.json` | `deploy` / `ci:deploy`-с `clear-cache` хасагдсан |
| 2026-04-15 | `open-next.config.ts` | `doShardedTagCache` + `purgeCache` нэмэгдсэн |
| 2026-04-15 | `wrangler.jsonc` | `DOShardedTagCache`, `BucketCachePurge` DO binding нэмэгдсэн (v2 migration) |
