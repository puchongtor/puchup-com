import { catalogProducts, labProducts, site } from "@/lib/site";
import { realWorks } from "@/lib/works";
import { conceptCases, showcaseHub } from "@/lib/showcase";
import { baht, corporateDiscount, corporatePackages, corporatePromotionLabel, corporateSeoPlans, discountedPrice, isCorporatePromotionActive } from "@/lib/corporate-demo/packages";

export const LINE_OA_URL = "https://line.me/R/ti/p/@masterpuch";
export const LINE_OA_ID = "@masterpuch";

function corporatePricingText() {
  const regular = corporatePackages.map(plan => `${plan.name} ${baht(plan.price)} บาท (${plan.pages} หน้า รวมคู่มือและคำถามที่พบบ่อย ${plan.seoPages} หน้า)`).join(" · ");
  const promo = isCorporatePromotionActive()
    ? ` · โปรลด ${corporateDiscount}% ถึง ${corporatePromotionLabel}: ${corporatePackages.map(plan => `${plan.name} ${baht(discountedPrice(plan.price))} บาท`).join(" / ")}`
    : "";
  return `Corporate Site: ${regular}${promo} · ทุกแพ็กเกจวาง SEO พื้นฐานครบทุกหน้าที่ส่งมอบ · เว็บ SEO ขั้นสูงหรือเกิน 40 หน้า ขอใบเสนอราคาตามงาน`;
}

function corporateSeoText() {
  return corporateSeoPlans.map(plan => `${plan.name} ${baht(plan.price)} บาท/เดือน (${plan.work.join(" · ")})`).join(" · ");
}

