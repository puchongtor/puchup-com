import { NextResponse } from "next/server";
import { getSaleSession } from "@/lib/sales-ai/auth";
import {
  assistOpenAccount,
  matchSalesOptionId,
  normalizeDraft,
  type AssistSalesOption,
  type OpenAccountDraft,
} from "@/lib/sales-ai/open-accounts";
import { seesAllReports } from "@/lib/sales-ai/roles";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

async function loadSalesRoster(): Promise<AssistSalesOption[]> {
  const db = supabaseAdmin();
  if (!db) return [];
  const { data } = await db
    .from("profiles")
    .select("id,full_name,nickname,username,role,status")
    .eq("role", "sales")
    .limit(80);
  return (data || [])
    .filter((p) => String(p.status || "") !== "disabled")
    .map((p) => ({
      id: p.id as string,
      label: (p.nickname || p.full_name || p.username || "Sale") as string,
      username: (p.username as string | null) || null,
    }));
}

/** POST — เลขาจัดข้อมูลดิบ → draft + reply · จับมอบหมาย Sale อัตโนมัติ */
export async function POST(req: Request) {
  const session = await getSaleSession();
  if (!session) return bad("unauthorized", 401);
  if (!seesAllReports(session.role)) return bad("forbidden", 403);

  let body: {
    text?: string;
    history?: { role?: string; content?: string }[];
    draft?: unknown;
    accountId?: string | null;
    salesOptions?: AssistSalesOption[];
  };
  try {
    body = await req.json();
  } catch {
    return bad("invalid_json");
  }

  const text = String(body.text || "").trim();
  if (!text) return bad("text_required");
  if (text.length > 8000) return bad("text_too_long");

  const current = body.draft ? normalizeDraft(body.draft) : null;
  const history = Array.isArray(body.history)
    ? body.history
        .filter(
          (t) =>
            t &&
            (t.role === "manager" || t.role === "assistant") &&
            typeof t.content === "string",
        )
        .slice(-10)
        .map((t) => ({
          role: t.role as "manager" | "assistant",
          content: String(t.content).slice(0, 2000),
        }))
    : [];

  const clientRoster = Array.isArray(body.salesOptions)
    ? body.salesOptions
        .filter((s) => s && typeof s.id === "string" && typeof s.label === "string")
        .slice(0, 40)
        .map((s) => ({
          id: s.id,
          label: s.label,
          username: s.username || null,
        }))
    : [];
  const salesOptions =
    clientRoster.length > 0 ? clientRoster : await loadSalesRoster();

  const result = await assistOpenAccount({
    userText: text,
    history,
    current,
    salesOptions,
  });

  if (!result.ok) {
    return NextResponse.json({
      ok: true,
      reply:
        "ระบบเลขาติดขัดชั่วคราวค่ะ ลองวางข้อความใหม่อีกครั้งนะคะ",
      draft: current || normalizeDraft({}),
      ownerSalesId: null,
      error: result.error,
    });
  }

  // fallback จับชื่อจากข้อความดิบ ถ้าโมเดลไม่ใส่ hint
  let ownerSalesId = result.ownerSalesId;
  if (!ownerSalesId) {
    ownerSalesId =
      matchSalesOptionId(result.draft.ownerSalesHint, salesOptions) ||
      matchSalesOptionId(text, salesOptions);
  }

  const accountId = body.accountId?.trim() || null;
  if (accountId) {
    const db = supabaseAdmin();
    if (db) {
      await db.from("sale_open_account_events").insert([
        { account_id: accountId, role: "manager", text: text.slice(0, 8000) },
        {
          account_id: accountId,
          role: "assistant",
          text: result.reply.slice(0, 4000),
        },
      ]);
    }
  }

  return NextResponse.json({
    ok: true,
    reply: result.reply,
    draft: result.draft as OpenAccountDraft,
    ownerSalesId,
  });
}
