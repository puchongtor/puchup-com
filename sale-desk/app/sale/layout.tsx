import type { Metadata, Viewport } from "next";
import { SaleAuthGate } from "@/components/sales-ai/SaleAuthGate";
import { SaleUrlCanon } from "@/components/sales-ai/SaleUrlCanon";
import { SALE_BRAND } from "@/lib/sales-ai/brand";
import { SaleStoreProvider } from "@/lib/sales-ai/SaleStore";
import "./sale.css";

export const metadata: Metadata = {
  title: {
    default: `${SALE_BRAND.appName} | ${SALE_BRAND.name}`,
    template: `%s | ${SALE_BRAND.appName}`,
  },
  description: `${SALE_BRAND.productName} ของ ${SALE_BRAND.legalName} — พูด ถ่ายรูป สรุปเยี่ยมลูกค้า`,
  robots: { index: false, follow: false },
  applicationName: SALE_BRAND.appName,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SALE_BRAND.shortAppName,
  },
  manifest: "/sale/manifest.webmanifest",
  icons: { icon: SALE_BRAND.logoSrc, apple: SALE_BRAND.logoSrc },
};

export const viewport: Viewport = {
  themeColor: SALE_BRAND.themeColor,
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function SaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sale-desk">
      <SaleStoreProvider>
        <SaleUrlCanon />
        <SaleAuthGate>{children}</SaleAuthGate>
      </SaleStoreProvider>
    </div>
  );
}
