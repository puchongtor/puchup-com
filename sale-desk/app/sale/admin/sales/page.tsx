"use client";

import { saleHref } from "@/lib/sales-ai/paths";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BrandMark } from "@/components/sales-ai/BrandMark";
import type { StoredVisitReport } from "@/lib/sales-ai/types";

type UserRow = {
  id: string;
  username: string;
  full_name: string;
  nickname?: string | null;
  status: string;
  role: string;
};

type SaleCard = {
  id: string;
  username: string;
  name: string;
  status: string;
  visitCount: number;
  confirmedCount: number;
  lastVisitAt: string | null;
  lastCompany: string | null;
};

export default function AdminSalesMonitorPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [reports, setReports] = useState<StoredVisitReport[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [uRes, rRes] = await Promise.all([
          fetch("/api/sale/users"),
          fetch("/api/sale/reports?scope=all"),
        ]);
        const uJson = (await uRes.json()) as { ok: boolean; users?: UserRow[]; error?: string };
        const rJson = (await rRes.json()) as {
          ok: boolean;
          reports?: StoredVisitReport[];
          error?: string;
        };
        if (!uRes.ok || !uJson.ok) throw new Error(uJson.error || "โหลด Sale ไม่สำเร็จ");
        if (!rRes.ok || !rJson.ok) throw new Error(rJson.error || "โหลดรายงานไม่สำเร็จ");
        if (cancelled) return;
        setUsers(uJson.users || []);
        setReports(rJson.reports || []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "โหลดไม่สำเร็จ");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = useMemo(() => {
    const sales = users.filter((u) => u.role === "sales");
    return sales.map((s): SaleCard => {
      const mine = reports.filter((r) => r.salesId === s.id);
      const sorted = [...mine].sort((a, b) =>
        (b.confirmedAt || b.createdAt).localeCompare(a.confirmedAt || a.createdAt),
      );
      const last = sorted[0];
      return {
        id: s.id,
        username: s.username,
        name: s.nickname || s.full_name,
        status: s.status,
        visitCount: mine.length,
        confirmedCount: mine.filter((r) => r.status === "confirmed").length,
        lastVisitAt: last ? last.confirmedAt || last.createdAt : null,
        lastCompany: last?.companyName || null,
      };
    });
  }, [users, reports]);

  return (
    <div className="min-h-dvh" style={{ background: "var(--sale-bg)" }}>
      <header className="px-4 py-5 text-white sm:px-6" style={{ background: "var(--sale-navy)" }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <BrandMark tone="dark" size="sm" showProduct={false} />
            <h1 className="mt-3 text-lg font-semibold">ติดตาม Sale</h1>
            <p className="text-xs text-white/70">
              ดูรายงานและการเคลื่อนไหวของแต่ละคน — ไม่ได้เข้าไปในบัญชี Sale
            </p>
          </div>
          <Link
            href={saleHref("/admin")}
            className="rounded-lg px-3 py-2 text-xs text-white/90"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            ← Admin
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <p className="text-sm" style={{ color: "var(--sale-muted)" }}>
            กำลังโหลด…
          </p>
        ) : error ? (
          <p className="text-sm" style={{ color: "var(--sale-danger-text)" }}>
            {error}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => (
              <Link
                key={c.id}
                href={saleHref(`/admin/sales/${c.id}`)}
                className="rounded-2xl border bg-white/90 p-4 shadow-sm transition hover:border-[var(--sale-navy)]"
                style={{ borderColor: "var(--sale-line)" }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--sale-navy)" }}>
                      {c.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--sale-muted)" }}>
                      @{c.username}
                    </p>
                  </div>
                  <span
                    className="sale-chip text-[10px]"
                    style={{
                      background:
                        c.status === "active"
                          ? "var(--sale-ok)"
                          : c.status === "suspended"
                            ? "var(--sale-warn)"
                            : "var(--sale-danger)",
                      color:
                        c.status === "active"
                          ? "var(--sale-ok-text)"
                          : c.status === "suspended"
                            ? "var(--sale-warn-text)"
                            : "var(--sale-danger-text)",
                    }}
                  >
                    {c.status === "active"
                      ? "ใช้งาน"
                      : c.status === "suspended"
                        ? "ระงับ"
                        : "ปิด"}
                  </span>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <dt style={{ color: "var(--sale-muted)" }}>รายงานทั้งหมด</dt>
                    <dd className="mt-0.5 text-sm font-semibold">{c.visitCount}</dd>
                  </div>
                  <div>
                    <dt style={{ color: "var(--sale-muted)" }}>ยืนยันแล้ว</dt>
                    <dd className="mt-0.5 text-sm font-semibold">{c.confirmedCount}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-[11px] leading-relaxed" style={{ color: "var(--sale-muted)" }}>
                  {c.lastCompany
                    ? `ล่าสุด: ${c.lastCompany} · ${new Date(c.lastVisitAt!).toLocaleString("th-TH", {
                        dateStyle: "short",
                        timeStyle: "short",
                        timeZone: "Asia/Bangkok",
                      })}`
                    : "ยังไม่มีการเยี่ยม"}
                </p>
                <p className="mt-2 text-xs font-medium" style={{ color: "var(--sale-navy)" }}>
                  ดูการเคลื่อนไหว →
                </p>
              </Link>
            ))}
            {cards.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--sale-muted)" }}>
                ยังไม่มีบัญชี Sale
              </p>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}
