import type { Metadata } from "next";
import Link from "next/link";
import { processSteps, site } from "@/lib/site";

export const metadata: Metadata = { title: "How We Work" };

const fullBlurbs: Record<string, string> = {
  Listen: "เราเริ่มจากปัญหาของธุรกิจและลูกค้า ไม่เริ่มจาก template สำเร็จรูป",
  Design: "ออกแบบเส้นทางที่ระบบช่วยได้จริง ตั้งแต่ค้นหา ตัดสินใจ ติดต่อ ไปจนถึง workflow",
  Build: "สร้างเว็บไซต์และระบบให้ทำงานด้วยกัน ไม่แยกเป็นงานคนละชิ้นโดยไร้จุดหมาย",
  Demonstrate: "ทำให้เห็นผลก่อนขยาย ใช้เคสจริงหรือ demo เป็นหลักฐาน",
  Improve: "ปรับจากข้อมูลและการใช้งานจริง ไม่หยุดแค่ส่งมอบวันแรก",
};

export default function HowWeWorkPage() {
  return (
    <section className="bg-base">
      <div className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24">
        <span className="eyebrow text-[11px] uppercase text-aorange">How We Work</span>
        <h1 className="mt-3 mb-4 text-4xl font-bold md:text-5xl">เราไม่ได้เริ่มจาก Template</h1>
        <p className="mb-14 max-w-2xl text-[17px] leading-relaxed text-muted">
          เราไม่ขายแพ็กเกจหน้าเว็บสำเร็จรูปเป็นหลัก เราออกแบบระบบให้ตรงกับปัญหาธุรกิจของคุณ
        </p>
        <div className="space-y-6">
          {processSteps.map((step) => (
            <div key={step.n} className="rounded-xl2 border border-cream p-6 md:p-8">
              <span className="eyebrow text-[11px] text-apurple">{step.n}</span>
              <h2 className="mt-2 mb-3 text-2xl font-semibold">{step.title}</h2>
              <p className="text-[15px] leading-relaxed text-muted">
                {fullBlurbs[step.title] || step.body}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Link
            href="/contact/"
            className="inline-flex rounded-full bg-navy px-5 py-3 text-[15px] font-semibold text-base"
          >
            {site.cta.primary}
          </Link>
        </div>
      </div>
    </section>
  );
}
