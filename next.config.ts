import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

// Cloudflare Workers-д local dev хийх үед binding-уудыг идэвхжүүлнэ
initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  images: {
    // Cloudflare Workers дээр Next.js built-in image optimization
    // дэмжигдэхгүй тул unoptimized: true байна
    unoptimized: true,
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's4.anilist.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
