import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { caseStories } from "@/lib/case-stories";

export const metadata: Metadata = {
  title: "ผลงานที่เห็นผล",
  description:
    "Case Stories จากงานจริงของ PuchUp — ผลค้นหา ทราฟฟิก และช่องทางติดต่อที่วัดได้",
};

export default function CaseStoriesIndexPage() {
  return (
    <section className="bg-base">
      <div className="border-b border-cream bg-navy text-base">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-20 lg:px-8">
          <Link
            href="/showcase/"
            className="text-[13px] font-medium text-base/60 transition hover:text-base"
          >
            ← Showcase
          </Link>
          <p className="eyebrow mt-6 text-[11px] uppercase tracking-[0.16em] text-aamber">
            Case Stories
          </p>
          <h1 className="mt-3 max-w-3xl text-[2.25rem] font-semibold leading-[1.12] tracking-[-0.025em] md:text-5xl">
            ผลงานที่เห็นผล
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-[1.7] text-base/70">
            เรื่องราวจากงานที่ขึ้นออนไลน์แล้ว — เน้นผลที่วัดได้ เช่น การค้นหา การคลิก
            และการทักคุยเพื่อนัด ไม่ใช่แค่หน้าสวย
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 md:px-8 md:py-20 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {caseStories.map((story) => (
            <Link
              key={story.slug}
              href={`/showcase/results/${story.slug}/`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-md transition hover:border-navy/20"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-navy">
                <Image
                  src={story.cover}
                  alt={story.client}
                  fill
                  className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
                <span className="absolute left-3 top-3 rounded-lg bg-navy/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-aamber backdrop-blur-sm">
                  {story.publishedLabel}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <p className="eyebrow text-[10px] uppercase tracking-[0.14em] text-apurple">
                  {story.product}
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">
                  {story.client}
                </h2>
                <p className="mt-2 text-[15px] font-medium leading-snug text-ink/80">
                  {story.titleTh}
                </p>
                <p className="mt-3 flex-1 text-[14px] leading-[1.65] text-muted">
                  {story.excerpt}
                </p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {story.tags.slice(0, 3).map((tag) => (
                    <li
                      key={tag}
                      className="rounded-md border border-slate-200/80 bg-cream/50 px-2 py-0.5 text-[11px] font-medium text-ink/75"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-[13.5px] font-semibold text-aorange">อ่านเคสนี้ →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
