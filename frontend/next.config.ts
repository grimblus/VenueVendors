import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  images: {
    qualities: [75, 100],  // ADD 100 here
  },
};

export default nextConfig;
