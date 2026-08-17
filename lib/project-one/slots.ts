export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export type ImageSlot = {
  slotId: string;
  prompt: string;
  aspectRatio: AspectRatio;
  /** picsum (or other) fallback if generation fails */
  fallbackSrc: string;
  /** Demo library cutouts need transparent PNG */
  requireTransparency?: boolean;
  page: "project-one" | "demo";
};

/** Demo cards rendered by JS on Project ONE page */
export const PROJECT_ONE_DEMOS = [
  {
    name: "Mellow House Café",
    type: "Café / Bangkok",
    cat: "cafe",
    prompt:
      "Bright minimalist café interior with warm wood tones, editorial lifestyle photography",
    slotId: "one-demo-mellow-house-cafe",
    fallbackSrc: "https://picsum.photos/seed/puchup-demo-MellowHouseCafé/600/450",
  },
  {
    name: "Baan Suan Thai",
    type: "Restaurant / Chiang Mai",
    cat: "restaurant",
    prompt:
      "Traditional Thai restaurant courtyard with wooden tables and lush greenery, warm daylight",
    slotId: "one-demo-baan-suan-thai",
    fallbackSrc: "https://picsum.photos/seed/puchup-demo-BaanSuanThai/600/450",
  },
  {
    name: "Aura Dental Clinic",
    type: "Health / Bangkok",
    cat: "health",
    prompt:
      "Clean modern dental clinic reception, soft light, premium healthcare interior",
    slotId: "one-demo-aura-dental",
    fallbackSrc: "https://picsum.photos/seed/puchup-demo-AuraDentalClinic/600/450",
  },
  {
    name: "Velora Resort",
    type: "Hotel / Phuket",
    cat: "hotel",
    prompt: "Boutique beachfront resort pool at sunset, premium travel photography",
    slotId: "one-demo-velora-resort",
    fallbackSrc: "https://picsum.photos/seed/puchup-demo-VeloraResort/600/450",
  },
  {
    name: "Amethez Crystals",
    type: "Retail / Bangkok",
    cat: "retail",
    prompt:
      "Elegant crystal and gemstone display on a wooden shelf, soft studio light",
    slotId: "one-demo-amethez-crystals",
    fallbackSrc: "https://picsum.photos/seed/puchup-demo-AmethezCrystals/600/450",
  },
  {
    name: "Nol Studio",
    type: "Creator / Bangkok",
    cat: "creator",
    prompt:
      "Photographer working in a bright minimal studio with camera equipment, editorial tone",
    slotId: "one-demo-nol-studio",
    fallbackSrc: "https://picsum.photos/seed/puchup-demo-NolStudio/600/450",
  },
  {
    name: "Green Table Bistro",
    type: "Restaurant / Bangkok",
    cat: "restaurant",
    prompt:
      "Cozy bistro table setting with plants and warm lighting, editorial food photography",
    slotId: "one-demo-green-table-bistro",
    fallbackSrc: "https://picsum.photos/seed/puchup-demo-GreenTableBistro/600/450",
  },
  {
    name: "Solace Spa",
    type: "Health / Hua Hin",
    cat: "health",
    prompt:
      "Serene spa treatment room with candles and soft textiles, calm premium interior",
    slotId: "one-demo-solace-spa",
    fallbackSrc: "https://picsum.photos/seed/puchup-demo-SolaceSpa/600/450",
  },
  {
    name: "Craft & Bean",
    type: "Café / Bangkok",
    cat: "cafe",
    prompt:
      "Specialty coffee bar with barista pouring latte art, warm editorial lighting",
    slotId: "one-demo-craft-bean",
    fallbackSrc: "https://picsum.photos/seed/puchup-demo-Craft&Bean/600/450",
  },
] as const;

