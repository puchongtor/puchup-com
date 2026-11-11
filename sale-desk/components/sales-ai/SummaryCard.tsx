"use client";

import { saleHref } from "@/lib/sales-ai/paths";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/sales-ai/BrandMark";
import { useSaleStore } from "@/lib/sales-ai/SaleStore";
import type { StoredVisitReport, VisitSummary } from "@/lib/sales-ai/types";
import { emptyVisitSummary } from "@/lib/sales-ai/visit-summary";

type Badge = { label: string; bg: string; color: string };

function confBadge(confidence: number): Badge {
  if (confidence >= 0.7) {
    return { label: "ครบ", bg: "var(--sale-ok)", color: "var(--sale-ok-text)" };
  }
  if (confidence >= 0.4) {
    return {
      label: "ตรวจอีกครั้ง",
      bg: "var(--sale-warn)",
      color: "var(--sale-warn-text)",
    };
  }
  return {
    label: "ขาดข้อมูล",
    bg: "var(--sale-navy-soft)",
    color: "var(--sale-muted)",
  };
}

function RowCard({
  label,
  value,
  badge,
  editable,
  onChange,
}: {
  label: string;
  value: string;
  badge: Badge;
  editable?: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <article className="sale-card p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium" style={{ color: "var(--sale-muted)" }}>
          {label}
        </p>
        <span className="sale-chip shrink-0" style={{ background: badge.bg, color: badge.color }}>
          {badge.label}
        </span>
      </div>
      {editable && onChange ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full rounded-xl border px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--sale-line)" }}
        />
      ) : (
        <p className="mt-2 text-sm leading-relaxed">{value || "—"}</p>
      )}
    </article>
  );
}

type Props = { visitId: string };

