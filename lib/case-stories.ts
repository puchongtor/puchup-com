/**
 * Case Stories — measurable results from live work.
 *
 * แนวทาง: แต่ละช่วงเวลา = บทความใหม่ (อย่าแก้บทเดิมให้ยาวขึ้นเรื่อยๆ)
 * เช่น ช่วงเปิดตัว → อัปเดตเดือนที่ 1 → อัปเดตไตรมาส
 * ใช้ seriesKey เดียวกันเพื่อเชื่อมเป็นชุดติดตามผล
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
  /** ชุดติดตามผลของเว็บ/ลูกค้าเดียวกัน */
  seriesKey: string;
  /** ลำดับตอนในชุด (1 = เปิดตัว, 2 = เดือนถัดไป, …) */
  chapter: number;
  /** ป้ายช่วงเวลา เช่น "1 สัปดาห์หลังทำเว็บเสร็จ" / "หลังทำเว็บครบ 1 เดือน" */
  chapterLabel: string;
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
      "บ้านทันตแพทย์: 1 สัปดาห์หลังทำเว็บเสร็จ — ติดค้นหาท้องถิ่นและมีคนทักไลน์เพื่อนัด",
    excerpt:
      "ผลในช่วงสัปดาห์แรกหลังขึ้นเว็บ — คำค้นฟัน + สาธุประดิษฐ์ ส่วนใหญ่ติดหน้า 1 และมีผู้สนใจทัก LINE OA",
    client: "บ้านทันตแพทย์",
    product: "Project ONE · Local SEO",
    productHref: "/ProjectONE/",
    location: "สาธุประดิษฐ์ · ยานนาวา · พระราม 3",
    publishedLabel: "พ.ย. 2026",
    seriesKey: "baandental",
    chapter: 1,
    chapterLabel: "1 สัปดาห์หลังทำเว็บเสร็จ",
    cover: "/images/cases/baandental/cover.jpg",
    siteUrl: "https://www.baandental.com/",
    stats: [
      { label: "ระยะเวลาหลังขึ้นเว็บ", value: "3–4 วัน", note: "ยังไม่ถึง 1 สัปดาห์" },
      { label: "การแสดงผล (24 ชม.)", value: "149", note: "Google Search Console" },
      { label: "คลิกเข้าเว็บ (24 ชม.)", value: "3", note: "ช่วงเดียวกัน" },
      { label: "ทัก LINE OA", value: "3 คน", note: "สอบถามเพื่อนัดหมาย" },
      { label: "PageSpeed มือถือ", value: "100", note: "Performance · SEO 100" },
    ],
    tags: ["Local SEO", "คลินิกทันตกรรม", "ความเร็วเว็บ", "Google Business"],
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
        text: "คุณภาพเว็บ: ความเร็ว + พร้อม SEO",
      },
      {
        type: "p",
        text: "นอกจากผลค้นหา เราวัดคุณภาพหน้าเว็บบนมือถือด้วย PageSpeed Insights ด้วย — คะแนน Performance / SEO / Best Practices อยู่ที่ 100 และ Accessibility 96 โดย LCP ประมาณ 0.9 วินาที และ CLS เป็น 0",
      },
      {
        type: "p",
        text: "จุดนี้สำคัญกับธุรกิจท้องถิ่นเพราะลูกค้าส่วนใหญ่เปิดจากมือถือตอนกำลังตัดสินใจ ถ้าระบบช้าหรือโครงสร้างไม่พร้อม SEO การติดอันดับและการทักจะเสียโอกาสแม้เนื้อหาดี",
      },
      {
        type: "figure",
        src: "/images/cases/baandental/pagespeed-framed.jpg",
        alt: "PageSpeed Insights มือถือของ baandental.com คะแนน Performance 100",
        caption: "PageSpeed Insights · มือถือ — Performance 100 · SEO 100 · LCP 0.9s · CLS 0",
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
        text: "หมายเหตุ: ตัวเลขด้านบนเป็นผลในช่วงสัปดาห์แรกหลังขึ้นเว็บ ไม่การันตีผลแบบเดียวกันทุกธุรกิจ — เมื่อมีข้อมูลช่วงถัดไป เช่น หลังทำเว็บครบ 1 เดือน จะเขียนบทความใหม่แยก ไม่มาอัดรวมในหน้านี้",
      },
    ],
  },
  {
    slug: "advancepro-launch-product-keywords",
    title: "Advance Pro — Launch window: product keywords and first quotes",
    titleTh:
      "Advance Pro: 3 สัปดาห์หลังทำเว็บเสร็จ — คำค้นสินค้าขึ้นหน้า 1 มีทัก LINE และเปิดใบเสนอราคาได้",
    excerpt:
      "ผลในช่วง 3 สัปดาห์หลังขึ้นเว็บ — วัดจากคำที่ลูกค้าค้นจริง (ไม่ใช่ชื่อบริษัท) มีทัก LINE 20+ และเริ่มเปิดใบเสนอราคาหลายบริษัท",
    client: "Advance Pro",
    product: "Corporate Site · B2B Catalog",
    productHref: "/corporate/",
    location: "ประเทศไทย · ธุรกิจอุตสาหกรรม",
    publishedLabel: "พ.ย. 2026",
    seriesKey: "advancepro",
    chapter: 1,
    chapterLabel: "3 สัปดาห์หลังทำเว็บเสร็จ",
    cover: "/images/cases/advancepro/cover.jpg",
    siteUrl: "https://www.advancepro-th.com/",
    stats: [
      { label: "คำค้นสินค้าขึ้นหน้า 1", value: "1–2 สัปดาห์", note: "วัดจาก keyword ลูกค้าจริง" },
      { label: "ทัก LINE OA", value: "20+", note: "ภายใน 3 สัปดาห์" },
      { label: "เปิดใบเสนอราคา", value: "หลายบริษัท", note: "ภายใน 3 สัปดาห์" },
      { label: "คลิกจากค้นหา", value: "64", note: "ช่วง 3 สัปดาห์ · GSC" },
    ],
    tags: ["Corporate", "B2B", "คำค้นสินค้า", "LINE OA", "ใบเสนอราคา"],
    blocks: [
      {
        type: "p",
        text: "รายงานนี้สรุปผลในช่วง 3 สัปดาห์หลังทำเว็บเสร็จของ Advance Pro — เมื่อมีข้อมูลช่วงถัดไป เช่น หลังทำเว็บครบ 1 เดือน จะเขียนบทความใหม่แยก ไม่นำมาอัดรวมในหน้านี้",
      },
      {
        type: "p",
        text: "Advance Pro เป็นเว็บบริษัทอะไหล่และงานอุตสาหกรรม ที่ต้องให้ลูกค้าหาสินค้า/แบรนด์เจอ แล้วสอบถามต่อได้",
      },
      {
        type: "figure",
        src: "/images/cases/advancepro/about-page-framed.jpg",
        alt: "หน้าเกี่ยวกับเราของ Advance Pro Products",
        caption: "โครงเว็บบริษัทที่รองรับแคตตาล็อกสินค้าและช่องทางติดต่อ",
      },
      {
        type: "h2",
        text: "วัดจากคำที่ลูกค้าค้นจริง — ไม่ใช่ชื่อบริษัท",
      },
      {
        type: "p",
        text: "ชื่อองค์กรมักติดได้อยู่แล้ว จึงไม่ใช้เป็นตัวชี้วัดหลัก สิ่งที่สำคัญกว่าคือคำที่ลูกค้าพิมพ์ตอนต้องการสินค้า เช่น ชื่อรุ่น แบรนด์ชิ้นส่วน หรือชื่อเครื่อง",
      },
      {
        type: "p",
        text: "ภายในประมาณ 1–2 สัปดาห์แรก คำค้นสินค้าหลายคำโผล่หน้า 1 เช่น ek chain, เครื่องพ่นน้ำแข็งแห้ง, pras และ tokimec",
      },
      {
        type: "ul",
        items: [
          "ek chain → หน้าสินค้าโซ่อุตสาหกรรม",
          "เครื่องพ่นน้ำแข็งแห้ง → หน้า Dry Ice Rocket",
          "pras → หน้าสปริงและชิ้นส่วนงานอาหาร",
          "tokimec → หน้าปั๊มและวาล์วไฮดรอลิก",
        ],
      },
      {
        type: "figure",
        src: "/images/cases/advancepro/serp-ek-chain-framed.jpg",
        alt: "ผลการค้นหา Google คำว่า ek chain",
        caption: "“ek chain” — โผล่หน้าผลค้นหาของ Advance Pro",
      },
      {
        type: "figure",
        src: "/images/cases/advancepro/serp-dry-ice-framed.jpg",
        alt: "ผลการค้นหา Google คำว่า เครื่องพ่นน้ำแข็งแห้ง",
        caption: "“เครื่องพ่นน้ำแข็งแห้ง” — หน้าสินค้า Dry Ice Rocket",
      },
      {
        type: "figure",
        src: "/images/cases/advancepro/serp-pras-framed.jpg",
        alt: "ผลการค้นหา Google คำว่า pras",
        caption: "“pras” — หน้าสินค้า PRAS FOOD",
      },
      {
        type: "figure",
        src: "/images/cases/advancepro/serp-tokimec-framed.jpg",
        alt: "ผลการค้นหา Google คำว่า tokimec",
        caption: "“tokimec” — หน้าแบรนด์/สินค้า TOKIMEC",
      },
      {
        type: "h2",
        text: "จากค้นหาสู่การทัก และการเปิดใบเสนอราคา",
      },
      {
        type: "p",
        text: "ใน 3 สัปดาห์แรก มีผู้ทัก LINE OA สอบสินค้ามากกว่า 20 คน และเปิดใบเสนอราคาให้หลายบริษัทได้แล้ว — เว็บกลายเป็นช่องทางเปิดโอกาสขายเร็ว ไม่ใช่แค่มีตัวตนออนไลน์",
      },
      {
        type: "h2",
        text: "สัญญาณ Search Console ในช่วง 3 สัปดาห์",
      },
      {
        type: "p",
        text: "ในช่วงนี้มีประมาณ 64 คลิก และราว 2.2 พันครั้งของการแสดงผล อันดับเฉลี่ยราว 7.6 — สอดคล้องกับการมีหน้าสินค้า/แบรนด์ถูกคลิก ไม่กระจุกแค่โฮมเพจ",
      },
      {
        type: "figure",
        src: "/images/cases/advancepro/gsc-performance-framed.jpg",
        alt: "กราฟ Search Console การคลิกและการแสดงผล",
        caption: "Search Console · ช่วง 3 สัปดาห์ — ประมาณ 64 คลิก · 2.2K การแสดงผล",
      },
      {
        type: "h2",
        text: "โครงสร้างและคุณภาพเว็บในช่วงนี้",
      },
      {
        type: "p",
        text: "ไซต์แมปค้นพบราว 893 หน้า · PageSpeed มือถือ Performance 92 / SEO 100 · เดสก์ท็อป Performance 99 / SEO 100 — รายละเอียดช่วงยาวขึ้นจะอัปเดตในบทความถัดไปเมื่อมีข้อมูลใหม่",
      },
      {
        type: "figure",
        src: "/images/cases/advancepro/gsc-sitemap-framed.jpg",
        alt: "สถานะ sitemap พบ 893 หน้า",
        caption: "Sitemap — สำเร็จ · หน้าที่ค้นพบ 893 หน้า",
      },
      {
        type: "figure",
        src: "/images/cases/advancepro/pagespeed-mobile-framed.jpg",
        alt: "PageSpeed มือถือ Performance 92",
        caption: "มือถือ — Performance 92 · SEO 100",
      },
      {
        type: "p",
        text: "หมายเหตุ: ผลในช่วง 3 สัปดาห์หลังขึ้นเว็บขึ้นกับสินค้า การแข่งขันของคำค้น และทีมขาย — ไม่การันตีเหมือนกันทุกเคส เมื่อครบ 1 เดือนจะอัปเดตเป็นบทความใหม่แยก",
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

export function getSeriesStories(seriesKey: string): CaseStory[] {
  return caseStories
    .filter((c) => c.seriesKey === seriesKey)
    .sort((a, b) => a.chapter - b.chapter);
}
