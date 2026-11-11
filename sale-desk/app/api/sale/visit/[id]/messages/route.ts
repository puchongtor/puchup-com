import { NextResponse } from "next/server";
import { getSaleSession } from "@/lib/sales-ai/auth";
import { loadVisitForSession } from "@/lib/sales-ai/visit-access";
import type { ProtoMessage } from "@/lib/sales-ai/types";

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

type Props = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Props) {
  const session = await getSaleSession();
  if (!session) return bad("unauthorized", 401);

  const { id: visitId } = await params;
  const access = await loadVisitForSession(visitId, session);
  if (!access.ok) return bad(access.error, access.status);

  const { visit, db } = access;
  const { data, error } = await db
    .from("raw_events")
    .select("id,kind,text_content,meta,received_at")
    .eq("visit_id", visitId)
    .order("received_at", { ascending: true })
    .limit(200);

  if (error) return bad(error.message, 500);

  const messages: ProtoMessage[] = (data || []).map((row) => {
    const meta = (row.meta || {}) as Record<string, unknown>;
    const role = meta.role === "secretary" ? "secretary" : "sales";
    const kind =
      row.kind === "image" ? "image" : row.kind === "audio" ? "audio" : "text";
    return {
      id: row.id,
      role,
      content: row.text_content || "",
      kind,
      status: "sent",
      tag: typeof meta.tag === "string" ? meta.tag : undefined,
      imageUrl:
        typeof meta.image_data_url === "string" ? meta.image_data_url : undefined,
    };
  });

  let workingSummary: Record<string, unknown> = {};
  for (const row of data || []) {
    const meta = (row.meta || {}) as Record<string, unknown>;
    if (meta.working_summary && typeof meta.working_summary === "object") {
      workingSummary = meta.working_summary as Record<string, unknown>;
    }
  }

  return NextResponse.json({
    ok: true,
    visit: {
      id: visit.id,
      companyName: visit.company_name_text,
      status: visit.status,
    },
    messages,
    workingSummary,
  });
}
