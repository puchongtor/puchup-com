import { createClient, type QueryParams } from "next-sanity";
import { isSanityConfigured, sanityConfig } from "./config";
import { isProductionBuild, readSanityBuildFallback } from "./fallback";

const DEFAULT_TIMEOUT_MS = 8000;
const DEFAULT_REVALIDATE_SECONDS = 3600;

/** After the first timeout/failure during `next build`, skip remaining CMS calls. */
let skipSanityDuringBuild = false;

export const sanityClient = isSanityConfigured()
  ? createClient({
      projectId: sanityConfig.projectId,
      dataset: sanityConfig.dataset,
      apiVersion: sanityConfig.apiVersion,
      useCdn: sanityConfig.useCdn,
      perspective: "published",
      stega: {
        enabled: false,
        studioUrl: "/admin",
      },
    })
  : null;

export async function sanityFetch<T>({
  query,
  params = {},
  tags,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  revalidate = DEFAULT_REVALIDATE_SECONDS,
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
  timeoutMs?: number;
  revalidate?: number | false;
}): Promise<T | null> {
  const fallback = () => readSanityBuildFallback<T>(query, params);

  if (!sanityClient || skipSanityDuringBuild) {
    return fallback();
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await sanityClient.fetch<T>(query, params, {
      signal: controller.signal,
      next: {
        revalidate,
        tags,
      },
    });
  } catch (error) {
    const aborted =
      controller.signal.aborted ||
      (error instanceof Error && error.name === "AbortError");
    if (aborted) {
      console.warn(`[sanityFetch] timed out after ${timeoutMs}ms`);
    } else {
      console.error("[sanityFetch]", error);
    }
    if (isProductionBuild()) {
      skipSanityDuringBuild = true;
    }
    return fallback();
  } finally {
    clearTimeout(timer);
  }
}
