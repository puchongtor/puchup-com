import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { conceptCases, liveCases, showcaseHub } from "@/lib/showcase";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Showcase",
  description:
    "ตัวอย่างงานและระบบของ PuchUp — AeroPulse, Project ONE และเว็บธุรกิจที่เปิดใช้แล้ว",
};

function CaseCard(props: {
  name: string;
  nameTh: string;
  blurb: string;
  href: string;
  external?: boolean;
  product?: string;
  tags: string[];
  image: string;
  statusLabel: string;
}) {
  const inner = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden bg-navy">
        <Image
          src={props.image}
          alt={props.name}
          fill
          className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
          sizes="(max-width:768px) 100vw, 50vw"
        />
        <span className="absolute left-3 top-3 rounded-lg bg-navy/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-aamber backdrop-blur-sm">
          {props.statusLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        {props.product ? (
          <p className="eyebrow text-[10px] uppercase tracking-[0.14em] text-apurple">{props.product}</p>
        ) : null}
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink">{props.name}</h3>
        <p className="mt-1 text-[14px] font-medium text-ink/70">{props.nameTh}</p>
        <p className="mt-3 flex-1 text-[14px] leading-[1.65] text-muted">{props.blurb}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {props.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-slate-200/80 bg-cream/50 px-2 py-0.5 text-[11px] font-medium text-ink/75"
            >
              {tag}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[13.5px] font-semibold text-aorange">
          {props.external ? "เปิดเว็บไซต์ →" : "ดูรายละเอียด →"}
        </p>
      </div>
    </>
  );

  const className =
    "group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-md transition hover:border-navy/20";

  if (props.external) {
    return (
      <a href={props.href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={props.href} className={className}>
      {inner}
    </Link>
  );
}

export default function ShowcasePage() {
  return (
    <section className="bg-base">
      <div className="border-b border-cream bg-navy text-base">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-20 lg:px-8">
          <p className="eyebrow text-[11px] uppercase tracking-[0.16em] text-aamber">{showcaseHub.title}</p>
          <h1 className="mt-3 max-w-3xl text-[2.25rem] font-semibold leading-[1.12] tracking-[-0.025em] md:text-5xl">
            {showcaseHub.titleTh}
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-[1.7] text-base/70">{showcaseHub.intro}</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 md:px-8 md:py-20 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-[11px] uppercase tracking-[0.16em] text-aorange">Systems</p>
            <h2 className="mt-2 text-[1.75rem] font-semibold tracking-[-0.02em] text-ink md:text-3xl">
              {showcaseHub.conceptHeading}
            </h2>
          </div>
          <p className="max-w-md text-[13.5px] leading-[1.65] text-muted">{showcaseHub.conceptNote}</p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {conceptCases.map((c) => (
            <CaseCard key={c.id} {...c} />
          ))}
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-cream pt-14 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-[11px] uppercase tracking-[0.16em] text-apurple">Client sites</p>
            <h2 className="mt-2 text-[1.75rem] font-semibold tracking-[-0.02em] text-ink md:text-3xl">
              {showcaseHub.liveHeading}
            </h2>
          </div>
          <p className="max-w-md text-[13.5px] leading-[1.65] text-muted">{showcaseHub.liveNote}</p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {liveCases.map((c) => (
            <CaseCard key={c.id} {...c} />
          ))}
        </div>

        <div className="mt-20 overflow-hidden rounded-2xl bg-navy p-8 text-base md:p-12">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] md:text-3xl">
            พร้อมเริ่มโปรเจคในแนวทางที่เหมาะกับคุณ?
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-[1.7] text-base/65">
            บอกประเภทธุรกิจและเป้าหมายสั้นๆ ได้เลย — ทีมจะแนะนำแนวทางและตัวอย่างที่ใกล้เคียงที่สุดให้
          </p>
          <Link
            href="/contact/"
            className="mt-7 inline-flex rounded-xl bg-base px-5 py-3 text-[15px] font-semibold text-navy transition hover:opacity-90"
          >
            {site.cta.primary}
          </Link>
        </div>
      </div>
    </section>
  );
}
