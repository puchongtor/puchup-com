export const site = {
  name: "PuchUp",
  domain: "puchup.com",
  url: "https://www.puchup.com",
  tagline: "Level up your business",
  description:
    "PuchUp สร้างระบบที่ช่วยให้ธุรกิจถูกค้นหาเจอ ได้ลูกค้าจริง และปิดการขายได้เร็วขึ้น — ไม่ใช่แค่เว็บโชว์",
  email: "hello@puchup.com",
  year: 2026,
  philosophyLines: [
    "PuchUp ไม่ได้แค่สร้างเว็บไซต์ไว้โชว์",
    "PuchUp สร้างระบบที่ช่วยให้ธุรกิจถูกค้นหาเจอ และได้ลูกค้าจริง",
  ] as const,
  cta: {
    primary: "คุยกับ PuchUp",
    explore: "ดูสินค้าทั้งหมด",
    understand: "ดูว่า PuchUp ทำงานอย่างไร →",
  },
} as const;

export type NavChild = {
  href: string;
  label: string;
  note?: string;
};

export type NavLink = {
  href: string;
  label: string;
  children?: NavChild[];
};

/** Slim primary navigation — Products / Showcase มีเมนูย่อยหาทางลัดได้ */
export const navLinks: NavLink[] = [
  {
    href: "/products/",
    label: "Products",
    children: [
      { href: "/ProjectONE/", label: "Project ONE", note: "หาลูกค้าหน้าร้าน" },
      { href: "/corporate/", label: "Corporate Site", note: "เว็บบริษัท SEO" },
      { href: "/shopguide/", label: "ShopGuide", note: "แชท AI × สินค้า" },
      { href: "/sale/", label: "SaleDesk", note: "ทีมขาย AI" },
      { href: "/partner/", label: "Partner", note: "พาร์ทเนอร์การตลาด" },
      { href: "/opscraft/", label: "OpsCraft", note: "ระบบตามเคส" },
    ],
  },
  {
    href: "/showcase/",
    label: "Showcase",
    children: [
      { href: "/showcase/results/", label: "ผลงานที่เห็นผล", note: "รายงานตามช่วงเวลา" },
      { href: "/showcase/project-one/", label: "Project ONE Demo", note: "ตัวอย่างหลายธุรกิจ" },
      { href: "/showcase/aeropulse/", label: "ShopGuide Demo", note: "AeroPulse" },
      { href: "/showcase/", label: "ดู Showcase ทั้งหมด" },
    ],
  },
  { href: "/guides/", label: "Guides" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
];

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
    nameTh: "ระบบหาลูกค้าหน้าร้าน × Google Business",
    href: "/ProjectONE/",
    blurb:
      "ไม่ใช่เว็บโชว์ — เป็นระบบให้คนในย่านค้นหาเจอ แล้วโทร LINE หรือมาที่ร้าน จากหน้าเดียวถึง Local SEO Plus ไม่เกิน 40 หน้า",
    price: "เริ่มต้น 9,900 บาท",
    status: "พร้อมขาย",
    image: "/images/home/product-project-one.jpg",
    accent: "ค้นหาเจอ ได้ลูกค้าจริง",
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
