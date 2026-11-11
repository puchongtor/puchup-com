import { NextResponse } from "next/server";
import {
  setSaleSessionCookie,
  verifyPassword,
  type SaleSession,
} from "@/lib/sales-ai/auth";
import { homeForRole, normalizeSaleRole } from "@/lib/sales-ai/roles";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const db = supabaseAdmin();
  if (!db) {
    return NextResponse.json({ ok: false, error: "supabase_not_configured" }, { status: 503 });
  }

  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const username = body.username?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  if (!username || !password) {
    return NextResponse.json({ ok: false, error: "กรอกชื่อผู้ใช้และรหัสผ่าน" }, { status: 400 });
  }

  const { data, error } = await db
    .from("profiles")
    .select("id,username,full_name,role,status,password_hash")
    .ilike("username", username)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  if (!data || data.status === "suspended" || data.status === "closed") {
    return NextResponse.json(
      {
        ok: false,
        error:
          data?.status === "closed"
            ? "บัญชีนี้ถูกปิดแล้ว"
            : data?.status === "suspended"
              ? "บัญชีนี้ถูกระงับชั่วคราว"
              : "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
      },
      { status: 401 },
    );
  }
  if (!verifyPassword(password, data.password_hash)) {
    return NextResponse.json(
      { ok: false, error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
      { status: 401 },
    );
  }

  const session: SaleSession = {
    id: data.id,
    username: data.username,
    fullName: data.full_name,
    role: normalizeSaleRole(data.role),
  };
  await setSaleSessionCookie(session);

  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  return NextResponse.json({
    ok: true,
    user: session,
    redirectTo: homeForRole(session.role, host),
  });
}
