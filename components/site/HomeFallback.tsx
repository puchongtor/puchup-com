import Image from "next/image";
import Link from "next/link";
import { brandAssets } from "@/components/Logo";
import { catalogProducts, labProducts, site } from "@/lib/site";
import { realWorks } from "@/lib/works";

const heroProducts = catalogProducts.slice(0, 3);
const heroWorks = realWorks.slice(0, 3);

export function HomeFallback() {
  return (
    <>
      <section
        data-hero-navy
        className="relative overflow-hidden bg-navy text-base"
      >
        <Image
          src="/images/home/hero-atmosphere.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-navy/60" />
        <div
          className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full opacity-40 blur-3xl"
          style={{
            background: "radial-gradient(circle, #7c3aed55, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute bottom-10 right-1/4 h-56 w-56 rounded-full opacity-35 blur-3xl"
          style={{
            background: "radial-gradient(circle, #f0553c44, transparent 70%)",
          }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-6 md:grid-cols-2 md:gap-12 md:px-8 md:py-24 lg:px-8 lg:py-28">
          <div>
            <Image
              src={brandAssets.horizontalDark}
              alt="PuchUp — Level up your business & life"
              width={800}
              height={268}
              className="h-28 w-auto max-w-[min(100%,28rem)] object-contain object-left sm:h-32 sm:max-w-[32rem] md:h-36 md:max-w-[36rem] lg:h-40"
              priority
            />
            <p className="mt-8 max-w-md text-xl font-semibold leading-snug text-base md:text-2xl">
              {site.tagline}
            </p>
            <p className="mt-3 max-w-lg text-[15.5px] leading-relaxed text-base/65">
              เว็บไซต์และระบบดิจิทัลที่ช่วยธุรกิจหาลูกค้า ปิดการขาย และทำงานได้เร็วขึ้น
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#products"
                className="inline-flex items-center gap-2 rounded-xl bg-base px-5 py-3 text-[15px] font-semibold text-navy transition hover:opacity-90"
              >
                {site.cta.explore}
              </a>
              <Link
                href="/contact/"
                className="inline-flex items-center gap-2 rounded-xl border border-base/30 px-5 py-3 text-[15px] font-semibold text-base transition hover:bg-base/10"
              >
                {site.cta.primary}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {heroProducts.map((p) => (
                <Link
                  key={p.id}
                  href={p.href}
                  className="rounded-lg border border-base/15 bg-base/5 px-2.5 py-1.5 text-[12px] font-medium text-base/80 transition hover:border-aamber/40 hover:text-base"
                >
                  {p.name}
                </Link>
              ))}
              <span className="rounded-lg border border-base/10 px-2.5 py-1.5 text-[12px] text-base/45">
                +{catalogProducts.length - heroProducts.length} more
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[1.75rem] bg-gradient-to-br from-apurple/25 via-transparent to-aorange/20 blur-xl" />
            <div className="relative overflow-hidden rounded-2xl border border-base/15 bg-navy/60 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center gap-2 border-b border-base/10 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-base/25" />
                <span className="h-2.5 w-2.5 rounded-full bg-base/25" />
                <span className="h-2.5 w-2.5 rounded-full bg-base/25" />
                <span className="ml-2 text-[11px] font-medium tracking-wide text-base/45">
                  puchup.com · products
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 p-3 sm:gap-3 sm:p-4">
                {heroProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={p.href}
                    className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-navy"
                  >
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 30vw, 160px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
                    <span className="absolute inset-x-2 bottom-2 text-[11px] font-semibold leading-tight text-base sm:text-xs">
                      {p.name}
                    </span>
                  </Link>
                ))}
              </div>
              <div className="border-t border-base/10 px-4 py-3">
                <p className="mb-2 text-[11px] uppercase tracking-wider text-aamber/80">
                  Showcase
                </p>
                <div className="flex gap-2 overflow-hidden">
                  {heroWorks.map((w) => (
                    <a
                      key={w.id}
                      href={w.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative h-14 flex-1 overflow-hidden rounded-lg border border-base/10"
                    >
                      <Image
                        src={w.image}
                        alt={w.name}
                        fill
                        className="object-cover object-top opacity-90"
                        sizes="120px"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="scroll-mt-20 bg-base">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-24 lg:px-8">
          <div className="mb-12 max-w-xl">
            <p className="eyebrow text-[11px] uppercase text-apurple">Products</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              สินค้าของเรา
            </h2>
            <p className="mt-3 text-[15.5px] leading-relaxed text-muted">
              เลือกแนวทางที่ตรงกับเป้าหมายธุรกิจของคุณ
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {catalogProducts.map((product) => (
              <Link
                key={product.id}
                href={product.href}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-aorange/35 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/55 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 rounded-lg bg-navy/75 px-2.5 py-1 text-[11px] font-medium text-base backdrop-blur-sm">
                    {product.status}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-apurple">
                    {product.accent}
                  </p>
                  <h3 className="mt-1.5 text-xl font-bold text-ink">{product.name}</h3>
                  <p className="mt-1 text-sm font-medium text-ink/70">{product.nameTh}</p>
                  <p className="mt-3 flex-1 text-[14px] leading-relaxed text-muted">
                    {product.blurb}
                  </p>
                  {product.price ? (
                    <p className="mt-4 text-[14px] font-semibold text-aorange">{product.price}</p>
                  ) : null}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-navy transition group-hover:text-aorange">
                    ดูรายละเอียด
                    <span
                      aria-hidden
                      className="transition group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-cream bg-navy text-base">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-20 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-[11px] uppercase text-aamber">Showcase</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">งานที่เปิดใช้แล้ว</h2>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-base/65">
                เว็บไซต์ที่ลูกค้าใช้งานจริง — และตัวอย่างระบบเพิ่มเติมใน Showcase
              </p>
            </div>
            <Link
              href="/showcase/"
              className="inline-flex shrink-0 text-[14px] font-semibold text-aamber transition hover:underline"
            >
              เปิด Showcase →
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {realWorks.map((work) => (
              <a
                key={work.id}
                href={work.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-2xl border border-base/10 bg-base/5 transition hover:border-aamber/40"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={work.image}
                    alt={work.name}
                    fill
                    className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <p className="text-[11px] uppercase tracking-wide text-aamber/90">{work.category}</p>
                  <h3 className="mt-1 text-lg font-bold">{work.name}</h3>
                  <p className="mt-1 text-[13px] text-base/60">{work.nameTh}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-cream bg-cream/50">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8 lg:px-8">
          <div>
            <p className="eyebrow text-[11px] uppercase text-muted">Lab</p>
            <h2 className="mt-2 text-xl font-bold text-ink md:text-2xl">กำลังพัฒนา</h2>
            <ul className="mt-3 space-y-1.5">
              {labProducts.map((lab) => (
                <li key={lab.name} className="text-[14.5px] text-muted">
                  <span className="font-semibold text-ink">{lab.name}</span>
                  {" — "}
                  {lab.body}
                  <span className="ml-2 text-[12px] text-apurple">{lab.status}</span>
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/contact/"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-navy px-5 py-3 text-[14px] font-semibold text-base transition hover:opacity-90"
          >
            มีไอเดียอื่น? คุยกับเรา
          </Link>
        </div>
      </section>
    </>
  );
}
