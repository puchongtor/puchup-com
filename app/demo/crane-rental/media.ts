import { areaContent } from "./areas";

export const mediaPath = "/images/demos/crane-rental/";

export const photo = {
  crane: ["mobile-crane.webp", "รถเครนเคลื่อนที่สีส้มหน้าโกดัง"],
  truck: ["truck-loader.webp", "รถบรรทุกพื้นเรียบติดเครนพับสีส้ม"],
  compactCrane: ["crane-compact.webp", "รถเครนเคลื่อนที่ขนาดกะทัดรัดที่ลานขนถ่าย"],
  allTerrainCrane: ["crane-all-terrain.webp", "รถเครนเคลื่อนที่ในไซต์อาคารโครงเหล็ก"],
  heavyCrane: ["crane-heavy.webp", "รถเครนหลายเพลาที่ลานพักสินค้าขนาดใหญ่"],
  compactTruck: ["truck-compact.webp", "รถเฮี๊ยบหกล้อในลานโลจิสติกส์"],
  mediumTruck: ["truck-medium.webp", "รถเฮี๊ยบขนสินค้าที่ห่อและยึดบนกระบะ"],
  heavyTruck: ["truck-heavy.webp", "รถเฮี๊ยบขนาดใหญ่จอดข้างแถวตู้สินค้า"],
  machinery: ["site-machinery.webp", "เครื่องจักรหุ้มห่อบนพาเลตในลานโรงงาน"],
  containers: ["site-container.webp", "ตู้สำนักงานสีฟ้าในพื้นที่ก่อสร้าง"],
  steel: ["site-steel.webp", "อาคารโครงเหล็กระหว่างก่อสร้างพร้อมรถเครนที่จอดในพื้นที่"],
  rooftop: ["site-rooftop.webp", "อุปกรณ์ปรับอากาศบนดาดฟ้าอาคารอุตสาหกรรม"],
  yard: ["site-yard.webp", "ลานรับส่งสินค้าที่มีวัสดุและรถบรรทุก"],
  survey: ["site-survey.webp", "ทีมงานสำรวจตำแหน่งรับส่งของในลานโรงงาน"],
  serviceSteel: ["service-steel.webp", "รถเครนที่ไซต์ติดตั้งโครงอาคารเหล็ก"],
  serviceRooftop: ["service-rooftop.webp", "ลานเตรียมอุปกรณ์ก่อนประสานงานยกขึ้นอาคาร"],
} as const;

export type CranePhoto = (typeof photo)[keyof typeof photo];

const articlePhotos: Record<string, { cover: readonly [string, string]; inline: CranePhoto; caption: string }> = {
  "compare-quotes": { cover: ["guide-compare-quotes.webp", "เอกสารใบเสนอราคาสองชุดบนโต๊ะในไซต์งานยก"], inline: photo.steel, caption: "ไซต์ก่อสร้างมักมีกรอบเวลาและจุดส่งมอบชัด ควรให้ทุกเจ้าประเมินจากข้อกำหนดชุดเดียวกัน" },
  "rental-price": { cover: ["guide-rental-price.webp", "ผู้ประสานงานยืนถือคลิปบอร์ดใกล้รถเครนในลานโรงงาน"], inline: photo.yard, caption: "รูปพื้นที่รับส่งสินค้าช่วยให้ผู้ให้บริการถามต่อเรื่องรอบรถเข้าและเวลารอ" },
  "crane-vs-hiab": { cover: ["guide-crane-vs-hiab.webp", "รถเครนเคลื่อนที่และรถเฮี๊ยบจอดเทียบกันในลาน"], inline: photo.truck, caption: "รถบรรทุกติดเครนมีทั้งกระบะและชุดเครน จึงต้องตรวจขอบเขตงานยกและขนส่งแยกกัน" },
  "quote-checklist": { cover: ["guide-quote-checklist.webp", "ผู้ประสานงานถ่ายภาพเครื่องจักรบนพาเลต"], inline: photo.machinery, caption: "ส่งรูปที่เห็นทั้งเครื่อง ฐานรอง และบรรจุภัณฑ์ พร้อมบอกว่าน้ำหนักตามเอกสารรวมส่วนใดไว้แล้ว" },
  "lifting-radius": { cover: ["guide-lifting-radius.webp", "รถเครนจอดห่างจากช่องรับส่งสินค้าในลานโรงงาน"], inline: photo.allTerrainCrane, caption: "ไซต์ที่มีโครงสร้างหรือรั้วกั้นอาจจำกัดตำแหน่งตั้งรถ ซึ่งส่งผลต่อระยะยกจริง" },
  "site-documents": { cover: ["guide-site-documents.webp", "ผู้ประสานงานถือแฟ้มเอกสารหน้าประตูโรงงาน"], inline: photo.survey, caption: "ให้ทีมไซต์และผู้ให้บริการทวนชื่อผู้เข้าพื้นที่กับเอกสารก่อนวันทำงาน" },
  "truck-transport": { cover: ["guide-truck-transport.webp", "รถเฮี๊ยบจอดข้างช่องโหลดสินค้าที่มีของเตรียมขน"], inline: photo.mediumTruck, caption: "ส่งรูปชิ้นงานและขนาดให้ทีมตรวจทั้งพื้นที่บรรทุกและข้อจำกัดตอนยกขึ้นลงรถ" },
  "site-survey": { cover: ["guide-site-survey.webp", "ผู้สำรวจสองคนตรวจลานโรงงานและจดข้อมูลลงคลิปบอร์ด"], inline: photo.rooftop, caption: "งานยกขึ้นดาดฟ้าควรยืนยันตำแหน่งติดตั้ง ระดับความสูง และจุดตั้งรถก่อนเลือกอุปกรณ์" },
};

