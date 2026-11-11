"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { AssistantFace } from "@/components/sales-ai/AssistantFace";
import {
  getAssistantPersona,
  loadAssistantId,
  type AssistantPersona,
} from "@/lib/sales-ai/assistant-persona";

type Turn = { id: string; role: "sales" | "assistant"; content: string };

/** ตัวอย่างเปิดคุย — ภาษาคน · สุ่ม 4 อันต่อครั้ง ไม่ตายตัว */
const SUGGESTION_POOL = [
  "วันนี้วางแผนไปหาลูกค้า…",
  "เช้านี้จะออกไปประมาณกี่โมง",
  "ช่วยจดแผนวันนี้ให้หน่อย",
  "ยังไม่แน่ใจลำดับ จะคุยก่อนนะ",
  "มีลูกค้าเก่าที่ต้องตาม ช่วยคิดลำดับให้หน่อย",
  "วันนี้เน้นเสนอสินค้าตัวไหนดี",
  "ก่อนออก ขอเช็กของที่ต้องพกหน่อย",
  "ลูกค้าทักมาเมื่อวาน วันนี้ควรไปไหม",
  "ช่วยสรุปแผนเช้าให้สั้นๆ ได้ไหม",
  "ถ้าฝนตก จัดเส้นทางยังไงดี",
];

