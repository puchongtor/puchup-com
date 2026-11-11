import { NextResponse } from "next/server";
import { getAssistantPersona } from "@/lib/sales-ai/assistant-persona";
import {
  firstMeetingOpening,
  returningOpening,
  salesDisplayName,
} from "@/lib/sales-ai/assistant-voice";
import { getSaleSession } from "@/lib/sales-ai/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function normalizeCompanyName(raw?: string) {
  const name = (raw || "").trim();
  if (
    !name ||
    name === "บริษัทใหม่" ||
    name === "พิมพ์ชื่อด้านบน" ||
    /^บจก\.?\s*ตัวอย่าง/i.test(name)
  ) {
    return "ยังไม่ระบุบริษัท";
  }
  return name;
}

/** สร้างการเยี่ยมใหม่ + ทักทายถามเป้าหมาย */
export async function POST(req: Request) {
  const session = await getSaleSession();
  if (!session) return bad("unauthorized", 401);
  if (session.role !== "sales" && session.role !== "admin") {
    return bad("sales_only", 403);
  }

  const db = supabaseAdmin();
  if (!db) return bad("supabase_not_configured", 503);

  let body: { companyName?: string; assistantId?: string };
  try {
    body = await req.json();
  } catch {
    return bad("invalid_json");
  }

  const companyName = normalizeCompanyName(body.companyName);
  const salesId = session.id;
  const saleName = salesDisplayName(session.fullName, session.username);
  const persona = getAssistantPersona(body.assistantId);

  // ปิดเยี่ยมค้างเก่า — ไม่ให้แชท/บริษัทเก่ายังโผล่ตอนเริ่มใหม่
  await db
    .from("visits")
    .update({
      status: "void",
      ended_at: new Date().toISOString(),
    })
    .eq("sales_id", salesId)
    .eq("status", "in_progress");

  // เคยเปิดเยี่ยมมาก่อนไหม (รวม void) — แนะนำตัวครั้งเดียวต่อเซลล์
  const { count: priorCount } = await db
    .from("visits")
    .select("id", { count: "exact", head: true })
    .eq("sales_id", salesId);
  const isReturning = (priorCount || 0) > 0;
  const openingText = isReturning
    ? returningOpening(saleName, persona.gender)
    : firstMeetingOpening(saleName, persona.gender, persona.name);

  const { data, error } = await db
    .from("visits")
    .insert({
      sales_id: salesId,
      company_name_text: companyName,
      status: "in_progress",
      started_at: new Date().toISOString(),
    })
    .select("id,sales_id,company_name_text,status,started_at,created_at")
    .single();

  if (error) return bad(error.message, 500);

  const greetingId = crypto.randomUUID();
  await db.from("raw_events").insert({
    id: greetingId,
    visit_id: data.id,
    sales_id: salesId,
    kind: "text",
    text_content: openingText,
    mime: "text/plain",
    meta: {
      role: "secretary",
      kind: isReturning ? "opening_returning" : "opening_intro",
      assistant_id: persona.id,
      assistant_gender: persona.gender,
      working_summary: {
        company_name: companyName === "ยังไม่ระบุบริษัท" ? null : companyName,
        visit_goal: null,
      },
      missing_fields: ["company", "visit_goal"],
    },
    client_created_at: new Date().toISOString(),
  });

  return NextResponse.json({
    ok: true,
    visit: {
      id: data.id,
      companyName: data.company_name_text,
      status: data.status,
      startedAt: data.started_at,
      createdAt: data.created_at,
    },
  });
}

/** ลิสต์การเยี่ยมของเซลล์ (หรือทั้งหมดถ้า admin/manager) */
export async function GET(req: Request) {
  const session = await getSaleSession();
  if (!session) return bad("unauthorized", 401);

  const db = supabaseAdmin();
  if (!db) return bad("supabase_not_configured", 503);

  const url = new URL(req.url);
  const status = url.searchParams.get("status");

  let q = db
    .from("visits")
    .select("id,sales_id,company_name_text,status,started_at,ended_at,created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (session.role === "sales") {
    q = q.eq("sales_id", session.id);
  }
  if (status) q = q.eq("status", status);

  const { data, error } = await q;
  if (error) return bad(error.message, 500);

  return NextResponse.json({
    ok: true,
    visits: (data || []).map((v) => ({
      id: v.id,
      companyName: v.company_name_text,
      status: v.status,
      startedAt: v.started_at,
      endedAt: v.ended_at,
      createdAt: v.created_at,
    })),
  });
}
