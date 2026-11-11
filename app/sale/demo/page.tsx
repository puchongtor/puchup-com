import Link from "next/link";
import { YourCompanyMark } from "@/components/saledesk/YourCompanyMark";
import { saleDesk } from "@/lib/saledesk";

export const dynamic = "force-static";

export default function SaleDemoChooserPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5" style={{ background: "#eef2f6" }}>
      <YourCompanyMark size={44} />
      <h1 className="mt-6 text-xl font-semibold" style={{ color: "#0d182c" }}>
        เลือกมุมมองเดโม
      </h1>
      <p className="mt-2 max-w-sm text-center text-sm text-muted">
        ข้อมูลจำลอง · แบรนด์ Your Company
      </p>
      <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
        <Link
          href={saleDesk.demoSalePath}
          className="rounded-2xl bg-navy px-4 py-3.5 text-center text-sm font-semibold text-base"
        >
          หน้า Sale
        </Link>
        <Link
          href={saleDesk.demoManagerPath}
          className="rounded-2xl border border-cream bg-white px-4 py-3.5 text-center text-sm font-semibold text-navy"
        >
          หน้า Manager
        </Link>
        <Link
          href={saleDesk.urlPath}
          className="pt-2 text-center text-xs font-medium text-muted underline"
        >
          กลับหน้าขาย SaleDesk
        </Link>
      </div>
    </div>
  );
}
