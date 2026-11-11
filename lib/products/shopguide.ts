export const shopguideProduct = {
  id: "shopguide",
  name: "ShopGuide",
  nameTh: "แชท AI พาสู่สินค้าและ Line OA",
  status: "พร้อมขาย",
  priceLabel: "เริ่มต้น 35,000 บาท",
  priceNote:
    "ค่าติดตั้งเริ่มต้นครอบคลุมเว็บสินค้า ระบบแนะนำ/แชท เปรียบเทียบ เช็คสต็อก และเชื่อมต่อ Line OA ตามขอบเขตพื้นฐาน — มีค่ารายเดือนสำหรับ AI ประมาณ 990–1,490 บาท ตามการใช้งาน หากแคตตาล็อกหนาหรือกติกาแนะนำซับซ้อน จะประเมินเพิ่มตามงาน",
  tagline:
    "ให้ลูกค้าตอบคำถามหรือคุยเป็นภาษาคน แล้วพาไปสินค้าที่ใช่ — ไม่ต้องไล่ดูสเปกเองทั้งร้าน",
  blurb:
    "เว็บสินค้าที่มีผู้ช่วยแนะนำและแชท นำทางไปยังสินค้าที่ต้องการ เปรียบเทียบ เช็คสต็อก และส่งต่อไป Line OA — เหมาะกับร้านที่มีตัวเลือกเยอะ",
  images: {
    hero: "/images/products/shopguide/sg-hero-bike.jpg",
    problem: "/images/products/shopguide/sg-problem-choice.jpg",
    finder: "/images/products/shopguide/sg-finder-ui.jpg",
    results: "/images/products/shopguide/sg-results-cards.jpg",
    compare: "/images/products/shopguide/sg-compare-ui.jpg",
    stock: "/images/products/shopguide/sg-stock-ui.jpg",
    lineHandoff: "/images/products/shopguide/sg-line-handoff.jpg",
    lineButton: "/images/products/shopguide/sg-line-button.jpg",
    aiChat: "/images/products/shopguide/sg-ai-chat.jpg",
    catalog: "/images/products/shopguide/sg-catalog-ui.jpg",
    bikeAero: "/images/products/shopguide/sg-bike-aero.jpg",
    bikeEndurance: "/images/products/shopguide/sg-bike-endurance.jpg",
    bikeGravel: "/images/products/shopguide/sg-bike-gravel.jpg",
    lifeDawn: "/images/products/shopguide/sg-life-dawn.jpg",
    lifeFit: "/images/products/shopguide/sg-life-fit.jpg",
    lifeTunnel: "/images/products/shopguide/sg-life-tunnel.jpg",
  },
  proof: {
    name: "AeroPulse Bike Studio",
    summary:
      "ตัวอย่างร้านจักรยานที่ใช้ระบบแนะนำสินค้า — ลูกค้าตอบคำถามหรือคุยกับผู้ช่วย ได้รุ่นที่เหมาะ เทียบสเปก เช็คสต็อก และส่งต่อทีมร้านทาง LINE",
    href: "https://aeropulse.puchup.com",
    embedHref: "/sites/aeropulse/",
    label: "เปิดตัวอย่าง AeroPulse",
    caseHref: "/showcase/aeropulse/",
    caseLabel: "อ่านรายละเอียดเคส",
  },
} as const;

export const shopguideProblems = [
  {
    title: "สินค้าเยอะ ลูกค้าเลือกไม่ถูก",
    body: "ยิ่งมีตัวเลือกมาก ยิ่งทำให้ลูกค้าเหนื่อยและทักมาถามซ้ำ — หรือออกจากเว็บไปเลย",
  },
  {
    title: "ไล่ดูสเปกเองแล้วงง",
    body: "หน้าสินค้าเต็มไปด้วยรายละเอียด แต่ไม่มีใครช่วยคัดให้ตรงความต้องการในตอนนั้น",
  },
  {
    title: "แชทขายขาดบริบท",
    body: "พอทัก Line ทีมต้องถามใหม่หมด — ไม่รู้ว่ารุ่นไหน งบประมาณช่วงไหน หรือใช้งานแบบไหน",
  },
] as const;

export const shopguideOutcomes = [
  {
    title: "Smart Finder (คำถามทีละขั้น)",
    body: "ลูกค้าตอบคำถามสั้นๆ ระบบจับคู่สินค้าที่เหมาะที่สุดพร้อมเหตุผล — ไม่ต้องไล่แคตตาล็อกเอง",
  },
  {
    title: "AI Expert แชทภาษาคน",
    body: "อีกทางเข้าเดียวกัน — คุยอิสระ แล้วระบบดึงคำตอบเข้า engine เดียวกับ Finder",
  },
  {
    title: "เปรียบเทียบ + เช็คสต็อก",
    body: "เทียบรุ่นแบบตาราง ดูสถานะสต็อกตามไซซ์/ตัวเลือก ก่อนตัดสินใจคุยคน",
  },
  {
    title: "ส่งต่อไป Line OA พร้อมบริบท",
    body: "สรุปรุ่นที่สนใจและข้อความพร้อมส่ง — ทีมร้านไม่ต้องถามซ้ำจากศูนย์",
  },
] as const;