/** Suggestion chips on /contact */
export const contactSuggestionChips = [
  "สนใจ Project ONE",
  "อยากอ่านคู่มือระบบเว็บ",
  "เว็บบริษัทราคาเท่าไหร่",
  "อยากดู SaleDesk",
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
    "- Project ONE: Starter 9,900 · Get Local Customers 12,900 · Local SEO 17,900 · Plus 24,900 · Local Care 3,500 บาท/เดือน หรือ 7,500 บาท/3 เดือน ดูแล SEO ทั้งเว็บและเขียนบทความใหม่ 1–2 เรื่องต่อสัปดาห์ พร้อมอัปเดตข้อมูลร้านและดูแลหมุดตามรอบ",
    `- ${corporatePricingText()}`,
    `- บริการรายเดือน Corporate: ${corporateSeoText()}`,
    "- ShopGuide เริ่มต้น 35,000 บาท + AI รายเดือนประมาณ 990–1,490 บาท",
    "- SaleDesk เริ่มต้น 19,000 บาท + รายเดือนทีม 1–5 คน ≈ 1,990–2,990 · 6–10 คน ≈ 3,490–4,990",
    "- Partner: รายละเอียดตามข้อตกลง (ห้ามใช้คำว่าแบ่งกำไร)",
    "- OpsCraft: ประเมินตามงาน",
    "",
    `${showcaseHub.title}:`,
    showcase,
    "",
    "Guides: /guides/ — คู่มือราคาทำเว็บร้าน (9,900–24,900), คาดหวังขึ้น Google, หน้าเดียว vs บริการ+ย่าน, เว็บช้าเสียลูกค้า, เขียนหน้าบริการ (AI), LINE OA รับลูกค้า, เว็บไซต์ AI 2027, Vercel, เส้นทาง Google→ร้าน, หมุด+เว็บ, คลินิก/ความงาม/สปา, คาเฟ่, ร้านอาหาร, อู่/ล้างรถ",
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
  if (/project\s*one|local care/.test(m) && /รายเดือน|local care|เขียนบทความ|ดูแล seo/.test(m)) {
    return "Project ONE Local Care 3,500 บาท/เดือน หรือ 7,500 บาท/3 เดือน ดูแล SEO ทั้งเว็บและเขียนบทความใหม่ 1–2 เรื่องต่อสัปดาห์ครับ";
  }
  if (/project\s*one|หน้าเดียว|local seo|google business|บ้านทันต|baandental|guides|คู่มือ|คลินิกทันต/.test(m)) {
    return "Project ONE คือระบบหาลูกค้าหน้าร้าน ไม่ใช่เว็บโชว์ — Starter 9,900 · Local Acquisition 12,900 · Local SEO ≤10 หน้า 17,900 · Local SEO Plus ≤40 หน้า 24,900 · ดูผลงานที่ /showcase/results/ ได้ครับ";
  }
  if (/seo.*รายเดือน|รายเดือน.*seo|เขียนบทความ|ดูแล seo/.test(m)) {
    return `${corporateSeoText()} · ดูรายละเอียดที่ /corporate/#seo-care ครับ`;
  }
  if (/ราคา|เท่าไหร่|กี่บาท|corporate|plus/.test(m)) {
    return `Project ONE: 9,900 / 12,900 / 17,900 (≤10 หน้า) / Plus 24,900 (≤40 หน้า) · ${corporatePricingText()} · ShopGuide เริ่มต้น 35,000 + AI รายเดือน · SaleDesk เริ่มต้น 19,000 + รายเดือนตามทีม · Partner/OpsCraft คุยรายละเอียด — LINE OA ${LINE_OA_ID}`;
  }
  if (/sale|saledesk|ทีมขาย/.test(m)) {
    return "SaleDesk ติดตั้งเริ่มต้น 19,000 บาท มีรายเดือนแบบช่วงทีม 1–5 คน / 6–10 คน (คิดช่วงทีม ไม่คิดรายหัว) — ช่วยรายงานมีหลักฐาน เลขา AI ผู้จัดการเห็นงานค้าง ไม่ใช่ CRM เต็มครับ";
  }
  if (/shopguide|แชท.*สินค้า|aeropulse|จักรยาน/.test(m)) {
    return "ShopGuide เริ่มต้น 35,000 บาท มี AI รายเดือนไม่สูง — เว็บสินค้ามีแชท/Finder นำทางไปสินค้า แล้วส่งต่อไป Line OA ได้ครับ ดูตัวอย่างได้ที่ AeroPulse";
  }
  if (/partner|พาร์ทเนอร์|parts\.puchup|นายหน้า|อะไหล่/.test(m)) {
    return "PuchUp Partner คือให้เราเป็นฝ่ายการตลาดออนไลน์ สร้างเว็บและระบบให้ธุรกิจโตไปด้วยกัน — ดูตัวอย่างแนวนี้ได้ที่ Parts.PuchUp แพลตฟอร์มหาอะไหล่โรงงาน ค้นรุ่นเทียบร้านแล้วส่งต่อไปพาร์ทเนอร์ครับ";
  }
  if (/opscraft|ระบบตามเคส|ลดขั้นตอน/.test(m)) {
    return "OpsCraft ออกแบบระบบลดขั้นตอนตามวิธีทำงานของธุรกิจคุณ — ทีมจะประเมินขอบเขตงานและงบหลังทำความเข้าใจปัญหาครับ";
  }
  if (/ผลงาน|works|ตัวอย่าง|showcase/.test(m)) {
    return "ผลงานจริงรายงานตามช่วงเวลาหลังขึ้นเว็บ เช่น บ้านทันตแพทย์ (1 สัปดาห์) และ Advance Pro (3 สัปดาห์: คำค้นสินค้าขึ้นหน้า 1, ทัก LINE 20+, เปิดใบเสนอราคา) — ครบ 1 เดือนจะเป็นบทความใหม่ ผลไม่การันตีทุกเคส อ่านที่ /showcase/results/ ครับ";
  }
  if (/ไลน์|line|คุยกับทีม|คุยกับคน|ติดต่อ/.test(m)) {
    return `คุยกับทีมตรงๆ ได้ที่ LINE OA ${LINE_OA_ID} เลยครับ กดปุ่มสีเขียวด้านบนหรือด้านล่างแชทนี้ได้`;
  }
  return `เล่าธุรกิจหรือสิ่งที่อยากให้ช่วยเพิ่มได้นิดนึงนะครับ จะจัดให้ตรงจุด — หรือคุยกับทีมทาง LINE ${LINE_OA_ID} ก็ได้ตลอด`;
}
