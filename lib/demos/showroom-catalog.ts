import {
  allDemoSlugs,
  canonicalDemoSlug as canonicalFromHtml,
  DEMO_SLUG_ALIASES,
} from "@/lib/project-one/slugs";

export type ShowroomItem = {
  name: string;
  kind: string;
  slug: string;
  focus: string;
  img: string;
  live: boolean;
};

export type ShowroomCategory = {
  id: string;
  name: string;
  emoji: string;
  type: string;
  line: string;
  items: ShowroomItem[];
};

function item(
  name: string,
  kind: string,
  slug: string,
  focus: string,
  imgFile: string,
): ShowroomItem {
  return {
    name,
    kind,
    slug,
    focus,
    img: `/images/project-one/${imgFile}`,
    live: true,
  };
}

/**
 * Project ONE showroom — synced with Gemini prototype in Puchup-new / demo.html.
 * All listed demos ship as live HTML under /ProjectONE/[slug]/.
 */
export const SHOWROOM_CATEGORIES: ShowroomCategory[] = [
  {
    id: "food",
    name: "อาหาร & คาเฟ่",
    emoji: "🍜",
    type: "อาหาร",
    line: "รสชาติ ความอร่อย บรรยากาศ และเมนูที่ดึงดูดให้ลูกค้าเดินทางมาหน้าร้าน",
    items: [
      item(
        "บ้านข้าวหอม (ทองหล่อ)",
        "ร้านอาหารไทยโฮมเมดดั้งเดิม",
        "restaurant",
        "12 เมนูซิกเนเจอร์ / รีวิว 3D / จองโต๊ะทาง LINE",
        "rice-hero.webp",
      ),
      item(
        "Komorebi Coffee & Bakes",
        "สเปเชียลตี้คอฟฟี่ & เบเกอรี สุขุมวิท 49",
        "cafe",
        "Slow Bar V60 / สวน Pet-Friendly / Single Origin",
        "cafe-hero.webp",
      ),
      item(
        "Komorebi Bakehouse",
        "คราฟต์เบเกอรีอบสด อารีย์ ซอย 4",
        "bakery",
        "โชคุปังนมสด / ครัวซองต์เนย AOP / ตารางรอบเตา",
        "bakery-hero.webp",
      ),
      item(
        "Le Petit Bakehouse",
        "เค้กวันเกิดสั่งทำ & Custom Cake อารีย์",
        "customcake",
        "เค้กมินิมอล / 3D ฟองดองท์ / สั่งทำล่วงหน้า",
        "cake-hero.webp",
      ),
      item(
        "เตาถ่าน พิซซ่าเฮ้าส์",
        "พิซซ่าเตาฟืนโฮมเมด ประดิพัทธ์-สะพานควาย",
        "pizzeria",
        "แป้งหมัก 48 ชม. / เตาอิฐ 450°C / สปาเกตตีสด",
        "pizza-hero.webp",
      ),
    ],
  },
  {
    id: "health",
    name: "สุขภาพ & ความงาม",
    emoji: "🩺",
    type: "สุขภาพ",
    line: "สร้างความน่าเชื่อถือ แสดงใบอนุญาต และความเชี่ยวชาญของทีมแพทย์",
    items: [
      item(
        "บ้านฟันดี คลินิกทันตกรรม",
        "คลินิกทันตกรรมครอบครัว พระราม 3",
        "dental",
        "คำนวณประกันสังคม 900.- / หมอฟันเด็ก / ทีมทันตแพทย์",
        "dental-hero.webp",
      ),
      item(
        "Aura Elite Aesthetic Clinic",
        "คลินิกเวชกรรมความงาม & เลเซอร์ ทองหล่อ",
        "aesthetic",
        "Oligio ยกกระชับ / Pico Laser / เครื่องแท้ 100%",
        "clinic-hero.webp",
      ),
      item(
        "ReBalance Physical Therapy",
        "คลินิกกายภาพบำบัด & ออฟฟิศซินโดรม",
        "rebalance-physio",
        "ประเมินอาการปวด / เครื่อง Shockwave / กายภาพเฉพาะจุด",
        "physio-hero.webp",
      ),
      item(
        "Optima Vision Care",
        "ร้านแว่นตาทัศนมาตร & เลนส์โปรเกรสซีฟ",
        "optometry",
        "ตรวจวัดสายตา 14 ขั้นตอน / เลนส์เฉพาะบุคคล / กรอบแบรนด์",
        "optic-hero.webp",
      ),
      item(
        "หานชุนถัง คลินิกการแพทย์แผนจีน",
        "คลินิกแพทย์แผนจีน ฝังเข็ม & ยาสมุนไพร",
        "tcmclinic",
        "แมะตรวจชีพจร / ฝังเข็มปรับสมดุล / ครอบแก้วบำบัด",
        "tcm-hero.webp",
      ),
    ],
  },
  {
    id: "stay",
    name: "ที่พัก & นวดสปา",
    emoji: "🏨",
    type: "ที่พัก",
    line: "ส่งต่อบรรยากาศการพักผ่อนที่ประทับใจเพื่อปิดการจองโดยตรง",
    items: [
      item(
        "Baan Bangkok Boutique Hotel",
        "โรงแรมบูทีคริมแม่น้ำเจ้าพระยา",
        "hotel",
        "ห้องพักวิวแม่น้ำ / สระว่ายน้ำ / แพ็กเกจดินเนอร์",
        "hotel-hero.webp",
      ),
      item(
        "ธารา สปา & มาสสาจ",
        "ร้านนวดแผนไทย & สปาอโรมาเธอราพี",
        "massagespa",
        "นวดไทยราชสำนัก / ออยล์สปา / ห้องส่วนตัวคู่รัก",
        "massage-hero.webp",
      ),
    ],
  },
  {
    id: "pets",
    name: "สัตว์เลี้ยง",
    emoji: "🐶",
    type: "สัตว์เลี้ยง",
    line: "สร้างความอุ่นใจและดูแลสัตว์เลี้ยงของลูกค้าอย่างมืออาชีพ",
    items: [
      item(
        "Paw & Co. Pet Store",
        "ศูนย์รวมสินค้าและอาหารสัตว์เลี้ยงพรีเมียม",
        "petstore",
        "อาหารเกรด Holistic / อาบน้ำตัดขน / ของเล่นนำเข้า",
        "pet-hero.webp",
      ),
      item(
        "PetCare Care Center",
        "บริการดูแลสัตว์เลี้ยง & กรูมมิ่ง",
        "petcare",
        "ตัดขนสปา / สระว่ายน้ำสุนัข / ฝากเลี้ยงรายวัน",
        "pet2-hero.webp",
      ),
    ],
  },
  {
    id: "home-services",
    name: "ช่าง & บริการบ้าน/รถ",
    emoji: "🔧",
    type: "บริการบ้าน",
    line: "ประเมินราคาโปร่งใส แจ้งสเต็ปการทำงานชัดเจน สร้างความไว้ใจ",
    items: [
      item(
        "CoolMaster Air Service",
        "บริการล้างแอร์บ้านด่วน บางนา-ศรีนครินทร์",
        "airservice",
        "ล้าง 9 ขั้นตอน / ปูผ้ากันเลอะ 100% / ประกันน้ำไม่หยด 30 วัน",
        "air-hero.webp",
      ),
      item(
        "CurtainCraft Studio",
        "ผ้าม่านสั่งตัด มู่ลี่ & วอลเปเปอร์ ราชพฤกษ์",
        "curtain",
        "วัดพื้นที่ฟรีถึงบ้าน / รีดไอน้ำขึ้นลอน / ม่านมอเตอร์",
        "curtain-hero.webp",
      ),
      item(
        "MasterTech Auto Service",
        "อู่ซ่อมรถยนต์ & ไฮบริด โชคชัย 4",
        "autogarage",
        "ตรวจเช็ก 30 จุดฟรี / ซ่อมแบตไฮบริด / คืนอะไหล่เก่า",
        "garage-hero.webp",
      ),
      item(
        "ProShine Car Wash",
        "ศูนย์ล้างรถ ดูดฝุ่น & เคลือบแก้ว พระราม 3",
        "carwash",
        "โฟม pH Balance / แยกผ้า 5 สี 5 ส่วน / เคลือบเซรามิก 9H",
        "carwash-hero.webp",
      ),
      item(
        "SunShield Film & PPF",
        "ศูนย์ติดตั้งฟิล์มกรองแสงรถยนต์ & PPF กันรอย",
        "windowtint",
        "ฟิล์มเซรามิกกันร้อน 99% / ห้องปลอดฝุ่น / ตัดด้วยคอมพิวเตอร์",
        "tint-hero.webp",
      ),
    ],
  },
  {
    id: "lifestyle",
    name: "ธุรกิจเฉพาะทาง & ไลฟ์สไตล์",
    emoji: "🚴",
    type: "ไลฟ์สไตล์",
    line: "สื่อสารคุณค่า ความเชี่ยวชาญเฉพาะทาง และบริการระดับมืออาชีพ",
    items: [
      item(
        "Velo Union Bicycles",
        "ร้านจักรยานประกอบ ฟิตติ้ง สุขุมวิท 71",
        "bicycle",
        "Custom Bike Build / Dynamic Fitting / ล้างชุดขับ Ultrasonic",
        "bike-hero.webp",
      ),
      item(
        "Apex Accounting Service",
        "สำนักงานบัญชี SME & รับจดบริษัท สาทร",
        "accounting",
        "ทำบัญชีรายเดือน / วางแผนภาษีออนไลน์ / จดบริษัท DBD",
        "accounting-hero.webp",
      ),
      item(
        "Craft & Clay Art Space",
        "สตูดิโอศิลปะเด็ก & เซรามิกผู้ใหญ่ อารีย์",
        "artstudio",
        "ปั้นดินแป้นหมุน / เวิร์กช็อปสีน้ำ / คลาสกลุ่มเล็ก",
        "craft-hero.webp",
      ),
      item(
        "Tara Florist Studio",
        "สตูดิโอดอกไม้สด & ช่อดอกไม้ดีไซน์พรีเมียม",
        "florist",
        "ดอกไม้นำเข้าสดใหม่ / ดีไซน์ช่อตามโอกาส / ส่งด่วนใน 2 ชม.",
        "florist-hero.webp",
      ),
      item(
        "Auspicious Stone Gallery",
        "แกลเลอรีหินมงคลแท้ & อัญมณีเสริมดวง",
        "stone",
        "หินแท้คัดเกรดพลังงาน / ออกแบบตามวันเกิด / ใบรับรองแล็บ",
        "stone-hero.webp",
      ),
      item(
        "PrintCraft Pro Express",
        "โรงพิมพ์ดิจิทัลด่วน นามบัตร & แพ็กเกจจิ้ง",
        "printing",
        "พิมพ์ดิจิทัลออฟเซต / ปั๊มฟอยล์ทอง / ส่งงานด่วนใน 24 ชม.",
        "print-hero.webp",
      ),
      item(
        "iFix Pro Express Service",
        "ศูนย์ซ่อมมือถือด่วน เปลี่ยนจอ & แบตเตอรี่",
        "phonerepair",
        "ซ่อมเสร็จใน 30 นาที / อะไหล่แท้รับประกัน 1 ปี / ตรวจฟรี",
        "repair-hero.webp",
      ),
      item(
        "Clean & Care Express",
        "ร้านซักอบรีด & สปาซักแห้งพรีเมียม",
        "laundry",
        "ซักแห้งชุดสูท-ราตรี / น้ำยาถนอมเนื้อผ้า / บริการรับส่งถึงบ้าน",
        "laundry-hero.webp",
      ),
      item(
        "CoreFlow Pilates Studio",
        "สตูดิโอพิลาทิส Reformer & โยคะกลุ่มเล็ก",
        "pilates",
        "เครื่อง Reformer มาตรฐาน / ปรับสรีระแก้อาการ / ครูประกบชิด",
        "pilates-hero.webp",
      ),
      item(
        "Singha Muay Thai Gym",
        "ค่ายมวยไทยออกกำลังกาย & ฟิตเนสเทรนเนอร์",
        "muaythaigym",
        "เวทีมวยมาตรฐาน / เผาผลาญไขมันเข้มข้น / ครูมวยมืออาชีพ",
        "gym-hero.webp",
      ),
    ],
  },
];

