import type { MetadataRoute } from "next";
import { allDemoSlugs } from "@/lib/project-one/slugs";
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
    "sale/demo/sale/",
    "sale/demo/manager/",
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
    "how-we-work/",
  ];

  const demos = allDemoSlugs().map((slug) => `ProjectONE/${slug}/`);

  return [...core, ...demos].map((path) => ({
    url: `${site.url}/${path}`,
    lastModified: new Date(),
  }));
}
