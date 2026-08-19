import type { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: "Project ONE | One Page. Full Business.",
  description:
    "เว็บไซต์หน้าเดียว ที่ทำให้ลูกค้ารู้จักธุรกิจ ตัดสินใจ และอยากมาที่ร้าน",
};

/** Isolated shell — no site header/footer, no shared marketing chrome. */
export default function ProjectOneLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
