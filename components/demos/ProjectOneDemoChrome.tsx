import Link from "next/link";

type Props = {
  businessType?: string;
  children: React.ReactNode;
};

/**
 * Sticky demo notice above ThemeDocument iframe — always visible
 * so visitors never mistake the sample for a real shop.
 */
export function ProjectOneDemoChrome({ businessType, children }: Props) {
  const label = businessType || "ร้าน/ธุรกิจ";

  return (
    <div className="flex h-dvh flex-col bg-[#0c1222]">
      <aside
        role="note"
        className="sticky top-0 z-[100] shrink-0 border-b border-white/15 bg-[#0c1222] px-4 py-3.5 text-center shadow-[0_10px_28px_rgba(0,0,0,0.28)] sm:py-4"
      >
        <p className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-2 gap-y-1 font-mono text-[11px] leading-relaxed tracking-[0.02em] text-[#f5f4f2] sm:text-[12px]">
          <strong className="font-bold tracking-[0.08em] text-white">
            <Link href="/" className="hover:text-[#f0c674]">
              PUCHUP
            </Link>{" "}
            <Link href="/ProjectONE/" className="hover:text-[#f0c674]">
              PROJECT ONE
            </Link>{" "}
            — DEMO
          </strong>
          <span className="text-white/75">
            · เว็บไซต์ตัวอย่างเพื่อสาธิต ไม่ใช่{label}จริง ·
          </span>
          <Link
            href="/ProjectONE/demo/"
            className="font-bold text-[#f0c674] underline underline-offset-2 hover:text-[#ffd98a]"
          >
            ดูตัวอย่างธุรกิจอื่น →
          </Link>
        </p>
      </aside>
      <div className="relative min-h-0 flex-1 bg-[#FCFAF5]">
        <div className="absolute inset-0">{children}</div>
      </div>
    </div>
  );
}
