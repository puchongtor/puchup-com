"use client";

import { DemoShell } from "@/components/saledesk/DemoShell";
import {
  mockAlerts,
  mockLeads,
  mockManagerChat,
  mockTeamScores,
} from "@/lib/saledesk";

export default function MockManagerPage() {
  return (
    <DemoShell active="manager">
      <div className="mb-4 flex flex-wrap gap-2">
        {["ภาพรวม", "เพิ่มฐานข้อมูลลูกค้า", "แจ้งเตือน", "ทีมและคะแนน"].map(
          (label, i) => (
            <span
              key={label}
              className="rounded-full px-3 py-1.5 text-xs"
              style={{
                background: i === 1 ? "#0d182c" : "#fff",
                color: i === 1 ? "#fff" : "#0d182c",
                border: i === 1 ? "none" : "1px solid #dbe3ee",
              }}
            >
              {label}
              {label === "แจ้งเตือน" ? ` · ${mockAlerts.length}` : ""}
            </span>
          ),
        )}
      </div>

      <header className="mb-5">
        <h1 className="text-xl font-semibold" style={{ color: "#0d182c" }}>
          เพิ่มฐานข้อมูลลูกค้า
        </h1>
        <p className="mt-0.5 text-xs text-muted">
          ลูกค้าเก่า · ยังติดต่อ · งานค้าง — ผู้จัดการใส่ · แบรนด์ Your Company
        </p>
      </header>

      <div
        className="mb-5 overflow-hidden rounded-2xl border bg-white shadow-sm"
        style={{ borderColor: "#e2e8f0" }}
      >
        <div
          className="border-b px-4 py-3"
          style={{ borderColor: "#e2e8f0", background: "#e8eef6" }}
        >
          <h2 className="text-lg font-semibold" style={{ color: "#0d182c" }}>
            เพิ่มฐานข้อมูลลูกค้า
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            บันทึกในชื่อ Paiboon · เดโมจำลอง
          </p>
        </div>

        <div className="grid gap-4 p-4 lg:grid-cols-5">
          <section
            className="flex flex-col overflow-hidden rounded-2xl border lg:col-span-3"
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
                <p className="text-[11px] text-muted">เลขาจัดร่างฐานลูกค้า</p>
              </div>
            </div>
            <div
              className="max-h-64 space-y-2.5 overflow-y-auto px-3 py-3"
              style={{ background: "#f5f7fa" }}
            >
              {mockManagerChat.map((t, i) => {
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
                        border: mine ? "none" : "1px solid #003478",
                      }}
                    >
                      {t.text}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="border-t p-3" style={{ borderColor: "#e2e8f0" }}>
              <p
                className="rounded-xl border px-3 py-2 text-sm text-muted"
                style={{ borderColor: "#e2e8f0" }}
              >
                วางข้อมูลลูกค้า หรือคุยกับเลขา…
              </p>
              <button
                type="button"
                disabled
                className="mt-2 w-full rounded-xl py-2.5 text-sm font-semibold text-white opacity-60"
                style={{ background: "#0d182c" }}
              >
                ส่งให้เลขา (เดโม)
              </button>
            </div>
          </section>

          <aside
            className="rounded-2xl border bg-white p-4 lg:col-span-2"
            style={{ borderColor: "#e2e8f0" }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              ร่างที่จะบันทึก
            </p>
            {[
              ["บริษัท *", "E1234 Industrial"],
              ["ผู้ติดต่อ", "SUTEE"],
              ["เบอร์", "081-234-5678"],
              ["งานถัดไป", "ติดตามเรื่องอะไหล่เครื่องพ่นน้ำแข็งแห้ง"],
              ["มอบหมาย Sale", "Puchong"],
            ].map(([label, value]) => (
              <label key={label} className="mt-2 block text-xs text-muted">
                {label}
                <input
                  readOnly
                  value={value}
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                  style={{ borderColor: "#e2e8f0", color: "#0d182c" }}
                />
              </label>
            ))}
            <button
              type="button"
              disabled
              className="mt-4 w-full rounded-xl py-2.5 text-sm font-semibold text-white opacity-60"
              style={{ background: "#0d182c" }}
            >
              ยืนยันบันทึกฐานลูกค้า (เดโม)
            </button>
          </aside>
        </div>
      </div>

      <section className="mb-5">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold" style={{ color: "#0d182c" }}>
            ในฐานข้อมูลแล้ว · {mockLeads.length}
          </h3>
          <p className="text-[11px] text-muted">มีงานถัดไป = ขึ้นแจ้งเตือน</p>
        </div>
        <ul className="space-y-2">
          {mockLeads.map((a) => (
            <li
              key={a.id}
              className="rounded-2xl border bg-white px-4 py-3"
              style={{ borderColor: a.nextAction ? "rgba(13,24,44,0.28)" : "#e2e8f0" }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#0d182c" }}>
                    {a.company}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {a.contact} · {a.phone}
                  </p>
                </div>
                {a.nextAction ? (
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{ background: "#e8eef6", color: "#0d182c" }}
                  >
                    ติดตาม
                  </span>
                ) : null}
              </div>
              {a.nextAction ? (
                <p className="mt-1.5 text-xs" style={{ color: "#172033" }}>
                  งานถัดไป: {a.nextAction}
                </p>
              ) : null}
              <p className="mt-2 text-[11px] text-muted">
                ใส่โดย {a.addedBy} · {a.when}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "#e2e8f0" }}>
          <h3 className="text-sm font-semibold" style={{ color: "#0d182c" }}>
            แจ้งเตือน · {mockAlerts.length}
          </h3>
          <ul className="mt-3 space-y-2">
            {mockAlerts.map((a) => (
              <li
                key={a.id}
                className="rounded-xl px-3 py-2"
                style={{ background: "#fffbeb" }}
              >
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-[11px] text-muted">
                  {a.company} · {a.who}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "#e2e8f0" }}>
          <h3 className="text-sm font-semibold" style={{ color: "#0d182c" }}>
            ทีมและคะแนน (จำลอง)
          </h3>
          <ul className="mt-3 space-y-2">
            {mockTeamScores.map((s) => (
              <li
                key={s.name}
                className="flex items-center justify-between rounded-xl border px-3 py-2"
                style={{ borderColor: "#e2e8f0" }}
              >
                <span className="text-sm font-medium">{s.name}</span>
                <span className="text-xs text-muted">
                  {s.points} แต้ม · {s.visits} เยี่ยม
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </DemoShell>
  );
}
