# 🎬 Narhan TV

Монгол кино үнэгүй үзэх streaming платформ. Next.js + Cloudflare Workers дээр бүтээгдсэн.

---

## ⚡ Tech Stack

| Хэрэгсэл | Хувилбар | Зориулалт |
|---|---|---|
| **Next.js** | ^16.2.3 | App Router, SSR / ISR |
| **React** | ^19.2.5 | UI |
| **TypeScript** | ^5 | Type safety |
| **Tailwind CSS** | ^4.2.2 | Styling |
| **Bun** | 1.3.12 | Package manager |
| **Cloudflare Workers** | — | Hosting |
| **OpenNext Cloudflare** | ^1.19.1 | Next.js → Workers adapter |
| **Cloudflare R2** | — | ISR cache storage |
| **Cloudflare Durable Objects** | — | Revalidation queue |
| **Bunny.net Stream** | — | Видео hosting |

---

## 📁 Folder бүтэц

```
odoo-main/
├── public/
│   ├── sw.js                    # Service Worker (offline cache)
│   ├── logo.svg
│   └── _headers                 # Cloudflare static asset headers
│
├── scripts/
│   └── clear-r2-cache.mjs       # Deploy-н өмнө R2 cache цэвэрлэх
│
├── src/
│   ├── app/
│   │   ├── page.tsx             # 🏠 Нүүр хуудас
│   │   ├── layout.tsx           # Root layout (font, footer, theme)
│   │   ├── globals.css          # CSS variables + theme-ууд
│   │   ├── loading.tsx          # Global loading UI
│   │   ├── error.tsx            # Global error UI
│   │   ├── robots.ts            # SEO robots.txt
│   │   ├── search/              # 🔍 Хайлтын хуудас
│   │   ├── watchlist/           # 📋 Үзэх жагсаалт
│   │   ├── mongol/watch/[id]/   # 🎬 Кино тоглуулагч (dynamic route)
│   │   ├── api/revalidate/      # 🔄 ISR on-demand revalidation
│   │   └── disclaimer|dmca|terms|privacy/  # Хууль эрхийн хуудсууд
│   │
│   ├── components/
│   │   ├── header.tsx           # Дээд navigation bar
│   │   ├── bottom-nav.tsx       # Mobile доод navigation
│   │   ├── mongol-tab.tsx       # 🎞 Кино grid (Hero + ангилалаар)
│   │   ├── theme-switcher.tsx   # Өнгөний theme сонгогч
│   │   ├── theme-provider.tsx   # Theme context
│   │   ├── disclaimer-modal.tsx # Анхааруулгын modal
│   │   ├── icons.tsx            # Custom icon-ууд
│   │   └── ui/                  # shadcn/ui базис компонентууд
│   │       ├── button.tsx
│   │       ├── badge.tsx
│   │       ├── scroll-area.tsx
│   │       └── alert-dialog.tsx
│   │
│   └── lib/
│       ├── types.ts             # MongolMovie type
│       ├── bunny/               # Bunny Stream API + mappers
│       ├── watchlist.ts         # localStorage watchlist
│       └── utils.ts             # cn() helper
│
├── next.config.ts
├── open-next.config.ts          # Cloudflare adapter (R2 cache)
├── wrangler.jsonc               # Cloudflare Worker тохиргоо
├── tsconfig.json
└── package.json
```

---

## 🔑 Environment Variables

**Cloudflare Dashboard → Workers → odoo → Settings → Variables**

```env
BUNNY_LIBRARY_ID=634549
BUNNY_CDN_HOSTNAME=vz-e6562a2b-a7e.b-cdn.net
BUNNY_STREAM_API_KEY=xxxxxxxxxxxxxxxxxxxx
REVALIDATE_SECRET=xxxxxxxxxxxxxxxxxxxx
```

---

## 🚀 Командууд

```bash
bun install          # Суулгах
bun dev              # Local http://localhost:9002
bun run preview      # Cloudflare Workers preview
bun run deploy       # Production deploy
bun run typecheck    # Type шалгах
bun run lint         # Lint шалгах
```

---

## 🔄 ISR Cache Revalidation

```bash
curl -X POST "https://narhantv.com/api/revalidate" \
  -H "Content-Type: application/json" \
  -d '{"secret": "REVALIDATE_SECRET утга", "path": "/"}'
```

---

## 📍 Юуг хаана засах вэ

| Хийх зүйл | Файл |
|---|---|
| Кино нэмэх / засах | Bunny Stream dashboard |
| Сайтын нэр, тайлбар | `src/app/layout.tsx` → `metadata` |
| Cache хугацаа | `src/app/page.tsx` → `revalidate` |
| Шинэ theme нэмэх | `src/app/globals.css` + `theme-switcher.tsx` |
| Ангилал нэмэх | `src/components/mongol-tab.tsx` → `CATEGORIES` |
| Cloudflare domain | `wrangler.jsonc` → `routes` |

---

## ⚙️ GitHub Actions — Auto Deploy

`.github/workflows/deploy.yml` файл үүсгэж дараахийг хуулна:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.3.12

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Type check
        run: bun run typecheck

      - name: Build (OpenNext Cloudflare)
        run: bun run ci:build
        env:
          BUNNY_LIBRARY_ID: ${{ secrets.BUNNY_LIBRARY_ID }}
          BUNNY_CDN_HOSTNAME: ${{ secrets.BUNNY_CDN_HOSTNAME }}
          BUNNY_STREAM_API_KEY: ${{ secrets.BUNNY_STREAM_API_KEY }}
          REVALIDATE_SECRET: ${{ secrets.REVALIDATE_SECRET }}

      - name: Deploy to Cloudflare
        run: bun run ci:deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

### GitHub Secrets тохируулах

**GitHub → Repository → Settings → Secrets and variables → Actions**

| Secret нэр | Утга |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token (Workers deploy эрхтэй) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| `BUNNY_LIBRARY_ID` | `634549` |
| `BUNNY_CDN_HOSTNAME` | `vz-e6562a2b-a7e.b-cdn.net` |
| `BUNNY_STREAM_API_KEY` | Bunny API key |
| `REVALIDATE_SECRET` | ISR secret |

> `main` branch-д push хийх бүрт автоматаар deploy болно.
