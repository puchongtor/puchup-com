export const corporateContact = {
  phone: "088-089-9895",
  telephone: "tel:+66880899895",
  line: "@masterpuch",
  lineUrl: "https://line.me/R/ti/p/@masterpuch",
};

export const corporateDiscount = 20;
export const corporatePromotionLabel = "31 ธันวาคม 2569";
export const corporatePromotionEndsAt = Date.parse("2027-01-01T00:00:00+07:00");

export const corporatePackages = [
  {
    name: "Signature", pages: 10, seoPages: 2, price: 19900,
    description: "เหมาะกับบริษัทที่อยากให้ลูกค้าเห็นบริการหลัก ผลงาน และวิธีขอราคาได้ในครั้งเดียว",
    allocation: ["หน้าหลักบริษัท 4 หน้า", "หน้าบริการ 2 หน้า", "หน้าผลงาน 2 หน้า", "คู่มือและคำถามที่พบบ่อย 2 หน้า"],
  },
  {
    name: "Executive", pages: 20, seoPages: 4, price: 25900,
    description: "เหมาะกับบริษัทที่รับงานหลายแบบ และต้องอธิบายบริการ ผลงาน และพื้นที่ให้ลูกค้าเทียบได้",
    allocation: ["หน้าหลักบริษัท 5 หน้า", "หน้าบริการ 4 หน้า", "หน้าผลงาน 4 หน้า", "หน้าพื้นที่ 3 หน้า", "คู่มือและคำถามที่พบบ่อย 4 หน้า"],
  },
  {
    name: "Prestige", pages: 40, seoPages: 8, price: 29900,
    description: "เหมาะกับบริษัทที่มีบริการหลายกลุ่ม ผลงานหลายแบบ และต้องการครอบคลุมคำค้นเฉพาะสายงาน",
    allocation: ["หน้าหลักบริษัท 7 หน้า", "หน้าบริการ 6 หน้า", "หน้าผลงาน 12 หน้า", "หน้าพื้นที่ 7 หน้า", "คู่มือและคำถามที่พบบ่อย 8 หน้า"],
  },
] as const;

export const corporateSeoPlans = [
  {
    name: "ดูแล SEO ต่อเนื่อง", price: 3500,
    description: "สำหรับธุรกิจที่อยากให้ทั้งเว็บมีข้อมูลสดใหม่ และให้ลูกค้าหาคำตอบก่อนติดต่อได้ง่ายขึ้น",
    work: [
      "ติดตามคำค้นและหน้าที่มีโอกาสจาก Search Console",
      "ปรับเนื้อหาและลิงก์ระหว่างหน้าบริการ ผลงาน และหน้าอื่นที่เกี่ยวข้อง",
      "เขียนและลงบทความใหม่ 1–2 เรื่องต่อสัปดาห์ จากคำถามที่ลูกค้าถามจริง",
    ],
  },
  {
    name: "SEO เชิงลึกและบทความ", price: 5900,
    description: "สำหรับธุรกิจที่ต้องการลงลึกในแต่ละบริการ ให้ลูกค้าเข้าใจวิธีทำงานและใช้เนื้อหาประกอบการตัดสินใจได้",
    work: [
      "วางแผนหัวข้อและเขียนบทความต่อเนื่องตามบริการที่บริษัทต้องการขยาย",
      "ใช้ข้อมูลจากทีมลูกค้า เช่น ขั้นตอนจริง สเปก ข้อจำกัด และกรณีงานที่ตรวจสอบได้",
      "ทวนข้อเท็จจริงและเชื่อมบทความกับบริการหรือผลงานที่เกี่ยวข้องก่อนลงเว็บ",
    ],
  },
] as const;

const formatBaht = new Intl.NumberFormat("th-TH");

export function baht(amount: number) {
  return formatBaht.format(amount);
}

export function discountedPrice(price: number) {
  return Math.round(price * (100 - corporateDiscount) / 100);
}

export function isCorporatePromotionActive(now = Date.now()) {
  return now < corporatePromotionEndsAt;
}
