import { NextResponse } from "next/server";
import { profileFromDb, profileToDb, type DbProfileRow } from "@/lib/sales-ai/db-map";
import type { SalesProfile } from "@/lib/sales-ai/types";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function GET(req: Request) {
  const db = supabaseAdmin();
  if (!db) return bad("supabase_not_configured", 503);

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return bad("missing_id");

  const { data, error } = await db
    .from("profiles")
    .select("id,full_name,nickname,position,phone,email,avatar_url,role,updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) return bad(error.message, 500);
  if (!data) return NextResponse.json({ ok: true, profile: null });

  return NextResponse.json({
    ok: true,
    profile: profileFromDb(data as DbProfileRow, null),
  });
}

export async function PUT(req: Request) {
  const db = supabaseAdmin();
  if (!db) return bad("supabase_not_configured", 503);

  let body: { profile?: SalesProfile };
  try {
    body = await req.json();
  } catch {
    return bad("invalid_json");
  }

  const profile = body.profile;
  if (!profile?.id || !profile.fullName?.trim()) return bad("invalid_profile");

  const row = profileToDb({
    ...profile,
    updatedAt: new Date().toISOString(),
  });

  const { data, error } = await db
    .from("profiles")
    .upsert(row, { onConflict: "id" })
    .select("id,full_name,nickname,position,phone,email,avatar_url,role,updated_at")
    .single();

  if (error) return bad(error.message, 500);

  return NextResponse.json({
    ok: true,
    profile: profileFromDb(data as DbProfileRow, profile.avatarDataUrl),
  });
}
