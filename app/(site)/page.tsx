import Link from "next/link";
import { BusinessAssistant } from "@/components/BusinessAssistant";
import { StickyAssistantLauncher } from "@/components/StickyAssistantLauncher";
import { buildCards, featuredDemos, labProducts, processSteps, site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <section data-hero-navy className="relative overflow-hidden bg-navy text-base">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #F0553C, transparent 40%), radial-gradient(circle at 80% 0%, #7C3AED, transparent 35%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-10">
            <div>
              <span className="eyebrow mb-6 inline-block rounded-full border border-base/15 px-3 py-1.5 text-[11px] uppercase text-aamber/90">
                Business System Builder
              </span>
              <h1 className="mb-5 text-[2.3rem] leading-[1.15] font-bold md:text-[3.4rem] md:leading-[1.1]">
                PuchUp สร้าง
                <br />
                <span className="grad-text">ระบบผู้ช่วยธุรกิจ</span>
              </h1>
              <p className="mb-4 max-w-md text-[17px] leading-relaxed text-base/70">
                เราออกแบบเว็บไซต์และระบบดิจิทัลที่ไม่ได้มีไว้แค่ให้คนเข้ามาดู แต่ช่วยลูกค้าค้นหา
                ตัดสินใจ ติดต่อ และช่วยธุรกิจทำงานต่อได้
              </p>
              <p className="mb-8 max-w-md border-l-2 border-aamber/40 pl-3 text-[14.5px] leading-relaxed font-medium text-aamber/90">
                {site.philosophyLines[0]}
                <br />
                {site.philosophyLines[1]}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact/"
                  className="inline-flex items-center gap-2 rounded-full bg-base px-5 py-3 text-[15px] font-semibold text-navy transition hover:opacity-90"
                >
                  {site.cta.primary}
                </Link>
                <Link
                  href="/showcase/"
                  className="inline-flex items-center gap-2 rounded-full border border-base/25 px-5 py-3 text-[15px] font-semibold text-base transition hover:bg-base/10"
                >
                  {site.cta.explore}
                </Link>
              </div>
            </div>
            <BusinessAssistant />
          </div>
        </div>
      </section>

      <section className="bg-base">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="mb-10 max-w-2xl">
            <span className="eyebrow text-[11px] uppercase text-apurple">Project ONE</span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              One Page. Full Business.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              เว็บไซต์หน้าเดียว ที่ทำให้ลูกค้ารู้จักธุรกิจ ตัดสินใจ และอยากมาที่ร้าน —
              พร้อมเดโมร้านจริงที่ปรับเนื้อหาได้ผ่าน Sanity
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {featuredDemos.map((demo) => (
              <Link
                key={demo.href}
                href={demo.href}
                className="group flex flex-col rounded-xl2 border border-cream bg-cream/40 p-6 transition hover:border-aorange/40 hover:bg-base hover:shadow-lg"
              >
                <span className="eyebrow mb-3 inline-block w-fit rounded-full bg-aamber/15 px-2.5 py-1 text-[10px] uppercase text-aamber">
                  {demo.badge}
                </span>
                <h3 className="text-xl font-semibold text-ink">{demo.name}</h3>
                <p className="mt-1 text-[13px] text-muted">{demo.subtitle}</p>
                <p className="mt-4 flex-1 text-[14px] leading-relaxed text-muted">
                  {demo.blurb}
                </p>
                <span className="mt-5 text-[14px] font-semibold text-aorange group-hover:underline">
                  เปิดดู →
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/ProjectONE/"
              className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-[14px] font-semibold text-base hover:opacity-90"
            >
              เปิด Project ONE
            </Link>
            <Link
              href="/ProjectONE/Demo/"
              className="inline-flex items-center gap-2 rounded-full border border-navy/20 px-5 py-3 text-[14px] font-semibold text-ink hover:bg-cream/60"
            >
              เข้า Demo Hub
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-cream/60">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="mb-12 max-w-xl">
            <span className="eyebrow text-[11px] uppercase text-aorange">What We Build</span>
            <h2 className="mt-3 mb-4 text-3xl font-bold md:text-4xl">
              เราไม่ได้ขายจำนวนหน้าเว็บ
              <br />
              เราสร้างสิ่งที่ระบบช่วยทำได้
            </h2>
            <p className="leading-relaxed text-muted">เราเริ่มจากปัญหาของธุรกิจ แล้วออกแบบระบบเข้าไปช่วย</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {buildCards.map((card) => (
              <Link
                key={card.title}
                href="/showcase/"
                className="group rounded-xl2 border border-cream bg-base p-6 transition hover:border-aorange/40 hover:shadow-lg"
              >
                <span className="text-2xl">{card.icon}</span>
                <h3 className="mt-4 mb-1.5 text-lg font-semibold">{card.title}</h3>
                <p className="text-[14px] leading-relaxed text-muted">{card.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-base">
        <div className="mx-auto max-w-5xl px-5 py-20 md:px-8 md:py-28">
          <div className="mb-12 max-w-xl">
            <span className="eyebrow text-[11px] uppercase text-apurple">Ordinary vs PuchUp</span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              เว็บไซต์ที่ดีไม่ควรจบแค่การให้ข้อมูล
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl2 border border-cream p-7">
              <span className="eyebrow mb-5 block text-[11px] uppercase text-muted">เว็บไซต์ทั่วไป</span>
              <ul className="space-y-4 text-[15px] text-ink/80">
                {[
                  "ลูกค้าหาข้อมูลเอง",
                  "ลูกค้าเลือกเอง",
                  "ลูกค้ากรอกฟอร์ม",
                  "แชทแล้วจบ",
                  "ทีมจัดการข้อมูลเอง",
                  "เว็บไซต์เป็นปลายทาง",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-muted">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl2 bg-navy p-7 text-base">
              <span className="eyebrow mb-5 block text-[11px] uppercase text-aamber/90">PuchUp</span>
              <ul className="space-y-4 text-[15px]">
                {[
                  "ระบบช่วยค้นหา",
                  "ระบบช่วยตัดสินใจ",
                  "คุยเป็นธรรมชาติ",
                  "บทสนทนา → Lead",
                  "ข้อมูล → Workflow",
                  "เว็บไซต์เป็นส่วนหนึ่งของระบบ",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-aamber">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mx-auto mt-10 max-w-lg text-center text-[15px] leading-relaxed text-muted">
            เราไม่ได้พยายามทำให้เว็บไซต์ทำทุกอย่าง เราเลือกให้ระบบช่วยในจุดที่สร้างผลลัพธ์จริง
          </p>
        </div>
      </section>

      <section className="bg-cream/60">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow text-[11px] uppercase text-apurple">Showcase</span>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">ธุรกิจของคุณก็สร้างระบบแบบนี้ได้</h2>
              <p className="mt-3 max-w-md text-[15px] text-muted">
                ดูตัวอย่างว่าเราเปลี่ยนปัญหาธุรกิจให้กลายเป็นระบบได้อย่างไร
              </p>
            </div>
            <Link
              href="/showcase/"
              className="shrink-0 text-[15px] font-semibold text-ink underline decoration-cream underline-offset-4 hover:decoration-aorange"
            >
              ดู Showcase ทั้งหมด →
            </Link>
          </div>
          <Link
            href="/showcase/aeropulse/"
            className="block overflow-hidden rounded-xl2 bg-navy text-base md:grid md:grid-cols-2"
          >
            <div className="flex flex-col justify-center p-8 md:p-12">
              <span className="eyebrow mb-5 inline-block w-fit rounded-full bg-aamber/15 px-2.5 py-1 text-[10px] uppercase text-aamber">
                Demo / Concept
              </span>
              <p className="mb-6 text-xl leading-snug font-medium md:text-2xl">
                &quot;ลูกค้าไม่ควรต้องรู้จักจักรยานทุกคันก่อนซื้อ&quot;
              </p>
              <p className="mb-8 text-[15px] text-base/60">
                AeroPulse เป็นตัวอย่างแนวคิดระบบสำหรับร้านจักรยาน ที่ให้ลูกค้าคุยกับผู้ช่วยเพื่อค้นหาจักรยานที่เหมาะกับตัวเอง
                แทนการไล่ดูสเปกทีละคัน
              </p>
              <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-aamber">
                ดู Case Study →
              </span>
            </div>
            <div className="flex min-h-[220px] items-center justify-center bg-gradient-to-br from-apurple/30 via-aorange/20 to-aamber/20 p-10 md:min-h-0">
              <div className="w-full max-w-[240px] rounded-xl2 bg-base/95 p-4 text-[13px] text-ink shadow-xl">
                <p className="mb-2 text-muted">Smart Finder</p>
                <p className="mb-3 font-medium">&quot;อยากได้จักรยานปั่นในเมือง งบไม่เกิน 15,000&quot;</p>
                <div className="h-2 overflow-hidden rounded-full bg-cream">
                  <div className="grad-bg h-full w-3/4" />
                </div>
                <p className="mt-2 text-muted">พบ 4 รุ่นที่ตรงกับคุณ</p>
              </div>
            </div>
          </Link>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Link
              href="/sites/aeropulse/"
              className="rounded-xl2 border border-cream bg-base p-5 transition hover:border-aorange/40"
            >
              <p className="text-[13px] font-medium text-apurple">Live Demo</p>
              <p className="mt-1 font-semibold">aeropulse.puchup.com</p>
              <p className="mt-2 text-[14px] text-muted">เปิดเดโม Smart Finder บนเว็บ</p>
            </Link>
            <Link
              href="/sites/restaurant/"
              className="rounded-xl2 border border-cream bg-base p-5 transition hover:border-aorange/40"
            >
              <p className="text-[13px] font-medium text-apurple">Restaurant Demo</p>
              <p className="mt-1 font-semibold">restaurant.puchup.com</p>
              <p className="mt-2 text-[14px] text-muted">เดโมร้านอาหารแนว Project ONE</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-navy text-base">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center md:px-8 md:py-28">
          <span className="eyebrow text-[11px] uppercase text-aamber/90">Philosophy</span>
          <h2 className="mt-4 mb-6 text-3xl font-bold md:text-4xl">
            เทคโนโลยีควรทำงานแทนคน
            <br />
            ในจุดที่คนไม่ควรเสียเวลา
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-[16px] leading-relaxed text-base/70">
            ลูกค้าไม่ควรต้องไล่หาข้อมูลเองจนเหนื่อย ทีมไม่ควรทำงานซ้ำแบบเดิมทุกวัน
            ระบบที่ดีคือระบบที่ช่วยให้ธุรกิจไปต่อได้
          </p>
          <p className="text-[15px] font-medium text-aamber/90">
            {site.philosophyLines[0]}
            <br />
            {site.philosophyLines[1]}
          </p>
        </div>
      </section>

      <section className="bg-base">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="mb-12 max-w-xl">
            <span className="eyebrow text-[11px] uppercase text-aorange">How We Work</span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">จากปัญหาจริง สู่ระบบที่ใช้งานได้</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((step) => (
              <div key={step.n} className="rounded-xl2 border border-cream p-5">
                <span className="eyebrow text-[11px] text-apurple">{step.n}</span>
                <h3 className="mt-2 mb-2 font-semibold">{step.title}</h3>
                <p className="text-[13.5px] leading-relaxed text-muted">{step.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/how-we-work/"
              className="text-[15px] font-semibold text-ink underline decoration-cream underline-offset-4 hover:decoration-aorange"
            >
              {site.cta.understand}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-cream/60">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="mb-12 max-w-xl">
            <span className="eyebrow text-[11px] uppercase text-apurple">Products</span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Systems และ Labs</h2>
            <p className="mt-3 text-[15px] text-muted">
              เราแยกของที่พร้อมเป็นระบบธุรกิจ ออกจากของที่กำลังทดลองพัฒนา
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl2 border border-dashed border-cream bg-base p-8">
              <h3 className="mb-2 text-xl font-semibold">PuchUp Systems</h3>
              <p className="text-[14.5px] leading-relaxed text-muted">
                ยังไม่มี product ประกาศจริงในตอนนี้ — เมื่อพร้อมจะขึ้นที่นี่
              </p>
            </div>
            <div className="rounded-xl2 border border-cream bg-base p-8">
              <h3 className="mb-4 text-xl font-semibold">PuchUp Labs</h3>
              <div className="space-y-4">
                {labProducts.map((lab) => (
                  <div key={lab.name} className="border-t border-cream pt-4 first:border-0 first:pt-0">
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <h4 className="font-semibold">{lab.name}</h4>
                      <span className="text-[11px] text-muted">{lab.status}</span>
                    </div>
                    <p className="text-[14px] text-muted">{lab.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy text-base">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center md:px-8 md:py-20">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">พร้อมให้ระบบช่วยธุรกิจของคุณแล้วหรือยัง?</h2>
          <p className="mb-8 text-[16px] text-base/70">
            เล่าปัญหาธุรกิจมาได้เลย ไม่ต้องเตรียมบรีฟยาว
          </p>
          <Link
            href="/contact/"
            className="inline-flex items-center gap-2 rounded-full bg-base px-6 py-3.5 text-[15px] font-semibold text-navy transition hover:opacity-90"
          >
            {site.cta.primary}
          </Link>
        </div>
      </section>

      <StickyAssistantLauncher />
    </>
  );
}
