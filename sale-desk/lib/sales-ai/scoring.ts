import type { StoredVisitReport } from "./types";

/**
 * ปรัชญาคะแนน (v2):
 * คะแนนมีไว้ให้ Sale พยายามคุยกับเลขาให้ได้ข้อมูลที่ใช้ต่อได้
 * เยี่ยมได้หลายแบบ — ขาย / แก้ปัญหา / ส่งของ / ตามงาน — ไม่บังคับว่าต้องปิดการขาย
 * ดี = ให้สาระพอที่ AI สรุปงานวันนี้ได้ และยิ่งดีถ้าวิเคราะห์งานตามต่อได้
 * ไม่ดี = ไปแล้วไม่คุย ไม่ถ่ายรูป เลขาถามแล้วเปลี่ยนเรื่อง / ตอบลอย ๆ มีแต่น้ำ
 */

export type SaleScorecard = {
  salesId: string;
  salesName: string;
  reportCount: number;
  confirmedCount: number;
  total: number;
  /** รายละเอียดงานวันนี้: ไปทำอะไร เจอใคร รายละเอียดพอใช้ */
  completeness: number;
  /** ตรงตามนัดหมาย — น้ำหนักน้อย */
  timeliness: number;
  /** รูปภาพประกอบ 3–5 ใบ */
  evidence: number;
  /** ติดตามงานต่อได้: งานวันนี้จบชัด / มี follow ที่ AI วิเคราะห์ต่อได้ */
  depth: number;
  feedback: string;
};

export type VisitChatQuality = {
  salesTurns: number;
  salesChars: number;
  photoCount: number;
  /** จำนวน missing_fields ล่าสุดจากเลขา — 0 = ตอบครบแนว */
  openQuestions: number;
};

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function hoursBetween(startIso: string, endIso: string) {
  const a = new Date(startIso).getTime();
  const b = new Date(endIso).getTime();
  if (Number.isNaN(a) || Number.isNaN(b) || b < a) return null;
  return (b - a) / 3_600_000;
}

function sameBangkokDay(aIso: string, bIso: string) {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
  return fmt(aIso) === fmt(bIso);
}

function textBlob(report: StoredVisitReport) {
  const s = report.summary;
  return [
    s.purpose?.value,
    ...(s.discussion || []).map((d) => `${d.topic} ${d.detail}`),
    ...(s.next_steps || []).map((t) => t.title),
    ...(s.items || []).map((i) => i.description),
    ...(s.unresolved || []),
  ]
    .filter(Boolean)
    .join("\n");
}

/** คำลอย / มีแต่น้ำ — ใช้ลดคะแนนถ้าข้อความยาวแต่ไร้สาระ */
function wateryRatio(text: string) {
  if (!text || text.length < 20) return 0;
  const water =
    text.match(
      /ครับ|ค่ะ|นะ|อ่า|เอ่อ|โอเค|ok|ดีๆ|ปกติ|ไม่มีอะไร|ผ่านๆ|ไปๆ|เฉยๆ|ทดสอบ|test/gi,
    ) || [];
  return Math.min(1, (water.length * 4) / Math.max(text.length / 8, 1));
}

export function scoreTimeliness(startedAt: string, confirmedAt: string | null) {
  if (!confirmedAt) return 20;
  if (sameBangkokDay(startedAt, confirmedAt)) return 100;
  const h = hoursBetween(startedAt, confirmedAt);
  if (h == null) return 20;
  if (h <= 24) return 80;
  if (h <= 48) return 50;
  return 20;
}

export function scorePhotos(report: StoredVisitReport) {
  const n = Math.max(
    report.chatQuality?.photoCount || 0,
    report.photoTags?.length || 0,
    report.summary.attachments?.length || 0,
  );
  if (n <= 0) return 0;
  if (n === 1) return 30;
  if (n === 2) return 55;
  if (n === 3) return 80;
  if (n === 4) return 90;
  return 100;
}

/**
 * สาระจากคุยกับเลขา — ไปทำอะไร / เจอใครไหม / รายละเอียดพอ
 * รองรับทั้งขาย แก้ปัญหา ส่งของ ตามงาน
 */
