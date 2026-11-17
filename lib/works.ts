export type RealWork = {
  id: string;
  name: string;
  nameTh: string;
  url: string;
  category: string;
  summary: string;
  focus: string[];
  image: string;
  productLink?: { href: string; label: string };
};

/** Live client sites only — demos stay elsewhere until ready to merge */
export const realWorks: RealWork[] = [
  {
    id: "baandental",
    name: "Baan Dental",
    nameTh: "บ้านทันตแพทย์ · สาธุประดิษฐ์ / พระราม 3",
    url: "https://www.baandental.com/",
    category: "Project ONE · Local SEO",
    summary:
      "คลินิกทันตกรรมหลายหน้า เน้น SEO ท้องถิ่น — บริการ อัตราค่ารักษา ทีมแพทย์ วิธีมาคลินิก และ Google Business",
    focus: ["ไม่เกิน 10 หน้าหลัก", "เนื้อหา SEO เข้ม", "Google Business", "LINE / นัดหมาย"],
    image: "/images/works/baandental.jpg",
    productLink: { href: "/ProjectONE/", label: "แนว Project ONE" },
  },
  {
    id: "parts-puchup",
    name: "Parts.PuchUp",
    nameTh: "แพลตฟอร์มหาอะไหล่และชิ้นส่วนอุตสาหกรรม",
    url: "https://parts.puchup.com/",
    category: "Partner · Parts Platform",
    summary:
      "แพลตฟอร์มหาอะไหล่โรงงานให้ตรงรุ่น — ค้นชื่อสินค้า เทียบหลายร้าน คุยกับผู้ช่วยพาร์ท แล้วส่งต่อไปร้านพาร์ทเนอร์",
    focus: ["ค้นหารุ่นตรง", "เทียบหลายร้าน", "แชทผู้ช่วย", "พาร์ทเนอร์ร้าน"],
    image: "/images/works/parts-puchup.jpg",
    productLink: { href: "/partner/", label: "แนว Partner" },
  },
  {
    id: "advancepro",
    name: "Advance Pro",
    nameTh: "อะไหล่เครื่องจักรอุตสาหกรรม",
    url: "https://www.advancepro-th.com/",
    category: "Corporate · B2B Catalog",
    summary:
      "เว็บบริษัทอุตสาหกรรมเต็มระบบ ค้นหาสินค้า แคตตาล็อกแบรนด์ บริการซ่อมสร้าง และช่องทางติดต่อปิดการขาย",
    focus: ["โครงสร้างหลายหน้า", "แคตตาล็อกสินค้า", "SEO ธุรกิจ B2B", "LINE / โทร"],
    image: "/images/works/advancepro.png",
    productLink: { href: "/corporate/", label: "แนว Corporate Site" },
  },
  {
    id: "amethez",
    name: "Amethez",
    nameTh: "อาณาจักรความรู้คริสตัล",
    url: "https://amethez.com/",
    category: "Content · Shop · Community",
    summary:
      "แพลตฟอร์มความรู้หินคริสตัล รวมสารานุกรม บทความ ร้านค้า และพาร์ทเนอร์ — ค้นหาและสำรวจได้ในที่เดียว",
    focus: ["คอนเทนต์หนาแน่น", "ค้นหา / กรอง", "ร้านค้า", "พาร์ทเนอร์"],
    image: "/images/works/amethez.png",
    productLink: { href: "/partner/", label: "แนว Partner" },
  },
  {
    id: "rabiangprai",
    name: "Rabiangprai Valley",
    nameTh: "ระเบียงไพรแวลลีย์ นครนายก",
    url: "https://www.rabiangprai.com/",
    category: "Hospitality · Booking",
    summary:
      "เว็บที่พักรีสอร์ทกลางหุบเขา โชว์บรรยากาศ ห้องพัก ลานกางเต็นท์ สัมมนา พร้อมปุ่มจองชัดเจน",
    focus: ["Hero ภาพจริง", "จองห้องพัก", "ห้อง / กิจกรรม", "ติดต่อ Line"],
    image: "/images/works/rabiangprai.png",
    productLink: { href: "/ProjectONE/", label: "แนวเว็บธุรกิจ" },
  },
];
