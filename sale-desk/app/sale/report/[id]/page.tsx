"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BrandFooter } from "@/components/sales-ai/BrandFooter";
import { BrandMark } from "@/components/sales-ai/BrandMark";
import { SALE_BRAND } from "@/lib/sales-ai/brand";
import { saleHref } from "@/lib/sales-ai/paths";
import { normalizeSaleRole } from "@/lib/sales-ai/roles";
import { useSaleStore } from "@/lib/sales-ai/SaleStore";
import type { ProtoMessage, StoredVisitReport } from "@/lib/sales-ai/types";

type PhotoItem = {
  id: string;
  url: string;
  tag?: string;
  caption?: string;
};

const TAG_LABEL: Record<string, string> = {
  card: "นามบัตร",
  nameplate: "เนมเพลท",
  site: "หน้างาน",
  document: "เอกสาร",
  part: "ชิ้นส่วน",
  machine: "เครื่องจักร",
  machine_clip: "คลิปเครื่องจักร",
  other: "อื่นๆ",
};

export default function VisitReportPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id || "";
  const { profile } = useSaleStore();
  const canAuditChat =
    normalizeSaleRole(profile.role) === "manager" ||
    normalizeSaleRole(profile.role) === "admin";

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<StoredVisitReport | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [imageCount, setImageCount] = useState(0);
  const [messages, setMessages] = useState<ProtoMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const [repRes, msgRes] = await Promise.all([
          fetch("/api/sale/reports?scope=all"),
          fetch(`/api/sale/visit/${id}/messages`),
        ]);
        const repJson = (await repRes.json()) as {
          ok?: boolean;
          reports?: StoredVisitReport[];
          error?: string;
        };
        const msgJson = (await msgRes.json()) as {
          ok?: boolean;
          messages?: ProtoMessage[];
          error?: string;
        };
        if (cancelled) return;

        if (!repRes.ok || !repJson.ok) {
          setError(repJson.error || "โหลดรายงานไม่สำเร็จ");
          setReport(null);
          return;
        }

        const found = (repJson.reports || []).find((r) => r.id === id) || null;
        setReport(found);
        if (!found) {
          setError("ยังไม่มีรายงานนี้ในระบบ");
          return;
        }

        if (msgRes.ok && msgJson.ok) {
          const all = msgJson.messages || [];
          setMessages(all);
          const imageMsgs = all.filter(
            (m) => m.kind === "image" && m.role === "sales",
          );
          setImageCount(imageMsgs.length);
          setPhotos(
            imageMsgs
              .filter((m) => Boolean(m.imageUrl))
              .map((m) => ({
                id: m.id,
                url: m.imageUrl!,
                tag: m.tag,
                caption: m.content,
              })),
          );
        }
      } catch {
        if (!cancelled) setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const chatTurns = useMemo(() => {
    return messages.filter((m) => {
      if (m.kind === "image" || m.kind === "audio") return true;
      return Boolean((m.content || "").trim());
    });
  }, [messages]);

  const s = report?.summary;
  const contact = s?.contacts?.[0];
  const need =
    s?.discussion?.[0]?.detail ||
    s?.purpose?.value ||
    s?.items?.[0]?.description ||
    null;
  const model = [s?.items?.[0]?.model?.value, s?.items?.[0]?.part_number?.value]
    .filter(Boolean)
    .join(" / ");

  return (
    <div className="min-h-dvh" style={{ background: "var(--sale-bg)" }}>
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <BrandMark tone="light" size="sm" showProduct={false} />
        <p className="mt-3 text-xs" style={{ color: "var(--sale-muted)" }}>
          <Link href={saleHref("/manager")} className="hover:underline">
            Manager
          </Link>
          {" / "}
          รายละเอียด · {SALE_BRAND.name}
        </p>

        {loading ? (
          <p className="mt-8 text-sm" style={{ color: "var(--sale-muted)" }}>
            กำลังโหลด…
          </p>
        ) : error || !report || !s ? (
          <section className="sale-card mt-6 p-5">
            <h1 className="text-lg font-semibold" style={{ color: "var(--sale-navy)" }}>
              ยังไม่มีหน้ารายงานนี้
            </h1>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--sale-muted)" }}>
              {error || "ไม่พบรายงาน"}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href={saleHref("/manager")} className="sale-btn-ghost px-4 py-2 text-sm">
                ← Manager
              </Link>
              {id ? (
                <Link
                  href={saleHref(`/visit/${id}/summary`)}
                  className="sale-btn-primary px-4 py-2 text-sm"
                >
                  เปิดหน้าสรุปเยี่ยม
                </Link>
              ) : null}
            </div>
          </section>
        ) : (
          <>
            <header className="mt-2 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold" style={{ color: "var(--sale-navy)" }}>
                  {report.companyName}
                </h1>
                <p className="mt-1 text-xs" style={{ color: "var(--sale-muted)" }}>
                  {report.salesName || "Sale"} ·{" "}
                  {new Date(report.confirmedAt || report.createdAt).toLocaleString("th-TH", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Asia/Bangkok",
                  })}
                </p>
              </div>
              <span
                className="sale-chip"
                style={{
                  background:
                    report.status === "confirmed" ? "var(--sale-ok)" : "var(--sale-warn)",
                  color:
                    report.status === "confirmed"
                      ? "var(--sale-ok-text)"
                      : "var(--sale-warn-text)",
                }}
              >
                {report.status === "confirmed" ? "ยืนยันแล้ว" : "รอตรวจ"}
              </span>
            </header>

            <section className="sale-card mt-4 p-4">
              <h2 className="text-sm font-semibold">สรุปรายงาน</h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-xs" style={{ color: "var(--sale-muted)" }}>
                    ความต้องการ
                  </dt>
                  <dd className="mt-1 leading-relaxed">{need || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs" style={{ color: "var(--sale-muted)" }}>
                    ผู้ติดต่อ
                  </dt>
                  <dd className="mt-1">
                    {[contact?.name?.value, contact?.position?.value]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs" style={{ color: "var(--sale-muted)" }}>
                    รุ่นเครื่อง / เลขพาร์ท
                  </dt>
                  <dd className="mt-1">{model || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs" style={{ color: "var(--sale-muted)" }}>
                    งานติดตาม
                  </dt>
                  <dd className="mt-1">{s.next_steps?.[0]?.title || "—"}</dd>
                </div>
              </dl>
            </section>

            <section className="sale-card mt-4 p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold">รูปภาพประกอบ</h2>
                <span className="text-xs" style={{ color: "var(--sale-muted)" }}>
                  {photos.length}
                  {imageCount > photos.length ? ` / ส่งมา ${imageCount} รูป` : " รูป"}
                </span>
              </div>

              {photos.length > 0 ? (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {photos.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="overflow-hidden rounded-xl border text-left"
                      style={{ borderColor: "var(--sale-line)", background: "var(--sale-bg)" }}
                      onClick={() => setLightbox(p.url)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.url}
                        alt={p.caption || "รูปภาพประกอบ"}
                        className="aspect-[4/3] w-full object-cover"
                      />
                      <p className="px-2 py-1.5 text-[11px]" style={{ color: "var(--sale-muted)" }}>
                        {TAG_LABEL[p.tag || ""] || p.tag || "รูป"}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--sale-muted)" }}>
                  {imageCount > 0
                    ? `มีการส่งรูป ${imageCount} ใบ แต่รอบก่อนระบบไม่ได้เก็บพรีวิวไว้ — เยี่ยมรอบถัดไปจะโชว์รูปได้`
                    : "ยังไม่มีรูปในรายงานนี้"}
                </p>
              )}
            </section>

            {canAuditChat ? (
              <section className="sale-card mt-4 overflow-hidden p-0">
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                  <div>
                    <h2 className="text-sm font-semibold">บทสนทนาดิบ</h2>
                    <p className="mt-0.5 text-[11px]" style={{ color: "var(--sale-muted)" }}>
                      เปิดเมื่อสงสัยว่าสรุป AI พลาด — ไม่ใช่ฟีดดูแชททุกวัน
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowChat((v) => !v)}
                    className="rounded-xl border px-3 py-2 text-[12px] font-semibold"
                    style={{
                      background: showChat ? "var(--sale-navy)" : "#fff",
                      color: showChat ? "#fff" : "#0f2744",
                      borderColor: "#0f2744",
                    }}
                  >
                    {showChat ? "ซ่อนบทสนทนา" : "ดูบทสนทนา"}
                  </button>
                </div>

                {showChat ? (
                  <div
                    className="max-h-[28rem] space-y-2.5 overflow-y-auto border-t px-4 py-3"
                    style={{ borderColor: "var(--sale-line)", background: "var(--sale-bg)" }}
                  >
                    {chatTurns.length === 0 ? (
                      <p className="text-sm" style={{ color: "var(--sale-muted)" }}>
                        ยังไม่มีข้อความในเยี่ยมนี้
                      </p>
                    ) : (
                      chatTurns.map((m) => {
                        const mine = m.role === "sales";
                        return (
                          <div
                            key={m.id}
                            className={`max-w-[92%] rounded-2xl px-3 py-2 text-sm ${
                              mine ? "ml-auto" : ""
                            }`}
                            style={{
                              background: mine ? "var(--sale-navy)" : "#fff",
                              color: mine ? "#fff" : "var(--sale-text)",
                              border: mine ? "none" : "1px solid var(--sale-line)",
                            }}
                          >
                            <p
                              className="mb-1 text-[10px] font-semibold uppercase tracking-wide"
                              style={{ color: mine ? "rgba(255,255,255,0.7)" : "var(--sale-muted)" }}
                            >
                              {mine ? "Sale" : "ผู้ช่วย"}
                              {m.kind === "image"
                                ? ` · รูป${m.tag ? ` (${TAG_LABEL[m.tag] || m.tag})` : ""}`
                                : m.kind === "audio"
                                  ? " · เสียง"
                                  : ""}
                            </p>
                            {m.kind === "image" && m.imageUrl ? (
                              <button
                                type="button"
                                className="block overflow-hidden rounded-lg"
                                onClick={() => setLightbox(m.imageUrl || null)}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={m.imageUrl}
                                  alt={m.content || "รูปจากแชท"}
                                  className="max-h-40 w-auto max-w-full object-cover"
                                />
                              </button>
                            ) : null}
                            {m.content?.trim() ? (
                              <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                            ) : m.kind === "image" && !m.imageUrl ? (
                              <p className="text-[12px] opacity-80">มีรูป แต่ไม่มีพรีวิวในระบบ</p>
                            ) : null}
                          </div>
                        );
                      })
                    )}
                  </div>
                ) : null}
              </section>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-2">
              <Link href={saleHref("/manager")} className="sale-btn-ghost px-4 py-2 text-sm">
                ← Manager
              </Link>
              <Link
                href={saleHref(`/visit/${id}/summary`)}
                className="sale-btn-primary px-4 py-2 text-sm"
              >
                เปิดหน้าสรุปเยี่ยม
              </Link>
            </div>
          </>
        )}

        <div className="mt-8">
          <BrandFooter />
        </div>
      </div>

      {lightbox ? (
        <button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(null)}
          aria-label="ปิดรูป"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="ขยายรูป"
            className="max-h-[90vh] max-w-full rounded-lg object-contain"
          />
        </button>
      ) : null}
    </div>
  );
}
