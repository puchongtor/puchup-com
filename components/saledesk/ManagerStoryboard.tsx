"use client";

import { useState } from "react";
import { DemoCtaCard } from "@/components/saledesk/DemoShell";

const STEPS = [
  {
    id: "overview",
    label: "1 · ภาพรวม",
    title: "ทีมวันนี้ · 4 เซลล์",
    body: "ผู้จัดการเห็นสรุปจากสนาม ไม่ต้องไล่ถามในแชทกลุ่ม",
  },
  {
    id: "backlog",
    label: "2 · งานค้าง",
    title: "งานค้างจากรายงาน",
    body: "เปิดรายการที่ต้องติดตาม — มาพร้อมหลักฐานจากเซลล์",
  },
  {
    id: "evidence",
    label: "3 · หลักฐาน",
    title: "เปิดดูหลักฐานเยี่ยม",
    body: "อ่านสรุป + จุดตัดสินใจ — มอบหมายต่อได้ทันที",
  },
  {
    id: "assign",
    label: "4 · มอบหมาย",
    title: "มอบหมายติดตาม",
    body: "ส่งงานกลับให้เซลล์พร้อมกำหนดวัน — ครบวงจรในที่เดียว",
  },
] as const;

const ALERTS = [
  {
    id: "a1",
    title: "นอร์ธสตาร์ · ใบเสนอราคาไฮดรอลิก",
    meta: "จากคุณต้น · ติดตามศุกร์",
    evidence: "ลูกค้าขอราคาภายในศุกร์ · ถามสต็อก · โอกาสเปิดแล้วในรายงานเยี่ยม",
  },
  {
    id: "a2",
    title: "โพลีเทค · นัดซ่อมปั๊ม",
    meta: "จากคุณมิ้นท์ · ค้าง 2 วัน",
    evidence: "นัดช่างยังไม่ยืนยัน · ลูกค้าถามสถานะในไลน์",
  },
  {
    id: "a3",
    title: "เอเชีย มอเตอร์ · ต่อสัญญาดูแล",
    meta: "จากคุณเก่ง · ครบกำหนดเดือนนี้",
    evidence: "สัญญาบริการใกล้หมด · เซลล์บันทึกว่าลูกค้าสนใจต่อ",
  },
] as const;

export function ManagerStoryboard() {
  const [step, setStep] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const [assigned, setAssigned] = useState(false);
  const current = STEPS[step];

  return (
    <div>
      <p className="text-[14px] leading-relaxed text-[#5c5b58]">
        คลิกไปทีละขั้น — จำลองมุมผู้จัดการที่เห็นงานค้างจากสนาม ไม่ใช่ระบบจริง
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setStep(i);
              if (i < 2) setOpenId(null);
              if (i < 3) setAssigned(false);
            }}
            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide transition ${
              i === step
                ? "bg-[#1b1c1e] text-[#f5f4f2]"
                : i < step
                  ? "bg-[#9a8b6e]/25 text-[#6f634c]"
                  : "border border-[#1b1c1e]/10 bg-white/60 text-[#6b6a67]"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-[#1b1c1e]/8 bg-white/80 p-5 shadow-[0_1px_2px_rgba(27,28,30,0.04)] backdrop-blur-md sm:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a8b6e]">
          {current.label}
        </p>
        <h2 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.02em]">{current.title}</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-[#5c5b58]">{current.body}</p>

        {step === 0 ? (
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { n: "12", l: "เยี่ยมวันนี้" },
              { n: "5", l: "งานค้าง" },
              { n: "3", l: "รอมอบหมาย" },
            ].map((c) => (
              <div
                key={c.l}
                className="rounded-xl border border-[#1b1c1e]/8 bg-[#f5f4f2]/80 px-3 py-4 text-center"
              >
                <p className="text-[1.5rem] font-semibold tracking-tight">{c.n}</p>
                <p className="mt-1 text-[11px] text-[#6b6a67]">{c.l}</p>
              </div>
            ))}
          </div>
        ) : null}

        {step >= 1 ? (
          <div className="mt-5 space-y-2">
            {ALERTS.map((a) => {
              const open = openId === a.id;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    setOpenId(a.id);
                    if (step < 2) setStep(2);
                  }}
                  className={`block w-full rounded-xl border px-4 py-3 text-left transition ${
                    open
                      ? "border-[#9a8b6e]/55 bg-[#9a8b6e]/10"
                      : "border-[#1b1c1e]/8 bg-[#f5f4f2]/80 hover:border-[#9a8b6e]/40"
                  }`}
                >
                  <p className="text-[14px] font-semibold">{a.title}</p>
                  <p className="mt-0.5 text-[12px] text-[#6b6a67]">{a.meta}</p>
                  {open && step >= 2 ? (
                    <p className="mt-3 border-t border-[#1b1c1e]/8 pt-3 text-[13px] leading-relaxed text-[#1b1c1e]">
                      <span className="font-semibold text-[#6f634c]">หลักฐาน · </span>
                      {a.evidence}
                    </p>
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : null}

        {step === 3 ? (
          <div className="mt-5 rounded-xl border border-[#1b1c1e]/10 bg-[#f5f4f2] p-4">
            <p className="text-[13px] font-semibold">มอบหมายให้ คุณต้น · ติดตามวันศุกร์</p>
            <p className="mt-1 text-[12px] text-[#6b6a67]">
              ส่งพร้อมโน้ต: ยืนยันสต็อกก่อนเสนอราคา
            </p>
            {assigned ? (
              <p className="mt-3 text-[13px] font-semibold text-[#6f634c]">
                มอบหมายแล้ว (จำลอง) — เซลล์เห็นงานในแผนวัน
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setAssigned(true)}
                className="mt-4 rounded-xl bg-[#9a8b6e] px-5 py-3 text-[14px] font-semibold text-[#1b1c1e] transition hover:brightness-110"
              >
                มอบหมายติดตาม (จำลอง)
              </button>
            )}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                const next = Math.min(step + 1, 3);
                setStep(next);
                if (next >= 1 && !openId) setOpenId(ALERTS[0].id);
              }}
              className="rounded-xl bg-[#1b1c1e] px-5 py-3 text-[14px] font-semibold text-[#f5f4f2] transition hover:bg-[#2a2b2e]"
            >
              ขั้นถัดไป →
            </button>
          ) : null}
        </div>
      </div>

      {step === 3 && assigned ? (
        <DemoCtaCard headline="ผู้จัดการเห็นงานค้างจากสนามโดยไม่ต้องไล่ถาม — อยากให้ทีมคุณเป็นแบบนี้?" />
      ) : null}
    </div>
  );
}
