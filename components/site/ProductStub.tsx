import Image from "next/image";
import Link from "next/link";
import type { CatalogProduct } from "@/lib/site";
import { site } from "@/lib/site";

type Props = {
  product: CatalogProduct;
  highlights?: string[];
  ctaHref?: string;
  ctaLabel?: string;
};

export function ProductStub({
  product,
  highlights = [],
  ctaHref = "/contact/",
  ctaLabel = site.cta.primary,
}: Props) {
  return (
    <section className="bg-base">
      <div className="relative overflow-hidden bg-navy text-base">
        <div className="absolute inset-0 opacity-40">
          <Image
            src={product.image}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/70" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-24 lg:px-8">
          <Link
            href="/#products"
            className="text-[13px] font-medium text-base/60 transition hover:text-base"
          >
            ← กลับไปสินค้าทั้งหมด
          </Link>
          <p className="eyebrow mt-6 text-[11px] uppercase text-aamber">{product.status}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-2 text-lg font-medium text-base/80 md:text-xl">{product.nameTh}</p>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-base/70">
            {product.blurb}
          </p>
          {product.price ? (
            <p className="mt-4 text-lg font-semibold text-aamber">{product.price}</p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={ctaHref}
              className="inline-flex rounded-xl bg-base px-5 py-3 text-[15px] font-semibold text-navy transition hover:opacity-90"
            >
              {ctaLabel}
            </Link>
            <Link
              href="/contact/"
              className="inline-flex rounded-xl border border-base/30 px-5 py-3 text-[15px] font-semibold text-base transition hover:bg-base/10"
            >
              {site.cta.primary}
            </Link>
          </div>
        </div>
      </div>

      {highlights.length > 0 ? (
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 md:px-8 lg:px-8">
          <h2 className="text-2xl font-bold text-ink">จุดเด่น</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {highlights.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 text-[15px] leading-relaxed text-muted shadow-sm backdrop-blur-md"
              >
                <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-aorange align-middle" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
