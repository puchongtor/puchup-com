export type MainProductLink = {
  name: string;
  slug: string;
  summary: string;
  image?: string;
};

/** Sample IndusTech product lines for demo glossary */
export const MAIN_PRODUCTS: MainProductLink[] = [
  {
    name: "ซีลไฮดรอลิก",
    slug: "hydraulic-seals",
    summary: "ซีลและอะไหล่ระบบไฮดรอลิกสำหรับงานโรงงาน",
  },
  {
    name: "สายพานคอนเวเยอร์",
    slug: "conveyor-belt",
    summary: "สายพาน ลูกกลิ้ง และชิ้นส่วนสายพาน",
  },
  {
    name: "อุปกรณ์นิวเมติก",
    slug: "pneumatic",
    summary: "กระบอกสูบ วาล์ว ข้อต่อ และชุดซ่อมนิวเมติก",
  },
];
