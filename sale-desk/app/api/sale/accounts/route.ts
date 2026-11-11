import { NextResponse } from "next/server";
import { getSaleSession } from "@/lib/sales-ai/auth";
import { upsertCompanyAndContact } from "@/lib/sales-ai/crm-contacts";
import { mapOpenAccountRow } from "@/lib/sales-ai/open-accounts";
import { seesAllReports } from "@/lib/sales-ai/roles";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

const SELECT_COLS =
  "id,company_name,contact_name,phone,note,status,owner_sales_id,next_action,next_action_at,source_raw,created_by,created_at,updated_at";

async function attachProfileNames(
  db: NonNullable<ReturnType<typeof supabaseAdmin>>,
  rows: Array<{
    id: string;
    company_name: string;
    contact_name: string | null;
    phone: string | null;
    note: string | null;
    status: string;
    owner_sales_id: string | null;
    next_action: string | null;
    next_action_at: string | null;
    source_raw: string | null;
    created_by: string | null;
    created_at: string;
    updated_at: string;
  }>,
) {
  const ids = [
    ...new Set(
      rows
        .flatMap((r) => [r.created_by, r.owner_sales_id])
        .filter((x): x is string => Boolean(x)),
    ),
  ];
  const nameById = new Map<string, string>();
  if (ids.length) {
    const { data: people } = await db
      .from("profiles")
      .select("id,full_name,nickname,username")
      .in("id", ids);
    for (const p of people || []) {
      nameById.set(
        p.id,
        p.nickname || p.full_name || p.username || "ผู้ใช้",
      );
    }
  }
  return rows.map((r) =>
    mapOpenAccountRow(r, {
      createdByName: r.created_by ? nameById.get(r.created_by) || null : null,
      ownerSalesName: r.owner_sales_id
        ? nameById.get(r.owner_sales_id) || null
        : null,
    }),
  );
}

/**
 * GET
 * - manager: รายการทั้งหมด (เลิกพึ่งสถานะเปิด/รอ)
 * - sales ?mine=1: เฉพาะที่มอบหมายให้ตัวเอง (งานค้าง/ติดตาม)
 */
export async function GET(req: Request) {
  const session = await getSaleSession();
  if (!session) return bad("unauthorized", 401);

  const db = supabaseAdmin();
  if (!db) return bad("supabase_not_configured", 503);

  const url = new URL(req.url);
  const mine = url.searchParams.get("mine") === "1";
  const isManager = seesAllReports(session.role);

  if (!isManager && !(mine && session.role === "sales")) {
    return bad("forbidden", 403);
  }

  let q = db
    .from("sale_open_accounts")
    .select(SELECT_COLS)
    .order("updated_at", { ascending: false })
    .limit(120);

  if (mine && session.role === "sales") {
    q = q.eq("owner_sales_id", session.id).neq("status", "dropped");
  } else {
    // manager: ไม่โชว์ที่เลิกแล้วเป็นค่าเริ่มต้น — ยังดูได้ด้วย ?status=all
    const status = url.searchParams.get("status") || "active";
    if (status === "all") {
      /* no filter */
    } else if (status === "dropped") {
      q = q.eq("status", "dropped");
    } else {
      q = q.neq("status", "dropped");
    }
  }

  const { data, error } = await q;
  if (error) {
    if (/does not exist|schema cache/i.test(error.message)) {
      return NextResponse.json({ ok: true, accounts: [], needsMigration: true });
    }
    return bad(error.message, 500);
  }

  const accounts = await attachProfileNames(db, data || []);
  return NextResponse.json({ ok: true, accounts });
}

/** POST — ผู้จัดการบันทึก · upsert บริษัท/ผู้ติดต่อฐานเดียวกับ Sale · เก็บชื่อผู้สร้าง */
export async function POST(req: Request) {
  const session = await getSaleSession();
  if (!session) return bad("unauthorized", 401);
  if (!seesAllReports(session.role)) return bad("forbidden", 403);

  const db = supabaseAdmin();
  if (!db) return bad("supabase_not_configured", 503);

  let body: {
    companyName?: string;
    contactName?: string | null;
    phone?: string | null;
    note?: string | null;
    nextAction?: string | null;
    nextActionAt?: string | null;
    sourceRaw?: string | null;
    ownerSalesId?: string | null;
  };
  try {
    body = await req.json();
  } catch {
    return bad("invalid_json");
  }

  const companyName = String(body.companyName || "").trim();
  if (!companyName) return bad("company_required");

  const now = new Date().toISOString();
  const nextActionAt =
    body.nextActionAt && !Number.isNaN(Date.parse(body.nextActionAt))
      ? body.nextActionAt
      : null;

  // ฐานลูกค้าเดียวกับรายงาน Sale
  await upsertCompanyAndContact(db, {
    companyName,
    contactName: body.contactName,
    phone: body.phone,
  });

  const { data, error } = await db
    .from("sale_open_accounts")
    .insert({
      company_name: companyName.slice(0, 200),
      contact_name: body.contactName?.trim()?.slice(0, 120) || null,
      phone: body.phone?.trim()?.slice(0, 40) || null,
      note: body.note?.trim()?.slice(0, 2000) || null,
      status: "open",
      owner_sales_id: body.ownerSalesId || null,
      next_action: body.nextAction?.trim()?.slice(0, 300) || null,
      next_action_at: nextActionAt,
      source_raw: body.sourceRaw?.trim()?.slice(0, 8000) || null,
      created_by: session.id,
      created_at: now,
      updated_at: now,
    })
    .select(SELECT_COLS)
    .single();

  if (error) return bad(error.message, 500);

  const [account] = await attachProfileNames(db, [data]);
  return NextResponse.json({ ok: true, account });
}
