import {
  CLAUDE_CHAT_MODEL,
  claudeMessages,
  parseClaudeJson,
  type ClaudeMessage,
} from "./claude";
import { SALE_BRAND } from "./brand";
import {
  formatDayPlanStopsShort,
  normalizeDayPlanStops,
  type DayPlanStop,
} from "./day-plans";
import { formatGlossaryForPrompt } from "./glossary";
import { formatProductLinksForPrompt } from "./product-links";

export type CoachChatTurn = {
  role: "sales" | "assistant";
  content: string;
};

export type CoachDayPlanPayload = {
  stops: DayPlanStop[];
  note: string | null;
};

function coachSystem(opts: {
  salesName: string;
  monthPoints: number;
  monthAverage: number;
  confirmedCount: number;
  glossaryBlock: string;
  gender: "female" | "male";
  assistantName: string;
  existingPlanBlock: string;
}): string {
  const genderVoice =
    opts.gender === "male"
      ? `Voice LOCKED male coworker «${opts.assistantName}»: use ครับ and ผม. Never ค่ะ/คะ/ดิฉัน. Natural endings like นะครับ / ได้เลยครับ.`
      : `Voice LOCKED female coworker «${opts.assistantName}»: use ค่ะ/คะ, ดิฉัน sparingly. Never ครับ/ผม. Natural endings like นะคะ / ได้เลยค่ะ.`;

  return `You are the personal field assistant ${opts.assistantName} for salesperson ${opts.salesName} at ${SALE_BRAND.legalName} (${SALE_BRAND.name}).
This chat is NOT a customer visit log. Help with coaching, visit prep, morning day plans, habits, score tips, handling customer situations, and product knowledge.

${genderVoice}
- Never call yourself เลขา.
- Speak like chatting Line with a teammate: clear, warm, everyday Thai.
- Do NOT open with filler like «ชอบคำถามนี้» / «เป็นคำถามที่ดีมาก» / «ลับสำเร็จ» / «สูตรความสำเร็จ».
- Avoid translationese. Prefer plain words: เคล็ดลับ / วิธีทำคะแนนดี.
- One polite particle per sentence is enough. Don't sound like a brochure or AI lecture.

Length — match the ask (NOT always short):
- Quick fact / yes-no: 1–2 sentences.
- Advice, prep before a visit, objection handling, score coaching: give a full useful answer (a short paragraph and/or 1) 2) 3) tips). Do not cut useful counsel just to save tokens.
- Never pad. Skip anything that does not help. No repeating the question back.

Morning day plan (สำคัญ):
- If they describe today's schedule (ไปบริษัทไหน กี่โมง ไปกับใคร เจอใคร เพื่ออะไร) fill dayPlan.stops.
- Each stop: company (required), time, withWhom, meetWho, purpose — use null when unknown.
- CRITICAL: dayPlan.stops must be the COMPLETE list for today after this message — every stop already saved plus any new/changed ones. Never return only the newly mentioned stop (that wipes the rest for the manager).
- If they add «แล้วบริษัท C…» keep prior stops and append/update. Restate ALL stops in reply (1) 2) …).
- Ask at most 1–2 missing fields that help the visit (เจอใคร / ไปเพื่ออะไร). Do not interrogate every blank.
- Acknowledge and restate the full plan so they know it is recorded for the manager.
- If they only chat casually with no schedule change, set dayPlan to null (keep existing DB plan as-is).
- Do NOT invent companies or times they did not say.
- You only help THIS salesperson with THEIR own plan. You cannot see other salespeople's plans or the manager dashboard. Never claim to know the whole team's schedule.

${opts.existingPlanBlock}

Content:
- Warm and practical. Ready to counsel whenever they ask.
- Before they go see a customer: help clarify goal, what to ask, what to bring, what to confirm — tied to that visit purpose.
- At most one follow-up question when it truly helps the next step.
- Month score context if useful: รวม ${opts.monthPoints} คะแนน · เฉลี่ย ${opts.monthAverage} · ยืนยัน ${opts.confirmedCount} ครั้ง.
- Score tips if asked: บอกให้ชัดว่าไปทำอะไร/เจอใคร, สรุปงานต่อได้, แนบรูป 3–5 ใบ, ยืนยันสรุปในวันเยี่ยม.
- Products: plain summary first (enough to act on). Then on a new line send ONE official website link for more detail. Never invent prices/specs.
- Prefer the matching product URL from the list below. If unsure, use the company homepage.
- Do not say «ติดต่อฝ่ายขายหลัก» as the main next step — the salesperson IS the sales; offer the web link for specs/photos instead.
- If they need to log a real visit, gently point to «เริ่มเยี่ยมลูกค้า».

Formatting inside reply string (mobile):
- Plain Thai only. No markdown, no **bold**, no #, no * or - bullets.
- Blank line between each tip. Use 1) 2) 3) with a blank line after each.
- Each tip = 1–3 sentences when needed. Usually up to 5 tips for real advice; fewer for simple asks.
- Put the URL alone on its own line after the summary so it is easy to tap.
- Match particle gender strictly in every sentence.

${opts.glossaryBlock}

${formatProductLinksForPrompt()}

Output ONLY JSON:
{ "reply": string, "dayPlan": null | { "stops": [{ "company": string, "time": string|null, "withWhom": string|null, "meetWho": string|null, "purpose": string|null }], "note": string|null } }`;
}

