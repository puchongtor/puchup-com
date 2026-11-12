import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  OutcomeGrid,
  ProductFinalCta,
  ProductHero,
  SplitImageCopy,
  StepsPriceBlock,
} from "@/components/products/ProductMarketingSections";
import {
  saledeskOutcomes,
  saledeskPricingTiers,
  saledeskProblems,
  saledeskProduct,
  saledeskRoles,
  saledeskSteps,
} from "@/lib/products/saledesk";
import { saleDesk } from "@/lib/saledesk";

export const metadata: Metadata = {
  title: `${saledeskProduct.name} — ${saledeskProduct.nameTh}`,
  description: saledeskProduct.blurb,
};

export default function SaleDeskLandingPage() {
  const p = saledeskProduct;
  return (
    <section className="bg-base">
      <ProductHero
        status={p.status}
        priceLabel={p.priceLabel}
        name={p.name}
        nameTh={p.nameTh}
        tagline={p.tagline}
        note={`DEMO · ตัวอย่างองค์กร: ${p.sampleCompany}`}
        heroImage={p.images.hero}
        secondaryHref={saleDesk.demoPath}
        secondaryLabel="เปิดตัวอย่างเชิงโต้ตอบ"
      />

      <SplitImageCopy
        eyebrow="The problem"
        title="ทีมขายเล็ก ไม่ต้องการ CRM ที่ใหญ่เกิน"
        image={p.images.problem}
        imageAlt="ข้อมูลงานเยี่ยมกระจัดกระจาย"
        items={[...saledeskProblems]}
      />

      <OutcomeGrid eyebrow="What you get" title="SaleDesk ช่วยอะไร" items={[...saledeskOutcomes]} />

      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-24 lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <p className="eyebrow text-[11px] uppercase text-aorange">Roles</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">เซลล์ · ผู้จัดการ · แอดมิน</h2>
            <div className="mt-8 space-y-4">
              {saledeskRoles.map((role) => (
                <div key={role.title} className="rounded-xl border border-slate-200/70 bg-cream/40 p-4">
                  <p className="font-semibold text-ink">{role.title}</p>
                  <p className="mt-1 text-[14px] text-muted">{role.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[13.5px] text-muted">
              ดูตัวอย่างเชิงโต้ตอบมุมเซลล์และผู้จัดการ — ไม่เปิดบัญชีทดลองสาธารณะ
              อยากใช้ของจริงให้ทีม คุยกับ PuchUp โดยตรง
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={saleDesk.demoPath}
                className="inline-flex rounded-xl bg-navy px-4 py-2.5 text-[14px] font-semibold text-base"
              >
                เปิดตัวอย่างเชิงโต้ตอบ
              </Link>
              <Link
                href="/contact/"
                className="inline-flex rounded-xl border border-navy/15 px-4 py-2.5 text-[14px] font-semibold text-ink"
              >
                คุยกับ PuchUp
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src={p.images.manager} alt="มุมมองผู้จัดการ" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-4 sm:px-6 md:px-8 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2">
          {saledeskPricingTiers.map((tier) => (
            <div
              key={tier.band}
              className="rounded-xl border border-slate-200/70 bg-cream/40 px-5 py-4"
            >
              <p className="text-[13px] font-medium uppercase tracking-wide text-apurple">{tier.band}</p>
              <p className="mt-1 text-[17px] font-semibold tracking-tight text-ink">{tier.monthly}</p>
              <p className="mt-1 text-[13px] text-muted">รายเดือนแบบช่วงทีม · ไม่คิดรายหัว</p>
            </div>
          ))}
        </div>
      </div>

      <StepsPriceBlock
        priceLabel={p.priceLabel}
        priceNote={p.priceNote}
        steps={[...saledeskSteps]}
        image={p.images.manager}
        imageAlt="เปิดใช้ SaleDesk"
      />

      <ProductFinalCta
        title="อยากให้ทีมขายมีหลักฐานจากสนาม?"
        body="เล่าขนาดทีมและปัญหาที่ผู้จัดการเจอมาได้เลย — หรือเปิดตัวอย่างเชิงโต้ตอบ SaleDesk (Meridian Parts) ก่อนแล้วค่อยคุยรายละเอียด"
        extraHref={saleDesk.demoPath}
        extraLabel="เปิดตัวอย่าง SaleDesk"
      />
    </section>
  );
}
