/** SaleDesk — marketing copy + interactive preview (no public live trial) */

export const saleDesk = {
  name: "SaleDesk",
  owner: "PuchUp Systems",
  taglineTh: "ผู้ช่วย AI ทีมขาย",
  oneLiner:
    "รายงานเยี่ยมลูกค้าที่มีหลักฐาน — เลขา AI ช่วยจัด · ผู้จัดการเห็นงานค้าง ไม่ใช่ CRM เต็มรูปแบบ",
  urlPath: "/sale/",
  /** Internal / ops only — not linked from customer demo */
  liveAppUrl: process.env.NEXT_PUBLIC_SALE_URL || "https://sale.puchup.com",
  liveAppLocalUrl: "http://localhost:3002/sale",
  demoPath: "/sale/demo/",
  demoSalePath: "/sale/demo/sale/",
  demoManagerPath: "/sale/demo/manager/",
  audience: "บริษัทที่มีเซลล์ภาคสนามประมาณ 1–10 คน",
  sampleCompany: "Meridian Parts · บริษัท เมอริเดียน พาร์ทส์ จำกัด",
  notCrm:
    "ไม่ใช่ Venio หรือ CRM เต็ม — เป็นสมุดงานเยี่ยม + AI เลขา ที่ทำให้ข้อมูลจากสนามเข้าถึงผู้จัดการได้",
} as const;

export { meridianTenant as mockTenant, yourCompanyTenant } from "@/lib/saledesk/tenant";

export const landingPoints = [
  {
    title: "เยี่ยมแล้วมีหลักฐาน",
    body: "คุย พูด หรือพิมพ์ตอนอยู่หน้างาน — ระบบจัดเป็นสรุปรายงานที่ตรวจก่อนส่งได้",
  },
  {
    title: "เลขา AI ที่คุยเป็นภาษาคน",
    body: "วางแผนเช้า มอบหมายงานค้าง หรือวางข้อมูลลูกค้าดิบ — เลขาจัดร่างให้ยืนยัน",
  },
  {
    title: "ผู้จัดการเห็นงานค้าง",
    body: "แจ้งเตือนติดตามจากรายงานและฐานลูกค้าที่ใส่ไว้ — ไม่ต้องไล่ถามทีมทีละคน",
  },
] as const;

export const landingJourney = [
  "เซลล์เริ่มเยี่ยม / วางแผนวัน",
  "เลขาช่วยจดและถามสิ่งที่ขาด",
  "ยืนยันสรุปเข้าฐานเดียวกับทีม",
  "ผู้จัดการเห็นรายงานและงานค้าง",
  "มอบหมายติดตามต่อได้จากฐานลูกค้า",
] as const;

/** Absolute URL into the live SaleDesk app (ops / internal — not for public demo CTAs) */
export function saleAppUrl(path = "/sale"): string {
  const base = (saleDesk.liveAppUrl || "https://sale.puchup.com").replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
