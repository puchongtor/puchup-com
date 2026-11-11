import { SALE_BRAND } from "@/lib/sales-ai/brand";

/** ข้อความท้ายจอ — ย้ำว่าระบบเป็นของบริษัท */
export function BrandFooter({ className = "" }: { className?: string }) {
  return (
    <p
      className={`px-4 pb-2 text-center text-[10px] leading-relaxed ${className}`}
      style={{ color: "var(--sale-muted)" }}
    >
      ระบบของ {SALE_BRAND.legalName}
      <br />
      {SALE_BRAND.appName} · สำหรับทีมขายภายในเท่านั้น
    </p>
  );
}
