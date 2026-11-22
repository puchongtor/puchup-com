"use client";
import { useState } from "react";

const fields = [
  { key: "business", label: "ชื่อธุรกิจหรือชื่อแบรนด์", hint: "เช่น คลินิกยิ้มดี (Yim Dee Dental)", required: true, group: "ข้อมูลพื้นฐาน" },
  { key: "contact", label: "ชื่อผู้ประสานงานและช่องทางติดต่อกลับ", hint: "เช่น คุณเอ 081-234-5678 หรือ LINE: @yimdee", required: true, group: "ข้อมูลพื้นฐาน" },
  { key: "about", label: "แนะนำธุรกิจของคุณ", hint: "เช่น คลินิกทันตกรรมย่านพระราม 3 เปิดมา 5 ปี เน้นดูแลอย่างเป็นกันเอง", group: "ข้อมูลพื้นฐาน" },
  { key: "services", label: "บริการหรือสินค้าหลัก", hint: "เช่น ขูดหินปูน อุดฟัน จัดฟัน พร้อมรายละเอียดสั้น ๆ", required: true, group: "บริการและลูกค้า" },
  { key: "audience", label: "ลูกค้าที่อยากให้เข้ามาใช้บริการ", hint: "เช่น คนทำงานและครอบครัวในย่านพระราม 3", group: "บริการและลูกค้า" },
  { key: "area", label: "พื้นที่ให้บริการ", hint: "เช่น ถนนพระราม 3 เขตยานนาวา กรุงเทพฯ หรือออนไลน์ทั่วประเทศ", group: "บริการและลูกค้า" },
  { key: "strength", label: "จุดเด่นหรือเหตุผลที่ลูกค้าควรเลือกคุณ", hint: "เช่น มีที่จอดรถ เปิดวันอาทิตย์ อธิบายขั้นตอนก่อนเริ่มบริการ", group: "บริการและลูกค้า" },
  { key: "search", label: "คำที่คิดว่าลูกค้าจะค้นหา", hint: "เช่น คลินิกทันตกรรมพระราม 3 (ไม่แน่ใจข้ามได้)", group: "บริการและลูกค้า" },
  { key: "offer", label: "ราคา โปรโมชั่น หรือข้อเสนอ", hint: "เช่น ตรวจสุขภาพช่องปากเบื้องต้นฟรี ถึงวันที่ 31 ธันวาคม", group: "เนื้อหาบนเว็บไซต์" },
  { key: "proof", label: "ผลงาน รีวิว หรือข้อมูลสร้างความน่าเชื่อถือ", hint: "เช่น ประสบการณ์ ใบรับรอง หรือรีวิวจริงที่ได้รับอนุญาต", group: "เนื้อหาบนเว็บไซต์" },
  { key: "hours", label: "เวลาเปิด–ปิด และที่อยู่", hint: "เช่น จันทร์–เสาร์ 09.00–18.00 น. พร้อมที่อยู่และจุดสังเกต", group: "เนื้อหาบนเว็บไซต์" },
  { key: "links", label: "เบอร์โทร LINE และลิงก์แผนที่สำหรับแสดงบนเว็บ", hint: "เช่น โทร 02-123-4567, LINE: @yimdee, ลิงก์ Google Maps", group: "เนื้อหาบนเว็บไซต์" },
  { key: "action", label: "อยากให้ผู้ชมทำอะไรหลังอ่านเว็บ", hint: "เช่น ทัก LINE เพื่อนัดหมาย หรือโทรสอบถามราคา", group: "เนื้อหาบนเว็บไซต์" },
  { key: "photos", label: "โลโก้ ภาพ และลิงก์ที่เกี่ยวข้อง", hint: "เช่น ลิงก์โฟลเดอร์ภาพร้าน หรือแจ้งว่าจะส่งภาพใน LINE ภายหลัง", group: "ภาพและแนวทาง" },
  { key: "style", label: "สีและบรรยากาศที่ชอบ", hint: "เช่น ขาว–ฟ้า สะอาด เป็นกันเอง หรือส่งลิงก์เว็บที่ชอบ", group: "ภาพและแนวทาง" },
  { key: "domain", label: "โดเมนเว็บไซต์", hint: "เช่น มี example.com แล้ว / ยังไม่มี ต้องการคำแนะนำ", group: "ภาพและแนวทาง" },
  { key: "notes", label: "ข้อมูลหรือคำถามเพิ่มเติม", hint: "เช่น อยากเปิดเว็บไซต์ก่อนงานเปิดร้าน", group: "ภาพและแนวทาง" },
] as const;
type Key = (typeof fields)[number]["key"];
type Answers = Record<Key, string>;
const initial = Object.fromEntries(fields.map((f) => [f.key, ""])) as Answers;
const choices = [
  { name: "อบอุ่น น่าเชื่อถือ", kind: "คลินิก · สุขภาพ", title: "ดูแลคุณด้วยความใส่ใจ", color: "#d9eeeb", accent: "#31796e" },
  { name: "ทันสมัย ชัดเจน", kind: "ธุรกิจบริการ", title: "บริการที่ช่วยให้ชีวิตง่ายขึ้น", color: "#e6e9fa", accent: "#4c57a5" },
  { name: "สดใส เป็นกันเอง", kind: "ร้านค้า · คาเฟ่", title: "เรื่องดี ๆ เริ่มต้นที่นี่", color: "#f9e7dc", accent: "#b9633d" },
];

