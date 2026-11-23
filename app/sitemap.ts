import type { MetadataRoute } from "next";
import { allCaseSlugs } from "@/lib/case-stories";
import { allGuideSlugs } from "@/lib/guides/catalog";
import { allDemoSlugs } from "@/lib/project-one/slugs";
import { industryPages } from "./ProjectONE/_industry/content";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const core = [
    "",
    "products/",
    "corporate/",
    "shopguide/",
    "partner/",
    "opscraft/",
    "sale/",
    "sale/demo/",
    "about/",
    "contact/",
    "ProjectONE/",
    "ProjectONE/demo/",
    "ProjectONE/google/",
    "sites/aeropulse/",
    "sites/restaurant/",
    "build/",
    "showcase/",
    "showcase/aeropulse/",
    "showcase/project-one/",
    "showcase/results/",
    "guides/",
    "how-we-work/",
  ];

  const demos = allDemoSlugs().map((slug) => `ProjectONE/${slug}/`);
  const industries = industryPages.map(({ slug }) => `ProjectONE/${slug}/`);
  const cases = allCaseSlugs().map((slug) => `showcase/results/${slug}/`);
  const guides = allGuideSlugs().map((slug) => `guides/${slug}/`);

  return [...core, ...industries, ...demos, ...cases, ...guides].map((path) => ({
    url: `${site.url}/${path}`,
    lastModified: new Date(),
  }));
}
