import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const LINE_OA = "https://line.me/R/ti/p/@masterpuch";

const KNOWLEDGE = `
คุณคือผู้ช่วยของ PuchUp (puchup.com) — พูดภาษาคน เป็นมิตร สุภาพ ไม่ใช้ศัพท์เทคนิคฟุ่มเฟือย
ห้ามแต่งเรื่องราคาหรือฟีเจอร์ที่ไม่มีในข้อมูลด้านล่าง ถ้าไม่แน่ใจให้ชวนคุยทีมทาง LINE

สินค้า/บริการ:
1) Project ONE — เว็บหน้าเดียวเชื่อม Google Business ให้ลูกค้ารู้จักร้านและอยากมาที่ร้าน
2) Corporate Site — เว็บบริษัท 20–30 หน้า เน้น SEO/AEO ราคาเริ่มต้น 25,000 บาท
3) ShopGuide — เว็บสินค้ามีแชท AI พาสู่สินค้า แล้วต่อไป Line OA · เริ่มต้น 35,000 บาท + AI รายเดือนไม่สูง (ประมาณ 990–1,490 บาท/เดือน)
4) PuchUp Partner — พาร์ทเนอร์ฝ่ายการตลาดออนไลน์ สร้างเว็บและระบบ · รายละเอียดตามข้อตกลง (ห้ามใช้คำว่าแบ่งกำไร)
5) SaleDesk — ระบบช่วยทีมขาย · ติดตั้งเริ่มต้น 19,000 บาท + รายเดือนตามขนาดทีม: 1–5 คน ประมาณ 1,990–2,990 บาท/เดือน · 6–10 คน ประมาณ 3,490–4,990 บาท/เดือน
6) OpsCraft — ออกแบบระบบลดขั้นตอนตามธุรกิจลูกค้า · ประเมินตามงาน
กำลังพัฒนา: คุณเจริญ

ผลงานจริง:
- Advance Pro (advancepro-th.com) — เว็บบริษัท B2B อะไหล่เครื่องจักร
- Amethez (amethez.com) — แพลตฟอร์มความรู้คริสตัล + ร้านค้า
- Rabiangprai Valley (rabiangprai.com) — ที่พักรีสอร์ทนครนายก

ช่องทางคุยคนจริง: LINE OA @masterpuch → ${LINE_OA}
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

function detectIntent(text: string): { alert: boolean; reason: string; lead?: Partial<{ name: string; channel: string; need: string }> } {
  const t = text.toLowerCase();
  const wantHuman =
    /คุยกับคน|คุยกับทีม|ขอราคา|ใบเสนอราคา|นัด|โทรหา|ติดต่อกลับ|สนใจจ้าง|อยากได้|ขอเบอร์|line|ไลน์/.test(
      t,
    );
  const channelMatch = text.match(/(?:line|ไลน์|โทร|อีเมล|email)\s*[:：]?\s*([^\s,，]+)/i);
  return {
    alert: wantHuman,
    reason: wantHuman ? "ลูกค้าต้องการคุยต่อ / ขอราคา / นัด" : "",
    lead: {
      channel: channelMatch?.[1],
      need: wantHuman ? text.slice(0, 500) : undefined,
    },
  };
}

async function callClaude(history: ChatMessage[], message: string): Promise<string> {
  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) {
    return fallbackReply(message);
  }

  const messages = [
    ...history.slice(-12).map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: message },
  ];

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
      messages,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("anthropic error", err);
    return fallbackReply(message);
  }

  const data = await res.json();
  const text = data?.content?.find((c: { type: string }) => c.type === "text")?.text;
  return typeof text === "string" && text.trim() ? text.trim() : fallbackReply(message);
}

function fallbackReply(message: string): string {
  const m = message.toLowerCase();
  if (/ราคา|เท่าไหร่|กี่บาท/.test(m)) {
    return "Corporate Site เริ่มต้น 25,000 บาท ส่วนโปรเจคอื่นคุยสcope กับทีมดีกว่าครับ อยากให้ช่วยสรุปสิ่งที่ต้องการแล้วส่งต่อทีมทาง LINE OA @masterpuch ได้เลย";
  }
  if (/project\s*one|หน้าเดียว|google/.test(m)) {
    return "Project ONE คือเว็บหน้าเดียวที่เชื่อม Google Business ให้ลูกค้ารู้จักร้าน ตัดสินใจ และอยากมาที่ร้านครับ เหมาะกับร้านค้า บริการที่อยากให้คนมาที่สถานที่จริง";
  }
  if (/sale|ขาย|ทีมขาย/.test(m)) {
    return "SaleDesk ช่วยทีมขายให้รายงานมีหลักฐาน มีเลขา AI และให้ผู้จัดการเห็นงานค้าง — ไม่ใช่ CRM เต็มรูปแบบครับ";
  }
  return `เล่าธุรกิจหรือสิ่งที่อยากให้ช่วยเพิ่มได้นิดนึงนะครับ เดี๋ยวจัดให้ตรงจุด — หรือคุยกับทีมตรงๆ ได้ที่ LINE OA @masterpuch`;
}

async function maybeWebhook(payload: unknown) {
  const url = Deno.env.get("CONTACT_ALERT_WEBHOOK");
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("webhook failed", e);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const message = (body.message || "").trim();
  if (!message) return json({ error: "empty_message" }, 400);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || Deno.env.get("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    const reply = await callClaude(body.history || [], message);
    return json({
      sessionId: body.sessionId || crypto.randomUUID(),
      reply,
      alert: detectIntent(message).alert,
      persisted: false,
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

  await admin.from("contact_messages").insert({
    session_id: sessionId,
    role: "user",
    content: message,
  });

  const intent = detectIntent(message);
  const reply = await callClaude(body.history || [], message);

  await admin.from("contact_messages").insert({
    session_id: sessionId,
    role: "assistant",
    content: reply,
  });

  if (intent.lead?.need || intent.lead?.channel) {
    await admin.from("contact_leads").upsert(
      {
        session_id: sessionId,
        name: intent.lead.name || null,
        channel: intent.lead.channel || null,
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
    await maybeWebhook({
      type: "contact_alert",
      sessionId,
      reason: intent.reason,
      message,
    });
  }

  return json({
    sessionId,
    reply,
    alert: intent.alert,
    persisted: true,
    lineUrl: LINE_OA,
  });
});
