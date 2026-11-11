import { NextResponse } from "next/server";
import { getSaleSession } from "@/lib/sales-ai/auth";
import {
  bangkokDayKey,
  normalizeDayPlanStops,
  type SaleDayPlan,
} from "@/lib/sales-ai/day-plans";
import {
  askManagerAnalyst,
  type ManagerAskTurn,
  type ManagerTeamMember,
  type ManagerVisitStat,
} from "@/lib/sales-ai/manager-analyst";
import { mapOpenAccountRow } from "@/lib/sales-ai/open-accounts";
import { seesAllReports } from "@/lib/sales-ai/roles";
import type { StoredVisitReport } from "@/lib/sales-ai/types";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

async function loadTeam(): Promise<ManagerTeamMember[]> {
  const db = supabaseAdmin();
  if (!db) return [];

  const { data } = await db
    .from("profiles")
    .select("id,username,full_name,nickname,phone,role,status")
    .in("role", ["sales", "manager", "admin"])
    .order("full_name", { ascending: true })
    .limit(80);

  return (data || []).map((p) => ({
    id: p.id,
    name: p.nickname || p.full_name || p.username || "Sale",
    username: p.username || "",
    role: p.role || "sales",
    status: p.status || "active",
    phone: p.phone,
  }));
}

async function loadVisitStats(): Promise<ManagerVisitStat> {
  const db = supabaseAdmin();
  if (!db) return { inProgress: 0, voided: 0, processing: 0 };

  const [{ count: inProgress }, { count: voided }, { count: processing }] =
    await Promise.all([
      db
        .from("visits")
        .select("id", { count: "exact", head: true })
        .eq("status", "in_progress"),
      db
        .from("visits")
        .select("id", { count: "exact", head: true })
        .eq("status", "void"),
      db
        .from("visits")
        .select("id", { count: "exact", head: true })
        .eq("status", "processing"),
    ]);

  return {
    inProgress: inProgress || 0,
    voided: voided || 0,
    processing: processing || 0,
  };
}

/** โหลดรายงานทั้งทีมสำหรับผู้ช่วยผู้จัดการ */
async function loadTeamReports(): Promise<StoredVisitReport[]> {
  const db = supabaseAdmin();
  if (!db) return [];

  const { data: visits } = await db
    .from("visits")
    .select(
      "id,sales_id,company_name_text,status,confirmed_at,distance_km,created_at",
    )
    .in("status", ["confirmed", "pending_review", "processing"])
    .order("created_at", { ascending: false })
    .limit(150);

  if (!visits?.length) return [];

  const ids = visits.map((v) => v.id);
  const salesIds = [...new Set(visits.map((v) => v.sales_id).filter(Boolean))];

  const [{ data: summaries }, { data: people }, { data: events }] =
    await Promise.all([
      db
        .from("visit_summaries")
        .select("visit_id,status,data")
        .in("visit_id", ids)
        .eq("version", 1),
      salesIds.length
        ? db
            .from("profiles")
            .select("id,full_name,nickname,username")
            .in("id", salesIds)
        : Promise.resolve({
            data: [] as {
              id: string;
              full_name: string | null;
              nickname: string | null;
              username: string | null;
            }[],
          }),
      db
        .from("raw_events")
        .select("visit_id,kind,text_content,meta")
        .in("visit_id", ids)
        .limit(5000),
    ]);

  const byVisit = new Map((summaries || []).map((s) => [s.visit_id, s]));
  const nameById = new Map<string, string>();
  for (const p of people || []) {
    nameById.set(p.id, p.nickname || p.full_name || p.username || "Sale");
  }

  const photoTagsByVisit = new Map<string, string[]>();
  const chatByVisit = new Map<
    string,
    { salesTurns: number; salesChars: number; photoCount: number; openQuestions: number }
  >();
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

  return visits.map((v) => {
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

    const photoTags = photoTagsByVisit.get(v.id) || [];
    const chatQuality = chatByVisit.get(v.id) || {
      salesTurns: 0,
      salesChars: 0,
      photoCount: photoTags.length,
      openQuestions: 0,
    };

    return {
      id: v.id,
      companyName: v.company_name_text || "ไม่ระบุ",
      salesId: v.sales_id,
      salesName: nameById.get(v.sales_id) || "",
      summary,
      status: v.status === "confirmed" ? "confirmed" : "pending_review",
      urgency:
        summary.items?.find(
          (i) => i.urgency === "line_down" || i.urgency === "urgent",
        )?.urgency || ("normal" as const),
      confirmedAt: v.confirmed_at,
      createdAt: v.created_at,
      photoTags,
      chatQuality,
    };
  });
}

