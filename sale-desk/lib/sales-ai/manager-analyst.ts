import { CLAUDE_CHAT_MODEL, claudeMessages } from "./claude";
import { SALE_BRAND } from "./brand";
import type { SaleDayPlan } from "./day-plans";
import {
  hasPendingFollowUp,
  isAccountStuck,
  type OpenAccount,
} from "./open-accounts";
import { scorecardsBySale, scorePhotos, scoreVisit } from "./scoring";
import type { StoredVisitReport } from "./types";

export type ManagerAskTurn = {
  role: "manager" | "assistant";
  content: string;
};

export type ManagerTeamMember = {
  id: string;
  name: string;
  username: string;
  role: string;
  status: string;
  phone?: string | null;
};

export type ManagerVisitStat = {
  inProgress: number;
  voided: number;
  processing: number;
};

function bangkokDayKey(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "unknown";
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
}

function bangkokTodayKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
}

function thaiDateLabel(dayKey: string) {
  if (dayKey === "unknown") return "ไม่ระบุวัน";
  return new Date(`${dayKey}T12:00:00+07:00`).toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  });
}

function bangkokTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Bangkok",
  });
}

function photoCountOf(r: StoredVisitReport) {
  return Math.max(
    r.chatQuality?.photoCount || 0,
    r.photoTags?.length || 0,
    r.summary.attachments?.length || 0,
  );
}

function compactReport(r: StoredVisitReport, todayKey: string) {
  const when = r.confirmedAt || r.createdAt;
  const dayKey = bangkokDayKey(when);
  const purpose = r.summary.purpose?.value || "";
  const contact = r.summary.contacts?.[0];
  const next = (r.summary.next_steps || [])
    .slice(0, 2)
    .map((t) => t.title)
    .filter(Boolean);
  const needs = (r.summary.items || [])
    .slice(0, 3)
    .map((i) => i.description)
    .filter(Boolean);
  const photos = photoCountOf(r);
  return {
    id: r.id,
    company: r.companyName,
    sales: r.salesName,
    status: r.status,
    when,
    dayKey,
    dayLabelTh: thaiDateLabel(dayKey),
    timeTh: bangkokTime(when),
    isToday: dayKey === todayKey,
    purpose: purpose.slice(0, 120),
    contact: contact?.name?.value || null,
    phone: contact?.phone?.value || null,
    needs: needs.map((n) => String(n).slice(0, 80)),
    next,
    urgency: r.urgency,
    photoCount: photos,
    photoTags: (r.photoTags || []).slice(0, 8),
    evidenceScore: scorePhotos(r),
    visitScore: scoreVisit(r),
    link: `/report/${r.id}`,
  };
}

function buildTodayDigest(
  reports: StoredVisitReport[],
  todayKey: string,
) {
  const todayReports = reports.filter(
    (r) => bangkokDayKey(r.confirmedAt || r.createdAt) === todayKey,
  );
  const bySale = new Map<string, { sales: string; companies: string[] }>();
  for (const r of todayReports) {
    const key = r.salesId || r.salesName || "unknown";
    const cur = bySale.get(key) || {
      sales: r.salesName || "Sale",
      companies: [] as string[],
    };
    if (r.salesName) cur.sales = r.salesName;
    if (r.companyName && !cur.companies.includes(r.companyName)) {
      cur.companies.push(r.companyName);
    }
    bySale.set(key, cur);
  }
  return {
    todayKey,
    todayLabelTh: thaiDateLabel(todayKey),
    reportCount: todayReports.length,
    salesCount: bySale.size,
    companyCount: new Set(todayReports.map((r) => r.companyName).filter(Boolean))
      .size,
    confirmed: todayReports.filter((r) => r.status === "confirmed").length,
    pending_review: todayReports.filter((r) => r.status === "pending_review")
      .length,
    bySale: [...bySale.values()].map((s) => ({
      sales: s.sales,
      companies: s.companies,
      visitCount: s.companies.length,
    })),
  };
}

