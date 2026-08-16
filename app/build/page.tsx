import type { Metadata } from "next";
import Link from "next/link";
import { buildCards, site } from "@/lib/site";

export const metadata: Metadata = { title: "What We Build" };

export default function BuildPage() {
  return (
    <section className="bg-base">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <span className="eyebrow text-[11px] uppercase text-aorange">What We Build</span>
        <h1 className="mt-3 mb-4 max-w-3xl text-4xl font-bold md:text-5xl">
          เราไม่ได้ขายจำนวนหน้าเว็บ
          <br />
          เราสร้างสิ่งที่ระบบช่วยทำได้
        </h1>
        <p className="mb-14 max-w-xl text-[17px] leading-relaxed text-muted">
          เราเริ่มจากปัญหาของธุรกิจ แล้วออกแบบระบบเข้าไปช่วย
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {buildCards.map((card) => (
            <Link
              key={card.title}
              href="/showcase/"
              className="rounded-xl2 border border-cream bg-base p-6 transition hover:border-aorange/40 hover:shadow-lg"
            >
              <span className="text-2xl">{card.icon}</span>
              <h2 className="mt-4 mb-1.5 text-lg font-semibold">{card.title}</h2>
              <p className="text-[14px] leading-relaxed text-muted">{card.body}</p>
            </Link>
          ))}
        </div>
        <div className="mt-14">
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
