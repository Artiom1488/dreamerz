import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["http://172.26.144.1:3000", "172.26.144.1"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