function pickSuggestions(count = 4) {
  const pool = [...SUGGESTION_POOL];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

function storageKey(salesId: string) {
  return `ap_sale_coach_chat_v2:${salesId}`;
}

function loadTurns(salesId: string): Turn[] {
  if (typeof window === "undefined" || !salesId) return [];
  try {
    const raw = localStorage.getItem(storageKey(salesId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Turn[];
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(-40);
  } catch {
    return [];
  }
}

function saveTurns(salesId: string, turns: Turn[]) {
  if (typeof window === "undefined" || !salesId) return;
  try {
    localStorage.setItem(storageKey(salesId), JSON.stringify(turns.slice(-40)));
  } catch {
    /* quota */
  }
}

function politeName(salesName: string) {
  const name = (salesName || "").trim();
  if (!name) return "เซลล์";
  return /^คุณ/.test(name) ? name : `คุณ${name}`;
}

function welcomeFor(persona: AssistantPersona, salesName: string) {
  if (persona.gender === "male") {
    return `สวัสดีครับ${politeName(salesName)} — บอกแผนเช้าได้เลยครับ ผมจดให้ผู้จัดการเห็น`;
  }
  return `สวัสดีค่ะ${politeName(salesName)} — บอกแผนเช้าได้เลยค่ะ ดิฉันจดให้ผู้จัดการเห็น`;
}

function formatChatText(raw: string) {
  let text = raw.replace(/\r\n/g, "\n");
  text = text.replace(/\*\*([^*]+)\*\*/g, "$1");
  text = text.replace(/__([^_]+)__/g, "$1");
  text = text.replace(/(\d+)[.、]\s*/g, "$1) ");
  text = text.replace(/\s+(\d+\))/g, "\n\n$1");
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

const URL_RE = /(https?:\/\/[^\s]+)/g;

function renderLineWithLinks(line: string, mine: boolean) {
  const parts = line.split(URL_RE);
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      const href = part.replace(/[),.;]+$/, "");
      return (
        <a
          key={`u-${i}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all underline underline-offset-2"
          style={{ color: mine ? "#fff" : "var(--sale-navy)" }}
        >
          {href}
        </a>
      );
    }
    return <span key={`t-${i}`}>{part}</span>;
  });
}

function ChatBubbleText({
  content,
  mine,
}: {
  content: string;
  mine: boolean;
}) {
  const lines = formatChatText(content);
  return (
    <div className="space-y-2.5">
      {lines.map((line, i) => (
        <p
          key={`${i}-${line.slice(0, 12)}`}
          className="text-[13px] leading-snug"
          style={{ color: mine ? "#fff" : "var(--sale-text)" }}
        >
          {renderLineWithLinks(line, mine)}
        </p>
      ))}
    </div>
  );
}

type Props = {
  salesId: string;
  salesName: string;
  monthPoints: number;
  monthAverage: number;
  confirmedCount: number;
  onDayPlanSaved?: () => void;
};

export function HomeCoachChat({
  salesId,
  salesName,
  monthPoints,
  monthAverage,
  confirmedCount,
  onDayPlanSaved,
}: Props) {
  const [persona, setPersona] = useState<AssistantPersona>(() =>
    getAssistantPersona(null),
  );
  const [turns, setTurns] = useState<Turn[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const suggestions = useMemo(() => pickSuggestions(4), []);

  useEffect(() => {
    const p = getAssistantPersona(loadAssistantId(salesId));
    setPersona(p);
    const loaded = loadTurns(salesId);
    if (loaded.length === 0) {
      setTurns([
        {
          id: "welcome",
          role: "assistant",
          content: welcomeFor(p, salesName),
        },
      ]);
    } else {
      setTurns(loaded);
    }
    setReady(true);
  }, [salesId, salesName]);

  useEffect(() => {
    if (!ready || !salesId) return;
    saveTurns(salesId, turns);
  }, [turns, salesId, ready]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, sending]);

  async function send(raw?: string) {
    const value = (raw ?? text).trim();
    if (!value || sending) return;
    setText("");
    setError(null);
    const salesTurn: Turn = {
      id: `s-${Date.now()}`,
      role: "sales",
      content: value,
    };
    const nextHistory = [...turns, salesTurn];
    setTurns(nextHistory);
    setSending(true);
    try {
      const res = await fetch("/api/sale/coach/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: value,
          assistantId: persona.id,
          history: nextHistory
            .filter((t) => t.id !== "welcome")
            .slice(0, -1)
            .slice(-10)
            .map((t) => ({ role: t.role, content: t.content })),
          monthPoints,
          monthAverage,
          confirmedCount,
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        reply?: string;
        error?: string;
        dayPlan?: { stops?: unknown[] } | null;
        planSaved?: unknown;
        planError?: string;
      };
      if (!res.ok || !json.ok || !json.reply) {
        setError(json.error || "ส่งไม่สำเร็จ");
        return;
      }
      setTurns((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: json.reply!,
        },
      ]);
      if (json.planSaved) onDayPlanSaved?.();
      if (json.planError) setError(`บันทึกกำหนดการไม่สำเร็จ: ${json.planError}`);
      else if (json.error) setError(`ผู้ช่วย: ${json.error}`);
    } catch {
      setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    } finally {
      setSending(false);
    }
  }

  return (
    <section
      className="flex flex-col overflow-hidden rounded-2xl bg-white/90 shadow-sm"
      style={{ border: `1.5px solid ${persona.accent}` }}
    >
      <div
        className="flex items-center gap-2.5 border-b px-3 py-2.5"
        style={{
          borderColor: persona.accent,
          background: `color-mix(in srgb, ${persona.accent} 8%, white)`,
        }}
      >
        <AssistantFace persona={persona} size={36} />
        <div className="min-w-0">
          <p className="text-sm font-semibold" style={{ color: "var(--sale-navy)" }}>
            คุยกับ{persona.name}
          </p>
          <p className="text-[11px]" style={{ color: "var(--sale-muted)" }}>
            ผู้ช่วย · {persona.vibe}
          </p>
        </div>
      </div>

      <div
        className="h-[18rem] space-y-2.5 overflow-y-auto px-3 py-3"
        style={{ background: "var(--sale-bg)" }}
      >
        {turns.map((t) => {
          const mine = t.role === "sales";
          return (
            <div
              key={t.id}
              className={`flex items-end gap-1.5 ${mine ? "justify-end" : "justify-start"}`}
            >
              {!mine ? <AssistantFace persona={persona} size={22} /> : null}
              <div
                className="max-w-[90%] rounded-2xl px-3 py-2"
                style={{
                  background: mine ? "var(--sale-navy)" : "var(--sale-surface)",
                  border: mine ? "none" : `1px solid ${persona.accent}`,
                }}
              >
                <ChatBubbleText content={t.content} mine={mine} />
              </div>
            </div>
          );
        })}
        {sending ? (
          <div className="flex items-center gap-2 text-[11px]" style={{ color: "var(--sale-muted)" }}>
            <AssistantFace persona={persona} size={22} />
            <Loader2 size={12} className="animate-spin" />
            {persona.name} กำลังตอบ…
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>

      {error ? (
        <p
          className="mx-3 mb-1 rounded-lg px-2 py-1 text-[11px]"
          style={{ background: "var(--sale-warn)", color: "var(--sale-warn-text)" }}
        >
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-1.5 px-3 pb-1.5">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            disabled={sending}
            onClick={() => void send(s)}
            className="rounded-full px-2.5 py-1 text-[11px] disabled:opacity-50"
            style={{
              background: "var(--sale-navy-soft)",
              color: "var(--sale-navy)",
              border: `1px solid ${persona.accent}`,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div
        className="flex items-center gap-2 border-t px-3 py-2"
        style={{ borderColor: persona.accent }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void send();
          }}
          placeholder={`บอกแผนเช้าหรือถาม${persona.name}…`}
          disabled={sending}
          className="min-h-9 flex-1 rounded-full border px-3 text-sm outline-none disabled:opacity-60"
          style={{
            borderColor: persona.accent,
            background: "var(--sale-bg)",
          }}
        />
        <button
          type="button"
          disabled={sending || !text.trim()}
          onClick={() => void send()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white disabled:opacity-50"
          style={{ background: "var(--sale-navy)" }}
          aria-label="ส่ง"
        >
          {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        </button>
      </div>
    </section>
  );
}
