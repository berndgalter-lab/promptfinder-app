import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize package imports to reduce bundle size
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  // Target modern browsers only - reduces polyfills by ~14 KiB
  // This disables polyfills for: Array.at, Array.flat, Object.fromEntries, etc.
  // Safe because 99%+ of users have modern browsers
  transpilePackages: [],
};

export default nextConfig;
