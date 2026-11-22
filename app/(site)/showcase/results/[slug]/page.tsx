import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  allCaseSlugs,
  getCaseStory,
  getSeriesStories,
  type CaseBlock,
} from "@/lib/case-stories";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return allCaseSlugs().map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = getCaseStory(slug);
  if (!story) return { title: "Case Story" };
  return {
    title: story.titleTh,
    description: story.excerpt,
  };
}

function Block({ block }: { block: CaseBlock }) {
  if (block.type === "p") {
    return <p className="text-[16px] leading-[1.75] text-ink/85">{block.text}</p>;
  }
  if (block.type === "h2") {
    return (
      <h2 className="mt-2 text-[1.5rem] font-semibold tracking-[-0.02em] text-ink md:text-[1.75rem]">
        {block.text}
      </h2>
    );
  }
  if (block.type === "ul") {
    return (
      <ul className="space-y-2 pl-1 text-[15.5px] leading-[1.7] text-ink/85">
        {block.items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aorange" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <figure className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
      <div className="relative aspect-[16/10] bg-cream/40">
        <Image
          src={block.src}
          alt={block.alt}
          fill
          className="object-contain object-center p-1 sm:p-2"
          sizes="(max-width:768px) 100vw, 720px"
        />
      </div>
      {block.caption ? (
        <figcaption className="border-t border-slate-100 px-4 py-3 text-[13px] leading-relaxed text-muted">
          {block.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export default async function CaseStoryPage({ params }: Props) {
  const { slug } = await params;
  const story = getCaseStory(slug);
  if (!story) notFound();

  const series = getSeriesStories(story.seriesKey);
  const otherChapters = series.filter((s) => s.slug !== story.slug);

  return (
    <article className="bg-base">
      <div className="border-b border-cream bg-navy text-base">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 md:px-8 md:py-16 lg:px-8">
          <Link
            href="/showcase/results/"
            className="text-[13px] font-medium text-base/60 transition hover:text-base"
          >
            ← ผลงานที่เห็นผล
          </Link>
          <p className="eyebrow mt-6 text-[11px] uppercase tracking-[0.16em] text-aamber">
            Case Story · {story.chapterLabel}
          </p>
          <h1 className="mt-3 max-w-3xl text-[1.9rem] font-semibold leading-[1.15] tracking-[-0.025em] md:text-4xl lg:text-[2.6rem]">
            {story.titleTh}
          </h1>
          <p className="mt-4 max-w-2xl text-[15.5px] leading-[1.7] text-base/70">
            {story.excerpt}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-[13px] text-base/65">
            <span className="rounded-lg border border-base/15 bg-base/5 px-3 py-1.5">
              {story.client}
            </span>
            <span className="rounded-lg border border-base/15 bg-base/5 px-3 py-1.5">
              {story.publishedLabel}
            </span>
            {story.location ? (
              <span className="rounded-lg border border-base/15 bg-base/5 px-3 py-1.5">
                {story.location}
              </span>
            ) : null}
            <Link
              href={story.productHref}
              className="rounded-lg border border-aamber/30 bg-aamber/10 px-3 py-1.5 text-aamber transition hover:bg-aamber/20"
            >
              {story.product}
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 md:px-8 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {story.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-md"
            >
              <p className="text-[12px] font-medium uppercase tracking-wide text-muted">
                {stat.label}
              </p>
              <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                {stat.value}
              </p>
              {stat.note ? (
                <p className="mt-1 text-[12.5px] leading-snug text-muted">{stat.note}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 sm:px-6 md:grid-cols-[minmax(0,1fr)_280px] md:gap-12 md:px-8 md:pb-24 lg:px-8">
        <div className="space-y-8">
          {story.blocks.map((block, i) => (
            <Block key={`${block.type}-${i}`} block={block} />
          ))}

          <div className="rounded-2xl border border-slate-200/60 bg-cream/40 p-5 md:p-6">
            <p className="text-[13px] font-semibold text-ink">รายงานผล · {story.client}</p>
            <p className="mt-1 text-[13.5px] leading-[1.6] text-muted">
              แต่ละช่วงเวลาหลังขึ้นเว็บเป็นบทความแยก — ไม่ยัดอัปเดตลงหน้าเดิม
            </p>
            <ul className="mt-4 space-y-2">
              {series.map((item) => (
                <li key={item.slug}>
                  {item.slug === story.slug ? (
                    <span className="text-[14px] font-medium text-aorange">
                      {item.chapterLabel} · กำลังอ่าน
                    </span>
                  ) : (
                    <Link
                      href={`/showcase/results/${item.slug}/`}
                      className="text-[14px] font-medium text-ink transition hover:text-aorange"
                    >
                      {item.chapterLabel} →
                    </Link>
                  )}
                </li>
              ))}
              {otherChapters.length === 0 ? (
                <li className="text-[13.5px] text-muted">
                  รายงานถัดไป เช่น หลังทำเว็บครบ 1 เดือน จะเพิ่มเมื่อมีข้อมูลใหม่
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <aside className="md:sticky md:top-24 md:self-start">
          <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-md">
            <p className="eyebrow text-[10px] uppercase tracking-[0.14em] text-apurple">
              ต้องการแนวทางแบบนี้?
            </p>
            <p className="mt-3 text-[15px] leading-[1.65] text-ink/80">
              เล่าประเภทธุรกิจและพื้นที่มาได้ — ทีมจะแนะนำแพ็กเกจที่ใกล้เคียงกับเคสนี้
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <Link
                href="/contact/"
                className="inline-flex justify-center rounded-xl bg-navy px-4 py-3 text-[14px] font-semibold text-base transition hover:opacity-90"
              >
                {site.cta.primary}
              </Link>
              <Link
                href={story.productHref}
                className="inline-flex justify-center rounded-xl border border-navy/15 px-4 py-3 text-[14px] font-semibold text-ink transition hover:bg-cream/60"
              >
                ดู {story.product.split("·")[0].trim()}
              </Link>
              {story.siteUrl ? (
                <a
                  href={story.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center rounded-xl border border-navy/15 px-4 py-3 text-[14px] font-semibold text-ink transition hover:bg-cream/60"
                >
                  เปิดเว็บลูกค้า →
                </a>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
