import type { NextConfig } from "next";

/**
 * SaleDesk runtime app for sale.puchup.com
 * NOT static export — needs API routes + auth cookies.
 */
const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { unoptimized: true },
};

export default nextConfig;
