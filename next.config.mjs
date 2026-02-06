import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Если хочешь пропустить ошибки типов при билде (крайний случай)
    // ignoreBuildErrors: true, 
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
