"use client";

import { saleHref, saleNavPath } from "@/lib/sales-ai/paths";
import Link from "next/link";
import { Mic } from "lucide-react";
import { BrandFooter } from "@/components/sales-ai/BrandFooter";
import { BrandMark } from "@/components/sales-ai/BrandMark";
import { HomeCoachChat } from "@/components/sales-ai/HomeCoachChat";
import { ProfileAvatar } from "@/components/sales-ai/ProfileAvatar";
import { SaleBottomNav } from "@/components/sales-ai/SaleBottomNav";
import { SALE_BRAND } from "@/lib/sales-ai/brand";
import { type SaleDayPlan } from "@/lib/sales-ai/day-plans";
import {
  isAccountStuck,
  type OpenAccount,
} from "@/lib/sales-ai/open-accounts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSaleStore } from "@/lib/sales-ai/SaleStore";
import { monthlyScoresForSale } from "@/lib/sales-ai/scoring";

type OpenVisit = {
  id: string;
  companyName: string | null;
  status: string;
  startedAt?: string | null;
  createdAt?: string | null;
};

function formatVisitWhen(iso?: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString("th-TH", {
    timeZone: "Asia/Bangkok",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** โฮมเซลล์หลัง login */
export default function SaleHomePage() {
  const { profile, reports, discardReport, syncing } = useSaleStore();
  const myReports = useMemo(
    () => reports.filter((r) => r.salesId === profile.id),
    [reports, profile.id],
  );
  const pending = myReports.filter((r) => r.status === "pending_review");
  const displayName = profile.nickname || profile.fullName;
  const [openVisits, setOpenVisits] = useState<OpenVisit[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{
    id: string;
    kind: "open" | "pending";
    title: string;
  } | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [todayPlan, setTodayPlan] = useState<SaleDayPlan | null>(null);
  const [assignedLeads, setAssignedLeads] = useState<OpenAccount[]>([]);

  const monthScores = useMemo(
    () => monthlyScoresForSale(profile.id, myReports),
    [profile.id, myReports],
  );
  const thisMonth = monthScores.find((m) => m.isCurrent) || monthScores[0];
  const priorMonths = monthScores.filter((m) => !m.isCurrent);

  const refreshOpen = useCallback(async () => {
    try {
      const res = await fetch("/api/sale/visits?status=in_progress");
      const json = (await res.json()) as {
        ok?: boolean;
        visits?: OpenVisit[];
      };
      if (json.ok) setOpenVisits(json.visits || []);
    } catch {
      /* ignore */
    }
  }, []);

  const refreshTodayPlan = useCallback(async () => {
    try {
      const res = await fetch("/api/sale/day-plans");
      const json = (await res.json()) as {
        ok?: boolean;
        plans?: SaleDayPlan[];
      };
      if (json.ok) setTodayPlan(json.plans?.[0] || null);
    } catch {
      /* ignore */
    }
  }, []);

  const refreshAssignedLeads = useCallback(async () => {
    try {
      const res = await fetch("/api/sale/accounts?mine=1");
      const json = (await res.json()) as {
        ok?: boolean;
        accounts?: OpenAccount[];
      };
      if (json.ok) setAssignedLeads(json.accounts || []);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void refreshOpen();
    void refreshTodayPlan();
    void refreshAssignedLeads();
  }, [refreshOpen, refreshTodayPlan, refreshAssignedLeads]);

  async function voidOpenVisit(visitId: string) {
    setBusyId(visitId);
    setActionError(null);
    try {
      const res = await fetch(`/api/sale/visit/${visitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "void" }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setActionError(json.error || "ปิดงานไม่สำเร็จ");
        return;
      }
      setOpenVisits((prev) => prev.filter((v) => v.id !== visitId));
      await refreshOpen();
    } catch {
      setActionError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    } finally {
      setBusyId(null);
      setConfirm(null);
    }
  }

  async function voidPending(reportId: string) {
    setBusyId(reportId);
    setActionError(null);
    try {
      await discardReport(reportId);
      setOpenVisits((prev) => prev.filter((v) => v.id !== reportId));
      await refreshOpen();
    } catch {
      setActionError("ลบรายงานไม่สำเร็จ — ลองอีกครั้ง");
    } finally {
      setBusyId(null);
      setConfirm(null);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col pb-24">
      <header className="px-5 pb-5 pt-6 text-white" style={{ background: "var(--sale-navy)" }}>
        <BrandMark tone="dark" size="md" />

        <div className="mt-5 flex items-center gap-3">
          <Link href={saleHref("/profile")} aria-label="โปรไฟล์">
            <ProfileAvatar profile={profile} size={44} light />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[17px] font-semibold leading-tight">
              สวัสดี {displayName}
            </h1>
            <p className="mt-0.5 truncate text-xs text-white/75">
              {profile.position || "เซลล์ภาคสนาม"} · ทีม {SALE_BRAND.name}
            </p>
          </div>
          <Link
            href={saleHref("/profile")}
            className="rounded-lg px-2.5 py-1.5 text-[11px] text-white/90"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            โปรไฟล์
          </Link>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-3.5 px-4 pt-5">
        <HomeCoachChat
          salesId={profile.id}
          salesName={displayName}
          monthPoints={thisMonth?.totalPoints ?? 0}
          monthAverage={thisMonth?.average ?? 0}
          confirmedCount={thisMonth?.confirmedCount ?? 0}
          onDayPlanSaved={() => void refreshTodayPlan()}
        />

        <div>
          <Link
            href={saleHref("/customers")}
            className="sale-btn-accent touch-target inline-flex w-full items-center justify-center gap-2 py-3.5 text-[15px]"
          >
            <Mic size={18} strokeWidth={2.25} aria-hidden />
            เริ่มเยี่ยมลูกค้า
          </Link>
          <p className="mt-2 text-center text-xs" style={{ color: "var(--sale-muted)" }}>
            พูด · ถ่ายรูป · หรือพิมพ์ได้เลย
          </p>
        </div>

        {actionError ? (
          <p
            className="rounded-xl px-3 py-2 text-xs"
            style={{ background: "var(--sale-warn)", color: "var(--sale-warn-text)" }}
          >
            {actionError}
          </p>
        ) : null}

        {openVisits.length > 0 ? (
          <section className="sale-card p-4">
            <p className="text-sm font-semibold">เยี่ยมค้างอยู่</p>
            <ul className="mt-3 space-y-3">
              {openVisits.map((v) => (
                <li
                  key={v.id}
                  className="rounded-xl border px-3 py-3"
                  style={{ borderColor: "var(--sale-line)" }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{v.companyName || "ลูกค้า"}</p>
                      {formatVisitWhen(v.startedAt || v.createdAt) ? (
                        <p className="mt-1 text-[11px]" style={{ color: "var(--sale-muted)" }}>
                          {formatVisitWhen(v.startedAt || v.createdAt)}
                        </p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      disabled={busyId === v.id || syncing}
                      onClick={() =>
                        setConfirm({
                          id: v.id,
                          kind: "open",
                          title: v.companyName || "ลูกค้า",
                        })
                      }
                      className="shrink-0 text-[11px] font-medium disabled:opacity-50"
                      style={{ color: "var(--sale-danger-text)" }}
                    >
                      ปิดงานนี้
                    </button>
                  </div>
                  <Link
                    href={saleHref(`/visit/${v.id}`)}
                    className="sale-btn-primary mt-3 inline-flex touch-target w-full items-center justify-center px-4 py-2 text-sm"
                  >
                    เปิดแชทต่อ
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {assignedLeads.length > 0 ? (
          <section className="sale-card p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold" style={{ color: "var(--sale-navy)" }}>
                ผู้จัดการส่งให้ติดตาม
              </p>
              <span
                className="sale-chip"
                style={{
                  background: "var(--sale-navy-soft)",
                  color: "var(--sale-navy)",
                }}
              >
                {assignedLeads.filter((a) => isAccountStuck(a)).length > 0
                  ? `ค้าง ${assignedLeads.filter((a) => isAccountStuck(a)).length}`
                  : `${assignedLeads.length} รายการ`}
              </span>
            </div>
            <ul className="mt-3 space-y-2.5">
              {assignedLeads.slice(0, 5).map((a) => (
                <li
                  key={a.id}
                  className="rounded-xl border px-3 py-2.5"
                  style={{
                    borderColor: isAccountStuck(a)
                      ? "rgba(180, 83, 9, 0.4)"
                      : "var(--sale-line)",
                  }}
                >
                  <p className="text-sm font-medium">{a.companyName}</p>
                  <p className="mt-0.5 text-[11px]" style={{ color: "var(--sale-muted)" }}>
                    {[a.contactName, a.phone].filter(Boolean).join(" · ") ||
                      "ยังไม่มีผู้ติดต่อ"}
                    {a.createdByName ? ` · จาก ${a.createdByName}` : ""}
                  </p>
                  {a.nextAction ? (
                    <p className="mt-1 text-xs" style={{ color: "var(--sale-text)" }}>
                      {isAccountStuck(a) ? "ค้าง · " : ""}
                      {a.nextAction}
                    </p>
                  ) : null}
                  <Link
                    href={saleHref("/customers")}
                    className="mt-2 inline-block text-[11px] font-medium underline"
                    style={{ color: "var(--sale-navy)" }}
                  >
                    ไปเยี่ยมแล้วคุยสรุปยืนยัน
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="sale-card p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">รอตรวจก่อนส่ง</p>
            <span
              className="sale-chip"
              style={{ background: "var(--sale-warn)", color: "var(--sale-warn-text)" }}
            >
              {pending.length > 0 ? `${pending.length} รายการ` : "ไม่มี"}
            </span>
          </div>
          {pending.length > 0 ? (
            <ul className="mt-3 space-y-3">
              {pending.map((item) => (
                <li
                  key={item.id}
                  className="rounded-xl border px-3 py-3"
                  style={{ borderColor: "var(--sale-line)" }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{item.companyName || "รายงาน"}</p>
                      {formatVisitWhen(item.createdAt) ? (
                        <p className="mt-1 text-[11px]" style={{ color: "var(--sale-muted)" }}>
                          {formatVisitWhen(item.createdAt)}
                        </p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      disabled={busyId === item.id || syncing}
                      onClick={() =>
                        setConfirm({
                          id: item.id,
                          kind: "pending",
                          title: item.companyName || "รายงานนี้",
                        })
                      }
                      className="shrink-0 text-[11px] font-medium disabled:opacity-50"
                      style={{ color: "var(--sale-danger-text)" }}
                    >
                      ลบ
                    </button>
                  </div>
                  <Link
                    href={saleHref(`/visit/${item.id}/summary`)}
                    className="sale-btn-primary mt-3 inline-flex touch-target w-full items-center justify-center px-4 py-2 text-sm"
                  >
                    ตรวจสรุป
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm" style={{ color: "var(--sale-muted)" }}>
              ยังไม่มีรายงานรอตรวจ
            </p>
          )}
        </section>

        <section className="sale-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold">คะแนนรวมเดือนนี้</p>
              <p className="mt-0.5 text-[11px]" style={{ color: "var(--sale-muted)" }}>
                {thisMonth?.label || "เดือนนี้"} · รีเซ็ตทุกเดือน · เห็นเฉพาะคุณ
              </p>
              <p className="mt-1.5 text-xs leading-relaxed" style={{ color: "var(--sale-muted)" }}>
                {thisMonth?.feedback || "ยังไม่มีรายงานเดือนนี้"}
              </p>
            </div>
            <Link
              href={saleHref("/score")}
              className="shrink-0 text-right"
              style={{ color: "var(--sale-navy)" }}
            >
              <p className="text-3xl font-bold tabular-nums leading-none">
                {thisMonth?.totalPoints ?? 0}
              </p>
              <p className="mt-1 text-[10px]" style={{ color: "var(--sale-muted)" }}>
                เฉลี่ย {thisMonth?.average ?? 0}
              </p>
            </Link>
          </div>
          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full"
            style={{ background: "var(--sale-navy-soft)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${thisMonth?.average ?? 0}%`,
                background: "var(--sale-navy)",
              }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 text-[11px]">
            <span style={{ color: "var(--sale-muted)" }}>
              ยืนยันแล้ว {thisMonth?.confirmedCount ?? 0} ครั้งเดือนนี้
            </span>
            <Link
              href={saleHref("/score")}
              className="font-medium underline-offset-2 hover:underline"
              style={{ color: "var(--sale-navy)" }}
            >
              {priorMonths.length > 0
                ? `ดูประวัติ ${priorMonths.length} เดือน →`
                : "รายละเอียดคะแนน →"}
            </Link>
          </div>
        </section>

        <section className="sale-card p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">กำหนดการวันนี้</h2>
            <span className="text-[11px]" style={{ color: "var(--sale-muted)" }}>
              ผู้จัดการเห็นแผนนี้ได้
            </span>
          </div>
          {todayPlan?.stops?.length ? (
            <ul className="mt-2.5 space-y-2">
              {todayPlan.stops.map((s, i) => (
                <li
                  key={`${s.company}-${i}`}
                  className="rounded-xl px-3 py-2 text-sm"
                  style={{ background: "var(--sale-bg)" }}
                >
                  <p className="font-medium" style={{ color: "var(--sale-navy)" }}>
                    {s.company}
                    {s.time ? (
                      <span className="ml-1.5 text-[12px] font-normal tabular-nums" style={{ color: "var(--sale-muted)" }}>
                        {s.time}
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-snug" style={{ color: "var(--sale-muted)" }}>
                    {[s.purpose, s.meetWho ? `เจอ ${s.meetWho}` : null, s.withWhom ? `ไปกับ ${s.withWhom}` : null]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--sale-muted)" }}>
              ยังไม่มีแผน — บอกผู้ช่วยด้านล่างได้เลย เช่น วันนี้ไป ABC เช้า เจอคุณเก๋ เสนอราคา
            </p>
          )}
        </section>

        <div className="flex justify-end gap-2 pt-1 text-xs" style={{ color: "var(--sale-muted)" }}>
          <button
            type="button"
            className="underline-offset-2 hover:underline"
            onClick={async () => {
              await fetch("/api/sale/auth/logout", { method: "POST" });
              window.location.href = saleNavPath("/");
            }}
          >
            ออกจากระบบ
          </button>
        </div>

        <BrandFooter />
      </div>

      {confirm ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-8 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="discard-title"
        >
          <div
            className="w-full max-w-sm rounded-2xl p-5 shadow-lg"
            style={{ background: "var(--sale-surface)" }}
          >
            <h2 id="discard-title" className="text-base font-semibold" style={{ color: "var(--sale-navy)" }}>
              ยืนยันปิดงานนี้?
            </h2>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--sale-muted)" }}>
              จะลบ «{confirm.title}» ออกจากรายการ
              {confirm.kind === "open" ? "เยี่ยมค้าง" : "รอตรวจ"} — กดผิดแล้วแก้ได้ตรงนี้
              ข้อมูลแชทของงานนี้จะไม่ใช้ต่อ
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                disabled={Boolean(busyId)}
                onClick={() => setConfirm(null)}
                className="sale-btn-ghost touch-target flex-1 text-sm disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={Boolean(busyId)}
                onClick={() =>
                  void (confirm.kind === "open"
                    ? voidOpenVisit(confirm.id)
                    : voidPending(confirm.id))
                }
                className="touch-target flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: "var(--sale-danger-text)" }}
              >
                {busyId ? "กำลังลบ…" : "ยืนยันลบ"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <SaleBottomNav />
    </div>
  );
}
