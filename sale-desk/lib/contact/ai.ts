import {
  CONTACT_SYSTEM_PROMPT,
  fallbackReply,
  type ChatTurn,
} from "@/lib/contact/puchup-knowledge";

function geminiKey() {
  return process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_AI_API_KEY?.trim() || null;
}

function anthropicKey() {
  return process.env.ANTHROPIC_API_KEY?.trim() || null;
}

export function isContactAiConfigured() {
  return Boolean(geminiKey() || anthropicKey());
}

async function callGemini(history: ChatTurn[], message: string): Promise<string | null> {
  const key = geminiKey();
  if (!key) return null;

  const preferred = process.env.GEMINI_CHAT_MODEL?.trim();
  const models = [
    preferred,
    "gemini-flash-latest",
    "gemini-2.5-flash",
    "gemini-flash-lite-latest",
  ].filter((m, i, arr): m is string => Boolean(m) && arr.indexOf(m) === i);

  const contents = [
    ...history.slice(-12).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: CONTACT_SYSTEM_PROMPT }] },
    contents,
    generationConfig: {
      temperature: 0.55,
      maxOutputTokens: 700,
    },
  });

  for (const model of models) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20_000);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          signal: controller.signal,
          body,
        },
      );

      if (!res.ok) {
        console.error("gemini contact error", model, await res.text());
        continue;
      }

      const data = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const text = data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text || "")
        .join("")
        .trim();
      if (text) return text;
    } catch (e) {
      console.error("gemini contact failed", model, e);
    } finally {
      clearTimeout(timer);
    }
  }

  return null;
}

async function callAnthropic(history: ChatTurn[], message: string): Promise<string | null> {
  const key = anthropicKey();
  if (!key) return null;

  const model =
    process.env.ANTHROPIC_MODEL_CHAT?.trim() || "claude-sonnet-4-20250514";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25_000);

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        max_tokens: 800,
        system: CONTACT_SYSTEM_PROMPT,
        messages: [
          ...history.slice(-12).map((m) => ({ role: m.role, content: m.content })),
          { role: "user", content: message },
        ],
      }),
    });

    if (!res.ok) {
      console.error("anthropic contact error", await res.text());
      return null;
    }

    const data = (await res.json()) as {
      content?: { type: string; text?: string }[];
    };
    const text = data.content?.find((c) => c.type === "text")?.text?.trim();
    return text || null;
  } catch (e) {
    console.error("anthropic contact failed", e);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function generateContactReply(
  history: ChatTurn[],
  message: string,
): Promise<{ reply: string; provider: "gemini" | "anthropic" | "fallback" }> {
  const gemini = await callGemini(history, message);
  if (gemini) return { reply: gemini, provider: "gemini" };

  const anthropic = await callAnthropic(history, message);
  if (anthropic) return { reply: anthropic, provider: "anthropic" };

  return { reply: fallbackReply(message), provider: "fallback" };
}
