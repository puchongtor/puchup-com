import { NextResponse } from "next/server";
import { getSaleSession, hashPassword, type SaleSession } from "@/lib/sales-ai/auth";
import {
  normalizeSaleRole,
  PILOT_MAX_SALES,
  type SaleAppRole,
} from "@/lib/sales-ai/roles";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

async function requireStaff(): Promise<SaleSession | null> {
  const session = await getSaleSession();
  if (!session || (session.role !== "admin" && session.role !== "manager")) {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireStaff();
  if (!session) return bad("forbidden", 403);
  const db = supabaseAdmin();
  if (!db) return bad("supabase_not_configured", 503);

  let q = db
    .from("profiles")
    .select(
      "id,username,full_name,nickname,position,phone,email,role,status,created_at,updated_at",
    )
    .order("created_at", { ascending: true });

  // Manager เห็นเฉพาะบัญชี Sale (+ ตัวเอง)
  if (session.role === "manager") {
    q = q.or(`role.eq.sales,id.eq.${session.id}`);
  }

  const { data, error } = await q;
  if (error) return bad(error.message, 500);
  return NextResponse.json({ ok: true, users: data || [] });
}

export async function POST(req: Request) {
  const session = await requireStaff();
  if (!session) return bad("forbidden", 403);
  const db = supabaseAdmin();
  if (!db) return bad("supabase_not_configured", 503);

  let body: {
    username?: string;
    password?: string;
    fullName?: string;
    role?: string;
    phone?: string;
    email?: string;
    position?: string;
  };
  try {
    body = await req.json();
  } catch {
    return bad("invalid_json");
  }

  const username = body.username?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const fullName = body.fullName?.trim() ?? "";
  let role = normalizeSaleRole(body.role) as SaleAppRole;

  // Manager สร้างได้เฉพาะ Sale
  if (session.role === "manager") {
    role = "sales";
  }

  if (!/^[a-z0-9._-]{3,32}$/.test(username)) {
    return bad("username ใช้ a-z 0-9 . _ - ความยาว 3–32");
  }
  if (password.length < 6) return bad("รหัสผ่านอย่างน้อย 6 ตัว");
  if (!fullName) return bad("กรอกชื่อ");

  if (role === "sales") {
    const { count, error: countErr } = await db
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "sales")
      .neq("status", "closed");
    if (countErr) return bad(countErr.message, 500);
    if ((count || 0) >= PILOT_MAX_SALES) {
      return bad(`ช่วงทดสอบจำกัด Sale ไว้ ${PILOT_MAX_SALES} คน`);
    }
  }

  const row = {
    full_name: fullName,
    nickname: fullName,
    username,
    password_hash: hashPassword(password),
    role,
    phone: body.phone?.trim() || null,
    email: body.email?.trim() || null,
    position:
      body.position?.trim() ||
      (role === "admin"
        ? "Admin ระบบ"
        : role === "manager"
          ? "ผู้บริหาร"
          : "เซลล์ภาคสนาม"),
    status: "active",
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await db
    .from("profiles")
    .insert(row)
    .select("id,username,full_name,role,status,created_at")
    .single();

  if (error) {
    if (error.message.includes("profiles_username_lower_uidx") || error.code === "23505") {
      return bad("username นี้มีแล้ว");
    }
    return bad(error.message, 500);
  }

  return NextResponse.json({ ok: true, user: data });
}

export async function PATCH(req: Request) {
  const session = await getSaleSession();
  if (!session) return bad("forbidden", 403);
  const isStaff = session.role === "admin" || session.role === "manager";
  const db = supabaseAdmin();
  if (!db) return bad("supabase_not_configured", 503);

  let body: {
    id?: string;
    status?: string;
    password?: string;
    username?: string;
    role?: string;
    fullName?: string;
    nickname?: string;
    phone?: string;
    email?: string;
    position?: string;
  };
  try {
    body = await req.json();
  } catch {
    return bad("invalid_json");
  }

  if (!body.id) return bad("missing_id");

  // Sale แก้ได้เฉพาะโปรไฟล์ตัวเอง
  if (!isStaff && body.id !== session.id) {
    return bad("forbidden", 403);
  }

  if (
    body.status &&
    body.status !== "active" &&
    body.status !== "suspended" &&
    body.status !== "closed"
  ) {
    return bad("invalid_status");
  }

  const { data: target, error: tErr } = await db
    .from("profiles")
    .select("id,role,username")
    .eq("id", body.id)
    .maybeSingle();
  if (tErr) return bad(tErr.message, 500);
  if (!target) return bad("not_found", 404);

  // Manager แก้ได้เฉพาะบัญชี Sale — ยกเว้นแก้โปรไฟล์ตัวเอง
  if (
    session.role === "manager" &&
    target.role !== "sales" &&
    body.id !== session.id
  ) {
    return bad("Manager แก้ไขได้เฉพาะบัญชี Sale หรือโปรไฟล์ตัวเอง");
  }
  // ห้ามเปลี่ยนบทบาทบัญชีตัวเอง (ทุก role)
  if (body.id === session.id && body.role) {
    return bad("ห้ามเปลี่ยนบทบาทของบัญชีตัวเอง");
  }
  // Sale ห้ามแก้ status / role ของใคร
  if (!isStaff) {
    body.status = undefined;
    body.role = undefined;
  }

  if (
    body.id === session.id &&
    (body.status === "suspended" || body.status === "closed")
  ) {
    return bad("ห้ามระงับหรือปิดบัญชีที่กำลังล็อกอินอยู่");
  }

  const patch: Record<string, string | null> = {
    updated_at: new Date().toISOString(),
  };
  if (body.status) patch.status = body.status;

  // Manager ห้ามเปลี่ยน role เป็น admin/manager
  if (body.role) {
    if (session.role === "manager") {
      patch.role = "sales";
    } else {
      patch.role = normalizeSaleRole(body.role);
    }
  }

  if (typeof body.username === "string" && body.username.trim()) {
    const username = body.username.trim().toLowerCase();
    if (!/^[a-z0-9._-]{3,32}$/.test(username)) {
      return bad("username ใช้ a-z 0-9 . _ - ความยาว 3–32");
    }
    if (username !== target.username) {
      patch.username = username;
    }
  }
  if (typeof body.fullName === "string" && body.fullName.trim()) {
    patch.full_name = body.fullName.trim();
  }
  if (typeof body.nickname === "string") {
    patch.nickname = body.nickname.trim() || null;
  }
  if (typeof body.phone === "string") patch.phone = body.phone.trim() || null;
  if (typeof body.email === "string") patch.email = body.email.trim() || null;
  if (typeof body.position === "string") {
    patch.position = body.position.trim() || null;
  }
  if (body.password) {
    if (body.password.length < 6) return bad("รหัสผ่านอย่างน้อย 6 ตัว");
    patch.password_hash = hashPassword(body.password);
  }

  const { data, error } = await db
    .from("profiles")
    .update(patch)
    .eq("id", body.id)
    .select("id,username,full_name,nickname,phone,email,position,role,status")
    .single();

  if (error) {
    if (error.message.includes("profiles_username_lower_uidx") || error.code === "23505") {
      return bad("username นี้มีแล้ว");
    }
    return bad(error.message, 500);
  }
  return NextResponse.json({ ok: true, user: data });
}
