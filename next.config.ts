import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root to this project, not the parent home directory
    root: __dirname,
  },
  images: {
    // Serve AVIF first (50% smaller than WebP), then WebP, then original
    formats: ['image/avif', 'image/webp'],
    // Responsive breakpoints served to the browser
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
    // Aggressive caching — images rarely change
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
};

export default nextConfig;
