import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { catalogProducts, labProducts, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "สินค้า",
  description: "ผลิตภัณฑ์และระบบของ PuchUp",
};

export default function ProductsPage() {
  return (
    <section className="bg-base">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-24 lg:px-8">
        <p className="eyebrow text-[11px] uppercase text-apurple">Products</p>
        <h1 className="mt-3 mb-3 max-w-3xl text-4xl font-bold md:text-5xl">สินค้าของเรา</h1>
        <p className="mb-12 max-w-2xl text-[16px] leading-relaxed text-muted">
          เลือกโปรเจคที่ตรงกับธุรกิจ — แต่ละระบบแยกโลกชัดเจน ไม่ปะปนกัน
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {catalogProducts.map((product) => (
            <Link
              key={product.id}
              href={product.href}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:border-aorange/35 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="text-[11px] font-medium text-apurple">{product.status}</span>
                <h2 className="mt-1 text-xl font-bold">{product.name}</h2>
                <p className="mt-1 text-sm text-ink/70">{product.nameTh}</p>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-muted">
                  {product.blurb}
                </p>
                {product.price ? (
                  <p className="mt-3 text-[14px] font-semibold text-aorange">{product.price}</p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-slate-200/60 bg-cream/50 p-6 md:p-8">
          <h2 className="text-xl font-bold">Lab · กำลังพัฒนา</h2>
          <ul className="mt-4 space-y-3">
            {labProducts.map((lab) => (
              <li key={lab.name}>
                <span className="font-semibold text-ink">{lab.name}</span>
                <span className="ml-2 text-[12px] text-apurple">{lab.status}</span>
                <p className="mt-1 text-[14px] text-muted">{lab.body}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10">
          <Link
            href="/contact/"
            className="inline-flex rounded-xl bg-navy px-5 py-3 text-[15px] font-semibold text-base"
          >
            {site.cta.primary}
          </Link>
        </div>
      </div>
    </section>
  );
}
