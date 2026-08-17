import type { Metadata } from "next";
import DemoClient from "@/components/project-one/DemoClient";

export const metadata: Metadata = {
  title: "Demo Library | ตัวอย่างธุรกิจทั้งหมด",
  description:
    "เลือกดูตัวอย่างตามประเภทธุรกิจของคุณ แล้วลองนึกภาพว่าร้านของคุณจะดูดีขนาดไหน",
};

export default function ProjectOneDemoPage() {
  return <DemoClient />;
}
