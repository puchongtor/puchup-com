import type { Metadata } from "next";
import { ThemeDocument } from "@/components/demos/ThemeDocument";
import { loadProjectOnePage } from "@/lib/project-one/html";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: "Project ONE — Business Showroom",
  description:
    "สำรวจโชว์รูมตัวอย่างเว็บไซต์ธุรกิจท้องถิ่นใน Project ONE — หน้าเดียวจบ ปิดการขายด้วย LINE และ Google Maps",
};

/**
 * /ProjectONE/demo/ — Gemini showroom catalog (exact HTML, rewritten links).
 */
export default function ProjectOneDemoShowroomPage() {
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
