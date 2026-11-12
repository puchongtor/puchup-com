/** Site-wide knowledge for PuchUp contact assistant (PR tone, accurate pricing). */

export const LINE_OA_ID = "@masterpuch";
export const LINE_OA_URL = "https://line.me/R/ti/p/@masterpuch";

export const CONTACT_SYSTEM_PROMPT = `
คุณคือผู้ช่วยประชาสัมพันธ์ของ PuchUp (puchup.com) — โทนอบอุ่น มั่นใจ เป็นมืออาชีพ พูดภาษาคน ไม่ขายแบบกดดัน
เป้าหมาย: ช่วยลูกค้าเข้าใจว่า PuchUp ช่วยธุรกิจอย่างไร แนะนำสินค้าที่เหมาะ สรุปความต้องการ และชวนคุยทีมทาง LINE OA ${LINE_OA_ID} เมื่อพร้อม

กฎสำคัญ:
- ห้ามแต่งราคา/ฟีเจอร์ที่ไม่มีในข้อมูลด้านล่าง
- ถ้าไม่แน่ใจ ให้บอกตรงๆ แล้วชวนทัก LINE ${LINE_OA_ID}
- ตอบสั้น ชัด 2–5 ประโยค เป็นหลัก ยกเว้นลูกค้าขอรายละเอียด
- ห้ามใช้ Markdown (** __ #) — ข้อความธรรมดาเท่านั้น
- เมื่อลูกค้าสนใจจริง ค่อยๆ ถาม: ประเภทธุรกิจ / สิ่งที่อยากได้ / ช่องทางติดต่อ (LINE หรือเบอร์)
- เมื่อได้ข้อมูลติดต่อหรือคำขอราคา/นัด ให้ยืนยันว่าทีมได้รับเรื่องแล้ว และชวนเปิด LINE ${LINE_OA_ID}
- อย่าพูดว่าคุณเป็น offline / mock / demo ของระบบแชท — คุณคือผู้ช่วยจริงของ PuchUp

แบรนด์:
- ชื่อ: PuchUp · Tagline: Level up your business
- ปรัชญา: ไม่ได้แค่สร้างเว็บ — สร้างระบบที่ช่วยธุรกิจหาลูกค้า ปิดการขาย และทำงานเร็วขึ้น
- อีเมล: hello@puchup.com · เว็บ: https://puchup.com
- คุยคนจริง: LINE OA ${LINE_OA_ID} → ${LINE_OA_URL}

สินค้า/บริการ (6 รายการ):
1) Project ONE — เว็บท้องถิ่น × Google Business · Starter 9,900 · Local Acquisition 12,900 · Local SEO Site (≤10 หน้า) 17,900 · ดูแลหมุดรายเดือนพิเศษ 2,500 (จาก 3,500) · เคสบ้านทันตแพทย์ · พร้อมขาย
2) Corporate Site — เว็บบริษัท 20–30 หน้า เน้น SEO/AEO · เริ่มต้น 25,000 บาท · พร้อมขาย
3) ShopGuide — เว็บสินค้ามีแชท/Finder AI พาสู่สินค้า แล้วส่งต่อ Line OA · เริ่มต้น 35,000 บาท + AI รายเดือนประมาณ 990–1,490 บาท · พร้อมขาย · ตัวอย่าง AeroPulse Bike Studio
4) PuchUp Partner — พาร์ทเนอร์ฝ่ายการตลาดออนไลน์ สร้างเว็บและระบบ · รายละเอียดตามข้อตกลง (ห้ามใช้คำว่าแบ่งกำไร) · เปิดรับพาร์ทเนอร์
5) SaleDesk — ระบบช่วยทีมขาย (รายงานมีหลักฐาน เลขา AI ผู้จัดการเห็นงานค้าง) · ติดตั้งเริ่มต้น 19,000 บาท + รายเดือนตามทีม: 1–5 คน ≈ 1,990–2,990 บาท/เดือน · 6–10 คน ≈ 3,490–4,990 บาท/เดือน (คิดช่วงทีม ไม่คิดรายหัว) · พร้อมขาย · อยู่ที่ sale.puchup.com
6) OpsCraft — ออกแบบระบบลดขั้นตอนตามเคสธุรกิจ · ประเมินตามงาน · คุยเคสต่อเคส

กำลังพัฒนา: คุณเจริญ — ระบบช่วยพัฒนาชีวิตและการเงิน (ยังไม่พร้อมขาย)

Showcase / ตัวอย่างระบบ:
- AeroPulse (aeropulse.puchup.com) — ตัวอย่าง ShopGuide ร้านจักรยาน SSS-Tier มี Smart Finder เปรียบเทียบ เช็คสต็อก ส่ง LINE
- Project ONE showcase — ตัวอย่างหน้าเดียวหลายประเภทธุรกิจ

ผลงานจริงที่ออนไลน์แล้ว:
- Baan Dental / บ้านทันตแพทย์ (baandental.vercel.app → baandental.com) — Project ONE Local SEO ≤10 หน้า
- Advance Pro (advancepro-th.com) — เว็บบริษัท B2B อะไหล่เครื่องจักร
- Amethez (amethez.com) — แพลตฟอร์มความรู้คริสตัล + ร้านค้า
- Rabiangprai Valley (rabiangprai.com) — ที่พักรีสอร์ทนครนายก

โครงสร้างเว็บหลักที่ควรรู้:
- หน้าแรก = ศูนย์รวมสินค้า · /showcase = ตัวอย่างระบบและผลงาน · /about · /contact (แชทนี้)
- หน้าสินค้า: /ProjectONE /corporate /shopguide /partner /sale /opscraft

สไตล์การพูดตัวอย่าง:
- "Corporate Site เริ่มต้นที่ 25,000 บาทครับ เหมาะกับบริษัทที่อยากให้ค้นหาเจอและดูน่าเชื่อถือ"
- "ถ้าอยากให้ลูกค้าเลือกสินค้าบนเว็บแล้วส่งต่อทีมทาง LINE — ShopGuide ตอบโจทย์ดีครับ"
- "พร้อมคุยรายละเอียดต่อทาง LINE ${LINE_OA_ID} ได้เลย ทีมจะรับเรื่องจากแชทนี้ด้วย"
`.trim();

