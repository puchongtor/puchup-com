import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DEMO_THEME_FILES } from "@/lib/project-one/slugs";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Project ONE — Showcase",
  description: "ตัวอย่างเว็บหน้าเดียว × Google Business สำหรับหลายประเภทธุรกิจ",
};

const IMG = "/images/showcase/project-one";

const featured = [
  {
    slug: "restaurant",
    label: "ร้านอาหาร",
    blurb: "เมนู บรรยากาศ และช่องทางมาที่ร้าน",
    image: `${IMG}/p1-biz-restaurant.jpg`,
  },
  {
    slug: "dental",
    label: "คลินิกทันตกรรม",
    blurb: "สร้างความน่าเชื่อถือก่อนนัดหมาย",
    image: `${IMG}/p1-biz-dental.jpg`,
  },
  {
    slug: "cafe",
    label: "คาเฟ่",
    blurb: "โชว์บรรยากาศให้คนอยากแวะ",
    image: `${IMG}/p1-biz-cafe.jpg`,
  },
  {
    slug: "hotel",
    label: "ที่พัก / โฮเทล",
    blurb: "ห้องพัก จุดเด่น และช่องทางจอง",
    image: `${IMG}/p1-biz-hotel.jpg`,
  },
  {
    slug: "bakery",
    label: "เบเกอรี่",
    blurb: "สินค้าเด่นและจุดรับของ",
    image: `${IMG}/p1-biz-bakery.jpg`,
  },
  {
    slug: "bicycle",
    label: "ร้านจักรยาน",
    blurb: "โชว์ร้านและชวนมาดูของจริง",
    image: `${IMG}/p1-biz-bicycle.jpg`,
  },
  {
    slug: "petstore",
    label: "เพ็ทช็อป",
    blurb: "บริการที่ทำให้เจ้าของสัตว์เลี้ยงไว้ใจ",
    image: `${IMG}/p1-biz-petstore.jpg`,
  },
  {
    slug: "florist",
    label: "ร้านดอกไม้",
    blurb: "ผลงานดอกไม้และช่องทางสั่ง",
    image: `${IMG}/p1-biz-florist.jpg`,
  },
] as const;

const outcomes = [
  {
    title: "หน้าเดียวชัดเจน",
    body: "ข้อมูลสำคัญครบในที่เดียว — ไม่ต้องดูแลเว็บหลายหน้า",
  },
  {
    title: "เชื่อม Google Business",
    body: "ให้คนค้นหาเจอ ดูรีวิว และรู้ทางมาที่ร้าน",
  },
  {
    title: "ชวนให้มาที่สถานที่",
    body: "เน้นโทร จอง หรือเดินทางมา — เหมาะกับธุรกิจมีหน้าร้าน",
  },
] as const;

const totalThemes = Object.keys(DEMO_THEME_FILES).length;

