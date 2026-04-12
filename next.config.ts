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
};

export default nextConfig;
