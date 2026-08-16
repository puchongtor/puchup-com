import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Showcase" };

export default function ShowcasePage() {
  return (
    <section className="bg-base">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <span className="eyebrow text-[11px] uppercase text-apurple">Showcase</span>
        <h1 className="mt-3 mb-4 max-w-3xl text-4xl font-bold md:text-5xl">
          ธุรกิจของคุณก็สร้างระบบแบบนี้ได้
        </h1>
        <p className="mb-12 max-w-xl text-[17px] text-muted">
          ดูตัวอย่างว่าเราเปลี่ยนปัญหาธุรกิจให้กลายเป็นระบบได้อย่างไร
        </p>

        <Link
          href="/showcase/aeropulse/"
          className="mb-5 block overflow-hidden rounded-xl2 bg-navy text-base md:grid md:grid-cols-2"
        >
          <div className="flex flex-col justify-center p-8 md:p-12">
            <span className="eyebrow mb-5 inline-block w-fit rounded-full bg-aamber/15 px-2.5 py-1 text-[10px] uppercase text-aamber">
              Demo / Concept
            </span>
            <p className="mb-6 text-xl leading-snug font-medium md:text-2xl">
              &quot;ลูกค้าไม่ควรต้องรู้จักจักรยานทุกคันก่อนซื้อ&quot;
            </p>
            <p className="mb-8 text-[15px] text-base/60">
              AeroPulse — ระบบช่วยเลือกรถจักรยาน แทนการไล่ดูสเปกเอง
            </p>
            <span className="text-[14px] font-semibold text-aamber">ดู Case Study →</span>
          </div>
          <div className="flex min-h-[200px] items-center justify-center bg-gradient-to-br from-apurple/30 via-aorange/20 to-aamber/20 p-10" />
        </Link>

        <div className="rounded-xl2 border border-dashed border-cream p-6 text-center text-[14px] text-muted">
          กำลังเพิ่ม Showcase ใหม่เรื่อยๆ
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
