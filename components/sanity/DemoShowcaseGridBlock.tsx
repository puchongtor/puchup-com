import { ImagePromptFallback } from "@/components/sanity/ImagePromptFallback";
import { imageUrl } from "@/lib/sanity/image";
import type { DemoShowcaseGrid as DemoShowcaseGridData } from "@/lib/sanity/types";

export function DemoShowcaseGridBlock({
  data,
}: {
  data: DemoShowcaseGridData;
}) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {data.heading ? (
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            {data.heading}
          </h2>
        ) : null}
        {data.intro ? (
          <p className="mt-3 max-w-2xl text-slate-600">{data.intro}</p>
        ) : null}

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {(data.items || []).map((item, index) => {
            const src = imageUrl(item.image, 800);
            const key = item._key || `${item.title}-${index}`;
            const content = src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={item.title}
                className="aspect-[4/3] w-full rounded-2xl object-cover"
              />
            ) : item.promptText ? (
              <ImagePromptFallback
                promptText={item.promptText}
                slotName={item.title}
                aspectRatio="4:3"
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">
                No image
              </div>
            );

            const body = (
              <>
                {content}
                <div className="mt-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  {item.subtitle ? (
                    <p className="text-sm text-slate-500">{item.subtitle}</p>
                  ) : null}
                </div>
              </>
            );

            if (item.href) {
              return (
                <a key={key} href={item.href} className="group block">
                  {body}
                </a>
              );
            }
            return <div key={key}>{body}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
