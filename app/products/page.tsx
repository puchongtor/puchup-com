import type { Metadata } from "next";
import Link from "next/link";
import { labProducts, site } from "@/lib/site";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  return (
    <section className="bg-base">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <span className="eyebrow text-[11px] uppercase text-apurple">Products</span>
        <h1 className="mt-3 mb-4 max-w-3xl text-4xl font-bold md:text-5xl">
          PuchUp Systems และ PuchUp Labs
        </h1>
        <p className="mb-4 max-w-2xl text-[17px] leading-relaxed text-muted">
          Systems คือระบบที่พร้อมใช้งานกับธุรกิจ Labs คือของที่เรากำลังทดลองและพัฒนา
        </p>
        <p className="mb-14 max-w-2xl text-[14.5px] text-muted">
          เราไม่ใส่ฟีเจอร์ปลอม และไม่ใส่ตัวเลขหลอก — ของไหนยังไม่พร้อมจะบอกตรงๆ
        </p>

        <div className="mb-10 rounded-xl2 border border-dashed border-cream p-8 md:p-10">
          <h2 className="mb-2 text-2xl font-semibold">PuchUp Systems</h2>
          <p className="text-[15px] leading-relaxed text-muted">
            ยังไม่มี product ประกาศจริงในตอนนี้ เมื่อระบบพร้อมจะขึ้นที่นี่
          </p>
        </div>

        <div className="rounded-xl2 border border-cream p-8 md:p-10">
          <h2 className="mb-6 text-2xl font-semibold">PuchUp Labs</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {labProducts.map((lab) => (
              <div key={lab.name} className="rounded-xl2 bg-cream/50 p-5">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-semibold">{lab.name}</h3>
                  <span className="text-[11px] whitespace-nowrap text-muted">{lab.status}</span>
                </div>
                <p className="text-[14px] leading-relaxed text-muted">{lab.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <Link
            href="/contact/"
            className="inline-flex rounded-full bg-navy px-5 py-3 text-[15px] font-semibold text-base"
          >
            {site.cta.primary}
          </Link>
        </div>
      </div>
    </section>
  );
}
