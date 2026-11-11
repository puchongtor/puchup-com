import type { SaleSession } from "./auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type VisitRow = {
  id: string;
  sales_id: string;
  company_name_text: string | null;
  status: string;
  started_at?: string;
  created_at?: string;
};

export async function loadVisitForSession(
  visitId: string,
  session: SaleSession,
): Promise<{ ok: true; visit: VisitRow; db: NonNullable<ReturnType<typeof supabaseAdmin>> } | { ok: false; error: string; status: number }> {
  const db = supabaseAdmin();
  if (!db) return { ok: false, error: "supabase_not_configured", status: 503 };

  const { data, error } = await db
    .from("visits")
    .select("id,sales_id,company_name_text,status,started_at,created_at")
    .eq("id", visitId)
    .maybeSingle();

  if (error) return { ok: false, error: error.message, status: 500 };
  if (!data) return { ok: false, error: "visit_not_found", status: 404 };

  if (session.role === "sales" && data.sales_id !== session.id) {
    return { ok: false, error: "forbidden", status: 403 };
  }

  return { ok: true, visit: data as VisitRow, db };
}
