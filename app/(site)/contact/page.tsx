import type { Metadata } from "next";
import { ContactAside } from "@/components/contact/ContactAside";
import { ContactChat } from "@/components/contact/ContactChat";

export const metadata: Metadata = {
  title: "Contact",
  description: "คุยกับ PuchUp ผ่านแชท AI หรือติดต่อ LINE OA @masterpuch",
};

export default function ContactPage() {
  return (
    <section className="bg-base">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 md:px-8 md:py-12 lg:px-8">
        <div className="mb-6 max-w-2xl md:mb-8">
          <p className="eyebrow text-[11px] uppercase text-aorange">Contact</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            คุยกับ PuchUp
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            แชทด้านขวา · ข้อมูลระบบและ LINE OA ด้านซ้าย
          </p>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-6">
          <ContactAside />
          <ContactChat />
        </div>
      </div>
    </section>
  );
}
