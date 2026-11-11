import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "AeroPulse — Showcase" };

const journey = [
  "บอกความต้องการผ่านคำถามสั้นๆ หรือแชทกับผู้ช่วย",
  "ระบบคัดรุ่นที่เหมาะกับงบ เส้นทาง และประสบการณ์",
  "ดูผลลัพธ์พร้อมเหตุผลที่แนะนำ",
  "เปรียบเทียบรุ่นและเช็คสต็อกตามไซซ์",
  "ส่งสรุปไปยังทีมร้านทาง LINE",
  "ร้านติดต่อต่อได้โดยไม่ต้องถามซ้ำ",
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
            ตัวอย่างระบบ · ShopGuide
          </span>
          <h1 className="mb-4 text-4xl font-semibold tracking-[-0.025em] md:text-5xl">
            ช่วยลูกค้าเลือกจักรยานได้เร็วขึ้น
            <br />
            โดยไม่ต้องไล่สเปกเองทั้งร้าน
          </h1>
          <p className="text-[17px] text-muted">AeroPulse Bike Studio</p>
        </div>

        <div className="space-y-10 text-[15px] leading-[1.7]">
          <div>
            <h2 className="mb-2 text-xl font-semibold">ความท้าทาย</h2>
            <p className="text-muted">
              สินค้ามีหลายรุ่น แต่ลูกค้ามักเลือกไม่ถูก ใช้เวลานาน หรือออกจากเว็บไปก่อนตัดสินใจ
              ร้านจึงเสียโอกาสปิดการขาย
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-xl font-semibold">แนวทาง</h2>
            <p className="border-l-2 border-aorange/40 pl-4 font-medium text-ink">
              เว็บไม่ควรแค่โชว์ข้อมูลให้ครบ — ควรช่วยลูกค้าไปถึงคำตอบที่ใช่เร็วขึ้น
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-xl font-semibold">สิ่งที่ระบบทำได้</h2>
            <p className="text-muted">
              ผู้ช่วยแนะนำสินค้า คัดรุ่นที่เหมาะ เปรียบเทียบ เช็คสต็อก และส่งต่อทีมร้านทาง LINE
              พร้อมบริบทที่คุยไว้ — เป็นแนวทางเดียวกับสินค้า{" "}
              <Link href="/shopguide/" className="font-semibold text-aorange underline underline-offset-2">
                ShopGuide
              </Link>
            </p>
          </div>
          <div>
            <h2 className="mb-4 text-xl font-semibold">เส้นทางของลูกค้า</h2>
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
              href="https://aeropulse.puchup.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-[15px] font-semibold text-aorange underline underline-offset-4"
            >
              เปิดตัวอย่างระบบ →
            </a>
            <p className="mt-2 text-[13px] text-muted">
              หรือดูพรีวิวบนไซต์ที่{" "}
              <a href="/sites/aeropulse/" className="underline underline-offset-2">
                /sites/aeropulse/
              </a>
            </p>
          </div>
        </div>

        <div className="mt-14 rounded-xl2 bg-navy p-8 text-center text-base">
          <h2 className="mb-3 text-2xl font-semibold">สนใจระบบช่วยเลือกสินค้าแบบนี้?</h2>
          <Link
            href="/contact/"
            className="mt-4 inline-flex rounded-xl bg-base px-5 py-3 text-[15px] font-semibold text-navy"
          >
            {site.cta.primary}
          </Link>
        </div>
      </div>
    </section>
  );
}
