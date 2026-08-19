/**
 * Soft env helpers that do not throw at import time.
 * Use for frontend data fetching; Studio config uses sanity/env.ts assertions.
 */
export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01",
  /** Always use Sanity CDN — cheaper and avoids live API quota on every build/dev fetch. */
  useCdn: true,
  rootDomain: process.env.NEXT_PUBLIC_ROOT_DOMAIN || "puchup.com",
};

export function isSanityConfigured(): boolean {
  return Boolean(sanityConfig.projectId && sanityConfig.dataset);
}
