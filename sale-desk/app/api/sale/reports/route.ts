import { NextResponse } from "next/server";
import { getSaleSession } from "@/lib/sales-ai/auth";
import { upsertCompanyAndContact } from "@/lib/sales-ai/crm-contacts";
import { reportToSummaryRow, reportToVisitRow } from "@/lib/sales-ai/db-map";
import { seesAllReports } from "@/lib/sales-ai/roles";
import type { StoredVisitReport } from "@/lib/sales-ai/types";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function GET(req: Request) {
  const db = supabaseAdmin();
  if (!db) return bad("supabase_not_configured", 503);

  const session = await getSaleSession();
  const url = new URL(req.url);
  const salesIdParam = url.searchParams.get("salesId");
  const scope = url.searchParams.get("scope");

  let salesId: string | null = salesIdParam;
  if (session?.role === "sales") {
    salesId = session.id;
  } else if (session && seesAllReports(session.role)) {
    // admin / manager: ดูทั้งหมด หรือกรองตาม salesId ที่ส่งมา
    if (scope === "all") salesId = null;
    else if (!salesIdParam) salesId = null;
  }

  let q = db
    .from("visits")
    .select("id,sales_id,company_name_text,status,confirmed_at,distance_km,created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (salesId) q = q.eq("sales_id", salesId);

  const { data: visits, error } = await q;
  if (error) return bad(error.message, 500);

  const ids = (visits || []).map((v) => v.id);
  const summaries =
    ids.length === 0
      ? []
      : (
          await db
            .from("visit_summaries")
            .select("visit_id,status,data,created_at")
            .in("visit_id", ids)
            .eq("version", 1)
        ).data || [];

  const byVisit = new Map(summaries.map((s) => [s.visit_id, s]));

  const photoTagsByVisit = new Map<string, string[]>();
  const chatByVisit = new Map<
    string,
    { salesTurns: number; salesChars: number; photoCount: number; openQuestions: number }
  >();
  if (ids.length > 0) {
    const { data: events } = await db
      .from("raw_events")
      .select("visit_id,kind,text_content,meta")
      .in("visit_id", ids)
      .limit(5000);
    for (const row of events || []) {
      const meta = (row.meta || {}) as Record<string, unknown>;
      const cur = chatByVisit.get(row.visit_id) || {
        salesTurns: 0,
        salesChars: 0,
        photoCount: 0,
        openQuestions: 0,
      };
      const role = meta.role === "secretary" ? "secretary" : "sales";
      if (row.kind === "image") {
        cur.photoCount += 1;
        const tag = typeof meta.tag === "string" ? meta.tag : "other";
        const list = photoTagsByVisit.get(row.visit_id) || [];
        list.push(tag);
        photoTagsByVisit.set(row.visit_id, list);
        if (role === "sales") {
          cur.salesTurns += 1;
          cur.salesChars += (row.text_content || "").length;
        }
      } else if (role === "sales" && row.text_content) {
        cur.salesTurns += 1;
        cur.salesChars += row.text_content.length;
      } else if (role === "secretary" && Array.isArray(meta.missing_fields)) {
        cur.openQuestions = meta.missing_fields.length;
      }
      chatByVisit.set(row.visit_id, cur);
    }
  }

  const salesIds = [...new Set((visits || []).map((v) => v.sales_id).filter(Boolean))];
  const salesNameById = new Map<string, string>();
  if (salesIds.length > 0) {
    const { data: people } = await db
      .from("profiles")
      .select("id,full_name,nickname,username")
      .in("id", salesIds);
    for (const p of people || []) {
      salesNameById.set(
        p.id,
        p.nickname || p.full_name || p.username || "Sale",
      );
    }
  }

  // ไม่เอา void / in_progress มาปนในรายงาน — เดี๋ยวโฮมโชว์เป็น "รอตรวจ" ซ้ำ/ลบไม่หาย
  const reportVisits = (visits || []).filter(
    (v) =>
      v.status === "confirmed" ||
      v.status === "pending_review" ||
      v.status === "processing",
  );

  const reports: StoredVisitReport[] = reportVisits.map((v) => {
    const s = byVisit.get(v.id);
    const summary = (s?.data || {
      company: {
        name: { value: v.company_name_text, confidence: 1, sources: [] },
        address: { value: null, confidence: 0, sources: [] },
        matched_company_id: null,
      },
      contacts: [],
      purpose: { value: null, confidence: 0, sources: [] },
      discussion: [],
      items: [],
      decision: {
        decision_maker: { value: null, confidence: 0, sources: [] },
        budget: { value: null, confidence: 0, sources: [] },
        timeline: { value: null, confidence: 0, sources: [] },
        competitor_mentioned: { value: null, confidence: 0, sources: [] },
      },
      sentiment: { level: "neutral", complaints: [] },
      next_steps: [],
      attachments: [],
      unresolved: [],
      distance_km: v.distance_km,
    }) as StoredVisitReport["summary"];

    return {
      id: v.id,
      companyName: v.company_name_text || summary.company.name.value || "ไม่ระบุ",
      salesId: v.sales_id,
      salesName: salesNameById.get(v.sales_id) || "",
      summary,
      status: v.status === "confirmed" ? "confirmed" : "pending_review",
      urgency:
        summary.items?.find((i) => i.urgency === "line_down" || i.urgency === "urgent")
          ?.urgency || "normal",
      confirmedAt: v.confirmed_at,
      createdAt: v.created_at,
      photoTags: photoTagsByVisit.get(v.id) || [],
      chatQuality: chatByVisit.get(v.id) || {
        salesTurns: 0,
        salesChars: 0,
        photoCount: photoTagsByVisit.get(v.id)?.length || 0,
        openQuestions: 0,
      },
    };
  });

  return NextResponse.json({ ok: true, reports });
}

export async function PUT(req: Request) {
  const db = supabaseAdmin();
  if (!db) return bad("supabase_not_configured", 503);

  let body: { report?: StoredVisitReport };
  try {
    body = await req.json();
  } catch {
    return bad("invalid_json");
  }

  const report = body.report;
  if (!report?.id || !report.salesId) return bad("invalid_report");

  const visit = reportToVisitRow(report);
  const { error: vErr } = await db.from("visits").upsert(visit, { onConflict: "id" });
  if (vErr) return bad(vErr.message, 500);

  const summary = reportToSummaryRow(report);
  const { error: sErr } = await db.from("visit_summaries").upsert(summary, {
    onConflict: "visit_id,version",
  });
  if (sErr) return bad(sErr.message, 500);

  // ฐานชื่อ–เบอร์สำหรับผู้จัดการ (Sale ไม่มี API อ่านสมุดนี้)
  if (report.status === "confirmed") {
    const c0 = report.summary?.contacts?.[0];
    await upsertCompanyAndContact(db, {
      companyName: report.companyName || report.summary?.company?.name?.value || "",
      contactName: c0?.name?.value,
      phone: c0?.phone?.value,
      position: c0?.position?.value,
      visitId: report.id,
    });
  }

  return NextResponse.json({ ok: true });
}
