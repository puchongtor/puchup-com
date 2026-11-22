import { realWorks } from "@/lib/works";

/**
 * Showcase hub registry — add cases here over time.
 * - concept: product/system demos for prospects
 * - live: launched client sites
 */

export type ShowcaseKind = "concept" | "live";

export type ShowcaseCase = {
  id: string;
  kind: ShowcaseKind;
  name: string;
  nameTh: string;
  blurb: string;
  href: string;
  external?: boolean;
  product?: string;
  tags: string[];
  image: string;
  statusLabel: string;
};

export const conceptCases: ShowcaseCase[] = [
  {
    id: "aeropulse",
    kind: "concept",
    name: "AeroPulse Bike Studio",
    nameTh: "ระบบช่วยลูกค้าเลือกจักรยาน",
    blurb:
      "ลูกค้าตอบคำถามสั้นๆ หรือคุยกับผู้ช่วย AI แล้วได้รุ่นที่เหมาะ พร้อมเทียบสเปก เช็คสต็อก และส่งต่อทีมร้านทาง LINE",
    href: "/showcase/aeropulse/",
    product: "ShopGuide",
    tags: ["แนะนำสินค้า", "แชท AI", "Line OA", "แคตตาล็อก"],
    image: "/images/products/shopguide/sg-hero-bike.jpg",
    statusLabel: "ตัวอย่างระบบ",
  },
  {
    id: "project-one",
    kind: "concept",
    name: "Project ONE",
    nameTh: "ระบบหาลูกค้าหน้าร้าน × Google Business",
    blurb:
      "ตัวอย่างระบบหาลูกค้าท้องถิ่นหลายประเภทธุรกิจ — หน้าเดียวหรือขยาย SEO ไม่เกิน 10 หน้า พร้อมเชื่อม Google Business รวมเคสจริงอย่างบ้านทันตแพทย์",
    href: "/showcase/project-one/",
    product: "Project ONE",
    tags: ["หน้าเดียว", "Google Business", "หลายธุรกิจ"],
    image: "/images/showcase/project-one/p1-hero-storefront.jpg",
    statusLabel: "ตัวอย่างหลายธุรกิจ",
  },
];

export const liveCases: ShowcaseCase[] = realWorks.map((w) => ({
  id: w.id,
  kind: "live" as const,
  name: w.name,
  nameTh: w.nameTh,
  blurb: w.summary,
  href: w.url,
  external: true,
  product: w.category,
  tags: w.focus.slice(0, 4),
  image: w.image,
  statusLabel: "เปิดใช้แล้ว",
}));

export const showcaseHub = {
  title: "Showcase",
  titleTh: "งานและระบบที่ทำให้ธุรกิจเดินหน้าได้จริง",
  intro:
    "เลือกดูตัวอย่างที่ตรงกับสิ่งที่คุณกำลังมองหา — ทั้งผลงานที่เห็นผล เว็บที่เปิดใช้แล้ว และระบบที่ออกแบบมาเพื่อช่วยเลือกสินค้า ปิดการขาย หรือดึงคนมาที่ร้าน",
  resultsHeading: "ผลงานที่เห็นผล",
  resultsNote:
    "รายงานผลตามช่วงเวลาหลังขึ้นเว็บ เช่น 1 สัปดาห์ / 3 สัปดาห์ / ครบ 1 เดือน — แต่ละช่วงเป็นบทความใหม่",
  resultsHref: "/showcase/results/",
  qualityHeading: "คุณภาพเว็บที่เราสร้าง",
  qualityBody:
    "เตรียมรองรับ SEO และความเร็วสูงตั้งแต่โครงสร้าง — ช่วยให้คนค้นหาเจอ เปิดหน้าได้เร็วบนมือถือ และพร้อมวัดผลจาก Search Console ไม่ใช่แค่หน้าตาสวย",
  qualityMetrics: [
    { label: "Performance", value: "100" },
    { label: "SEO", value: "100" },
    { label: "Best Practices", value: "100" },
    { label: "Accessibility", value: "96" },
  ],
  qualityNote:
    "ตัวอย่างคะแนนคุณภาพ: บ้านทันตแพทย์ (มือถือ 100) · Advance Pro (~893 หน้า · มือถือ 92 / เดสก์ท็อป 99 · SEO 100) — ผลค้นหาและการทักขึ้นกับธุรกิจ พื้นที่ และช่วงเวลา ไม่การันตีเหมือนกันทุกเคส",
  qualityImage: "/images/cases/baandental/pagespeed-framed.jpg",
  qualityPanel: "/images/showcase/quality/pagespeed-panel.jpg",
  qualityHref: "/showcase/results/",
  conceptHeading: "ตัวอย่างระบบ",
  conceptNote: "ดูได้ว่าลูกค้าจะใช้งานอย่างไร ก่อนตัดสินใจว่าแนวทางไหนเหมาะกับธุรกิจคุณ",
  liveHeading: "เว็บที่เปิดให้ลูกค้าใช้แล้ว",
  liveNote: "ผลงานที่ส่งมอบและออนไลน์กับธุรกิจจริง",
} as const;
