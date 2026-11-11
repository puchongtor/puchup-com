import { NextResponse } from "next/server";
import { SALE_BRAND } from "@/lib/sales-ai/brand";

/** PWA manifest — Your Company / PuchUp SaleDesk */
export function GET() {
  const body = {
    name: SALE_BRAND.appName,
    short_name: SALE_BRAND.shortAppName,
    description: `${SALE_BRAND.productName} · ${SALE_BRAND.legalName}`,
    start_url: "/",
    scope: "/",
    id: "/",
    display: "standalone",
    background_color: "#f5f7fa",
    theme_color: SALE_BRAND.themeColor,
    lang: "th",
    icons: [
      {
        src: SALE_BRAND.logoSrc,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: SALE_BRAND.logoSrc,
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };

  return NextResponse.json(body, {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
