import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: ['d.anekodot.lol', 'localhost', '127.0.0.1'],
  productionBrowserSourceMaps: true,
};

export default nextConfig;
