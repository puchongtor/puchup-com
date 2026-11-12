import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const LINE_OA = "https://line.me/R/ti/p/@masterpuch";

const KNOWLEDGE = `
คุณคือผู้ช่วยประชาสัมพันธ์ของ PuchUp (puchup.com) — โทนอบอุ่น มั่นใจ เป็นมืออาชีพ พูดภาษาคน ไม่ขายแบบกดดัน
เป้าหมาย: ช่วยลูกค้าเข้าใจว่า PuchUp ช่วยธุรกิจอย่างไร แนะนำสินค้าที่เหมาะ สรุปความต้องการ และชวนคุยทีมทาง LINE OA @masterpuch
ห้ามแต่งราคา/ฟีเจอร์ที่ไม่มีในข้อมูลด้านล่าง ถ้าไม่แน่ใจให้ชวนทัก LINE @masterpuch
ตอบสั้นชัด 2–5 ประโยค เมื่อสนใจจริงค่อยถามประเภทธุรกิจ สิ่งที่อยากได้ และช่องทางติดต่อ

สินค้า/บริการ:
1) Project ONE — เว็บท้องถิ่น × Google Business · Starter 9,900 · Local Acquisition 12,900 · Local SEO Site (≤10 หน้า) 17,900 · ดูแลหมุดรายเดือนพิเศษ 2,500 (จาก 3,500) · เคสบ้านทันตแพทย์ · พร้อมขาย
2) Corporate Site — เว็บบริษัท 20–30 หน้า SEO/AEO · เริ่มต้น 25,000 บาท
3) ShopGuide — แชท AI พาสู่สินค้า + Line OA · เริ่มต้น 35,000 บาท + AI รายเดือน ≈ 990–1,490 บาท · ตัวอย่าง AeroPulse
4) PuchUp Partner — พาร์ทเนอร์การตลาดออนไลน์ · รายละเอียดตามข้อตกลง (ห้ามใช้คำว่าแบ่งกำไร)
5) SaleDesk — ระบบช่วยทีมขาย · ติดตั้ง 19,000 บาท + รายเดือนทีม 1–5 คน ≈ 1,990–2,990 · 6–10 คน ≈ 3,490–4,990
6) OpsCraft — ออกแบบระบบตามเคส · ประเมินตามงาน
กำลังพัฒนา: คุณเจริญ

ผลงานจริง: Baan Dental (Project ONE), Advance Pro, Amethez, Rabiangprai Valley
Showcase: AeroPulse (ShopGuide), Project ONE demos
ช่องทางคนจริง: LINE OA @masterpuch → ${LINE_OA}
`.trim();

type ChatMessage = { role: "user" | "assistant"; content: string };

type Body = {
  sessionId?: string;
  message: string;
  pagePath?: string;
  userAgent?: string;
  history?: ChatMessage[];
};

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

function detectIntent(text: string) {
  const t = text.toLowerCase();
  const wantHuman =
    /คุยกับคน|คุยกับทีม|ขอราคา|ใบเสนอราคา|นัด|โทรหา|ติดต่อกลับ|สนใจจ้าง|อยากได้|ขอเบอร์|line|ไลน์|สนใจ|จ้างทำ|ทำเว็บ/.test(
      t,
    );
  const channelMatch = text.match(/(?:line|ไลน์)\s*[:：@]?\s*@?([a-zA-Z0-9._-]{2,32})/i);
  const phoneMatch = text.match(/(0\d{1,2}[-\s]?\d{3}[-\s]?\d{3,4})/);
  return {
    alert: wantHuman || Boolean(channelMatch || phoneMatch),
    reason: wantHuman ? "ลูกค้าสนใจ / ขอราคา / ต้องการคุยต่อ" : "มีช่องทางติดต่อ",
    lead: {
      channel: channelMatch ? `@${channelMatch[1]}` : undefined,
      phone: phoneMatch?.[1],
      need: wantHuman ? text.slice(0, 500) : undefined,
    },
  };
}

async function callGemini(history: ChatMessage[], message: string): Promise<string | null> {
  const key = Deno.env.get("GEMINI_API_KEY") || Deno.env.get("GOOGLE_AI_API_KEY");
  if (!key) return null;
  const model = Deno.env.get("GEMINI_CHAT_MODEL") || "gemini-2.0-flash";
  const contents = [
    ...history.slice(-12).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: KNOWLEDGE }] },
        contents,
        generationConfig: { temperature: 0.55, maxOutputTokens: 700 },
      }),
    },
  );
  if (!res.ok) {
    console.error("gemini error", await res.text());
    return null;
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("").trim();
  return text || null;
}

