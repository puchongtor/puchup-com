/** ผู้ช่วยที่เซลล์เลือกได้ — ล็อกจนกว่าจะเปลี่ยนในโปรไฟล์ */

export type AssistantGender = "female" | "male";

export type AssistantPersona = {
  id: string;
  name: string;
  gender: AssistantGender;
  /** คำอธิบายสั้น */
  vibe: string;
  accent: string;
  avatarSrc: string;
};

export const DEFAULT_ASSISTANT_ID = "nara";

/** 9 คน: หญิง 5 · ชาย 4 — หน้าตาต่างกันชัด */
export const ASSISTANT_PERSONAS: AssistantPersona[] = [
  {
    id: "nara",
    name: "นารา",
    gender: "female",
    vibe: "อบอุ่น เป็นกันเอง",
    accent: "#1b1c1e",
    avatarSrc: "/images/sale/assistants/nara.jpg",
  },
  {
    id: "minta",
    name: "มินตา",
    gender: "female",
    vibe: "สดใส ขี้เล่น",
    accent: "#0f766e",
    avatarSrc: "/images/sale/assistants/minta.jpg",
  },
  {
    id: "priya",
    name: "ปรียา",
    gender: "female",
    vibe: "สุภาพ มั่นใจ",
    accent: "#b45309",
    avatarSrc: "/images/sale/assistants/priya.jpg",
  },
  {
    id: "linda",
    name: "ลินดา",
    gender: "female",
    vibe: "เฉียบ กระชับ",
    accent: "#9f1239",
    avatarSrc: "/images/sale/assistants/linda.jpg",
  },
  {
    id: "ananya",
    name: "อนัญญา",
    gender: "female",
    vibe: "อ่อนโยน ใจเย็น",
    accent: "#6d28d9",
    avatarSrc: "/images/sale/assistants/ananya.jpg",
  },
  {
    id: "korn",
    name: "กร",
    gender: "male",
    vibe: "ใจเย็น มืออาชีพ",
    accent: "#1e3a5f",
    avatarSrc: "/images/sale/assistants/korn.jpg",
  },
  {
    id: "pawat",
    name: "ภวัต",
    gender: "male",
    vibe: "ทันสมัย ตรงประเด็น",
    accent: "#334155",
    avatarSrc: "/images/sale/assistants/pawat.jpg",
  },
  {
    id: "thane",
    name: "เธน",
    gender: "male",
    vibe: "ร่าเริง เป็นมิตร",
    accent: "#0e7490",
    avatarSrc: "/images/sale/assistants/thane.jpg",
  },
  {
    id: "arun",
    name: "อรุณ",
    gender: "male",
    vibe: "อบอุ่น น่าเชื่อถือ",
    accent: "#92400e",
    avatarSrc: "/images/sale/assistants/arun.jpg",
  },
];

function storageKey(salesId: string) {
  return `ap_sale_assistant_persona_v1:${salesId || "local"}`;
}

export function getAssistantPersona(id?: string | null): AssistantPersona {
  const found = ASSISTANT_PERSONAS.find((p) => p.id === id);
  return found || ASSISTANT_PERSONAS.find((p) => p.id === DEFAULT_ASSISTANT_ID)!;
}

export function loadAssistantId(salesId: string): string {
  if (typeof window === "undefined" || !salesId) return DEFAULT_ASSISTANT_ID;
  try {
    const raw = localStorage.getItem(storageKey(salesId));
    if (raw && ASSISTANT_PERSONAS.some((p) => p.id === raw)) return raw;
  } catch {
    /* ignore */
  }
  return DEFAULT_ASSISTANT_ID;
}

export function saveAssistantId(salesId: string, assistantId: string) {
  if (typeof window === "undefined" || !salesId) return;
  const id = ASSISTANT_PERSONAS.some((p) => p.id === assistantId)
    ? assistantId
    : DEFAULT_ASSISTANT_ID;
  try {
    localStorage.setItem(storageKey(salesId), id);
  } catch {
    /* ignore */
  }
}

export function particleFor(gender: AssistantGender) {
  return gender === "male"
    ? { polite: "ครับ", question: "ครับ", self: "ผม" }
    : { polite: "ค่ะ", question: "คะ", self: "ดิฉัน" };
}
