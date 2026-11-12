import Image from "next/image";
import Link from "next/link";
import { LINE_OA_ID, LINE_OA_URL } from "@/lib/puchup-knowledge";
import { site } from "@/lib/site";

export function ProductHero(props: {
  status: string;
  priceLabel: string;
  name: string;
  nameTh: string;
  tagline: string;
  note?: string;
  heroImage: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  secondaryExternal?: boolean;
}) {
  return (
    <div className="relative overflow-hidden bg-navy text-base">
      <Image src={props.heroImage} alt="" fill priority className="object-cover opacity-45" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/88 to-navy/55" />
      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-24 lg:px-8">
        <Link href="/#products" className="text-[13px] font-medium text-base/60 transition hover:text-base">
          ← Products & Services
        </Link>
        <p className="eyebrow mt-6 text-[11px] uppercase text-aamber">
          {props.status} · {props.priceLabel}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.025em] md:text-5xl lg:text-[3.5rem]">
          {props.name}
        </h1>
        <p className="mt-2 text-lg font-medium tracking-tight text-base/85 md:text-xl">{props.nameTh}</p>
        <p className="mt-5 max-w-2xl text-[16px] leading-[1.7] text-base/70">{props.tagline}</p>
        {props.note ? (
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-base/50">{props.note}</p>
        ) : null}
        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href={props.primaryHref || "/contact/"}
            className="inline-flex rounded-xl bg-base px-5 py-3 text-[15px] font-semibold text-navy transition hover:opacity-90"
          >
            {props.primaryLabel || site.cta.primary}
          </Link>
          {props.secondaryHref ? (
            props.secondaryExternal ? (
              <a
                href={props.secondaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl border border-base/30 px-5 py-3 text-[15px] font-semibold text-base transition hover:bg-base/10"
              >
                {props.secondaryLabel}
              </a>
            ) : (
              <Link
                href={props.secondaryHref}
                className="inline-flex rounded-xl border border-base/30 px-5 py-3 text-[15px] font-semibold text-base transition hover:bg-base/10"
              >
                {props.secondaryLabel}
              </Link>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function SplitImageCopy(props: {
  eyebrow: string;
  title: string;
  intro?: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
  items: { title: string; body: string }[];
  dark?: boolean;
}) {
  const text = props.dark ? "text-base" : "text-ink";
  const muted = props.dark ? "text-base/65" : "text-muted";
  const wrap = props.dark ? "bg-navy text-base" : "bg-base";
  return (
    <div className={wrap}>
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-6 md:grid-cols-2 md:gap-14 md:px-8 md:py-24 lg:px-8">
        <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${props.reverse ? "md:order-2" : ""}`}>
          <Image src={props.image} alt={props.imageAlt} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
        </div>
        <div className={props.reverse ? "md:order-1" : ""}>
          <p className={`eyebrow text-[11px] uppercase ${props.dark ? "text-aamber" : "text-aorange"}`}>{props.eyebrow}</p>
          <h2 className={`mt-3 text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em] md:text-4xl ${text}`}>{props.title}</h2>
          {props.intro ? <p className={`mt-3 text-[15px] leading-[1.7] ${muted}`}>{props.intro}</p> : null}
          <div className="mt-8 space-y-5">
            {props.items.map((item) => (
              <div key={item.title} className={`border-l-2 pl-4 ${props.dark ? "border-aamber/40" : "border-aorange/40"}`}>
                <h3 className={`font-semibold ${text}`}>{item.title}</h3>
                <p className={`mt-1.5 text-[14.5px] leading-relaxed ${muted}`}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OutcomeGrid(props: {
  eyebrow: string;
  title: string;
  items: { title: string; body: string }[];
}) {
  return (
    <div className="bg-cream/50">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-24 lg:px-8">
        <p className="eyebrow text-[11px] uppercase text-apurple">{props.eyebrow}</p>
        <h2 className="mt-3 max-w-2xl text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-4xl">{props.title}</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {props.items.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-md">
              <h3 className="text-[17px] font-semibold tracking-tight text-ink">{item.title}</h3>
              <p className="mt-3 text-[14.5px] leading-[1.7] text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StepsPriceBlock(props: {
  priceLabel: string;
  priceNote: string;
  steps: { n: string; title: string; body: string }[];
  image: string;
  imageAlt: string;
}) {
  return (
    <div className="bg-cream/50">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-6 md:grid-cols-2 md:gap-14 md:px-8 md:py-24 lg:px-8">
        <div>
          <p className="eyebrow text-[11px] uppercase text-aorange">Pricing</p>
          <h2 className="mt-3 text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-4xl">{props.priceLabel}</h2>
          <p className="mt-4 text-[15px] leading-[1.7] text-muted">{props.priceNote}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {props.steps.map((step) => (
              <div key={step.n} className="rounded-xl border border-slate-200/70 bg-white/80 p-4">
                <span className="eyebrow text-[11px] text-apurple">{step.n}</span>
                <p className="mt-1 font-semibold text-ink">{step.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image src={props.image} alt={props.imageAlt} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
        </div>
      </div>
    </div>
  );
}

export function ProductFinalCta(props: { title: string; body: string; extraHref?: string; extraLabel?: string }) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:px-8 md:py-20 lg:px-8">
      <div className="overflow-hidden rounded-2xl bg-navy p-8 text-base md:p-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] md:text-3xl">{props.title}</h2>
            <p className="mt-3 text-[15px] leading-[1.7] text-base/65">{props.body}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact/"
              className="inline-flex rounded-xl bg-base px-5 py-3 text-[15px] font-semibold text-navy transition hover:opacity-90"
            >
              {site.cta.primary}
            </Link>
            {props.extraHref ? (
              props.extraHref.startsWith("/") ? (
                <Link
                  href={props.extraHref}
                  className="inline-flex rounded-xl border border-base/30 px-5 py-3 text-[15px] font-semibold text-base transition hover:bg-base/10"
                >
                  {props.extraLabel}
                </Link>
              ) : (
                <a
                  href={props.extraHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-xl border border-base/30 px-5 py-3 text-[15px] font-semibold text-base transition hover:bg-base/10"
                >
                  {props.extraLabel}
                </a>
              )
            ) : (
              <a
                href={LINE_OA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl bg-[#06C755] px-5 py-3 text-[15px] font-semibold text-white transition hover:opacity-90"
              >
                LINE {LINE_OA_ID}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
