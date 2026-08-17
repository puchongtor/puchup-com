import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "AeroPulse — Showcase" };

const journey = [
  "ลูกค้าเล่าความต้องการ",
  "ระบบถามคำถามสำคัญ",
  "คัดตัวเลือกที่เหมาะ",
  "เปรียบเทียบสั้นๆ",
  "ลูกค้าตัดสินใจง่ายขึ้น",
  "ทีมได้ Lead ที่ชัดเจน",
];

export default function AeroPulsePage() {
  return (
    <section className="bg-base">
      <div className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24">
        <Link href="/showcase/" className="text-[14px] font-medium text-muted hover:text-ink">
          ← กลับ Showcase
        </Link>
        <div className="mt-6 mb-8">
          <span className="eyebrow mb-4 inline-block rounded-full bg-aamber/15 px-2.5 py-1 text-[10px] uppercase text-aamber">
            Demo / Concept
          </span>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            เราไม่ได้สร้างเว็บจักรยาน
            <br />
            เราสร้างระบบช่วยลูกค้าเลือกจักรยาน
          </h1>
          <p className="text-[17px] text-muted">AeroPulse Bike Studio</p>
        </div>

        <div className="space-y-10 text-[15px] leading-relaxed">
          <div>
            <h2 className="mb-2 text-xl font-semibold">Problem</h2>
            <p className="text-muted">
              ลูกค้าต้องไล่ดูสเปกจำนวนมากก่อนซื้อ ทำให้ตัดสินใจช้า และร้านเสียโอกาสปิดการขาย
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-xl font-semibold">Insight</h2>
            <p className="border-l-2 border-aorange/40 pl-4 font-medium text-ink">
              &quot;การให้ข้อมูลมากขึ้นไม่ได้แปลว่าลูกค้าจะตัดสินใจง่ายขึ้น&quot;
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-xl font-semibold">System</h2>
            <p className="text-muted">
              ผู้ช่วยในเว็บช่วยถาม แนะนำ และคัดจักรยานให้ตรงกับงบและสไตล์การใช้งาน — แล้วส่งต่อเป็น Lead ให้ทีม
            </p>
          </div>
          <div>
            <h2 className="mb-4 text-xl font-semibold">User Journey</h2>
            <ol className="grid gap-3 sm:grid-cols-2">
              {journey.map((step, i) => (
                <li key={step} className="rounded-xl2 border border-cream p-4">
                  <span className="eyebrow text-[11px] text-apurple">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-2 font-medium">{step}</p>
                </li>
              ))}
            </ol>
          </div>
            <div>
              <a
                href="/sites/aeropulse/"
                className="inline-flex text-[15px] font-semibold text-aorange underline underline-offset-4"
              >
                เปิด Live Demo บนเว็บ →
              </a>
              <p className="mt-2 text-[13px] text-muted">
                หรือ{" "}
                <a
                  href="https://aeropulse.puchup.com"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2"
                >
                  aeropulse.puchup.com
                </a>
              </p>
            </div>
        </div>

        <div className="mt-14 rounded-xl2 bg-navy p-8 text-center text-base">
          <h2 className="mb-3 text-2xl font-bold">อยากได้ระบบแบบนี้กับธุรกิจของคุณ?</h2>
          <Link
            href="/contact/"
            className="mt-4 inline-flex rounded-full bg-base px-5 py-3 text-[15px] font-semibold text-navy"
          >
            {site.cta.primary}
          </Link>
        </div>
      </div>
    </section>
  );
}
