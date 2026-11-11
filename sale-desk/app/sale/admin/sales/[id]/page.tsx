"use client";

import { saleHref } from "@/lib/sales-ai/paths";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BrandMark } from "@/components/sales-ai/BrandMark";
import type { StoredVisitReport } from "@/lib/sales-ai/types";

type UserRow = {
  id: string;
  username: string;
  full_name: string;
  nickname?: string | null;
  position?: string | null;
  phone?: string | null;
  status: string;
  role: string;
};

export default function AdminSaleDetailPage() {
  const params = useParams();
  const saleId = String(params.id || "");
  const [user, setUser] = useState<UserRow | null>(null);
  const [reports, setReports] = useState<StoredVisitReport[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!saleId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [uRes, rRes] = await Promise.all([
          fetch("/api/sale/users"),
          fetch(`/api/sale/reports?salesId=${encodeURIComponent(saleId)}`),
        ]);
        const uJson = (await uRes.json()) as { ok: boolean; users?: UserRow[]; error?: string };
        const rJson = (await rRes.json()) as {
          ok: boolean;
          reports?: StoredVisitReport[];
          error?: string;
        };
        if (!uRes.ok || !uJson.ok) throw new Error(uJson.error || "โหลดผู้ใช้ไม่สำเร็จ");
        if (!rRes.ok || !rJson.ok) throw new Error(rJson.error || "โหลดรายงานไม่สำเร็จ");
        if (cancelled) return;
        const found = (uJson.users || []).find((u) => u.id === saleId) || null;
        setUser(found);
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
  }, [saleId]);

  const sorted = useMemo(
    () =>
      [...reports].sort((a, b) =>
        (b.confirmedAt || b.createdAt).localeCompare(a.confirmedAt || a.createdAt),
      ),
    [reports],
  );

  const name = user?.nickname || user?.full_name || "Sale";

  return (
    <div className="min-h-dvh" style={{ background: "var(--sale-bg)" }}>
      <header className="px-4 py-5 text-white sm:px-6" style={{ background: "var(--sale-navy)" }}>
        <div className="mx-auto max-w-6xl">
          <BrandMark tone="dark" size="sm" showProduct={false} />
          <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] text-white/65">ติดตาม Sale · อ่านอย่างเดียว</p>
              <h1 className="mt-1 text-lg font-semibold">{loading ? "กำลังโหลด…" : name}</h1>
              {user ? (
                <p className="mt-0.5 text-xs text-white/70">
                  @{user.username}
                  {user.position ? ` · ${user.position}` : ""}
                  {user.phone ? ` · ${user.phone}` : ""}
                </p>
              ) : null}
            </div>
            <Link
              href={saleHref("/admin/sales")}
              className="rounded-lg px-3 py-2 text-xs text-white/90"
              style={{ background: "rgba(255,255,255,0.12)" }}
            >
              ← รายชื่อ Sale
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {error ? (
          <p className="text-sm" style={{ color: "var(--sale-danger-text)" }}>
            {error}
          </p>
        ) : null}

        {!loading && !user ? (
          <p className="text-sm" style={{ color: "var(--sale-muted)" }}>
            ไม่พบบัญชีนี้
          </p>
        ) : null}

        <section
          className="rounded-2xl border bg-white/90 p-5 shadow-sm"
          style={{ borderColor: "var(--sale-line)" }}
        >
          <h2 className="text-sm font-semibold" style={{ color: "var(--sale-navy)" }}>
            การเคลื่อนไหว / รายงาน
          </h2>
          <p className="mt-1 text-xs" style={{ color: "var(--sale-muted)" }}>
            คลิกรายงานเพื่อดูรายละเอียด — ไม่ใช่การล็อกอินแทน Sale
          </p>

          {loading ? (
            <p className="mt-4 text-sm" style={{ color: "var(--sale-muted)" }}>
              กำลังโหลด…
            </p>
          ) : (
            <ul className="mt-4 divide-y" style={{ borderColor: "var(--sale-line)" }}>
              {sorted.map((r) => (
                <li key={r.id} className="py-3 first:pt-0">
                  <Link
                    href={saleHref(`/report/${r.id}`)}
                    className="flex flex-wrap items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{r.companyName}</p>
                      <p className="mt-0.5 text-[11px]" style={{ color: "var(--sale-muted)" }}>
                        {new Date(r.confirmedAt || r.createdAt).toLocaleString("th-TH", {
                          dateStyle: "medium",
                          timeStyle: "short",
                          timeZone: "Asia/Bangkok",
                        })}
                        {r.status === "confirmed" ? " · ยืนยันแล้ว" : " · รอตรวจ"}
                        {r.urgency === "line_down" || r.urgency === "urgent" ? " · ด่วน" : ""}
                      </p>
                    </div>
                    <span className="text-xs font-medium" style={{ color: "var(--sale-navy)" }}>
                      ดูรายงาน →
                    </span>
                  </Link>
                </li>
              ))}
              {sorted.length === 0 ? (
                <li className="py-2 text-sm" style={{ color: "var(--sale-muted)" }}>
                  ยังไม่มีรายงานจาก Sale คนนี้
                </li>
              ) : null}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
