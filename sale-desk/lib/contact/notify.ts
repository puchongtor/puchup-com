import { createClient } from "@supabase/supabase-js";
import { LINE_OA_ID, LINE_OA_URL } from "@/lib/contact/puchup-knowledge";

export type ContactAlertPayload = {
  type: "contact_alert" | "contact_message";
  sessionId: string;
  reason?: string;
  message: string;
  reply?: string;
  name?: string;
  channel?: string;
  phone?: string;
  pagePath?: string;
  provider?: string;
};

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function persistContactTurn(input: {
  sessionId?: string;
  message: string;
  reply: string;
  pagePath?: string;
  userAgent?: string;
  lead?: {
    alert: boolean;
    reason: string;
    name?: string;
    channel?: string;
    phone?: string;
    need?: string;
  };
}) {
  const admin = adminClient();
  if (!admin) {
    return { sessionId: input.sessionId || crypto.randomUUID(), persisted: false };
  }

  let sessionId = input.sessionId;
  if (!sessionId) {
    const { data, error } = await admin
      .from("contact_sessions")
      .insert({
        page_path: input.pagePath || "/contact/",
        user_agent: input.userAgent || null,
      })
      .select("id")
      .single();
    if (error || !data) {
      console.error("contact session create failed", error);
      return { sessionId: crypto.randomUUID(), persisted: false };
    }
    sessionId = data.id as string;
  }

  await admin.from("contact_messages").insert([
    { session_id: sessionId, role: "user", content: input.message },
    { session_id: sessionId, role: "assistant", content: input.reply },
  ]);

  const lead = input.lead;
  if (lead && (lead.need || lead.channel || lead.phone || lead.name)) {
    await admin.from("contact_leads").upsert(
      {
        session_id: sessionId,
        name: lead.name || null,
        channel: lead.channel || lead.phone || null,
        need: lead.need || input.message.slice(0, 500),
        raw_json: { lead, pagePath: input.pagePath },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "session_id" },
    );

    // Also mirror into SaleDesk CRM leads when phone/name present
    if (lead.name || lead.phone) {
      await admin.from("leads").insert({
        name: lead.name || "ลูกค้าจากเว็บ PuchUp",
        phone: lead.phone || lead.channel || "-",
        interest: lead.need?.slice(0, 200) || "Contact chat",
        details: input.message,
        source: "puchup-contact-chat",
        status: "new",
      });
    }
  }

  if (lead?.alert) {
    await admin.from("contact_alerts").insert({
      session_id: sessionId,
      reason: lead.reason,
      payload: { message: input.message, reply: input.reply },
    });
  }

  return { sessionId, persisted: true };
}

async function lineNotify(text: string) {
  const token = process.env.LINE_NOTIFY_TOKEN?.trim();
  if (!token) return false;
  try {
    const body = new URLSearchParams({ message: text.slice(0, 900) });
    const res = await fetch("https://notify-api.line.me/api/notify", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    if (!res.ok) {
      console.error("LINE Notify failed", await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("LINE Notify error", e);
    return false;
  }
}

async function lineMessagingPush(text: string) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN?.trim();
  const to = process.env.LINE_ADMIN_USER_ID?.trim();
  if (!token || !to) return false;

  try {
    const res = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        messages: [{ type: "text", text: text.slice(0, 4500) }],
      }),
    });
    if (!res.ok) {
      console.error("LINE push failed", await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("LINE push error", e);
    return false;
  }
}

async function webhookNotify(payload: ContactAlertPayload) {
  const url = process.env.CONTACT_ALERT_WEBHOOK?.trim();
  if (!url) return false;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (e) {
    console.error("webhook failed", e);
    return false;
  }
}

export async function notifyBackendAndLine(payload: ContactAlertPayload) {
  const lines = [
    `🔔 PuchUp Contact · ${payload.reason || "ข้อความใหม่"}`,
    `Session: ${payload.sessionId}`,
    payload.pagePath ? `หน้า: ${payload.pagePath}` : null,
    payload.name ? `ชื่อ: ${payload.name}` : null,
    payload.channel ? `ช่องทาง: ${payload.channel}` : null,
    payload.phone ? `เบอร์: ${payload.phone}` : null,
    "",
    `ลูกค้า: ${payload.message}`,
    payload.reply ? `\nผู้ช่วย: ${payload.reply.slice(0, 400)}` : null,
    "",
    `LINE OA: ${LINE_OA_ID} ${LINE_OA_URL}`,
  ]
    .filter(Boolean)
    .join("\n");

  const [notifyOk, pushOk, hookOk] = await Promise.all([
    lineNotify(lines),
    lineMessagingPush(lines),
    webhookNotify(payload),
  ]);

  return {
    lineNotify: notifyOk,
    linePush: pushOk,
    webhook: hookOk,
    any: notifyOk || pushOk || hookOk,
  };
}
