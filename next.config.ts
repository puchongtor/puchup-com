import type { NextConfig } from "next";

/**
 * Static `output: "export"` cannot ship API routes or middleware.
 * Image generation uses POST /api/generate-image (Node runtime).
 * Sanity Studio + subdomain rewrites require a Node host (not STATIC_EXPORT).
 * Set STATIC_EXPORT=1 only when you intentionally build without the API.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(process.env.STATIC_EXPORT === "1" ? { output: "export" as const } : {}),
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  trailingSlash: true,
};

export default nextConfig;
