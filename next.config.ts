import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow Next.js to optimise images imported from src/app/images/
    localPatterns: [
      { pathname: '/src/app/images/**' },
    ],
  },
};

export default nextConfig;
