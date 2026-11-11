import { NextResponse } from "next/server";
import { getSaleSession } from "@/lib/sales-ai/auth";
import {
  bangkokDayKey,
  normalizeDayPlanStops,
  type SaleDayPlan,
} from "@/lib/sales-ai/day-plans";
import { seesAllReports } from "@/lib/sales-ai/roles";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function mapRow(
  row: {
    id: string;
    sales_id: string;
    day_key: string;
    stops: unknown;
    note: string | null;
    source: string;
    updated_at: string;
  },
  nameById: Map<string, string>,
): SaleDayPlan {
  return {
    id: row.id,
    salesId: row.sales_id,
    salesName: nameById.get(row.sales_id) || undefined,
    dayKey: row.day_key,
    stops: normalizeDayPlanStops(row.stops),
    note: row.note,
    source: row.source === "manual" ? "manual" : "coach",
    updatedAt: row.updated_at,
  };
}

/**
 * GET ?day=YYYY-MM-DD
 * - Manager/Admin: เห็นแผนทั้งทีม (เลขาผู้จัดการใช้ชุดนี้)
 * - Sale: เห็นเฉพาะแผนของตัวเอง — ผู้ช่วย Sale ห้ามเห็นแผนคนอื่น
 */
export async function GET(req: Request) {
  const session = await getSaleSession();
  if (!session) return bad("unauthorized", 401);

  const db = supabaseAdmin();
  if (!db) return bad("supabase_not_configured", 503);

  const url = new URL(req.url);
  const day = (url.searchParams.get("day") || bangkokDayKey()).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return bad("invalid_day");

  // Sale ห้ามขอแผนคนอื่นผ่าน query
  if (!seesAllReports(session.role) && url.searchParams.get("salesId")) {
    return bad("forbidden", 403);
  }

  let q = db
    .from("sale_day_plans")
    .select("id,sales_id,day_key,stops,note,source,updated_at")
    .eq("day_key", day)
    .order("updated_at", { ascending: false });

  if (!seesAllReports(session.role)) {
    q = q.eq("sales_id", session.id);
  }

  const { data, error } = await q.limit(80);
  if (error) return bad(error.message, 500);

  const salesIds = [...new Set((data || []).map((r) => r.sales_id))];
  const nameById = new Map<string, string>();
  if (salesIds.length) {
    const { data: people } = await db
      .from("profiles")
      .select("id,full_name,nickname,username")
      .in("id", salesIds);
    for (const p of people || []) {
      nameById.set(p.id, p.nickname || p.full_name || p.username || "Sale");
    }
  }

  const plans = (data || []).map((r) => mapRow(r, nameById));
  return NextResponse.json({ ok: true, day, plans });
}

/** PUT — Sale บันทึก/แก้แผนวันนี้ (หรือ manager บันทึกให้ตัวเอง) */
export async function PUT(req: Request) {
  const session = await getSaleSession();
  if (!session) return bad("unauthorized", 401);

  const db = supabaseAdmin();
  if (!db) return bad("supabase_not_configured", 503);

  let body: {
    day?: string;
    stops?: unknown;
    note?: string | null;
    source?: string;
  };
  try {
    body = await req.json();
  } catch {
    return bad("invalid_json");
  }

  const day = (body.day || bangkokDayKey()).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return bad("invalid_day");

  const stops = normalizeDayPlanStops(body.stops);
  if (stops.length === 0) return bad("stops_required");

  const note =
    typeof body.note === "string" ? body.note.trim().slice(0, 500) || null : null;
  const source = body.source === "manual" ? "manual" : "coach";
  const now = new Date().toISOString();

  const { data, error } = await db
    .from("sale_day_plans")
    .upsert(
      {
        sales_id: session.id,
        day_key: day,
        stops,
        note,
        source,
        updated_at: now,
      },
      { onConflict: "sales_id,day_key" },
    )
    .select("id,sales_id,day_key,stops,note,source,updated_at")
    .single();

  if (error) return bad(error.message, 500);

  const nameById = new Map<string, string>([
    [session.id, session.fullName || session.username || "Sale"],
  ]);

  return NextResponse.json({
    ok: true,
    plan: mapRow(data, nameById),
  });
}