async function callClaude(history: ChatMessage[], message: string): Promise<string | null> {
  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return null;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: Deno.env.get("ANTHROPIC_MODEL_CHAT") || "claude-sonnet-4-20250514",
      max_tokens: 800,
      system: KNOWLEDGE,
      messages: [
        ...history.slice(-12).map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: message },
      ],
    }),
  });
  if (!res.ok) {
    console.error("anthropic error", await res.text());
    return null;
  }
  const data = await res.json();
  return data?.content?.find((c: { type: string }) => c.type === "text")?.text?.trim() || null;
}

function fallbackReply(message: string): string {
  const m = message.toLowerCase();
  if (/ราคา|เท่าไหร่|กี่บาท/.test(m)) {
    return "Corporate เริ่มต้น 25,000 · ShopGuide เริ่มต้น 35,000 + AI รายเดือน · SaleDesk เริ่มต้น 19,000 + รายเดือนตามทีม — ทัก LINE @masterpuch ได้เลยครับ";
  }
  if (/project\s*one|หน้าเดียว|google/.test(m)) {
    return "Project ONE คือเว็บหน้าเดียวที่เชื่อม Google Business ให้ลูกค้ารู้จักร้านและอยากมาที่ร้านครับ";
  }
  return `เล่าธุรกิจหรือสิ่งที่อยากให้ช่วยเพิ่มได้นิดนึงนะครับ — หรือทัก LINE OA @masterpuch ได้เลย`;
}

async function generateReply(history: ChatMessage[], message: string) {
  const gemini = await callGemini(history, message);
  if (gemini) return { reply: gemini, provider: "gemini" as const };
  const claude = await callClaude(history, message);
  if (claude) return { reply: claude, provider: "anthropic" as const };
  return { reply: fallbackReply(message), provider: "fallback" as const };
}

async function notifyLine(text: string) {
  const notifyToken = Deno.env.get("LINE_NOTIFY_TOKEN");
  if (notifyToken) {
    try {
      await fetch("https://notify-api.line.me/api/notify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${notifyToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ message: text.slice(0, 900) }),
      });
    } catch (e) {
      console.error("LINE Notify failed", e);
    }
  }

  const access = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN");
  const to = Deno.env.get("LINE_ADMIN_USER_ID");
  if (access && to) {
    try {
      await fetch("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to,
          messages: [{ type: "text", text: text.slice(0, 4500) }],
        }),
      });
    } catch (e) {
      console.error("LINE push failed", e);
    }
  }

  const webhook = Deno.env.get("CONTACT_ALERT_WEBHOOK");
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "contact_alert", text }),
      });
    } catch (e) {
      console.error("webhook failed", e);
    }
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const message = (body.message || "").trim();
  if (!message) return json({ error: "empty_message" }, 400);

  const { reply, provider } = await generateReply(body.history || [], message);
  const intent = detectIntent(message);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || Deno.env.get("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceKey) {
    if (intent.alert) {
      await notifyLine(`🔔 PuchUp Contact\n${message}\n—\n${reply}\n${LINE_OA}`);
    }
    return json({
      sessionId: body.sessionId || crypto.randomUUID(),
      reply,
      alert: intent.alert,
      persisted: false,
      provider,
      aiLive: provider !== "fallback",
      offline: provider === "fallback",
      lineUrl: LINE_OA,
    });
  }

  const admin = createClient(supabaseUrl, serviceKey);
  let sessionId = body.sessionId;
  if (!sessionId) {
    const { data, error } = await admin
      .from("contact_sessions")
      .insert({
        page_path: body.pagePath || "/contact/",
        user_agent: body.userAgent || null,
      })
      .select("id")
      .single();
    if (error) {
      console.error(error);
      return json({ error: "session_create_failed" }, 500);
    }
    sessionId = data.id;
  }

  await admin.from("contact_messages").insert([
    { session_id: sessionId, role: "user", content: message },
    { session_id: sessionId, role: "assistant", content: reply },
  ]);

  if (intent.lead?.need || intent.lead?.channel || intent.lead?.phone) {
    await admin.from("contact_leads").upsert(
      {
        session_id: sessionId,
        channel: intent.lead.channel || intent.lead.phone || null,
        need: intent.lead.need || null,
        raw_json: { lastMessage: message, intent },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "session_id" },
    );
  }

  if (intent.alert) {
    await admin.from("contact_alerts").insert({
      session_id: sessionId,
      reason: intent.reason,
      payload: { message, reply },
    });
    await notifyLine(
      `🔔 PuchUp Contact · ${intent.reason}\nSession: ${sessionId}\nลูกค้า: ${message}\nผู้ช่วย: ${reply.slice(0, 400)}\n${LINE_OA}`,
    );
  }

  return json({
    sessionId,
    reply,
    alert: intent.alert,
    persisted: true,
    provider,
    aiLive: provider !== "fallback",
    offline: false,
    lineUrl: LINE_OA,
  });
});
