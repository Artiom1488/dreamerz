import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["http://172.26.144.1:3000", "172.26.144.1"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev.dreamerz.net",
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
