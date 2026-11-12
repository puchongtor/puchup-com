import { catalogProducts, labProducts, site } from "@/lib/site";
import { realWorks } from "@/lib/works";
import { conceptCases, showcaseHub } from "@/lib/showcase";

export const LINE_OA_URL = "https://line.me/R/ti/p/@masterpuch";
export const LINE_OA_ID = "@masterpuch";

/** Suggestion chips on /contact */
export const contactSuggestionChips = [
  "สนใจ Project ONE",
  "เว็บบริษัทราคาเท่าไหร่",
  "อยากดู SaleDesk",
  "ShopGuide ทำงานยังไง",
  "อยากคุยกับทีมทาง LINE",
] as const;

export function buildPuchupKnowledgeText(): string {
  const products = catalogProducts
    .map((p) => {
      const price = p.price ? ` · ${p.price}` : "";
      return `- ${p.name} (${p.nameTh}) [${p.status}]${price}: ${p.blurb}`;
    })
    .join("\n");

  const works = realWorks
    .map((w) => `- ${w.name} (${w.url}): ${w.summary}`)
    .join("\n");

  const labs = labProducts.map((l) => `- ${l.name}: ${l.body} (${l.status})`).join("\n");

  const showcase = conceptCases
    .map((c) => `- ${c.name}: ${c.blurb}`)
    .join("\n");

  return [
    `แบรนด์: ${site.name} · ${site.url} · ${site.tagline}`,
    `คำอธิบาย: ${site.description}`,
    `อีเมล: ${site.email}`,
    `LINE OA: ${LINE_OA_ID} → ${LINE_OA_URL}`,
    "",
    "สินค้า/บริการ:",
    products,
    "",
    "ราคาอ้างอิง:",
    "- Project ONE: Starter Web 9,900 · Local Acquisition 12,900 · Local SEO Site (≤10 หน้า) 17,900 · ดูแลหมุดรายเดือนพิเศษ 2,500 (จาก 3,500)",
    "- Corporate Site เริ่มต้น 25,000 บาท",
    "- ShopGuide เริ่มต้น 35,000 บาท + AI รายเดือนประมาณ 990–1,490 บาท",
    "- SaleDesk เริ่มต้น 19,000 บาท + รายเดือนทีม 1–5 คน ≈ 1,990–2,990 · 6–10 คน ≈ 3,490–4,990",
    "- Partner: รายละเอียดตามข้อตกลง (ห้ามใช้คำว่าแบ่งกำไร)",
    "- OpsCraft: ประเมินตามงาน",
    "",
    `${showcaseHub.title}:`,
    showcase,
    "",
    "ผลงานจริง:",
    works,
    "",
    "กำลังพัฒนา:",
    labs,
  ].join("\n");
}

/** Local fallback when live Contact API is unavailable */
export function localKnowledgeReply(message: string): string {
  const m = message.toLowerCase();
  if (/project\s*one|หน้าเดียว|local seo|google business|บ้านทันต|baandental/.test(m)) {
    return "Project ONE มี Starter Web 9,900 · Local Acquisition (เว็บ+Google Business) 12,900 · ขยายเนื้อหา SEO ไม่เกิน 10 หน้า 17,900 · ดูแลหมุดรายเดือนพิเศษ 2,500 (จาก 3,500) — ดูเคสบ้านทันตแพทย์ได้ครับ";
  }
  if (/ราคา|เท่าไหร่|กี่บาท|corporate/.test(m)) {
    return `Project ONE เริ่ม 9,900–17,900 · Corporate เริ่มต้น 25,000 · ShopGuide เริ่มต้น 35,000 + AI รายเดือนเล็กน้อย · SaleDesk เริ่มต้น 19,000 + รายเดือนตามขนาดทีม · Partner/OpsCraft คุยรายละเอียดกันครับ — LINE OA ${LINE_OA_ID}`;
  }
  if (/sale|saledesk|ทีมขาย/.test(m)) {
    return "SaleDesk ติดตั้งเริ่มต้น 19,000 บาท มีรายเดือนแบบช่วงทีม 1–5 คน / 6–10 คน (คิดช่วงทีม ไม่คิดรายหัว) — ช่วยรายงานมีหลักฐาน เลขา AI ผู้จัดการเห็นงานค้าง ไม่ใช่ CRM เต็มครับ";
  }
  if (/shopguide|แชท.*สินค้า|aeropulse|จักรยาน/.test(m)) {
    return "ShopGuide เริ่มต้น 35,000 บาท มี AI รายเดือนไม่สูง — เว็บสินค้ามีแชท/Finder นำทางไปสินค้า แล้วส่งต่อไป Line OA ได้ครับ ดูตัวอย่างได้ที่ AeroPulse";
  }
  if (/partner|พาร์ทเนอร์/.test(m)) {
    return "PuchUp Partner คือให้เราเป็นฝ่ายการตลาดออนไลน์ สร้างเว็บและระบบให้ธุรกิจโตไปด้วยกัน — เหมาะกับธุรกิจที่อยากโตโดยไม่จ้างทีมเต็มรูปแบบครับ";
  }
  if (/opscraft|ระบบตามเคส|ลดขั้นตอน/.test(m)) {
    return "OpsCraft ออกแบบระบบลดขั้นตอนตามวิธีทำงานของธุรกิจคุณ — ทีมจะประเมินขอบเขตงานและงบหลังทำความเข้าใจปัญหาครับ";
  }
  if (/ผลงาน|works|ตัวอย่าง|showcase/.test(m)) {
    return "ผลงานจริงมี Baan Dental (Project ONE), Advance Pro, Amethez และ Rabiangprai Valley — ตัวอย่างระบบมี AeroPulse (ShopGuide) กับ Project ONE บอกได้ว่าสนใจแนวไหน จะเล่าให้ฟังครับ";
  }
  if (/ไลน์|line|คุยกับทีม|คุยกับคน|ติดต่อ/.test(m)) {
    return `คุยกับทีมตรงๆ ได้ที่ LINE OA ${LINE_OA_ID} เลยครับ กดปุ่มสีเขียวด้านบนหรือด้านล่างแชทนี้ได้`;
  }
  return `เล่าธุรกิจหรือสิ่งที่อยากให้ช่วยเพิ่มได้นิดนึงนะครับ จะจัดให้ตรงจุด — หรือคุยกับทีมทาง LINE ${LINE_OA_ID} ก็ได้ตลอด`;
}
