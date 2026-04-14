# 🎬 Narhan TV

Монгол кино үнэгүй үзэх streaming платформ. Next.js дээр бүтээгдсэн бөгөөд Cloudflare Workers дээр deploy хийгдэнэ.

---

## ⚡ Tech Stack — Хурдан харах

| Хэрэгсэл | Хувилбар | Зориулалт |
|---|---|---|
| **Next.js** | ^16.2.3 | App Router, SSR / ISR |
| **React** | ^19.2.5 | UI |
| **TypeScript** | ^5.9 | Type safety |
| **Tailwind CSS** | ^4.2.2 | Styling |
| **Radix UI** | ^1.1.3 | Headless UI components |
| **Lucide React** | 0.475.0 | Icon-ууд |
| **Bun** | 1.3.12 | Package manager + runtime |
| **Cloudflare Workers** | — | Hosting / Edge runtime |
| **OpenNext Cloudflare** | ^1.19.1 | Next.js → Workers adapter |
| **Wrangler** | ^4.82.0 | Cloudflare CLI |
| **Cloudflare R2** | — | ISR cache storage |
| **Cloudflare Durable Objects** | — | Revalidation queue |
| **Bunny.net Stream** | — | Видео hosting + token auth |

---

## 📦 Dependencies — Дэлгэрэнгүй

### 🔵 Үндсэн санг (dependencies)

---

#### `next` — ^16.2.3
**Next.js 16** бол энэ апп-н гол framework. App Router архитектур дээр суурилсан.

Ашиглаж буй боломжууд:
- **App Router** — `src/app/` доторх бүх `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` файлууд App Router-н convention дагуу зохион байгуулагдсан
- **`next/font/google`** — `layout.tsx`-д Outfit фонт Google Fonts-с татагдаж, `--font-outfit` CSS variable-р бэлэн болно. `display: 'swap'` + `preload: true` тохиргоотой тул CLS (layout shift) хамгийн бага
- **`next/link`** — Client-side navigation. `<Footer>`, `<Header>`, `<BottomNav>` бүгд ашиглана
- **`Metadata` API** — `layout.tsx`-д `title.template`, `description`, `icons` тохируулсан
- **ISR (Incremental Static Regeneration)** — Кино хуудсуудыг build-д statically render хийж, background-д шинэчилнэ. `revalidate` export-оор хугацааг зохицуулна
- **`next/image`** — `images.unoptimized: true` + `remotePatterns` тохиргоогоор Bunny CDN зурагнуудыг зөвшөөрнө
- **Server Components** — `src/app/mongol/watch/[id]/page.tsx` болон бусад page-ууд Server Component байж, Bunny token signing (`signMovieIframes`) серверт хийнэ — клиент хэзээ ч raw auth key харахгүй
- **`usePathname`** — `<BottomNav>` `/mongol/watch/...` дээр байвал navigate bar нуудаг

> **Аюулгүй байдал:** CVE-2026-23869 (request smuggling via http-proxy) patch нь ^16.2.3-д багтсан.

---

#### `react` + `react-dom` — ^19.2.5
React 19.2.5 — UI бүтээх үндсэн сан.

Ашиглаж буй боломжууд:
- **`useState`** — `<Header>` scroll state, `<MongolPlayer>` тоглуулж буй анги, `<ThemeSwitcher>` dropdown нээлт/хаалт
- **`useEffect`** — `<Header>` scroll listener, `<MongolPlayer>` localStorage-с continue watching унших
- **`useRef`** — `<MongolPlayer>` iframe ref (дараагийн ангид auto-scroll)
- **`useCallback`** — `<MongolPlayer>` handler function memorization
- **`Suspense`** — `layout.tsx`-д `<BottomNav>`-г Suspense-р wrap хийсэн тул `usePathname` SSR-д алдаа өгдөггүй
- **`forwardRef`** — `<Button>`, `<ScrollArea>`, `<AlertDialog>` зэрэг shadcn/ui компонентуудад ref forwarding
- **Server Components** — React 19-н RSC (React Server Components) Next.js 16 App Router-тай хамтран ажиллана

> **Аюулгүй байдал:** CVE-2025-55182 (CVSS 10.0 RCE via Server Actions) → 19.2.1-д patch. CVE-2026-23864 (DoS via memory exhaustion) → 19.2.4-д patch. ^19.2.5 хоёуланг нь агуулна.