function buildContext(
  reports: StoredVisitReport[],
  team: ManagerTeamMember[],
  visitStats: ManagerVisitStat,
  dayPlans: SaleDayPlan[],
  openAccounts: OpenAccount[],
) {
  const todayKey = bangkokTodayKey();
  const confirmed = reports.filter((r) => r.status === "confirmed");
  const pending = reports.filter((r) => r.status === "pending_review");
  const scores = scorecardsBySale(confirmed);
  const recent = [...reports]
    .sort((a, b) =>
      (b.confirmedAt || b.createdAt).localeCompare(a.confirmedAt || a.createdAt),
    )
    .slice(0, 50)
    .map((r) => compactReport(r, todayKey));

  const byCompany = new Map<string, number>();
  for (const r of confirmed) {
    byCompany.set(r.companyName, (byCompany.get(r.companyName) || 0) + 1);
  }
  const topCompanies = [...byCompany.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([name, count]) => ({ name, count }));

  const todayPlans = dayPlans
    .filter((p) => p.dayKey === todayKey)
    .slice(0, 40)
    .map((p) => ({
      sales: p.salesName || "Sale",
      salesId: p.salesId,
      dayKey: p.dayKey,
      stops: p.stops.map((s) => ({
        company: s.company,
        time: s.time,
        withWhom: s.withWhom,
        meetWho: s.meetWho,
        purpose: s.purpose,
      })),
      note: p.note,
    }));

  const activeAccounts = openAccounts
    .filter((a) => a.status !== "dropped" && a.status !== "done")
    .slice(0, 40)
    .map((a) => ({
      id: a.id,
      company: a.companyName,
      contact: a.contactName,
      phone: a.phone,
      status: a.status,
      nextAction: a.nextAction,
      nextActionAt: a.nextActionAt,
      pendingFollowUp: hasPendingFollowUp(a),
      stuck: isAccountStuck(a),
      ownerSales: a.ownerSalesName,
      createdBy: a.createdByName,
      note: (a.note || "").slice(0, 160),
      link: `/manager?tab=leads`,
    }));
  const stuckAccounts = activeAccounts.filter(
    (a) => a.pendingFollowUp || a.stuck,
  );

  return {
    brand: SALE_BRAND.name,
    clock: {
      timezone: "Asia/Bangkok",
      todayKey,
      todayLabelTh: thaiDateLabel(todayKey),
      nowIso: new Date().toISOString(),
    },
    todayDigest: buildTodayDigest(reports, todayKey),
    todayDayPlans: todayPlans,
    openAccounts: activeAccounts,
    stuckOpenAccounts: stuckAccounts,
    counts: {
      confirmed: confirmed.length,
      pending_review: pending.length,
      in_progress: visitStats.inProgress,
      processing: visitStats.processing,
      voided: visitStats.voided,
      sales_on_team: team.filter((t) => t.role === "sales").length,
      sales_with_reports: scores.length,
      day_plans_today: todayPlans.length,
      open_accounts_active: activeAccounts.length,
      open_accounts_stuck: stuckAccounts.length,
    },
    team: team.map((t) => ({
      id: t.id,
      name: t.name,
      username: t.username,
      role: t.role,
      status: t.status,
      phone: t.phone || null,
    })),
    scorecards: scores.slice(0, 20).map((s) => {
      const mine = reports.filter((r) => r.salesId === s.salesId);
      const photoTotal = mine.reduce((sum, r) => sum + photoCountOf(r), 0);
      return {
        salesId: s.salesId,
        name: s.salesName,
        total: s.total,
        confirmedCount: s.confirmedCount,
        completeness: s.completeness,
        depth: s.depth,
        evidence: s.evidence,
        photoTotal,
        feedback: s.feedback,
        scoreNote:
          "คะแนนรวม = รายละเอียดงาน 40% · ติดตามงานต่อได้ 30% · รูปหลักฐาน 20% · ตรงวัน 10%",
      };
    }),
    topCompanies,
    recentReports: recent,
  };
}

