import Link from "next/link";
import { cmsMediaUrl } from "@/lib/sanity/image";
import type { ProjectOneDemo } from "@/lib/sanity/types";

type Props = {
  demo: ProjectOneDemo;
};

export function ProjectOneCmsView({ demo }: Props) {
  const heroSrc = cmsMediaUrl(demo.hero?.image, demo.hero?.imageUrl, 1600);
  const heading = demo.hero?.heading || demo.title;
  const mapsHref =
    demo.locationInfo?.mapsUrl ||
    (demo.locationInfo?.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(demo.locationInfo.address)}`
      : undefined);

  return (
    <div className="min-h-dvh bg-[#FCFAF5] text-[#0D182C]">
      <nav className="sticky top-0 z-40 border-b border-[#E4DECB] bg-[#FCFAF5]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <p className="text-lg font-semibold tracking-tight">{demo.title}</p>
          <Link
            href="/demo/"
            className="text-xs font-semibold tracking-wider text-[#6B4EFF] uppercase"
          >
            Showroom →
          </Link>
        </div>
      </nav>

      <header className="relative">
        <div className="relative h-[58vh] min-h-[360px] overflow-hidden bg-[#1C1712]">
          {heroSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroSrc} alt={heading} className="h-full w-full object-cover" />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
            {demo.businessType ? (
              <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-amber-300 uppercase">
                {demo.businessType}
              </p>
            ) : null}
            <h1 className="text-4xl font-bold text-white md:text-6xl">{heading}</h1>
            {demo.hero?.tagline ? (
              <p className="mt-4 max-w-xl text-base text-white/85">{demo.hero.tagline}</p>
            ) : null}
          </div>
        </div>
      </header>

      {demo.menuOrServices?.length ? (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-[#6B4EFF] uppercase">
            Menu / Services
          </p>
          <h2 className="mt-2 text-3xl font-semibold">รายการแนะนำ</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {demo.menuOrServices.map((item) => {
              const src = cmsMediaUrl(item.image, item.imageUrl, 800);
              return (
                <article
                  key={item._key || item.name}
                  className="overflow-hidden rounded-2xl border border-[#E4DECB] bg-white shadow-sm"
                >
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt={item.name} className="h-44 w-full object-cover" />
                  ) : null}
                  <div className="p-5">
                    {item.category ? (
                      <p className="text-[10px] font-semibold tracking-wider text-[#FF8A45] uppercase">
                        {item.category}
                      </p>
                    ) : null}
                    <div className="mt-1 flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      {item.price ? (
                        <span className="shrink-0 text-sm font-bold">{item.price}</span>
                      ) : null}
                    </div>
                    {item.description ? (
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {demo.reviews?.length ? (
        <section className="border-y border-[#E4DECB] bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold">รีวิวจากลูกค้า</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {demo.reviews.map((review) => (
                <blockquote
                  key={review._key || review.author}
                  className="rounded-2xl border border-[#E4DECB] bg-[#FCFAF5] p-6"
                >
                  <p className="text-amber-600">
                    {"★".repeat(Math.round(review.rating || 5))}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {review.quote}
                  </p>
                  <footer className="mt-4 text-sm font-semibold">
                    {review.author}
                    {review.context ? (
                      <span className="block font-normal text-slate-400">
                        {review.context}
                      </span>
                    ) : null}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {demo.gallery?.length ? (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold">บรรยากาศ</h2>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {demo.gallery.map((shot, index) => {
              const src = cmsMediaUrl(shot.image, shot.imageUrl, 800);
              if (!src) return null;
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={shot._key || src}
                  src={src}
                  alt={shot.alt || `${demo.title} ${index + 1}`}
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                />
              );
            })}
          </div>
        </section>
      ) : null}

      {demo.locationInfo ? (
        <section className="border-t border-[#E4DECB] bg-[#F3EEE0] py-16">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
            <div className="rounded-2xl border border-[#E4DECB] bg-white p-7">
              <h2 className="text-2xl font-semibold">ที่ตั้งและเวลาเปิด</h2>
              {demo.locationInfo.address ? (
                <p className="mt-4 text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                  {demo.locationInfo.address}
                </p>
              ) : null}
              {demo.locationInfo.hours?.length ? (
                <ul className="mt-5 space-y-2 text-sm">
                  {demo.locationInfo.hours.map((row) => (
                    <li
                      key={`${row.days}-${row.time}`}
                      className="flex justify-between border-b border-[#E4DECB] pb-2"
                    >
                      <span className="text-slate-500">{row.days}</span>
                      <span className="font-medium">{row.time}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-6 flex flex-wrap gap-3">
                {mapsHref ? (
                  <a
                    href={mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#0D182C] px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    เปิด Google Maps
                  </a>
                ) : null}
                {demo.locationInfo.phone ? (
                  <a
                    href={`tel:${demo.locationInfo.phone.replace(/\s/g, "")}`}
                    className="rounded-full border border-[#E4DECB] px-5 py-2.5 text-sm font-semibold"
                  >
                    {demo.locationInfo.phone}
                  </a>
                ) : null}
              </div>
            </div>
            {demo.locationInfo.mapsEmbedUrl ? (
              <div className="overflow-hidden rounded-2xl border border-[#E4DECB] bg-white">
                <iframe
                  title={`แผนที่ ${demo.title}`}
                  src={demo.locationInfo.mapsEmbedUrl}
                  className="h-full min-h-[320px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
