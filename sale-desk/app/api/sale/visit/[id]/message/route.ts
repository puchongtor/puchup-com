import { NextResponse } from "next/server";
import { getAssistantPersona } from "@/lib/sales-ai/assistant-persona";
import { getSaleSession } from "@/lib/sales-ai/auth";
import {
  askSecretary,
  describePhoto,
  shouldDescribePhoto,
} from "@/lib/sales-ai/secretary";
import { loadVisitForSession } from "@/lib/sales-ai/visit-access";

export const runtime = "nodejs";

type Body = {
  kind?: "text" | "image" | "audio";
  text?: string;
  tag?: string;
  imageBase64?: string;
  mime?: string;
  assistantId?: string;
};

const MAX_IMAGE_CHARS = 1_600_000; // ~1.2MB base64

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function normalizeMime(
  mime?: string,
): "image/jpeg" | "image/png" | "image/gif" | "image/webp" {
  if (mime === "image/png" || mime === "image/gif" || mime === "image/webp") {
    return mime;
  }
  return "image/jpeg";
}

type Props = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Props) {
  const session = await getSaleSession();
  if (!session) return bad("unauthorized", 401);

  const { id: visitId } = await params;
  const access = await loadVisitForSession(visitId, session);
  if (!access.ok) return bad(access.error, access.status);

  const { visit, db } = access;
  if (visit.status === "confirmed" || visit.status === "void") {
    return bad("visit_closed", 409);
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return bad("invalid_json");
  }

  const kind = body.kind || "text";
  const tag = body.tag || "other";
  let text = (body.text || "").trim();
  let imageBase64 = body.imageBase64 || "";
  const mime = normalizeMime(body.mime);

  if (kind === "image") {
    if (!imageBase64) return bad("image_required");
    if (imageBase64.length > MAX_IMAGE_CHARS) return bad("image_too_large");

    // คลิป/รูปหน้างานทั่วไป = เก็บพรีวิวอย่างเดียว ไม่ยิง vision (โทเคนแพง)
    // อ่านตัวอักษรเฉพาะเนมเพลท / นามบัตร / เอกสาร
    if (tag === "machine_clip") {
      text =
        text ||
        "คลิปเครื่องจักร (เก็บเฟรมพรีวิว — ไม่วิเคราะห์วิดีโอเต็ม)";
    } else if (shouldDescribePhoto(tag)) {
      const vision = await describePhoto({
        imageBase64,
        imageMime: mime,
        photoTag: tag,
      });
      const ocrNote = vision.ok ? vision.text : "อ่านไม่ชัด";
      text = text ? `${text} · ${ocrNote}` : ocrNote || `รูป${tag}`;
    } else {
      text = text || `รูป${tag}`;
    }
  } else if (kind === "audio") {
    // Web Speech ส่งมาเป็นข้อความที่ถอดแล้ว
    if (!text) return bad("transcript_required");
    text = `[เสียง] ${text}`;
  } else if (!text) {
    return bad("text_required");
  }

  const salesEventId = crypto.randomUUID();
  const meta: Record<string, unknown> = {
    role: "sales",
    kind,
    tag: kind === "image" ? tag : undefined,
    preview: kind === "image" ? true : undefined,
  };

  // เก็บพรีวิวรูปใน meta เพื่อโชว์ในแชท/หน้ารายงาน (จำกัดขนาดเดียวกับอัปโหลด)
  if (kind === "image" && imageBase64.length <= MAX_IMAGE_CHARS) {
    meta.image_data_url = imageBase64.startsWith("data:")
      ? imageBase64
      : `data:${mime};base64,${imageBase64}`;
  }

  const { error: rawErr } = await db.from("raw_events").insert({
    id: salesEventId,
    visit_id: visitId,
    sales_id: visit.sales_id,
    kind: kind === "image" ? "image" : kind === "audio" ? "audio" : "text",
    text_content: text,
    mime: kind === "image" ? mime : "text/plain",
    meta,
    client_created_at: new Date().toISOString(),
  });
  if (rawErr) return bad(rawErr.message, 500);

  // โหลดประวัติสั้น + working_summary จาก meta ผู้ช่วยก่อนหน้า
  const { data: recent } = await db
    .from("raw_events")
    .select("id,text_content,meta,kind")
    .eq("visit_id", visitId)
    .order("received_at", { ascending: true })
    .limit(40);

  const recentLines: string[] = [];
  let workingSummary: Record<string, unknown> = {};
  for (const row of recent || []) {
    const m = (row.meta || {}) as Record<string, unknown>;
    const role = m.role === "secretary" ? "ผู้ช่วย" : "เซลล์";
    if (row.text_content) recentLines.push(`${role}: ${row.text_content}`);
    if (m.working_summary && typeof m.working_summary === "object") {
      workingSummary = m.working_summary as Record<string, unknown>;
    }
  }

  const { count: priorVisits } = await db
    .from("visits")
    .select("id", { count: "exact", head: true })
    .eq("sales_id", visit.sales_id)
    .neq("id", visitId);
  const isReturning = (priorVisits || 0) > 0;

  const persona = getAssistantPersona(body.assistantId);
  const secretary = await askSecretary({
    salesName: session.fullName || session.username,
    companyName: visit.company_name_text || "ลูกค้า",
    workingSummary,
    userText: text,
    // ไม่ส่งรูปเข้าโมเดลแชทซ้ำ — ประหยัดโทเคน
    photoTag: tag,
    recentLines: recentLines.slice(0, -1),
    isReturning,
    gender: persona.gender,
    assistantName: persona.name,
  });

  if (!secretary.ok) {
    const failReply =
      persona.gender === "male"
        ? "ระบบผู้ช่วยติดขัดชั่วคราว — บันทึกข้อความของคุณไว้แล้วครับ ลองส่งอีกครั้งหรือพิมพ์ต่อได้"
        : "ระบบผู้ช่วยติดขัดชั่วคราว — บันทึกข้อความของคุณไว้แล้วค่ะ ลองส่งอีกครั้งหรือพิมพ์ต่อได้";
    return NextResponse.json({
      ok: true,
      salesEvent: {
        id: salesEventId,
        role: "sales",
        content: text,
        kind,
        tag: kind === "image" ? tag : undefined,
        status: "sent",
      },
      secretary: {
        reply: failReply,
        working_summary_patch: {},
        missing_fields: [],
        flags: [],
        error: secretary.error,
      },
    });
  }

  const nextSummary = {
    ...workingSummary,
    ...secretary.data.working_summary_patch,
  };

  const secretaryEventId = crypto.randomUUID();
  const { error: secErr } = await db.from("raw_events").insert({
    id: secretaryEventId,
    visit_id: visitId,
    sales_id: visit.sales_id,
    kind: "text",
    text_content: secretary.data.reply,
    mime: "text/plain",
    meta: {
      role: "secretary",
      working_summary: nextSummary,
      missing_fields: secretary.data.missing_fields,
      flags: secretary.data.flags,
    },
    client_created_at: new Date().toISOString(),
  });
  if (secErr) return bad(secErr.message, 500);

  // อัปเดตชื่อบริษัทจากที่เซลล์บอกผู้ช่วย (ไม่ดึงของเยี่ยมเก่า)
  const patchedCompany = nextSummary.company_name;
  if (
    typeof patchedCompany === "string" &&
    patchedCompany.trim() &&
    patchedCompany.trim() !== visit.company_name_text
  ) {
    await db
      .from("visits")
      .update({ company_name_text: patchedCompany.trim() })
      .eq("id", visitId);
  }

  const resolvedCompany =
    typeof nextSummary.company_name === "string" && nextSummary.company_name.trim()
      ? nextSummary.company_name.trim()
      : visit.company_name_text;

  return NextResponse.json({
    ok: true,
    visit: { companyName: resolvedCompany },
    salesEvent: {
      id: salesEventId,
      role: "sales",
      content: text,
      kind,
      tag: kind === "image" ? tag : undefined,
      status: "sent",
      imageUrl:
        kind === "image"
          ? meta.image_data_url || null
          : null,
    },
    secretary: {
      id: secretaryEventId,
      role: "secretary",
      reply: secretary.data.reply,
      working_summary_patch: secretary.data.working_summary_patch,
      missing_fields: secretary.data.missing_fields,
      flags: secretary.data.flags,
    },
  });
}