export function SummaryCard({ visitId }: Props) {
  const { profile, confirmReport } = useSaleStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [visitCreatedAt, setVisitCreatedAt] = useState<string | null>(null);
  const [photoTags, setPhotoTags] = useState<string[]>([]);
  const [summary, setSummary] = useState<VisitSummary | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [need, setNeed] = useState("");
  const [model, setModel] = useState("");
  const [budget, setBudget] = useState("");
  const [urgencyLabel, setUrgencyLabel] = useState("");
  const [editing, setEditing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [res, msgRes] = await Promise.all([
          fetch(`/api/sale/visit/${visitId}/finish`),
          fetch(`/api/sale/visit/${visitId}/messages`),
        ]);
        const json = (await res.json()) as {
          ok?: boolean;
          error?: string;
          visit?: { companyName?: string; status?: string; createdAt?: string };
          summary?: VisitSummary;
          summaryStatus?: string;
        };
        const msgJson = (await msgRes.json()) as {
          ok?: boolean;
          messages?: { kind?: string; tag?: string }[];
        };
        if (cancelled) return;
        if (!res.ok || !json.ok || !json.summary) {
          setError(json.error || "ยังไม่มีสรุป — กลับไปกดจบการเยี่ยมก่อน");
          setSummary(emptyVisitSummary(json.visit?.companyName || ""));
          setCompanyName(json.visit?.companyName || "");
          return;
        }
        const s = json.summary;
        setSummary(s);
        setVisitCreatedAt(json.visit?.createdAt || null);
        if (msgRes.ok && msgJson.ok) {
          setPhotoTags(
            (msgJson.messages || [])
              .filter((m) => m.kind === "image")
              .map((m) => m.tag || "other"),
          );
        }
        setCompanyName(s.company.name.value || json.visit?.companyName || "");
        const c0 = s.contacts?.[0];
        setContactName(c0?.name.value || "");
        setContactPhone(c0?.phone.value || "");
        setNeed(
          s.discussion?.[0]?.detail ||
            s.purpose?.value ||
            s.items?.[0]?.description ||
            "",
        );
        setModel(
          [s.items?.[0]?.model?.value, s.items?.[0]?.part_number?.value]
            .filter(Boolean)
            .join(" / ") || "",
        );
        setBudget(
          [s.decision?.budget?.value, s.decision?.competitor_mentioned?.value]
            .filter(Boolean)
            .join(" · ") || "",
        );
        const u = s.items?.[0]?.urgency;
        setUrgencyLabel(
          u === "line_down"
            ? "เครื่องหยุด / line down"
            : u === "urgent"
              ? "เร่งด่วน"
              : u === "low"
                ? "ไม่เร่ง"
                : "ปกติ",
        );
        if (json.summaryStatus === "confirmed" || json.visit?.status === "confirmed") {
          setConfirmed(true);
        }
      } catch {
        if (!cancelled) setError("โหลดสรุปไม่สำเร็จ");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [visitId]);

  const missingCore = [
    !companyName.trim() || companyName.trim() === "ยังไม่ระบุบริษัท"
      ? "ชื่อบริษัท"
      : null,
    !contactName.trim() ? "ชื่อผู้ติดต่อ" : null,
    !contactPhone.trim() ? "เบอร์โทร" : null,
  ].filter(Boolean) as string[];

  async function onConfirm() {
    if (!summary || saving) return;
    if (missingCore.length > 0 && !editing) {
      setEditing(true);
      setError(
        `ยังขาด${missingCore.join(" · ")} — กรอกให้ครบหน่อยนะ ผู้จัดการดูเรื่องนี้ และมีผลต่อคะแนน`,
      );
      return;
    }
    setSaving(true);
    setError(null);
    const now = new Date().toISOString();
    const nameVal = contactName.trim();
    const phoneVal = contactPhone.trim();
    const prev0 = summary.contacts?.[0];
    const next: VisitSummary = {
      ...summary,
      company: {
        ...summary.company,
        name: {
          ...summary.company.name,
          value: companyName || summary.company.name.value,
          confidence: 0.95,
        },
      },
      purpose: {
        ...summary.purpose,
        value: need || summary.purpose.value,
        confidence: need ? 0.9 : summary.purpose.confidence,
      },
      discussion:
        need
          ? [
              {
                topic: summary.discussion?.[0]?.topic || "ความต้องการ",
                detail: need,
                sources: summary.discussion?.[0]?.sources || [],
              },
              ...(summary.discussion || []).slice(1),
            ]
          : summary.discussion,
      items: (summary.items || []).map((item, i) =>
        i === 0
          ? {
              ...item,
              model: { ...item.model, value: model || item.model.value },
              description: need || item.description,
            }
          : item,
      ),
      decision: {
        ...summary.decision,
        budget: {
          ...summary.decision.budget,
          value: budget || summary.decision.budget.value,
        },
      },
      contacts:
        nameVal || phoneVal || prev0
          ? [
              {
                name: {
                  value: nameVal || prev0?.name.value || null,
                  confidence: nameVal ? 0.95 : prev0?.name.confidence || 0,
                  sources: prev0?.name.sources || [],
                },
                position: {
                  value: prev0?.position.value || null,
                  confidence: prev0?.position.confidence || 0,
                  sources: prev0?.position.sources || [],
                },
                phone: {
                  value: phoneVal || prev0?.phone.value || null,
                  confidence: phoneVal ? 0.95 : prev0?.phone.confidence || 0,
                  sources: prev0?.phone.sources || [],
                },
                line_id: prev0?.line_id || {
                  value: null,
                  confidence: 0,
                  sources: [],
                },
                email: prev0?.email || {
                  value: null,
                  confidence: 0,
                  sources: [],
                },
              },
              ...(summary.contacts || []).slice(1),
            ]
          : [],
    };

    const urgency =
      next.items?.find((i) => i.urgency === "line_down" || i.urgency === "urgent")
        ?.urgency || "normal";

    const report: StoredVisitReport = {
      id: visitId,
      companyName: next.company.name.value || companyName || "ลูกค้า",
      salesId: profile.id,
      salesName: profile.nickname || profile.fullName,
      summary: next,
      status: "confirmed",
      urgency,
      confirmedAt: now,
      createdAt: visitCreatedAt || now,
      photoTags,
    };

    try {
      await confirmReport(report);
      setConfirmed(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm" style={{ color: "var(--sale-muted)" }}>
        กำลังโหลดสรุป…
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 text-center">
        <p
          className="sale-chip"
          style={{ background: "var(--sale-ok)", color: "var(--sale-ok-text)" }}
        >
          ส่งแล้ว
        </p>
        <h1 className="mt-4 text-2xl font-bold" style={{ color: "var(--sale-navy)" }}>
          ยืนยันรายงานแล้ว
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--sale-muted)" }}>
          บันทึกแล้ว · ผู้บริหารเห็นได้ที่หน้ารายงาน
        </p>
        <div className="mt-6 flex w-full flex-col gap-2">
          <Link
            href={saleHref("/customers")}
            className="sale-btn-accent touch-target flex items-center justify-center text-sm"
          >
            เริ่มเยี่ยมใหม่
          </Link>
          <Link
            href={saleHref(`/report/${visitId}`)}
            className="sale-btn-primary touch-target flex items-center justify-center text-sm"
          >
            ดูรายงาน
          </Link>
          <Link
            href={saleHref("/home")}
            className="touch-target flex items-center justify-center text-sm"
            style={{ color: "var(--sale-muted)" }}
          >
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    );
  }

  const s = summary || emptyVisitSummary(companyName);

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col pb-28">
      <header className="px-4 pb-4 pt-4 text-white" style={{ background: "var(--sale-navy)" }}>
        <BrandMark tone="dark" size="sm" />
        <div className="mt-3 flex items-center gap-3">
          <Link
            href={saleHref(`/visit/${visitId}`)}
            className="rounded-lg px-2.5 py-1 text-xs text-white/90"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            กลับ
          </Link>
          <div>
            <h1 className="text-base font-semibold">ตรวจสรุปก่อนส่ง</h1>
            <p className="text-[11px] text-white/75">
              {companyName || "ลูกค้า"} · {profile.nickname || profile.fullName}
            </p>
          </div>
        </div>
      </header>

      {error ? (
        <p
          className="mx-4 mt-3 rounded-xl px-3 py-2 text-xs"
          style={{ background: "var(--sale-warn)", color: "var(--sale-warn-text)" }}
        >
          {error}
        </p>
      ) : null}

      <div className="space-y-3 px-4 py-4">
        {missingCore.length > 0 ? (
          <p
            className="rounded-xl px-3 py-2 text-xs leading-relaxed"
            style={{ background: "var(--sale-warn)", color: "var(--sale-warn-text)" }}
          >
            ยังขาด{missingCore.join(" · ")} — กรอกก่อนส่งนะ ผู้จัดการดูเรื่องนี้
            และมีผลต่อคะแนนรายงาน
          </p>
        ) : null}
        <RowCard
          label="บริษัท"
          value={companyName}
          badge={confBadge(companyName.trim() ? 0.95 : 0)}
          editable={editing}
          onChange={setCompanyName}
        />
        <RowCard
          label="ชื่อผู้ติดต่อ"
          value={contactName}
          badge={confBadge(contactName.trim() ? 0.95 : 0)}
          editable={editing}
          onChange={setContactName}
        />
        <RowCard
          label="เบอร์โทร"
          value={contactPhone}
          badge={confBadge(contactPhone.trim() ? 0.95 : 0)}
          editable={editing}
          onChange={setContactPhone}
        />
        <RowCard
          label="ความต้องการ"
          value={need}
          badge={confBadge(s.purpose?.confidence ?? (need ? 0.8 : 0))}
          editable={editing}
          onChange={setNeed}
        />
        <RowCard
          label="รุ่นเครื่อง / เลขพาร์ท"
          value={model}
          badge={confBadge(s.items?.[0]?.model?.confidence ?? 0)}
          editable={editing}
          onChange={setModel}
        />
        <RowCard
          label="ความเร่งด่วน"
          value={urgencyLabel || "ปกติ"}
          badge={
            urgencyLabel.includes("หยุด") || urgencyLabel.includes("เร่ง")
              ? {
                  label: "ด่วน",
                  bg: "var(--sale-danger)",
                  color: "var(--sale-danger-text)",
                }
              : confBadge(0.7)
          }
        />
        <RowCard
          label="งบประมาณ / คู่แข่ง"
          value={budget}
          badge={confBadge(s.decision?.budget?.confidence ?? 0)}
          editable={editing}
          onChange={setBudget}
        />

        <section className="sale-card p-4">
          <p className="text-sm font-semibold">งานติดตามที่เสนอ</p>
          {(s.next_steps || []).length === 0 ? (
            <p className="mt-2 text-sm" style={{ color: "var(--sale-muted)" }}>
              ยังไม่มีข้อเสนอจาก AI
            </p>
          ) : (
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
              {s.next_steps.map((step) => (
                <li key={step.title}>{step.title}</li>
              ))}
            </ol>
          )}
          {(s.unresolved || []).length > 0 ? (
            <div className="mt-3">
              <p className="text-xs font-medium" style={{ color: "var(--sale-muted)" }}>
                ต้องตรวจเพิ่ม
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                {s.unresolved.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 border-t px-4 py-3"
        style={{ borderColor: "var(--sale-line)", background: "var(--sale-surface)" }}
      >
        <div className="mx-auto flex max-w-md gap-2">
          <button
            type="button"
            className="sale-btn-ghost touch-target flex-1 text-sm"
            onClick={() => setEditing((v) => !v)}
          >
            {editing ? "บันทึกการแก้" : "แก้ไข / เพิ่ม"}
          </button>
          <button
            type="button"
            className="sale-btn-accent touch-target flex-1 text-sm disabled:opacity-60"
            disabled={saving}
            onClick={() => void onConfirm()}
          >
            {saving ? "กำลังส่ง…" : "ยืนยันและส่ง"}
          </button>
        </div>
      </div>
    </div>
  );
}
