import type { ProtoCompany, ProtoMessage, VisitSummary } from "./types";

export const DEMO_VISIT_ID = "demo-visit-1";

export const MOCK_COMPANIES: ProtoCompany[] = [
  {
    id: "c1",
    name: "บจก. ตัวอย่างอุตสาหกรรม",
    province: "สมุทรปราการ",
    visitCount: 3,
    lastVisit: "28 ต.ค. 2569",
  },
  {
    id: "c2",
    name: "หจก. ตัวอย่างโรงงานเหล็ก",
    province: "ชลบุรี",
    visitCount: 1,
    lastVisit: "15 ก.ย. 2569",
  },
  {
    id: "c3",
    name: "บจก. ตัวอย่างบรรจุภัณฑ์",
    province: "กรุงเทพฯ",
    visitCount: 5,
    lastVisit: "2 พ.ย. 2569",
  },
];

/** แชทตัวอย่างตามม็อกอัป Claude */
export const MOCK_CHAT: ProtoMessage[] = [
  {
    id: "m0",
    role: "secretary",
    content:
      "เริ่มบันทึกแล้วครับ ครั้งก่อนลูกค้าถามหาปั๊มน้ำมันไฮดรอลิก ค้างใบเสนอราคาอยู่ 1 รายการ ลองถามความคืบหน้าด้วยนะครับ",
  },
  {
    id: "m1",
    role: "sales",
    kind: "audio",
    status: "transcribed",
    content: "0:42",
  },
  {
    id: "m2",
    role: "sales",
    kind: "image",
    status: "sent",
    tag: "nameplate",
    content: "รูปป้ายเนมเพลทมอเตอร์",
  },
  {
    id: "m3",
    role: "secretary",
    content:
      "ถอดเสียงแล้ว: คุณสมชาย (หัวหน้าซ่อมบำรุง) แจ้งว่าสายพานสายผลิตที่ 2 ขาดบ่อย ส่วนรูปอ่านป้ายได้ รุ่นและเลขพาร์ทตามภาพ ลูกค้าอยากได้ใบเสนอราคาภายในสัปดาห์นี้ใช่ไหมครับ",
  },
  {
    id: "m4",
    role: "sales",
    kind: "text",
    status: "sent",
    content: "ใช่ครับ แล้วเครื่องหยุดผลิตทุกครั้งที่สายพานขาด",
  },
  {
    id: "m5",
    role: "secretary",
    content: "รับทราบ ติดแท็กด่วนให้ครับ มีอะไรเพิ่มอีกไหม หรือกดจบการเยี่ยมได้เลย",
  },
];

