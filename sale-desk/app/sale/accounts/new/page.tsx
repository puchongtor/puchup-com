"use client";

import { useEffect } from "react";
import { saleNavPath } from "@/lib/sales-ai/paths";

/** ฟอร์มเพิ่มรวมอยู่ในแท็บเพิ่มฐานข้อมูลลูกค้าแล้ว */
export default function NewOpenAccountRedirectPage() {
  useEffect(() => {
    window.location.replace(saleNavPath("/manager?tab=leads"));
  }, []);

  return (
    <div
      className="flex min-h-dvh items-center justify-center text-sm"
      style={{ color: "var(--sale-muted)", background: "#eef2f6" }}
    >
      กำลังเปิดแท็บเพิ่มฐานข้อมูลลูกค้า…
    </div>
  );
}
