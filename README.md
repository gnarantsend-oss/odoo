# 🎬 Narhan TV

Монгол кино үнэгүй үзэх streaming платформ. Next.js дээр бүтээгдсэн бөгөөд Cloudflare Workers дээр deploy хийгдэнэ.

---

## ⚡ Tech Stack

| Хэрэгсэл | Хувилбар | Зориулалт |
|---|---|---|
| **Next.js** | ^16.2 | App Router, SSR / ISR |
| **React** | ^19.2 | UI |
| **TypeScript** | ^5 | Type safety |
| **Tailwind CSS** | ^4 | Styling |
| **Radix UI** | ^1.1 | Headless UI components |
| **Lucide React** | ^0.475 | Icon-ууд |
| **Bun** | 1.3.12 | Package manager + runtime |
| **Cloudflare Workers** | — | Hosting / Edge runtime |
| **OpenNext Cloudflare** | ^1.4 | Next.js → Workers adapter |
| **Wrangler** | latest | Cloudflare CLI |
| **Cloudflare R2** | — | ISR cache storage |
| **Cloudflare Durable Objects** | — | Revalidation queue |
| **Bunny.net Stream** | — | Видео hosting + token auth |

---

## 📁 Folder бүтэц

```
odoo-netflix/
├── public/
│   ├── sw.js                   # Service Worker (offline cache)
│   ├── logo.svg
│   └── _headers                # Cloudflare Pages headers
│
├── scripts/
│   └── clear-r2-cache.mjs      # Deploy-н өмнө R2 cache цэвэрлэх
│
├── src/
│   ├── app/                    # Next.js App Router хуудсууд
│   │   ├── page.tsx            # 🏠 Нүүр хуудас
│   │   ├── layout.tsx          # Root layout (font, footer, theme)
│   │   ├── globals.css         # CSS variables + theme-ууд
│   │   ├── loading.tsx         # Global loading UI
│   │   ├── error.tsx           # Global error UI
│   │   ├── robots.ts           # SEO robots.txt
│   │   │
│   │   ├── search/             # 🔍 Хайлтын хуудас
│   │   ├── watchlist/          # 📋 Үзэх жагсаалт
│   │   ├── mongol/watch/[id]/  # 🎬 Кино тоглуулагч (dynamic route)
│   │   │
│   │   ├── api/revalidate/     # 🔄 ISR on-demand revalidation endpoint
│   │   │
│   │   └── disclaimer|dmca|terms|privacy/   # Хууль эрхийн хуудсууд
│   │
│   ├── components/
│   │   ├── header.tsx          # Дээд navigation bar
│   │   ├── bottom-nav.tsx      # Mobile доод navigation
│   │   ├── mongol-tab.tsx      # 🎞 Кино grid (Hero + ангилалаар)
│   │   ├── theme-switcher.tsx  # Өнгөний theme сонгогч
│   │   ├── theme-provider.tsx  # Theme context
│   │   ├── disclaimer-modal.tsx# Анхааруулгын modal
│   │   ├── icons.tsx           # Custom icon-ууд
│   │   └── ui/                 # shadcn/ui базис компонентууд
│   │       ├── button.tsx
│   │       ├── badge.tsx
│   │       ├── scroll-area.tsx
│   │       └── alert-dialog.tsx
│   │
│   └── lib/
│       ├── mongol_movies.json  # 📦 Кинонуудын өгөгдөл (статик JSON)
│       ├── types.ts            # MongolMovie type тодорхойлолт
│       ├── bunny.ts            # Bunny Stream token signing логик
│       ├── watchlist.ts        # localStorage watchlist & continue-watching
│       └── utils.ts            # cn() helper (clsx + tailwind-merge)
│
├── next.config.ts              # Cache headers, security headers, зураг тохиргоо
├── open-next.config.ts         # Cloudflare adapter тохиргоо (R2 cache)
├── wrangler.jsonc              # Cloudflare Worker тохиргоо
├── tsconfig.json
├── postcss.config.mjs
└── package.json
```

---

## 🗂 Кино өгөгдөл

Бүх кинонуудын мэдээлэл **`src/lib/mongol_movies.json`** файлд хадгалагдана.

```ts
// src/lib/types.ts
type MongolMovie = {
  id: number;
  name: string;
  category: 'drama' | 'horror' | 'comedy' | 'trailer';
  poster: string;       // Зурагны URL (Bunny CDN)
  iframe?: string;      // Bunny Stream embed URL (нэг бүлэгт кино)
  preview?: string;     // Preview видео URL (Hero дээр autoplay)
  episodes?: {          // Олон ангит кинонд
    ep: number;
    title: string;
    iframe: string;
  }[];
};
```

**Кино нэмэх / засах:** `mongol_movies.json` файлд шинэ объект нэмнэ.

---

## 🔑 Environment Variables

`.env.local` файл үүсгэж дараах утгуудыг тохируулна:

```env
# Bunny Stream — Video Library → Security → Authentication Key
BUNNY_STREAM_TOKEN_KEY=xxxxxxxxxxxxxxxxxxxx

# ISR on-demand revalidation secret (өөрийн random string)
REVALIDATE_SECRET=xxxxxxxxxxxxxxxxxxxx
```

**Cloudflare дээр нэмэх:** Workers → odoo → Settings → Variables and Secrets

---

## 🎨 Themes

`src/app/globals.css` файлд 5 өнгөний theme байна. `data-theme` attribute-аар сонгогдоно.

| Theme | Нэр |
|---|---|
| `crimson` | Улаан (default) |
| `abyss` | Хар цэнхэр |
| `aurora` | Ногоон |
| `ember` | Шар улбар |
| `forest` | Ойн ногоон |

**Шинэ theme нэмэх:** `globals.css` дотор `[data-theme="шинэ-нэр"]` block нэмж, `theme-switcher.tsx`-д жагсаалтад оруулна.

---

## 🚀 Хэрхэн ажиллуулах

### 1. Суулгах
```bash
bun install
```

### 2. Local дээр ажиллуулах
```bash
bun dev        # http://localhost:9002
```

### 3. Cloudflare Workers дээр preview хийх
```bash
bun run preview
```

### 4. Production deploy
```bash
bun run deploy
```
> `deploy` = OpenNext build → R2 cache цэвэрлэх → Wrangler deploy

---

## 🔄 ISR Cache Revalidation

Кино өгөгдөл өөрчлөгдөхөд кэш шинэчлэх:

```bash
curl -X POST "https://narhantv.com/api/revalidate" \
  -H "Content-Type: application/json" \
  -d '{"secret": "REVALIDATE_SECRET утга", "path": "/"}'
```

---

## 📍 Хаана юу засах вэ

| Хийх зүйл | Файл |
|---|---|
| Кино нэмэх / засах / устгах | `src/lib/mongol_movies.json` |
| Сайтын нэр, тайлбар өөрчлөх | `src/app/layout.tsx` → `metadata` |
| Нүүр хуудасны cache хугацаа | `next.config.ts` → headers, `src/app/page.tsx` → `revalidate` |
| Видео token-н хүчинтэй хугацаа | `src/lib/bunny.ts` → `expiresInSeconds` |
| Шинэ theme нэмэх | `src/app/globals.css` + `src/components/theme-switcher.tsx` |
| Footer текст өөрчлөх | `src/app/layout.tsx` → `Footer` component |
| Ангилал нэмэх | `src/components/mongol-tab.tsx` → `CATEGORIES` array |
| Cloudflare domain өөрчлөх | `wrangler.jsonc` → `routes` |
| Service Worker cache тохиргоо | `public/sw.js` |
