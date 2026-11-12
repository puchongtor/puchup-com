import { NextRequest, NextResponse } from "next/server";
import { generateContactReply, isContactAiConfigured } from "@/lib/contact/ai";
import {
  detectLeadIntent,
  LINE_OA_URL,
  type ChatTurn,
} from "@/lib/contact/puchup-knowledge";
import { notifyBackendAndLine, persistContactTurn } from "@/lib/contact/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_ORIGINS = [
  "https://puchup.com",
  "https://www.puchup.com",
  "https://sale.puchup.com",
  "http://localhost:3000",
  "http://localhost:3002",
];

function corsHeaders(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, authorization, apikey",
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

type Body = {
  sessionId?: string;
  message?: string;
  pagePath?: string;
  userAgent?: string;
  history?: ChatTurn[];
};

export async function POST(req: NextRequest) {
  const headers = corsHeaders(req);

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400, headers });
  }

  const message = (body.message || "").trim();
  if (!message) {
    return NextResponse.json({ error: "empty_message" }, { status: 400, headers });
  }

  const history = Array.isArray(body.history) ? body.history.slice(-12) : [];
  const { reply, provider } = await generateContactReply(history, message);
  const intent = detectLeadIntent(message);

  const { sessionId, persisted } = await persistContactTurn({
    sessionId: body.sessionId,
    message,
    reply,
    pagePath: body.pagePath || "/contact/",
    userAgent: body.userAgent,
    lead: intent,
  });

  let notified = false;
  if (intent.alert) {
    const n = await notifyBackendAndLine({
      type: "contact_alert",
      sessionId,
      reason: intent.reason,
      message,
      reply,
      name: intent.name,
      channel: intent.channel,
      phone: intent.phone,
      pagePath: body.pagePath || "/contact/",
      provider,
    });
    notified = n.any;
  } else if (process.env.CONTACT_NOTIFY_EVERY_MESSAGE === "1") {
    const n = await notifyBackendAndLine({
      type: "contact_message",
      sessionId,
      reason: "ข้อความใหม่จากแชทเว็บ",
      message,
      reply,
      pagePath: body.pagePath || "/contact/",
      provider,
    });
    notified = n.any;
  }

  return NextResponse.json(
    {
      sessionId,
      reply,
      alert: intent.alert,
      persisted,
      notified,
      provider,
      offline: provider === "fallback",
      lineUrl: LINE_OA_URL,
      aiLive: provider !== "fallback",
    },
    { headers },
  );
}
