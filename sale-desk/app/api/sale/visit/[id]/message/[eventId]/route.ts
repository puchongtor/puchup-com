import { NextResponse } from "next/server";
import { getSaleSession } from "@/lib/sales-ai/auth";
import { loadVisitForSession } from "@/lib/sales-ai/visit-access";

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

type Props = { params: Promise<{ id: string; eventId: string }> };

/** ลบข้อความ/รูปที่ส่งผิด — เฉพาะของเยี่ยมนี้ และยังไม่ปิดงาน */
export async function DELETE(_req: Request, { params }: Props) {
  const session = await getSaleSession();
  if (!session) return bad("unauthorized", 401);

  const { id: visitId, eventId } = await params;
  const access = await loadVisitForSession(visitId, session);
  if (!access.ok) return bad(access.error, access.status);

  const { visit, db } = access;
  if (visit.status === "confirmed" || visit.status === "void") {
    return bad("visit_closed", 409);
  }

  const { data: row, error: findErr } = await db
    .from("raw_events")
    .select("id,visit_id,sales_id,meta,received_at")
    .eq("id", eventId)
    .eq("visit_id", visitId)
    .maybeSingle();

  if (findErr) return bad(findErr.message, 500);
  if (!row) return bad("not_found", 404);

  const meta = (row.meta || {}) as Record<string, unknown>;
  if (meta.role === "secretary") {
    return bad("cannot_delete_assistant", 403);
  }
  if (session.role === "sales" && row.sales_id !== session.id) {
    return bad("forbidden", 403);
  }

  const { error: delErr } = await db.from("raw_events").delete().eq("id", eventId);
  if (delErr) return bad(delErr.message, 500);

  // ลบคำตอบผู้ช่วยถัดไปถ้าตอบตามรูปนี้ทันที
  const { data: nextRows } = await db
    .from("raw_events")
    .select("id,meta,received_at")
    .eq("visit_id", visitId)
    .gt("received_at", row.received_at)
    .order("received_at", { ascending: true })
    .limit(1);

  const next = nextRows?.[0];
  if (next) {
    const nextMeta = (next.meta || {}) as Record<string, unknown>;
    if (nextMeta.role === "secretary") {
      await db.from("raw_events").delete().eq("id", next.id);
    }
  }

  return NextResponse.json({ ok: true, deletedId: eventId });
}
