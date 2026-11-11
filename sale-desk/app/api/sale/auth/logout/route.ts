import { NextResponse } from "next/server";
import { clearSaleSessionCookie } from "@/lib/sales-ai/auth";

export async function POST() {
  await clearSaleSessionCookie();
  return NextResponse.json({ ok: true });
}
