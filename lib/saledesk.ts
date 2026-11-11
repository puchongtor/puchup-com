/** SaleDesk — PuchUp Systems product (marketing + mock demo) */

export const saleDesk = {
  name: "SaleDesk",
  owner: "PuchUp Systems",
  taglineTh: "ผู้ช่วย AI ทีมขาย",
  oneLiner:
    "รายงานเยี่ยมลูกค้าที่มีหลักฐาน — เลขา AI ช่วยจัด · ผู้จัดการเห็นงานค้าง ไม่ใช่ CRM เต็มรูปแบบ",
  urlPath: "/sale/",
  /** Live app (API) — separate from static marketing site */
  liveAppUrl:
    process.env.NEXT_PUBLIC_SALE_URL || "https://sale.puchup.com",
  liveAppLocalUrl: "http://localhost:3002/sale",
  demoSalePath: "/sale/demo/sale/",
  demoManagerPath: "/sale/demo/manager/",
  audience: "บริษัทที่มีเซลล์ภาคสนามประมาณ 1–10 คน",
  demoLoginHint: "manager01 / Sale#2026",
  sampleCompany: "Your Company · IndusTech Parts",
  notCrm:
    "ไม่ใช่ Venio หรือ CRM เต็ม — เป็นสมุดงานเยี่ยม + AI เลขา ที่ทำให้ข้อมูลจากสนามเข้าถึงผู้จัดการได้",
} as const;

export { yourCompanyTenant as mockTenant } from "@/lib/saledesk/tenant";

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

export type MockAlert = {
  id: string;
  title: string;
  company: string;
  who: string;
  hint: string;
};

export type MockLead = {
  id: string;
  company: string;
  contact: string;
  phone: string;
  nextAction: string | null;
  addedBy: string;
  when: string;
};

export type MockChatTurn = {
  role: "user" | "assistant";
  text: string;
};

export const mockAlerts: MockAlert[] = [
  {
    id: "a1",
    title: "ติดตามเรื่องอะไหล่เครื่องพ่น",
    company: "E1234 Industrial",
    who: "มอบหมาย Puchong",
    hint: "มีงานถัดไปจากฐานลูกค้า",
  },
  {
    id: "a2",
    title: "นัดเข้าพบสัปดาห์หน้า",
    company: "ABCD Packaging",
    who: "รายงาน · Somchai",
    hint: "จากสรุปเยี่ยมที่ยืนยันแล้ว",
  },
];

export const mockLeads: MockLead[] = [
  {
    id: "l1",
    company: "E1234 Industrial",
    contact: "SUTEE",
    phone: "081-234-5678",
    nextAction: "ติดตามเรื่องอะไหล่เครื่องพ่นน้ำแข็งแห้ง",
    addedBy: "Paiboon",
    when: "วันนี้ 12:18",
  },
  {
    id: "l2",
    company: "ABCD Packaging",
    contact: "คุณกร",
    phone: "080-996-9495",
    nextAction: "ติดตามฟิล์มหด",
    addedBy: "Paiboon",
    when: "วันนี้ 12:15",
  },
];

export const mockSaleChat: MockChatTurn[] = [
  {
    role: "assistant",
    text: "สวัสดีค่ะ ดิฉันนารา — วันนี้วางแผนไปหาใคร หรืออยากให้ช่วยจดลูกค้าเก่าที่มีงานค้างไหมคะ",
  },
  {
    role: "user",
    text: "เช้านี้มี 2 จุด ก่อน 10 โมง บจก. บางนาแพค แล้วบ่าย ABCD",
  },
  {
    role: "assistant",
    text: "รับทราบค่ะ จดแผนเช้าแล้ว — บางนาแพคก่อน 10 โมง · บ่าย ABCD มีอะไรให้เตรียมเพิ่มไหมคะ",
  },
];

export const mockManagerChat: MockChatTurn[] = [
  {
    role: "assistant",
    text: "สวัสดีค่ะ วางชื่อลูกค้าเก่า เบอร์ หรือข้อความที่มีงานค้างมาได้เลยค่ะ จะจัดร่างให้",
  },
  {
    role: "user",
    text: "บริษัท E1234 ชื่อ SUTEE ติดตามอะไหล่เครื่องพ่น ให้ sale puchong ทำต่อ",
  },
  {
    role: "assistant",
    text: "ได้ค่ะ บันทึกร่าง E1234 · SUTEE · งานถัดไปติดตามอะไหล่ · มอบหมาย Puchong แล้ว ตรวจด้านขวาแล้วยืนยันได้เลยค่ะ",
  },
];

export const mockTeamScores = [
  { name: "Puchong", points: 86, visits: 12 },
  { name: "Somchai", points: 74, visits: 9 },
  { name: "Nida", points: 68, visits: 8 },
] as const;
