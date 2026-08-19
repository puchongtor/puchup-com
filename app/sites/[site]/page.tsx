import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DemoSiteView } from "@/components/sanity/DemoSiteView";
import {
  getLocalDemoSite,
  LOCAL_DEMO_SUBDOMAINS,
} from "@/lib/demos/local-demos";
import { sanityFetch } from "@/lib/sanity/client";
import {
  demoSiteBySubdomainQuery,
  demoSiteSubdomainsQuery,
} from "@/lib/sanity/queries";
import type { DemoSite } from "@/lib/sanity/types";
import { imageUrl } from "@/lib/sanity/image";

type Props = {
  params: Promise<{ site: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = false;

export async function generateStaticParams() {
  const fromSanity = await sanityFetch<string[]>({
    query: demoSiteSubdomainsQuery,
    tags: ["demoSite"],
  });
  const sites = new Set<string>([
    ...LOCAL_DEMO_SUBDOMAINS,
    ...(fromSanity ?? []),
  ]);
  return [...sites]
    .map((site) => site.trim().toLowerCase())
    .filter(Boolean)
    .map((site) => ({ site }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site: subdomain } = await params;
  const data = await resolveDemoSite(subdomain);
  if (!data) {
    return { title: "Demo not found" };
  }
  const title =
    data.seo?.metaTitle || data.brandDetails.name || data.title;
  const description =
    data.seo?.metaDescription || data.brandDetails.description;
  const og = imageUrl(data.seo?.ogImage || data.brandDetails.logo, 1200);

  return {
    title,
    description,
    robots: data.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: og ? { images: [{ url: og }] } : undefined,
  };
}

export default async function DemoSitePage({ params }: Props) {
  const { site: subdomain } = await params;
  const data = await resolveDemoSite(subdomain);

  if (!data) {
    notFound();
  }

  return <DemoSiteView site={data} />;
}

async function resolveDemoSite(subdomain: string): Promise<DemoSite | null> {
  const fromSanity = await sanityFetch<DemoSite>({
    query: demoSiteBySubdomainQuery,
    params: { subdomain },
    tags: [`demoSite:${subdomain}`],
  });
  if (fromSanity) return fromSanity;
  return getLocalDemoSite(subdomain);
}
