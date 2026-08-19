import { StickyAssistantLauncher } from "@/components/StickyAssistantLauncher";
import { PageBuilder } from "@/components/sanity/PageBuilder";
import { HomeFallback } from "@/components/site/HomeFallback";
import { sanityFetch } from "@/lib/sanity/client";
import { pageBySlugQuery } from "@/lib/sanity/queries";
import type { CmsPage } from "@/lib/sanity/types";

export default async function HomePage() {
  const cms = await sanityFetch<CmsPage>({
    query: pageBySlugQuery,
    params: { slug: "home" },
    tags: ["page:home"],
    revalidate: 3600,
  });

  if (cms?.sections?.length) {
    return (
      <>
        <PageBuilder sections={cms.sections} />
        <StickyAssistantLauncher />
      </>
    );
  }

  return <HomeFallback />;
}
