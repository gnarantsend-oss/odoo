import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,

  // 2026: Bundle optimization — lucide-react 1583→333 modules, recharts 1485→1317
  optimizePackageImports: [
    'lucide-react',
    'recharts',
    'embla-carousel-react',
    'embla-carousel-autoplay',
    'radix-ui',
  ],

  experimental: {
    cssChunking: 'strict',
    inlineCss: true,
  },

  images: {
    unoptimized: true,
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: 'https', hostname: 's4.anilist.co' },
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
};

export default nextConfig;
