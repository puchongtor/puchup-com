import type { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: "Project ONE | One Page. Full Business.",
  description:
    "เว็บท้องถิ่น × Google Business — จากหน้าเดียวถึงขยาย SEO ไม่เกิน 10 หน้า ให้ลูกค้ารู้จัก ตัดสินใจ และมาที่ร้าน",
};

/** No locked chrome — site nav footer is injected inside each HTML document and scrolls with it. */
export default function ProjectOneLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
