import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  // Unused imports, console.log-г production-д хасна
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Bundle-г задлаад analyze хийх (debug үед)
  // bundleAnalyzer хэрэглэхэд: ANALYZE=true bun run build

  experimental: {
    // React compiler — auto-memo, re-render багасгана
    reactCompiler: true,
    // Package-уудыг optimize хийж import хэмжээг багасгана
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'embla-carousel-react',
      'embla-carousel-autoplay',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
    ],
  },

  images: {
    unoptimized: true,
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: 'https', hostname: 's4.anilist.co', pathname: '/**' },
      { protocol: 'https', hostname: 'image.tmdb.org', pathname: '/**' },
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'm.media-amazon.com', pathname: '/**' },
      { protocol: 'https', hostname: 'vz-e6562a2b-a7e.b-cdn.net', pathname: '/**' },
    ],
  },

  // HTTP headers — бүх response-д нэмэгдэнэ
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Preconnect гол domain-уудтай холбогдож бэлдэнэ
          {
            key: 'Link',
            value: [
              '<https://s4.anilist.co>; rel=preconnect',
              '<https://image.tmdb.org>; rel=preconnect',
              '<https://iframe.mediadelivery.net>; rel=preconnect',
            ].join(', '),
          },
        ],
      },
      {
        // API route-уудыг cache хийхгүй
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache' },
        ],
      },
      {
        // Mongol movies JSON — 1 цаг cache
        source: '/mongol_movies.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
    ];
  },
};

export default nextConfig;
