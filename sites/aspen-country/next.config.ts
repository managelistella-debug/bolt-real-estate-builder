import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.figma.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    {
      protocol: "https",
      hostname: "*.supabase.co",
    },
    {
      protocol: "https",
      hostname: "*.hostingersite.com",
    },
    {
      protocol: "https",
      hostname: "**.wp.com",
    },
  ],
    unoptimized: true,
  },
};

export default nextConfig;
