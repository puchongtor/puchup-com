/** Minimal catalog for IndusTech demo glossary (not Advance brands) */
export type BrandCatalogEntry = {
  slug: string;
  name: string;
  folder: string;
  category: string;
  categoryTh: string;
  group: string;
  featured: boolean;
  image: string;
  focusKeyword: string;
  seoTitle: string;
  seoDescription: string;
  directAnswer: string;
  bullets: string[];
  faq: { question: string; answer: string }[];
};

export const BRAND_CATALOG: BrandCatalogEntry[] = [
  {
    slug: "hydraulic-seals",
    name: "ซีลไฮดรอลิก",
    folder: "hydraulic-seals",
    category: "parts",
    categoryTh: "อะไหล่",
    group: "core",
    featured: true,
    image: "",
    focusKeyword: "ซีลไฮดรอลิก",
    seoTitle: "ซีลไฮดรอลิก",
    seoDescription: "อะไหล่ซีลสำหรับระบบไฮดรอลิกโรงงาน",
    directAnswer: "จำหน่ายและจัดหาซีลไฮดรอลิกตามรุ่นเครื่อง",
    bullets: ["เทียบรุ่นจากเนมเพลท", "สต็อกงานด่วน", "ส่งเข้าโรงงาน"],
    faq: [],
  },
  {
    slug: "conveyor-belt",
    name: "สายพานคอนเวเยอร์",
    folder: "conveyor-belt",
    category: "parts",
    categoryTh: "อะไหล่",
    group: "core",
    featured: true,
    image: "",
    focusKeyword: "สายพาน",
    seoTitle: "สายพานคอนเวเยอร์",
    seoDescription: "สายพานและอะไหล่สายพานโรงงาน",
    directAnswer: "จัดหาสายพานและลูกกลิ้งตามสเปกไลน์ผลิต",
    bullets: ["วัดหน้างาน", "เปลี่ยนด่วน", "อะไหล่สำรอง"],
    faq: [],
  },
  {
    slug: "pneumatic",
    name: "นิวเมติก",
    folder: "pneumatic",
    category: "parts",
    categoryTh: "อะไหล่",
    group: "core",
    featured: true,
    image: "",
    focusKeyword: "นิวเมติก",
    seoTitle: "อุปกรณ์นิวเมติก",
    seoDescription: "กระบอกสูบ วาล์ว ข้อต่อนิวเมติก",
    directAnswer: "อุปกรณ์นิวเมติกและอะไหล่ซ่อมบำรุง",
    bullets: ["กระบอกสูบ", "วาล์ว", "ฟิตติ้ง"],
    faq: [],
  },
];

export function listBrandCatalog() {
  return BRAND_CATALOG;
}
