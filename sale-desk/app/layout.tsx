import type { Metadata } from "next";
import { SALE_BRAND } from "@/lib/sales-ai/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: SALE_BRAND.appName,
  description: `${SALE_BRAND.productName} demo for ${SALE_BRAND.legalName}`,
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="antialiased">{children}</body>
    </html>
  );
}
