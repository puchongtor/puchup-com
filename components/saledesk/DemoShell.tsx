import Link from "next/link";
import { saleDesk } from "@/lib/saledesk";
import { LINE_OA_ID, LINE_OA_URL } from "@/lib/puchup-knowledge";

type Props = {
  role: "sale" | "manager" | "hub";
  title: string;
  children: React.ReactNode;
};

const roleLabel = {
  hub: "เลือกมุมมอง",
  sale: "มุมเซลล์",
  manager: "มุมผู้จัดการ",
} as const;

export function DemoShell({ role, title, children }: Props) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#f5f4f2] text-[#1b1c1e]">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.55]"
          style={{
            background:
              "radial-gradient(900px 480px at 12% -8%, rgba(154,139,110,0.18), transparent 58%), radial-gradient(700px 420px at 92% 8%, rgba(27,28,30,0.06), transparent 55%), linear-gradient(180deg, #faf9f7 0%, #f5f4f2 45%, #eceae6 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-3xl flex-col px-5 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1b1c1e] text-[14px] font-semibold tracking-wide text-[#e8e2d6]">
              M
            </span>
            <div>
              <p className="text-[15px] font-semibold tracking-[-0.02em]">Meridian Parts</p>
              <p className="text-[11px] tracking-[0.04em] text-[#6b6a67]">
                SaleDesk · ตัวอย่างเชิงโต้ตอบ · {roleLabel[role]}
              </p>
            </div>
          </div>
          <span className="rounded-full border border-[#1b1c1e]/12 bg-white/70 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-[#6f634c] backdrop-blur-sm">
            PREVIEW
          </span>
        </header>

        <h1 className="mt-10 font-[family-name:var(--font-display,ui-serif)] text-[1.85rem] font-semibold leading-[1.15] tracking-[-0.03em] sm:text-[2.25rem]">
          {title}
        </h1>

        <div className="mt-6 flex-1">{children}</div>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#1b1c1e]/8 pt-6 text-[12px] text-[#6b6a67]">
          <div className="flex flex-wrap gap-4">
            {role !== "hub" ? (
              <Link href={saleDesk.demoPath} className="transition hover:text-[#1b1c1e]">
                ← เลือกมุมมองอื่น
              </Link>
            ) : (
              <Link href={saleDesk.urlPath} className="transition hover:text-[#1b1c1e]">
                ← กลับหน้าขาย SaleDesk
              </Link>
            )}
            <Link href="/contact/" className="transition hover:text-[#1b1c1e]">
              คุยกับ PuchUp
            </Link>
            <a
              href={LINE_OA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-[#1b1c1e]"
            >
              LINE {LINE_OA_ID}
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function DemoCtaCard({ headline }: { headline?: string }) {
  return (
    <div className="mt-8 rounded-2xl border border-[#1b1c1e]/10 bg-[#1b1c1e] p-6 text-[#f5f4f2] shadow-[0_12px_40px_rgba(27,28,30,0.18)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a8b6e]">
        ขั้นถัดไป
      </p>
      <p className="mt-2 text-[17px] font-semibold leading-snug tracking-[-0.02em]">
        {headline || "อยากให้ทีมคุณใช้แบบนี้?"}
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-white/65">
        เดโมนี้เป็นตัวอย่างเชิงโต้ตอบ — ไม่เปิดระบบจริงให้ทดลองเอง
        คุยกับ PuchUp เพื่อออกแบบให้ตรงทีมคุณ
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/contact/"
          className="inline-flex rounded-xl bg-[#9a8b6e] px-5 py-3 text-[14px] font-semibold text-[#1b1c1e] transition hover:brightness-110"
        >
          คุยกับ PuchUp
        </Link>
        <a
          href={LINE_OA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-xl border border-white/20 px-5 py-3 text-[14px] font-semibold text-white transition hover:border-white/40"
        >
          LINE {LINE_OA_ID}
        </a>
      </div>
    </div>
  );
}
