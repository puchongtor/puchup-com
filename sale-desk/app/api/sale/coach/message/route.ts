import { NextResponse } from "next/server";
import { getAssistantPersona } from "@/lib/sales-ai/assistant-persona";
import { getSaleSession } from "@/lib/sales-ai/auth";
import { askCoach, type CoachChatTurn } from "@/lib/sales-ai/coach";
import {
  bangkokDayKey,
  mergeDayPlanStops,
  normalizeDayPlanStops,
  type DayPlanStop,
} from "@/lib/sales-ai/day-plans";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

async function loadExistingDayStops(salesId: string): Promise<DayPlanStop[]> {
  const db = supabaseAdmin();
  if (!db) return [];
  const { data } = await db
    .from("sale_day_plans")
    .select("stops")
    .eq("sales_id", salesId)
    .eq("day_key", bangkokDayKey())
    .maybeSingle();
  return normalizeDayPlanStops(data?.stops);
}

async function saveDayPlanFromCoach(
  salesId: string,
  dayPlan: { stops: DayPlanStop[]; note: string | null },
  existingStops: DayPlanStop[],
) {
  const db = supabaseAdmin();
  if (!db) return { saved: false as const, error: "supabase_not_configured" };

  const stops = mergeDayPlanStops(existingStops, dayPlan.stops);
  if (!stops.length) return { saved: false as const, error: "empty_stops" };

  const { data, error } = await db
    .from("sale_day_plans")
    .upsert(
      {
        sales_id: salesId,
        day_key: bangkokDayKey(),
        stops,
        note: dayPlan.note,
        source: "coach",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "sales_id,day_key" },
    )
    .select("id,day_key,stops,note,updated_at")
    .single();

  if (error) return { saved: false as const, error: error.message };
  return { saved: true as const, plan: data };
}

/** แชทผู้ช่วยทั่วไปบนหน้าโฮม — ไม่ผูก visit · บันทึกกำหนดการเช้าได้ */
export async function POST(req: Request) {
  const session = await getSaleSession();
  if (!session) return bad("unauthorized", 401);

  let body: {
    text?: string;
    history?: CoachChatTurn[];
    monthPoints?: number;
    monthAverage?: number;
    confirmedCount?: number;
    assistantId?: string;
  };
  try {
    body = await req.json();
  } catch {
    return bad("invalid_json");
  }

  const text = (body.text || "").trim();
  if (!text) return bad("text_required");
  if (text.length > 2000) return bad("text_too_long");

  const persona = getAssistantPersona(body.assistantId);

  const history = Array.isArray(body.history)
    ? body.history
        .filter(
          (t) =>
            t &&
            (t.role === "sales" || t.role === "assistant") &&
            typeof t.content === "string",
        )
        .slice(-10)
        .map((t) => ({
          role: t.role as "sales" | "assistant",
          content: String(t.content).slice(0, 800),
        }))
    : [];

  const existingStops = await loadExistingDayStops(session.id);

  const result = await askCoach({
    salesName: session.fullName || session.username,
    userText: text,
    history,
    monthPoints: Number(body.monthPoints) || 0,
    monthAverage: Number(body.monthAverage) || 0,
    confirmedCount: Number(body.confirmedCount) || 0,
    gender: persona.gender,
    assistantName: persona.name,
    existingStops,
  });

  if (!result.ok) {
    return NextResponse.json({
      ok: true,
      reply:
        persona.gender === "male"
          ? "ระบบผู้ช่วยติดขัดชั่วคราวครับ ลองพิมพ์ใหม่อีกครั้งนะครับ หรือเริ่มเยี่ยมลูกค้าได้ตามปกติครับ"
          : "ระบบผู้ช่วยติดขัดชั่วคราวค่ะ ลองพิมพ์ใหม่อีกครั้งนะคะ หรือเริ่มเยี่ยมลูกค้าได้ตามปกติค่ะ",
      error: result.error,
      dayPlan: null,
    });
  }

  let planSaved: unknown = null;
  let planError: string | undefined;
  let mergedDayPlan = result.dayPlan;
  if (result.dayPlan && result.dayPlan.stops.length > 0) {
    const saved = await saveDayPlanFromCoach(
      session.id,
      result.dayPlan,
      existingStops,
    );
    if (saved.saved) {
      planSaved = saved.plan;
      mergedDayPlan = {
        stops: normalizeDayPlanStops(saved.plan.stops),
        note: result.dayPlan.note,
      };
    } else planError = saved.error;
  }

  return NextResponse.json({
    ok: true,
    reply: result.reply,
    dayPlan: mergedDayPlan,
    planSaved,
    planError,
  });
}
