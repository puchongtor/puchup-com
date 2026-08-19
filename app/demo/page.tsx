import type { Metadata } from "next";
import { ShowroomPage } from "@/components/demos/ShowroomPage";
import { PageBuilder } from "@/components/sanity/PageBuilder";
import {
  liveItemsFromCategories,
  mergeShowroomWithCms,
} from "@/lib/demos/showroom-catalog";
import { sanityFetch } from "@/lib/sanity/client";
import { pageBySlugQuery, projectOneDemoLinksQuery } from "@/lib/sanity/queries";
import type { CmsPage, ProjectOneDemoLink } from "@/lib/sanity/types";

export const dynamic = "force-static";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "PuchUp ONE — Showroom | เว็บไซต์หน้าเดียวที่เรื่องราวธุรกิจครบ",
  description:
    "สำรวจ 50 ไอเดียธุรกิจแบบ Project ONE และเปิดเดโมร้านที่ทำแล้ว เช่น บ้านข้าวหอม บ้านฟันดี บ้านบางกอก Paw & Co. และ Petal & Stem",
};

export default async function DemoShowroomRoute() {
  const cmsPage = await sanityFetch<CmsPage>({
    query: pageBySlugQuery,
    params: { slug: "demo" },
    tags: ["page:demo"],
    revalidate: 3600,
  });

  if (cmsPage?.sections?.length) {
    return <PageBuilder sections={cmsPage.sections} />;
  }

  const cms = await sanityFetch<ProjectOneDemoLink[]>({
    query: projectOneDemoLinksQuery,
    tags: ["projectOneDemo"],
    revalidate: 3600,
  });
  const categories = mergeShowroomWithCms(cms);
  const liveItems = liveItemsFromCategories(categories);

  return <ShowroomPage categories={categories} liveItems={liveItems} />;
}
