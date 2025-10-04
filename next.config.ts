import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BITRIX_WEBHOOK_URL: process.env.BITRIX_WEBHOOK_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    SQLITE_FILE: process.env.SQLITE_FILE,
  },
}

export default nextConfig;