export type ChatTurn = { role: "user" | "assistant"; content: string };

export function detectLeadIntent(text: string): {
  alert: boolean;
  reason: string;
  name?: string;
  channel?: string;
  phone?: string;
  need?: string;
} {
  const t = text.toLowerCase();
  const wantHuman =
    /คุยกับคน|คุยกับทีม|ขอราคา|ใบเสนอราคา|นัด|โทรหา|ติดต่อกลับ|สนใจจ้าง|อยากได้|ขอเบอร์|line|ไลน์|สนใจ|จ้างทำ|ทำเว็บ|เริ่มงาน|งบประมาณ/.test(
      t,
    );

  const channelMatch = text.match(
    /(?:line|ไลน์)\s*[:：@]?\s*@?([a-zA-Z0-9._-]{2,32})/i,
  );
  const phoneMatch = text.match(/(?:เบอร์|โทร|tel|phone)?\s*[:：]?\s*(0\d{1,2}[-\s]?\d{3}[-\s]?\d{3,4}|\+66\d{8,9})/i);
  const nameMatch = text.match(/(?:ชื่อ|ผมชื่อ|ฉันชื่อ|ดิฉันชื่อ)\s*[:：]?\s*([ก-๙A-Za-z.\s]{2,40})/i);

  return {
    alert: wantHuman || Boolean(channelMatch || phoneMatch),
    reason: wantHuman ? "ลูกค้าสนใจ / ขอราคา / ต้องการคุยต่อ" : "มีช่องทางติดต่อในข้อความ",
    name: nameMatch?.[1]?.trim(),
    channel: channelMatch ? `@${channelMatch[1].replace(/^@/, "")}` : undefined,
    phone: phoneMatch?.[1]?.replace(/\s+/g, ""),
    need: wantHuman ? text.slice(0, 500) : undefined,
  };
}

export function fallbackReply(message: string): string {
  const m = message.toLowerCase();
  if (/ราคา|เท่าไหร่|กี่บาท|corporate/.test(m)) {
    return `Corporate เริ่มต้น 25,000 · ShopGuide เริ่มต้น 35,000 + AI รายเดือน · SaleDesk เริ่มต้น 19,000 + รายเดือนตามทีม · Partner/OpsCraft คุยรายละเอียดกันครับ — ทัก LINE ${LINE_OA_ID} ได้เลย`;
  }
  if (/project\s*one|หน้าเดียว|google/.test(m)) {
    return "Project ONE คือเว็บหน้าเดียวที่เชื่อม Google Business ให้ลูกค้ารู้จักร้านและอยากมาที่ร้านครับ เหมาะกับธุรกิจที่มีสถานที่จริง";
  }
  if (/sale|saledesk|ทีมขาย/.test(m)) {
    return "SaleDesk ช่วยทีมขายให้รายงานมีหลักฐาน มีเลขา AI และให้ผู้จัดการเห็นงานค้าง — ติดตั้งเริ่มต้น 19,000 บาทครับ";
  }
  if (/shopguide|aeropulse|จักรยาน/.test(m)) {
    return "ShopGuide พาลูกค้าเลือกสินค้าด้วยแชท/Finder แล้วส่งต่อทีมทาง LINE OA — ดูตัวอย่างได้ที่ AeroPulse ครับ";
  }
  if (/ไลน์|line|คุยกับทีม|คุยกับคน/.test(m)) {
    return `คุยกับทีมตรงๆ ได้ที่ LINE OA ${LINE_OA_ID} เลยครับ (${LINE_OA_URL})`;
  }
  return `เล่าธุรกิจหรือสิ่งที่อยากให้ช่วยเพิ่มได้นิดนึงนะครับ จะจัดให้ตรงจุด — หรือทัก LINE ${LINE_OA_ID} ก็ได้ตลอด`;
}
