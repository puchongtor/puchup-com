"use client";

import Link from "next/link";
import { DemoShell } from "@/components/saledesk/DemoShell";
import { mockAlerts, mockSaleChat, saleDesk } from "@/lib/saledesk";

export default function MockSalePage() {
  return (
    <DemoShell active="sale">
      <div className="mx-auto max-w-md space-y-4">
        <section
          className="overflow-hidden rounded-2xl border bg-white shadow-sm"
          style={{ borderColor: "#dbe3ee" }}
        >
          <div
            className="flex items-center gap-2.5 border-b px-3 py-2.5"
            style={{
              borderColor: "#003478",
              background: "color-mix(in srgb, #003478 8%, white)",
            }}
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: "#003478" }}
            >
              น
            </span>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#0d182c" }}>
                คุยกับนารา
              </p>
              <p className="text-[11px] text-muted">ผู้ช่วย · อบอุ่น เป็นกันเอง</p>
            </div>
          </div>
          <div className="space-y-2.5 px-3 py-3" style={{ background: "#f5f7fa" }}>
            {mockSaleChat.map((t, i) => {
              const mine = t.role === "user";
              return (
                <div
                  key={`${t.role}-${i}`}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <p
                    className="max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed"
                    style={{
                      background: mine ? "#0d182c" : "#fff",
                      color: mine ? "#fff" : "#172033",
                      border: mine ? "none" : "1px solid #dbe3ee",
                    }}
                  >
                    {t.text}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="border-t px-3 py-3" style={{ borderColor: "#e2e8f0" }}>
            <p
              className="rounded-xl border px-3 py-2 text-sm text-muted"
              style={{ borderColor: "#e2e8f0", background: "#fff" }}
            >
              วางแผนวันนี้ หรือคุยกับเลขา…
            </p>
            <button
              type="button"
              disabled
              className="mt-2 w-full rounded-xl py-2.5 text-sm font-semibold text-white opacity-60"
              style={{ background: "#0d182c" }}
            >
              ส่ง (เดโม — ไม่ส่งจริง)
            </button>
          </div>
        </section>

        <Link
          href={saleDesk.demoManagerPath}
          className="flex w-full items-center justify-center rounded-2xl py-3.5 text-[15px] font-semibold text-white"
          style={{ background: "#0d182c" }}
        >
          เริ่มเยี่ยมลูกค้า (เดโม)
        </Link>

        <section className="rounded-2xl border bg-white p-4" style={{ borderColor: "#dbe3ee" }}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold" style={{ color: "#0d182c" }}>
              ผู้จัดการส่งให้ติดตาม
            </p>
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
              style={{ background: "#e8eef6", color: "#0d182c" }}
            >
              {mockAlerts.length} รายการ
            </span>
          </div>
          <ul className="mt-3 space-y-2">
            {mockAlerts.map((a) => (
              <li
                key={a.id}
                className="rounded-xl border px-3 py-2.5"
                style={{ borderColor: "#e2e8f0" }}
              >
                <p className="text-sm font-medium">{a.company}</p>
                <p className="mt-0.5 text-[11px] text-muted">{a.who}</p>
                <p className="mt-1 text-xs" style={{ color: "#172033" }}>
                  {a.title}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-center text-[11px] text-muted">
          เดโม SaleDesk · Your Company · ไม่เชื่อมฐานข้อมูลจริง
        </p>
      </div>
    </DemoShell>
  );
}