export const shopguideModules = [
  {
    title: "Hero + Catalog",
    body: "หน้าแรกแบรนด์ร้าน + ดูรุ่นทั้งหมด — ยังไล่ดูได้ถ้าลูกค้าอยากเลือกเอง",
    image: "/images/products/shopguide/sg-catalog-ui.jpg",
  },
  {
    title: "Smart Finder",
    body: "Wizard ประมาณ 7 ข้อ → จับคู่ top matches พร้อมเหตุผล",
    image: "/images/products/shopguide/sg-finder-ui.jpg",
  },
  {
    title: "AI Expert Chat",
    body: "แชทมุมจอ — ดึงคำตอบเข้า engine เดียว ไม่แนะนำมั่วเอง",
    image: "/images/products/shopguide/sg-ai-chat.jpg",
  },
  {
    title: "Results + Compare",
    body: "โชว์รุ่นที่เหมาะ พร้อมเปรียบเทียบสูงสุดหลายรุ่น",
    image: "/images/products/shopguide/sg-results-cards.jpg",
  },
  {
    title: "Stock Check",
    body: "สถานะสต็อกตามไซซ์/ตัวเลือก ก่อนนัดหรือสั่ง",
    image: "/images/products/shopguide/sg-stock-ui.jpg",
  },
  {
    title: "Line Handoff",
    body: "สร้างข้อความพร้อมรุ่น/ราคา/ไซซ์ แล้วเปิด Line OA",
    image: "/images/products/shopguide/sg-line-handoff.jpg",
  },
] as const;

export const shopguideBikeShots = [
  {
    title: "Aero Road",
    body: "โฟกัสความเร็วและแรงลม — ตัวอย่างรุ่นสมรรถนะสูง",
    image: "/images/products/shopguide/sg-bike-aero.jpg",
  },
  {
    title: "Endurance",
    body: "ปั่นไกล สบายตัว — เหมาะกับทางไกลและใช้ประจำ",
    image: "/images/products/shopguide/sg-bike-endurance.jpg",
  },
  {
    title: "Gravel",
    body: "ทางผสม กรวด ลูกรัง — ขยายแคตตาล็อกตามร้านจริง",
    image: "/images/products/shopguide/sg-bike-gravel.jpg",
  },
] as const;

export const shopguideLifestyle = [
  {
    title: "Dawn ride",
    image: "/images/products/shopguide/sg-life-dawn.jpg",
    alt: "ปั่นเช้าบนทางด่วนว่าง",
  },
  {
    title: "Studio fit",
    image: "/images/products/shopguide/sg-life-fit.jpg",
    alt: "ฟิตติ้งในสตูดิโอ",
  },
  {
    title: "Wind tunnel",
    image: "/images/products/shopguide/sg-life-tunnel.jpg",
    alt: "ทดสอบอุโมงค์ลม",
  },
] as const;

export const shopguideFlow = [
  { n: "01", title: "คุย / ตอบ Finder", body: "ลูกค้าบอกความต้องการเป็นภาษาคน หรือตอบคำถามทีละข้อ" },
  { n: "02", title: "คัดด้วย engine เดียว", body: "ทั้งแชทและ Finder ใช้กฎจับคู่ชุดเดียวกัน — ตรวจได้" },
  { n: "03", title: "ดูผล · เทียบ · เช็คสต็อก", body: "เปิดสินค้าที่ตรง เปรียบเทียบ และดูของที่มีจริง" },
  { n: "04", title: "ส่งต่อ Line", body: "คุยคนต่อหรือปิดการขายพร้อมบริบทที่คุยไว้" },
] as const;

export const shopguideSteps = [
  { n: "01", title: "Listen", body: "ดูประเภทสินค้าและวิธีลูกค้าเลือกของจริง" },
  { n: "02", title: "Design", body: "ออกแบบคำถาม Finder + บทสนทนา + เส้นทางไปสินค้า" },
  { n: "03", title: "Build", body: "สร้างเว็บ + Finder/แชท + เปรียบเทียบ + สต็อก + Line OA" },
  { n: "04", title: "Tune", body: "ปรับจากคำถามจริงที่ลูกค้าถามบ่อย" },
] as const;