export const DEMO_CATEGORIES = [
  {
    id: "food",
    name: "อาหารและเครื่องดื่ม",
    emoji: "🍜",
    desc: "ร้านที่ขายด้วยรสชาติและบรรยากาศ — ให้ลูกค้าเห็นเมนู รีวิว และอยากมานั่งกินทันที",
    slotId: "demo-cat-food",
    fallbackSrc: "https://picsum.photos/seed/puchup-cat-food/400/400",
    prompt:
      "Steaming bowl of Thai noodles with chopsticks, isolated subject, professional food photography, transparent background cutout",
    items: [
      { name: "ร้านอาหาร", slug: "restaurant" },
      { name: "คาเฟ่", slug: "cafe" },
      { name: "ร้านกาแฟ", slug: "coffee-shop" },
      { name: "ร้านอาหารทะเล", slug: "seafood-restaurant" },
      { name: "ร้านหมูกระทะ", slug: "moo-kratha" },
      { name: "ร้านชาบู", slug: "shabu" },
      { name: "เบเกอรี่", slug: "bakery" },
      { name: "ร้านอาหารสุขภาพ", slug: "healthy-food" },
    ],
  },
  {
    id: "health",
    name: "สุขภาพและความงาม",
    emoji: "💆",
    desc: "ธุรกิจที่ลูกค้าต้องการความมั่นใจก่อนตัดสินใจ — รีวิว ผลงาน และความน่าเชื่อถือคือหัวใจ",
    slotId: "demo-cat-health",
    fallbackSrc: "https://picsum.photos/seed/puchup-cat-health/400/400",
    prompt:
      "White orchid flower and smooth spa stones, isolated subject, soft studio lighting, transparent background cutout",
    items: [
      { name: "คลินิกทันตกรรม", slug: "dental-clinic" },
      { name: "คลินิกเสริมความงาม", slug: "beauty-clinic" },
      { name: "Spa", slug: "spa" },
      { name: "ร้านทำผม", slug: "hair-salon" },
      { name: "ร้านทำเล็บ", slug: "nail-salon" },
      { name: "คลินิกสัตว์", slug: "vet-clinic" },
      { name: "กายภาพบำบัด", slug: "physiotherapy" },
      { name: "Barber", slug: "barber" },
      { name: "Tattoo", slug: "tattoo-studio" },
    ],
  },
  {
    id: "pets",
    name: "สัตว์เลี้ยง",
    emoji: "🐶",
    desc: "ร้านที่ขายความน่ารัก — รูปน้องหมาน้องแมวคือสิ่งแรกที่ทำให้คนหยุดดู",
    slotId: "demo-cat-pets",
    fallbackSrc: "https://picsum.photos/seed/puchup-cat-pets/400/400",
    prompt:
      "Happy golden retriever dog and orange tabby cat sitting together, isolated subject, joyful studio photography, transparent background cutout",
    items: [
      { name: "Pet Shop", slug: "pet-shop" },
      { name: "Pet Grooming", slug: "pet-grooming" },
    ],
  },
  {
    id: "stay",
    name: "ที่พักและท่องเที่ยว",
    emoji: "🏨",
    desc: "ธุรกิจที่ขายประสบการณ์ — ภาพบรรยากาศต้องทำให้คนอยากจองทันทีที่เห็น",
    slotId: "demo-cat-stay",
    fallbackSrc: "https://picsum.photos/seed/puchup-cat-stay/400/400",
    prompt:
      "Tropical palm leaf and a boutique hotel key with tassel, isolated subject, warm editorial photography, transparent background cutout",
    items: [
      { name: "Resort", slug: "resort" },
      { name: "Boutique Hotel", slug: "boutique-hotel" },
      { name: "Pool Villa", slug: "pool-villa" },
      { name: "Villa", slug: "villa" },
      { name: "Homestay", slug: "homestay" },
      { name: "Glamping", slug: "glamping" },
      { name: "บริษัททัวร์", slug: "tour-company" },
      { name: "Local Tour", slug: "local-tour" },
    ],
  },
  {
    id: "plants",
    name: "ต้นไม้และสวน",
    emoji: "🌿",
    desc: "ธุรกิจสีเขียวที่ต้องการความสดชื่นและความเป็นธรรมชาติในทุกภาพ",
    slotId: "demo-cat-plants",
    fallbackSrc: "https://picsum.photos/seed/puchup-cat-plants/400/400",
    prompt:
      "Potted monstera plant with fresh green leaves, isolated subject, natural light, transparent background cutout",
    items: [
      { name: "ร้านต้นไม้", slug: "plant-shop" },
      { name: "รับจัดสวน", slug: "garden-design" },
      { name: "ร้านดอกไม้", slug: "flower-shop" },
    ],
  },
  {
    id: "retail",
    name: "ค้าปลีกและของสะสม",
    emoji: "💎",
    desc: "ร้านที่ขายของชิ้นพิเศษ — ต้องการภาพสินค้าที่ดูมีคุณค่าและน่าสะสม",
    slotId: "demo-cat-retail",
    fallbackSrc: "https://picsum.photos/seed/puchup-cat-retail/400/400",
    prompt:
      "Faceted amethyst crystal and a gold ring, isolated subject, premium jewelry photography, transparent background cutout",
    items: [
      { name: "Jewelry", slug: "jewelry" },
      { name: "ร้านหิน", slug: "crystal-shop" },
      { name: "ร้านแว่น", slug: "optical-shop" },
      { name: "ร้านจักรยาน", slug: "bike-shop" },
      { name: "ร้านของสะสม", slug: "collectibles-shop" },
      { name: "อะไหล่การเกษตร", slug: "agri-parts" },
    ],
  },
  {
    id: "creator",
    name: "ศิลปะ สร้างสรรค์ และอินทีเรีย",
    emoji: "🎨",
    desc: "ธุรกิจที่ขายฝีมือและมุมมอง — ผลงานคือสิ่งที่พูดแทนตัวตนได้ดีที่สุด",
    slotId: "demo-cat-creator",
    fallbackSrc: "https://picsum.photos/seed/puchup-cat-creator/400/400",
    prompt:
      "Vintage film camera and a paintbrush bundle, isolated subject, editorial still life, transparent background cutout",
    items: [
      { name: "Gallery", slug: "gallery" },
      { name: "ช่างภาพ", slug: "photographer" },
      { name: "ศิลปิน", slug: "artist" },
      { name: "Interior", slug: "interior-design" },
    ],
  },
  {
    id: "sports",
    name: "กีฬาและการเรียนรู้",
    emoji: "🎓",
    desc: "ธุรกิจที่ขายความก้าวหน้า — ผลลัพธ์และความน่าเชื่อถือคือสิ่งที่ลูกค้ามองหา",
    slotId: "demo-cat-sports",
    fallbackSrc: "https://picsum.photos/seed/puchup-cat-sports/400/400",
    prompt:
      "Basketball and a graduation cap side by side, isolated subject, clean studio photography, transparent background cutout",
    items: [
      { name: "Sports Academy", slug: "sports-academy" },
      { name: "Tutor", slug: "tutor" },
      { name: "Fitness Coach", slug: "fitness-coach" },
    ],
  },
  {
    id: "professional",
    name: "ธุรกิจส่วนตัวและมืออาชีพ",
    emoji: "💼",
    desc: "ธุรกิจที่ขายความน่าเชื่อถือ — เว็บไซต์ต้องดูเป็นมืออาชีพตั้งแต่แรกเห็น",
    slotId: "demo-cat-professional",
    fallbackSrc: "https://picsum.photos/seed/puchup-cat-professional/400/400",
    prompt:
      "Leather briefcase and a small solar panel model, isolated subject, clean professional photography, transparent background cutout",
    items: [
      { name: "Personal Brand", slug: "personal-brand" },
      { name: "บริษัท Solar", slug: "solar-company" },
      { name: "สำนักงานบัญชี", slug: "accounting-office" },
      { name: "อสังหาริมทรัพย์", slug: "real-estate" },
      { name: "ประกัน", slug: "insurance" },
    ],
  },
  {
    id: "construction",
    name: "ก่อสร้างและบ้าน",
    emoji: "🏠",
    desc: "ธุรกิจที่ขายความไว้ใจได้ — ผลงานจริงและความเรียบร้อยคือสิ่งที่ปิดการขาย",
    slotId: "demo-cat-construction",
    fallbackSrc: "https://picsum.photos/seed/puchup-cat-construction/400/400",
    prompt:
      "Small house model and a wrench tool, isolated subject, clean product photography, transparent background cutout",
    items: [
      { name: "รับสร้างบ้าน", slug: "home-builder" },
      { name: "กำจัดปลวก", slug: "pest-control" },
    ],
  },
] as const;

