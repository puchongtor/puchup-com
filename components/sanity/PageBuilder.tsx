import { DemoShowcaseGridBlock } from "@/components/sanity/DemoShowcaseGridBlock";
import { HeroSectionBlock } from "@/components/sanity/HeroSectionBlock";
import { PortableTextRenderer } from "@/components/sanity/PortableTextRenderer";
import type { PageSection, RichTextSection } from "@/lib/sanity/types";

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
          case "richTextSection":
            return (
              <RichTextSectionBlock key={section._key} data={section} />
            );
          case "demoShowcaseGrid":
            return (
              <DemoShowcaseGridBlock key={section._key} data={section} />
            );
          default:
            return null;
        }
      })}
    </>
  );
}

function RichTextSectionBlock({ data }: { data: RichTextSection }) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {data.heading ? (
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900">
            {data.heading}
          </h2>
        ) : null}
        <PortableTextRenderer value={data.body} />
      </div>
    </section>
  );
}
