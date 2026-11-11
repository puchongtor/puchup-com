import type { Metadata } from "next";
import Image from "next/image";
import {
  OutcomeGrid,
  ProductFinalCta,
  ProductHero,
  SplitImageCopy,
  StepsPriceBlock,
} from "@/components/products/ProductMarketingSections";
import {
  opscraftExamples,
  opscraftOutcomes,
  opscraftProblems,
  opscraftProduct,
  opscraftSteps,
} from "@/lib/products/opscraft";

export const metadata: Metadata = {
  title: `${opscraftProduct.name} — ${opscraftProduct.nameTh}`,
  description: opscraftProduct.blurb,
};

export default function OpsCraftPage() {
  const p = opscraftProduct;
  return (
    <section className="bg-base">
      <ProductHero
        status={p.status}
        priceLabel={p.priceLabel}
        name={p.name}
        nameTh={p.nameTh}
        tagline={p.tagline}
        heroImage={p.images.hero}
      />

      <SplitImageCopy
        eyebrow="The problem"
        title="งานซ้ำและความข้อมูลกระจัดกระจาย"
        image={p.images.problem}
        imageAlt="งานซ้ำในทีม"
        items={[...opscraftProblems]}
      />

      <OutcomeGrid eyebrow="What you get" title="สิ่งที่ได้จาก OpsCraft" items={[...opscraftOutcomes]} />

      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-24 lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src={p.images.flow} alt="ฟอร์มสู่ฐานข้อมูล" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
          </div>
          <div>
            <p className="eyebrow text-[11px] uppercase text-aorange">Example cases</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              ตัวอย่างงานที่มักเอามาทำระบบ
            </h2>
            <p className="mt-3 text-[15px] text-muted">
              ตัวอย่างงานที่ธุรกิจมักนำมาทำเป็นระบบ เพื่อให้เห็นภาพก่อนประเมินขอบเขต
            </p>
            <ul className="mt-8 space-y-3">
              {opscraftExamples.map((line) => (
                <li
                  key={line}
                  className="rounded-xl border border-slate-200/70 bg-cream/40 px-4 py-3 text-[14.5px] text-ink/85"
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <StepsPriceBlock
        priceLabel={p.priceLabel}
        priceNote={p.priceNote}
        steps={[...opscraftSteps]}
        image={p.images.flow}
        imageAlt="ออกแบบระบบตามเคส"
      />

      <ProductFinalCta
        title="มีงานซ้ำที่อยากลด?"
        body="เล่า flow การทำงานและจุดที่พลาดบ่อยมาได้เลย — จะช่วยประเมินว่าระบบแกนเล็กเริ่มตรงไหนคุ้มที่สุด"
      />
    </section>
  );
}
