import type { Metadata } from "next";
import { GuidesHub } from "@/components/guides/GuidesHub";
import { guideArticles } from "@/lib/guides/catalog";

export const metadata: Metadata = {
  title: "คู่มือ — เว็บร้านและการหาลูกค้าในย่าน",
  description:
    "คู่มือสำหรับเจ้าของร้านและธุรกิจหน้าร้าน เรื่องเว็บไซต์ Google Business และวิธีให้ลูกค้าค้นหาเจอแล้วติดต่อได้",
};

export default function GuidesIndexPage() {
  const articles = [...guideArticles].reverse();

  return (
    <section className="bg-base">
      <GuidesHub articles={articles} />
    </section>
  );
}
