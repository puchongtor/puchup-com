import Image from "next/image";

const BRAND = {
  favicon: "/brand/favicon.png",
  /** Dark lockup with baked navy (legacy JPG) */
  horizontal: "/brand/logo-horizontal.jpg",
  /** Transparent lockup for navy/dark surfaces (footer, hero) */
  horizontalDark: "/brand/logo-horizontal-dark.png",
  horizontalLight: "/brand/logo-horizontal-light.png",
  squareLight: "/brand/logo-1x1-light.jpg",
  squareDark: "/brand/logo-1x1-dark.jpg",
} as const;

/** Rocket mark (favicon asset) — header / compact UI */
export function LogoMark({
  className = "h-9 w-9",
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <Image
      src={light ? BRAND.squareDark : BRAND.favicon}
      alt="PuchUp"
      width={72}
      height={72}
      className={`rounded-lg object-cover ${className}`}
      priority
    />
  );
}

/** Horizontal lockup — light = header; dark = transparent for navy footer/hero */
export function BrandLogoHorizontal({
  className = "h-10 w-auto",
  variant = "dark",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  return (
    <Image
      src={variant === "light" ? BRAND.horizontalLight : BRAND.horizontalDark}
      alt="PuchUp — Level up your business & life"
      width={480}
      height={160}
      className={`object-contain ${className}`}
      priority
    />
  );
}

/** 1:1 badge — light or dark ring versions */
export function BrandLogoSquare({
  variant = "dark",
  className = "h-16 w-16",
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  return (
    <Image
      src={variant === "light" ? BRAND.squareLight : BRAND.squareDark}
      alt="PuchUp"
      width={256}
      height={256}
      className={`rounded-2xl object-cover ${className}`}
    />
  );
}

export function BrandWordmark({ light = false }: { light?: boolean }) {
  return (
    <span className={`text-lg font-bold ${light ? "text-base" : "text-ink"}`}>
      Puch<span className="grad-text">Up</span>
    </span>
  );
}

export const brandAssets = BRAND;
