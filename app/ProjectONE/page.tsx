import type { Metadata } from "next";
import { ThemeDocument } from "@/components/demos/ThemeDocument";
import { PageBuilder } from "@/components/sanity/PageBuilder";
import { loadProjectOnePage } from "@/lib/project-one/html";
import { sanityFetch } from "@/lib/sanity/client";
import { pageBySlugQuery } from "@/lib/sanity/queries";
import type { CmsPage } from "@/lib/sanity/types";
import { imageUrl } from "@/lib/sanity/image";

export const dynamic = "force-static";
export const revalidate = false;

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
      "เว็บไซต์หน้าเดียว ที่ทำให้ลูกค้ารู้จักธุรกิจ ตัดสินใจ และอยากมาที่ร้าน — ติดต่อ LINE หรือเปิด Google Maps ได้ทันที",
  };
}

/**
 * /ProjectONE/ — Gemini landing HTML is the temporary visual source of truth.
 * Sanity `projectone` page is ignored until we rebuild this surface in React.
 */
export default async function ProjectOnePage() {
  const html = loadProjectOnePage("landing");
  if (html) {
    return <ThemeDocument title="Project ONE" srcDoc={html} />;
  }

  const page = await getProjectOnePage();
  if (page?.sections?.length) {
    return (
      <div className="min-h-screen bg-[var(--color-base)]">
        <PageBuilder sections={page.sections} />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center p-8 text-center">
      <p>ไม่พบไฟล์ landing ของ Project ONE</p>
    </div>
  );
}
