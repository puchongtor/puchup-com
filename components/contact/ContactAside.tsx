import Image from "next/image";
import Link from "next/link";
import { brandAssets } from "@/components/Logo";
import { catalogProducts, site } from "@/lib/site";
import { LINE_OA_ID, LINE_OA_URL } from "@/lib/puchup-knowledge";
import { realWorks } from "@/lib/works";

const highlights = [
  {
    title: "AI เรียนรู้จากเว็บทั้งไซต์",
    body: "ตอบแบบประชาสัมพันธ์ — รู้จักสินค้า ราคา และจุดขาย",
  },
  {
    title: "เก็บลีดเข้าหลังบ้าน",
    body: "บันทึกบทสนทนา แจ้งทีมเมื่อลูกค้าพร้อมคุยต่อ",
  },
  {
    title: "ส่งต่อ LINE OA",
    body: `คุยคนจริงได้ที่ ${LINE_OA_ID}`,
  },
] as const;

export function ContactAside() {
  return (
    <aside className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white/90 text-ink shadow-sm backdrop-blur-md">
      <div className="border-b border-cream bg-cream/40 px-5 py-5 md:px-6">
        <Image
          src={brandAssets.horizontalLight}
          alt="PuchUp"
          width={220}
          height={68}
          className="h-9 w-auto object-contain object-left"
        />
        <p className="mt-4 text-[16px] font-semibold leading-snug text-ink">{site.tagline}</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
          ระบบช่วยธุรกิจหาลูกค้า ปิดการขาย และทำงานได้เร็วขึ้น
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-5 px-5 py-5 md:px-6">
        <div className="space-y-3">
          {highlights.map((item) => (
            <div key={item.title} className="flex gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-apurple to-aamber" />
              <div>
                <p className="text-[13.5px] font-semibold text-ink">{item.title}</p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <p className="eyebrow text-[10px] uppercase text-apurple">Products</p>
          <ul className="mt-2 space-y-0.5">
            {catalogProducts.slice(0, 4).map((p) => (
              <li key={p.id}>
                <Link
                  href={p.href}
                  className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-[13px] text-ink/80 transition hover:bg-cream/70 hover:text-ink"
                >
                  <span>{p.name}</span>
                  <span className="text-[11px] text-muted">{p.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-[10px] uppercase text-apurple">Live works</p>
          <div className="mt-2 flex gap-2">
            {realWorks.slice(0, 3).map((w) => (
              <a
                key={w.id}
                href={w.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-11 flex-1 overflow-hidden rounded-lg border border-slate-200/70"
                title={w.name}
              >
                <Image src={w.image} alt={w.name} fill className="object-cover object-top" sizes="100px" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-auto space-y-2.5 border-t border-cream pt-4">
          <a
            href={`mailto:${site.email}`}
            className="block text-[13px] text-muted transition hover:text-ink"
          >
            {site.email}
          </a>
          <a
            href={LINE_OA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#06C755] px-4 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            LINE OA {LINE_OA_ID}
          </a>
        </div>
      </div>
    </aside>
  );
}
