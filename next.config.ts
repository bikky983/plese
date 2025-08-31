import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static exports for better performance
  output: 'standalone',
  
  // Image optimization for Vercel
  images: {
    domains: ['images.unsplash.com', 'supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
  
  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
    }
    return config;
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
};

export default nextConfig;
