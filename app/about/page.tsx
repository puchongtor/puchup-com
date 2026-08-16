import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <section className="bg-base">
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <span className="eyebrow text-[11px] uppercase text-apurple">About</span>
        <h1 className="mt-3 mb-6 text-4xl font-bold md:text-5xl">
          เรากำลังสร้างและทดลองระบบทีละชิ้น
        </h1>
        <div className="space-y-5 text-[16px] leading-relaxed text-muted">
          <p>
            PuchUp ไม่ได้มีคำตอบสำเร็จรูปสำหรับทุกธุรกิจ เราฟังปัญหาจริง ออกแบบระบบ และพิสูจน์ด้วยของที่จับต้องได้
          </p>
          <p>
            เว็บไซต์นี้เองก็เป็นหนึ่งใน Showcase — หลักฐานว่าเราคิดและสร้างระบบอย่างไร ไม่ใช่แค่พูดถึงไอเดีย
          </p>
        </div>
        <p className="mt-10 border-l-2 border-aamber/40 pl-4 text-[15px] font-medium text-ink">
          {site.philosophyLines[0]}
          <br />
          {site.philosophyLines[1]}
        </p>
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
