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

const LIVE = new Set([
  "baankhaokhom",
  "baanfundee",
  "baan-bangkok",
  "paw-and-co",
  "petal-stem-florist",
]);

function item(
  name: string,
  kind: string,
  slug: string,
  focus: string,
  img: string,
): ShowroomItem {
  return { name, kind, slug, focus, img, live: LIVE.has(slug) };
}

/** 50-business showroom from Demo.html, with live templates linked. */
export const SHOWROOM_CATEGORIES: ShowroomCategory[] = [
  {
    id: "food",
    name: "อาหารและเครื่องดื่ม",
    emoji: "🍜",
    type: "อาหาร",
    line: "ธุรกิจที่ขายด้วยรสชาติและรูปภาพ แต่ต้องทำให้คนตัดสินใจเดินทางมาถึงที่ร้าน",
    items: [
      item(
        "บ้านข้าวหอม",
        "ร้านอาหารไทยดั้งเดิม",
        "baankhaokhom",
        "Menu Architecture / Google Reviews / Location Context",
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Sunday Yard Coffee",
        "คาเฟ่สไตล์ธรรมชาติ",
        "sunday-yard-coffee",
        "Vibe Gallery / Highlighted Brews / Opening Hours",
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Roast & Ritual",
        "โรงคั่วและร้านกาแฟพิเศษ",
        "roast-ritual",
        "Bean Origins / Tasting Notes / Artisan Stories",
        "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "ทะเลใส Seafood House",
        "ร้านอาหารทะเลสด",
        "talaysai-seafood",
        "Daily Catch / Set Menu Matrix / Map Navigation",
        "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "หมูกระทะลุงแดง",
        "หมูกระทะพรีเมียมโอเพ่นแอร์",
        "loongdaeng-mookratha",
        "Buffet Tiers / Social Proof Reviews / Queue Hotline",
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Steam & Simmer Shabu",
        "ชาบูบุฟเฟต์สไตล์ญี่ปุ่น",
        "steam-simmer-shabu",
        "Ingredient Quality / Soup Selection / Table Booking",
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Flour & Bloom Bakery",
        "เบเกอรี่โฮมเมดฝรั่งเศส",
        "flour-bloom-bakery",
        "Daily Bake Schedule / Signature Menu / Pre-order System",
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Green Bowl Kitchen",
        "ร้านอาหารสุขภาพและสลัดบาร์",
        "green-bowl-kitchen",
        "Calorie Counter / Organic Sourcing / Clean Vibe Visuals",
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
      ),
    ],
  },
  {
    id: "health",
    name: "สุขภาพและความงาม",
    emoji: "💆",
    type: "สุขภาพ",
    line: "ให้คนไข้และลูกค้าได้รู้จักความเชี่ยวชาญ เข้าใจบริการ และมั่นใจสูงสุดก่อนกดจองนัด",
    items: [
      item(
        "บ้านฟันดี",
        "คลินิกทันตกรรมชุมชน พระราม 3",
        "baanfundee",
        "Doctor Profiles / Treatment Pricing / Appointment Form",
        "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Lumina Aesthetic Clinic",
        "คลินิกเสริมความงามครบวงจร",
        "lumina-aesthetic",
        "Before-After Slider / Certified Machinery / Trust Badges",
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Still Water Spa",
        "สปาและออนเซ็นเพื่อการผ่อนคลาย",
        "still-water-spa",
        "Sensory Packages / Treatment Details / Serene Backgrounds",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "The Parlour Hair Studio",
        "ร้านออกแบบและทำสีผมแฟชั่น",
        "the-parlour-hair",
        "Stylist Portfolio / Hair Care Articles / Booking Grid",
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Petal Nail Bar",
        "ร้านทำเล็บและสปามือเท้า",
        "petal-nail-bar",
        "Nail Art Lookbook / Hygiene Standards / Color Catalog",
        "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Furry Friends Vet Clinic",
        "โรงพยาบาลและคลินิกสัตว์เลี้ยง",
        "furry-friends-vet",
        "Emergency Contacts / Medical Team / In-patient Facilities",
        "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Balance Physiotherapy",
        "คลินิกกายภาพบำบัดและออฟฟิศซินโดรม",
        "balance-physio",
        "Pain Assessment Guide / Treatment Steps / Recovery Stories",
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Iron & Oak Barbershop",
        "บาร์เบอร์สุภาพบุรุษวินเทจ",
        "iron-oak-barber",
        "Service Menu / Barber Profiles / Classic Vibe Gallery",
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Black Canvas Tattoo",
        "สตูดิโอรอยสักศิลปะร่วมสมัย",
        "black-canvas-tattoo",
        "Artist Portfolios / Safety & Hygiene Blog / Inquiry Form",
        "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=600&q=80",
      ),
    ],
  },
  {
    id: "pets",
    name: "สัตว์เลี้ยง",
    emoji: "🐶",
    type: "สัตว์เลี้ยง",
    line: "สร้างความอุ่นใจและแสดงความโปร่งใส ใส่ใจ ก่อนเจ้าของจะฝากสมาชิกในครอบครัวไว้กับคุณ",
    items: [
      item(
        "Paw & Co.",
        "ศูนย์รวมสินค้าสัตว์เลี้ยงพรีเมียม",
        "paw-and-co",
        "Curated Categories / Store Walkthrough / Brand Partners",
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Fluff House Grooming",
        "ร้านอาบน้ำตัดขนและโรงแรมสัตว์เลี้ยง",
        "fluff-house-grooming",
        "Grooming Tiers / Facility Live Feed / Stay Packages",
        "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80",
      ),
    ],
  },
  {
    id: "stay",
    name: "ที่พักและท่องเที่ยว",
    emoji: "🏨",
    type: "ที่พัก",
    line: "ส่งต่อบรรยากาศและประสบการณ์ที่ยอดเยี่ยมตั้งแต่แรกเห็น เพื่อปิดการจองโดยตรงไม่ต้องผ่านคนกลาง",
    items: [
      item(
        "บ้านบางกอก",
        "บูทีคโฮเทล Thai Heritage ริมเจ้าพระยา",
        "baan-bangkok",
        "Neighborhood Guide / Unique Room Features / Cafe Fusion Menu",
        "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Amber Cove Resort",
        "รีสอร์ทหรูริมชายหาด",
        "amber-cove-resort",
        "Room Layout Interactive / Guest Experiences / Direct Booking CTA",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Palm & Pool Villas",
        "พูลวิลล่าส่วนตัวสำหรับครอบครัว",
        "palm-pool-villas",
        "Amenities Checklist / Gathering Spaces / Rate Calendar",
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Casa Areca Villa",
        "วิลล่าตากอากาศสไตล์เมดิเตอร์เรเนียน",
        "casa-areca-villa",
        "Aesthetic Imagery / Premium Concierge / Event Inquiry",
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Baan Rim Nam Homestay",
        "โฮมสเตย์ริมน้ำเชิงวิถีชุมชน",
        "baan-rim-nam",
        "Local Activities / Traditional Dining / Authentic Reviews",
        "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Wild Canopy Glamping",
        "ที่พักเต็นท์หรูติดธรรมชาติ",
        "wild-canopy-glamping",
        "Campground Map / Weather Updates / Equipment Details",
        "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Northbound Travel Co.",
        "บริษัทจัดนำเที่ยวและแพ็คเกจทัวร์",
        "northbound-travel",
        "Itinerary Timelines / Travel Insurance Badge / Customer Ratings",
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Two Wheels Local Tours",
        "ทัวร์ปั่นจักรยานสัมผัสชุมชน",
        "two-wheels-tours",
        "Route Difficulties / Equipment Safety / Day Schedule",
        "https://images.unsplash.com/photo-1474962558142-9ca83af74bb7?auto=format&fit=crop&w=600&q=80",
      ),
    ],
  },
  {
    id: "plants",
    name: "ต้นไม้และสวน",
    emoji: "🌿",
    type: "ต้นไม้",
    line: "แสดงความสดชื่นและความเชี่ยวชาญเพื่อเปลี่ยนสวนธรรมดาให้กลายเป็นพื้นที่สีเขียวในฝัน",
    items: [
      item(
        "Terra & Leaf Plant Shop",
        "ร้านจำหน่ายไม้ประดับหายาก",
        "terra-leaf",
        "Care Level Badge / In-stock Gallery / Direct Line Ordering",
        "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Greenline Garden Studio",
        "บริการรับออกแบบและจัดสวน",
        "greenline-garden",
        "Before-After Case Studies / Design Workflow / Consultation Form",
        "https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Petal & Stem Florist",
        "ร้านดอกไม้สดและดีไซน์ช่อดอกไม้",
        "petal-stem-florist",
        "Occasion Matrix / Bouquet Sizes / Next-day Delivery Counter",
        "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80",
      ),
    ],
  },
  {
    id: "retail",
    name: "ค้าปลีกและของสะสม",
    emoji: "💎",
    type: "ร้านค้า",
    line: "สร้างมูลค่าและเอกลักษณ์ให้แบรนด์ คัดกรองชิ้นที่ใช่ และอำนวยความสะดวกในการติดต่อสั่งซื้อ",
    items: [
      item(
        "Maison Aurelia",
        "เครื่องประดับและจิวเวลรี่ทำมือ",
        "maison-aurelia",
        "Macro Materials Detail / Brand Heritage Story / Custom Request Form",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Stonebound Crystals",
        "ร้านหินธรรมชาติและคริสตัลบำบัด",
        "stonebound-crystals",
        "Energy Properties Chart / Authenticity Guarantee / Video Showcases",
        "https://images.unsplash.com/photo-1531278520962-f79363d68760?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Frame & Sight Optics",
        "ร้านแว่นตาและตรวจวัดสายตาเฉพาะทาง",
        "frame-sight-optics",
        "Optometrist Credentials / Frame Catalog / Advanced Lab Intro",
        "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Velo Union Bicycles",
        "ร้านจักรยานประกอบและอุปกรณ์ตกแต่ง",
        "velo-union",
        "Custom Bike Builder Preview / Component Checklist / Workshop Rates",
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "The Curio Room",
        "ร้านของสะสมและของเก่าหายาก",
        "the-curio-room",
        "Rarity Scale / Condition Grading / Private Viewing Form",
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "FarmTech Parts Supply",
        "ศูนย์อะไหล่และเครื่องมือการเกษตร",
        "farmtech-parts",
        "Serial Number Search Feature / Compatibility Charts / Bulk Inquiry",
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
      ),
    ],
  },
  {
    id: "creator",
    name: "ศิลปะ สร้างสรรค์ และอินทีเรีย",
    emoji: "🎨",
    type: "บริการ",
    line: "ให้ผลงานภาพถ่ายและชิ้นงานศิลปะทำหน้าที่อธิบายตัวตนและศักยภาพของดีไซเนอร์",
    items: [
      item(
        "Northern Light Gallery",
        "หอศิลป์และนิทรรศการร่วมสมัย",
        "northern-light-gallery",
        "Current Exhibition / Artist Statements / Ticket Info",
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Silver Frame Studio",
        "สตูดิโอถ่ายภาพงานวิวาห์และแฟชั่น",
        "silver-frame-studio",
        "Visual Rhythm Grid / Package Rate Card / Behind the Scenes",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Studio Waen",
        "สตูดิโออาร์ตและเซรามิกแฮนด์เมด",
        "studio-waen",
        "Craft Process Video Layout / Collection Archives / Workshop Dates",
        "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Framework Interior Studio",
        "บริษัทออกแบบและตกแต่งภายใน",
        "framework-interior",
        "Project Moodboards / Material Library Showcase / Cost Estimator",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80",
      ),
    ],
  },
  {
    id: "sports",
    name: "กีฬาและการเรียนรู้",
    emoji: "🎓",
    type: "กีฬา",
    line: "สร้างความน่าเชื่อถือผ่านประวัติ ความสำเร็จ และตารางสอนที่ชัดเจนของโค้ชผู้ฝึกสอน",
    items: [
      item(
        "Apex Sports Academy",
        "สถาบันฝึกสอนเทนนิสและฟุตบอลเยาวชน",
        "apex-sports",
        "Coach Certifications / Student Milestones / Trial Class Signup",
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "BrightPath Tutoring",
        "สถาบันกวดวิชาวิชาการและภาษา",
        "brightpath-tutoring",
        "Exam Success Rates / Course Curriculum / Teacher Intros",
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Forge Fitness Coaching",
        "บริการเทรนเนอร์ส่วนบุคคลและโภชนาการ",
        "forge-fitness",
        "Transformation Gallery / Program Pillars / Fitness Consult Form",
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
      ),
    ],
  },
  {
    id: "professional",
    name: "ธุรกิจส่วนตัวและมืออาชีพ",
    emoji: "💼",
    type: "Professional",
    line: "ชูความน่าเชื่อถือ ประสบการณ์ และเกียรติประวัติแบรนด์บุคคลให้โดดเด่นตั้งแต่เสี้ยววินาทีแรก",
    items: [
      item(
        "The Consult Desk",
        "ที่ปรึกษากลยุทธ์ธุรกิจและการตลาด",
        "the-consult-desk",
        "Client Logos / Thought Leadership Articles / Strategy Session CTA",
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Sunwise Energy",
        "บริการออกแบบติดตั้งระบบโซล่าเซลล์บ้าน",
        "sunwise-energy",
        "Savings Calculator Preview / Panel Tech Details / Warranty Info",
        "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "ClearPath Accounting",
        "สำนักงานบัญชีและภาษีอากรครบวงจร",
        "clearpath-accounting",
        "Compliance Checklist / Service Scope Packages / Secure Contact",
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Meridian Property Group",
        "ตัวแทนและที่ปรึกษาการลงทุนอสังหาฯ",
        "meridian-property",
        "Exclusive Listings / Market Analytics / Agent Profiles",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Safehold Insurance Advisory",
        "ที่ปรึกษาและวางแผนประกันวินาศภัย",
        "safehold-insurance",
        "Risk Assessment / Claim Process Steps / Direct Callback Request",
        "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
      ),
    ],
  },
  {
    id: "construction",
    name: "ก่อสร้างและบ้าน",
    emoji: "🏠",
    type: "ก่อสร้าง",
    line: "แสดงมาตรฐานการทำงาน ความประณีต และความเรียบร้อยของวิศวกรเพื่อสร้างความไว้วางใจสูงสุด",
    items: [
      item(
        "Foundation House Builders",
        "บริษัทรับสร้างบ้านและอาคารโมเดิร์น",
        "foundation-builders",
        "Construction Stages Tracking / Material Grades / Site Inspection Form",
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80",
      ),
      item(
        "Shield Pest Control",
        "บริการกำจัดปลวกและแมลงรบกวนบ้าน",
        "shield-pest-control",
        "Safety Certifications / Eco-friendly Chemical Info / Fast Quoting",
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
      ),
    ],
  },
];

