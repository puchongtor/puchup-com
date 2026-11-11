import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Glossary ไม่เปิด API สาธารณะ — ใช้ในเลขา AI ผ่าน lib/sales-ai/glossary เท่านั้น */
export async function GET() {
  return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
}
