import { NextResponse } from "next/server";
import { getSaleSession } from "@/lib/sales-ai/auth";
import { seesAllReports } from "@/lib/sales-ai/roles";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

type DoneRow = {
  alert_id: string;
  title: string;
  company_name: string;
  sales_name: string;
  hint: string;
  href: string;
  alert_when: string;
  done_at: string;
};

function mapRow(r: DoneRow) {
  return {
    id: r.alert_id,
    title: r.title,
    companyName: r.company_name,
    salesName: r.sales_name,
    hint: r.hint,
    href: r.href,
    when: r.alert_when,
    doneAt: r.done_at,
  };
}

/** GET — รายการแจ้งเตือนที่ติกเสร็จของ manager คนนี้ */
export async function GET() {
  const session = await getSaleSession();
  if (!session) return bad("unauthorized", 401);
  if (!seesAllReports(session.role)) return bad("forbidden", 403);

  const db = supabaseAdmin();
  if (!db) return bad("supabase_not_configured", 503);

  const { data, error } = await db
    .from("manager_alert_done")
    .select(
      "alert_id,title,company_name,sales_name,hint,href,alert_when,done_at",
    )
    .eq("manager_id", session.id)
    .order("done_at", { ascending: false })
    .limit(500);

  if (error) {
    // ตารางยังไม่ migrate
    if (/does not exist|schema cache/i.test(error.message)) {
      return NextResponse.json({
        ok: true,
        alerts: [],
        needsMigration: true,
      });
    }
    return bad(error.message, 500);
  }

  return NextResponse.json({
    ok: true,
    alerts: (data || []).map((r) => mapRow(r as DoneRow)),
  });
}

/** POST — ติกเสร็จ 1 รายการ หรือ sync จาก localStorage หลายรายการ */
export async function POST(req: Request) {
  const session = await getSaleSession();
  if (!session) return bad("unauthorized", 401);
  if (!seesAllReports(session.role)) return bad("forbidden", 403);

  const db = supabaseAdmin();
  if (!db) return bad("supabase_not_configured", 503);

  let body: {
    alert?: {
      id: string;
      title?: string;
      companyName?: string;
      salesName?: string;
      hint?: string;
      href?: string;
      when?: string;
      doneAt?: string;
    };
    alerts?: {
      id: string;
      title?: string;
      companyName?: string;
      salesName?: string;
      hint?: string;
      href?: string;
      when?: string;
      doneAt?: string;
    }[];
  };
  try {
    body = await req.json();
  } catch {
    return bad("invalid_json");
  }

  const list = body.alerts?.length
    ? body.alerts
    : body.alert
      ? [body.alert]
      : [];
  if (!list.length) return bad("alert_required");

  const rows = list
    .filter((a) => a?.id)
    .map((a) => ({
      manager_id: session.id,
      alert_id: String(a.id).slice(0, 240),
      title: String(a.title || "").slice(0, 300),
      company_name: String(a.companyName || "").slice(0, 200),
      sales_name: String(a.salesName || "").slice(0, 120),
      hint: String(a.hint || "").slice(0, 400),
      href: String(a.href || "").slice(0, 300),
      alert_when: String(a.when || "").slice(0, 80),
      done_at: a.doneAt && !Number.isNaN(Date.parse(a.doneAt))
        ? a.doneAt
        : new Date().toISOString(),
    }));

  if (!rows.length) return bad("alert_required");

  const { error } = await db.from("manager_alert_done").upsert(rows, {
    onConflict: "manager_id,alert_id",
  });

  if (error) {
    if (/does not exist|schema cache/i.test(error.message)) {
      return bad("needs_migration", 503);
    }
    return bad(error.message, 500);
  }

  const { data } = await db
    .from("manager_alert_done")
    .select(
      "alert_id,title,company_name,sales_name,hint,href,alert_when,done_at",
    )
    .eq("manager_id", session.id)
    .order("done_at", { ascending: false })
    .limit(500);

  return NextResponse.json({
    ok: true,
    alerts: (data || []).map((r) => mapRow(r as DoneRow)),
  });
}

/** DELETE ?id= — ย้อนกลับ / ลบออกจากเรียบร้อยแล้ว */
export async function DELETE(req: Request) {
  const session = await getSaleSession();
  if (!session) return bad("unauthorized", 401);
  if (!seesAllReports(session.role)) return bad("forbidden", 403);

  const db = supabaseAdmin();
  if (!db) return bad("supabase_not_configured", 503);

  const id = new URL(req.url).searchParams.get("id")?.trim();
  if (!id) return bad("id_required");

  const { error } = await db
    .from("manager_alert_done")
    .delete()
    .eq("manager_id", session.id)
    .eq("alert_id", id);

  if (error) {
    if (/does not exist|schema cache/i.test(error.message)) {
      return bad("needs_migration", 503);
    }
    return bad(error.message, 500);
  }

  const { data } = await db
    .from("manager_alert_done")
    .select(
      "alert_id,title,company_name,sales_name,hint,href,alert_when,done_at",
    )
    .eq("manager_id", session.id)
    .order("done_at", { ascending: false })
    .limit(500);

  return NextResponse.json({
    ok: true,
    alerts: (data || []).map((r) => mapRow(r as DoneRow)),
  });
}
