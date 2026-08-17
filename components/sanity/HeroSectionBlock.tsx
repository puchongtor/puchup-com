import { imageUrl } from "@/lib/sanity/image";
import type { HeroSection as HeroSectionData } from "@/lib/sanity/types";

const CTA_STYLES: Record<string, string> = {
  primary:
    "rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800",
  secondary:
    "rounded-xl border border-slate-200 bg-white/80 px-5 py-2.5 text-sm font-medium text-slate-800 shadow-sm backdrop-blur-md hover:bg-white",
  ghost:
    "rounded-xl px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100",
};

export function HeroSectionBlock({ data }: { data: HeroSectionData }) {
  const img = imageUrl(data.image, 1600);

  return (
    <section className="relative overflow-hidden">
      {img ? (
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt={data.image?.alt || ""}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/40 to-slate-950/70" />
        </div>
      ) : (
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-100 via-amber-50 to-slate-200" />
      )}

      <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-end px-4 py-16 sm:px-6 lg:px-8">
        <div className={img ? "text-white" : "text-slate-900"}>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            {data.heading}
          </h1>
          {data.subheading ? (
            <p
              className={`mt-4 max-w-2xl text-lg ${img ? "text-white/85" : "text-slate-600"}`}
            >
              {data.subheading}
            </p>
          ) : null}
          {data.ctas?.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {data.ctas.map((cta) => (
                <a
                  key={`${cta.href}-${cta.label}`}
                  href={cta.href}
                  className={CTA_STYLES[cta.style || "primary"]}
                >
                  {cta.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
