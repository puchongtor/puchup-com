import Link from "next/link";
import { DemoShell } from "@/components/saledesk/DemoShell";
import { saleDesk } from "@/lib/saledesk";

export const dynamic = "force-static";

/**
 * Interactive preview hub — no live login, no credentials, no production app links.
 */
export default function SaleDemoHubPage() {
  return (
    <DemoShell role="hub" title="ลองความรู้สึก SaleDesk สองมุมมอง">
      <p className="max-w-lg text-[15px] leading-[1.75] text-[#5c5b58]">
        ตัวอย่างเชิงโต้ตอบขององค์กร Meridian Parts — คลิกดูมุมเซลล์และมุมผู้จัดการ
        ว่าทำไมทีมถึงรู้สึกว่าจำเป็น ไม่เปิดระบบจริงให้ทดลองหรือก๊อบไปใช้
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/sale/demo/sale/"
          className="group rounded-2xl border border-[#1b1c1e]/10 bg-white/80 p-6 shadow-[0_1px_2px_rgba(27,28,30,0.04)] transition hover:border-[#9a8b6e]/50 hover:bg-white"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a8b6e]">
            มุมเซลล์
          </p>
          <p className="mt-2 text-[18px] font-semibold tracking-[-0.02em]">เยี่ยม · เลขา AI · รายงาน</p>
          <p className="mt-2 text-[13px] leading-relaxed text-[#6b6a67]">
            จำลองวันภาคสนามจนส่งรายงานมีหลักฐาน
          </p>
          <p className="mt-4 text-[13px] font-semibold text-[#1b1c1e] group-hover:text-[#6f634c]">
            เปิดตัวอย่าง →
          </p>
        </Link>

        <Link
          href="/sale/demo/manager/"
          className="group rounded-2xl border border-[#1b1c1e]/10 bg-white/80 p-6 shadow-[0_1px_2px_rgba(27,28,30,0.04)] transition hover:border-[#9a8b6e]/50 hover:bg-white"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a8b6e]">
            มุมผู้จัดการ
          </p>
          <p className="mt-2 text-[18px] font-semibold tracking-[-0.02em]">งานค้าง · หลักฐาน · มอบหมาย</p>
          <p className="mt-2 text-[13px] leading-relaxed text-[#6b6a67]">
            จำลองการเห็นสนามและสั่งงานต่อโดยไม่ไล่ถาม
          </p>
          <p className="mt-4 text-[13px] font-semibold text-[#1b1c1e] group-hover:text-[#6f634c]">
            เปิดตัวอย่าง →
          </p>
        </Link>
      </div>

      <div className="mt-8 rounded-2xl border border-[#1b1c1e]/8 bg-white/60 px-5 py-4 text-[13px] leading-relaxed text-[#6b6a67]">
        อยากให้ทีมคุณใช้ของจริง —{" "}
        <Link href="/contact/" className="font-semibold text-[#1b1c1e] underline-offset-2 hover:underline">
          คุยกับ PuchUp
        </Link>{" "}
        ไม่เปิดบัญชีทดลองสาธารณะ
      </div>

      <p className="mt-6 text-[12px] text-[#6b6a67]">
        ครอบคลุมแนวคิด: เยี่ยมลูกค้า · เลขา AI · รายงานมีหลักฐาน · งานค้างผู้จัดการ · มอบหมายติดตาม
        · ตัวอย่างองค์กร {saleDesk.sampleCompany}
      </p>
    </DemoShell>
  );
}
