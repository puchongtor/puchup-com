"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { BrandMark } from "@/components/sales-ai/BrandMark";
import { saleHref } from "@/lib/sales-ai/paths";
import { normalizeSaleRole } from "@/lib/sales-ai/roles";
import { useSaleStore } from "@/lib/sales-ai/SaleStore";

type SearchReport = {
  id: string;
  companyName: string;
  salesName: string;
  contact: string | null;
  phone: string | null;
  product: string | null;
  status: string;
  confirmedAt: string | null;
  createdAt: string;
  matchReasons: string[];
  matchScore?: number;
  matchTier?: "direct" | "related";
};

type SearchContact = {
  id: string;
  name: string;
  phone: string | null;
  position: string | null;
  companyName: string;
};

function formatWhen(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("th-TH", {
    day: "numeric",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Bangkok",
  });
}

function SearchInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { profile } = useSaleStore();
  const role = normalizeSaleRole(profile.role);
  const isManager = role === "manager" || role === "admin";
  const backHref = isManager ? saleHref("/manager") : saleHref("/customers");
  const initialQ = params.get("q") || "";
  const [q, setQ] = useState(initialQ);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<SearchReport[]>([]);
  const [relatedReports, setRelatedReports] = useState<SearchReport[]>([]);
  const [contacts, setContacts] = useState<SearchContact[]>([]);
  const [scope, setScope] = useState<"team" | "self">("self");

  useEffect(() => {
    setQ(initialQ);
  }, [initialQ]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/sale/search?q=${encodeURIComponent(initialQ)}`,
        );
        const json = (await res.json()) as {
          ok?: boolean;
          error?: string;
          scope?: "team" | "self";
          reports?: SearchReport[];
          relatedReports?: SearchReport[];
          contacts?: SearchContact[];
        };
        if (cancelled) return;
        if (!res.ok || !json.ok) {
          setError(json.error || "ค้นหาไม่สำเร็จ");
          setReports([]);
          setRelatedReports([]);
          setContacts([]);
          return;
        }
        setScope(json.scope === "team" ? "team" : "self");
        setReports(json.reports || []);
        setRelatedReports(json.relatedReports || []);
        setContacts(json.contacts || []);
      } catch {
        if (!cancelled) setError("เชื่อมต่อไม่สำเร็จ");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialQ]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = q.trim();
    router.push(saleHref(`/search?q=${encodeURIComponent(next)}`));
  }

  return (
    <div className="mx-auto min-h-dvh max-w-3xl px-4 py-5 sm:px-6" style={{ background: "#eef2f6" }}>
      <header className="mb-4 flex items-center gap-3">
        <Link
          href={backHref}
          className="rounded-lg px-2.5 py-1 text-xs"
          style={{ background: "var(--sale-navy)", color: "#fff" }}
        >
          ← กลับ
        </Link>
        <div>
          <BrandMark size="sm" />
          <h1 className="mt-1 text-lg font-semibold" style={{ color: "var(--sale-navy)" }}>
            ค้นหารายงาน
          </h1>
          <p className="text-[11px]" style={{ color: "var(--sale-muted)" }}>
            {scope === "team"
              ? "ชื่อ · เบอร์ · บริษัท · สินค้า — ทั้งทีม · รองรับคำใกล้เคียง"
              : "ชื่อ · เบอร์ · บริษัท · สินค้า — เฉพาะของคุณ · รองรับคำใกล้เคียง"}
          </p>
        </div>
      </header>

      <form onSubmit={onSubmit} className="mb-4">
        <div
          className="flex gap-2 rounded-2xl border p-2"
          style={{
            background: "var(--sale-navy-soft)",
            borderColor: "rgba(18, 38, 63, 0.18)",
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="พิมพ์ชื่อ เบอร์ บริษัท หรือสินค้า…"
            className="min-w-0 flex-1 rounded-xl border bg-white/70 px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:bg-white"
            style={{
              borderColor: "rgba(18, 38, 63, 0.12)",
              color: "var(--sale-navy)",
            }}
            autoFocus
          />
          <button
            type="submit"
            className="shrink-0 rounded-xl border px-4 py-2 text-sm font-medium"
            style={{
              borderColor: "rgba(18, 38, 63, 0.22)",
              background: "rgba(255,255,255,0.85)",
              color: "var(--sale-navy)",
            }}
          >
            ค้นหา
          </button>
        </div>
      </form>

      {error ? (
        <p
          className="mb-3 rounded-xl px-3 py-2 text-sm"
          style={{ background: "var(--sale-warn)", color: "var(--sale-warn-text)" }}
        >
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm" style={{ color: "var(--sale-muted)" }}>
          กำลังค้นหา…
        </p>
      ) : (
        <div className="space-y-6">
          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--sale-muted)" }}>
              {scope === "team" ? "ผู้ติดต่อในฐานข้อมูล" : "ผู้ติดต่อจากรายงานของคุณ"}
              {contacts.length ? ` · ${contacts.length}` : ""}
            </h2>
            {contacts.length === 0 ? (
              <p className="rounded-2xl bg-white px-4 py-3 text-sm" style={{ color: "var(--sale-muted)" }}>
                {initialQ
                  ? "ไม่พบชื่อ/เบอร์ที่ตรง"
                  : scope === "team"
                    ? "ยังไม่มีรายชื่อ — จะเพิ่มเมื่อ Sale ยืนยันสรุปที่มีชื่อ–เบอร์"
                    : "ยังไม่มีชื่อในรายงานของคุณ — กรอกชื่อ–เบอร์ตอนสรุปเยี่ยมแล้วค้นหาได้"}
              </p>
            ) : (
              <ul className="space-y-2">
                {contacts.map((c) => (
                  <li
                    key={c.id}
                    className="rounded-2xl border bg-white px-4 py-3"
                    style={{ borderColor: "var(--sale-line)" }}
                  >
                    <p className="text-sm font-semibold" style={{ color: "var(--sale-navy)" }}>
                      {c.name}
                      {c.phone ? (
                        <span className="ml-2 font-normal" style={{ color: "var(--sale-muted)" }}>
                          {c.phone}
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 text-xs" style={{ color: "var(--sale-muted)" }}>
                      {c.companyName}
                      {c.position ? ` · ${c.position}` : ""}
                    </p>
                    <button
                      type="button"
                      className="mt-2 text-xs font-medium underline"
                      style={{ color: "var(--sale-navy)" }}
                      onClick={() =>
                        router.push(
                          saleHref(
                            `/search?q=${encodeURIComponent(c.name || c.companyName)}`,
                          ),
                        )
                      }
                    >
                      ดูรายงานที่เกี่ยวกับชื่อนี้
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--sale-muted)" }}>
              รายงานที่ตรงคำค้น
              {reports.length ? ` · ${reports.length}` : ""}
            </h2>
            {reports.length === 0 ? (
              <p className="rounded-2xl bg-white px-4 py-3 text-sm" style={{ color: "var(--sale-muted)" }}>
                {initialQ ? "ไม่พบรายงานที่ตรงคำค้น" : "พิมพ์คำค้นด้านบน หรือดูรายชื่อผู้ติดต่อข้างบน"}
              </p>
            ) : (
              <ul className="space-y-2">
                {reports.map((r) => (
                  <li key={r.id}>
                    <ReportCard report={r} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          {initialQ && relatedReports.length > 0 ? (
            <section className="pt-2">
              <div
                className="mb-4 border-t"
                style={{ borderColor: "rgba(18, 38, 63, 0.16)" }}
                aria-hidden
              />
              <h2
                className="mb-1 text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--sale-muted)" }}
              >
                รายการที่อาจเกี่ยวข้อง
                {` · ${relatedReports.length}`}
              </h2>
              <p className="mb-3 text-[11px]" style={{ color: "var(--sale-muted)" }}>
                ไม่ตรงเป๊ะ — ใกล้เคียงชื่อหรือคำพลาดพิมพ์ น่าจะเช็กก่อนใช้
              </p>
              <ul className="space-y-2">
                {relatedReports.map((r) => (
                  <li key={r.id}>
                    <ReportCard report={r} muted />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}

function ReportCard({
  report: r,
  muted = false,
}: {
  report: SearchReport;
  muted?: boolean;
}) {
  return (
    <Link
      href={saleHref(`/report/${r.id}`)}
      className="block rounded-2xl border bg-white px-4 py-3 transition hover:border-[var(--sale-navy)]"
      style={{
        borderColor: "var(--sale-line)",
        opacity: muted ? 0.88 : 1,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold" style={{ color: "var(--sale-navy)" }}>
          {r.companyName}
        </p>
        <time className="shrink-0 text-[11px]" style={{ color: "var(--sale-muted)" }}>
          {formatWhen(r.confirmedAt || r.createdAt)}
        </time>
      </div>
      <p className="mt-1 text-xs" style={{ color: "var(--sale-muted)" }}>
        {r.salesName}
        {r.contact ? ` · ${r.contact}` : ""}
        {r.phone ? ` · ${r.phone}` : ""}
      </p>
      {r.product ? (
        <p className="mt-1 text-xs" style={{ color: "var(--sale-text)" }}>
          สินค้า: {r.product}
        </p>
      ) : null}
      {r.matchReasons?.length ? (
        <p className="mt-1 text-[10px] leading-snug" style={{ color: "var(--sale-muted)" }}>
          พบจาก: {r.matchReasons.join(" · ")}
        </p>
      ) : null}
    </Link>
  );
}

export default function ManagerSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-sm" style={{ color: "var(--sale-muted)" }}>
          กำลังโหลด…
        </div>
      }
    >
      <SearchInner />
    </Suspense>
  );
}
