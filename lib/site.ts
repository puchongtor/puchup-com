export const site = {
  name: "PuchUp",
  domain: "puchup.com",
  url: "https://puchup.com",
  tagline: "สร้างระบบผู้ช่วยธุรกิจ",
  description:
    "PuchUp สร้างระบบผู้ช่วยธุรกิจ — เว็บไซต์และระบบดิจิทัลที่ช่วยให้ธุรกิจทำงานได้ดีขึ้น",
  email: "hello@puchup.com",
  year: 2026,
  philosophyLines: [
    "PuchUp ไม่ได้แค่สร้างเว็บไซต์",
    "PuchUp สร้างระบบที่ช่วยให้ธุรกิจทำงานได้ดีขึ้น",
  ] as const,
  cta: {
    primary: "เล่าธุรกิจให้ PuchUp ฟัง",
    explore: "ดูสิ่งที่เราสร้าง →",
    understand: "ดูว่า PuchUp ทำงานอย่างไร →",
  },
} as const;

export const navLinks = [
  { href: "/ProjectONE/", label: "Project ONE" },
  { href: "/ProjectONE/Demo/", label: "Demo" },
  { href: "/build/", label: "Build" },
  { href: "/showcase/", label: "Showcase" },
  { href: "/products/", label: "Products" },
  { href: "/how-we-work/", label: "How We Work" },
  { href: "/about/", label: "About" },
] as const;

/** Featured demos shown on homepage + showcase */
export const featuredDemos = [
  {
    name: "Project ONE",
    subtitle: "One Page. Full Business.",
    href: "/ProjectONE/",
    badge: "Product",
    blurb:
      "เว็บไซต์หน้าเดียว ที่ทำให้ลูกค้ารู้จักธุรกิจ ตัดสินใจ และอยากมาที่ร้าน",
  },
  {
    name: "AeroPulse",
    subtitle: "Bike Studio",
    href: "/sites/aeropulse/",
    external: "https://aeropulse.puchup.com",
    badge: "Demo",
    blurb: "ระบบช่วยลูกค้าเลือกจักรยาน แทนการไล่ดูสเปกทีละคัน",
  },
  {
    name: "บ้านข้าวหอม",
    subtitle: "Restaurant Demo",
    href: "/sites/restaurant/",
    badge: "Demo",
    blurb: "อาหารบ้านๆ ที่ทำให้คิดถึงบ้าน — เดโมร้านอาหารไทยโฮมเมดแนว Project ONE",
  },
] as const;

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

export const labProducts = [
  {
    name: "คุณเจริญ",
    body: "ระบบช่วยพัฒนาชีวิตและการเงินในชีวิตประจำวัน",
    status: "กำลังพัฒนา",
  },
  {
    name: "ระบบพัฒนาชีวิตขั้นสูง",
    body: "โครงระบบติดตามเป้าหมาย พลังงาน และวินัยระยะยาว",
    status: "กำลังพัฒนา",
  },
  {
    name: "Vlog AI",
    body: "ระบบช่วยสร้างและจัดระเบียบคอนเทนต์จากชีวิตจริง",
    status: "กำลังพัฒนา",
  },
] as const;
