export const site = {
  name: "PuchUp",
  domain: "puchup.com",
  url: "https://puchup.com",
  tagline: "Level up your business",
  description:
    "PuchUp สร้างเว็บไซต์และระบบดิจิทัลที่ช่วยธุรกิจหาลูกค้า ปิดการขาย และทำงานได้เร็วขึ้น",
  email: "hello@puchup.com",
  year: 2026,
  philosophyLines: [
    "PuchUp ไม่ได้แค่สร้างเว็บไซต์",
    "PuchUp สร้างระบบที่ช่วยให้ธุรกิจทำงานได้ดีขึ้น",
  ] as const,
  cta: {
    primary: "คุยกับ PuchUp",
    explore: "ดูสินค้าทั้งหมด",
    understand: "ดูว่า PuchUp ทำงานอย่างไร →",
  },
} as const;

/** Slim primary navigation — homepage is the product launchpad */
export const navLinks = [
  { href: "/#products", label: "Products & Services" },
  { href: "/showcase/", label: "Showcase" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
] as const;

export type CatalogProduct = {
  id: string;
  name: string;
  nameTh: string;
  href: string;
  blurb: string;
  price?: string;
  status: "พร้อมขาย" | "เปิดรับพาร์ทเนอร์" | "กำลังพัฒนา" | "คุยเคสต่อเคส";
  image: string;
  accent: string;
};

/** Six revenue products on the homepage grid */
export const catalogProducts: CatalogProduct[] = [
  {
    id: "project-one",
    name: "Project ONE",
    nameTh: "เว็บหน้าเดียว × Google Business",
    href: "/ProjectONE/",
    blurb:
      "เว็บไซต์หน้าเดียวที่เชื่อม Google Business ให้ลูกค้ารู้จัก ร้าน ตัดสินใจ และอยากมาที่ร้าน",
    status: "พร้อมขาย",
    image: "/images/home/product-project-one.jpg",
    accent: "จากร้านจริงสู่หน้าเว็บ",
  },
  {
    id: "corporate",
    name: "Corporate Site",
    nameTh: "เว็บบริษัท SEO / AEO",
    href: "/corporate/",
    blurb:
      "เว็บไซต์บริษัท 20–30 หน้า โครงสร้างชัด เน้นค้นหาเจอและตอบคำถามธุรกิจได้",
    price: "เริ่มต้น 25,000 บาท",
    status: "พร้อมขาย",
    image: "/images/products/corporate/hero.jpg",
    accent: "สร้างความน่าเชื่อถือ",
  },
  {
    id: "shopguide",
    name: "ShopGuide",
    nameTh: "แชท AI พาสู่สินค้าและ Line OA",
    href: "/shopguide/",
    blurb:
      "เว็บสินค้าที่มีช่องแชทนำทาง คุยกับ AI แล้วพาไปสินค้าที่ต้องการ — เชื่อมต่อ Line OA",
    price: "เริ่มต้น 35,000 บาท + AI รายเดือน",
    status: "พร้อมขาย",
    image: "/images/products/shopguide/sg-hero-bike.jpg",
    accent: "ช่วยลูกค้าเลือกสินค้า",
  },
  {
    id: "partner",
    name: "PuchUp Partner",
    nameTh: "พาร์ทเนอร์ฝ่ายการตลาดออนไลน์",
    href: "/partner/",
    blurb:
      "ให้ PuchUp เป็นฝ่ายการตลาดออนไลน์ของคุณ — สร้างเว็บ จัดระบบ และเดินหน้าไปด้วยกัน",
    price: "รายละเอียดตามข้อตกลง",
    status: "เปิดรับพาร์ทเนอร์",
    image: "/images/products/partner/hero.jpg",
    accent: "เติบโตไปด้วยกัน",
  },
  {
    id: "saledesk",
    name: "SaleDesk",
    nameTh: "ทีมงาน AI สำหรับทีมขาย",
    href: "/sale/",
    blurb:
      "ช่วยทีมขายบันทึกงานเยี่ยม มีเลขา AI และให้ผู้จัดการเห็นงานค้างได้ชัด — เหมาะกับทีมภาคสนาม",
    price: "เริ่มต้น 19,000 บาท + รายเดือนตามทีม",
    status: "พร้อมขาย",
    image: "/images/products/saledesk/hero.jpg",
    accent: "ปิดดีลได้เร็วขึ้น",
  },
  {
    id: "opscraft",
    name: "OpsCraft",
    nameTh: "ออกแบบระบบด้วย AI ตามเคส",
    href: "/opscraft/",
    blurb:
      "ลดงานซ้ำด้วยระบบที่ออกแบบตามวิธีทำงานของธุรกิจคุณ — กรอกข้อมูล สรุปด้วย AI และเก็บในที่เดียว",
    price: "ประเมินตามงาน",
    status: "คุยเคสต่อเคส",
    image: "/images/products/opscraft/hero.jpg",
    accent: "ลดขั้นตอนทำงาน",
  },
];

export const labProducts = [
  {
    name: "คุณเจริญ",
    body: "ระบบช่วยพัฒนาชีวิตและการเงินในชีวิตประจำวัน",
    status: "กำลังพัฒนา",
  },
] as const;

/** Kept for legacy inner pages (build / how-we-work) */
export const buildCards = [
  {
    icon: "🔎",
    title: "ลูกค้าหาของไม่เจอ",
    body: "สร้างระบบช่วยค้นหาและคัดตัวเลือก แทนการให้ลูกค้าไล่ดูข้อมูลเอง",
  },
  {
    icon: "⚖️",
    title: "ลูกค้าเลือกไม่ถูก",
    body: "สร้างระบบช่วยเปรียบเทียบ แนะนำ และตัดสินใจ",
  },
  {
    icon: "💬",
    title: "ลูกค้าต้องโทรถาม",
    body: "สร้างระบบให้ลูกค้าคุย ขอข้อมูล และเริ่มบริการได้ทันที",
  },
  {
    icon: "📅",
    title: "ลูกค้าต้องจอง",
    body: "สร้างระบบจองคิว จองโต๊ะ หรือนัดหมายในบทสนทนา",
  },
  {
    icon: "📥",
    title: "ธุรกิจเสีย Lead ไปกับแชท",
    body: "เปลี่ยนบทสนทนาให้กลายเป็นข้อมูลที่ทีมสามารถนำไปทำงานต่อได้",
  },
  {
    icon: "⚙️",
    title: "ทีมต้องทำงานซ้ำ",
    body: "เชื่อมข้อมูลจากหน้าบ้านเข้ากับ workflow หลังบ้าน",
  },
] as const;

export const processSteps = [
  {
    n: "01",
    title: "Listen",
    body: "ฟังปัญหาจริงของธุรกิจและลูกค้า ก่อนคิดระบบ",
  },
  {
    n: "02",
    title: "Design",
    body: "ออกแบบเส้นทางที่ระบบช่วยได้จริง ไม่ใช่แค่หน้าสวย",
  },
  {
    n: "03",
    title: "Build",
    body: "สร้างเว็บไซต์และระบบให้ทำงานร่วมกัน",
  },
  {
    n: "04",
    title: "Demonstrate",
    body: "ทำให้เห็นผลลัพธ์ก่อนขยาย",
  },
  {
    n: "05",
    title: "Improve",
    body: "ปรับจากข้อมูลและการใช้งานจริง",
  },
] as const;

/** @deprecated Prefer catalogProducts — kept for any leftover imports */
export const featuredDemos = catalogProducts.map((p) => ({
  name: p.name,
  subtitle: p.nameTh,
  href: p.href,
  badge: p.status,
  blurb: p.blurb,
}));
