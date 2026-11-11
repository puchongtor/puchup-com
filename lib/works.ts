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
