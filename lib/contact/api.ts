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
};

function edgeFunctionUrl(): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return null;
  return `${base}/functions/v1/contact-chat`;
}

export async function sendContactChat(input: {
  sessionId?: string | null;
  message: string;
  history: ContactChatMessage[];
  pagePath?: string;
}): Promise<ContactChatResponse> {
  const url = edgeFunctionUrl();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    return {
      sessionId: input.sessionId || crypto.randomUUID(),
      reply: localKnowledgeReply(input.message),
      alert: /คุยกับ|ขอราคา|ไลน์|line|นัด|ติดต่อ/i.test(input.message),
      persisted: false,
      lineUrl: "https://line.me/R/ti/p/@masterpuch",
      offline: true,
    };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      apikey: anon,
      Authorization: `Bearer ${anon}`,
    },
    body: JSON.stringify({
      sessionId: input.sessionId || undefined,
      message: input.message,
      history: input.history,
      pagePath: input.pagePath || "/contact/",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    }),
  });

  if (!res.ok) {
    return {
      sessionId: input.sessionId || crypto.randomUUID(),
      reply: localKnowledgeReply(input.message),
      alert: false,
      persisted: false,
      lineUrl: "https://line.me/R/ti/p/@masterpuch",
      offline: true,
    };
  }

  return (await res.json()) as ContactChatResponse;
}
