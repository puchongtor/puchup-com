"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type ExampleType = "plus" | "corporate";

export type WebsiteExample = {
  type: ExampleType;
  title: string;
  image: string;
  href: string;
};

const labels = {
  all: "ทั้งหมด",
  plus: "Project ONE Plus",
  corporate: "Corporate",
} as const;

const filters = ["all", "plus", "corporate"] as const;

export function WebsiteExamples({ examples }: { examples: WebsiteExample[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const plusCount = examples.filter(item => item.type === "plus").length;
  const counts = { all: examples.length, plus: plusCount, corporate: examples.length - plusCount };
  const visible = filter === "all" ? examples : examples.filter(item => item.type === filter);

  return (
    <section id="website-examples" aria-labelledby="website-examples-title" className="scroll-mt-24 border-t border-cream bg-base">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 md:px-8 md:py-20">
        <h2 id="website-examples-title" className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
          เว็บไซต์ตัวอย่างตามประเภทธุรกิจ
        </h2>
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="เลือกประเภทเว็บไซต์ตัวอย่าง">
          {filters.map(option => (
            <button
              key={option}
              type="button"
              aria-pressed={filter === option}
              aria-controls="website-example-grid"
              onClick={() => setFilter(option)}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition sm:px-4 ${filter === option ? "border-navy bg-navy text-base" : "border-slate-200 bg-white text-navy hover:border-navy/40"}`}
            >
              {labels[option]} <span className="text-xs tabular-nums opacity-75">{counts[option]}</span>
            </button>
          ))}
        </div>
        <p className="sr-only" role="status">แสดง {visible.length} เว็บไซต์ตัวอย่าง</p>
        <ul id="website-example-grid" className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {visible.map(example => (
            <li key={example.href}>
              <Link href={example.href} className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-navy/35 hover:shadow-sm">
                <div className="relative aspect-[16/9] overflow-hidden bg-navy">
                  <Image
                    src={example.image}
                    alt=""
                    fill
                    sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 210px"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="px-3 py-2.5">
                  <p className="text-[13px] text-muted">{labels[example.type]}</p>
                  <h3 className="mt-0.5 text-sm font-semibold leading-snug text-ink">{example.title}</h3>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
