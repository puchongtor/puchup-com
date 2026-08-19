"use client";

import { useCallback, useState } from "react";

type Props = {
  slug: string;
  /** Filename without extension, e.g. cover or photo-1552566626-52f8b828add9 */
  file: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
};

/**
 * Prefers public/images/demos/[slug]/[file].webp then .png, then fallback.
 * Server and client start on the same src to avoid hydration mismatch.
 */
export function DemoImage({ slug, file, fallbackSrc, alt, className }: Props) {
  const webp = `/images/demos/${slug}/${file}.webp`;
  const png = `/images/demos/${slug}/${file}.png`;
  const [src, setSrc] = useState(webp);

  const onError = useCallback(() => {
    setSrc((current) => {
      if (current === webp) return png;
      if (current === png) return fallbackSrc;
      return current;
    });
  }, [fallbackSrc, png, webp]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} onError={onError} />
  );
}

export function coverFileFromUnsplash(url: string): string {
  const match = url.match(/photo-([a-z0-9-]+)/i);
  return match ? `photo-${match[1]}` : "cover";
}
