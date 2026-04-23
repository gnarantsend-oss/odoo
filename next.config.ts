import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  experimental: {
    // optimizePackageImports: lucide-react@0.475.0 болон radix-ui@1.x-д
    // туршигдсан — v1 руу upgrade хийхдээ заавал test хийх.
    // (Next.js Turbopack experimental feature)
    optimizePackageImports: ['lucide-react', 'radix-ui'],
  },

  images: {
    unoptimized: true,
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.BUNNY_CDN_HOSTNAME ?? 'vz-fc1e9b28-7da.b-cdn.net',
        pathname: '/**',
      },
    ],
  },

  // ── Security + Cache headers ─────────────────────────────────────────────
  async headers() {
    return [
      {
        // Статик Next.js chunk-ууд — 1 жил
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Нүүр хуудас — 5 минут CDN cache
        source: '/',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=120' },
        ],
      },
      {
        // Кино үзэх хуудас — 30 минут CDN cache (token 6 цаг хүчинтэй)
        source: '/mongol/watch/:id',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=1800, stale-while-revalidate=3600' },
        ],
      },
      {
        // Бүх хуудас — security headers
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
