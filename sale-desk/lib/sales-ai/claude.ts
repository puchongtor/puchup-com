/**
 * Claude (Anthropic) client สำหรับ Sales AI
 * แชทเลขา = Haiku · สกัด/อ่านรูป = Sonnet
 */

export const CLAUDE_CHAT_MODEL =
  process.env.ANTHROPIC_MODEL_CHAT || "claude-haiku-4-5";
/** สกัดสรุป/อ่านรูป — ใช้ Sonnet รุ่นที่คีย์เข้าถึงได้ (4.5 บนบางบัญชีเป็น 404) */
export const CLAUDE_EXTRACT_MODEL =
  process.env.ANTHROPIC_MODEL_EXTRACT || "claude-sonnet-4-6";

export function anthropicApiKey(): string | null {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  return key || null;
}

export function isClaudeConfigured(): boolean {
  return Boolean(anthropicApiKey());
}

export type ClaudeTextBlock = { type: "text"; text: string };
export type ClaudeImageBlock = {
  type: "image";
  source: {
    type: "base64";
    media_type: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
    data: string;
  };
};
export type ClaudeContentBlock = ClaudeTextBlock | ClaudeImageBlock;
export type ClaudeContent = string | ClaudeContentBlock[];

export type ClaudeMessage = {
  role: "user" | "assistant";
  content: ClaudeContent;
};

export type ClaudeCallResult =
  | {
      ok: true;
      id: string;
      model: string;
      text: string;
      inputTokens: number;
      outputTokens: number;
    }
  | {
      ok: false;
      error: string;
      status?: number;
    };

export function imageBlock(
  base64: string,
  mime: "image/jpeg" | "image/png" | "image/gif" | "image/webp" = "image/jpeg",
): ClaudeImageBlock {
  const data = base64.includes(",") ? base64.split(",")[1]! : base64;
  return {
    type: "image",
    source: { type: "base64", media_type: mime, data },
  };
}

/** ดึง JSON object จากข้อความโมเดล (รองรับ ```json ... ```) */
export function parseClaudeJson<T = unknown>(text: string): T | null {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fence?.[1]?.trim() || trimmed;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}

export async function claudeMessages(opts: {
  model: string;
  system?: string;
  messages: ClaudeMessage[];
  maxTokens?: number;
  temperature?: number;
}): Promise<ClaudeCallResult> {
  const key = anthropicApiKey();
  if (!key) {
    return { ok: false, error: "ANTHROPIC_API_KEY_missing" };
  }

  const controller = new AbortController();
  // สกัดสรุปมักใช้เวลานานกว่าแชทสั้น
  const timeoutMs = Math.max(
    28_000,
    Number(process.env.ANTHROPIC_TIMEOUT_MS || 55_000) || 55_000,
  );
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: opts.model,
        max_tokens: opts.maxTokens ?? 1024,
        temperature: opts.temperature ?? 0.2,
        system: opts.system,
        messages: opts.messages,
      }),
    });

    const json = (await res.json()) as {
      id?: string;
      model?: string;
      content?: Array<{ type?: string; text?: string }>;
      usage?: { input_tokens?: number; output_tokens?: number };
      error?: { message?: string; type?: string };
    };

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: json.error?.message || json.error?.type || `http_${res.status}`,
      };
    }

    const text = (json.content || [])
      .filter((b) => b.type === "text" && b.text)
      .map((b) => b.text!)
      .join("\n")
      .trim();

    return {
      ok: true,
      id: json.id || "",
      model: json.model || opts.model,
      text,
      inputTokens: json.usage?.input_tokens ?? 0,
      outputTokens: json.usage?.output_tokens ?? 0,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "claude_request_failed";
    return { ok: false, error: msg.includes("abort") ? "timeout" : msg };
  } finally {
    clearTimeout(timer);
  }
}

/** ทดสอบคีย์สั้น ๆ — ไม่ใช้ใน production hot path */
export async function pingClaude(): Promise<ClaudeCallResult> {
  return claudeMessages({
    model: CLAUDE_CHAT_MODEL,
    maxTokens: 32,
    messages: [{ role: "user", content: "ตอบคำเดียวว่า ok" }],
  });
}
