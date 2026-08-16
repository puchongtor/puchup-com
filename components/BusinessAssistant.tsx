"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  createInitialState,
  nextAssistantTurn,
  type AssistantState,
} from "@/lib/assistant/conversationEngine";

type Msg =
  | { kind: "text"; who: "bot" | "user"; text: string }
  | { kind: "handoff" }
  | { kind: "unknown" }
  | { kind: "match" };

const CHIPS = ["ลูกค้าหาของไม่เจอ", "ลูกค้าตัดสินใจยาก", "รับจอง/นัดหมาย"] as const;
const OPENING =
  'เล่าให้ผมฟังหน่อยครับ ตอนนี้ธุรกิจของคุณอยากให้ "อะไร" ทำงานง่ายขึ้น?';

export function BusinessAssistant({ id = "assistant" }: { id?: string }) {
  const [state, setState] = useState<AssistantState>(createInitialState);
  const [messages, setMessages] = useState<Msg[]>([
    { kind: "text", who: "bot", text: OPENING },
  ]);
  const [input, setInput] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  function push(msg: Msg) {
    setMessages((prev) => [...prev, msg]);
  }

  function handleUserText(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    push({ kind: "text", who: "user", text: trimmed });
    const { state: next, action } = nextAssistantTurn(state, trimmed);
    setState(next);

    window.setTimeout(() => {
      if (action.type === "handoff") push({ kind: "handoff" });
      else if (action.type === "unknown") push({ kind: "unknown" });
      else if (action.type === "match") push({ kind: "match" });
      else if (action.type === "reply_then_handoff") {
        push({ kind: "text", who: "bot", text: action.text });
        window.setTimeout(() => push({ kind: "handoff" }), 400);
      } else {
        push({ kind: "text", who: "bot", text: action.text });
      }
    }, 500);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    handleUserText(input);
    setInput("");
  }

  const summary = {
    business: state.business || "ยังไม่ระบุ",
    need: state.need || "ยังไม่ระบุ",
    system: state.interestedSystem || "ยังไม่ระบุ",
    goal: state.goal || "ให้ธุรกิจทำงานง่ายขึ้น",
  };

  return (
    <div
      id={id}
      className="w-full max-w-md overflow-hidden rounded-xl2 border border-base/10 bg-base text-ink shadow-2xl md:ml-auto"
    >
      <div className="flex items-center gap-2.5 border-b border-cream px-5 py-4">
        <span className="grad-ring flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white">
          P
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">PuchUp Business Assistant</p>
          <p className="flex items-center gap-1.5 text-[12px] text-muted">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
            พร้อมคุยตอนนี้
          </p>
        </div>
      </div>

      <div
        ref={logRef}
        className="flex h-[320px] flex-col gap-3 overflow-y-auto px-5 py-5 text-[14.5px] leading-relaxed"
        aria-live="polite"
      >
        {messages.map((msg, i) => {
          if (msg.kind === "text") {
            return (
              <div
                key={i}
                className={
                  msg.who === "bot"
                    ? "max-w-[88%] rounded-2xl rounded-tl-sm bg-cream px-4 py-2.5"
                    : "ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-navy px-4 py-2.5 text-base"
                }
              >
                {msg.text}
              </div>
            );
          }
          if (msg.kind === "match") {
            return (
              <div key={i} className="max-w-[92%] rounded-2xl border border-cream bg-cream/60 p-4">
                <p className="mb-2 text-[13px] font-semibold">พบตัวอย่างที่ใกล้เคียง</p>
                <p className="mb-3 text-[13.5px] text-muted">
                  AeroPulse — ระบบช่วยเลือกรถจักรยาน แทนการไล่ดูสเปกเอง
                </p>
                <Link
                  href="/showcase/aeropulse/"
                  className="text-[13.5px] font-semibold text-aorange underline underline-offset-4"
                >
                  ดู Case Study →
                </Link>
              </div>
            );
          }
          if (msg.kind === "unknown") {
            return (
              <div key={i} className="max-w-[92%] space-y-3 rounded-2xl border border-cream bg-cream/60 p-4">
                <p className="text-[13.5px] leading-relaxed">
                  เรื่องนี้ยังอยู่นอกขอบเขตที่ผมช่วยสรุปอัตโนมัติได้ดีครับ — ส่งต่อให้ทีม PuchUp ดูต่อได้เลย
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/contact/"
                    className="rounded-full bg-navy px-3 py-1.5 text-[12.5px] font-semibold text-base"
                  >
                    ส่งต่อให้ทีม
                  </Link>
                  <button
                    type="button"
                    className="elseTopic rounded-full border border-cream px-3 py-1.5 text-[12.5px] font-semibold"
                    onClick={() =>
                      push({
                        kind: "text",
                        who: "bot",
                        text: "ได้ครับ ลองเล่าเรื่องธุรกิจของคุณต่อได้เลย",
                      })
                    }
                  >
                    คุยเรื่องอื่น
                  </button>
                </div>
              </div>
            );
          }
          return (
            <div key={i} className="max-w-[92%] space-y-3 rounded-2xl border border-cream bg-cream/60 p-4">
              <p className="text-[13px] font-semibold">สรุปสำหรับทีม PuchUp</p>
              <ul className="space-y-1.5 text-[13px] text-muted">
                <li>ธุรกิจ: {summary.business}</li>
                <li>ความต้องการ: {summary.need}</li>
                <li>ระบบที่สนใจ: {summary.system}</li>
                <li>เป้าหมาย: {summary.goal}</li>
              </ul>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/contact/"
                  className="rounded-full bg-navy px-3 py-1.5 text-[12.5px] font-semibold text-base"
                >
                  ส่งให้ทีม PuchUp
                </Link>
                <button
                  type="button"
                  className="rounded-full border border-cream px-3 py-1.5 text-[12.5px] font-semibold"
                  onClick={() =>
                    push({
                      kind: "text",
                      who: "bot",
                      text: "ได้ครับ เล่าเพิ่มเติมได้เลย ผมจะปรับสรุปให้ตรงขึ้น",
                    })
                  }
                >
                  แก้ไขข้อมูล
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 px-5 pb-3">
        {CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            className="rounded-full border border-cream px-3 py-1.5 text-[12.5px] transition hover:border-aorange"
            onClick={() => handleUserText(chip)}
          >
            {chip}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-cream px-5 py-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="พิมพ์ข้อความ..."
          className="flex-1 rounded-full bg-cream/60 px-4 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-aorange/40"
        />
        <button
          type="submit"
          className="grad-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
          aria-label="ส่ง"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </button>
      </form>
    </div>
  );
}
