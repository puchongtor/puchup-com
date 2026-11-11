"use client";

import { saleHref, saleNavPath } from "@/lib/sales-ai/paths";
import { loadAssistantId } from "@/lib/sales-ai/assistant-persona";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BrandMark } from "@/components/sales-ai/BrandMark";
import { SaleBottomNav } from "@/components/sales-ai/SaleBottomNav";
import { useSaleStore } from "@/lib/sales-ai/SaleStore";

type RecentCompany = {
  name: string;
  visitCount: number;
  lastVisit?: string;
};

export default function SaleCustomersPage() {
  const router = useRouter();
  const { profile } = useSaleStore();
  const [q, setQ] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recent, setRecent] = useState<RecentCompany[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/sale/visits");
        const json = (await res.json()) as {
          ok?: boolean;
          visits?: { companyName?: string | null; status?: string; createdAt?: string }[];
        };
        if (cancelled || !json.ok) return;
        const map = new Map<string, RecentCompany>();
        for (const v of json.visits || []) {
          const name = (v.companyName || "").trim();
          if (!name || name === "ยังไม่ระบุบริษัท" || name === "บริษัทใหม่") continue;
          if (v.status === "void") continue;
          const cur = map.get(name) || { name, visitCount: 0 };
          cur.visitCount += 1;
          if (v.createdAt) {
            cur.lastVisit = new Date(v.createdAt).toLocaleDateString("th-TH", {
              day: "numeric",
              month: "short",
              timeZone: "Asia/Bangkok",
            });
          }
          map.set(name, cur);
        }
        setRecent(
          [...map.values()].sort((a, b) => b.visitCount - a.visitCount).slice(0, 20),
        );
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return recent;
    return recent.filter((c) => c.name.toLowerCase().includes(needle));
  }, [q, recent]);

  async function startVisit(companyName: string) {
    if (starting) return;
    setStarting(true);
    setError(null);
    try {
      const res = await fetch("/api/sale/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          assistantId: loadAssistantId(profile.id),
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        visit?: { id: string; companyName?: string };
      };
      if (!res.ok || !json.ok || !json.visit?.id) {
        setError(json.error || "สร้างการเยี่ยมไม่สำเร็จ");
        return;
      }
      const name = json.visit.companyName || companyName;
      router.push(
        saleNavPath(
          `/visit/${json.visit.id}?company=${encodeURIComponent(name)}`,
        ),
      );
    } catch {
      setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    } finally {
      setStarting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col pb-24">
      <header className="px-5 pb-4 pt-6 text-white" style={{ background: "var(--sale-navy)" }}>
        <BrandMark tone="dark" size="sm" />
        <h1 className="mt-3 text-lg font-semibold">ลูกค้า</h1>
        <p className="text-xs text-white/75">
          ค้นหารายงานเก่า หรือเริ่มเยี่ยมลูกค้าใหม่
        </p>
      </header>

      <div className="px-4 pt-4">
        <section className="mb-5">
          <p
            className="mb-2 text-[11px] font-semibold uppercase tracking-wide"
            style={{ color: "var(--sale-muted)" }}
          >
            ค้นหารายงานของฉัน
          </p>
          <form
            className="flex gap-2 rounded-2xl border p-2"
            style={{
              background: "var(--sale-navy-soft)",
              borderColor: "rgba(18, 38, 63, 0.18)",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              const next = searchQ.trim();
              router.push(saleNavPath(`/search?q=${encodeURIComponent(next)}`));
            }}
          >
            <input
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="ชื่อ เบอร์ บริษัท หรือสินค้า…"
              className="min-w-0 flex-1 rounded-xl border bg-white/70 px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:bg-white"
              style={{
                borderColor: "rgba(18, 38, 63, 0.12)",
                color: "var(--sale-navy)",
              }}
              autoComplete="off"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl border px-3 py-2 text-sm font-medium"
              style={{
                borderColor: "rgba(18, 38, 63, 0.22)",
                background: "rgba(255,255,255,0.85)",
                color: "var(--sale-navy)",
              }}
            >
              ค้นหา
            </button>
          </form>
          <p className="mt-1.5 text-[11px]" style={{ color: "var(--sale-muted)" }}>
            รองรับคำใกล้เคียง เช่น ไดไอซ์ ↔ น้ำแข็งแห้ง
          </p>
        </section>

        <section>
          <p
            className="mb-2 text-[11px] font-semibold uppercase tracking-wide"
            style={{ color: "var(--sale-muted)" }}
          >
            เริ่มเยี่ยมวันนี้
          </p>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ชื่อบริษัทที่ไปวันนี้..."
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
            style={{ borderColor: "var(--sale-line)", background: "var(--sale-surface)" }}
          />

          {error ? (
            <p
              className="mt-3 rounded-xl px-3 py-2 text-xs"
              style={{ background: "var(--sale-warn)", color: "var(--sale-warn-text)" }}
            >
              {error}
            </p>
          ) : null}

          <button
            type="button"
            disabled={starting}
            onClick={() => void startVisit(q.trim() || "ยังไม่ระบุบริษัท")}
            className="sale-btn-accent mt-3 touch-target flex w-full items-center justify-center px-4 py-3 text-sm disabled:opacity-60"
          >
            {starting
              ? "กำลังเปิดเยี่ยม…"
              : q.trim()
                ? `เริ่มเยี่ยม: ${q.trim()}`
                : "เริ่มเยี่ยม (ยังไม่ระบุบริษัท — บอกผู้ช่วยทีหลัง)"}
          </button>

          <ul className="mt-4 space-y-2">
            {filtered.map((c) => (
              <li key={c.name}>
                <button
                  type="button"
                  disabled={starting}
                  onClick={() => void startVisit(c.name)}
                  className="sale-card block w-full px-4 py-3 text-left disabled:opacity-60"
                >
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="mt-1 text-xs" style={{ color: "var(--sale-muted)" }}>
                    เยี่ยมแล้ว {c.visitCount} ครั้ง
                    {c.lastVisit ? ` · ล่าสุด ${c.lastVisit}` : ""}
                  </p>
                </button>
              </li>
            ))}
          </ul>

          {filtered.length === 0 ? (
            <p className="mt-4 text-center text-xs" style={{ color: "var(--sale-muted)" }}>
              ยังไม่มีประวัติบริษัทจากรายงานจริง — พิมพ์ชื่อด้านบนแล้วเริ่มได้เลย
            </p>
          ) : null}
        </section>

        <p className="mt-5 text-center text-xs" style={{ color: "var(--sale-muted)" }}>
          <a href={saleHref("/home")} className="underline-offset-2 hover:underline">
            กลับหน้าหลัก
          </a>
        </p>
      </div>
      <SaleBottomNav />
    </div>
  );
}
