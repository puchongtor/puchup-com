import { NextResponse } from "next/server";
import { getSaleSession } from "@/lib/sales-ai/auth";
import { extractVisitSummary } from "@/lib/sales-ai/secretary";
import { loadVisitForSession } from "@/lib/sales-ai/visit-access";
import type { StoredVisitReport } from "@/lib/sales-ai/types";

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

type Props = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Props) {
  const session = await getSaleSession();
  if (!session) return bad("unauthorized", 401);

  const { id: visitId } = await params;
  const access = await loadVisitForSession(visitId, session);
  if (!access.ok) return bad(access.error, access.status);

  const { visit, db } = access;
  if (visit.status === "confirmed") return bad("already_confirmed", 409);

  const { data: events, error: eErr } = await db
    .from("raw_events")
    .select("id,kind,text_content,meta,received_at")
    .eq("visit_id", visitId)
    .order("received_at", { ascending: true })
    .limit(300);

  if (eErr) return bad(eErr.message, 500);

  const transcript = (events || [])
    .map((row) => {
      const meta = (row.meta || {}) as Record<string, unknown>;
      const who = meta.role === "secretary" ? "ผู้ช่วย" : "เซลล์";
      return `[${who}/${row.kind}/${row.id}] ${row.text_content || ""}`;
    })
    .join("\n");

  await db
    .from("visits")
    .update({
      status: "processing",
      ended_at: new Date().toISOString(),
    })
    .eq("id", visitId);

  const extracted = await extractVisitSummary({
    companyName: visit.company_name_text || "ลูกค้า",
    salesName: session.fullName || session.username,
    transcript: transcript || "(ยังไม่มีบันทึก)",
  });

  if (!extracted.ok) {
    await db.from("visits").update({ status: "in_progress" }).eq("id", visitId);
    return bad(extracted.error, 502);
  }

  const summary = extracted.summary;
  if (!summary.company.name.value) {
    summary.company.name = {
      value: visit.company_name_text,
      confidence: 0.9,
      sources: [],
    };
  }

  const { error: sErr } = await db.from("visit_summaries").upsert(
    {
      visit_id: visitId,
      version: 1,
      status: "ai_draft",
      data: summary,
      field_sources: {},
      field_confidence: {},
      created_by: session.id,
    },
    { onConflict: "visit_id,version" },
  );
  if (sErr) return bad(sErr.message, 500);

  const { error: vErr } = await db
    .from("visits")
    .update({ status: "pending_review" })
    .eq("id", visitId);
  if (vErr) return bad(vErr.message, 500);

  const urgency =
    summary.items?.find((i) => i.urgency === "line_down" || i.urgency === "urgent")
      ?.urgency || "normal";

  const report: StoredVisitReport = {
    id: visitId,
    companyName: summary.company.name.value || visit.company_name_text || "ลูกค้า",
    salesId: visit.sales_id,
    salesName: session.fullName || session.username,
    summary,
    status: "pending_review",
    urgency,
    confirmedAt: null,
    createdAt: visit.created_at || new Date().toISOString(),
  };

  return NextResponse.json({ ok: true, report });
}

/** โหลดสรุป draft ของ visit */
export async function GET(_req: Request, { params }: Props) {
  const session = await getSaleSession();
  if (!session) return bad("unauthorized", 401);

  const { id: visitId } = await params;
  const access = await loadVisitForSession(visitId, session);
  if (!access.ok) return bad(access.error, access.status);

  const { visit, db } = access;
  const { data, error } = await db
    .from("visit_summaries")
    .select("visit_id,status,data,created_at")
    .eq("visit_id", visitId)
    .eq("version", 1)
    .maybeSingle();

  if (error) return bad(error.message, 500);
  if (!data) return bad("summary_not_found", 404);

  const summary = data.data as StoredVisitReport["summary"];
  return NextResponse.json({
    ok: true,
    visit: {
      id: visit.id,
      companyName: visit.company_name_text,
      status: visit.status,
      createdAt: visit.created_at || visit.started_at || null,
    },
    summaryStatus: data.status,
    summary,
  });
}