export function StarterBrief() {
  const [answers, setAnswers] = useState<Answers>(initial);
  const [choice, setChoice] = useState(choices[0].name);
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const summary = ["สนใจแพ็กเกจเว็บไซต์เริ่มต้น 5,990 บาท", `แนวทางตัวอย่างที่ชอบ: ${choice}`, ...fields.map((f) => `${f.label}: ${answers[f.key].trim() || "ยังไม่ได้ระบุ"}`)].join("\n");
  async function copySummary() {
    try { await navigator.clipboard.writeText(summary); setCopied(true); setError(""); }
    catch { setError("คัดลอกอัตโนมัติไม่ได้ กรุณาเลือกและคัดลอกข้อความในช่องสรุป"); }
  }
  return <main className="bg-[#f7f8fc] text-[#111a34]">
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:py-20">
      <section>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7253d8]">PuchUp · เว็บไซต์เริ่มต้น</p>
        <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">เว็บไซต์ธุรกิจพร้อมใช้<br />ในงบ 5,990 บาท</h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-600">เลือกแนวทาง ส่งข้อมูล แล้วให้ PuchUp ช่วยจัดทำเว็บไซต์หน้าเดียว พร้อมปุ่มติดต่อและพื้นฐานสำหรับการค้นหา เหมาะกับธุรกิจที่อยากเริ่มต้นโดยควบคุมงบ</p>
        <div className="mt-8 rounded-3xl bg-[#111a34] p-7 text-white">
          <p className="text-sm text-indigo-200">แพ็กเกจที่กำลังเตรียมเปิดบริการ</p>
          <p className="mt-2 text-4xl font-bold">5,990 <span className="text-lg font-normal">บาท</span></p>
          <ul className="mt-6 space-y-3 text-base leading-relaxed text-slate-200">
            <li>✓ เว็บไซต์หน้าเดียว รองรับมือถือ</li><li>✓ ปุ่มติดต่อ LINE โทร และแผนที่</li><li>✓ ช่วยเรียบเรียงข้อมูลและตรวจทานโดยคน</li><li>✓ เตรียมพื้นฐาน SEO จากบริการและพื้นที่จริง</li>
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-slate-300">รายละเอียด สิ่งที่รวม ระยะเวลา และค่าใช้จ่ายต่ออายุจะแจ้งให้ชัดเจนก่อนตกลงเริ่มงาน การเตรียม SEO ไม่รับประกันอันดับหรือผลการค้นหา</p>
        </div>
        <div className="mt-6 rounded-3xl border border-indigo-100 bg-white p-6">
          <p className="text-sm font-bold text-[#7253d8]">ทำไมจึงเริ่มต้นได้ในราคา 5,990 บาท</p>
          <h2 className="mt-2 text-xl font-bold">คุณช่วยให้ข้อมูล เราช่วยทำให้เสร็จ</h2>
          <p className="mt-3 leading-relaxed text-slate-600">เราใช้แนวทางเว็บไซต์ที่เตรียมไว้ร่วมกับ AI ช่วยจัดการงาน จึงลดเวลาเริ่มต้น แต่ยังมีคนตรวจข้อมูล ปรับข้อความ และขัดเกลาก่อนส่งให้คุณตรวจ</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">เหมาะกับธุรกิจที่มีข้อมูลและรูปพร้อม ต้องการเว็บแนะนำบริการและช่องทางติดต่อ โดยเลือกจากแนวทางที่กำหนด</p>
        </div>
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold">เลือกแพ็กเกจให้ตรงกับงาน</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#f5f2ff] p-4"><p className="font-bold text-[#6443ce]">5,990 บาท · เริ่มต้น</p><p className="mt-2 text-sm leading-relaxed text-slate-700">เลือกแนวทางที่เตรียมไว้ กรอกข้อมูลด้วยตัวเอง แล้ว PuchUp จัดหน้าและขัดเกลาในกรอบของแบบ เหมาะกับคนที่ต้องการเริ่มต้นในงบจำกัด</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="font-bold">9,900 บาท · Starter Web</p><p className="mt-2 text-sm leading-relaxed text-slate-700">พูดคุยโจทย์และออกแบบการนำเสนอเฉพาะธุรกิจ เหมาะกับคนที่ต้องการโครงสร้างและแนวทางการขายเฉพาะ รวมโดเมน .com ปีแรกตามรายละเอียดแพ็กเกจ</p></div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-500">ทั้งสองแพ็กเกจเป็นเว็บไซต์หน้าเดียวและเตรียม SEO พื้นฐาน ความแตกต่างคือระดับการออกแบบเฉพาะและการเก็บโจทย์ รายละเอียดขอบเขตและค่าต่ออายุจะแจ้งก่อนตกลง</p>
          <a className="mt-4 inline-block font-semibold text-[#6443ce] underline" href="/ProjectONE/">ดูรายละเอียด Starter Web</a>
        </div>
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-bold text-[#7253d8]">ตัวอย่างสิ่งที่คุณจะได้รับ</p>
          <h2 className="mt-2 text-xl font-bold">จากข้อมูลธุรกิจ สู่หน้าเว็บที่คนติดต่อได้</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">สมมติคุณส่งว่า “ร้านทำฟันพระราม 3 รับขูดหินปูนและอุดฟัน มีที่จอดรถ” เราจะช่วยจัดเป็นหน้าแนะนำร้าน บริการ จุดเด่น และปุ่มติดต่อ พร้อมตรวจความถูกต้องกับคุณก่อนเปิดใช้งาน</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">ตัวอย่างเพื่ออธิบายขั้นตอน ไม่ใช่ผลลัพธ์จริงหรือการรับประกันยอดลูกค้า</p>
        </div>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(23,32,66,0.08)] sm:p-9" aria-labelledby="brief-title">
        <p className="text-sm font-semibold text-[#7253d8]">ขั้นตอน {step + 1} จาก 3</p>
        <div className="mt-3 flex gap-2" aria-hidden="true">{[0,1,2].map((i) => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-[#7253d8]" : "bg-slate-100"}`} />)}</div>
        {step === 0 && <div>
          <h2 id="brief-title" className="mt-8 text-2xl font-bold">เริ่มจากธุรกิจของคุณ</h2>
          <p className="mt-2 leading-relaxed text-slate-600">เลือกแนวทางที่ชอบ แล้วส่งข้อมูลให้เราช่วยจัดทำและขัดเกลา ภาพด้านล่างเป็นตัวอย่างแนวทาง ไม่ใช่เว็บไซต์สำเร็จรูปที่เปิดใช้งานได้ทันที</p>
          <fieldset className="mt-6 grid gap-4 sm:grid-cols-3"><legend className="mb-3 font-semibold">เลือกแนวทางที่ชอบ</legend>{choices.map((item) => <label key={item.name} className={`cursor-pointer overflow-hidden rounded-2xl border-2 ${choice === item.name ? "border-[#7253d8] bg-[#f6f3ff]" : "border-slate-200"}`}>
            <div className="m-2 overflow-hidden rounded-xl bg-white shadow-sm" aria-hidden="true"><div className="flex items-center justify-between px-3 py-2"><span className="h-1.5 w-8 rounded-full bg-slate-700" /><span className="h-1 w-9 rounded-full bg-slate-200" /></div><div className="flex min-h-28 flex-col justify-center px-3 py-3" style={{backgroundColor:item.color}}><span className="text-[10px] font-bold" style={{color:item.accent}}>YOUR BUSINESS</span><span className="mt-1 text-sm font-bold leading-snug">{item.title}</span><span className="mt-2 h-2 w-10 rounded-full" style={{backgroundColor:item.accent}} /></div><div className="grid grid-cols-3 gap-1 p-3"><span className="h-5 rounded bg-slate-100" /><span className="h-5 rounded bg-slate-100" /><span className="h-5 rounded bg-slate-100" /></div></div>
            <div className="flex items-start gap-2 px-3 pb-3"><input className="mt-1" type="radio" name="design" checked={choice === item.name} onChange={() => setChoice(item.name)} /><span><strong className="block text-sm">{item.name}</strong><span className="block text-xs text-slate-500">{item.kind}</span></span></div></label>)}</fieldset>
          <button type="button" onClick={() => setStep(1)} className="mt-7 w-full rounded-xl bg-[#7253d8] px-6 py-4 font-semibold text-white">เริ่มกรอกข้อมูล</button>
        </div>}
        {step === 1 && <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
          <h2 id="brief-title" className="mt-8 text-2xl font-bold">เล่าเรื่องธุรกิจของคุณ</h2>
          <p className="mt-2 leading-relaxed text-slate-600">กรอกเท่าที่มีได้เลย ช่องที่มี * จำเป็นสำหรับติดต่อและทำความเข้าใจธุรกิจ</p>
          <div className="mt-6 space-y-7">{["ข้อมูลพื้นฐาน", "บริการและลูกค้า", "เนื้อหาบนเว็บไซต์", "ภาพและแนวทาง"].map((group) => <fieldset key={group} className="space-y-5"><legend className="mb-4 w-full border-b border-slate-200 pb-3 text-lg font-bold">{group}</legend>{fields.filter((f) => f.group === group).map((f) => <label key={f.key} className="block"><span className="mb-2 block font-semibold">{f.label}{"required" in f && f.required ? " *" : ""}</span><span className="mb-2 block text-sm leading-relaxed text-slate-500">{f.hint}</span><textarea rows={2} required={"required" in f && f.required} value={answers[f.key]} onChange={(e) => setAnswers({ ...answers, [f.key]: e.target.value })} placeholder="พิมพ์ข้อมูลของคุณที่นี่" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-[#7253d8] focus:ring-2 focus:ring-[#7253d8]/20" /></label>)}</fieldset>)}</div>
          <p className="mt-5 text-sm leading-relaxed text-slate-500">ข้อมูลยังไม่ถูกส่งให้ PuchUp จนกว่าคุณจะคัดลอกและส่งผ่าน LINE ด้วยตนเอง กรุณาอย่าใส่รหัสผ่านหรือข้อมูลอ่อนไหว</p>
          <div className="mt-6 flex gap-3"><button type="button" onClick={() => setStep(0)} className="rounded-xl border border-slate-300 px-5 py-3 font-semibold">ย้อนกลับ</button><button className="flex-1 rounded-xl bg-[#7253d8] px-5 py-3 font-semibold text-white">ตรวจสอบข้อมูล</button></div>
        </form>}
        {step === 2 && <div>
          <h2 id="brief-title" className="mt-8 text-2xl font-bold">ตรวจสอบและส่งให้เรา</h2>
          <p className="mt-2 leading-relaxed text-slate-600">คัดลอกข้อมูลด้านล่าง เปิด LINE แล้ววางส่งถึง PuchUp จากนั้นส่งรูปภาพเพิ่มเติมในแชทได้เลย</p>
          <label className="mt-6 block font-semibold" htmlFor="brief-summary">สรุปข้อมูลธุรกิจ</label>
          <textarea id="brief-summary" readOnly value={summary} rows={14} className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 p-4 text-base leading-relaxed" />
          {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
          <div className="mt-5 grid gap-3 sm:grid-cols-2"><button type="button" onClick={copySummary} className="rounded-xl bg-[#7253d8] px-5 py-3 font-semibold text-white">{copied ? "คัดลอกแล้ว" : "คัดลอกข้อมูล"}</button><a href="https://line.me/R/ti/p/@masterpuch" target="_blank" rel="noreferrer" className="rounded-xl bg-[#06a84f] px-5 py-3 text-center font-semibold text-white">เปิด LINE เพื่อส่งข้อมูล</a></div>
          <button type="button" onClick={() => setStep(1)} className="mt-5 font-semibold text-[#6443ce] underline">กลับไปแก้ไขข้อมูล</button>
          <p className="mt-5 text-sm leading-relaxed text-slate-500">การเปิด LINE ไม่ได้ส่งข้อมูลให้อัตโนมัติ กรุณาวางข้อความและกดส่งในแชท ข้อมูลในหน้านี้จะหายเมื่อปิดหรือโหลดหน้าใหม่</p>
        </div>}
      </section>
    </div>
  </main>;
}