export function scoreSubstance(report: StoredVisitReport) {
  const s = report.summary;
  const chat = report.chatQuality;
  const blob = textBlob(report);
  let score = 0;

  // ไปทำอะไรวันนี้ (บังคับแกน)
  if (s.purpose?.value || s.discussion?.[0]?.detail) score += 25;
  else if ((chat?.salesChars || 0) >= 40) score += 10;

  // เจอใคร — ไม่บังคับทุกเคส แต่มีแล้วดีมาก (โดยเฉพาะมีเบอร์)
  const contact = s.contacts?.[0];
  if (contact?.name?.value) score += 15;
  if (contact?.phone?.value) score += 15;
  else if (contact?.position?.value) score += 5;

  // รายละเอียดพอใช้ (ไม่นับแค่น้ำ)
  const detailLen =
    (s.purpose?.value?.length || 0) +
    (s.discussion || []).reduce((a, d) => a + (d.detail?.length || 0), 0);
  if (detailLen >= 30) score += 10;
  if (detailLen >= 80) score += 10;
  if (detailLen >= 160) score += 5;

  // คุณภาพการคุยกับเลขา
  if (chat) {
    if (chat.salesTurns >= 2) score += 5;
    if (chat.salesTurns >= 4) score += 5;
    if (chat.salesChars >= 60) score += 5;
    if (chat.salesChars >= 150) score += 5;
    // ตอบคำถามเลขาได้ค่อนข้างครบ
    if (chat.openQuestions === 0 && chat.salesTurns >= 2) score += 5;
    if (chat.openQuestions >= 3) score -= 10;
    // คุยรอบเยอะแต่ตัวอักษรน้อย = มีแต่น้ำ / เปลี่ยนเรื่อง
    const avg = chat.salesTurns > 0 ? chat.salesChars / chat.salesTurns : 0;
    if (chat.salesTurns >= 4 && avg < 12) score -= 15;
  }

  score -= Math.round(wateryRatio(blob) * 20);

  return clamp(score);
}

/**
 * สรุปใช้ต่อได้ = สำเร็จตามงานที่ไป หรือ AI มองเห็นงานตามต่อได้ชัด
 * ไม่บังคับว่าต้องเป็นโอกาสขายทุกครั้ง
 */
export function scoreUsableOutcome(report: StoredVisitReport) {
  const s = report.summary;
  const blob = textBlob(report);
  let score = 20;

  const steps = s.next_steps || [];
  const hasFollow = steps.length > 0;
  const hasDue = steps.some((t) => t.due_date) || Boolean(s.decision?.timeline?.value);

  // งานวันนี้จบชัด (ส่งของ/แก้ปัญหา/ตามงาน) — จากถ้อยคำ
  const closedWork =
    /ส่งของ|ส่งมอบ|ติดตั้ง|แก้ใข|แก้ไข|ซ่อม|เรียบร้อย|เสร็จ|ปิดงาน|ตามของ|เคลม/i.test(
      blob,
    );

  if (hasFollow) score += 25;
  if (hasDue) score += 15;
  if (closedWork && !hasFollow) score += 20; // จบงานโดยไม่ต้องตามต่อก็โอเค
  if (closedWork && hasFollow) score += 5;

  // มีสาระพอให้ AI วิเคราะห์ต่อ (ไม่ใช่สรุปว่าง)
  if ((s.discussion?.length || 0) > 0 || (s.purpose?.value?.length || 0) > 40) {
    score += 15;
  }

  // โบนัสโอกาส — ไม่บังคับ แต่มีแล้วดี
  if (/โอกาส|สนใจ|ครั้งหน้า|แนะนำ|ขยาย|ใบเสนอ|ขอราคา|เพิ่มออเดอร์/i.test(blob)) {
    score += 20;
  }

  // มีรุ่น/พาร์ทหรือรายการชัด
  if ((s.items || []).some((i) => i.model?.value || i.part_number?.value || i.description)) {
    score += 10;
  }

  // unresolved เยอะ = สรุปยังใช้ต่อยาก
  if ((s.unresolved?.length || 0) >= 3) score -= 15;

  return clamp(score);
}

function scoreOne(reports: StoredVisitReport[]): Omit<
  SaleScorecard,
  "salesId" | "salesName"
> {
  const confirmed = reports.filter((r) => r.status === "confirmed");
  const pool = confirmed.length > 0 ? confirmed : reports;
  if (pool.length === 0) {
    return {
      reportCount: 0,
      confirmedCount: 0,
      total: 0,
      completeness: 0,
      timeliness: 0,
      evidence: 0,
      depth: 0,
      feedback: "ยังไม่มีรายงาน — เยี่ยมแล้วคุยกับผู้ช่วยให้ได้สรุปงานวันนี้จะมีคะแนน",
    };
  }

  let substanceSum = 0;
  let usableSum = 0;
  let photoSum = 0;
  let timeSum = 0;

  for (const r of pool) {
    substanceSum += scoreSubstance(r);
    usableSum += scoreUsableOutcome(r);
    photoSum += scorePhotos(r);
    timeSum += scoreTimeliness(r.createdAt, r.confirmedAt);
  }

  const n = pool.length;
  const completeness = clamp(substanceSum / n);
  const depth = clamp(usableSum / n);
  const evidence = clamp(photoSum / n);
  const timeliness = clamp(timeSum / n);

  // รายละเอียดงาน 40 · ติดตามงานต่อได้ 30 · รูป 20 · ตรงตามนัดหมาย 10
  const total = clamp(
    completeness * 0.4 + depth * 0.3 + evidence * 0.2 + timeliness * 0.1,
  );

  let feedback =
    "รายละเอียดงานวันนี้ครบ และติดตามงานต่อได้ดี — แบบนี้ระบบช่วยตามงานต่อได้";
  if (completeness < 65) {
    feedback =
      "ใส่รายละเอียดงานวันนี้ให้ชัด: ไปทำอะไร เจอใครไหม — อย่าตอบลอยหรือเปลี่ยนเรื่อง";
  } else if (depth < 65) {
    feedback =
      "สรุปให้ชัดว่างานวันนี้สำเร็จไหม และมีอะไรต้องติดตามต่อ (ถ้ามี) เพื่อให้ทีม/AI ช่วยต่อได้";
  } else if (evidence < 65) {
    feedback = "แนบรูปประกอบสัก 3–5 ใบต่อครั้ง (เครื่อง/หน้างาน/ชิ้นส่วน/บริษัท ก็ได้)";
  } else if (timeliness < 65) {
    feedback = "ยืนยันสรุปให้ตรงตามนัดหมาย/ภายในวันเยี่ยม จะช่วยให้ทีมตามงานทัน";
  }

  return {
    reportCount: reports.length,
    confirmedCount: confirmed.length,
    total,
    completeness,
    timeliness,
    evidence,
    depth,
    feedback,
  };
}

