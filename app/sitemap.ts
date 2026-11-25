import type { MetadataRoute } from "next";
import { groups as craneGroups, href as craneHref, overview as craneOverview } from "@/app/demo/crane-rental/data";
import { corporateNiches } from "@/lib/corporate-demo/catalog";
import { saleHref } from "@/lib/corporate-demo/collection";
import { companyDetails, demoEntries, demoPageHref, detailKeys, sectionKeys } from "@/lib/corporate-demo/demo";
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
  const cranePaths = [
    craneHref(),
    ...Object.keys(craneOverview).filter(slug => slug !== "quote").map(craneHref),
    ...craneGroups.flatMap(group => group.entries.map(({ slug }) => craneHref(`${group.slug}/${slug}`))),
  ];
  const corporatePaths = corporateNiches.map(niche => saleHref(niche.slug));
  const companyPaths = Object.keys(companyDetails).flatMap(niche => {
    const entries = demoEntries(niche);
    if (!entries) return [];
    return [
      demoPageHref(niche),
      ...sectionKeys.filter(section => section !== "quote").map(section => demoPageHref(niche, section)),
      ...detailKeys.flatMap(section => entries[section].map(item => demoPageHref(niche, section, item.slug))),
    ];
  });
  return [
    ...[...core, ...industries, ...demos, ...cases, ...guides].map((path) => ({ url: `${site.url}/${path}`, lastModified: new Date() })),
    ...[...cranePaths, ...corporatePaths, ...companyPaths].map(path => ({ url: site.url + path })),
  ];
}
