import { DemoShowcaseGridBlock } from "@/components/sanity/DemoShowcaseGridBlock";
import { HeroSectionBlock } from "@/components/sanity/HeroSectionBlock";
import { PortableTextRenderer } from "@/components/sanity/PortableTextRenderer";
import type {
  CtaSection,
  FeaturesSection,
  PageSection,
  PricingSection,
  RichTextSection,
} from "@/lib/sanity/types";

export function PageBuilder({ sections }: { sections?: PageSection[] }) {
  if (!sections?.length) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center text-slate-500 sm:px-6 lg:px-8">
        No sections yet. Add blocks in Sanity Studio.
      </div>
    );
  }

  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case "heroSection":
            return <HeroSectionBlock key={section._key} data={section} />;
          case "featuresSection":
            return <FeaturesSectionBlock key={section._key} data={section} />;
          case "pricingSection":
            return <PricingSectionBlock key={section._key} data={section} />;
          case "ctaSection":
            return <CtaSectionBlock key={section._key} data={section} />;
          case "richTextSection":
            return <RichTextSectionBlock key={section._key} data={section} />;
          case "demoShowcaseGrid":
            return <DemoShowcaseGridBlock key={section._key} data={section} />;
          default:
            return null;
        }
      })}
    </>
  );
}

function FeaturesSectionBlock({ data }: { data: FeaturesSection }) {
  return (
    <section className="bg-cream/60 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {data.heading ? (
          <h2 className="text-3xl font-bold tracking-tight text-ink">{data.heading}</h2>
        ) : null}
        {data.intro ? (
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{data.intro}</p>
        ) : null}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(data.items || []).map((item, index) => (
            <div
              key={item._key || `${item.title}-${index}`}
              className="rounded-2xl border border-cream bg-base p-6 shadow-sm"
            >
              {item.icon ? <span className="text-2xl">{item.icon}</span> : null}
              <h3 className="mt-4 text-lg font-semibold text-ink">{item.title}</h3>
              {item.body ? (
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{item.body}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSectionBlock({ data }: { data: PricingSection }) {
  return (
    <section className="bg-base py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {data.heading ? (
          <h2 className="text-3xl font-bold tracking-tight text-ink">{data.heading}</h2>
        ) : null}
        {data.intro ? (
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{data.intro}</p>
        ) : null}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {(data.plans || []).map((plan, index) => (
            <div
              key={plan._key || `${plan.name}-${index}`}
              className={`rounded-2xl border p-6 shadow-sm ${
                plan.highlighted
                  ? "border-aorange/50 bg-navy text-base"
                  : "border-cream bg-cream/40 text-ink"
              }`}
            >
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              {plan.price ? (
                <p className={`mt-2 text-2xl font-bold ${plan.highlighted ? "text-aamber" : ""}`}>
                  {plan.price}
                </p>
              ) : null}
              {plan.blurb ? (
                <p
                  className={`mt-2 text-[14px] ${plan.highlighted ? "text-base/70" : "text-muted"}`}
                >
                  {plan.blurb}
                </p>
              ) : null}
              {plan.features?.length ? (
                <ul className="mt-4 space-y-2 text-[14px]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span className={plan.highlighted ? "text-aamber" : "text-aorange"}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              ) : null}
              {plan.ctaLabel && plan.ctaHref ? (
                <a
                  href={plan.ctaHref}
                  className={`mt-6 inline-flex rounded-xl px-4 py-2 text-sm font-semibold ${
                    plan.highlighted
                      ? "bg-base text-navy"
                      : "bg-navy text-base"
                  }`}
                >
                  {plan.ctaLabel}
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const CTA_STYLES: Record<string, string> = {
  primary:
    "inline-flex rounded-xl bg-base px-5 py-2.5 text-sm font-semibold text-navy hover:opacity-90",
  secondary:
    "inline-flex rounded-xl border border-base/25 px-5 py-2.5 text-sm font-semibold text-base hover:bg-base/10",
  ghost: "inline-flex rounded-xl px-5 py-2.5 text-sm font-semibold text-aamber hover:underline",
};

function CtaSectionBlock({ data }: { data: CtaSection }) {
  return (
    <section className="bg-navy py-16 text-base">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        {data.heading ? <h2 className="text-3xl font-bold md:text-4xl">{data.heading}</h2> : null}
        {data.body ? (
          <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-base/70">{data.body}</p>
        ) : null}
        {data.ctas?.length ? (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
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
    </section>
  );
}

function RichTextSectionBlock({ data }: { data: RichTextSection }) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {data.heading ? (
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900">{data.heading}</h2>
        ) : null}
        <PortableTextRenderer value={data.body} />
      </div>
    </section>
  );
}