export const SHOWROOM_FILTERS = [
  { type: "all", label: "ทั้งหมด" },
  { type: "อาหาร", label: "อาหาร & คาเฟ่" },
  { type: "สุขภาพ", label: "สุขภาพ & ความงาม" },
  { type: "ที่พัก", label: "ที่พัก & นวดสปา" },
  { type: "สัตว์เลี้ยง", label: "สัตว์เลี้ยง" },
  { type: "บริการบ้าน", label: "ช่าง & บริการบ้าน/รถ" },
  { type: "ไลฟ์สไตล์", label: "ธุรกิจเฉพาะทาง & ไลฟ์สไตล์" },
] as const;

export const LIVE_DEMO_SLUGS = allDemoSlugs();

export const SLUG_ALIASES: Record<string, string> = { ...DEMO_SLUG_ALIASES };

export function canonicalDemoSlug(slug: string): string {
  return canonicalFromHtml(slug);
}

export function allShowroomItems(): ShowroomItem[] {
  return SHOWROOM_CATEGORIES.flatMap((c) => c.items);
}

export function findShowroomItem(slug: string): ShowroomItem | undefined {
  const canonical = canonicalDemoSlug(slug);
  return allShowroomItems().find((row) => row.slug === canonical);
}

export function liveShowroomItems(): ShowroomItem[] {
  return allShowroomItems().filter((row) => row.live);
}

