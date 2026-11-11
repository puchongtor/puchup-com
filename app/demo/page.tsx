import type { Metadata } from "next";
import { ThemeDocument } from "@/components/demos/ThemeDocument";
import { loadProjectOnePage } from "@/lib/project-one/html";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: "Project ONE — Business Showroom",
  description:
    "สำรวจโชว์รูมตัวอย่างเว็บไซต์ธุรกิจท้องถิ่นใน Project ONE — หน้าเดียวจบ ปิดการขายด้วย LINE และ Google Maps",
  alternates: { canonical: "/ProjectONE/demo/" },
};

/**
 * Legacy alias for /ProjectONE/demo/ (same Gemini showroom HTML).
 * Prefer /ProjectONE/demo/ in new links.
 */
export default function DemoShowroomAliasPage() {
  const html = loadProjectOnePage("demo");
  if (!html) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-8 text-center">
        <p>ไม่พบไฟล์ demo showroom</p>
      </div>
    );
  }

  return <ThemeDocument title="Project ONE Showroom" srcDoc={html} />;
}
