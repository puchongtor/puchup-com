import { localKnowledgeReply } from "@/lib/puchup-knowledge";

export type ContactChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ContactChatResponse = {
  sessionId: string;
  reply: string;
  alert: boolean;
  persisted: boolean;
  lineUrl: string;
  offline?: boolean;
  provider?: string;
  aiLive?: boolean;
  notified?: boolean;
};

/** Prefer SaleDesk live API (จุดขายแชท AI) then Supabase Edge Function. */
function resolveContactEndpoints(): string[] {
  const urls: string[] = [];
  const explicit = process.env.NEXT_PUBLIC_CONTACT_CHAT_URL?.replace(/\/$/, "");
  if (explicit) urls.push(explicit);

  const sale = process.env.NEXT_PUBLIC_SALE_URL?.replace(/\/$/, "");
  if (sale) urls.push(`${sale}/api/contact-chat`);

  // Production defaults when env was not baked into static export
  urls.push("https://sale.puchup.com/api/contact-chat");

  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (supabase) urls.push(`${supabase}/functions/v1/contact-chat`);

  return [...new Set(urls)];
}

function offlineResponse(message: string, sessionId?: string | null): ContactChatResponse {
  return {
    sessionId: sessionId || crypto.randomUUID(),
    reply: localKnowledgeReply(message),
    alert: /คุยกับ|ขอราคา|ไลน์|line|นัด|ติดต่อ|สนใจ/i.test(message),
    persisted: false,
    lineUrl: "https://line.me/R/ti/p/@masterpuch",
    offline: true,
    aiLive: false,
    provider: "offline",
  };
}

export async function sendContactChat(input: {
  sessionId?: string | null;
  message: string;
  history: ContactChatMessage[];
  pagePath?: string;
}): Promise<ContactChatResponse> {
  const endpoints = resolveContactEndpoints();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const body = JSON.stringify({
    sessionId: input.sessionId || undefined,
    message: input.message,
    history: input.history,
    pagePath: input.pagePath || "/contact/",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
  });

  for (const url of endpoints) {
    try {
      const headers: Record<string, string> = {
        "content-type": "application/json",
      };
      if (url.includes("/functions/v1/") && anon) {
        headers.apikey = anon;
        headers.Authorization = `Bearer ${anon}`;
      }

      const res = await fetch(url, {
        method: "POST",
        headers,
        body,
      });

      if (!res.ok) continue;

      const data = (await res.json()) as ContactChatResponse;
      if (!data?.reply) continue;
      return {
        ...data,
        offline: data.offline === true,
        aiLive: data.aiLive !== false && data.provider !== "offline",
      };
    } catch {
      // try next endpoint
    }
  }

  return offlineResponse(input.message, input.sessionId);
}
