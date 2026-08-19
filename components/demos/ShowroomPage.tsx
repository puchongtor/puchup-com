"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  coverFileFromUnsplash,
  DemoImage,
} from "@/components/demos/DemoImage";
import {
  SHOWROOM_CATEGORIES,
  SHOWROOM_FILTERS,
  liveShowroomItems,
  projectOneHref,
  type ShowroomCategory,
  type ShowroomItem,
} from "@/lib/demos/showroom-catalog";

type Props = {
  categories?: ShowroomCategory[];
  liveItems?: ShowroomItem[];
};

export function ShowroomPage({ categories, liveItems }: Props) {
  const catalog = categories ?? SHOWROOM_CATEGORIES;
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const live = liveItems ?? liveShowroomItems();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.map((cat) => {
      const typeOk = type === "all" || cat.type === type;
      const items = cat.items.filter((item) => {
        if (!q) return true;
        const hay = `${item.name} ${item.kind} ${cat.name} ${item.slug}`.toLowerCase();
        return hay.includes(q);
      });
      return { cat, typeOk, items };
    }).filter((row) => row.typeOk && row.items.length > 0);
  }, [catalog, query, type]);

  const matchCount = visible.reduce((n, row) => n + row.items.length, 0);

  return (
    <div className="showroom-root overflow-x-hidden">
      <nav className="sticky-nav fixed top-0 right-0 left-0 z-50 border-b border-[var(--line)]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link
            href="/ProjectONE/"
            className="font-display flex items-center gap-2.5 text-xl font-bold tracking-tight"
          >
            <span className="inline-block h-6 w-6 rounded bg-gradient-to-tr from-[var(--purple)] to-[var(--orange)]" />
            PuchUp
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-[var(--ink-soft)] md:flex">
            <a href="#concept" className="hover:text-[var(--ink)]">
              แนวคิด
            </a>
            <a href="#journey" className="hover:text-[var(--ink)]">
              เส้นทางลูกค้า
            </a>
            <a href="#featured" className="hover:text-[var(--ink)]">
              เคสตัวอย่าง
            </a>
            <a href="#showroom" className="hover:text-[var(--ink)]">
              50 โชว์รูมธุรกิจ
            </a>
          </div>
          <Link
            href="/contact/"
            className="font-mono rounded-full bg-[var(--ink)] px-5 py-3 text-xs font-bold tracking-wider text-white uppercase hover:opacity-90"
          >
            บอกธุรกิจของคุณ →
          </Link>
        </div>
      </nav>

      <header className="relative overflow-hidden px-6 pt-36 pb-20 md:pt-44">
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <p className="font-mono mb-6 text-xs font-bold tracking-[0.25em] text-[var(--purple)] uppercase">
            PuchUp Project ONE — Showroom
          </p>
          <h1 className="font-display mb-8 text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[0.95] font-semibold tracking-tight">
            ONE PAGE.
            <br />
            <span className="grad-text">FULL BUSINESS.</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-base leading-relaxed font-normal text-[var(--ink-soft)] md:text-xl">
            เราออกแบบเว็บไซต์หน้าเดียวให้ธุรกิจท้องถิ่นและมืออาชีพ จากการคำนวณพฤติกรรมลูกค้าจริง
            ตั้งแต่สิ่งที่เขาค้นหาบน Google สิ่งที่ต้องการรู้เพื่อสร้างความเชื่อมั่น
            ไปจนถึงจุดที่ทำให้เขาตัดสินใจเดินทางมาหาคุณที่หน้าร้าน
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#showroom"
              className="w-full rounded-full bg-[var(--ink)] px-8 py-4 text-sm font-medium text-white sm:w-auto hover:bg-opacity-90"
            >
              สำรวจ 50 ไอเดียธุรกิจ
            </a>
            <Link
              href="/ProjectONE/baankhaokhom/"
              className="w-full rounded-full border border-[var(--line)] bg-white px-8 py-4 text-sm font-medium text-[var(--ink)] sm:w-auto hover:bg-[var(--bg-alt)]"
            >
              ดูเคสจริง &quot;บ้านข้าวหอม&quot;
            </Link>
          </div>
        </div>
      </header>

      <section id="concept" className="border-y border-[var(--line)] bg-[var(--bg-alt)] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="font-mono mb-4 text-xs font-bold tracking-widest text-[var(--purple)] uppercase">
                The Philosophy
              </p>
              <h2 className="font-display mb-6 text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
                &quot;หน้าเดียว ไม่ได้แปลว่ามีแค่หน้าเดียว&quot;
              </h2>
              <p className="text-sm leading-relaxed text-[var(--ink-soft)] md:text-base">
                Project ONE ไม่ใช่ Landing Page ราคาประหยัดแบบทั่วไปที่เน้นขายของชิ้นเดียวแล้วจบ แต่คือ{" "}
                <strong>Business Presence</strong> ที่รวบรวมระบบและประสบการณ์ของธุรกิจทั้งระบบ มาร้อยเรียงให้กลายเป็นมหากาพย์หน้าเดียวที่สมบูรณ์แบบ
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3.5 text-center font-mono text-xs font-bold text-[var(--ink-soft)] sm:grid-cols-5 lg:col-span-7">
              {[
                ["01", "Discover", "ค้นพบ", "text-gray-400"],
                ["02", "Know", "เข้าใจ", "text-[var(--purple)]"],
                ["03", "Trust", "เชื่อมั่น", "text-gray-400"],
                ["04", "Decide", "ตัดสินใจ", "text-[var(--orange)]"],
                ["05", "Visit", "มาที่ร้าน", "text-black"],
              ].map(([n, en, th, color]) => (
                <div
                  key={en}
                  className="flex min-h-[135px] flex-col justify-between rounded-2xl border border-[var(--line)] bg-white p-5"
                >
                  <span className={`text-base ${color}`}>{n}</span>
                  <p className="mt-4 font-sans text-xs font-medium text-[var(--ink)]">
                    {en}
                    <br />
                    <span className="font-mono font-normal text-[var(--ink-faint)]">{th}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="journey"
        className="relative overflow-hidden bg-[var(--dark-section)] px-6 py-24 text-white"
      >
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-mono mb-6 text-xs font-bold tracking-[0.2em] text-[var(--orange)]">
            User Journey Architecture
          </p>
          <h2 className="font-display mb-8 text-3xl font-medium tracking-tight md:text-5xl">
            เราไม่ได้สร้างเว็บไซต์เพื่อให้คนเข้ามานั่งดูชม
            <br />
            <span className="text-gray-400">
              แต่เราวางโครงสร้างเพื่อเปลี่ยนคนดูให้กลายเป็น &quot;ลูกค้าที่หน้าร้าน&quot;
            </span>
          </h2>
          <div className="mt-16 grid grid-cols-1 gap-8 border-t border-gray-800 pt-12 text-left md:grid-cols-3">
            <div>
              <div className="font-mono mb-3 text-xs font-bold text-[var(--purple)]">
                [STAGE 01 — SEARCH]
              </div>
              <h3 className="mb-3 text-lg font-medium">Google &amp; Local Intent</h3>
              <p className="text-sm leading-relaxed text-gray-400">
                ลูกค้าค้นหาบริการใกล้ตัวบน Google Search หรือ Google Maps ข้อมูลของ Google Business
                Profile และโครงสร้างทางเทคนิคเบื้องหลังของ ONE จะทำงานประสานกัน
              </p>
            </div>
            <div>
              <div className="font-mono mb-3 text-xs font-bold text-[var(--orange)]">
                [STAGE 02 — ENGAGE]
              </div>
              <h3 className="mb-3 text-lg font-medium">The ONE Experience</h3>
              <p className="text-sm leading-relaxed text-gray-400">
                เมื่อกดลิงก์เข้ามา ลูกค้าจะพบหน้าร้านดิจิทัลที่มีข้อมูลครบถ้วน จังหวะการจัดวางภาพ
                บรรยากาศ รีวิว และเมนูถูกคิดมาเพื่อตอบคำถามในใจให้จบในหน้าเดียว
              </p>
            </div>
            <div>
              <div className="font-mono mb-3 text-xs font-bold text-green-400">
                [STAGE 03 — ACTION]
              </div>
              <h3 className="mb-3 text-lg font-medium">Action &amp; Conversion</h3>
              <p className="text-sm leading-relaxed text-gray-400">
                ปุ่มนำทาง แผนที่แบบฝัง ระบบจองเวลา หรือช่องทางติดต่อถูกจัดวางให้เปลี่ยนความสนใจเป็นการมาที่ร้านจริง
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono mb-2 text-xs font-bold tracking-wider text-[var(--purple)] uppercase">
            Featured Live Showroom
          </p>
          <h2 className="font-display mb-10 text-3xl font-semibold tracking-tight md:text-4xl">
            ธุรกิจที่ทำเดโมแล้ว — กดเข้าชมได้เลย
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {live.map((item) => (
              <LiveCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section id="showroom" className="border-t border-[var(--line)] bg-[var(--bg)] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="font-mono mb-3 text-xs font-bold tracking-wider text-[var(--purple)] uppercase">
              50 UNIQUE CONFIGURATIONS
            </p>
            <h2 className="font-display mb-6 text-3xl font-semibold tracking-tight md:text-5xl">
              50 ธุรกิจ · 50 วิธีคิดและออกแบบ
            </h2>
          </div>

          <div className="mx-auto mb-8 max-w-2xl">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="ค้นหาธุรกิจ หรือหมวดหมู่ที่คุณสนใจ..."
              className="w-full rounded-full border border-[var(--line)] bg-white px-6 py-4 text-sm shadow-sm outline-none focus:border-[var(--purple)]"
            />
          </div>

          <div className="mb-16 flex flex-wrap justify-center gap-2">
            {SHOWROOM_FILTERS.map((f) => (
              <button
                key={f.type}
                type="button"
                onClick={() => setType(f.type)}
                className={`filter-btn rounded-full border border-[var(--line)] bg-white px-4 py-2 text-xs font-medium ${
                  type === f.type ? "active" : ""
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {matchCount === 0 ? (
            <p className="py-16 text-center font-medium text-[var(--ink-soft)]">
              ไม่พบธุรกิจที่คุณค้นหา — ลองคำอื่น หรือเล่าธุรกิจให้ PuchUp ฟัง
            </p>
          ) : (
            <div className="space-y-16">
              {visible.map(({ cat, items }) => (
                <div key={cat.id} id={`group-${cat.id}`}>
                  <div className="mb-7 border-b border-[var(--line)] pb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cat.emoji}</span>
                      <h3 className="font-display text-2xl font-semibold text-[var(--ink)]">
                        {cat.name}
                      </h3>
                    </div>
                    <p className="mt-1.5 text-sm font-normal text-[var(--ink-soft)]">{cat.line}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {items.map((biz) => (
                      <BusinessCard key={biz.slug} item={biz} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section
        id="cta"
        className="relative overflow-hidden bg-[var(--dark-section)] px-6 py-24 text-center text-white"
      >
        <div className="relative z-10 mx-auto max-w-3xl">
          <h2 className="font-display mb-5 text-3xl font-medium tracking-tight md:text-5xl">
            อยากเห็นธุรกิจของคุณ
            <br />
            ในแบบ Project ONE?
          </h2>
          <Link
            href="/contact/"
            className="inline-flex rounded-full bg-gradient-to-r from-[var(--purple)] to-[var(--orange)] px-8 py-4 text-sm font-medium text-white hover:opacity-95"
          >
            ขอให้ออกแบบตัวอย่างธุรกิจของฉัน
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--line)] bg-[var(--bg)] py-10 text-center font-mono text-xs text-[var(--ink-faint)]">
        <p>puchup.com/projectone/[business-slug]</p>
        <p className="mt-3 font-sans text-[11px]">© 2026 PuchUp. All rights reserved.</p>
      </footer>
    </div>
  );
}

function LiveCard({ item }: { item: ShowroomItem }) {
  const href = projectOneHref(item.slug);
  return (
    <Link
      href={href}
      className="biz-card flex flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-white"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--bg-alt)]">
        <DemoImage
          slug={item.slug}
          file={coverFileFromUnsplash(item.img)}
          fallbackSrc={item.img}
          alt={item.name}
          className="h-full w-full object-cover"
        />
        <span className="absolute top-3 right-3 rounded-full bg-green-100 px-2.5 py-1 font-mono text-[10px] font-bold text-green-700">
          LIVE
        </span>
      </div>
      <div className="p-5">
        <p className="font-mono text-[10px] font-semibold tracking-wider text-[var(--purple)] uppercase">
          {item.kind}
        </p>
        <h3 className="font-display mt-1 text-lg font-semibold">{item.name}</h3>
        <p className="mt-3 text-xs font-bold tracking-wider text-[var(--ink)] uppercase">
          เปิดเดโม →
        </p>
      </div>
    </Link>
  );
}

function BusinessCard({ item }: { item: ShowroomItem }) {
  const href = projectOneHref(item.slug);
  return (
    <div className="biz-card flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
      <div>
        <div className="group relative aspect-[4/3] overflow-hidden bg-[var(--bg-alt)]">
          <DemoImage
            slug={item.slug}
            file={coverFileFromUnsplash(item.img)}
            fallbackSrc={item.img}
            alt={item.name}
            className="h-full w-full object-cover grayscale-[20%] transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
          />
          <span className="absolute bottom-3 left-3 rounded-md bg-white/90 px-2.5 py-1 font-mono text-[10px] text-[var(--ink)] shadow-sm">
            /ProjectONE/{item.slug}/
          </span>
        </div>
        <div className="p-5">
          <span className="font-mono text-[10px] font-semibold tracking-wider text-[var(--purple)] uppercase">
            {item.kind}
          </span>
          <h4 className="font-display mt-1 mb-2 text-lg font-semibold text-[var(--ink)]">
            {item.name}
          </h4>
          <div className="rounded-xl border border-[var(--line)]/60 bg-[var(--bg-alt)] p-3 text-[11px] leading-relaxed text-[var(--ink-soft)]">
            <strong className="font-mono mb-1 block text-[10px] tracking-wide text-[var(--orange)] uppercase">
              Architecture Stack
            </strong>
            {item.focus}
          </div>
        </div>
      </div>
      <div className="p-5 pt-0">
        {item.live ? (
          <Link
            href={href}
            className="font-mono block rounded-full border border-[var(--ink)] py-3 text-center text-xs font-bold tracking-wider text-[var(--ink)] uppercase transition-all hover:bg-[var(--ink)] hover:text-white"
          >
            Launch Live Demo →
          </Link>
        ) : (
          <span className="font-mono block rounded-full border border-[var(--line)] py-3 text-center text-xs font-bold tracking-wider text-[var(--ink-faint)] uppercase">
            กำลังออกแบบ
          </span>
        )}
      </div>
    </div>
  );
}
