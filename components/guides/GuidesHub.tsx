"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  guideMatchesTopic,
  guideTopics,
  primaryTopicLabel,
  type GuideArticle,
  type GuideTopicId,
} from "@/lib/guides/catalog";

type Props = {
  articles: GuideArticle[];
};

export function GuidesHub({ articles }: Props) {
  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState<GuideTopicId | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (activeTopic && !guideMatchesTopic(a.slug, activeTopic)) return false;
      if (!q) return true;
      const hay = `${a.title} ${a.excerpt} ${a.tags.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [articles, activeTopic, query]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="border-b border-cream py-10 md:py-12">
        <p className="eyebrow text-[11px] uppercase tracking-[0.16em] text-apurple">Guides</p>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-[2rem] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-4xl">
              คู่มือสำหรับเจ้าของร้าน
            </h1>
            <p className="mt-3 text-[15.5px] leading-[1.7] text-muted">
              รวมเรื่องที่เจ้าของธุรกิจมักสงสัยก่อนทำเว็บ — จากโซเชียล หมุด Google ไปจนถึงการให้ลูกค้าติดต่อร้านได้ง่ายขึ้น
            </p>
          </div>
          <p className="shrink-0 text-[13px] text-muted">
            {filtered.length === articles.length
              ? `${articles.length} บทความ`
              : `${filtered.length} จาก ${articles.length} บทความ`}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block min-w-0 flex-1 sm:max-w-sm">
            <span className="sr-only">ค้นหาคู่มือ</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหา เช่น ราคา, LINE, คาเฟ่"
              className="w-full rounded-xl border border-slate-200/70 bg-white px-3.5 py-2.5 text-[14.5px] text-ink outline-none ring-aorange/30 placeholder:text-muted/70 focus:ring-2"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTopic(null)}
            className={`rounded-xl px-3 py-1.5 text-[13px] font-medium transition ${
              activeTopic === null
                ? "bg-navy text-base"
                : "border border-slate-200/70 bg-white text-ink/80 hover:border-navy/20"
            }`}
          >
            ทั้งหมด
          </button>
          {guideTopics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => setActiveTopic(topic.id === activeTopic ? null : topic.id)}
              className={`rounded-xl px-3 py-1.5 text-[13px] font-medium transition ${
                activeTopic === topic.id
                  ? "bg-navy text-base"
                  : "border border-slate-200/70 bg-white text-ink/80 hover:border-navy/20"
              }`}
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>

      <div className="py-8 md:py-10">
        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-cream/40 px-5 py-10 text-center text-[15px] text-muted">
            ไม่พบบทความที่ตรงกับคำค้น — ลองเปลี่ยนคำหรือเลือกหมวดอื่น
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {filtered.map((guide) => {
              const topicLabel = primaryTopicLabel(guide.slug);
              return (
                <li key={guide.slug}>
                  <Link
                    href={guide.path}
                    className="group flex h-full gap-4 rounded-2xl border border-slate-200/60 bg-white/80 p-3.5 transition hover:border-aorange/30 hover:bg-cream/30 sm:gap-4 sm:p-4"
                  >
                    <div className="relative h-[4.75rem] w-[6.5rem] shrink-0 overflow-hidden rounded-xl border border-slate-200/60 sm:h-24 sm:w-36">
                      <Image
                        src={guide.cover.src}
                        alt=""
                        fill
                        className="object-cover object-center transition duration-300 group-hover:scale-[1.03]"
                        sizes="144px"
                      />
                    </div>
                    <div className="min-w-0 flex-1 py-0.5">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-muted">
                        {topicLabel ? (
                          <>
                            <span className="font-medium text-ink/70">{topicLabel}</span>
                            <span aria-hidden>·</span>
                          </>
                        ) : null}
                        <span>{guide.readingMinutes} นาที</span>
                      </div>
                      <h2 className="mt-1 text-[16px] font-semibold leading-snug tracking-tight text-ink transition group-hover:text-aorange md:text-[17px]">
                        {guide.title}
                      </h2>
                      <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-[1.55] text-muted">
                        {guide.excerpt}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