export function scorecardForSale(
  salesId: string,
  salesName: string,
  reports: StoredVisitReport[],
): SaleScorecard {
  const mine = reports.filter((r) => r.salesId === salesId);
  return { salesId, salesName, ...scoreOne(mine) };
}

export function scorecardsBySale(reports: StoredVisitReport[]): SaleScorecard[] {
  const map = new Map<string, { name: string; reports: StoredVisitReport[] }>();
  for (const r of reports) {
    const id = r.salesId || "unknown";
    const cur = map.get(id) || {
      name: r.salesName || "Sale",
      reports: [] as StoredVisitReport[],
    };
    if (r.salesName) cur.name = r.salesName;
    cur.reports.push(r);
    map.set(id, cur);
  }
  return [...map.entries()]
    .map(([id, v]) => scorecardForSale(id, v.name, v.reports))
    .sort((a, b) => b.total - a.total || a.salesName.localeCompare(b.salesName, "th"));
}

/** คะแนนต่อรายงาน 1 ฉบับ (0–100) */
export function scoreVisit(report: StoredVisitReport): number {
  return scoreOne([report]).total;
}

/** คีย์เดือนตามเวลาไทย YYYY-MM */
export function bangkokMonthKey(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", {
    timeZone: "Asia/Bangkok",
  }).slice(0, 7);
}

export function currentBangkokMonthKey(now = new Date()): string {
  return bangkokMonthKey(now.toISOString());
}

export function formatThaiMonth(monthKey: string): string {
  const [y, m] = monthKey.split("-").map(Number);
  if (!y || !m) return monthKey;
  const d = new Date(Date.UTC(y, m - 1, 1));
  return d.toLocaleDateString("th-TH", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export type MonthlyScoreRow = {
  monthKey: string;
  label: string;
  visitCount: number;
  confirmedCount: number;
  /** เฉลี่ยคุณภาพ 0–100 */
  average: number;
  /** รวมคะแนนจากรายงานที่ยืนยันในเดือนนั้น — รีเซ็ตเมื่อขึ้นเดือนใหม่ */
  totalPoints: number;
  feedback: string;
  isCurrent: boolean;
};

function reportMonthIso(r: StoredVisitReport) {
  return r.confirmedAt || r.createdAt;
}

/** ประวัติคะแนนรายเดือนของเซลล์คนเดียว (ใหม่ → เก่า) */
export function monthlyScoresForSale(
  salesId: string,
  reports: StoredVisitReport[],
  now = new Date(),
): MonthlyScoreRow[] {
  const current = currentBangkokMonthKey(now);
  const mine = reports.filter((r) => r.salesId === salesId);
  const byMonth = new Map<string, StoredVisitReport[]>();

  for (const r of mine) {
    const key = bangkokMonthKey(reportMonthIso(r));
    const list = byMonth.get(key) || [];
    list.push(r);
    byMonth.set(key, list);
  }

  // ให้มีแถวเดือนปัจจุบันเสมอ แม้ยังไม่มีรายงาน
  if (!byMonth.has(current)) byMonth.set(current, []);

  return [...byMonth.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([monthKey, list]) => {
      const card = scoreOne(list);
      const confirmed = list.filter((r) => r.status === "confirmed");
      const scoredPool = confirmed.length > 0 ? confirmed : list;
      const totalPoints = scoredPool.reduce((sum, r) => sum + scoreVisit(r), 0);
      return {
        monthKey,
        label: formatThaiMonth(monthKey),
        visitCount: list.length,
        confirmedCount: confirmed.length,
        average: card.total,
        totalPoints,
        feedback: card.feedback,
        isCurrent: monthKey === current,
      };
    });
}
