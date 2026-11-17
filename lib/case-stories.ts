/**
 * Case Stories — measurable results from live work.
 * Add new entries here over time (same client site can get follow-up stories).
 */

export type CaseStat = {
  label: string;
  value: string;
  note?: string;
};

export type CaseBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | {
      type: "figure";
      src: string;
      alt: string;
      caption?: string;
    };

export type CaseStory = {
  slug: string;
  title: string;
  titleTh: string;
  excerpt: string;
  client: string;
  product: string;
  productHref: string;
  location?: string;
  publishedLabel: string;
  cover: string;
  siteUrl?: string;
  stats: CaseStat[];
  tags: string[];
  blocks: CaseBlock[];
};

export const caseStories: CaseStory[] = [
  {
    slug: "baandental-local-seo-first-week",
    title: "Baan Dental — Local search traction in the first week",
    titleTh:
      "บ้านทันตแพทย์: เปิดเว็บไม่ถึงสัปดาห์ ติดการค้นหาท้องถิ่นและมีคนทักไลน์เพื่อนัด",
    excerpt:
      "คลินิกทันตกรรมย่านสาธุประดิษฐ์ขึ้นเว็บใหม่พร้อมโครงสร้าง Local SEO — ภายใน 3–4 วัน คำค้นฟัน + สาธุประดิษฐ์ ส่วนใหญ่ติดหน้า 1 (บางคำหน้า 2) และมีผู้สนใจทัก LINE OA",
    client: "บ้านทันตแพทย์",
    product: "Project ONE · Local SEO",
    productHref: "/ProjectONE/",
    location: "สาธุประดิษฐ์ · ยานนาวา · พระราม 3",
    publishedLabel: "พ.ย. 2026",
    cover: "/images/cases/baandental/cover.jpg",
    siteUrl: "https://www.baandental.com/",
    stats: [
      { label: "ระยะเวลาหลังขึ้นเว็บ", value: "3–4 วัน", note: "ยังไม่ถึง 1 สัปดาห์" },
      { label: "การแสดงผล (24 ชม.)", value: "149", note: "Google Search Console" },
      { label: "คลิกเข้าเว็บ (24 ชม.)", value: "3", note: "ช่วงเดียวกัน" },
      { label: "ทัก LINE OA", value: "3 คน", note: "สอบถามเพื่อนัดหมาย" },
    ],
    tags: ["Local SEO", "คลินิกทันตกรรม", "Google Business", "LINE OA"],
    blocks: [
      {
        type: "p",
        text: "บ้านทันตแพทย์เป็นคลินิกใกล้บ้านย่านสาธุประดิษฐ์ ที่ต้องการให้คนในพื้นที่ค้นหาเจอ เชื่อถือ และทักไลน์นัดได้โดยไม่ต้องพึ่งโฆษณาหนักในวันแรก",
      },
      {
        type: "p",
        text: "งานนี้ใช้แนว Project ONE แบบขยายเนื้อหา SEO ท้องถิ่น — มีหน้าบริการ อัตราค่ารักษา ทีมแพทย์ แผนที่/วิธีมาคลินิก และจุดเชื่อมไป LINE กับโทรชัดเจน พร้อมป้ายหน้าร้านสำหรับรีวิว Google และเพิ่มเพื่อน LINE",
      },
      {
        type: "figure",
        src: "/images/cases/baandental/website-hero.png",
        alt: "หน้าแรกเว็บบ้านทันตแพทย์",
        caption: "หน้าเว็บที่ออกแบบให้คนไข้เข้าใจตำแหน่ง แผนรักษา และช่องทางนัดได้เร็ว",
      },
      {
        type: "h2",
        text: "ผลในช่วงวันแรกๆ",
      },
      {
        type: "p",
        text: "หลังขึ้นเว็บประมาณ 3–4 วัน คำค้นแนว “ทำฟัน / หมอฟัน / คลินิก” คู่กับย่านสาธุประดิษฐ์ ส่วนใหญ่โผล่หน้า 1 — บางคำอยู่หน้า 2 ซึ่งสำหรับกลุ่มคำท้องถิ่นที่ใช้ค้นบ่อย ถือว่าเร็วกว่าที่คาดไว้ในช่วงเปิดตัว",
      },
      {
        type: "ul",
        items: [
          "หมอฟัน สาธุประดิษฐ์ → หน้า 1",
          "ร้านหมอฟัน สาธุประดิษฐ์ → หน้า 1",
          "คลินิกทำฟัน สาธุประดิษฐ์ → หน้า 1",
          "ถอนฟัน สาธุประดิษฐ์ → หน้า 1",
          "รักษารากฟัน สาธุประดิษฐ์ → หน้า 1",
          "คลินิกบ้านทันตแพทย์ (ชื่อแบรนด์) → หน้า 1",
        ],
      },
      {
        type: "p",
        text: "จุดที่น่าสนใจคือไม่ได้ติดแค่ชื่อคลินิกอย่างเดียว แต่ครอบคลุมทั้งคำค้นทั่วไปในพื้นที่ และคำค้นบริการเฉพาะทางคู่โลเคชัน — ทำให้คนที่กำลังหาหมอฟันแถวสาธุมีโอกาสเจอหลายเส้นทาง",
      },
      {
        type: "figure",
        src: "/images/cases/baandental/serp-morfun.png",
        alt: "ผลการค้นหา Google หมอฟัน สาธุประดิษฐ์",
        caption: "“หมอฟัน สาธุประดิษฐ์” — โผล่หน้า 1",
      },
      {
        type: "figure",
        src: "/images/cases/baandental/serp-ran-morfun.png",
        alt: "ผลการค้นหา Google ร้านหมอฟัน สาธุประดิษฐ์",
        caption: "“ร้านหมอฟัน สาธุประดิษฐ์” — โผล่หน้าแผนที่/วิธีมาคลินิก",
      },
      {
        type: "figure",
        src: "/images/cases/baandental/serp.png",
        alt: "ผลการค้นหา Google คลินิกทำฟัน สาธุประดิษฐ์",
        caption: "“คลินิกทำฟัน สาธุประดิษฐ์” — ติดช่วงต้นของผลการค้นหา",
      },
      {
        type: "figure",
        src: "/images/cases/baandental/serp-thonfun.png",
        alt: "ผลการค้นหา Google ถอนฟัน สาธุประดิษฐ์",
        caption: "“ถอนฟัน สาธุประดิษฐ์” — คำค้นบริการ + พื้นที่ ติดหน้า 1",
      },
      {
        type: "figure",
        src: "/images/cases/baandental/serp-raksarak.png",
        alt: "ผลการค้นหา Google รักษารากฟัน สาธุประดิษฐ์",
        caption: "“รักษารากฟัน สาธุประดิษฐ์” — หน้าถามคุณหมอโผล่คู่กับคำค้นบริการ",
      },
      {
        type: "figure",
        src: "/images/cases/baandental/serp-brand.png",
        alt: "ผลการค้นหา Google คลินิกบ้านทันตแพทย์",
        caption: "“คลินิกบ้านทันตแพทย์” — คำค้นชื่อแบรนด์ติดหน้า 1",
      },
      {
        type: "p",
        text: "ในหน้าต่าง 24 ชั่วโมงของ Google Search Console มีการแสดงผล 149 ครั้ง และมีคลิกเข้าเว็บ 3 ครั้ง ค่าเฉลี่ยอันดับในช่วงนั้นยังอยู่ในช่วงกำลังไต่ — สำคัญคือมีสัญญาณว่าคนในพื้นที่เริ่มเห็นและกดเข้ามาแล้ว",
      },
      {
        type: "figure",
        src: "/images/cases/baandental/gsc-24h.png",
        alt: "Google Search Console 24 ชั่วโมงของ baandental.com",
        caption: "ข้อมูล Search Console ช่วง 24 ชั่วโมง: 149 การแสดงผล · 3 คลิก",
      },
      {
        type: "h2",
        text: "จากค้นหาสู่การทักไลน์",
      },
      {
        type: "p",
        text: "ในช่วงเดียวกัน มีผู้สนใจทัก LINE OA ของคลินิก 3 ท่าน โดยเนื้อหาการสนทนาเป็นแนวสอบถามวันว่างและช่องทางนัด — ไม่ใช่ข้อความสุ่ม แต่เป็นคนที่กำลังตัดสินใจใช้บริการ",
      },
      {
        type: "figure",
        src: "/images/cases/baandental/line-inbox.png",
        alt: "ข้อความสอบถามนัดหมายใน LINE OA",
        caption: "ตัวอย่างกล่องข้อความ LINE OA (ปกปิดข้อมูลส่วนบุคคล) — มีการสอบถามเพื่อนัด",
      },
      {
        type: "h2",
        text: "เชื่อมหน้าร้านกับออนไลน์",
      },
      {
        type: "p",
        text: "นอกจากเว็บและโครงสร้างค้นหา ทีมยังจัดทำป้ายอะคริลิกสำหรับหน้าร้าน — ชุดรีวิว 5 ดาวบน Google และชุดเพิ่มเพื่อน LINE — เพื่อให้คนไข้ที่มาคลินิกช่วยส่งสัญญาณความน่าเชื่อถือกลับเข้าสู่ระบบค้นหาและช่องทางนัดต่อเนื่อง",
      },
      {
        type: "figure",
        src: "/images/cases/baandental/standee-review.jpg",
        alt: "ป้ายรีวิว Google 5 ดาวของบ้านทันตแพทย์",
        caption: "ป้ายรีวิว Google สำหรับตั้งหน้าร้าน",
      },
      {
        type: "figure",
        src: "/images/cases/baandental/standee-line.jpg",
        alt: "ป้ายเพิ่มเพื่อน LINE OA บ้านทันตแพทย์",
        caption: "ป้ายเพิ่มเพื่อน LINE OA @baandental",
      },
      {
        type: "h2",
        text: "ขั้นต่อไป",
      },
      {
        type: "ul",
        items: [
          "เก็บและขยายคีย์เวิร์ดท้องถิ่นให้ละเอียดขึ้นตามคำค้นจริง",
          "ดูแลเนื้อหาหน้าบริการและแผนที่ให้สอดคล้องกับพฤติกรรมคนไข้",
          "ติดตาม Search Console และคุณภาพการทักไลน์อย่างต่อเนื่อง",
        ],
      },
      {
        type: "p",
        text: "หมายเหตุ: ผลลัพธ์ขึ้นกับพื้นที่ การแข่งขันของคำค้น และช่วงเวลา — ตัวเลขด้านบนเป็นข้อมูลช่วงเปิดตัวของเคสนี้ ไม่ใช่การรับประกันผลแบบเดียวกันทุกธุรกิจ",
      },
    ],
  },
];

export function getCaseStory(slug: string): CaseStory | undefined {
  return caseStories.find((c) => c.slug === slug);
}

export function allCaseSlugs(): string[] {
  return caseStories.map((c) => c.slug);
}
