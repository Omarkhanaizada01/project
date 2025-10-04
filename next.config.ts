import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BITRIX_WEBHOOK: process.env.BITRIX_WEBHOOK,
  },
}

export default nextConfig;
