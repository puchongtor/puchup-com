import type { StoredVisitReport } from "./types";

export type ManagerFollowUp = {
  id: string;
  title: string;
  companyName: string;
  salesName: string;
  reportId: string;
  kind: "next_step" | "urgent" | "quote";
  priority: "normal" | "high";
  hint: string;
  when: string;
};

function normTitle(title: string) {
  return title.trim().toLowerCase().replace(/\s+/g, " ").slice(0, 100);
}

/** id คงที่ข้ามวัน — ไม่ผูกข้อความที่เปลี่ยนเล็กน้อยแบบ whitespace */
export function managerAlertId(
  reportId: string,
  kind: "step" | "urgent" | "quote",
  title: string,
) {
  return `${reportId}:${kind}:${normTitle(title) || "item"}`;
}

/** จำลอง AI วิเคราะห์จากรายงานที่ยืนยัน — แจ้ง Manager ไม่ใช่ให้ Sale จดเอง */
export function extractManagerFollowUps(
  reports: StoredVisitReport[],
): ManagerFollowUp[] {
  const out: ManagerFollowUp[] = [];

  for (const r of reports) {
    if (r.status !== "confirmed") continue;
    const when = r.confirmedAt || r.createdAt;
    const company = r.companyName || "ไม่ระบุบริษัท";
    const sales = r.salesName || "Sale";

    for (const step of r.summary.next_steps || []) {
      if (!step.title?.trim()) continue;
      const title = step.title.trim();
      const isQuote = /เสนอราคา|quote|ใบเสนอ/i.test(title);
      const kind = isQuote ? "quote" : "next_step";
      out.push({
        id: managerAlertId(r.id, isQuote ? "quote" : "step", title),
        title,
        companyName: company,
        salesName: sales,
        reportId: r.id,
        kind,
        priority:
          r.urgency === "urgent" || r.urgency === "line_down" ? "high" : "normal",
        hint: isQuote
          ? "AI: รายงานระบุว่าต้องส่งใบเสนอราคา — ตรวจว่าติดตามแล้วหรือยัง"
          : "AI: ดึงจากขั้นตอนถัดไปในรายงานที่ยืนยัน",
        when,
      });
    }

    if (
      (r.urgency === "urgent" || r.urgency === "line_down") &&
      !(r.summary.next_steps || []).length
    ) {
      out.push({
        id: managerAlertId(r.id, "urgent", "งานด่วนจากการเยี่ยม"),
        title: "งานด่วนจากการเยี่ยม",
        companyName: company,
        salesName: sales,
        reportId: r.id,
        kind: "urgent",
        priority: "high",
        hint: "AI: รายงานติด urgency สูง — ควรเปิดดูรายละเอียด",
        when,
      });
    }

    for (const item of r.summary.items || []) {
      if (item.kind !== "quote_request") continue;
      const already = out.some(
        (f) => f.reportId === r.id && f.kind === "quote",
      );
      if (already) continue;
      const title = (item.description || "ขอใบเสนอราคา").trim();
      out.push({
        id: managerAlertId(r.id, "quote", title),
        title,
        companyName: company,
        salesName: sales,
        reportId: r.id,
        kind: "quote",
        priority:
          item.urgency === "urgent" || item.urgency === "line_down"
            ? "high"
            : "normal",
        hint: "AI: พบคำขอใบเสนอราคาในรายการเยี่ยม",
        when,
      });
    }
  }

  // ไม่ตัดที่นี่ — ให้หน้า Manager กรองที่ติกแล้วก่อน แล้วค่อยจำกัดจำนวนโชว์
  return out.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority === "high" ? -1 : 1;
    return b.when.localeCompare(a.when);
  });
}
