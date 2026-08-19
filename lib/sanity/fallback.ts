import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { QueryParams } from "next-sanity";
import {
  demoSiteBySubdomainQuery,
  demoSiteSubdomainsQuery,
  pageBySlugQuery,
  projectOneDemoBySlugQuery,
  projectOneDemoLinksQuery,
  projectOneDemoSlugsQuery,
  siteSettingsQuery,
} from "./queries";

const FALLBACK_DIR = path.join(process.cwd(), "content", "sanity-fallback");

export function isProductionBuild(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build";
}

function fallbackRelPath(query: string, params: QueryParams): string | null {
  if (query === siteSettingsQuery) return "siteSettings.json";
  if (query === demoSiteSubdomainsQuery) return "demoSiteSubdomains.json";
  if (query === projectOneDemoSlugsQuery) return "projectOneDemoSlugs.json";
  if (query === projectOneDemoLinksQuery) return "projectOneDemoLinks.json";
  if (query === pageBySlugQuery && typeof params.slug === "string") {
    return path.join("pages", `${params.slug}.json`);
  }
  if (query === demoSiteBySubdomainQuery && typeof params.subdomain === "string") {
    return path.join("demoSites", `${params.subdomain}.json`);
  }
  if (query === projectOneDemoBySlugQuery && typeof params.slug === "string") {
    return path.join("projectOneDemos", `${params.slug}.json`);
  }
  return null;
}

export function readSanityBuildFallback<T>(
  query: string,
  params: QueryParams = {},
): T | null {
  if (!isProductionBuild()) return null;

  const rel = fallbackRelPath(query, params);
  if (!rel) return null;

  const file = path.join(FALLBACK_DIR, rel);
  if (!existsSync(file)) return null;

  try {
    return JSON.parse(readFileSync(file, "utf8")) as T;
  } catch (error) {
    console.error("[sanityFetch] invalid JSON fallback", file, error);
    return null;
  }
}