export const SHOWROOM_FILTERS = [
  { type: "all", label: "ทั้งหมด" },
  { type: "อาหาร", label: "อาหารและเครื่องดื่ม" },
  { type: "สุขภาพ", label: "สุขภาพและความงาม" },
  { type: "สัตว์เลี้ยง", label: "สัตว์เลี้ยง" },
  { type: "ที่พัก", label: "ที่พักและท่องเที่ยว" },
  { type: "ต้นไม้", label: "ต้นไม้และสวน" },
  { type: "ร้านค้า", label: "ค้าปลีกและของสะสม" },
  { type: "บริการ", label: "ศิลปะและบริการสร้างสรรค์" },
  { type: "กีฬา", label: "กีฬาและการเรียนรู้" },
  { type: "Professional", label: "ธุรกิจและมืออาชีพ" },
  { type: "ก่อสร้าง", label: "ก่อสร้างและบ้าน" },
] as const;

export const LIVE_DEMO_SLUGS = [...LIVE] as const;

export const SLUG_ALIASES: Record<string, string> = {
  restaurant: "baankhaokhom",
  "dental-clinic": "baanfundee",
  "boutique-hotel": "baan-bangkok",
  "pet-shop": "paw-and-co",
  "flower-shop": "petal-stem-florist",
};

