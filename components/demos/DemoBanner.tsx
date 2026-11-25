import Link from "next/link";
import { LINE_OA_ID, LINE_OA_URL } from "@/lib/puchup-knowledge";

export function DemoBanner({ background = "#112a2b" }: { background?: string }) {
  return (
    <aside role="note" className="sticky top-0 z-[100] shrink-0 text-[#fffdf7]" style={{ backgroundColor: background }}>
      <div className="flex min-h-[52px] flex-wrap items-center justify-between gap-x-5 gap-y-1 px-4 py-2 sm:px-6 lg:px-8">
        <strong className="text-[1.08rem] font-bold leading-tight text-[#fff0d7] sm:text-[1.18rem]">เว็บไซต์ตัวอย่าง</strong>
        <nav aria-label="ช่องทางของ PuchUp" className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-xs leading-snug sm:ml-auto sm:justify-end sm:gap-x-6 sm:text-sm">
          <Link href="/" className="hover:underline">เว็บหลัก</Link>
          <Link href="/ProjectONE/" className="hover:underline">Project ONE</Link>
          <a href={LINE_OA_URL} aria-label={`สนใจติดต่อทำเว็บทาง LINE ${LINE_OA_ID}`} className="whitespace-nowrap hover:underline">สนใจติดต่อ LINE {LINE_OA_ID}</a>
          <a href="tel:+66880899895" className="whitespace-nowrap hover:underline">088-089-9895</a>
        </nav>
      </div>
    </aside>
  );
}
