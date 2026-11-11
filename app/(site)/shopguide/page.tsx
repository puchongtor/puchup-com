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
  shopguideBikeShots,
  shopguideFlow,
  shopguideLifestyle,
  shopguideModules,
  shopguideOutcomes,
  shopguideProblems,
  shopguideProduct,
  shopguideSteps,
} from "@/lib/products/shopguide";

export const metadata: Metadata = {
  title: `${shopguideProduct.name} — ${shopguideProduct.nameTh}`,
  description: shopguideProduct.blurb,
};

export default function ShopGuidePage() {
  const p = shopguideProduct;
  const img = p.images;

  return (
    <section className="bg-base">
      <ProductHero
        status={p.status}
        priceLabel={p.priceLabel}
        name={p.name}
        nameTh={p.nameTh}
        tagline={p.tagline}
        heroImage={img.hero}
        secondaryHref={p.proof.href}
        secondaryLabel={p.proof.label}
        secondaryExternal
      />

      <SplitImageCopy
        eyebrow="The problem"
        title="ร้านมีสินค้าเยอะ แต่ลูกค้าเลือกไม่จบ"
        image={img.problem}
        imageAlt="ลูกค้าเลือกสินค้าไม่ถูกในโชว์รูม"
        items={[...shopguideProblems]}
      />

      <OutcomeGrid eyebrow="What you get" title="สิ่งที่ได้จาก ShopGuide" items={[...shopguideOutcomes]} />

      {/* Visual system — module gallery */}
      <div className="bg-navy text-base">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-24 lg:px-8">
          <p className="eyebrow text-[11px] uppercase tracking-[0.16em] text-aamber">ตัวอย่างการใช้งาน</p>
          <h2 className="mt-3 max-w-3xl text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em] md:text-4xl">
            จากแนะนำสินค้า ถึงส่งต่อทีมทาง LINE
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-base/65">
            {p.proof.summary}
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shopguideModules.map((mod) => (
              <article key={mod.title} className="overflow-hidden rounded-2xl border border-base/10 bg-base/[0.04]">
                <div className="relative aspect-[16/10]">
                  <Image src={mod.image} alt={mod.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                </div>
                <div className="p-5">
                  <h3 className="text-[16px] font-semibold tracking-tight">{mod.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-[1.65] text-base/60">{mod.body}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={p.proof.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-xl bg-base px-5 py-3 text-[14px] font-semibold tracking-tight text-navy"
            >
              {p.proof.label} →
            </a>
            <Link
              href={p.proof.caseHref}
              className="inline-flex rounded-xl border border-base/30 px-5 py-3 text-[14px] font-semibold tracking-tight text-base"
            >
              {p.proof.caseLabel}
            </Link>
          </div>
        </div>
      </div>

      {/* Catalog bikes */}
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-24 lg:px-8">
        <p className="eyebrow text-[11px] uppercase tracking-[0.16em] text-aorange">Product shots</p>
        <h2 className="mt-3 max-w-2xl text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-4xl">
          ตัวอย่างรูปสินค้าในแคตตาล็อก
        </h2>
        <p className="mt-3 max-w-xl text-[15px] leading-[1.7] text-muted">
          โทนสตูดิโอ graphite + amber — ใช้เป็นตัวอย่างหน้าตาสินค้าบนเว็บร้าน
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {shopguideBikeShots.map((bike) => (
            <article key={bike.title}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-navy">
                <Image src={bike.image} alt={bike.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
              </div>
              <h3 className="mt-4 text-[16px] font-semibold tracking-tight text-ink">{bike.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-[1.65] text-muted">{bike.body}</p>
            </article>
          ))}
        </div>
      </div>

      {/* Flow path */}
      <div className="bg-cream/40">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-24 lg:px-8">
          <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
            <div>
              <p className="eyebrow text-[11px] uppercase tracking-[0.16em] text-aorange">Customer path</p>
              <h2 className="mt-3 text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-4xl">
                จาก Finder / แชท ถึง Line OA
              </h2>
              <ol className="mt-8 space-y-3">
                {shopguideFlow.map((step) => (
                  <li
                    key={step.n}
                    className="flex gap-4 rounded-xl border border-slate-200/70 bg-white/80 px-4 py-4 backdrop-blur-sm"
                  >
                    <span className="eyebrow shrink-0 pt-0.5 text-[11px] text-apurple">{step.n}</span>
                    <div>
                      <p className="text-[15px] font-semibold tracking-tight text-ink">{step.title}</p>
                      <p className="mt-1 text-[13.5px] leading-[1.65] text-muted">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="space-y-4">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200/60">
                <Image src={img.finder} alt="Smart Finder UI" fill className="object-cover object-top" sizes="(max-width:768px) 100vw, 50vw" />
              </div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200/60">
                <Image src={img.results} alt="ผลจับคู่ 3 รุ่น" fill className="object-cover object-top" sizes="(max-width:768px) 100vw, 50vw" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compare + Stock + LINE */}
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-24 lg:px-8">
        <p className="eyebrow text-[11px] uppercase tracking-[0.16em] text-apurple">Close the loop</p>
        <h2 className="mt-3 max-w-2xl text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-4xl">
          เทียบ · เช็คสต็อก · ส่ง Line
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { src: img.compare, label: "Compare", caption: "เทียบสเปกหลายรุ่นในตารางเดียว" },
            { src: img.stock, label: "Stock", caption: "สถานะไซซ์ / ETA ชัดก่อนคุยคน" },
            { src: img.lineButton, label: "Line OA", caption: "ปุ่มส่งต่อพร้อมข้อความสรุป" },
          ].map((item) => (
            <article key={item.label}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200/60 bg-navy">
                <Image src={item.src} alt={item.label} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
              </div>
              <p className="mt-4 text-[15px] font-semibold tracking-tight text-ink">{item.label}</p>
              <p className="mt-1 text-[13.5px] leading-[1.65] text-muted">{item.caption}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200/60">
            <Image src={img.lineHandoff} alt="Line handoff บนมือถือ" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200/60">
            <Image src={img.aiChat} alt="AI Expert chat widget" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
          </div>
        </div>
      </div>

      {/* Lifestyle */}
      <div className="bg-navy text-base">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-20 lg:px-8">
          <p className="eyebrow text-[11px] uppercase tracking-[0.16em] text-aamber">Atmosphere</p>
          <h2 className="mt-3 text-[2rem] font-semibold tracking-[-0.02em] md:text-4xl">โทนภาพแบรนด์ร้าน</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {shopguideLifestyle.map((shot) => (
              <div key={shot.title} className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                <Image src={shot.image} alt={shot.alt} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-4">
                  <p className="text-[13px] font-medium text-base/90">{shot.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <StepsPriceBlock
        priceLabel={p.priceLabel}
        priceNote={p.priceNote}
        steps={[...shopguideSteps]}
        image={img.lifeFit}
        imageAlt="ส่งมอบ ShopGuide"
      />

      <ProductFinalCta
        title="อยากให้ลูกค้าเลือกสินค้าได้เร็วขึ้น?"
        body="เล่าประเภทสินค้าและปัญหาที่ลูกค้าถามซ้ำมาได้เลย — หรือเปิดเดโม AeroPulse ดูหน้าตาก่อน"
        extraHref={p.proof.href}
        extraLabel={p.proof.label}
      />
    </section>
  );
}
