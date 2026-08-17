import { ImagePromptFallback } from "@/components/sanity/ImagePromptFallback";
import { PortableTextRenderer } from "@/components/sanity/PortableTextRenderer";
import { SafeCodeRunner } from "@/components/sanity/SafeCodeRunner";
import { imageUrl } from "@/lib/sanity/image";
import type { DemoSite } from "@/lib/sanity/types";

export function DemoSiteView({ site }: { site: DemoSite }) {
  const brand = site.brandDetails;
  const theme = brand.theme || {};
  const logo = imageUrl(brand.logo, 200);
  const fullPage = Boolean(site.codeEmbed?.fullPage);

  const cssVars = {
    ["--demo-primary" as string]: theme.primary || "#0d182c",
    ["--demo-secondary" as string]: theme.secondary || "#596273",
    ["--demo-accent" as string]: theme.accent || "#f0553c",
    ["--demo-bg" as string]: theme.background || "#fcfaf5",
    ["--demo-text" as string]: theme.text || "#172033",
  };

  if (fullPage && site.codeEmbed) {
    return (
      <div className="min-h-dvh bg-white">
        <SafeCodeRunner embed={site.codeEmbed} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        ...cssVars,
        background: "var(--demo-bg)",
        color: "var(--demo-text)",
      }}
    >
      <header className="border-b border-black/5 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt={brand.logo?.alt || brand.name}
                className="h-10 w-10 rounded-xl object-cover"
              />
            ) : (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
                style={{ background: "var(--demo-primary)" }}
              >
                {brand.name.slice(0, 1)}
              </div>
            )}
            <div>
              <p className="font-semibold leading-tight">{brand.name}</p>
              <p className="text-xs text-slate-500">
                {site.subdomain}.puchup.com
              </p>
            </div>
          </div>
          {brand.menuLinks?.length ? (
            <nav className="hidden items-center gap-5 text-sm font-medium md:flex">
              {brand.menuLinks.map((link) => (
                <a
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  {...(link.openInNewTab
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="hover:opacity-70"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        <section className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{brand.name}</h1>
          {brand.description ? (
            <p className="max-w-2xl text-lg text-slate-600">
              {brand.description}
            </p>
          ) : null}
        </section>

        {site.codeEmbed ? <SafeCodeRunner embed={site.codeEmbed} /> : null}

        {site.imagePrompts?.length ? (
          <section>
            <h2 className="mb-6 text-2xl font-bold tracking-tight">
              Image slots
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {site.imagePrompts.map((slot) => {
                const src = imageUrl(slot.imageUpload, 1000);
                return (
                  <div key={slot._key || slot.slotName}>
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={src}
                        alt={slot.imageUpload?.alt || slot.slotName}
                        className="w-full rounded-2xl object-cover"
                      />
                    ) : (
                      <ImagePromptFallback
                        slotName={slot.slotName}
                        promptText={slot.promptText}
                        aspectRatio={slot.aspectRatio}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        {site.body?.length ? (
          <section>
            <PortableTextRenderer value={site.body} />
          </section>
        ) : null}
      </main>
    </div>
  );
}
