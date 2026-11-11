import type { Metadata } from "next";
import { saleDesk } from "@/lib/saledesk";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `${saleDesk.name} Demo — Your Company`,
  description: "เดโมจำลอง SaleDesk สำหรับ Your Company",
  robots: { index: false, follow: false },
};

export default function SaleDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
