import Image from "next/image";
import Link from "next/link";
import type { GuideArticle } from "@/lib/guides/catalog";
import { site } from "@/lib/site";

export function GuideArticleView({ guide }: { guide: GuideArticle }) {
  return (
    <article className="bg-base">
      <div className="border-b border-cream">
        <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6 md:px-8 md:py-12">
          <Link href="/guides/" className="text-[13px] font-medium text-muted transition hover:text-ink">
            ← คู่มือ
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-[12px] text-muted">
            <span>{guide.publishedLabel}</span>
            <span aria-hidden>·</span>
            <span>อ่าน {guide.readingMinutes} นาที</span>
          </div>
          <h1 className="mt-3 text-[1.65rem] font-semibold leading-[1.2] tracking-[-0.02em] text-ink md:text-[2rem]">
            {guide.title}
          </h1>
          <p className="mt-3 text-[15.5px] leading-[1.7] text-muted">{guide.excerpt}</p>
          <div className="relative mt-6 aspect-[16/9] max-h-56 overflow-hidden rounded-xl border border-slate-200/60 md:max-h-64">
            <Image
              src={guide.cover.src}
              alt={guide.cover.alt}
              fill
              className="object-cover object-center"
              sizes="(max-width:768px) 100vw, 768px"
              priority
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-10 px-5 py-10 sm:px-6 md:px-8 md:py-14">
        {guide.sections.map((section) => (
          <section key={section.h2}>
            <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-ink md:text-[1.4rem]">
              {section.h2}
            </h2>
            {section.paragraphs.map((p) => (
              <p key={p} className="mt-3 text-[15.5px] leading-[1.75] text-ink/85">
                {p}
              </p>
            ))}
            {section.bullets ? (
              <ul className="mt-4 space-y-2">
                {section.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-[15px] leading-[1.65] text-ink/85">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aorange" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {section.image ? (
              <figure className="relative mt-5 aspect-[4/3] max-h-72 overflow-hidden rounded-xl border border-slate-200/60">
                <Image
                  src={section.image.src}
                  alt={section.image.alt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width:768px) 100vw, 768px"
                />
                <figcaption className="sr-only">{section.image.alt}</figcaption>
              </figure>
            ) : null}
          </section>
        ))}

        {guide.summary ? (
          <aside className="rounded-2xl border border-aorange/25 bg-gradient-to-br from-cream/80 to-white p-5 md:p-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-aorange">
              {guide.summary.title || "สรุปสั้นๆ"}
            </p>
            {guide.summary.quote ? (
              <p className="mt-3 border-l-2 border-aorange/50 pl-3 text-[17px] font-medium leading-[1.65] text-ink md:text-[18px]">
                “{guide.summary.quote}”
              </p>
            ) : null}
            <ul className="mt-4 space-y-2.5">
              {guide.summary.points.map((point) => (
                <li key={point} className="flex gap-2 text-[16px] leading-[1.65] text-ink/85">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aorange" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}

        <div className="rounded-2xl border border-slate-200/60 bg-cream/40 p-6 md:p-8">
          <h2 className="text-xl font-semibold text-ink">อยากให้ช่วยไล่เส้นทางของร้านคุณ?</h2>
          <p className="mt-2 text-[14.5px] leading-[1.65] text-muted">
            บอกร้านอยู่ย่านไหนและอยากได้ลูกค้าแบบไหน — หรือดูเคสที่วัดจากการทักจริงก่อนก็ได้
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/contact/"
              className="inline-flex rounded-xl bg-navy px-4 py-2.5 text-[14px] font-semibold text-base"
            >
              {site.cta.primary}
            </Link>
            <Link
              href="/showcase/results/"
              className="inline-flex rounded-xl border border-navy/15 px-4 py-2.5 text-[14px] font-semibold text-ink"
            >
              ผลงานที่เห็นผล
            </Link>
            <Link
              href="/ProjectONE/"
              className="inline-flex rounded-xl border border-navy/15 px-4 py-2.5 text-[14px] font-semibold text-ink"
            >
              Project ONE
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