/** เก็บข้อความให้อ่านง่าย + ตัดประโยคแปลกที่ AI ชอบเปิด */
export function normalizeCoachReply(raw: string) {
  let text = raw.replace(/\r\n/g, "\n").trim();
  text = text.replace(/\*\*([^*]+)\*\*/g, "$1");
  text = text.replace(/__([^_]+)__/g, "$1");
  text = text.replace(/^#{1,6}\s+/gm, "");
  text = text.replace(/^\s*[-*•]\s+/gm, "");
  text = text.replace(/(\d+)[.、]\s*/g, "$1) ");
  text = text.replace(/\s+(\d+\))/g, "\n\n$1");
  text = text.replace(/\n{3,}/g, "\n\n");

  text = text.replace(/ลับสำเร็จ/g, "เคล็ดลับ");
  text = text.replace(/สูตรความสำเร็จของคะแนนสูง/g, "วิธีทำคะแนนดี");
  text = text.replace(/ความสำเร็จของคะแนนสูง/g, "คะแนนดี");
  text = text.replace(
    /^(ดิฉัน)?ชอบคำถามนี้(มาก)?ค่ะ[!.…\s]*/gm,
    "",
  );
  text = text.replace(
    /^(นี่)?เป็นคำถามที่(ดี|เยี่ยม)(มาก)?ค่ะ[!.…\s]*/gm,
    "",
  );
  text = text.replace(/ค่ะค่ะ/g, "ค่ะ");
  text = text.replace(/\n{3,}/g, "\n\n").trim();
  return text;
}

export async function askCoach(opts: {
  salesName: string;
  userText: string;
  history?: CoachChatTurn[];
  monthPoints?: number;
  monthAverage?: number;
  confirmedCount?: number;
  gender?: "female" | "male";
  assistantName?: string;
  /** แผนวันนี้ที่บันทึกแล้ว — ให้โมเดลไม่ทับเหลือจุดเดียว */
  existingStops?: DayPlanStop[];
}): Promise<
  | { ok: true; reply: string; dayPlan: CoachDayPlanPayload | null }
  | { ok: false; error: string }
> {
  const gender = opts.gender === "male" ? "male" : "female";
  const assistantName = opts.assistantName || "ผู้ช่วย";
  const glossaryBlock = formatGlossaryForPrompt({
    query: opts.userText,
    limit: 50,
  });
  const existing = opts.existingStops || [];
  const existingPlanBlock =
    existing.length > 0
      ? `Already saved day plan for today (manager can see this):\n${formatDayPlanStopsShort(existing)}\nWhen the salesperson adds/changes stops, return dayPlan.stops with the FULL updated list.`
      : `No day plan saved yet for today.`;

  const history: ClaudeMessage[] = (opts.history || []).slice(-10).map((t) => ({
    role: t.role === "assistant" ? "assistant" : "user",
    content: t.content,
  }));

  const result = await claudeMessages({
    model: CLAUDE_CHAT_MODEL,
    system: coachSystem({
      salesName: opts.salesName,
      monthPoints: opts.monthPoints ?? 0,
      monthAverage: opts.monthAverage ?? 0,
      confirmedCount: opts.confirmedCount ?? 0,
      glossaryBlock,
      gender,
      assistantName,
      existingPlanBlock,
    }),
    maxTokens: 1100,
    temperature: 0.35,
    messages: [
      ...history,
      { role: "user", content: opts.userText },
    ],
  });

  if (!result.ok) return { ok: false, error: result.error };

  const parsed = parseClaudeJson<{
    reply?: string;
    dayPlan?: {
      stops?: unknown;
      note?: string | null;
    } | null;
  }>(result.text);

  let reply = normalizeCoachReply(parsed?.reply || result.text || "");
  // ถ้าโมเดลคืน JSON ทั้งก้อนเป็น reply ให้พยายามดึง reply อีกครั้ง
  if (reply.startsWith("{") && reply.includes("reply")) {
    const again = parseClaudeJson<{ reply?: string }>(reply);
    if (again?.reply) reply = normalizeCoachReply(again.reply);
  }

  if (!reply) {
    reply =
      gender === "male"
        ? "รับทราบครับ มีอะไรอยากปรึกษาเพิ่ม บอกผมได้เลยนะครับ\n\nคะแนน สินค้า กำหนดการเช้า หรือวิธีรับมือลูกค้าก็ได้ครับ"
        : "รับทราบค่ะ มีอะไรอยากปรึกษาเพิ่ม บอกดิฉันได้เลยนะคะ\n\nคะแนน สินค้า กำหนดการเช้า หรือวิธีรับมือลูกค้าก็ได้ค่ะ";
  }

  const stops = normalizeDayPlanStops(parsed?.dayPlan?.stops);
  const dayPlan: CoachDayPlanPayload | null =
    stops.length > 0
      ? {
          stops,
          note:
            typeof parsed?.dayPlan?.note === "string"
              ? parsed.dayPlan.note.trim().slice(0, 500) || null
              : null,
        }
      : null;

  return { ok: true, reply: reply.slice(0, 2200), dayPlan };
}
