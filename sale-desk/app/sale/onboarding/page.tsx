"use client";

import { saleHref } from "@/lib/sales-ai/paths";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/sales-ai/BrandMark";
import { SALE_BRAND } from "@/lib/sales-ai/brand";
import { useSaleStore } from "@/lib/sales-ai/SaleStore";

export default function SaleOnboardingPage() {
  const { consent, setConsent, profile } = useSaleStore();
  const [accepted, setAccepted] = useState(true);
  const [pinLen, setPinLen] = useState(3);

  useEffect(() => {
    setAccepted(consent || true);
  }, [consent]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col">
      <header className="px-5 pb-6 pt-8 text-white" style={{ background: "var(--sale-navy)" }}>
        <BrandMark tone="dark" size="lg" showProduct={false} />
        <h1 className="mt-5 text-xl font-semibold">ยินดีต้อนรับสู่ทีมขาย</h1>
        <p className="mt-1 text-xs text-white/75">
          {profile.nickname || profile.fullName} · {SALE_BRAND.productName}
        </p>
      </header>

      <div className="flex flex-1 flex-col gap-3 px-4 py-4">
        <article className="sale-card p-4">
          <span className="sale-chip text-white" style={{ background: "var(--sale-ok-text)" }}>
            ขั้น 1
          </span>
          <h2 className="mt-2 text-sm font-semibold">ยอมรับการใช้ข้อมูล</h2>
          <p className="mt-1.5 text-xs leading-relaxed" style={{ color: "var(--sale-muted)" }}>
            ระบบของ {SALE_BRAND.legalName} จะบันทึกเสียงและรูปที่คุณส่ง
            เพื่อทำรายงานการเยี่ยม — ผู้บริหารเห็นเฉพาะรายงานที่ยืนยันแล้ว
          </p>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="h-4 w-4 accent-[#003478]"
            />
            ฉันรับทราบและยอมรับ
          </label>
        </article>

        <article className="sale-card p-4">
          <span
            className="sale-chip"
            style={{ background: "var(--sale-accent-soft)", color: "var(--sale-accent-text)" }}
          >
            ขั้น 2
          </span>
          <h2 className="mt-2 text-sm font-semibold">กรอกโปรไฟล์พนักงาน</h2>
          <p className="mt-1.5 text-xs leading-relaxed" style={{ color: "var(--sale-muted)" }}>
            อัปรูป ชื่อ เบอร์ ตำแหน่ง ในฐานะพนักงาน {SALE_BRAND.name}
          </p>
          <Link
            href={saleHref("/profile")}
            className="sale-btn-ghost mt-3 inline-flex touch-target items-center justify-center px-4 text-sm"
          >
            ไปตั้งโปรไฟล์
          </Link>
        </article>

        <article className="sale-card p-4">
          <span
            className="sale-chip"
            style={{ background: "var(--sale-navy-soft)", color: "var(--sale-navy)" }}
          >
            ขั้น 3
          </span>
          <h2 className="mt-2 text-sm font-semibold">ติดตั้งลงหน้าจอโฮม</h2>
          <p className="mt-1.5 text-xs" style={{ color: "var(--sale-muted)" }}>
            ไอคอนจะแสดงเป็น «{SALE_BRAND.shortAppName}»
          </p>
          <ol
            className="mt-2 list-decimal space-y-1 pl-4 text-xs leading-relaxed"
            style={{ color: "var(--sale-muted)" }}
          >
            <li>ใน Safari แตะปุ่มแชร์</li>
            <li>เลือก เพิ่มไปที่หน้าจอโฮม</li>
            <li>เปิดจากไอคอนบนหน้าจอครั้งถัดไป</li>
          </ol>
        </article>

        <article className="sale-card p-4">
          <span className="sale-chip text-white" style={{ background: "var(--sale-navy)" }}>
            ขั้น 4
          </span>
          <h2 className="mt-2 text-sm font-semibold">ตั้ง PIN เปิดแอป</h2>
          <div className="mt-3 flex justify-center gap-2.5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPinLen(i + 1)}
                className="h-3 w-3 rounded-full"
                style={{
                  background: i < pinLen ? "var(--sale-navy)" : "transparent",
                  border: "2px solid var(--sale-navy)",
                }}
                aria-label={`PIN ${i + 1}`}
              />
            ))}
          </div>
        </article>
      </div>

      <div className="px-4 pb-8">
        <Link
          href={saleHref("/home")}
          onClick={() => {
            if (accepted) setConsent(true);
          }}
          className={`sale-btn-accent flex touch-target items-center justify-center text-[15px] ${
            accepted ? "" : "pointer-events-none opacity-40"
          }`}
        >
          เริ่มใช้งาน {SALE_BRAND.appName}
        </Link>
        <p className="mt-3 text-center text-[10px]" style={{ color: "var(--sale-muted)" }}>
          {SALE_BRAND.legalName}
        </p>
      </div>
    </div>
  );
}
