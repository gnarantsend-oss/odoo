import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  cacheComponents: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    unoptimized: true,
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'vz-e6562a2b-a7e.b-cdn.net', pathname: '/**' },
      { protocol: 'https', hostname: 'tbinoukdsxxmbtzkghvj.supabase.co', pathname: '/**' },
      { protocol: 'https', hostname: 'lovingmoviesfr.com', pathname: '/**' },
    ],
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://vz-e6562a2b-a7e.b-cdn.net https://placehold.co https://tbinoukdsxxmbtzkghvj.supabase.co https://lovingmoviesfr.com",
      "frame-src https://vidsrc.icu https://iframe.mediadelivery.net",
      "connect-src 'self'",
      "media-src 'self' blob: https://vidsrc.icu",
      "worker-src 'self' blob:",
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: csp },
          {
            key: 'Link',
            value: '<https://iframe.mediadelivery.net>; rel=preconnect',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
