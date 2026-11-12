import type { Metadata } from "next";
import Link from "next/link";
import { ThemeDocument } from "@/components/demos/ThemeDocument";
import { ProjectOneDemoChrome } from "@/components/demos/ProjectOneDemoChrome";
import { ProjectOneCmsView } from "@/components/demos/ProjectOneCmsView";
import {
  allShowroomItems,
  findShowroomItem,
  SLUG_ALIASES,
} from "@/lib/demos/showroom-catalog";
import {
  allDemoSlugs,
  canonicalDemoSlug,
  hasDemoTheme,
  loadDemoTheme,
} from "@/lib/project-one/html";
import {
  buildDemoJsonLd,
  buildDemoMetadata,
  getDemoSeo,
} from "@/lib/project-one/seo";
import { sanityFetch } from "@/lib/sanity/client";
import {
  projectOneDemoBySlugQuery,
  projectOneDemoSlugsQuery,
} from "@/lib/sanity/queries";
import type { ProjectOneDemo } from "@/lib/sanity/types";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = false;

export async function generateStaticParams() {
  const cmsSlugs = await sanityFetch<string[]>({
    query: projectOneDemoSlugsQuery,
    tags: ["projectOneDemo"],
  });
  const slugs = new Set<string>([
    ...allDemoSlugs(),
    ...allShowroomItems().map((item) => item.slug),
    ...Object.keys(SLUG_ALIASES),
    ...(cmsSlugs ?? []),
  ]);
  return [...slugs].filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const canonical = canonicalDemoSlug(slug);
  const cms = await sanityFetch<ProjectOneDemo>({
    query: projectOneDemoBySlugQuery,
    params: { slug: canonical },
    tags: [`projectOneDemo:${canonical}`],
  });

  // Prefer Cursor SEO pack for live HTML themes; CMS can override title/desc if set
  const base = buildDemoMetadata(canonical);
  if (cms?.seo?.metaTitle || cms?.seo?.metaDescription) {
    return {
      ...base,
      title: cms.seo?.metaTitle || base.title,
      description: cms.seo?.metaDescription || base.description,
      robots: cms.seo?.noIndex ? { index: false, follow: false } : base.robots,
    };
  }
  return base;
}

export default async function ProjectOneBusinessPage({ params }: Props) {
  const { slug } = await params;
  const canonical = canonicalDemoSlug(slug);
  const item = findShowroomItem(canonical);
  const jsonLd = buildDemoJsonLd(canonical);
  const seo = getDemoSeo(canonical);
  const businessType = seo?.businessType || item?.kind;

  const cms = await sanityFetch<ProjectOneDemo>({
    query: projectOneDemoBySlugQuery,
    params: { slug: canonical },
    tags: [`projectOneDemo:${canonical}`],
  });

  const jsonLdTag = jsonLd ? (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  ) : null;

  if (cms?.hero?.heading || (cms?.menuOrServices && cms.menuOrServices.length > 0)) {
    return (
      <>
        {jsonLdTag}
        <ProjectOneDemoChrome businessType={cms.businessType || businessType}>
          <ProjectOneCmsView demo={cms} />
        </ProjectOneDemoChrome>
      </>
    );
  }

  if (hasDemoTheme(canonical)) {
    const html = loadDemoTheme(canonical);
    if (html) {
      return (
        <>
          {jsonLdTag}
          <ProjectOneDemoChrome businessType={businessType}>
            <ThemeDocument title={item?.name || canonical} srcDoc={html} />
          </ProjectOneDemoChrome>
        </>
      );
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#FCFAF5] px-6 py-24 text-center">
      <p className="mb-3 font-mono text-xs font-bold tracking-widest text-[#6B4EFF] uppercase">
        Project ONE
      </p>
      <h1 className="mb-3 text-3xl font-semibold text-[#0D182C]">
        {item?.name || canonical}
      </h1>
      <p className="mb-8 max-w-md text-sm leading-relaxed text-slate-500">
        ไม่พบเดโมธีมนี้ — กลับไปดู Showroom
      </p>
      <Link
        href="/ProjectONE/demo/"
        className="rounded-full bg-[#0D182C] px-6 py-3 text-sm font-semibold text-white"
      >
        กลับไป Showroom
      </Link>
    </div>
  );
}
