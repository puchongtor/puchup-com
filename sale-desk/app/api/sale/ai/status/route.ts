import { NextResponse } from "next/server";
import { getSaleSession } from "@/lib/sales-ai/auth";
import {
  CLAUDE_CHAT_MODEL,
  CLAUDE_EXTRACT_MODEL,
  isClaudeConfigured,
  pingClaude,
} from "@/lib/sales-ai/claude";

export const runtime = "nodejs";

/** สถานะ Claude API — admin/manager เท่านั้น · ?ping=1 จะยิงทดสอบจริง */
export async function GET(req: Request) {
  const session = await getSaleSession();
  if (!session || (session.role !== "admin" && session.role !== "manager")) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const configured = isClaudeConfigured();
  const url = new URL(req.url);
  const wantPing = url.searchParams.get("ping") === "1";

  if (!configured) {
    return NextResponse.json({
      ok: false,
      configured: false,
      models: { chat: CLAUDE_CHAT_MODEL, extract: CLAUDE_EXTRACT_MODEL },
      error: "ANTHROPIC_API_KEY_missing",
    });
  }

  if (!wantPing) {
    return NextResponse.json({
      ok: true,
      configured: true,
      models: { chat: CLAUDE_CHAT_MODEL, extract: CLAUDE_EXTRACT_MODEL },
    });
  }

  const ping = await pingClaude();
  if (!ping.ok) {
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        models: { chat: CLAUDE_CHAT_MODEL, extract: CLAUDE_EXTRACT_MODEL },
        error: ping.error,
        status: ping.status,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    configured: true,
    models: { chat: CLAUDE_CHAT_MODEL, extract: CLAUDE_EXTRACT_MODEL },
    ping: {
      model: ping.model,
      text: ping.text,
      inputTokens: ping.inputTokens,
      outputTokens: ping.outputTokens,
    },
  });
}