export default function ProjectOneShowcasePage() {
  return (
    <section className="bg-base">
      {/* Hero */}
      <div className="relative overflow-hidden bg-navy text-base">
        <Image
          src={`${IMG}/p1-hero-storefront.jpg`}
          alt=""
          fill
          priority
          className="object-cover opacity-45"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/88 to-navy/50" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-24 lg:px-8">
          <Link href="/showcase/" className="text-[13px] font-medium text-base/60 transition hover:text-base">
            ← Showcase
          </Link>
          <p className="eyebrow mt-6 text-[11px] uppercase tracking-[0.16em] text-aamber">
            ตัวอย่างระบบ · Project ONE
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.025em] md:text-5xl lg:text-[3.25rem]">
            เว็บหน้าเดียวที่ช่วยให้ลูกค้า
            <br />
            รู้จัก ตัดสินใจ และอยากมาที่ร้าน
          </h1>
          <p className="mt-5 max-w-xl text-[16px] leading-[1.7] text-base/70">
            Project ONE × Google Business — ดูตัวอย่างตามประเภทธุรกิจที่ใกล้กับคุณ
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/ProjectONE/demo/"
              className="inline-flex rounded-xl bg-base px-5 py-3 text-[15px] font-semibold text-navy transition hover:opacity-90"
            >
              ดูตัวอย่างทั้งหมด
            </Link>
            <Link
              href="/ProjectONE/"
              className="inline-flex rounded-xl border border-base/30 px-5 py-3 text-[15px] font-semibold text-base transition hover:bg-base/10"
            >
              รายละเอียด Project ONE
            </Link>
          </div>
        </div>
      </div>

      {/* Split: who + phone visual */}
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-6 md:grid-cols-2 md:gap-14 md:px-8 md:py-24 lg:px-8">
        <div>
          <p className="eyebrow text-[11px] uppercase tracking-[0.16em] text-aorange">เหมาะกับใคร</p>
          <h2 className="mt-3 text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-4xl">
            ธุรกิจที่มีหน้าร้านหรือจุดให้บริการจริง
          </h2>
          <p className="mt-4 text-[15px] leading-[1.7] text-muted">
            อยากให้คนค้นหาเจอ เชื่อถือ แล้วตัดสินใจมาที่สถานที่ — โดยไม่ต้องดูแลเว็บหลายหน้า
            มีตัวอย่างกว่า {totalThemes} ประเภทธุรกิจให้ดูแนวทาง
          </p>
          <div className="mt-8 space-y-5">
            {outcomes.map((item) => (
              <div key={item.title} className="border-l-2 border-aorange/40 pl-4">
                <h3 className="font-semibold tracking-tight text-ink">{item.title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-[1.65] text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200/60 bg-navy shadow-sm">
          <Image
            src={`${IMG}/p1-phone-onepage.jpg`}
            alt="ตัวอย่างเว็บหน้าเดียวบนมือถือ"
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* Business grid */}
      <div className="bg-cream/40">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-24 lg:px-8">
          <p className="eyebrow text-[11px] uppercase tracking-[0.16em] text-apurple">Business types</p>
          <h2 className="mt-3 max-w-2xl text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-4xl">
            เลือกดูตามประเภทธุรกิจ
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-[1.7] text-muted">
            เปิดตัวอย่างที่ใกล้กับธุรกิจของคุณ — แต่ละแบบเป็นเว็บหน้าเดียวพร้อมแนวทางปิดการขาย
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((item) => (
              <Link
                key={item.slug}
                href={`/ProjectONE/${item.slug}/`}
                className="group overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:border-aorange/35 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                  <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="text-[15px] font-semibold tracking-tight text-ink">{item.label}</h3>
                  <p className="mt-1 text-[13px] leading-snug text-muted">{item.blurb}</p>
                  <p className="mt-3 text-[13px] font-semibold text-aorange">เปิดตัวอย่าง →</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/ProjectONE/demo/"
              className="inline-flex rounded-xl bg-navy px-5 py-3 text-[14px] font-semibold text-base transition hover:opacity-90"
            >
              ดูตัวอย่างทั้งหมด ({totalThemes})
            </Link>
            <Link
              href="/ProjectONE/"
              className="inline-flex rounded-xl border border-navy/15 px-5 py-3 text-[14px] font-semibold text-ink transition hover:bg-white/70"
            >
              รายละเอียด Project ONE
            </Link>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-20 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-navy p-8 text-base md:flex md:items-end md:justify-between md:gap-10 md:p-12">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] md:text-3xl">
              อยากได้หน้าเดียวสำหรับร้านคุณ?
            </h2>
            <p className="mt-3 text-[15px] leading-[1.7] text-base/65">
              บอกประเภทธุรกิจมาได้เลย — ทีมจะชี้ตัวอย่างที่ใกล้เคียงและสรุปแนวทางให้
            </p>
          </div>
          <Link
            href="/contact/"
            className="mt-7 inline-flex shrink-0 rounded-xl bg-base px-5 py-3 text-[15px] font-semibold text-navy transition hover:opacity-90 md:mt-0"
          >
            {site.cta.primary}
          </Link>
        </div>
      </div>
    </section>
  );
}
