import type { Metadata } from "next";
import { saleDesk } from "@/lib/saledesk";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `${saleDesk.name} interactive demo — Meridian Parts`,
  description:
    "ตัวอย่างเชิงโต้ตอบ SaleDesk มุมเซลล์และมุมผู้จัดการ — ไม่เปิดระบบจริงให้ทดลอง ติดต่อ PuchUp เพื่อเริ่มใช้กับทีมคุณ",
  robots: { index: false, follow: false },
};

export default function SaleDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
