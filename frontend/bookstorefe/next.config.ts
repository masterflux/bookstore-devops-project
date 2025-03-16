import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['m.media-amazon.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_CART_URL: process.env.NEXT_PUBLIC_CART_URL || 'http://cartservice:3002',
    NEXT_PUBLIC_CATALOG_URL: process.env.NEXT_PUBLIC_CATALOG_URL || 'http://catalogservice:3001',
  },
};

export default nextConfig;