export function projectOneHref(slug: string): string {
  return `/ProjectONE/${canonicalDemoSlug(slug)}/`;
}

export type CmsDemoLink = {
  slug: string;
  title?: string;
  businessType?: string;
  published?: boolean;
  architectureStack?: string;
  heroImageUrl?: string | null;
};

const CMS_TYPE_LABEL: Record<string, string> = {
  restaurant: "ร้านอาหาร",
  health: "คลินิก / สุขภาพ",
  hotel: "ที่พัก",
  pets: "สัตว์เลี้ยง",
  plants: "ดอกไม้ / สวน",
  retail: "ค้าปลีก",
  other: "ธุรกิจ",
};

export function mergeShowroomWithCms(
  cms: CmsDemoLink[] | null | undefined,
): ShowroomCategory[] {
  const list = cms ?? [];
  const bySlug = new Map(
    list.map((row) => [canonicalDemoSlug(row.slug), row] as const),
  );
  const cmsIsSource = list.length > 0;

  return SHOWROOM_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.map((row) => {
      const hit = bySlug.get(row.slug);
      if (!hit) {
        return { ...row, live: cmsIsSource ? row.live : row.live };
      }
      return {
        ...row,
        name: hit.title || row.name,
        kind: hit.businessType
          ? CMS_TYPE_LABEL[hit.businessType] || hit.businessType
          : row.kind,
        focus: hit.architectureStack || row.focus,
        img: hit.heroImageUrl || row.img,
        live: hit.published !== false,
      };
    }),
  }));
}

export function liveItemsFromCategories(
  categories: ShowroomCategory[],
): ShowroomItem[] {
  return categories.flatMap((cat) => cat.items).filter((row) => row.live);
}
