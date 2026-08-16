export type AssistantState = {
  business: string | null;
  need: string | null;
  interestedSystem: string | null;
  goal: string | null;
  matchedShowcase: string | null;
  turnCount: number;
};

export type BotAction =
  | { type: "reply"; text: string }
  | { type: "handoff" }
  | { type: "unknown" }
  | { type: "match"; showcase: "aeropulse" }
  | { type: "reply_then_handoff"; text: string };

const BUSINESS_WORDS: [string, string][] = [
  ["ร้านอาหาร", "ร้านอาหาร"],
  ["ร้านจักรยาน", "ร้านจักรยานภาพ/บริการ"],
  ["จักรยาน", "ร้านจักรยาน"],
  ["ร้านกาแฟ", "ร้านกาแฟ"],
  ["สปา", "ร้านสปา"],
  ["คลินิก", "คลินิก"],
  ["โรงแรม", "โรงแรม/ที่พัก"],
];

const NEED_WORDS: [string, string][] = [
  ["หาของไม่เจอ", "ลูกค้าหาสินค้า/บริการไม่เจอ"],
  ["หาเมนู", "ลูกค้าหาเมนูไม่เจอ"],
  ["ตัดสินใจยาก", "ลูกค้าตัดสินใจยาก"],
  ["เลือกไม่ถูก", "ลูกค้าเลือกไม่ถูก"],
  ["จอง", "ต้องการระบบจอง/นัดหมาย"],
  ["นัดหมาย", "ต้องการระบบจอง/นัดหมาย"],
  ["lead", "อยากได้ Lead ที่มีคุณภาพ"],
  ["โทรถาม", "ลูกค้าต้องโทรถามซ้ำๆ"],
];

export function createInitialState(): AssistantState {
  return {
    business: null,
    need: null,
    interestedSystem: null,
    goal: null,
    matchedShowcase: null,
    turnCount: 0,
  };
}

function detectBusiness(t: string): string | null {
  for (const [key, value] of BUSINESS_WORDS) {
    if (t.includes(key)) return value;
  }
  return null;
}

function detectNeed(t: string): string | null {
  for (const [key, value] of NEED_WORDS) {
    if (t.includes(key)) return value;
  }
  return null;
}

export function nextAssistantTurn(
  state: AssistantState,
  userText: string,
): { state: AssistantState; action: BotAction } {
  const t = userText.toLowerCase();
  const next: AssistantState = { ...state, turnCount: state.turnCount + 1 };

  if (
    t.includes("คุยกับคน") ||
    t.includes("คุยกับทีม") ||
    t.includes("ติดต่อทีม") ||
    t.includes("ขอคุยกับคน")
  ) {
    return { state: next, action: { type: "handoff" } };
  }

  if (
    t.includes("erp") ||
    t.includes("บัญชี") ||
    t.includes("ราคาเท่าไหร่") ||
    t.includes("งบประมาณ")
  ) {
    return { state: next, action: { type: "unknown" } };
  }

  if (t.includes("จักรยาน") || t.includes("aeropulse")) {
    next.matchedShowcase = "aeropulse";
    return { state: next, action: { type: "match", showcase: "aeropulse" } };
  }

  const biz = detectBusiness(t);
  const need = detectNeed(t);
  if (biz && !next.business) next.business = biz;
  if (need && !next.need) next.need = need;

  let reply: string;
  if (!next.business && !need) {
    reply = "รับทราบครับ — ตอนนี้ธุรกิจของคุณทำอะไรอยู่ครับ?";
  } else if (next.business && !next.need) {
    reply = "เข้าใจครับ ตอนนี้สิ่งที่อยากให้ระบบช่วยมากที่สุดคืออะไรครับ?";
  } else if (next.need && !next.business) {
    reply = "เข้าใจครับ แล้วตอนนี้ธุรกิจของคุณทำอะไรอยู่ครับ?";
  } else if (next.business && next.need && !next.goal) {
    next.goal = "ให้ลูกค้าได้สิ่งที่ต้องการเร็วขึ้นและธุรกิจทำงานง่ายขึ้น";
    reply =
      "รับทราบครับ ผมสรุปสิ่งที่คุยกันไว้ให้แล้วครับ พร้อมส่งให้ทีม PuchUp ดูไหมครับ?";
    return { state: next, action: { type: "reply_then_handoff", text: reply } };
  } else {
    reply = "รับทราบครับ ผมส่งต่อให้ทีม PuchUp ดูรายละเอียดต่อได้เลยไหมครับ?";
  }

  if (next.turnCount >= 4 && !next.goal) {
    reply += " ถ้าอยากคุยรายละเอียดกับทีมเลย บอกผมได้ครับ";
  }

  return { state: next, action: { type: "reply", text: reply } };
}
