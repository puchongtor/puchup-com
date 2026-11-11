"use client";

import Link from "next/link";
import { YourCompanyMark } from "@/components/saledesk/YourCompanyMark";
import { saleDesk } from "@/lib/saledesk";

type Props = {
  active: "sale" | "manager";
  children: React.ReactNode;
};

export function DemoShell({ active, children }: Props) {
  return (
    <div className="min-h-dvh" style={{ background: "#eef2f6" }}>
      <header
        className="border-b px-4 py-3 text-white sm:px-6"
        style={{ background: "#0d182c" }}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <YourCompanyMark tone="light" size={34} />
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={saleDesk.demoSalePath}
              className="rounded-full px-3 py-1.5 text-xs font-medium"
              style={{
                background: active === "sale" ? "rgba(255,255,255,0.18)" : "transparent",
                color: active === "sale" ? "#fff" : "rgba(255,255,255,0.75)",
              }}
            >
              Sale
            </Link>
            <Link
              href={saleDesk.demoManagerPath}
              className="rounded-full px-3 py-1.5 text-xs font-medium"
              style={{
                background:
                  active === "manager" ? "rgba(255,255,255,0.18)" : "transparent",
                color: active === "manager" ? "#fff" : "rgba(255,255,255,0.75)",
              }}
            >
              Manager
            </Link>
            <Link
              href={saleDesk.urlPath}
              className="rounded-full border px-3 py-1.5 text-[11px]"
              style={{
                borderColor: "rgba(255,255,255,0.25)",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              ← หน้าขาย SaleDesk
            </Link>
          </div>
        </div>
        <p className="mx-auto mt-2 max-w-6xl text-[11px] text-white/55">
          เดโมจำลอง · ข้อมูลปลอม · แบรนด์ Your Company — ไม่ใช่ระบบลูกค้าจริง
        </p>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
