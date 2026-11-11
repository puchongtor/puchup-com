import { SALE_BRAND } from "./brand";

/** ลิงก์หน้าเว็บหลักให้ผู้ช่วยส่งต่อหลังสรุปสั้นๆ */
export const PRODUCT_WEB_LINKS: { keys: string[]; label: string; path: string }[] = [
  {
    keys: ["ฟิล์มหด", "shrink", "pvc", "pe หด", "ฟิล์ม pe", "ฟิล์ม pvc"],
    label: "ฟิล์มหด",
    path: "/products/shrink-film",
  },
  {
    keys: ["น้ำแข็งแห้ง", "dry ice", "dryice", "ไดไอซ์", "ไดร์ไอซ์", "food grade"],
    label: "น้ำแข็งแห้ง",
    path: "/products/dry-ice",
  },
  {
    keys: [
      "พ่นน้ำแข็ง",
      "เครื่องพ่นน้ำแข็งแห้ง",
      "เครื่องพ่นไดไอซ์",
      "เครื่องพ่นไดร์ไอซ์",
      "ไดไอซ์",
      "dry ice blasting",
      "dryice",
      "ice rocket",
      "elite 20",
      "microclean",
    ],
    label: "เครื่องพ่นน้ำแข็งแห้ง",
    path: "/products/dry-ice-blasting",
  },
  {
    keys: ["marspak", "มาร์สแพค", "ติดฉลาก", "labeler"],
    label: "เครื่องติดฉลาก / Marspak",
    path: "/products/marspak",
  },
  {
    keys: ["อะไหล่", "spare", "หาอะไหล่"],
    label: "บริการหาอะไหล่",
    path: "/services/spare-parts",
  },
];

export function absoluteProductUrl(path: string) {
  const base = SALE_BRAND.siteUrl.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export function formatProductLinksForPrompt() {
  const lines = PRODUCT_WEB_LINKS.map(
    (l) => `- ${l.label}: ${absoluteProductUrl(l.path)}`,
  );
  return `Official website pages (use full URL after a short summary; never invent prices):
- หน้าแรก: ${SALE_BRAND.siteUrl}
${lines.join("\n")}
When answering product questions: 1) 2–4 short Thai basics first 2) blank line 3) one matching link (or homepage if unsure). Do not dump many links.`;
}
