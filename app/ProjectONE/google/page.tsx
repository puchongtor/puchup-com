import type { Metadata } from "next";
import { ThemeDocument } from "@/components/demos/ThemeDocument";
import { loadProjectOnePage } from "@/lib/project-one/html";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: "หน้าร้านบน Google | Project ONE",
  description:
    "เชื่อม Google Business Profile กับเว็บไซต์หน้าเดียว — ให้ลูกค้าหาเจอ นำทางมา และติดต่อได้ทันที",
};

export default function ProjectOneGooglePage() {
  const html = loadProjectOnePage("google");
  if (!html) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-8 text-center">
        <p>ไม่พบหน้า Google Business Profile</p>
      </div>
    );
  }

  return <ThemeDocument title="หน้าร้านบน Google" srcDoc={html} />;
}
