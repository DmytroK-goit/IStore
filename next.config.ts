import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i-store-lyart.vercel.app', 'res.cloudinary.com'],
  },

  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
