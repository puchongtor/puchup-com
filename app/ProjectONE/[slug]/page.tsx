import type { Metadata } from "next";
import Link from "next/link";
import { ProjectOneCmsView } from "@/components/demos/ProjectOneCmsView";
import { ThemeDocument } from "@/components/demos/ThemeDocument";
import {
  allShowroomItems,
  canonicalDemoSlug,
  findShowroomItem,
  SLUG_ALIASES,
} from "@/lib/demos/showroom-catalog";
import { hasLiveTheme, loadThemeHtml } from "@/lib/demos/theme-html";
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
  const item = findShowroomItem(canonical);

  if (cms) {
    return {
      title: cms.seo?.metaTitle || `${cms.title} | Project ONE Demo`,
      description: cms.seo?.metaDescription || cms.hero?.tagline,
      robots: cms.seo?.noIndex ? { index: false, follow: false } : undefined,
    };
  }

  if (!item) {
    return { title: "Demo not found" };
  }

  return {
    title: `${item.name} | Project ONE Demo`,
    description: `${item.kind} — ${item.focus}`,
    robots: item.live ? undefined : { index: false, follow: false },
  };
}

export default async function ProjectOneBusinessPage({ params }: Props) {
  const { slug } = await params;
  const canonical = canonicalDemoSlug(slug);
  const item = findShowroomItem(canonical);

  const cms = await sanityFetch<ProjectOneDemo>({
    query: projectOneDemoBySlugQuery,
    params: { slug: canonical },
    tags: [`projectOneDemo:${canonical}`],
  });

  if (cms?.hero?.heading || (cms?.menuOrServices && cms.menuOrServices.length > 0)) {
    return <ProjectOneCmsView demo={cms} />;
  }

  const html = hasLiveTheme(canonical) ? loadThemeHtml(canonical) : null;
  if (html) {
    return <ThemeDocument title={item?.name || canonical} srcDoc={html} />;
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
        {item
          ? "เดโมธีมนี้กำลังออกแบบ — ดูธุรกิจที่เปิดชมได้แล้วใน Showroom"
          : "ไม่พบ slug นี้ในคลัง 50 ธุรกิจ"}
      </p>
      <Link
        href="/demo/"
        className="rounded-full bg-[#0D182C] px-6 py-3 text-sm font-semibold text-white"
      >
        กลับไป Showroom
      </Link>
    </div>
  );
}
