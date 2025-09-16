import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i-store-lyart.vercel.app'],
  },

  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
