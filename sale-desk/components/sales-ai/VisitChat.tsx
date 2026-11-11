"use client";

import { saleHref, saleNavPath } from "@/lib/sales-ai/paths";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Mic, Square, Loader2, Trash2, Video } from "lucide-react";
import { AssistantFace } from "@/components/sales-ai/AssistantFace";
import { BrandMark } from "@/components/sales-ai/BrandMark";
import {
  getAssistantPersona,
  loadAssistantId,
  type AssistantPersona,
} from "@/lib/sales-ai/assistant-persona";
import { useSaleStore } from "@/lib/sales-ai/SaleStore";
import type { ProtoMessage } from "@/lib/sales-ai/types";

const PHOTO_TAGS = [
  { id: "card", label: "นามบัตร" },
  { id: "nameplate", label: "เนมเพลท" },
  { id: "site", label: "หน้างาน" },
  { id: "document", label: "เอกสาร" },
  { id: "part", label: "อะไหล่" },
  { id: "machine", label: "เครื่องจักร" },
  { id: "other", label: "อื่นๆ" },
] as const;

type Props = {
  visitId: string;
  companyName: string;
};

type SpeechRec = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((ev: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void) | null;
  onerror: ((ev: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

function getSpeechRecognition(): (new () => SpeechRec) | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRec;
    webkitSpeechRecognition?: new () => SpeechRec;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

async function compressImage(file: File): Promise<{ base64: string; mime: string; dataUrl: string }> {
  const bitmap = await createImageBitmap(file);
  const max = 1024;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas_unavailable");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  // ย่อพอเก็บพรีวิวในรายงานได้แน่นอน
  const dataUrl = canvas.toDataURL("image/jpeg", 0.68);
  const base64 = dataUrl.split(",")[1] || "";
  return { base64, mime: "image/jpeg", dataUrl };
}

/** ดึงเฟรมจากคลิปเครื่องจักร → ส่งผู้ช่วยอ่านอาการได้ (ยังไม่เก็บไฟล์วิดีโอเต็ม) */
async function extractVideoPoster(
  file: File,
): Promise<{ base64: string; mime: string; dataUrl: string; durationSec: number }> {
  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.src = url;

    await new Promise<void>((resolve, reject) => {
      video.onloadeddata = () => resolve();
      video.onerror = () => reject(new Error("video_load_failed"));
    });

    const durationSec = Number.isFinite(video.duration) ? Math.round(video.duration) : 0;
    const seekTo = durationSec > 1 ? Math.min(1, durationSec / 3) : 0;
    if (seekTo > 0) {
      await new Promise<void>((resolve) => {
        video.onseeked = () => resolve();
        video.currentTime = seekTo;
      });
    }

    const max = 1024;
    const scale = Math.min(1, max / Math.max(video.videoWidth || 1, video.videoHeight || 1));
    const w = Math.max(1, Math.round((video.videoWidth || 640) * scale));
    const h = Math.max(1, Math.round((video.videoHeight || 360) * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas_unavailable");
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.68);
    const base64 = dataUrl.split(",")[1] || "";
    return { base64, mime: "image/jpeg", dataUrl, durationSec };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function Waveform() {
  const bars = [4, 10, 7, 14, 9, 16, 8, 12, 6, 15, 9, 11, 5, 13, 8, 10];
  return (
    <div className="flex h-7 items-end gap-0.5" aria-hidden>
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-0.5 rounded-sm bg-white/85"
          style={{ height: `${h * 1.7}px` }}
        />
      ))}
    </div>
  );
}

export function VisitChat({ visitId, companyName }: Props) {
  const router = useRouter();
  const { profile } = useSaleStore();
  const [persona, setPersona] = useState<AssistantPersona>(() =>
    getAssistantPersona(null),
  );
  const [messages, setMessages] = useState<ProtoMessage[]>([]);
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [tagPicker, setTagPicker] = useState(false);
  const [pendingTag, setPendingTag] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(companyName);
  const [visitStatus, setVisitStatus] = useState<string>("in_progress");
  const [elapsedSec, setElapsedSec] = useState(0);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const visitLocked =
    visitStatus === "void" ||
    visitStatus === "confirmed" ||
    visitStatus === "pending_review";

  function humanizeError(code?: string | null) {
    if (!code) return "ส่งไม่สำเร็จ";
    if (code === "visit_closed") {
      return "งานนี้ถูกปิดแล้ว ส่งข้อความต่อไม่ได้ — กลับหน้าหลักแล้วเริ่มเยี่ยมใหม่ได้";
    }
    if (code === "unauthorized") return "หมดอายุการเข้าสู่ระบบ — ล็อกอินใหม่";
    return code;
  }
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRec | null>(null);
  const transcriptRef = useRef("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSpeechSupported(Boolean(getSpeechRecognition()));
  }, []);

  useEffect(() => {
    setPersona(getAssistantPersona(loadAssistantId(profile.id)));
  }, [profile.id]);

  useEffect(() => {
    const t = window.setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/sale/visit/${visitId}/messages`);
        const json = (await res.json()) as {
          ok?: boolean;
          messages?: ProtoMessage[];
          visit?: { companyName?: string; status?: string };
          error?: string;
        };
        if (cancelled) return;
        if (!res.ok || !json.ok) {
          setError(humanizeError(json.error) || "โหลดแชทไม่สำเร็จ");
          return;
        }
        setMessages(json.messages || []);
        if (json.visit?.companyName) setTitle(json.visit.companyName);
        if (json.visit?.status) setVisitStatus(json.visit.status);
      } catch {
        if (!cancelled) setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
      } finally {
        if (!cancelled) setLoadingHistory(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [visitId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const clock = useMemo(() => {
    const h = Math.floor(elapsedSec / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((elapsedSec % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (elapsedSec % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  }, [elapsedSec]);

  async function postMessage(payload: Record<string, unknown>, optimistic: ProtoMessage) {
    if (visitLocked) {
      setError(humanizeError("visit_closed"));
      return;
    }
    setSending(true);
    setError(null);
    setMessages((prev) => [...prev, optimistic]);
    try {
      const res = await fetch(`/api/sale/visit/${visitId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, assistantId: persona.id }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        visit?: { companyName?: string | null };
        salesEvent?: ProtoMessage & { imageUrl?: string | null };
        secretary?: { id?: string; reply?: string; error?: string };
      };
      if (!res.ok || !json.ok) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === optimistic.id ? { ...m, status: "error" } : m,
          ),
        );
        if (json.error === "visit_closed") {
          setVisitStatus("void");
        }
        setError(humanizeError(json.error));
        return;
      }
      if (json.visit?.companyName) setTitle(json.visit.companyName);
      setMessages((prev) => {
        const withoutOpt = prev.filter((m) => m.id !== optimistic.id);
        const sales: ProtoMessage = {
          id: json.salesEvent?.id || optimistic.id,
          role: "sales",
          content: json.salesEvent?.content || optimistic.content,
          kind: (json.salesEvent?.kind as ProtoMessage["kind"]) || optimistic.kind,
          status: "sent",
          tag: json.salesEvent?.tag || optimistic.tag,
          imageUrl: json.salesEvent?.imageUrl || optimistic.imageUrl,
        };
        const next = [...withoutOpt, sales];
        if (json.secretary?.reply) {
          next.push({
            id: json.secretary.id || `sec-${Date.now()}`,
            role: "secretary",
            content: json.secretary.reply,
            kind: "text",
            status: "sent",
          });
        }
        return next;
      });
      if (json.secretary?.error) {
        setError(`ผู้ช่วย: ${json.secretary.error}`);
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? { ...m, status: "error" } : m)),
      );
      setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    } finally {
      setSending(false);
    }
  }

  function sendText(valueRaw?: string, asAudio = false) {
    const value = (valueRaw ?? text).trim();
    if (!value || sending) return;
    // เคลียร์ช่องทันที — รวมเคสส่งจากเสียงที่ส่ง valueRaw มา
    setText("");
    transcriptRef.current = "";
    const id = `local-${Date.now()}`;
    void postMessage(
      { kind: asAudio ? "audio" : "text", text: value },
      {
        id,
        role: "sales",
        content: asAudio ? value : value,
        kind: asAudio ? "audio" : "text",
        status: "queued",
      },
    );
  }

  function toggleRecord() {
    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      setSpeechSupported(false);
      setError("เบราว์เซอร์นี้ไม่รองรับการพูด — พิมพ์ข้อความแทนได้ครับ");
      return;
    }

    if (recording && recognitionRef.current) {
      const rec = recognitionRef.current;
      // กัน onresult ทีหลังเติมข้อความกลับเข้าช่อง
      rec.onresult = null;
      rec.onend = null;
      rec.onerror = null;
      try {
        rec.stop();
      } catch {
        /* ignore */
      }
      recognitionRef.current = null;
      setRecording(false);
      const finalText = transcriptRef.current.trim();
      transcriptRef.current = "";
      setText("");
      if (finalText) sendText(finalText, true);
      return;
    }

    const rec = new Ctor();
    rec.lang = "th-TH";
    rec.continuous = true;
    rec.interimResults = true;
    transcriptRef.current = "";
    setText("");
    rec.onresult = (ev) => {
      if (!recognitionRef.current) return;
      let chunk = "";
      for (let i = 0; i < ev.results.length; i++) {
        chunk += ev.results[i]![0]!.transcript;
      }
      transcriptRef.current = chunk;
      setText(chunk);
    };
    rec.onerror = (ev) => {
      setRecording(false);
      recognitionRef.current = null;
      setError(ev.error === "not-allowed" ? "ยังไม่อนุญาตไมโครโฟน" : "ถอดเสียงไม่สำเร็จ");
    };
    rec.onend = () => {
      setRecording(false);
    };
    recognitionRef.current = rec;
    try {
      rec.start();
      setRecording(true);
      setError(null);
    } catch {
      setError("เริ่มไมค์ไม่ได้");
    }
  }

  function pickTag(tagId: string) {
    setPendingTag(tagId);
    setTagPicker(false);
    fileRef.current?.click();
  }

  async function onFileChange(file: File | null) {
    const tag = pendingTag || "other";
    setPendingTag(null);
    if (!file) return;
    try {
      setSending(true);
      const { base64, mime, dataUrl } = await compressImage(file);
      const id = `local-img-${Date.now()}`;
      await postMessage(
        { kind: "image", tag, imageBase64: base64, mime, text: "" },
        {
          id,
          role: "sales",
          content: `รูป${PHOTO_TAGS.find((t) => t.id === tag)?.label || tag}`,
          kind: "image",
          status: "queued",
          tag,
          imageUrl: dataUrl,
        },
      );
    } catch {
      setError("ย่อรูปไม่สำเร็จ");
      setSending(false);
    }
  }

  async function onVideoChange(file: File | null) {
    if (!file) return;
    try {
      setSending(true);
      setError(null);
      const { base64, mime, dataUrl, durationSec } = await extractVideoPoster(file);
      const id = `local-clip-${Date.now()}`;
      const note =
        durationSec > 0
          ? `คลิปเครื่องจักร ~${durationSec} วินาที — ถ่ายอาการผิดปกติ/การทำงาน`
          : "คลิปเครื่องจักร — ถ่ายอาการผิดปกติ/การทำงาน";
      await postMessage(
        {
          kind: "image",
          tag: "machine_clip",
          imageBase64: base64,
          mime,
          text: note,
        },
        {
          id,
          role: "sales",
          content: note,
          kind: "image",
          status: "queued",
          tag: "machine_clip",
          imageUrl: dataUrl,
        },
      );
    } catch {
      setError("อ่านคลิปไม่สำเร็จ — ลองคลิปสั้นลง หรือถ่ายรูปแทน");
      setSending(false);
    }
  }

  async function finishVisit() {
    if (finishing || sending) return;
    setFinishing(true);
    setError(null);
    try {
      const res = await fetch(`/api/sale/visit/${visitId}/finish`, { method: "POST" });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error || "สรุปการเยี่ยมไม่สำเร็จ");
        return;
      }
      router.push(saleNavPath(`/visit/${visitId}/summary`));
    } catch {
      setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    } finally {
      setFinishing(false);
    }
  }

  async function deleteMessage(messageId: string) {
    if (sending || finishing) return;
    if (messageId.startsWith("local-")) {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      return;
    }
    setError(null);
    try {
      const res = await fetch(`/api/sale/visit/${visitId}/message/${messageId}`, {
        method: "DELETE",
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error || "ลบไม่สำเร็จ");
        return;
      }
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === messageId);
        if (idx < 0) return prev;
        const next = [...prev];
        next.splice(idx, 1);
        // ลบคำตอบผู้ช่วยถัดไปใน UI ด้วยถ้ามี
        if (next[idx]?.role === "secretary") next.splice(idx, 1);
        return next;
      });
    } catch {
      setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    }
  }

  function imageCaption(content: string, tag?: string) {
    const label =
      PHOTO_TAGS.find((t) => t.id === tag)?.label ||
      (tag === "machine_clip" ? "คลิปเครื่องจักร" : tag) ||
      "รูป";
    const short = (content || "")
      .replace(/^\[รูป[^\]]*\]\s*/i, "")
      .replace(/^#+\s*/gm, "")
      .replace(/\*\*/g, "")
      .replace(/\n+/g, " ")
      .trim()
      .slice(0, 100);
    return short ? `${label} · ${short}` : label;
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col">
      <header
        className="sticky top-0 z-10 px-4 pb-3 pt-3 text-white"
        style={{ background: "var(--sale-navy)" }}
      >
        <BrandMark tone="dark" size="sm" />
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <AssistantFace persona={persona} size={36} />
            <div className="min-w-0">
              <p className="text-[11px] text-white/70">
                ผู้ช่วย {persona.name} · กำลังบันทึกการเยี่ยม
              </p>
              <h1 className="mt-0.5 truncate text-sm font-semibold">{title}</h1>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-mono text-sm font-semibold tabular-nums">{clock}</p>
            <p className="text-[11px] text-white/70">
              {loadingHistory ? "โหลด…" : `${messages.length} ข้อความ`}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-2.5 overflow-y-auto px-3 py-4">
        {loadingHistory ? (
          <p className="text-center text-sm" style={{ color: "var(--sale-muted)" }}>
            กำลังโหลดแชท…
          </p>
        ) : null}
        {!loadingHistory && messages.length === 0 ? (
          <p className="text-center text-sm" style={{ color: "var(--sale-muted)" }}>
            ผู้ช่วยกำลังทักทาย… ถ้ายังไม่ขึ้น ให้รีเฟรชหน้า หรือบอกชื่อบริษัทกับเป้าวันนี้ได้เลย
          </p>
        ) : null}
        {messages.map((m) => {
          const mine = m.role === "sales";
          return (
            <div
              key={m.id}
              className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}
            >
              {!mine ? <AssistantFace persona={persona} size={28} /> : null}
              <div
                className="max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-[1.65]"
                style={{
                  background: mine
                    ? m.kind === "image"
                      ? "var(--sale-navy-soft)"
                      : "var(--sale-navy)"
                    : "var(--sale-surface)",
                  color: mine && m.kind !== "image" ? "#fff" : "var(--sale-text)",
                  border: mine ? "none" : `1.5px solid ${persona.accent}`,
                  opacity: m.status === "queued" ? 0.7 : 1,
                }}
              >
                {m.kind === "audio" ? (
                  <div className="flex items-center gap-3">
                    <Waveform />
                    <span className="text-xs text-white/90">{m.content}</span>
                  </div>
                ) : m.kind === "image" ? (
                  <div>
                    <div className="relative">
                      {m.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={m.imageUrl}
                          alt={m.tag || "รูป"}
                          className="mb-2 h-28 w-full rounded-xl object-cover"
                        />
                      ) : (
                        <div
                          className="mb-2 flex h-20 w-40 items-center justify-center rounded-xl text-center text-xs"
                          style={{ background: "#dbe4f0", color: "var(--sale-muted)" }}
                        >
                          {m.tag || "รูป"}
                        </div>
                      )}
                      <button
                        type="button"
                        disabled={sending || finishing}
                        onClick={() => void deleteMessage(m.id)}
                        className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full text-white disabled:opacity-50"
                        style={{ background: "rgba(0,0,0,0.55)" }}
                        aria-label="ลบรูป"
                        title="ลบรูปที่ส่งผิด"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-xs" style={{ color: "var(--sale-muted)" }}>
                      {m.tag === "machine_clip"
                        ? `🎬 ${imageCaption(m.content, m.tag)}`
                        : imageCaption(m.content, m.tag)}
                    </p>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                )}
                {m.status === "error" ? (
                  <p className="mt-1 text-[10px] text-red-200">ส่งไม่สำเร็จ</p>
                ) : null}
              </div>
            </div>
          );
        })}
        {sending ? (
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--sale-muted)" }}>
            <AssistantFace persona={persona} size={28} />
            <Loader2 size={14} className="animate-spin" />
            {persona.name} กำลังตอบ…
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>

      {error ? (
        <p
          className="mx-3 mb-2 rounded-xl px-3 py-2 text-xs"
          style={{ background: "var(--sale-warn)", color: "var(--sale-warn-text)" }}
        >
          {error}
        </p>
      ) : null}

      {visitLocked ? (
        <div
          className="mx-3 mb-3 rounded-xl px-4 py-3 text-sm"
          style={{ background: "var(--sale-navy-soft)", color: "var(--sale-navy)" }}
        >
          <p className="font-semibold">
            {visitStatus === "pending_review"
              ? "งานนี้อยู่ในขั้นรอตรวจสรุปแล้ว"
              : visitStatus === "confirmed"
                ? "งานนี้ยืนยันส่งแล้ว"
                : "งานนี้ถูกปิดแล้ว"}
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--sale-muted)" }}>
            ส่งข้อความต่อไม่ได้ — กลับหน้าหลัก หรือไปตรวจสรุปได้
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {visitStatus === "pending_review" ? (
              <Link
                href={saleHref(`/visit/${visitId}/summary`)}
                className="sale-btn-primary touch-target flex items-center justify-center text-sm"
              >
                ไปตรวจสรุป
              </Link>
            ) : null}
            <Link
              href={saleHref("/home")}
              className="sale-btn-accent touch-target flex items-center justify-center text-sm"
            >
              กลับหน้าหลัก
            </Link>
            <Link
              href={saleHref("/customers")}
              className="touch-target flex items-center justify-center text-sm"
              style={{ color: "var(--sale-navy)" }}
            >
              เริ่มเยี่ยมใหม่
            </Link>
          </div>
        </div>
      ) : null}

      {!speechSupported && !visitLocked ? (
        <p className="mx-3 mb-2 text-center text-[11px]" style={{ color: "var(--sale-muted)" }}>
          อุปกรณ์นี้ใช้พูดไม่ได้ — พิมพ์แทนได้
        </p>
      ) : null}

      {!visitLocked && tagPicker ? (
        <div
          className="grid grid-cols-3 gap-2 border-t px-3 py-3"
          style={{ borderColor: "var(--sale-line)", background: "var(--sale-surface)" }}
        >
          {PHOTO_TAGS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => pickTag(t.id)}
              className="touch-target rounded-xl text-sm"
              style={{ background: "var(--sale-navy-soft)", color: "var(--sale-navy)" }}
            >
              {t.label}
            </button>
          ))}
        </div>
      ) : null}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0] || null;
          e.target.value = "";
          void onFileChange(f);
        }}
      />
      <input
        ref={videoRef}
        type="file"
        accept="video/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0] || null;
          e.target.value = "";
          void onVideoChange(f);
        }}
      />

      {!visitLocked ? (
        <div
          className="border-t px-3 pb-5 pt-3"
          style={{ borderColor: "var(--sale-line)", background: "var(--sale-surface)" }}
        >
          <div className="flex items-end gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendText();
                }
              }}
              rows={4}
              placeholder={recording ? "กำลังฟัง…" : "พิมพ์ข้อความ... (Enter ส่ง · Shift+Enter ขึ้นบรรทัด)"}
              disabled={sending}
              className="max-h-28 min-h-[5.5rem] flex-1 resize-none overflow-y-auto rounded-2xl border px-3.5 py-2.5 text-sm leading-relaxed outline-none disabled:opacity-60"
              style={{
                borderColor: "var(--sale-line)",
                background: "var(--sale-bg)",
              }}
            />
            <button
              type="button"
              onClick={toggleRecord}
              disabled={sending}
              className="mb-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white disabled:opacity-60"
              style={{
                background: recording ? "var(--sale-danger-text)" : "var(--sale-navy)",
              }}
              aria-label={recording ? "หยุดอัดเสียง" : "อัดเสียง"}
            >
              {recording ? <Square size={16} fill="currentColor" /> : <Mic size={18} />}
            </button>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              disabled={sending}
              onClick={() => setTagPicker((v) => !v)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full disabled:opacity-50"
              style={{ background: "var(--sale-navy-soft)", color: "var(--sale-navy)" }}
              aria-label="ถ่ายรูป"
            >
              <Camera size={18} />
            </button>
            <button
              type="button"
              disabled={sending}
              onClick={() => videoRef.current?.click()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full disabled:opacity-50"
              style={{ background: "var(--sale-navy-soft)", color: "var(--sale-navy)" }}
              aria-label="ถ่ายคลิปเครื่องจักร"
              title="ถ่ายคลิปเครื่องจักร"
            >
              <Video size={18} />
            </button>
          </div>

          <button
            type="button"
            disabled={finishing || sending}
            onClick={() => void finishVisit()}
            className="sale-btn-ghost mt-3 flex touch-target w-full items-center justify-center gap-2 text-sm disabled:opacity-60"
          >
            {finishing ? <Loader2 size={16} className="animate-spin" /> : null}
            {finishing ? "กำลังสรุป…" : "จบการเยี่ยมและสรุป"}
          </button>
          <p className="mt-2 text-center text-[11px]" style={{ color: "var(--sale-muted)" }}>
            <Link href={saleHref("/home")} className="underline-offset-2 hover:underline">
              กลับหน้าหลัก
            </Link>
          </p>
        </div>
      ) : (
        <div className="border-t px-3 pb-5 pt-3" style={{ borderColor: "var(--sale-line)" }}>
          <p className="text-center text-[11px]" style={{ color: "var(--sale-muted)" }}>
            <Link href={saleHref("/home")} className="underline-offset-2 hover:underline">
              กลับหน้าหลัก
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
