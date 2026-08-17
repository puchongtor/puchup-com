import { createClient, type QueryParams } from "next-sanity";
import { isSanityConfigured, sanityConfig } from "./config";

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
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
}): Promise<T | null> {
  if (!sanityClient) return null;

  try {
    return await sanityClient.fetch<T>(query, params, {
      next: {
        revalidate: 60,
        tags,
      },
    });
  } catch (error) {
    console.error("[sanityFetch]", error);
    return null;
  }
}
