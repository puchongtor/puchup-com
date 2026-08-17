import createImageUrlBuilder from "@sanity/image-url";
import { isSanityConfigured, sanityConfig } from "./config";
import type { SanityImage } from "./types";

const builder = isSanityConfigured()
  ? createImageUrlBuilder({
      projectId: sanityConfig.projectId,
      dataset: sanityConfig.dataset,
    })
  : null;

export function urlForImage(source: SanityImage | null | undefined) {
  if (!builder || !source?.asset) return null;
  return builder.image(source).auto("format").fit("max");
}

export function imageUrl(
  source: SanityImage | null | undefined,
  width?: number,
): string | null {
  if (!source) return null;
  const img = urlForImage(source);
  if (!img) return null;
  return (width ? img.width(width) : img).url();
}
