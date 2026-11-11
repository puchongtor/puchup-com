import { NextResponse } from "next/server";
import { getSaleSession } from "@/lib/sales-ai/auth";
import { loadVisitForSession } from "@/lib/sales-ai/visit-access";

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

type Props = { params: Promise<{ id: string }> };

/** ปิด/ยกเลิกเยี่ยมที่กดผิด — ตั้ง status = void */
export async function PATCH(req: Request, { params }: Props) {
  const session = await getSaleSession();
  if (!session) return bad("unauthorized", 401);

  const { id: visitId } = await params;
  const access = await loadVisitForSession(visitId, session);
  if (!access.ok) return bad(access.error, access.status);

  const { visit, db } = access;
  if (visit.status === "confirmed") {
    return bad("already_confirmed", 409);
  }
  if (visit.status === "void") {
    return NextResponse.json({ ok: true, visit: { id: visitId, status: "void" } });
  }

  let body: { action?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* empty body ok for void */
  }

  if (body.action && body.action !== "void" && body.action !== "discard") {
    return bad("unsupported_action");
  }

  const { error } = await db
    .from("visits")
    .update({
      status: "void",
      ended_at: new Date().toISOString(),
    })
    .eq("id", visitId);

  if (error) return bad(error.message, 500);

  return NextResponse.json({
    ok: true,
    visit: { id: visitId, status: "void" },
  });
}
