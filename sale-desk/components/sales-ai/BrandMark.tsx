import Image from "next/image";
import { SALE_BRAND } from "@/lib/sales-ai/brand";

type Props = {
  /** dark = บนพื้นกรมท่า, light = บนพื้นขาว */
  tone?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  showProduct?: boolean;
  className?: string;
};

const SIZES = {
  sm: { logo: 28, name: "text-sm", sub: "text-[10px]" },
  md: { logo: 36, name: "text-base", sub: "text-[11px]" },
  lg: { logo: 44, name: "text-lg", sub: "text-xs" },
} as const;

export function BrandMark({
  tone = "dark",
  size = "md",
  showProduct = true,
  className = "",
}: Props) {
  const s = SIZES[size];
  const nameColor = tone === "dark" ? "#fff" : "var(--sale-navy)";
  const subColor = tone === "dark" ? "rgba(255,255,255,0.72)" : "var(--sale-muted)";

  return (
    <div className={`flex min-w-0 items-center gap-2.5 ${className}`}>
      <div
        className="relative shrink-0 overflow-hidden rounded-lg bg-white"
        style={{ width: s.logo, height: s.logo }}
      >
        <Image
          src={SALE_BRAND.logoSrc}
          alt={SALE_BRAND.logoAlt}
          fill
          className="object-contain p-0.5"
          sizes={`${s.logo}px`}
          priority
        />
      </div>
      <div className="min-w-0">
        <p className={`truncate font-semibold leading-tight ${s.name}`} style={{ color: nameColor }}>
          {SALE_BRAND.name}
        </p>
        {showProduct ? (
          <p className={`truncate leading-tight ${s.sub}`} style={{ color: subColor }}>
            {SALE_BRAND.productName}
          </p>
        ) : (
          <p className={`truncate leading-tight ${s.sub}`} style={{ color: subColor }}>
            {SALE_BRAND.legalName}
          </p>
        )}
      </div>
    </div>
  );
}
