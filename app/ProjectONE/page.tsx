import type { Metadata } from "next";
import { PageBuilder } from "@/components/sanity/PageBuilder";
import ProjectOneClient from "@/components/project-one/ProjectOneClient";
import { sanityFetch } from "@/lib/sanity/client";
import { pageBySlugQuery } from "@/lib/sanity/queries";
import type { CmsPage } from "@/lib/sanity/types";
import { imageUrl } from "@/lib/sanity/image";

async function getProjectOnePage() {
  return sanityFetch<CmsPage>({
    query: pageBySlugQuery,
    params: { slug: "projectone" },
    tags: ["page:projectone"],
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getProjectOnePage();
  if (page) {
    return {
      title: page.seo?.metaTitle || page.title,
      description: page.seo?.metaDescription,
      robots: page.seo?.noIndex ? { index: false, follow: false } : undefined,
      openGraph: page.seo?.ogImage
        ? { images: [{ url: imageUrl(page.seo.ogImage, 1200) || "" }] }
        : undefined,
    };
  }

  return {
    title: "Project ONE | One Page. Full Business.",
    description:
      "เว็บไซต์หน้าเดียว ที่ทำให้ลูกค้ารู้จักธุรกิจ ตัดสินใจ และอยากมาที่ร้าน",
  };
}

/**
 * /projectone (and /ProjectONE) — Sanity page slug `projectone` when published,
 * otherwise falls back to the existing prototype client.
 */
export default async function ProjectOnePage() {
  const page = await getProjectOnePage();

  if (page?.sections?.length) {
    return (
      <div className="min-h-screen bg-[var(--color-base)]">
        <PageBuilder sections={page.sections} />
      </div>
    );
  }

  return <ProjectOneClient />;
}
