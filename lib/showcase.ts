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
    nameTh: "เว็บหน้าเดียว × Google Business",
    blurb:
      "ตัวอย่างหน้าเดียวสำหรับหลายประเภทธุรกิจ — ร้านอาหาร คลินิก คาเฟ่ ที่พัก และอื่นๆ พร้อมเชื่อม Google Business",
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
    "เลือกดูตัวอย่างที่ตรงกับสิ่งที่คุณกำลังมองหา — ทั้งเว็บไซต์ที่เปิดให้ลูกค้าใช้แล้ว และระบบที่ออกแบบมาเพื่อช่วยเลือกสินค้า ปิดการขาย หรือดึงคนมาที่ร้าน",
  conceptHeading: "ตัวอย่างระบบ",
  conceptNote: "ดูได้ว่าลูกค้าจะใช้งานอย่างไร ก่อนตัดสินใจว่าแนวทางไหนเหมาะกับธุรกิจคุณ",
  liveHeading: "เว็บที่เปิดให้ลูกค้าใช้แล้ว",
  liveNote: "ผลงานที่ส่งมอบและออนไลน์กับธุรกิจจริง",
} as const;