async function loadTodayDayPlans(): Promise<SaleDayPlan[]> {
  const db = supabaseAdmin();
  if (!db) return [];
  const day = bangkokDayKey();
  const { data } = await db
    .from("sale_day_plans")
    .select("id,sales_id,day_key,stops,note,source,updated_at")
    .eq("day_key", day)
    .order("updated_at", { ascending: false })
    .limit(80);
  if (!data?.length) return [];

  const salesIds = [...new Set(data.map((r) => r.sales_id))];
  const nameById = new Map<string, string>();
  const { data: people } = await db
    .from("profiles")
    .select("id,full_name,nickname,username")
    .in("id", salesIds);
  for (const p of people || []) {
    nameById.set(p.id, p.nickname || p.full_name || p.username || "Sale");
  }

  return data.map((r) => ({
    id: r.id,
    salesId: r.sales_id,
    salesName: nameById.get(r.sales_id),
    dayKey: r.day_key,
    stops: normalizeDayPlanStops(r.stops),
    note: r.note,
    source: r.source === "manual" ? "manual" : "coach",
    updatedAt: r.updated_at,
  }));
}

async function loadOpenAccounts() {
  const db = supabaseAdmin();
  if (!db) return [];
  const { data, error } = await db
    .from("sale_open_accounts")
    .select(
      "id,company_name,contact_name,phone,note,status,owner_sales_id,next_action,next_action_at,source_raw,created_by,created_at,updated_at",
    )
    .neq("status", "dropped")
    .order("updated_at", { ascending: false })
    .limit(80);
  if (error || !data) return [];
  return data.map((r) => mapOpenAccountRow(r));
}

/** ผู้ช่วยผู้จัดการ — ถามจากฐานรายงาน + แผนเช้าทีม + ทีมทั้งระบบ */
export async function POST(req: Request) {
  const session = await getSaleSession();
  if (!session) return bad("unauthorized", 401);
  if (!seesAllReports(session.role)) return bad("manager_only", 403);

  let body: { text?: string; history?: ManagerAskTurn[] };
  try {
    body = await req.json();
  } catch {
    return bad("invalid_json");
  }

  const text = (body.text || "").trim();
  if (!text) return bad("text_required");
  if (text.length > 2000) return bad("text_too_long");

  const history = Array.isArray(body.history)
    ? body.history
        .filter(
          (t) =>
            t &&
            (t.role === "manager" || t.role === "assistant") &&
            typeof t.content === "string",
        )
        .slice(-8)
        .map((t) => ({
          role: t.role as "manager" | "assistant",
          content: String(t.content).slice(0, 1000),
        }))
    : [];

  const [reports, team, visitStats, dayPlans, openAccounts] = await Promise.all([
    loadTeamReports(),
    loadTeam(),
    loadVisitStats(),
    loadTodayDayPlans(),
    loadOpenAccounts(),
  ]);

  const result = await askManagerAnalyst({
    question: text,
    reports,
    team,
    visitStats,
    dayPlans,
    openAccounts,
    history,
  });

  if (!result.ok) {
    return NextResponse.json({
      ok: true,
      reply:
        "ระบบผู้ช่วยผู้จัดการติดขัดชั่วคราวค่ะ ลองถามใหม่อีกครั้งนะคะ",
      error: result.error,
      meta: {
        reportCount: reports.length,
        teamCount: team.length,
        dayPlanCount: dayPlans.length,
      },
    });
  }

  return NextResponse.json({
    ok: true,
    reply: result.reply,
    meta: {
      reportCount: reports.length,
      confirmed: reports.filter((r) => r.status === "confirmed").length,
      teamCount: team.length,
      dayPlanCount: dayPlans.length,
      ...visitStats,
    },
  });
}