---

#### `tailwind-merge` — ^3.0.1
Tailwind class нэгтгэх utility. Зөрчилтэй class-уудыг (жишээ нь `p-2` + `p-4`) зөв шийдэж, сүүлийнхийг үлдээнэ.

`src/lib/utils.ts`-д `cn()` helper функцын хагас нь:
```ts
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

`cn()` нь апп бүх компонентод ашиглагдаж, conditional + override class-уудыг аюулгүй нэгтгэнэ. Tailwind v4.0–v4.2-тай бүрэн нийцтэй.

---

#### `clsx` — ^2.1.1
Conditional className бүтээх utility. `cn()`-н нөгөө хагас:
```ts
import { clsx, type ClassValue } from 'clsx'
// cn('base', isActive && 'active', { hidden: !show })
```
`clsx` нь falsy утгуудыг шүүж, `tailwind-merge`-д цэвэр жагсаалт өгнө.

---

#### `class-variance-authority` — ^0.7.1
Type-safe UI component variant систем. **`cva()`** функцоор base class + variant-уудыг нэг дор тодорхойлно.

`src/components/ui/button.tsx`-д:
```ts
const buttonVariants = cva("inline-flex items-center ...", {
  variants: {
    variant: { default: "bg-primary ...", destructive: "bg-destructive ...", ghost: "hover:bg-accent ..." },
    size:    { default: "h-10 px-4", sm: "h-9 px-3", lg: "h-11 px-8", icon: "h-10 w-10" },
  },
  defaultVariants: { variant: "default", size: "default" }
})
```

`src/components/ui/badge.tsx`-д мөн адил `badgeVariants` тодорхойлогдсон.  
TypeScript `VariantProps<typeof buttonVariants>` type-р компонентын props автоматаар шалгагдана.

---

#### `radix-ui` — ^1.1.3
Accessibility-first headless UI primitives. 2026 оны 2 сараас нэгдсэн `radix-ui` package болсон (өмнө нь тусдаа `@radix-ui/react-*` package-ууд байсан).

Ашиглаж буй primitives:

| Primitive | Файл | Зориулалт |
|---|---|---|
| `AlertDialog` | `src/components/ui/alert-dialog.tsx` | Disclaimer modal (анхааруулга баталгаажуулах) |
| `ScrollArea` | `src/components/ui/scroll-area.tsx` | Custom scrollbar бүхий scroll container |
| `Slot` (`Slot.Root`) | `src/components/ui/button.tsx` | `asChild` prop — `<Button asChild>` нь `<a>` tag болдог |

Radix UI нь keyboard navigation, ARIA roles, focus management бүгдийг автоматаар хангадаг тул хэрэглэгч нэмэлт код бичих шаардлагагүй.

---

#### `lucide-react` — 0.475.0
SVG icon сан. **Яагаад pin хийсэн бэ:** v1.x breaking changes агуулдаг тул 0.x-д тогтоосон.

Одоогоор ашиглаж буй icon-ууд:

| Icon | Файл | Байрлал |
|---|---|---|
| `Home` | `bottom-nav.tsx` | Нүүр хуудасны tab |
| `Film` | `bottom-nav.tsx` | Кино tab |
| `Search` | `bottom-nav.tsx` | Хайлт tab |
| `ChevronLeft` | `mongol-player.tsx` | Өмнөх анги товч |
| `ChevronRight` | `mongol-player.tsx` | Дараагийн анги товч |
| `X` | `mongol-player.tsx` | Тоглуулагч хаах товч |
| `Loader2` | `mongol-player.tsx` | Iframe ачааллах spinner |

`next.config.ts`-д `optimizePackageImports: ['lucide-react']` тохируулсан тул ашиглаагүй icon-ууд bundle-д ордоггүй.

---

#### `tw-animate-css` — ^1.3.4
Tailwind v4-тэй нийцтэй CSS animation сан. `src/app/globals.css`-д `@import "tw-animate-css"` оруулсан.

`globals.css`-д тодорхойлсон custom animation-ууд:

| Animation | Класс | Хаана хэрэглэгддэг |
|---|---|---|
| `accordion-down / up` | `data-[state=open/closed]` | Radix AlertDialog-н нээлт/хаалт |
| `shimmer` | `animate-[shimmer]` | Skeleton loading effect |
| `fadeUp` | `animate-[fadeUp]` | Кино картны fade-in |
| `heroZoom` | `animate-[heroZoom]` | Hero poster zoom-out effect |
| `scaleIn` | `animate-[scaleIn]` | Элемент scale-in |

---

### 🔧 DevDependencies

---

#### `tailwindcss` — ^4.2.2
**Tailwind CSS v4** — CSS-first тохиргооны шинэ систем. Tailwind config файл (`tailwind.config.ts`) байхгүй — бүх тохиргоо `src/app/globals.css` дотор `@theme inline { ... }` блокоор хийгдсэн.

Гол онцлогууд энэ апп-д:
- `@custom-variant dark (&:is(.dark *))` — class-based dark mode
- `--color-*` CSS variables `@theme`-д холбогдсон тул `bg-background`, `text-primary` гэх мэт utility class-ууд ажиллана
- `--font-sans: var(--font-outfit)` — Google Font CSS variable-тай холбоо

---

#### `@tailwindcss/postcss` — ^4.2.2
Tailwind v4-н PostCSS plugin. `postcss.config.mjs`-д:
```js
const config = { plugins: { "@tailwindcss/postcss": {} } }
```
Next.js build pipeline-д CSS боловсруулалт хийнэ. Tailwind v3-н `tailwindcss` + `autoprefixer` хосоор байсан нь v4-д энэ нэг plugin-р орлогдсон.

---

#### `@opennextjs/cloudflare` — ^1.19.1
Next.js апп-г Cloudflare Workers дээр ажиллуулах adapter. `opennextjs-cloudflare build` команд нь `next build`-н output-г Workers-н `worker.js` болгон хувиргана.

`open-next.config.ts`-д тохируулсан:

```ts
defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, {
    mode: 'long-lived',
    bypassTagCacheOnCacheHit: true,
  }),
  queue: doQueue,
  enableCacheInterception: true,
})
```

| Тохиргоо | Зориулалт |
|---|---|
| `r2IncrementalCache` | ISR cache-г Cloudflare R2-д хадгална |
| `withRegionalCache` | CF Cache API-д edge дээр 30 мин cache хийнэ — R2 miss нэмэгдэхгүй |
| `doQueue` | Durable Objects-р revalidation давхардахгүй болгоно |
| `enableCacheInterception` | Cache hit үед NextServer-г бүрмөсөн тойрч гарна — cold start алга |

---

#### `wrangler` — ^4.82.0
Cloudflare Workers CLI. `devDependencies`-д байгаа тул `npx` бус `bun run` командуудаар дуудагдана.

Ашиглаж буй командууд:

| Команд | Script | Зориулалт |
|---|---|---|
| `wrangler dev` | (internal) | OpenNext preview-д дотор ашиглана |
| `wrangler deploy` | (internal) | OpenNext deploy-д дотор ашиглана |
| `wrangler types` | `cf-typegen` | `env.d.ts` үүсгэж CloudflareEnv type гаргана |

`wrangler.jsonc`-д `compatibility_date: "2026-04-14"` + `nodejs_compat` flag тохируулсан.

> **Яагаад `"latest"` биш бэ:** Wrangler нь маш олон давтамжтай (хэдэн өдөрт нэг удаа) шинэчлэгддэг. CI/CD-д `latest` ашигловол build-ийн behavior өдөр бүр өөр болж болно. `^4.82.0` нь patch update-уудыг авах боловч major/minor breaking change-с хамгаалагдана.

---

#### `typescript` — ^5.9
TypeScript compiler. `tsconfig.json`-д `strict: true` идэвхтэй. `noEmit: true` тул зөвхөн type check хийнэ, бодит compile нь Next.js/Bun хийнэ.

Гол тохиргоо:
- `moduleResolution: "bundler"` — Next.js 16 + Bun-тай нийцтэй
- `jsx: "react-jsx"` — React 17+ automatic JSX runtime
- `paths: { "@/*": ["./src/*"] }` — `@/components/...` import alias
- `plugins: [{ name: "next" }]` — Next.js TypeScript plugin (type-safe route params)

> **TypeScript 6.0.2** available боловч `baseUrl` + `moduleResolution: bundler` зэрэг deprecated option-уудыг зааж өгч болзошгүй — `^5` range нь 6.x руу автоматаар upgrade хийхгүй тул аюулгүй.

---

#### `postcss` — ^8
CSS post-processing tool. `@tailwindcss/postcss` plugin-г ажиллуулах гол process. Next.js нь `postcss.config.mjs` файлыг автоматаар уншина.

---

#### `@types/node` — ^22
Node.js API-н TypeScript type definitions. `src/lib/bunny.ts`-д:
```ts
import crypto from 'crypto'; // Node.js crypto module
```
`crypto.createHash('sha256')` — Bunny Stream token signing дээр ашиглана. `^22` нь Node.js 22 LTS API-тай тохирно.

---

#### `@types/react` + `@types/react-dom` — ^19
React 19-н TypeScript type definitions. `JSX.Element`, `React.ReactNode`, `React.forwardRef`, `React.ComponentPropsWithoutRef` зэрэг type-ууд энд байна.

---

### 🏃 Runtime

#### `bun` — 1.3.12 (packageManager)
Package manager болон runtime. `package.json`-д `"packageManager": "bun@1.3.12"` гэж pin хийснээр `corepack`-р яг энэ версийг ашиглахыг баталгаажуулна.

Яагаад Bun:
- `bun install` — npm-с 25-30x хурдан суулгалт
- TypeScript + JSX native дэмжлэг (tsc шаардахгүй)
- `scripts/clear-r2-cache.mjs` болон бусад `.mjs` script-уудыг шууд ажиллуулна
- `bunfig.toml`-д `saveTextLockfile = false` — binary lockfile ашиглана (хурдан)

---

### ☁️ Гадаад үйлчилгээ (npm package биш)

#### Cloudflare Workers
Next.js апп-н edge runtime. `wrangler.jsonc`-д:
- `compatibility_flags: ["nodejs_compat", "global_fetch_strictly_public"]` — Node.js API + аюулгүй fetch
- `assets.directory: ".open-next/assets"` — статик файл serving
- `routes: [{ pattern: "narhantv.com", custom_domain: true }]`

#### Cloudflare R2
ISR (Incremental Static Regeneration) cache хадгалах object storage. `NEXT_INC_CACHE_R2_BUCKET` binding-р холбогдсон. Deploy-н өмнө `scripts/clear-r2-cache.mjs` автоматаар цэвэрлэнэ.

#### Cloudflare Durable Objects
ISR revalidation queue. `DOQueueHandler` class нь ижил route-н revalidation request-уудыг нэгтгэж, зөвхөн нэг background refresh хийнэ. `wrangler.jsonc`-д `new_sqlite_classes` migration-р үүссэн.

#### Bunny.net Stream
Видео hosting + token authentication. `src/lib/bunny.ts`-д HMAC-SHA256 token signing хийгдэнэ:
```
token = SHA256(BUNNY_STREAM_TOKEN_KEY + videoGuid + expires)
```
Token 6 цаг хүчинтэй. Cloudflare edge 30 мин cache хийснээр ижил token дахин ашиглагдана.

---

## 📁 Folder бүтэц

```
odoo-main/
├── public/
│   ├── sw.js                   # Service Worker (offline cache)
│   ├── logo.svg
│   └── _headers                # Cloudflare static asset headers
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
│   │       ├── button.tsx      # cva variants + Radix Slot asChild
│   │       ├── badge.tsx       # cva variants
│   │       ├── scroll-area.tsx # Radix ScrollArea primitive
│   │       └── alert-dialog.tsx# Radix AlertDialog primitive
│   │
│   └── lib/
│       ├── mongol_movies.json  # 📦 Кинонуудын өгөгдөл (статик JSON)
│       ├── types.ts            # MongolMovie type тодорхойлолт
│       ├── bunny.ts            # Bunny Stream token signing логик
│       ├── watchlist.ts        # localStorage watchlist & continue-watching
│       ├── banners.ts          # Banner/hero зургуудын жагсаалт
│       └── utils.ts            # cn() helper (clsx + tailwind-merge)
│
├── next.config.ts              # Cache headers, security headers, зураг тохиргоо
├── open-next.config.ts         # Cloudflare adapter тохиргоо (R2 cache)
├── wrangler.jsonc              # Cloudflare Worker тохиргоо
├── tsconfig.json
├── postcss.config.mjs
├── bunfig.toml                 # Bun тохиргоо (binary lockfile)
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
