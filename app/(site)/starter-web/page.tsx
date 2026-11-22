import type { Metadata } from "next";
import { StarterBrief } from "@/components/starter-web/StarterBrief";

export const metadata: Metadata = {
  title: "เว็บไซต์ธุรกิจเริ่มต้น 5,990 บาท | PuchUp",
  description: "เลือกแนวทางและส่งข้อมูลธุรกิจ เพื่อให้ PuchUp ช่วยจัดทำเว็บไซต์หน้าเดียวพร้อมใช้งาน",
  robots: { index: false, follow: false },
};

export default function StarterWebPage() {
  return <StarterBrief />;
}
