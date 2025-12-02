import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allow all origins for dev
  // @ts-ignore
  allowedDevOrigins: ['*'],
  reactStrictMode: false,
};

export default nextConfig;
