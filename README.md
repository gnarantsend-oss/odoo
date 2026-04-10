# MZtv

Anime, Manga, Movies болон Монгол киног үздэг Next.js 15 + Cloudflare Workers дээр ажилладаг стриминг платформ.

## Технологи

- **Next.js 15** (App Router)
- **Cloudflare Workers** via `@opennextjs/cloudflare`
- **AniList GraphQL API** — Anime / Manga
- **TMDB API** — Кино / TV шоу
- **Tailwind CSS + shadcn/ui**

## Эхлүүлэх

### 1. Суулгах
```bash
npm install
```

### 2. Орчны хувьсагч тохируулах
```bash
cp .env.example .env.local
```
`.env.local` файлд TMDB key-ээ оруулна (https://www.themoviedb.org/settings/api):
```
TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_SITE_URL=https://mztv.mn
```

### 3. Local dev
```bash
npm run dev        # http://localhost:9002
npm run preview    # Cloudflare Workers runtime-д туршина
```

## Cloudflare Deploy

```bash
npx wrangler login
npm run deploy
```

**GitHub Actions → Workers Builds тохиргоо:**
- Build command: `npx @opennextjs/cloudflare build`
- Environment variable: `TMDB_API_KEY` (encrypt хийж нэмэх)
