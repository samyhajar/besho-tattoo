import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/**',
      },
      {
        protocol: 'https',
        hostname: 'bjjqoffogqzzkxygyrtr.supabase.co',
        port: '',
        pathname: '/storage/v1/object/**',
      },
    ],
    // Optimize image loading for better performance
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 300, // 5 minutes cache
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Add timeout and other optimizations
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
};

export default nextConfig;
