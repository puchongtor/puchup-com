/**
 * Seed Sanity: Project ONE demos + Pages (Home, Showroom, Project ONE).
 *
 * Requires SANITY_API_TOKEN (Editor) and NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local
 * Usage: npm run sanity:seed-project-one
 */
const { readFileSync, existsSync } = require("fs");
const path = require("path");

function loadEnvFiles() {
  for (const name of [".env.local", ".env"]) {
    const file = path.join(process.cwd(), name);
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
}

function k(id) {
  return id.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function item(prefix, i, data) {
  return { _key: k(`${prefix}-${i}`), ...data };
}

function unsplash(id, w = 800) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
}

const demos = [
  {
    _id: "projectOneDemo-baankhaokhom",
    slug: "baankhaokhom",
    title: "บ้านข้าวหอม",
    businessType: "restaurant",
    architectureStack: "Menu Architecture / Google Reviews / Location Context",
    hero: {
      heading: "บ้านข้าวหอม",
      tagline:
        "อาหารบ้านๆ ที่ทำให้คิดถึงบ้าน — ปรุงสดใหม่ทุกจาน ด้วยสูตรที่ส่งต่อกันมาสามรุ่น",
      imageUrl: unsplash("1552566626-52f8b828add9", 1920),
    },
    seo: {
      metaTitle: "บ้านข้าวหอม — อาหารบ้านๆ ที่ทำให้คิดถึงบ้าน | PuchUp ONE",
      metaDescription:
        "ร้านอาหารไทยโฮมเมด ซอยทองหล่อ กรุงเทพฯ เมนูบ้านๆ รีวิว และแผนที่ในหน้าเดียว",
    },
    menuOrServices: [
      ["ผัดกะเพราหมูสับ ไข่ดาว", "กะเพราใบสด พริกแกง เสิร์ฟพร้อมข้าวสวยร้อนๆ", "฿120", "main", "1562967914-608f82629710"],
      ["แกงเขียวหวานไก่", "เข้มข้นด้วยกะทิสด มะเขือเปราะ ใบโหระพา", "฿160", "main", "1455619452474-d2be8b1e70cd"],
      ["ปีกไก่ทอดน้ำปลา", "ปีกไก่กรอบนอกนุ่มใน หมักน้ำปลาสูตรลับ", "฿140", "starter", "1567620832903-9fc6debc209f"],
      ["ยำวุ้นเส้นทะเล", "กุ้ง หมึก วุ้นเส้น รสจัดจ้าน เปรี้ยวเผ็ดกำลังดี", "฿180", "starter", "1569718212165-3a8278d5f624"],
      ["ปลากะพงทอดน้ำปลา", "ปลากะพงทอดกรอบทั้งตัว ราดน้ำปลามะม่วงยำ", "฿380", "main", "1534422298391-e4f8c172dddb"],
      ["ข้าวเหนียวมะม่วง", "มะม่วงน้ำดอกไม้สุก ข้าวเหนียวมูนกะทิสด", "฿120", "drink", "1587314168485-3236d6710814"],
    ].map(([name, description, price, category, photo], i) =>
      item("menu", i, { name, description, price, category, imageUrl: unsplash(photo) }),
    ),
    reviews: [
      { rating: 5, quote: "ต้มยำกุ้งที่นี่จัดจ้านมาก กลิ่นตะไคร้ใบมะกรูดหอมจริง กุ้งแม่น้ำตัวใหญ่คุ้มราคา", author: "คุณนิด", context: "ลูกค้าตัวอย่าง" },
      { rating: 5, quote: "บรรยากาศดี ที่จอดรถสะดวก พาลูกค้ามาทานมื้อเที่ยงได้สบายใจทุกครั้ง", author: "พี่โอ๊ต", context: "ลูกค้าตัวอย่าง" },
      { rating: 4, quote: "อาหารอร่อย ราคาสมเหตุสมผล แนะนำให้จองโต๊ะล่วงหน้าช่วงเที่ยงเพราะคนเยอะ", author: "น้องแนน", context: "ลูกค้าตัวอย่าง" },
    ].map((row, i) => item("review", i, row)),
    locationInfo: {
      address: "123 ซอยทองหล่อ 10 แขวงคลองตันเหนือ\nเขตวัฒนา กรุงเทพฯ 10110",
      hours: [
        { _key: "hours-wd", _type: "openingHours", days: "จันทร์ – ศุกร์", time: "10:00 – 22:00" },
        { _key: "hours-we", _type: "openingHours", days: "เสาร์ – อาทิตย์", time: "09:00 – 22:30" },
        { _key: "hours-kitchen", _type: "openingHours", days: "ครัวปิดรับออเดอร์", time: "ก่อนปิดร้าน 30 นาที" },
      ],
      phone: "081-234-5678",
      mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Thonglor+Bangkok",
      mapsEmbedUrl: "https://www.google.com/maps?q=Thonglor,Bangkok,Thailand&output=embed",
    },
    gallery: [
      ["1556910103-1c02745aae4d", "การปรุงอาหารในครัว"],
      ["1555396273-367ea4eb4db5", "หน้าร้านยามเย็น"],
      ["1517248135467-4c7edcad34c4", "มื้อเย็นกับเพื่อน"],
      ["1596040033229-a9821ebd058d", "สูตรเครื่องแกงสามรุ่น"],
    ].map(([photo, alt], i) => item("gal", i, { imageUrl: unsplash(photo), alt })),
  },
  {
    _id: "projectOneDemo-baanfundee",
    slug: "baanfundee",
    title: "บ้านฟันดี",
    businessType: "health",
    architectureStack: "Doctor Profiles / Treatment Pricing / Appointment Form",
    hero: {
      heading: "บ้านฟันดี คลินิกทันตกรรม",
      tagline:
        "ดูแลสุขภาพช่องปากทุกคนในครอบครัว หมอมือเบา อธิบายเข้าใจง่าย ราคาย่อมเยา ชี้แจงราคาก่อนทำ",
      imageUrl: unsplash("1629909613654-28e377c37b09", 1600),
    },
    seo: {
      metaTitle: "บ้านฟันดี คลินิกทันตกรรม พระราม 3",
      metaDescription: "คลินิกทันตกรรมชุมชนย่านพระราม 3 หมอใจดี มือเบา ราคาย่อมเยา ใช้สิทธิประกันสังคมได้",
    },
    menuOrServices: [
      ["ตรวจฟัน & ปรึกษา", "ตรวจสภาพฟัน เหงือก และให้คำปรึกษาแนวทางรักษาตรงไปตรงมา", "ฟรี", "ทั่วไป"],
      ["ขูดหินปูน", "ขูดหินปูนทั้งปาก ขัดคราบฟันสะอาด ใช้สิทธิประกันสังคมได้", "฿700 – ฿900", "ทั่วไป"],
      ["อุดฟันสีเหมือนฟัน", "บูรณะด้วยเรซินคอมโพสิตสีเนียนเหมือนฟันจริง", "เริ่มต้น ซี่ละ ฿600", "รักษา"],
      ["ถอนฟันธรรมดา", "ฉีดยาชาไม่เจ็บ ถอนอย่างนุ่มนวล", "เริ่มต้น ซี่ละ ฿500", "รักษา"],
      ["ผ่าฟันคุด", "ผ่าฟันคุดอย่างนุ่มนวล พร้อมยาแก้ปวด/แก้อักเสบ", "฿1,500 – ฿3,500", "ผ่าตัด"],
      ["ทำฟันเด็ก", "เคลือบฟลูออไรด์ อุดฟันน้ำนม บรรยากาศเป็นกันเอง", "ตามเคส", "เด็ก"],
    ].map(([name, description, price, category], i) =>
      item("svc", i, { name, description, price, category }),
    ),
    reviews: [
      { rating: 5, quote: "พาคุณแม่ไปทำฟันปลอม หมอนัทใจเย็นและอธิบายละเอียดมาก ไม่รีบทำ ราคาไม่แพงเหมือนคลินิกใหญ่ๆ", author: "คุณสมชาย", context: "ชุมชนวัดด่าน" },
      { rating: 5, quote: "พาลูกสาว 5 ขวบมาอุดฟัน หมอผึ้งใจดีมาก ชวนคุยจนน้องเพลินไม่ร้องไห้สักแอะ", author: "คุณวรรณา", context: "สาธุประดิษฐ์" },
      { rating: 5, quote: "ใช้สิทธิประกันสังคมมาขูดหินปูน ไม่ต้องจ่ายเพิ่มเลยสักบาท หมอมือเบามาก คลินิกสะอาดตรงเวลา", author: "คุณเอกชัย", context: "พระราม 3" },
    ].map((row, i) => item("review", i, row)),
    locationInfo: {
      address: "ริมถนนพระราม 3 (ใกล้ซอยสาธุประดิษฐ์ 58 / วัดด่าน) แขวงบางโพงพาง เขตยานนาวา กรุงเทพฯ",
      hours: [
        { _key: "hours-wd", _type: "openingHours", days: "จันทร์ – ศุกร์", time: "10:00 – 20:00 น." },
        { _key: "hours-we", _type: "openingHours", days: "เสาร์ – อาทิตย์", time: "09:00 – 18:00 น." },
        { _key: "hours-holiday", _type: "openingHours", days: "วันหยุดนักขัตฤกษ์", time: "เปิดตามปกติ (โทรเช็กคิวก่อนได้ครับ)" },
      ],
      phone: "02-123-4567",
      mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Rama+3+Bangkok",
      mapsEmbedUrl: "https://www.google.com/maps?q=Rama+3,Bangkok,Thailand&output=embed",
    },
    gallery: [
      ["1629909615184-74f495363b67", "มุมต้อนรับและรอตรวจ"],
      ["1598256989800-fe5f95da9787", "เตียงทำฟันสะอาดได้มาตรฐาน"],
      ["1606811841689-23dfddce3e95", "อุปกรณ์ตรวจสุขภาพฟันปลอดเชื้อ"],
      ["1588776814546-1ffcf47267a5", "เคาน์เตอร์และมุมแนะนำการดูแลสุขภาพฟัน"],
    ].map(([photo, alt], i) => item("gal", i, { imageUrl: unsplash(photo), alt })),
  },
  {
    _id: "projectOneDemo-baan-bangkok",
    slug: "baan-bangkok",
    title: "บ้านบางกอก",
    businessType: "hotel",
    architectureStack: "Neighborhood Guide / Unique Room Features / Cafe Fusion Menu",
    hero: {
      heading: "บ้านบางกอก บูทีคโฮเทล",
      tagline:
        "ที่พักส่วนตัว 18 ห้อง บนถนนพระอาทิตย์ เดินถึงวัดพระแก้ว ท่าเตียน และย่านเมืองเก่ากรุงเทพฯ",
      imageUrl: unsplash("1508009603885-50cf7c579365", 2000),
    },
    seo: {
      metaTitle: "บ้านบางกอก บูทีคโฮเทล | Baan Bangkok Boutique Hotel",
      metaDescription: "ที่พักสไตล์ Thai Heritage ร่วมสมัย ริมแม่น้ำเจ้าพระยา ถนนพระอาทิตย์ เขตพระนคร",
    },
    menuOrServices: [
      ["Deluxe Heritage Room", "ห้องพักมาตรฐานสไตล์ไทยร่วมสมัย วิวเมืองเก่าและสวนคอร์ทยาร์ด", "฿3,800 / คืน", "room", "1618773928121-c32242e63f39"],
      ["Riverfront Balcony Suite", "ห้องสวีทพร้อมระเบียงไม้สัก ชมพระอาทิตย์ตกดินริมเจ้าพระยา", "เริ่มต้นตามฤดูกาล", "room", "1590490360182-c33d57733427"],
      ["The Siamese Master Suite", "ห้องสวีทใหญ่ที่สุด งานไม้สักฉลุลายและอ่างอาบน้ำลอยตัว", "เริ่มต้นตามฤดูกาล", "room", "1591088398332-8a7791972843"],
    ].map(([name, description, price, category, photo], i) =>
      item("room", i, { name, description, price, category, imageUrl: unsplash(photo) }),
    ),
    reviews: [
      { rating: 5, quote: "ทำเลริมแม่น้ำเจ้าพระยาดีมาก ห้องพัก Riverfront สวยงามและเงียบสงบ อาหารเช้าริมน้ำรสชาติดี", author: "คุณอรุณศรี พ.", context: "กรุงเทพฯ" },
      { rating: 5, quote: "Exceptional boutique hotel right on the Chao Phraya River. Perfect location for exploring Bangkok Old Town.", author: "Thomas & Laura V.", context: "Switzerland" },
      { rating: 5, quote: "ชอบบรรยากาศความเป็นส่วนตัว เดินไปถนนพระอาทิตย์และวัดพระแก้วง่ายมาก นั่งจิบค็อกเทลริมน้ำตอนเย็นคือไฮไลต์", author: "แขกตัวอย่าง", context: "พระนคร" },
    ].map((row, i) => item("review", i, row)),
    locationInfo: {
      address: "48 ถนนพระอาทิตย์ แขวงชนะสงคราม เขตพระนคร กรุงเทพฯ 10200",
      hours: [{ _key: "hours-all", _type: "openingHours", days: "ต้อนรับ", time: "24 ชั่วโมง" }],
      phone: "02-123-4567",
      mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Phra+Athit+Road,Phra+Nakhon,Bangkok",
      mapsEmbedUrl: "https://www.google.com/maps?q=Phra+Athit+Road,Phra+Nakhon,Bangkok,Thailand&output=embed",
    },
    gallery: [
      ["1566073771259-6a8506099945", "คอร์ทยาร์ดและสระ"],
      ["1598928506311-c55ded91a20c", "ห้องพัก Heritage"],
      ["1576013551627-0cc20b96c2a7", "สระน้ำเกลือคอร์ทยาร์ด"],
      ["1555396273-367ea4eb4db5", "ห้องอาหารระเบียงเจ้าพระยา"],
    ].map(([photo, alt], i) => item("gal", i, { imageUrl: unsplash(photo), alt })),
  },
  {
    _id: "projectOneDemo-paw-and-co",
    slug: "paw-and-co",
    title: "Paw & Co.",
    businessType: "pets",
    architectureStack: "Curated Categories / Store Walkthrough / Brand Partners",
    hero: {
      heading: "Paw & Co.",
      tagline: "ศูนย์รวมสินค้าสัตว์เลี้ยงพรีเมียมและไลฟ์สไตล์บูทีค สำหรับสมาชิกสี่ขาในครอบครัวคุณ",
      imageUrl: unsplash("1541599540903-216a46ca1dc0", 2000),
    },
    seo: {
      metaTitle: "Paw & Co. | ศูนย์รวมสินค้าสัตว์เลี้ยงพรีเมียม",
      metaDescription: "อาหาร ขนม ของใช้ ดีไซน์ และไลฟ์สไตล์สำหรับสัตว์เลี้ยง ย่านพระราม 3",
    },
    menuOrServices: [
      ["Freeze-Dried Raw Treats", "ขนมฟรีซดรายคัดส่วนผสม อ่านฉลากได้ มั่นใจสำหรับน้องแพ้ง่าย", "ตามชิ้น", "treats", "1589924691995-400dc9ecc119"],
      ["Handcrafted Leather Collar", "ปลอกคอหนังทำมือ ปรับขนาดได้ งานเย็บประณีต", "ตามชิ้น", "gear", "1601758228041-f3b2795255f1"],
      ["Natural Cotton Toy", "ของเล่นผ้าฝ้ายธรรมชาติ ปลอดภัยสำหรับน้องที่ชอบกัด", "ตามชิ้น", "play", "1576201836106-db1758fd1c97"],
      ["Orthopedic Memory Foam Bed", "เบาะเมมโมรี่โฟม รองรับข้อต่อ น้องนอนทั้งวัน", "ตามชิ้น", "home", "1541599540903-216a46ca1dc0"],
    ].map(([name, description, price, category, photo], i) =>
      item("prod", i, { name, description, price, category, imageUrl: unsplash(photo) }),
    ),
    reviews: [
      { rating: 5, quote: "ของในร้านคัดมาดีมากจริง ๆ ไม่ใช่แค่แพ็กเกจสวย พนักงานแนะนำได้ตรงกับน้องหมาที่บ้านที่แพ้ง่ายมากค่ะ", author: "คุณมณฑิรา & น้องมิลค์กี้", context: "ลูกค้าย่านพระราม 3" },
      { rating: 5, quote: "บรรยากาศร้านดีมาก พาน้องแมวใส่กระเป๋ามาลองเบาะนอนได้ พนักงานใจดีไม่ยัดเยียดขาย", author: "คุณกิตติศักดิ์ & น้องถุงทอง", context: "สาธุประดิษฐ์" },
      { rating: 5, quote: "ของใช้ไลฟ์สไตล์สวยและใช้ได้จริง กลับมาซื้อซ้ำทุกเดือน", author: "ครอบครัวตัวอย่าง", context: "ยานนาวา" },
    ].map((row, i) => item("review", i, row)),
    locationInfo: {
      address: "ริมถนนพระราม 3 (ระหว่างซอยสาธุประดิษฐ์ 58 และวัดด่าน) แขวงบางโพงพาง เขตยานนาวา กรุงเทพฯ 10120",
      hours: [{ _key: "hours-all", _type: "openingHours", days: "ทุกวัน", time: "10:00 – 20:00 น." }],
      phone: "02-123-4567",
      mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Rama+3+Bangkok",
      mapsEmbedUrl: "https://www.google.com/maps?q=Rama+3,Bangkok,Thailand&output=embed",
    },
    gallery: [
      ["1583511655857-d19b40a7a54e", "ชามเซรามิกในครัว"],
      ["1548767797-d8c844163c4c", "ผลิตภัณฑ์กรูมมิ่ง"],
      ["1514888286974-6c03e2ca1dba", "น้องแมวกับของเล่น"],
      ["1535930891776-0c2dfb7fda1a", "น้องหมาในกระเป๋าเดินทาง"],
    ].map(([photo, alt], i) => item("gal", i, { imageUrl: unsplash(photo), alt })),
  },
  {
    _id: "projectOneDemo-petal-stem-florist",
    slug: "petal-stem-florist",
    title: "Petal & Stem Florist",
    businessType: "plants",
    architectureStack: "Occasion Matrix / Bouquet Sizes / Next-day Delivery Counter",
    hero: {
      heading: "Petal & Stem",
      tagline: "Flowers for every feeling. สตูดิโอดอกไม้สดและช่อดอกไม้สั่งทำตามความรู้สึก",
      imageUrl: unsplash("1526047932273-341f2a7631f9", 2000),
    },
    seo: {
      metaTitle: "Petal & Stem Florist | ร้านดอกไม้สด กรุงเทพฯ",
      metaDescription: "ช่อดอกไม้สั่งทำตามความรู้สึก พร้อมบริการจัดส่งด่วนในกรุงเทพฯ สุขุมวิท 49",
    },
    menuOrServices: [
      ["Petite", "ช่อกะทัดรัด น่ารัก สำหรับเซอร์ไพรส์ในวันธรรมดา", "เริ่มต้น ฿1,450", "size", "1563241527-3004b7be0ffd"],
      ["Classic", "ช่อขนาดมาตรฐานยอดนิยม สมดุลทั้งดอกไม้และใบประดับ", "เริ่มต้น ฿2,650", "size", "1561181286-d3fee7d55364"],
      ["Grand", "ช่อขนาดใหญ่ ดอกไม้นำเข้าคัดเกรดพรีเมียม", "เริ่มต้น ฿4,200", "size", "1582794543139-8ac9cb0f7b11"],
      ["Statement", "ชิ้นงานจัดดอกไม้ขนาดพิเศษสำหรับโอกาสสำคัญ", "ตามออเดอร์", "size", "1533616688419-b7a585564586"],
    ].map(([name, description, price, category, photo], i) =>
      item("bq", i, { name, description, price, category, imageUrl: unsplash(photo) }),
    ),
    reviews: [
      { rating: 5, quote: "ช่อวันเกิดสวยเกินคาด ดอกไม้สดและห่อพัสดุประณีตมาก ส่งตรงเวลาที่สุขุมวิท", author: "ลูกค้าตัวอย่าง", context: "สั่งช่อวันเกิด (สุขุมวิท)" },
      { rating: 5, quote: "ทีมจัดตามโทนสีที่ส่งไปได้exact เลย รู้สึกถึงความตั้งใจในทุกก้าน", author: "คุณแพร", context: "ช่อรับปริญญา" },
      { rating: 5, quote: "บริการจัดส่งด่วนช่วยงานฉุกเฉินได้จริง ดอกยังสดเมื่อถึงมือผู้รับ", author: "คุณต้น", context: "Next-day delivery" },
    ].map((row, i) => item("review", i, row)),
    locationInfo: {
      address: "42 ซอยสุขุมวิท 49 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110",
      hours: [{ _key: "hours-all", _type: "openingHours", days: "ทุกวัน", time: "09:00 – 19:00 น." }],
      phone: "02-890-1234",
      mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Sukhumvit+49+Bangkok",
      mapsEmbedUrl: "https://www.google.com/maps?q=Sukhumvit+49,Watthana,Bangkok,Thailand&output=embed",
    },
    gallery: [
      ["1561181286-d3fee7d55364", "ช่อคลาสสิก"],
      ["1526047932273-341f2a7631f9", "ช่อสวนเช้า"],
      ["1582794543139-8ac9cb0f7b11", "ช่อแกรนด์"],
      ["1518709268805-4e9042af9f23", "ก้านกุหลาบ"],
    ].map(([photo, alt], i) => item("gal", i, { imageUrl: unsplash(photo), alt })),
  },
];

async function main() {
  loadEnvFiles();
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_TOKEN;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

  if (!projectId) {
    console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
    process.exit(1);
  }
  if (!token) {
    console.error(
      "Missing SANITY_API_TOKEN. Create an Editor token at https://www.sanity.io/manage → API → Tokens",
    );
    process.exit(1);
  }

  const { createClient } = await import("@sanity/client");
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  for (const demo of demos) {
    const doc = {
      _id: demo._id,
      _type: "projectOneDemo",
      title: demo.title,
      slug: { _type: "slug", current: demo.slug },
      businessType: demo.businessType,
      published: true,
      architectureStack: demo.architectureStack,
      hero: demo.hero,
      menuOrServices: demo.menuOrServices,
      reviews: demo.reviews,
      locationInfo: demo.locationInfo,
      gallery: demo.gallery,
      seo: demo.seo,
    };
    await client.createOrReplace(doc);
    console.log(`Upserted ${demo._id} → /ProjectONE/${demo.slug}/`);
  }

  const pages = [
    {
      _id: "page-home",
      _type: "page",
      title: "Home",
      slug: { _type: "slug", current: "home" },
      seo: {
        metaTitle: "PuchUp — สร้างระบบผู้ช่วยธุรกิจ",
        metaDescription:
          "ออกแบบเว็บไซต์และระบบดิจิทัลที่ช่วยลูกค้าค้นหา ตัดสินใจ ติดต่อ และช่วยธุรกิจทำงานต่อได้",
      },
      sections: [
        {
          _key: "home-hero",
          _type: "heroSection",
          heading: "PuchUp สร้างระบบผู้ช่วยธุรกิจ",
          subheading:
            "เราออกแบบเว็บไซต์และระบบดิจิทัลที่ไม่ได้มีไว้แค่ให้คนเข้ามาดู แต่ช่วยลูกค้าค้นหา ตัดสินใจ ติดต่อ และช่วยธุรกิจทำงานต่อได้",
          ctas: [
            {
              _key: "home-hero-cta-1",
              _type: "ctaButton",
              label: "เล่าธุรกิจให้ PuchUp ฟัง",
              href: "/contact/",
              style: "primary",
            },
            {
              _key: "home-hero-cta-2",
              _type: "ctaButton",
              label: "ดู Showroom",
              href: "/demo/",
              style: "secondary",
            },
          ],
        },
        {
          _key: "home-features",
          _type: "featuresSection",
          heading: "เราไม่ได้ขายจำนวนหน้าเว็บ",
          intro: "เราเริ่มจากปัญหาของธุรกิจ แล้วออกแบบระบบเข้าไปช่วย",
          items: [
            item("feat", 0, {
              icon: "🔎",
              title: "ลูกค้าหาของไม่เจอ",
              body: "สร้างระบบช่วยค้นหาและคัดตัวเลือก แทนการให้ลูกค้าไล่ดูข้อมูลเอง",
            }),
            item("feat", 1, {
              icon: "⚖️",
              title: "ลูกค้าเลือกไม่ถูก",
              body: "สร้างระบบช่วยเปรียบเทียบ แนะนำ และตัดสินใจ",
            }),
            item("feat", 2, {
              icon: "💬",
              title: "ลูกค้าต้องโทรถาม",
              body: "สร้างระบบให้ลูกค้าคุย ขอข้อมูล และเริ่มบริการได้ทันที",
            }),
            item("feat", 3, {
              icon: "📅",
              title: "ลูกค้าต้องจอง",
              body: "สร้างระบบจองคิว จองโต๊ะ หรือนัดหมายในบทสนทนา",
            }),
            item("feat", 4, {
              icon: "📥",
              title: "ทีมตามงานไม่ทัน",
              body: "สร้าง workflow จากบทสนทนาและข้อมูลจริง",
            }),
            item("feat", 5, {
              icon: "🧩",
              title: "เว็บกับระบบแยกกัน",
              body: "ออกแบบให้เว็บไซต์เป็นส่วนหนึ่งของระบบธุรกิจ",
            }),
          ],
        },
        {
          _key: "home-pricing",
          _type: "pricingSection",
          heading: "เริ่มจากหน้าเดียวที่ทำงานได้จริง",
          intro: "แพ็กเกจตัวอย่างสำหรับ Project ONE — ปรับรายละเอียดใน Studio ได้",
          plans: [
            item("plan", 0, {
              name: "Starter",
              price: "เริ่มคุย",
              blurb: "หน้าเดียว + เนื้อหาธุรกิจพื้นฐาน",
              features: ["Hero + บริการ", "แผนที่และช่องทางติดต่อ", "ปรับข้อความผ่าน Studio"],
              ctaLabel: "ติดต่อ",
              ctaHref: "/contact/",
              highlighted: false,
            }),
            item("plan", 1, {
              name: "Showroom",
              price: "แนะนำ",
              blurb: "หน้าเดียวพร้อมรีวิว แกลเลอรี และสถานะ Live ใน Showroom",
              features: ["รีวิวและแกลเลอรี", "ลิงก์ Showroom 50 ธุรกิจ", "เดโม HTML หรือ CMS"],
              ctaLabel: "ดู Showroom",
              ctaHref: "/demo/",
              highlighted: true,
            }),
            item("plan", 2, {
              name: "Custom System",
              price: "ตามขอบเขต",
              blurb: "ต่อยอดเป็นระบบช่วยค้นหา จอง หรือ workflow",
              features: ["ออกแบบตามปัญหาธุรกิจ", "เชื่อมต่อกระบวนการจริง", "ขยายได้ทีละโมดูล"],
              ctaLabel: "เล่าธุรกิจ",
              ctaHref: "/contact/",
              highlighted: false,
            }),
          ],
        },
        {
          _key: "home-cta",
          _type: "ctaSection",
          heading: "พร้อมให้ระบบช่วยธุรกิจของคุณแล้วหรือยัง?",
          body: "เล่าปัญหาธุรกิจมาได้เลย ไม่ต้องเตรียมบรีฟยาว",
          ctas: [
            {
              _key: "home-cta-1",
              _type: "ctaButton",
              label: "เล่าธุรกิจให้ PuchUp ฟัง",
              href: "/contact/",
              style: "primary",
            },
          ],
        },
      ],
    },
    {
      _id: "page-demo",
      _type: "page",
      title: "Showroom",
      slug: { _type: "slug", current: "demo" },
      seo: {
        metaTitle: "PuchUp ONE — Showroom",
        metaDescription: "สำรวจ 50 ไอเดียธุรกิจแบบ Project ONE และเปิดเดโมร้านที่ทำแล้ว",
      },
      sections: [
        {
          _key: "demo-hero",
          _type: "heroSection",
          heading: "Showroom 50 ธุรกิจ",
          subheading:
            "ไอเดียเว็บไซต์หน้าเดียวที่เรื่องราวธุรกิจครบ — เปิดเดโมร้านที่ทำแล้ว และดูแนวทางสำหรับธุรกิจที่กำลังออกแบบ",
          ctas: [
            {
              _key: "demo-hero-cta-1",
              _type: "ctaButton",
              label: "เปิด Project ONE",
              href: "/ProjectONE/",
              style: "primary",
            },
          ],
        },
        {
          _key: "demo-showroom",
          _type: "demoShowcaseGrid",
          heading: "คลัง Showroom",
          intro: "รายการ 50 ธุรกิจจากคลังโชว์รูม พร้อมสถานะ Live จากเอกสาร Project ONE Demos",
          useShowroomCatalog: true,
          items: [],
        },
      ],
    },
    {
      _id: "page-projectone",
      _type: "page",
      title: "Project ONE",
      slug: { _type: "slug", current: "projectone" },
      seo: {
        metaTitle: "Project ONE | One Page. Full Business.",
        metaDescription: "เว็บไซต์หน้าเดียว ที่ทำให้ลูกค้ารู้จักธุรกิจ ตัดสินใจ และอยากมาที่ร้าน",
      },
      sections: [
        {
          _key: "po-hero",
          _type: "heroSection",
          heading: "One Page. Full Business.",
          subheading:
            "เว็บไซต์หน้าเดียว ที่ทำให้ลูกค้ารู้จักธุรกิจ ตัดสินใจ และอยากมาที่ร้าน — เปิด Showroom เพื่อดู 50 แนวทางและเดโมจริง",
          ctas: [
            {
              _key: "po-hero-cta-1",
              _type: "ctaButton",
              label: "เข้า Showroom",
              href: "/demo/",
              style: "primary",
            },
            {
              _key: "po-hero-cta-2",
              _type: "ctaButton",
              label: "บ้านข้าวหอม",
              href: "/ProjectONE/baankhaokhom/",
              style: "secondary",
            },
          ],
        },
      ],
    },
  ];

  for (const page of pages) {
    await client.createOrReplace(page);
    console.log(`Upserted ${page._id} → slug=${page.slug.current}`);
  }

  await client.createIfNotExists({
    _id: "siteSettings",
    _type: "siteSettings",
    siteName: "PuchUp",
    tagline: "สร้างระบบผู้ช่วยธุรกิจ",
  });
  console.log("Ensured siteSettings exists (favicon อัปโหลดใน Studio ไม่ถูกทับ)");

  console.log("Done. Open Studio (npm run sanity) to edit Pages + Project ONE Demos.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
