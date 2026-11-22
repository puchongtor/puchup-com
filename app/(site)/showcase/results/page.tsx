import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { caseStories } from "@/lib/case-stories";
import { showcaseHub } from "@/lib/showcase";

export const metadata: Metadata = {
  title: "ผลงานที่เห็นผล",
  description:
    "Case Stories จากงานจริงของ PuchUp — ผลค้นหา ความเร็วเว็บพร้อม SEO และการทักที่วัดได้",
};

export default function CaseStoriesIndexPage() {
  return (
    <section className="bg-base">
      <div className="border-b border-cream bg-navy text-base">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 md:px-8 md:py-16 lg:px-8">
          <Link
            href="/showcase/"
            className="text-[13px] font-medium text-base/60 transition hover:text-base"
          >
            ← Showcase
          </Link>
          <p className="eyebrow mt-6 text-[11px] uppercase tracking-[0.16em] text-aamber">
            Case Stories
          </p>
          <h1 className="mt-3 max-w-3xl text-[2.1rem] font-semibold leading-[1.12] tracking-[-0.025em] md:text-4xl">
            ผลงานที่เห็นผล
          </h1>
          <p className="mt-4 max-w-2xl text-[15.5px] leading-[1.7] text-base/70">
            รายงานผลตามช่วงเวลาหลังขึ้นเว็บ เช่น 1 สัปดาห์ 3 สัปดาห์ หรือครบ 1 เดือน
            — แต่ละช่วงเป็นบทความแยก ไม่ยัดอัปเดตลงหน้าเดิม
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 md:px-8 md:py-12 lg:px-8">
        <div className="mb-10 overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 md:grid md:grid-cols-2">
          <div className="p-6 md:p-8">
            <p className="eyebrow text-[11px] uppercase tracking-[0.16em] text-apurple">
              Web quality
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink md:text-2xl">
              {showcaseHub.qualityHeading}
            </h2>
            <p className="mt-3 text-[14.5px] leading-[1.7] text-muted">{showcaseHub.qualityBody}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {showcaseHub.qualityMetrics.map((m) => (
                <span
                  key={m.label}
                  className="rounded-lg border border-slate-200/80 bg-cream/60 px-2.5 py-1.5 text-[12px] font-medium text-ink"
                >
                  <span className="font-semibold text-aorange">{m.value}</span> {m.label}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[12px] text-muted">{showcaseHub.qualityNote}</p>
          </div>
          <div className="relative min-h-[200px] border-t border-slate-200/60 md:min-h-full md:border-l md:border-t-0">
            <Image
              src={showcaseHub.qualityPanel}
              alt="แผงคะแนน PageSpeed และคุณภาพเว็บ"
              fill
              className="object-cover object-center"
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </div>
        </div>

        <ul className="divide-y divide-slate-200/70 overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80">
          {caseStories.map((story) => (
            <li key={story.slug}>
              <Link
                href={`/showcase/results/${story.slug}/`}
                className="group flex gap-3 px-3 py-3.5 transition hover:bg-cream/40 sm:gap-4 sm:px-5 sm:py-4"
              >
                <div className="relative h-[4.25rem] w-[6.5rem] shrink-0 overflow-hidden rounded-lg bg-navy sm:h-20 sm:w-32">
                  <Image
                    src={story.cover}
                    alt=""
                    fill
                    className="object-cover object-center transition duration-300 group-hover:scale-[1.03]"
                    sizes="128px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted">
                    <span className="font-medium text-aorange">{story.chapterLabel}</span>
                    <span aria-hidden>·</span>
                    <span>{story.publishedLabel}</span>
                  </div>
                  <h2 className="mt-1 text-[16px] font-semibold tracking-tight text-ink group-hover:text-aorange">
                    {story.client}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-[13.5px] leading-[1.55] text-muted">
                    {story.titleTh}
                  </p>
                  <ul className="mt-2 hidden flex-wrap gap-1.5 sm:flex">
                    {story.tags.slice(0, 3).map((tag) => (
                      <li
                        key={tag}
                        className="rounded-md border border-slate-200/80 bg-cream/50 px-2 py-0.5 text-[11px] font-medium text-ink/75"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="hidden shrink-0 self-center text-[13px] font-semibold text-aorange md:inline">
                  อ่านเคส →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
