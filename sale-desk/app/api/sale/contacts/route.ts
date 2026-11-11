import { NextResponse } from "next/server";
import { getSaleSession } from "@/lib/sales-ai/auth";
import { listContactsForManager } from "@/lib/sales-ai/crm-contacts";
import { seesAllReports } from "@/lib/sales-ai/roles";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

/** GET — สมุดชื่อ/เบอร์ เข้าถึงได้เฉพาะ manager/admin */
export async function GET(req: Request) {
  const session = await getSaleSession();
  if (!session) return bad("unauthorized", 401);
  if (!seesAllReports(session.role)) return bad("forbidden", 403);

  const db = supabaseAdmin();
  if (!db) return bad("supabase_not_configured", 503);

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const contacts = await listContactsForManager(db, {
    q: q || undefined,
    limit: 100,
  });

  return NextResponse.json({ ok: true, contacts });
}
