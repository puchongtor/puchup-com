import { NextResponse } from "next/server";
import {
  getSaleSession,
  hashPassword,
  verifyPassword,
} from "@/lib/sales-ai/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

/** Sale เปลี่ยนรหัสผ่านเอง (ต้องใส่รหัสเดิม) · Admin ยังใช้ /api/sale/users ได้เสมอ */
export async function POST(req: Request) {
  const session = await getSaleSession();
  if (!session) return bad("unauthorized", 401);

  const db = supabaseAdmin();
  if (!db) return bad("supabase_not_configured", 503);

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await req.json();
  } catch {
    return bad("invalid_json");
  }

  const currentPassword = body.currentPassword ?? "";
  const newPassword = body.newPassword ?? "";
  if (!currentPassword || !newPassword) {
    return bad("กรอกรหัสผ่านเดิมและรหัสใหม่");
  }
  if (newPassword.length < 6) return bad("รหัสผ่านใหม่อย่างน้อย 6 ตัว");
  if (newPassword === currentPassword) {
    return bad("รหัสใหม่ต้องต่างจากรหัสเดิม");
  }

  const { data, error } = await db
    .from("profiles")
    .select("id,password_hash,status")
    .eq("id", session.id)
    .maybeSingle();

  if (error) return bad(error.message, 500);
  if (!data || data.status === "suspended" || data.status === "closed") {
    return bad("บัญชีใช้งานไม่ได้", 403);
  }
  if (!verifyPassword(currentPassword, data.password_hash)) {
    return bad("รหัสผ่านเดิมไม่ถูกต้อง", 401);
  }

  const { error: uErr } = await db
    .from("profiles")
    .update({
      password_hash: hashPassword(newPassword),
      updated_at: new Date().toISOString(),
    })
    .eq("id", session.id);

  if (uErr) return bad(uErr.message, 500);
  return NextResponse.json({ ok: true });
}
