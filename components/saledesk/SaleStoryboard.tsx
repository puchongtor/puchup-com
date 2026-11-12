"use client";

import { useState } from "react";
import { DemoCtaCard } from "@/components/saledesk/DemoShell";

const STEPS = [
  {
    id: "day",
    label: "1 · เริ่มวัน",
    title: "วันนี้มี 3 เยี่ยม",
    body: "เซลล์เปิดแผนวัน — เห็นลูกค้าที่ต้องไป พร้อมโน้ตสั้นจากเมื่อวาน",
  },
  {
    id: "visit",
    label: "2 · เลือกเยี่ยม",
    title: "บจก. นอร์ธสตาร์ แมชชีนเนอรี",
    body: "กดเข้าเยี่ยม — ระบบเปิดสมุดงานหน้างาน ไม่ต้องเปิด CRM หลายจอ",
  },
  {
    id: "ai",
    label: "3 · เลขา AI",
    title: "เลขาช่วยจดและถามสิ่งที่ขาด",
    body: "พิมพ์หรือพูดภาษาคน — เลขาจัดเป็นสรุป มีหลักฐานใครคุยเรื่องอะไร",
  },
  {
    id: "report",
    label: "4 · ยืนยันรายงาน",
    title: "ส่งรายงานมีหลักฐาน",
    body: "ตรวจสรุปก่อนส่ง — ผู้จัดการเห็นงานค้างจากรายงานนี้ทันที",
  },
] as const;

const CHAT = [
  { who: "คุณ", text: "คุยเรื่องอะไหล่ไฮดรอลิก ลูกค้าขอใบเสนอราคาภายในศุกร์" },
  { who: "เลขา AI", text: "รับทราบ — จดเป็นโอกาสขาย + กำหนดติดตามวันศุกร์แล้ว ต้องการให้ถามสต็อกด้วยไหม?" },
  { who: "คุณ", text: "ถามด้วย แล้วสรุปรายงานให้หน่อย" },
  {
    who: "เลขา AI",
    text: "สรุปพร้อมแล้ว: เยี่ยม นอร์ธสตาร์ · โอกาสไฮดรอลิก · ติดตามศุกร์ · ถามสต็อก — กดยืนยันเพื่อส่งผู้จัดการ",
  },
] as const;

export function SaleStoryboard() {
  const [step, setStep] = useState(0);
  const [chatVisible, setChatVisible] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const current = STEPS[step];

  function next() {
    if (step === 2 && chatVisible < CHAT.length) {
      setChatVisible((n) => Math.min(n + 1, CHAT.length));
      return;
    }
    if (step < STEPS.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      if (nextStep === 2) setChatVisible(1);
      if (nextStep === 3) setConfirmed(false);
    }
  }

  return (
    <div>
      <p className="text-[14px] leading-relaxed text-[#5c5b58]">
        คลิกไปทีละขั้น — จำลองมุมเซลล์ภาคสนาม ไม่ใช่ระบบจริง ไม่บันทึกข้อมูล
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setStep(i);
              setChatVisible(i >= 2 ? (i === 2 ? 1 : CHAT.length) : 0);
              setConfirmed(false);
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
          <ul className="mt-5 space-y-2">
            {["นอร์ธสตาร์ แมชชีนเนอรี · 10:30", "โพลีเทค แพ็กเกจจิ้ง · 13:00", "เอเชีย มอเตอร์ พาร์ทส์ · 15:30"].map(
              (row) => (
                <li
                  key={row}
                  className="rounded-xl border border-[#1b1c1e]/8 bg-[#f5f4f2]/80 px-4 py-3 text-[13px] font-medium"
                >
                  {row}
                </li>
              ),
            )}
          </ul>
        ) : null}

        {step === 1 ? (
          <div className="mt-5 rounded-xl border border-[#1b1c1e]/8 bg-[#f5f4f2]/80 p-4">
            <p className="text-[12px] font-semibold text-[#6f634c]">บัญชีลูกค้า</p>
            <p className="mt-1 text-[15px] font-semibold">บจก. นอร์ธสตาร์ แมชชีนเนอรี</p>
            <p className="mt-1 text-[13px] text-[#6b6a67]">โชคชัย 4 · ติดตามใบเสนอราคาไฮดรอลิก</p>
          </div>
        ) : null}

        {step >= 2 ? (
          <div className="mt-5 space-y-3">
            {CHAT.slice(0, step === 2 ? chatVisible : CHAT.length).map((m, i) => (
              <div
                key={`${m.who}-${i}`}
                className={`rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                  m.who === "คุณ"
                    ? "ml-8 bg-[#1b1c1e] text-[#f5f4f2]"
                    : "mr-8 border border-[#1b1c1e]/8 bg-[#f5f4f2]"
                }`}
              >
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] opacity-60">
                  {m.who}
                </p>
                {m.text}
              </div>
            ))}
          </div>
        ) : null}

        {step === 3 ? (
          <div className="mt-5 rounded-xl border border-[#9a8b6e]/35 bg-[#9a8b6e]/12 p-4">
            <p className="text-[12px] font-semibold text-[#6f634c]">รายงานพร้อมส่ง</p>
            <ul className="mt-2 space-y-1 text-[13px] text-[#1b1c1e]">
              <li>· โอกาส: อะไหล่ไฮดรอลิก</li>
              <li>· ติดตาม: วันศุกร์</li>
              <li>· หลักฐาน: บทสนทนา + สรุปเลขา</li>
            </ul>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          {step < 3 ? (
            <button
              type="button"
              onClick={next}
              className="rounded-xl bg-[#1b1c1e] px-5 py-3 text-[14px] font-semibold text-[#f5f4f2] transition hover:bg-[#2a2b2e]"
            >
              {step === 2 && chatVisible < CHAT.length
                ? "ให้เลขาตอบต่อ →"
                : step === 2
                  ? "ไปยืนยันรายงาน →"
                  : "ขั้นถัดไป →"}
            </button>
          ) : confirmed ? null : (
            <button
              type="button"
              onClick={() => setConfirmed(true)}
              className="rounded-xl bg-[#9a8b6e] px-5 py-3 text-[14px] font-semibold text-[#1b1c1e] transition hover:brightness-110"
            >
              ยืนยันส่งรายงาน (จำลอง)
            </button>
          )}
        </div>
      </div>

      {step === 3 && confirmed ? (
        <DemoCtaCard headline="เซลล์ส่งรายงานได้โดยไม่ต้องกรอกฟอร์มยาว — ทีมคุณอยากแบบนี้ไหม?" />
      ) : null}
    </div>
  );
}
