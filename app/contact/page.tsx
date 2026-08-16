"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { site } from "@/lib/site";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section className="bg-base">
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <span className="eyebrow text-[11px] uppercase text-aorange">Contact</span>
        <h1 className="mt-3 mb-4 text-4xl font-bold md:text-5xl">
          เล่าธุรกิจของคุณให้ PuchUp ฟัง
        </h1>
        <p className="mb-10 max-w-xl text-[17px] leading-relaxed text-muted">
          ไม่ต้องใช้คำศัพท์เทคนิค และไม่ต้องส่งบรีฟยาว — เล่าปัญหาธุรกิจมาได้เลย
        </p>

        <div className="mb-8 rounded-xl2 border border-cream bg-cream/50 p-5">
          <p className="mb-3 text-[14.5px] text-muted">อยากเริ่มคุยกับผู้ช่วยบนหน้าแรกก่อนก็ได้</p>
          <Link href="/#assistant" className="text-[14.5px] font-semibold text-aorange underline underline-offset-4">
            เปิด PuchUp Assistant →
          </Link>
        </div>

        {sent ? (
          <div className="rounded-xl2 border border-cream bg-cream/60 p-6 text-[15px] leading-relaxed">
            ขอบคุณครับ ทีม PuchUp จะดูข้อความของคุณและติดต่อกลับ
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5 rounded-xl2 border border-cream p-6 md:p-8">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium" htmlFor="name">
                ชื่อ *
              </label>
              <input
                id="name"
                name="name"
                required
                className="w-full rounded-xl border border-cream bg-cream/60 px-4 py-3 text-[14.5px] outline-none focus:ring-2 focus:ring-aorange/40"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium" htmlFor="business">
                ธุรกิจ
              </label>
              <input
                id="business"
                name="business"
                className="w-full rounded-xl border border-cream bg-cream/60 px-4 py-3 text-[14.5px] outline-none focus:ring-2 focus:ring-aorange/40"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium" htmlFor="need">
                สิ่งที่อยากให้ระบบช่วย
              </label>
              <textarea
                id="need"
                name="need"
                rows={4}
                className="w-full rounded-xl border border-cream bg-cream/60 px-4 py-3 text-[14.5px] outline-none focus:ring-2 focus:ring-aorange/40"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium" htmlFor="contact">
                ช่องทางติดต่อ *
              </label>
              <input
                id="contact"
                name="contact"
                required
                placeholder="อีเมล / LINE / โทร"
                className="w-full rounded-xl border border-cream bg-cream/60 px-4 py-3 text-[14.5px] outline-none focus:ring-2 focus:ring-aorange/40"
              />
            </div>
            <button
              type="submit"
              className="inline-flex rounded-full bg-navy px-5 py-3 text-[15px] font-semibold text-base"
            >
              ส่งข้อความ
            </button>
            <p className="text-[12.5px] text-muted">
              ปุ่มหลักของเว็บยังคงเป็น &quot;{site.cta.primary}&quot; — ฟอร์มนี้คือช่องทางส่งรายละเอียด
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