function systemPrompt(contextJson: string) {
  return `คุณเป็นเลขาผู้จัดการของ ${SALE_BRAND.legalName} (${SALE_BRAND.name}).
คุยกับผู้บริหาร น้ำเสียงสุภาพ เป็นผู้หญิง (ค่ะ/คะ) สั้น ชัด มั่นใจ เหมือนเลขาที่อ่านรายงานแล้วรายงานตรงๆ.

กฎวันที่ (สำคัญมาก):
- ใช้เวลาไทย Asia/Bangkok เท่านั้น
- «วันนี้» = clock.todayKey / todayDigest เสมอ ห้ามถามกลับว่าวันนี้คือวันไหน
- รายงานมี dayKey และ isToday แล้ว — ใช้ฟิลด์เหล่านี้ตัดสิน ไม่ต้องเดา
- ถ้าถามวันนี้ ให้ดู todayDigest ก่อน แล้วตอบตัวเลขตรงๆ
- ห้ามพูดประโยคแนว «ข้อมูลไม่ได้ระบุว่าเป็นวันนี้» / «ถ้าหากวันนี้คือ…» / «ขออภัยค่ะข้อมูลไม่ชัด» เรื่องวันที่
- ถ้าวันนี้ยังไม่มีรายงาน ให้ตอบสั้นๆ ว่า «วันนี้ยังไม่มีรายงานเยี่ยมค่ะ» แล้วจบ ไม่ยืด
- แผนเช้าของทีมอยู่ใน todayDayPlans — แยกจากรายงานเยี่ยมจริง ถามว่า Sale จะไปไหนวันนี้ ให้ดูแผนนี้ก่อน
- ฐานข้อมูลลูกค้าที่ผู้จัดการเพิ่ม (ลูกค้าเก่า / ยังติดต่อ / งานค้าง) อยู่ใน openAccounts / stuckOpenAccounts — ถามใครค้าง งานถัดไป ดูจากชุดนี้ พร้อมชื่อผู้จัดการที่ใส่
- แยกรายงานเยี่ยม (recentReports) กับฐานลูกค้าที่ผู้จัดการเพิ่มชัดเจน อย่าสลับกัน

คะแนน / หลักฐานรูป:
- คะแนนมี 4 ส่วน: completeness 40 · depth 30 · evidence(รูป) 20 · timeliness 10
- ถามว่าได้กี่คะแนน ต้องบอก total พร้อมแยกส่วนสั้นๆ โดยเฉพาะ photoCount / evidence
- ห้ามบอกว่า «ไม่มีหลักฐาน» ถ้า photoCount > 0 หรือ evidence สูง — ต้องกล่าวว่ารูปมีกี่ใบ
- 3 รูป = หลักฐานดี (evidenceScore ประมาณ 80) ไม่ใช่ไม่มีหลักฐาน
- อธิบายจาก recentReports ของคนนั้น + scorecards

สไตล์คำตอบ:
- เปิดด้วยข้อสรุปทันที เช่น «วันนี้มี Sale ไปพบลูกค้า 2 คนค่ะ»
- ต่อด้วยรายชื่อสั้นๆ 1 คนต่อบรรทัด
- อย่าขอโทษซ้ำ อย่าพูดยาวโดยไม่จำเป็น
- ใช้เฉพาะ DATA — ห้ามแต่งตัวเลข/ราคา/ยอดขาย
- อ้างรายงานด้วยลิงก์จากฟิลด์ link ได้
- ภาษาไทยธรรมดา ห้าม markdown ** หรือ #

DATA (JSON):
${contextJson}`;
}

export async function askManagerAnalyst(opts: {
  question: string;
  reports: StoredVisitReport[];
  team?: ManagerTeamMember[];
  visitStats?: ManagerVisitStat;
  dayPlans?: SaleDayPlan[];
  openAccounts?: OpenAccount[];
  history?: ManagerAskTurn[];
}): Promise<{ ok: true; reply: string } | { ok: false; error: string }> {
  const context = buildContext(
    opts.reports,
    opts.team || [],
    opts.visitStats || { inProgress: 0, voided: 0, processing: 0 },
    opts.dayPlans || [],
    opts.openAccounts || [],
  );
  const contextJson = JSON.stringify(context).slice(0, 32000);

  const history = (opts.history || []).slice(-8).map((t) => ({
    role: (t.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
    content: t.content,
  }));

  const result = await claudeMessages({
    model: CLAUDE_CHAT_MODEL,
    system: systemPrompt(contextJson),
    maxTokens: 700,
    temperature: 0.2,
    messages: [
      ...history,
      { role: "user", content: opts.question },
    ],
  });

  if (!result.ok) return { ok: false, error: result.error };

  const reply = (result.text || "")
    .replace(/\*\*/g, "")
    .replace(/^#+\s*/gm, "")
    .trim();

  if (!reply) {
    const d = context.todayDigest;
    return {
      ok: true,
      reply:
        d.reportCount > 0
          ? `วันนี้มี Sale ไปพบลูกค้า ${d.salesCount} คนค่ะ ครอบคลุม ${d.companyCount} ราย`
          : "วันนี้ยังไม่มีรายงานเยี่ยมค่ะ",
    };
  }

  return { ok: true, reply: reply.slice(0, 2500) };
}
