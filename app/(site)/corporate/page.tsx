import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  corporateOutcomes,
  corporateProblems,
  corporateProduct,
  corporateProof,
  corporateSamplePages,
  corporateSeoPoints,
  corporateSteps,
} from "@/lib/products/corporate";
import { LINE_OA_ID, LINE_OA_URL } from "@/lib/puchup-knowledge";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${corporateProduct.name} — ${corporateProduct.nameTh}`,
  description: corporateProduct.blurb,
};

export default function CorporatePage() {
  const img = corporateProduct.images;

  return (
    <section className="bg-base">
      {/* Hero */}
      <div className="relative overflow-hidden bg-navy text-base">
        <Image
          src={img.hero}
          alt=""
          fill
          priority
          className="object-cover opacity-45"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/88 to-navy/55" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-24 lg:px-8">
          <Link
            href="/#products"
            className="text-[13px] font-medium text-base/60 transition hover:text-base"
          >
            ← Products & Services
          </Link>
          <p className="eyebrow mt-6 text-[11px] uppercase text-aamber">
            {corporateProduct.status} · {corporateProduct.priceLabel}
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            {corporateProduct.name}
          </h1>
          <p className="mt-2 text-lg font-medium text-base/85 md:text-xl">
            {corporateProduct.nameTh}
          </p>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-base/70">
            {corporateProduct.tagline}
          </p>
          <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-base/55">
            {corporateProduct.vsProjectOne}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/contact/"
              className="inline-flex rounded-xl bg-base px-5 py-3 text-[15px] font-semibold text-navy transition hover:opacity-90"
            >
              {site.cta.primary}
            </Link>
            <a
              href={corporateProof.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-xl border border-base/30 px-5 py-3 text-[15px] font-semibold text-base transition hover:bg-base/10"
            >
              ดูตัวอย่าง Advance Pro
            </a>
          </div>
        </div>
      </div>

      {/* Problems */}
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-24 lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={img.problem}
              alt="ปัญหาเว็บบริษัทที่พบบ่อย"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="eyebrow text-[11px] uppercase text-aorange">The problem</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              หลายบริษัทมีเว็บแล้ว แต่ยังขายยาก
            </h2>
            <div className="mt-8 space-y-6">
              {corporateProblems.map((item) => (
                <div key={item.title} className="border-l-2 border-aorange/40 pl-4">
                  <h3 className="font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Outcomes */}
      <div className="bg-cream/50">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-24 lg:px-8">
          <p className="eyebrow text-[11px] uppercase text-apurple">What you get</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-ink md:text-4xl">
            สิ่งที่ได้จาก Corporate Site
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {corporateOutcomes.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-md"
              >
                <h3 className="text-lg font-bold text-ink">{item.title}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Structure / IA */}
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-24 lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <p className="eyebrow text-[11px] uppercase text-aorange">Information architecture</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              ตัวอย่างโครง 20–30 หน้า
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              ไม่ใช่แม่แบบเดียวบังคับทุกธุรกิจ — แต่เป็นโครงที่มักใช้กับบริษัทที่ต้องการความน่าเชื่อถือ
              และเส้นทางปิดการขายชัด
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {corporateSamplePages.map((block) => (
                <div
                  key={block.group}
                  className="rounded-2xl border border-slate-200/60 bg-cream/40 p-5"
                >
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-apurple">
                    {block.group}
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {block.items.map((page) => (
                      <li key={page} className="text-[14px] text-ink/80">
                        · {page}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={img.structure}
              alt="โครงสร้างหลายหน้าของเว็บบริษัท"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>

      {/* SEO / AEO */}
      <div className="bg-navy text-base">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-6 md:grid-cols-2 md:gap-14 md:px-8 md:py-24 lg:px-8">
          <div className="relative order-2 aspect-[4/3] overflow-hidden rounded-2xl md:order-1">
            <Image
              src={img.seo}
              alt="SEO และ AEO สำหรับเว็บบริษัท"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="order-1 md:order-2">
            <p className="eyebrow text-[11px] uppercase text-aamber">SEO · AEO</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              ค้นหาเจอ และตอบคำถามธุรกิจได้
            </h2>
            <div className="mt-8 space-y-5">
              {corporateSeoPoints.map((item) => (
                <div key={item.title}>
                  <h3 className="font-semibold text-base">{item.title}</h3>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-base/65">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Proof */}
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-24 lg:px-8">
        <p className="eyebrow text-[11px] uppercase text-apurple">Client examples</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
          เว็บไซต์ตัวอย่างลูกค้าของเรา
        </h2>
        <p className="mt-3 max-w-xl text-[15px] text-muted">{corporateProof.note}</p>
        <a
          href={corporateProof.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 grid overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm transition hover:border-aorange/35 md:grid-cols-2"
        >
          <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[280px]">
            <Image
              src={corporateProof.image}
              alt={corporateProof.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center p-6 md:p-10">
            <p className="text-[12px] font-medium uppercase tracking-wide text-apurple">
              Corporate · B2B
            </p>
            <h3 className="mt-2 text-2xl font-bold text-ink">{corporateProof.name}</h3>
            <p className="mt-1 text-sm text-ink/70">{corporateProof.nameTh}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">{corporateProof.summary}</p>
            <span className="mt-6 text-[14px] font-semibold text-aorange">
              เปิด {corporateProof.name} →
            </span>
          </div>
        </a>
      </div>

      {/* Price + handoff */}
      <div className="bg-cream/50">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-6 md:grid-cols-2 md:gap-14 md:px-8 md:py-24 lg:px-8">
          <div>
            <p className="eyebrow text-[11px] uppercase text-aorange">Pricing</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              {corporateProduct.priceLabel}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              {corporateProduct.priceNote}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {corporateSteps.map((step) => (
                <div
                  key={step.n}
                  className="rounded-xl border border-slate-200/70 bg-white/80 p-4"
                >
                  <span className="eyebrow text-[11px] text-apurple">{step.n}</span>
                  <p className="mt-1 font-semibold text-ink">{step.title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={img.handoff}
              alt="ส่งมอบให้ทีมอัปเดตต่อได้"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-20 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-navy p-8 text-base md:p-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold md:text-3xl">พร้อมสร้างเว็บบริษัทที่ปิดงานได้?</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-base/65">
                เล่าธุรกิจมาเป็นภาษาคนได้เลย — หรือทัก LINE เพื่อคุยสcope และราคาให้ตรงงาน
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact/"
                className="inline-flex rounded-xl bg-base px-5 py-3 text-[15px] font-semibold text-navy transition hover:opacity-90"
              >
                {site.cta.primary}
              </Link>
              <a
                href={LINE_OA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl bg-[#06C755] px-5 py-3 text-[15px] font-semibold text-white transition hover:opacity-90"
              >
                LINE {LINE_OA_ID}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
