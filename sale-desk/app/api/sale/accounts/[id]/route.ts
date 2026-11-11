import { NextResponse } from "next/server";
import { getSaleSession } from "@/lib/sales-ai/auth";
import {
  mapOpenAccountRow,
  type OpenAccountStatus,
} from "@/lib/sales-ai/open-accounts";
import { seesAllReports } from "@/lib/sales-ai/roles";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

async function requireManager() {
  const session = await getSaleSession();
  if (!session) return { error: bad("unauthorized", 401) };
  if (!seesAllReports(session.role)) return { error: bad("forbidden", 403) };
  return { session };
}

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const gate = await requireManager();
  if ("error" in gate) return gate.error;

  const { id } = await ctx.params;
  const db = supabaseAdmin();
  if (!db) return bad("supabase_not_configured", 503);

  const { data, error } = await db
    .from("sale_open_accounts")
    .select(
      "id,company_name,contact_name,phone,note,status,owner_sales_id,next_action,next_action_at,source_raw,created_by,created_at,updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) return bad(error.message, 500);
  if (!data) return bad("not_found", 404);

  const nameIds = [data.created_by, data.owner_sales_id].filter(
    (x): x is string => Boolean(x),
  );
  const nameById = new Map<string, string>();
  if (nameIds.length) {
    const { data: people } = await db
      .from("profiles")
      .select("id,full_name,nickname,username")
      .in("id", nameIds);
    for (const p of people || []) {
      nameById.set(
        p.id,
        p.nickname || p.full_name || p.username || "ผู้ใช้",
      );
    }
  }

  const { data: events } = await db
    .from("sale_open_account_events")
    .select("id,account_id,role,text,created_at")
    .eq("account_id", id)
    .order("created_at", { ascending: true })
    .limit(80);

  return NextResponse.json({
    ok: true,
    account: mapOpenAccountRow(data, {
      createdByName: data.created_by
        ? nameById.get(data.created_by) || null
        : null,
      ownerSalesName: data.owner_sales_id
        ? nameById.get(data.owner_sales_id) || null
        : null,
    }),
    events: (events || []).map((e) => ({
      id: e.id,
      accountId: e.account_id,
      role: e.role as "manager" | "assistant",
      text: e.text,
      createdAt: e.created_at,
    })),
  });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const gate = await requireManager();
  if ("error" in gate) return gate.error;

  const { id } = await ctx.params;
  const db = supabaseAdmin();
  if (!db) return bad("supabase_not_configured", 503);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return bad("invalid_json");
  }

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (typeof body.companyName === "string")
    patch.company_name = body.companyName.trim().slice(0, 200);
  if ("contactName" in body)
    patch.contact_name =
      String(body.contactName || "").trim().slice(0, 120) || null;
  if ("phone" in body)
    patch.phone = String(body.phone || "").trim().slice(0, 40) || null;
  if ("note" in body)
    patch.note = String(body.note || "").trim().slice(0, 2000) || null;
  if ("nextAction" in body)
    patch.next_action =
      String(body.nextAction || "").trim().slice(0, 300) || null;
  if ("nextActionAt" in body) {
    const v = String(body.nextActionAt || "").trim();
    patch.next_action_at = v && !Number.isNaN(Date.parse(v)) ? v : null;
  }
  if ("sourceRaw" in body)
    patch.source_raw =
      String(body.sourceRaw || "").trim().slice(0, 8000) || null;
  if ("ownerSalesId" in body)
    patch.owner_sales_id = body.ownerSalesId || null;
  if (
    typeof body.status === "string" &&
    ["open", "waiting", "done", "dropped"].includes(body.status)
  ) {
    patch.status = body.status as OpenAccountStatus;
  }

  const { data, error } = await db
    .from("sale_open_accounts")
    .update(patch)
    .eq("id", id)
    .select(
      "id,company_name,contact_name,phone,note,status,owner_sales_id,next_action,next_action_at,source_raw,created_by,created_at,updated_at",
    )
    .maybeSingle();

  if (error) return bad(error.message, 500);
  if (!data) return bad("not_found", 404);

  return NextResponse.json({ ok: true, account: mapOpenAccountRow(data) });
}