export const ALL_IMAGE_SLOTS: ImageSlot[] = [
  {
    slotId: "one-website-hero",
    prompt:
      "Warm editorial hero photo of a cozy Bangkok café storefront at golden hour, premium lifestyle photography, soft natural light",
    aspectRatio: "4:3",
    fallbackSrc: "https://picsum.photos/seed/puchup-website/900/700",
    page: "project-one",
  },
  {
    slotId: "one-gbiz-logo",
    prompt:
      "Small square logo mockup for a boutique café, minimalist icon style, warm palette",
    aspectRatio: "1:1",
    fallbackSrc: "https://picsum.photos/seed/puchup-gbiz-logo/200/200",
    page: "project-one",
  },
  {
    slotId: "one-article-1",
    prompt:
      "Warm neighbourhood street scene near a small local shop, documentary lifestyle photography",
    aspectRatio: "16:9",
    fallbackSrc: "https://picsum.photos/seed/puchup-article1/700/440",
    page: "project-one",
  },
  {
    slotId: "one-article-2",
    prompt:
      "Founder working quietly inside a small shop, candid warm portrait, editorial tone",
    aspectRatio: "16:9",
    fallbackSrc: "https://picsum.photos/seed/puchup-article2/700/440",
    page: "project-one",
  },
  {
    slotId: "one-article-3",
    prompt:
      "Close-up of product display and menu on a wooden table, natural window light, premium still life",
    aspectRatio: "16:9",
    fallbackSrc: "https://picsum.photos/seed/puchup-article3/700/440",
    page: "project-one",
  },
  ...PROJECT_ONE_DEMOS.map((d) => ({
    slotId: d.slotId,
    prompt: d.prompt,
    aspectRatio: "4:3" as const,
    fallbackSrc: d.fallbackSrc,
    page: "project-one" as const,
  })),
  ...DEMO_CATEGORIES.map((c) => ({
    slotId: c.slotId,
    prompt: c.prompt,
    aspectRatio: "1:1" as const,
    fallbackSrc: c.fallbackSrc,
    requireTransparency: true,
    page: "demo" as const,
  })),
];

export function publicPathForSlot(slotId: string): string {
  return `/images/generated/${slotId}.png`;
}

export function filesystemPathForSlot(slotId: string): string {
  return `public/images/generated/${slotId}.png`;
}
