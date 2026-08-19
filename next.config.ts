import type { NextConfig } from "next";

/**
 * Static HTML export on Vercel:
 * - no Fluid Compute / serverless invocations
 * - no Image Optimization transformations
 * Images come from Sanity CDN (`lib/sanity/image.ts`), not `/_next/image`.
 *
 * Host redirects/rewrites live in vercel.json (not supported here with `output: "export"`).
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  compress: true,
  agentRules: false,
  images: {
    unoptimized: true,
  },
  transpilePackages: ["next-sanity"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
