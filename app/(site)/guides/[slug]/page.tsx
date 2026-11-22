import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticleView } from "@/components/guides/GuideArticleView";
import { allGuideSlugs, getGuide } from "@/lib/guides/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return allGuideSlugs().map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "คู่มือ" };
  return {
    title: guide.title,
    description: guide.excerpt,
  };
}

export default async function GuideSlugPage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  return <GuideArticleView guide={guide} />;
}