export function canonicalDemoSlug(slug: string): string {
  const key = slug.trim().toLowerCase();
  return SLUG_ALIASES[key] || key;
}

export function allShowroomItems(): ShowroomItem[] {
  return SHOWROOM_CATEGORIES.flatMap((c) => c.items);
}

export function findShowroomItem(slug: string): ShowroomItem | undefined {
  const canonical = canonicalDemoSlug(slug);
  return allShowroomItems().find((item) => item.slug === canonical);
}

export function liveShowroomItems(): ShowroomItem[] {
  return allShowroomItems().filter((item) => item.live);
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
    items: cat.items.map((item) => {
      const hit = bySlug.get(item.slug);
      if (!hit) {
        return { ...item, live: cmsIsSource ? false : item.live };
      }
      return {
        ...item,
        name: hit.title || item.name,
        kind: hit.businessType
          ? CMS_TYPE_LABEL[hit.businessType] || hit.businessType
          : item.kind,
        focus: hit.architectureStack || item.focus,
        img: hit.heroImageUrl || item.img,
        live: hit.published !== false,
      };
    }),
  }));
}

export function liveItemsFromCategories(categories: ShowroomCategory[]): ShowroomItem[] {
  return categories.flatMap((cat) => cat.items).filter((item) => item.live);
}

