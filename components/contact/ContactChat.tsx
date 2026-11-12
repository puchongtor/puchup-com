"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  contactSuggestionChips,
  LINE_OA_ID,
  LINE_OA_URL,
} from "@/lib/puchup-knowledge";
import { sendContactChat, type ContactChatMessage } from "@/lib/contact/api";

type Bubble = ContactChatMessage & { id: string };

const WELCOME: Bubble = {
  id: "welcome",
  role: "assistant",
  content:
    "สวัสดีครับ ผมผู้ช่วยของ PuchUp — ช่วยแนะนำเว็บ ระบบขาย และตัวอย่างงานให้ตรงธุรกิจคุณได้เลย เล่ามาเป็นภาษาคนได้ครับ",
};

export function ContactChat() {
  const [messages, setMessages] = useState<Bubble[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showAlertHint, setShowAlertHint] = useState(false);
  const [aiLive, setAiLive] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, busy]);

  async function submitText(text: string) {
    const message = text.trim();
    if (!message || busy) return;

    const userBubble: Bubble = {
      id: `u-${Date.now()}`,
      role: "user",
      content: message,
    };
    setMessages((prev) => [...prev, userBubble]);
    setInput("");
    setBusy(true);

    try {
      const history = messages
        .filter((m) => m.id !== "welcome")
        .map(({ role, content }) => ({ role, content }));

      const res = await sendContactChat({
        sessionId,
        message,
        history,
        pagePath: "/contact/",
      });

      setSessionId(res.sessionId);
      setAiLive(res.aiLive !== false && !res.offline);
      if (res.alert) setShowAlertHint(true);

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: res.reply,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: `ตอนนี้ระบบแชทสะดุดนิดหนึ่ง — ทัก LINE ${LINE_OA_ID} ได้เลยครับ`,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void submitText(input);
  }

  return (
    <div className="relative flex h-[min(28rem,68vh)] flex-col overflow-hidden rounded-2xl border border-base/15 bg-navy text-base shadow-xl sm:h-[min(30rem,70vh)] lg:sticky lg:top-24">
      <div
        className="pointer-events-none absolute -right-14 top-0 h-32 w-32 rounded-full opacity-35 blur-3xl"
        style={{ background: "radial-gradient(circle, #7c3aed55, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute bottom-16 -left-8 h-28 w-28 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #f0553c44, transparent 70%)" }}
      />

      <div className="relative flex shrink-0 items-center justify-between gap-3 border-b border-base/10 px-4 py-2.5">
        <div className="min-w-0">
          <p className="text-sm font-semibold">PuchUp Assistant</p>
          <p className="truncate text-[11px] text-base/55">
            {aiLive
              ? "AI สด · ส่งต่อทีม + LINE"
              : "โหมดสำรอง · ทัก LINE ได้ตลอด"}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-base/10 px-2.5 py-1 text-[10px] font-medium text-aamber">
          <span
            className={`h-1.5 w-1.5 rounded-full ${aiLive ? "bg-[#06C755]" : "bg-base/40"}`}
          />
          {aiLive ? "AI Live" : "Backup"}
        </span>
      </div>

      <div className="relative min-h-0 flex-1 space-y-2.5 overflow-y-auto px-3.5 py-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
              m.role === "user"
                ? "ml-auto rounded-tr-sm bg-base text-navy"
                : "mr-auto rounded-tl-sm border border-base/15 bg-base/10 text-base"
            }`}
          >
            {m.content}
          </div>
        ))}
        {busy ? (
          <div className="mr-auto rounded-2xl rounded-tl-sm border border-base/15 bg-base/10 px-3.5 py-2.5 text-[12px] text-base/60">
            กำลังคิดคำตอบ…
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>

      {showAlertHint ? (
        <div className="relative shrink-0 border-t border-aamber/30 bg-aamber/15 px-3.5 py-1.5 text-[12px] text-base">
          ทีมได้รับเรื่องแล้ว —{" "}
          <a href={LINE_OA_URL} className="font-semibold text-aamber underline underline-offset-2">
            LINE {LINE_OA_ID}
          </a>
        </div>
      ) : null}

      <div className="relative shrink-0 border-t border-base/10 bg-navy/90 px-3.5 py-2.5 backdrop-blur-sm">
        <div className="mb-2 flex gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {contactSuggestionChips.map((chip) => (
            <button
              key={chip}
              type="button"
              disabled={busy}
              onClick={() => void submitText(chip)}
              className="shrink-0 rounded-lg border border-base/20 bg-base/5 px-2 py-1 text-[11px] font-medium text-base/80 transition hover:border-aamber/50 hover:bg-base/10 disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>
        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="พิมพ์ข้อความ…"
            disabled={busy}
            className="min-w-0 flex-1 rounded-xl border border-base/20 bg-base/10 px-3.5 py-2.5 text-[13.5px] text-base outline-none placeholder:text-base/40 focus:ring-2 focus:ring-aamber/40 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="shrink-0 rounded-xl bg-base px-3.5 py-2.5 text-[13px] font-semibold text-navy transition hover:opacity-90 disabled:opacity-50"
          >
            ส่ง
          </button>
        </form>
      </div>
    </div>
  );
}
