import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  aboutAudience,
  aboutBeliefs,
  aboutCore,
  aboutPhilosophyLines,
  aboutPrinciples,
  aboutSteps,
} from "@/lib/about";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "PuchUp สร้างระบบที่ช่วยให้ธุรกิจทำงานได้ดีขึ้น — ทีมเล็กที่ลงมือทำจริง ไม่ขายคำโฆษณา",
};

export default function AboutPage() {
  return (
    <section className="bg-base">
      {/* Hero */}
      <div className="relative overflow-hidden bg-navy text-base">
        <Image
          src="/images/about/hero.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-50"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/50" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-24 lg:px-8">
          <p className="eyebrow text-[11px] uppercase text-aamber">{aboutCore.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {aboutCore.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-base/70 md:text-[17px]">
            {aboutCore.lead}
          </p>
          <p className="mt-4 max-w-xl border-l-2 border-aamber/50 pl-4 text-[14px] font-medium text-aamber/90">
            {aboutCore.phaseNote}
          </p>
        </div>
      </div>

      {/* Philosophy — locked lines */}
      <div className="border-b border-cream bg-cream/40">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-6 md:grid-cols-2 md:gap-14 md:px-8 md:py-24 lg:px-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/images/about/philosophy.jpg"
              alt="เริ่มจากคนและปัญหา"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="eyebrow text-[11px] uppercase text-apurple">Philosophy</p>
            <h2 className="mt-3 text-2xl font-bold leading-snug text-ink md:text-3xl">
              เทคโนโลยีที่ดีไม่ควรทำให้คนต้องเรียนรู้วิธีใช้มัน
            </h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-muted">
              ระบบที่ดีควรเข้าใจว่าคนต้องการอะไร แล้วช่วยพาเขาไปถึงคำตอบที่ง่ายที่สุด
              PuchUp จึงเริ่มจากคนและปัญหา ก่อนเลือกเทคโนโลยี
            </p>
            <div className="mt-8 border-t border-navy/10 pt-6">
              <p className="text-lg font-semibold leading-snug md:text-xl">
                <span className="grad-text">{aboutPhilosophyLines[0]}</span>
                <br />
                <span className="grad-text">{aboutPhilosophyLines[1]}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Beliefs */}
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-24 lg:px-8">
        <p className="eyebrow text-[11px] uppercase text-aorange">What we believe</p>
        <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight text-ink md:text-4xl">
          หลักคิดที่ต้องคงไว้ตลอด
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {aboutBeliefs.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-md"
            >
              <h3 className="text-lg font-bold text-ink">{item.title}</h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Audience + craft image */}
      <div className="bg-cream/50">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-6 md:grid-cols-2 md:gap-14 md:px-8 md:py-24 lg:px-8">
          <div className="order-2 md:order-1">
            <p className="eyebrow text-[11px] uppercase text-apurple">Who we build for</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              เราทำเพื่อใคร
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              ไม่ใช่ Enterprise ที่อยากได้เว็บสวยไว้โชว์ — แต่เป็นธุรกิจที่อยากให้ลูกค้าหาของเจอ
              ตัดสินใจได้ และติดต่อได้จริง
            </p>
            <div className="mt-8 space-y-5">
              {aboutAudience.map((item) => (
                <div key={item.title} className="border-l-2 border-aorange/40 pl-4">
                  <h3 className="font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-2xl md:order-2">
            <Image
              src="/images/about/audience.jpg"
              alt="ธุรกิจขนาดเล็กถึงกลาง"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>

      {/* How we work */}
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-24 lg:px-8">
        <div className="grid items-end gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow text-[11px] uppercase text-aorange">How we work</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              เราไม่ได้เริ่มจาก Template
            </h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted">
              เราเริ่มจากธุรกิจ แล้วสร้างระบบที่เหมาะกับมัน — ไม่บังคับธุรกิจเข้ากับแม่แบบสำเร็จรูป
            </p>
          </div>
          <div className="relative hidden aspect-[16/10] overflow-hidden rounded-2xl md:block">
            <Image
              src="/images/about/craft.jpg"
              alt="ออกแบบและสร้างระบบ"
              fill
              className="object-cover"
              sizes="40vw"
            />
          </div>
        </div>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {aboutSteps.map((step) => (
            <li
              key={step.n}
              className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-md"
            >
              <span className="eyebrow text-[11px] text-apurple">{step.n}</span>
              <h3 className="mt-2 font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Principles strip */}
      <div className="border-y border-cream bg-navy text-base">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 md:px-8 lg:px-8">
          <p className="eyebrow text-[11px] uppercase text-aamber">Standards</p>
          <h2 className="mt-3 text-2xl font-bold md:text-3xl">สิ่งที่เรายึดเป็นมาตรฐาน</h2>
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {aboutPrinciples.map((line) => (
              <li
                key={line}
                className="flex gap-3 rounded-xl border border-base/10 bg-base/5 px-4 py-3 text-[14.5px] leading-relaxed text-base/80"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-apurple to-aamber" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-20 lg:px-8">
        <div className="flex flex-col gap-6 rounded-2xl border border-slate-200/60 bg-cream/50 p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-ink md:text-3xl">เล่าธุรกิจให้เราฟัง</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              ไม่ต้องใช้คำศัพท์เทคนิค — บอกปัญหาที่เจอจริง เดี๋ยวช่วยคิดว่าระบบแบบไหนเหมาะ
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact/"
              className="inline-flex rounded-xl bg-navy px-5 py-3 text-[15px] font-semibold text-base transition hover:opacity-90"
            >
              {site.cta.primary}
            </Link>
            <Link
              href="/showcase/"
              className="inline-flex rounded-xl border border-navy/15 px-5 py-3 text-[15px] font-semibold text-ink transition hover:bg-base"
            >
              ดูผลงานจริง
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
