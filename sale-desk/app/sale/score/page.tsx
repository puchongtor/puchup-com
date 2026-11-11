"use client";

import { saleHref } from "@/lib/sales-ai/paths";
import Link from "next/link";
import { useMemo } from "react";
import { BrandMark } from "@/components/sales-ai/BrandMark";
import { SaleBottomNav } from "@/components/sales-ai/SaleBottomNav";
import { useSaleStore } from "@/lib/sales-ai/SaleStore";
import {
  bangkokMonthKey,
  currentBangkokMonthKey,
  monthlyScoresForSale,
  scorecardForSale,
  scorecardsBySale,
  type SaleScorecard,
} from "@/lib/sales-ai/scoring";

function ScoreBars({ card }: { card: SaleScorecard }) {
  const dims = [
    ["รายละเอียดงานวันนี้", card.completeness],
    ["ติดตามงานต่อได้", card.depth],
    ["รูปภาพประกอบ (3–5 ใบ)", card.evidence],
    ["ตรงตามนัดหมาย", card.timeliness],
  ] as const;

  return (
    <div className="mt-3 space-y-2.5">
      {dims.map(([label, score]) => (
        <div key={label}>
          <div className="flex justify-between text-xs">
            <span style={{ color: "var(--sale-muted)" }}>{label}</span>
            <span className="font-semibold">{score}</span>
          </div>
          <div
            className="mt-1 h-1.5 overflow-hidden rounded-full"
            style={{ background: "var(--sale-navy-soft)" }}
          >
            <div
              className="h-full rounded-full"
              style={{ width: `${score}%`, background: "var(--sale-navy)" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SaleScorePage() {
  const { profile, reports } = useSaleStore();
  const isLeader = profile.role === "admin" || profile.role === "manager";

  const myReports = useMemo(
    () => reports.filter((r) => r.salesId === profile.id),
    [reports, profile.id],
  );

  const months = useMemo(
    () => monthlyScoresForSale(profile.id, myReports),
    [profile.id, myReports],
  );
  const thisMonth = months.find((m) => m.isCurrent) || months[0];
  const history = months.filter((m) => !m.isCurrent);

  const myCard = useMemo(() => {
    const key = currentBangkokMonthKey();
    const monthReports = myReports.filter(
      (r) => bangkokMonthKey(r.confirmedAt || r.createdAt) === key,
    );
    return scorecardForSale(
      profile.id,
      profile.nickname || profile.fullName,
      monthReports,
    );
  }, [profile, myReports]);

  const teamCards = useMemo(() => scorecardsBySale(reports), [reports]);

  if (isLeader) {
    return (
      <div className="min-h-dvh" style={{ background: "var(--sale-bg)" }}>
        <header className="px-4 py-5 text-white sm:px-6" style={{ background: "var(--sale-navy)" }}>
          <div className="mx-auto max-w-6xl">
            <BrandMark tone="dark" size="sm" showProduct={false} />
            <h1 className="mt-3 text-lg font-semibold">คะแนนแยกตาม Sale</h1>
            <p className="text-xs text-white/70">
              รายละเอียดงานวันนี้ · ติดตามงานต่อได้ · รูป 3–5 ใบ · ตรงตามนัดหมาย
            </p>
          </div>
        </header>

        <main className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
          {teamCards.map((card) => (
            <section
              key={card.salesId}
              className="rounded-2xl border bg-white/90 p-4 shadow-sm"
              style={{ borderColor: "var(--sale-line)" }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--sale-navy)" }}>
                    {card.salesName}
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--sale-muted)" }}>
                    ยืนยัน {card.confirmedCount}/{card.reportCount} รายงาน
                  </p>
                </div>
                <p className="text-2xl font-bold tabular-nums" style={{ color: "var(--sale-navy)" }}>
                  {card.total}
                </p>
              </div>
              <ScoreBars card={card} />
              <p
                className="mt-3 rounded-xl px-3 py-2 text-[11px] leading-relaxed"
                style={{ background: "var(--sale-bg)" }}
              >
                <strong>คำแนะนำ:</strong> {card.feedback}
              </p>
              {profile.role === "admin" ? (
                <Link
                  href={saleHref(`/admin/sales/${card.salesId}`)}
                  className="mt-3 inline-block text-xs font-medium"
                  style={{ color: "var(--sale-navy)" }}
                >
                  ดูการเคลื่อนไหว →
                </Link>
              ) : (
                <Link
                  href={saleHref("/manager")}
                  className="mt-3 inline-block text-xs font-medium"
                  style={{ color: "var(--sale-navy)" }}
                >
                  ดูรายงานตามบริษัท →
                </Link>
              )}
            </section>
          ))}
          {teamCards.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--sale-muted)" }}>
              ยังไม่มีรายงานให้คะแนน
            </p>
          ) : null}
        </main>

        <p className="pb-8 text-center text-xs" style={{ color: "var(--sale-muted)" }}>
          <Link href={profile.role === "admin" ? saleHref("/admin") : saleHref("/manager")}>
            ← กลับ
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col pb-24">
      <header className="px-5 pb-4 pt-6 text-white" style={{ background: "var(--sale-navy)" }}>
        <BrandMark tone="dark" size="sm" />
        <h1 className="mt-3 text-lg font-semibold">คะแนนของฉัน</h1>
        <p className="text-xs text-white/75">
          รวมรายเดือน · รีเซ็ตทุกเดือน · ย้อนดูประวัติได้ · เห็นเฉพาะคุณ
        </p>
      </header>

      <div className="px-4 py-4">
        <section className="sale-card p-5 text-center">
          <p className="text-xs" style={{ color: "var(--sale-muted)" }}>
            คะแนนรวม {thisMonth?.label || "เดือนนี้"}
          </p>
          <p className="mt-2 text-5xl font-bold tabular-nums" style={{ color: "var(--sale-navy)" }}>
            {thisMonth?.totalPoints ?? 0}
          </p>
          <p className="mt-2 text-[11px]" style={{ color: "var(--sale-muted)" }}>
            เฉลี่ยคุณภาพ {thisMonth?.average ?? 0} · ยืนยันแล้ว{" "}
            {thisMonth?.confirmedCount ?? 0}/{thisMonth?.visitCount ?? 0} ฉบับ
          </p>
        </section>

        <section className="sale-card mt-3 p-4">
          <p className="text-sm font-semibold">คุณภาพเดือนนี้</p>
          <ScoreBars card={myCard} />
        </section>

        <p
          className="mt-3 rounded-xl px-4 py-3 text-sm leading-relaxed"
          style={{ background: "var(--sale-navy-soft)" }}
        >
          <strong>คำแนะนำ:</strong> {thisMonth?.feedback || myCard.feedback}
        </p>

        <section className="sale-card mt-3 p-4">
          <p className="text-sm font-semibold">ประวัติรายเดือน</p>
          <p className="mt-1 text-[11px]" style={{ color: "var(--sale-muted)" }}>
            เดือนที่แล้วถูกเก็บไว้ให้ย้อนดู — ไม่ปนกับคนอื่น
          </p>
          {history.length === 0 ? (
            <p className="mt-3 text-xs" style={{ color: "var(--sale-muted)" }}>
              ยังไม่มีเดือนเก่า — พอขึ้นเดือนใหม่ คะแนนเดือนนี้จะย้ายมาโชว์ตรงนี้
            </p>
          ) : (
            <ul className="mt-3 divide-y" style={{ borderColor: "var(--sale-line)" }}>
              {history.map((row) => (
                <li
                  key={row.monthKey}
                  className="flex items-center justify-between gap-3 py-2.5 first:pt-0"
                  style={{ borderColor: "var(--sale-line)" }}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{row.label}</p>
                    <p className="text-[11px]" style={{ color: "var(--sale-muted)" }}>
                      ยืนยัน {row.confirmedCount} ครั้ง · เฉลี่ย {row.average}
                    </p>
                  </div>
                  <p
                    className="text-lg font-bold tabular-nums"
                    style={{ color: "var(--sale-navy)" }}
                  >
                    {row.totalPoints}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="mt-4 text-center text-xs" style={{ color: "var(--sale-muted)" }}>
          <Link href={saleHref("/home")}>กลับหน้าหลัก</Link>
        </p>
      </div>
      <SaleBottomNav />
    </div>
  );
}
