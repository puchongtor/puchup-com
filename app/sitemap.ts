import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "build/",
    "showcase/",
    "showcase/aeropulse/",
    "products/",
    "how-we-work/",
    "about/",
    "contact/",
    "ProjectONE/",
    "demo/",
    "ProjectONE/baankhaokhom/",
    "ProjectONE/baanfundee/",
    "ProjectONE/baan-bangkok/",
    "ProjectONE/paw-and-co/",
    "ProjectONE/petal-stem-florist/",
    "sites/aeropulse/",
    "sites/restaurant/",
  ];
  return paths.map((path) => ({
    url: `${site.url}/${path}`,
    lastModified: new Date(),
  }));
}