export function articlePhoto(slug: string) {
  return articlePhotos[slug];
}

const photosByPage: Record<string, CranePhoto> = {
  mobile: photo.crane, hiab: photo.truck, safety: photo.survey,
  fleet: photo.crane, services: photo.machinery, projects: photo.steel, areas: photo.yard, guides: photo.survey,
  "mobile-25": photo.compactCrane, "mobile-50": photo.allTerrainCrane, "mobile-80": photo.heavyCrane,
  "truck-3": photo.compactTruck, "truck-5": photo.mediumTruck, "truck-8": photo.heavyTruck,
  machinery: photo.machinery, containers: photo.containers, steel: photo.serviceSteel, rooftop: photo.serviceRooftop, yard: photo.yard,
  "factory-line": photo.machinery, "site-office": photo.containers, "warehouse-steel": photo.steel,
  "office-rooftop": photo.rooftop, "loading-yard": photo.yard, "new-production-floor": photo.survey,
};

export function pagePhoto(slug: string): readonly [string, string] | undefined {
  if (slug === "about") return ["crane-team.webp", "ภาพจำลองทีมยกงาน เครน ยืนเรียงหน้ารถเครนในลาน"];
  if (slug === "areas") return ["area-chonburi-work.webp", "ภาพประกอบงานยกและขนย้ายในลานโลจิสติกส์ชายฝั่งทะเลตะวันออก"];
  const area = areaContent[slug];
  if (area) return [`area-${slug}-work.webp`, area.coverAlt];
  return articlePhoto(slug)?.cover ?? photosByPage[slug];
}

export const clips = {
  crane: { file: "crane-walkaround.mp4", title: "เดินชมรอบรถเครนเคลื่อนที่", poster: photo.crane },
  truck: { file: "hiab-delivery.mp4", title: "รถเฮี๊ยบเข้าลานรับส่งสินค้า", poster: photo.truck },
  lift: { file: "machine-lift.mp4", title: "จำลองการยกเครื่องจักรในลานโรงงาน", poster: photo.machinery },
  survey: { file: "site-survey.mp4", title: "ทีมสำรวจพื้นที่ก่อนเริ่มงานยก", poster: photo.survey },
};

export type CraneClip = (typeof clips)[keyof typeof clips];

const clipsByPage: Record<string, CraneClip[]> = {
  fleet: [clips.crane, clips.truck],
  mobile: [clips.crane], hiab: [clips.truck],
  services: [clips.lift, clips.truck], projects: [clips.lift, clips.survey],
  machinery: [clips.lift], "factory-line": [clips.lift], "new-production-floor": [clips.lift],
  safety: [clips.survey], "site-survey": [clips.survey], "truck-transport": [clips.truck],
};

export function pageClips(slug: string): CraneClip[] {
  return clipsByPage[slug] ?? [];
}
