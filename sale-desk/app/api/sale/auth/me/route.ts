import { NextResponse } from "next/server";
import { getSaleSession } from "@/lib/sales-ai/auth";
import { homeForRole } from "@/lib/sales-ai/roles";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await getSaleSession();
  if (!session) {
    return NextResponse.json({ ok: false, user: null }, { status: 401 });
  }

  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const db = supabaseAdmin();
  if (!db) {
    return NextResponse.json({
      ok: true,
      user: session,
      redirectTo: homeForRole(session.role, host),
    });
  }

  const { data } = await db
    .from("profiles")
    .select("id,username,full_name,nickname,position,phone,email,avatar_url,role,status")
    .eq("id", session.id)
    .maybeSingle();

  if (!data || data.status === "suspended" || data.status === "closed") {
    return NextResponse.json({ ok: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    user: {
      id: data.id,
      username: data.username,
      fullName: data.full_name,
      nickname: data.nickname,
      position: data.position,
      phone: data.phone,
      email: data.email,
      avatarUrl: data.avatar_url,
      role: data.role,
      status: data.status,
    },
    redirectTo: homeForRole(session.role, host),
  });
}