export const MOCK_SUMMARY: VisitSummary = {
  company: {
    name: {
      value: "บจก. ตัวอย่างอุตสาหกรรม",
      confidence: 0.95,
      sources: [{ raw_event_id: "e1" }],
    },
    address: {
      value: "สมุทรปราการ",
      confidence: 0.8,
      sources: [{ raw_event_id: "e1" }],
    },
    matched_company_id: "c1",
  },
  contacts: [
    {
      name: {
        value: "คุณสมชาย",
        confidence: 0.92,
        sources: [{ raw_event_id: "e2" }],
      },
      position: {
        value: "หัวหน้าซ่อมบำรุง",
        confidence: 0.9,
        sources: [{ raw_event_id: "e2" }],
      },
      phone: {
        value: "081-000-0000",
        confidence: 0.85,
        sources: [{ raw_event_id: "e2" }],
      },
      line_id: { value: null, confidence: 0.2, sources: [] },
      email: { value: null, confidence: 0.1, sources: [] },
      card_event_id: "e2",
    },
  ],
  purpose: {
    value: "ติดตามงานซ่อม + ขอใบเสนอราคาสายพาน",
    confidence: 0.88,
    sources: [{ raw_event_id: "e1" }],
  },
  discussion: [
    {
      topic: "สายพานลำเลียง",
      detail: "สายผลิตที่ 2 ขาดบ่อย ขอใบเสนอราคาสายพานทดแทน",
      sources: [{ raw_event_id: "e1", t_start: 12, t_end: 40 }],
    },
  ],
  items: [
    {
      kind: "part_request",
      description: "สายพานลำเลียงสายผลิตที่ 2",
      brand: { value: null, confidence: 0.3, sources: [] },
      model: {
        value: "อ่านจากรูปเนมเพลท: [รุ่นที่อ่านได้]",
        confidence: 0.55,
        sources: [{ raw_event_id: "e3" }],
      },
      part_number: { value: null, confidence: 0.4, sources: [] },
      qty: { value: 1, confidence: 0.7, sources: [{ raw_event_id: "e1" }] },
      urgency: "line_down",
      photo_event_ids: ["e3"],
    },
  ],
  decision: {
    decision_maker: { value: null, confidence: 0.2, sources: [] },
    budget: { value: null, confidence: 0.15, sources: [] },
    timeline: {
      value: "ภายในสัปดาห์นี้",
      confidence: 0.75,
      sources: [{ raw_event_id: "e1" }],
    },
    competitor_mentioned: { value: null, confidence: 0.1, sources: [] },
  },
  sentiment: {
    level: "concerned",
    complaints: ["เครื่องหยุดผลิตทุกครั้งที่สายพานขาด"],
  },
  next_steps: [
    {
      title: "ส่งใบเสนอราคาสายพาน ภายในสัปดาห์นี้",
      due_date: "2026-11-14",
      assignee: "sales",
      sources: [{ raw_event_id: "e1" }],
    },
    {
      title: "โทรถามความคืบหน้าปั๊มไฮดรอลิกที่ค้างจากครั้งก่อน",
      due_date: "2026-11-10",
      assignee: "sales",
      sources: [{ raw_event_id: "e4" }],
    },
  ],
  attachments: [
    { event_id: "e2", tag: "card" },
    { event_id: "e3", tag: "nameplate" },
  ],
  unresolved: ["รุ่นเครื่อง / เลขพาร์ท", "งบประมาณ / คู่แข่ง"],
  distance_km: 32.5,
};

export const MOCK_OWNER_FEED = [
  {
    id: "v1",
    company: "บจก. ตัวอย่างอุตสาหกรรม",
    sales: "เซลล์ A",
    urgency: "line_down" as const,
    summary:
      "ขอใบเสนอราคาสายพานสายผลิต 2 · มีคู่แข่งพูดถึง · ต้องติดตามภายในสัปดาห์นี้",
    time: "10:42",
  },
  {
    id: "v2",
    company: "หจก. ตัวอย่างโรงงานเหล็ก",
    sales: "เซลล์ B",
    urgency: "normal" as const,
    summary: "เยี่ยมตามนัด ลูกค้าสนใจอะไหล่มอเตอร์ รอเสนอราคา",
    time: "09:15",
  },
  {
    id: "v3",
    company: "บจก. ตัวอย่างบรรจุภัณฑ์",
    sales: "เซลล์ A",
    urgency: "normal" as const,
    summary: "ลูกค้าบ่นเรื่องส่งช้า — สรุปให้หัวหน้าทราบ",
    time: "เมื่อวาน",
  },
];

export const MOCK_ALERTS = [
  {
    id: "a1",
    kind: "abusive_language",
    title: "บันทึกมีถ้อยคำรุนแรง",
    detail: "มีข้อความรุนแรงในรายงาน — เปิดดูข้อมูลดิบได้เมื่อต้องการ",
  },
  {
    id: "a2",
    kind: "follow_up_overdue",
    title: "งานเกินกำหนด",
    detail: "ใบเสนอราคาปั๊มไฮดรอลิกยังไม่ส่ง · เซลล์ A",
  },
];

export const MOCK_SCORE = {
  total: 82,
  completeness: 80,
  timeliness: 100,
  evidence: 60,
  follow_through: 60,
  depth: 72,
  feedback: "เพิ่มข้อมูลงบประมาณและผู้ตัดสินใจในการเยี่ยมครั้งถัดไป",
};
