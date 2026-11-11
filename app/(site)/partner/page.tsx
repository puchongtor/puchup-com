import type { Metadata } from "next";
import {
  OutcomeGrid,
  ProductFinalCta,
  ProductHero,
  SplitImageCopy,
  StepsPriceBlock,
} from "@/components/products/ProductMarketingSections";
import {
  partnerFit,
  partnerOutcomes,
  partnerProblems,
  partnerProduct,
  partnerSteps,
} from "@/lib/products/partner";

export const metadata: Metadata = {
  title: `${partnerProduct.name} — ${partnerProduct.nameTh}`,
  description: partnerProduct.blurb,
};

export default function PartnerPage() {
  const p = partnerProduct;
  return (
    <section className="bg-base">
      <ProductHero
        status={p.status}
        priceLabel={p.priceLabel}
        name={p.name}
        nameTh={p.nameTh}
        tagline={p.tagline}
        heroImage={p.images.hero}
        secondaryHref={p.proof.href}
        secondaryLabel={p.proof.label}
        secondaryExternal
      />

      <SplitImageCopy
        eyebrow="The problem"
        title="อยากโตออนไลน์ แต่ไม่ต้องการทีมเอเจนซี่แบบเดิม"
        image={p.images.problem}
        imageAlt="ธุรกิจไม่มีทีมการตลาดเต็ม"
        items={[...partnerProblems]}
      />

      <OutcomeGrid eyebrow="Partnership" title="สิ่งที่ได้เมื่อเป็นพาร์ทเนอร์" items={[...partnerOutcomes]} />

      <SplitImageCopy
        eyebrow="Partnership"
        title="ทำงานร่วมกันแบบพาร์ทเนอร์"
        intro="ออกแบบขอบเขตงานและข้อตกลงให้ตรงกับธุรกิจคุณ ไม่ยัดแพ็กเกจเดียวกันทุกเคส"
        image={p.images.model}
        imageAlt="โมเดลพาร์ทเนอร์ PuchUp"
        reverse
        dark
        items={[
          {
            title: "เหมาะกับใคร",
            body: partnerFit.join(" · "),
          },
          {
            title: "ตัวอย่างแนวทาง",
            body: `${p.proof.name} — ${p.proof.summary}`,
          },
        ]}
      />

      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 md:px-8 lg:px-8">
        <ul className="grid gap-3 md:grid-cols-2">
          {partnerFit.map((line) => (
            <li
              key={line}
              className="rounded-xl border border-slate-200/70 bg-cream/40 px-4 py-3 text-[14.5px] leading-relaxed text-ink/80"
            >
              {line}
            </li>
          ))}
        </ul>
      </div>

      <StepsPriceBlock
        priceLabel={p.priceLabel}
        priceNote={p.priceNote}
        steps={[...partnerSteps]}
        image={p.images.model}
        imageAlt="เริ่มพาร์ทเนอร์"
      />

      <ProductFinalCta
        title="สนใจเป็นพาร์ทเนอร์กับ PuchUp?"
        body="เล่าธุรกิจและเป้าหมายสั้นๆ ได้เลย — ทีมจะสรุปแนวทางพาร์ทเนอร์ที่เหมาะสมให้"
        extraHref={p.proof.href}
        extraLabel={p.proof.label}
      />
    </section>
  );
}
