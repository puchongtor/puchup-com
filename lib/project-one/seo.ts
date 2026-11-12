import type { Metadata } from "next";
import { site } from "@/lib/site";
import { canonicalDemoSlug } from "@/lib/project-one/slugs";

/**
 * Local SEO profiles for Project ONE demos.
 * Primary = high-intent {ประเภท}+{ย่าน} that people actually search.
 * Keep 6–8 keywords: 1 primary + near variants + buyer-intent “รับทำเว็บ…”.
 */
export type DemoSeoProfile = {
  slug: string;
  businessType: string;
  location: string;
  primary: string;
  keywords: string[];
  brand?: string;
};

export const DEMO_SEO: Record<string, DemoSeoProfile> = {
  restaurant: {
    slug: "restaurant",
    brand: "บ้านข้าวหอม",
    businessType: "ร้านอาหารไทย",
    location: "ทองหล่อ",
    primary: "ร้านอาหารไทยทองหล่อ",
    keywords: [
      "ร้านอาหารไทยทองหล่อ",
      "ร้านอาหารทองหล่อ",
      "อาหารไทยทองหล่อ",
      "ร้านข้าวสวยทองหล่อ",
      "จองโต๊ะทองหล่อ",
      "เว็บไซต์ร้านอาหาร",
      "รับทำเว็บร้านอาหาร",
      "ตัวอย่างเว็บร้านอาหาร",
    ],
  },
  cafe: {
    slug: "cafe",
    brand: "Komorebi Coffee",
    businessType: "คาเฟ่",
    location: "สุขุมวิท 49",
    primary: "คาเฟ่สุขุมวิท 49",
    keywords: [
      "คาเฟ่สุขุมวิท 49",
      "ร้านกาแฟสุขุมวิท 49",
      "specialty coffee สุขุมวิท",
      "คาเฟ่ทองหล่อ",
      "เว็บไซต์คาเฟ่",
      "รับทำเว็บคาเฟ่",
      "ตัวอย่างเว็บร้านกาแฟ",
    ],
  },
  bakery: {
    slug: "bakery",
    brand: "Komorebi Bakehouse",
    businessType: "เบเกอรี",
    location: "อารีย์",
    primary: "เบเกอรีอารีย์",
    keywords: [
      "เบเกอรีอารีย์",
      "ร้านขนมปังอารีย์",
      "ครัวซองต์อารีย์",
      "เบเกอรี่พหลโยธิน",
      "เว็บไซต์เบเกอรี",
      "รับทำเว็บร้านขนม",
      "ตัวอย่างเว็บเบเกอรี",
    ],
  },
  customcake: {
    slug: "customcake",
    brand: "Le Petit Bakehouse",
    businessType: "เค้กวันเกิดสั่งทำ",
    location: "อารีย์",
    primary: "เค้กวันเกิดสั่งทำอารีย์",
    keywords: [
      "เค้กวันเกิดสั่งทำอารีย์",
      "เค้กสั่งทำกรุงเทพ",
      "custom cake อารีย์",
      "เค้กมินิมอลกรุงเทพ",
      "รับทำเค้กวันเกิด",
      "เว็บไซต์ร้านเค้ก",
      "รับทำเว็บร้านเค้ก",
    ],
  },
  pizzeria: {
    slug: "pizzeria",
    brand: "เตาถ่าน พิซซ่าเฮ้าส์",
    businessType: "ร้านพิซซ่า",
    location: "สะพานควาย",
    primary: "ร้านพิซซ่าสะพานควาย",
    keywords: [
      "ร้านพิซซ่าสะพานควาย",
      "พิซซ่าเตาฟืนประดิพัทธ์",
      "พิซซ่าพหลโยธิน",
      "ร้านพิซซ่ากรุงเทพ",
      "เว็บไซต์ร้านพิซซ่า",
      "รับทำเว็บร้านอาหาร",
      "ตัวอย่างเว็บพิซซ่า",
    ],
  },
  dental: {
    slug: "dental",
    brand: "บ้านฟันดี",
    businessType: "คลินิกทันตกรรม",
    location: "พระราม 3",
    primary: "คลินิกทันตกรรมพระราม 3",
    keywords: [
      "คลินิกทันตกรรมพระราม 3",
      "ทำฟันพระราม 3",
      "จัดฟันพระราม 3",
      "หมอฟันเด็กพระราม 3",
      "เว็บไซต์คลินิกทันตกรรม",
      "รับทำเว็บคลินิก",
      "ตัวอย่างเว็บคลินิกฟัน",
    ],
  },
  aesthetic: {
    slug: "aesthetic",
    brand: "Aura Elite",
    businessType: "คลินิกความงาม",
    location: "ทองหล่อ",
    primary: "คลินิกความงามทองหล่อ",
    keywords: [
      "คลินิกความงามทองหล่อ",
      "คลินิกเลเซอร์ทองหล่อ",
      "ฉีดโบท็อกทองหล่อ",
      "Pico Laser ทองหล่อ",
      "เว็บไซต์คลินิกความงาม",
      "รับทำเว็บคลินิกความงาม",
      "ตัวอย่างเว็บคลินิกสวย",
    ],
  },
  "rebalance-physio": {
    slug: "rebalance-physio",
    brand: "ReBalance",
    businessType: "คลินิกกายภาพบำบัด",
    location: "พระราม 3",
    primary: "คลินิกกายภาพบำบัดพระราม 3",
    keywords: [
      "คลินิกกายภาพบำบัดพระราม 3",
      "กายภาพออฟฟิศซินโดรม",
      "รักษาปวดหลังกรุงเทพ",
      "ช็อคเวฟกายภาพ",
      "เว็บไซต์คลินิกกายภาพ",
      "รับทำเว็บคลินิก",
      "ตัวอย่างเว็บกายภาพบำบัด",
    ],
  },
  optometry: {
    slug: "optometry",
    brand: "Optima Vision Care",
    businessType: "ร้านแว่นตา",
    location: "กรุงเทพ",
    primary: "ร้านแว่นตากรุงเทพ",
    keywords: [
      "ร้านแว่นตากรุงเทพ",
      "ตรวจสายตาทัศนมาตร",
      "เลนส์โปรเกรสซีฟ",
      "ตัดแว่นกรุงเทพ",
      "เว็บไซต์ร้านแว่น",
      "รับทำเว็บร้านแว่นตา",
      "ตัวอย่างเว็บร้านแว่น",
    ],
  },
  tcmclinic: {
    slug: "tcmclinic",
    brand: "หานชุนถัง",
    businessType: "คลินิกแพทย์แผนจีน",
    location: "กรุงเทพ",
    primary: "คลินิกแพทย์แผนจีนกรุงเทพ",
    keywords: [
      "คลินิกแพทย์แผนจีนกรุงเทพ",
      "ฝังเข็มกรุงเทพ",
      "ครอบแก้วบำบัด",
      "ยาสมุนไพรจีน",
      "เว็บไซต์คลินิกแผนจีน",
      "รับทำเว็บคลินิก",
      "ตัวอย่างเว็บแพทย์แผนจีน",
    ],
  },
  hotel: {
    slug: "hotel",
    brand: "Baan Bangkok",
    businessType: "โรงแรมบูทีค",
    location: "ริมแม่น้ำเจ้าพระยา",
    primary: "โรงแรมบูทีคริมแม่น้ำเจ้าพระยา",
    keywords: [
      "โรงแรมบูทีคริมแม่น้ำเจ้าพระยา",
      "ที่พักริมเจ้าพระยา",
      "โรงแรมกรุงเทพวิวแม่น้ำ",
      "จองโรงแรมบูทีคกรุงเทพ",
      "เว็บไซต์โรงแรม",
      "รับทำเว็บโรงแรม",
      "ตัวอย่างเว็บโรงแรม",
    ],
  },
  massagespa: {
    slug: "massagespa",
    brand: "ธารา สปา",
    businessType: "นวดแผนไทย",
    location: "กรุงเทพ",
    primary: "นวดแผนไทยกรุงเทพ",
    keywords: [
      "นวดแผนไทยกรุงเทพ",
      "สปานวดกรุงเทพ",
      "นวดอโรม่า",
      "นวดคู่รักกรุงเทพ",
      "เว็บไซต์ร้านนวด",
      "รับทำเว็บสปา",
      "ตัวอย่างเว็บร้านนวด",
    ],
  },
  petstore: {
    slug: "petstore",
    brand: "Paw & Co.",
    businessType: "ร้านสัตว์เลี้ยง",
    location: "พระราม 3",
    primary: "ร้านสัตว์เลี้ยงพระราม 3",
    keywords: [
      "ร้านสัตว์เลี้ยงพระราม 3",
      "อาหารสุนัขพระราม 3",
      "เพ็ทช็อปพระราม 3",
      "อาบน้ำตัดขนสุนัข",
      "เว็บไซต์ร้านสัตว์เลี้ยง",
      "รับทำเว็บเพ็ทช็อป",
      "ตัวอย่างเว็บร้านสัตว์เลี้ยง",
    ],
  },
  petcare: {
    slug: "petcare",
    brand: "PetCare Care Center",
    businessType: "โรงแรมสัตว์เลี้ยง",
    location: "พระราม 3",
    primary: "โรงแรมสุนัขพระราม 3",
    keywords: [
      "โรงแรมสุนัขพระราม 3",
      "ฝากเลี้ยงสุนัขพระราม 3",
      "กรูมมิ่งสุนัข",
      "สปาสัตว์เลี้ยง",
      "เว็บไซต์โรงแรมสัตว์เลี้ยง",
      "รับทำเว็บเพ็ทแคร์",
      "ตัวอย่างเว็บฝากเลี้ยง",
    ],
  },
  airservice: {
    slug: "airservice",
    brand: "CoolMaster",
    businessType: "ล้างแอร์",
    location: "บางนา",
    primary: "ล้างแอร์บางนา",
    keywords: [
      "ล้างแอร์บางนา",
      "ล้างแอร์ศรีนครินทร์",
      "ล้างแอร์บ้านด่วน",
      "บริการล้างแอร์กรุงเทพ",
      "เว็บไซต์ร้านล้างแอร์",
      "รับทำเว็บช่างแอร์",
      "ตัวอย่างเว็บล้างแอร์",
    ],
  },
  curtain: {
    slug: "curtain",
    brand: "CurtainCraft",
    businessType: "ผ้าม่านสั่งตัด",
    location: "ราชพฤกษ์",
    primary: "ผ้าม่านสั่งตัดราชพฤกษ์",
    keywords: [
      "ผ้าม่านสั่งตัดราชพฤกษ์",
      "ร้านผ้าม่านนนทบุรี",
      "มู่ลี่วอลเปเปอร์",
      "วัดผ้าม่านถึงบ้าน",
      "เว็บไซต์ร้านผ้าม่าน",
      "รับทำเว็บร้านผ้าม่าน",
      "ตัวอย่างเว็บผ้าม่าน",
    ],
  },
  autogarage: {
    slug: "autogarage",
    brand: "MasterTech",
    businessType: "อู่ซ่อมรถ",
    location: "โชคชัย 4",
    primary: "อู่ซ่อมรถโชคชัย 4",
    keywords: [
      "อู่ซ่อมรถโชคชัย 4",
      "อู่รถไฮบริดลาดพร้าว",
      "ซ่อมแบตไฮบริด",
      "อู่รถยนต์กรุงเทพ",
      "เว็บไซต์อู่รถ",
      "รับทำเว็บอู่ซ่อมรถ",
      "ตัวอย่างเว็บอู่รถ",
    ],
  },
  carwash: {
    slug: "carwash",
    brand: "ProShine",
    businessType: "ล้างรถ",
    location: "พระราม 3",
    primary: "ล้างรถพระราม 3",
    keywords: [
      "ล้างรถพระราม 3",
      "เคลือบแก้วรถยนต์",
      "เคลือบเซรามิกรถ",
      "ศูนย์ล้างรถกรุงเทพ",
      "เว็บไซต์ร้านล้างรถ",
      "รับทำเว็บคาร์แคร์",
      "ตัวอย่างเว็บล้างรถ",
    ],
  },
  windowtint: {
    slug: "windowtint",
    brand: "SunShield",
    businessType: "ฟิล์มกรองแสงรถยนต์",
    location: "กรุงเทพ",
    primary: "ติดฟิล์มรถยนต์กรุงเทพ",
    keywords: [
      "ติดฟิล์มรถยนต์กรุงเทพ",
      "ฟิล์มกรองแสงเซรามิก",
      "PPF กันรอยรถยนต์",
      "ติดฟิล์มรถราคา",
      "เว็บไซต์ร้านฟิล์มรถ",
      "รับทำเว็บร้านฟิล์ม",
      "ตัวอย่างเว็บติดฟิล์มรถ",
    ],
  },
  bicycle: {
    slug: "bicycle",
    brand: "Velo Union",
    businessType: "ร้านจักรยาน",
    location: "สุขุมวิท 71",
    primary: "ร้านจักรยานสุขุมวิท 71",
    keywords: [
      "ร้านจักรยานสุขุมวิท 71",
      "ประกอบจักรยานกรุงเทพ",
      "bike fitting กรุงเทพ",
      "ร้านจักรยานอ่อนนุช",
      "เว็บไซต์ร้านจักรยาน",
      "รับทำเว็บร้านจักรยาน",
      "ตัวอย่างเว็บจักรยาน",
    ],
  },
  accounting: {
    slug: "accounting",
    brand: "Apex Accounting",
    businessType: "สำนักงานบัญชี",
    location: "สาทร",
    primary: "สำนักงานบัญชีสาทร",
    keywords: [
      "สำนักงานบัญชีสาทร",
      "รับทำบัญชี SME",
      "จดบริษัท DBD",
      "บัญชีภาษีกรุงเทพ",
      "เว็บไซต์สำนักงานบัญชี",
      "รับทำเว็บบัญชี",
      "ตัวอย่างเว็บสำนักงานบัญชี",
    ],
  },
  artstudio: {
    slug: "artstudio",
    brand: "Craft & Clay",
    businessType: "สตูดิโอศิลปะ",
    location: "อารีย์",
    primary: "สตูดิโอศิลปะอารีย์",
    keywords: [
      "สตูดิโอศิลปะอารีย์",
      "คลาสปั้นดินอารีย์",
      "เวิร์กช็อปเซรามิกกรุงเทพ",
      "เรียนศิลปะเด็กอารีย์",
      "เว็บไซต์สตูดิโอศิลปะ",
      "รับทำเว็บสตูดิโอ",
      "ตัวอย่างเว็บคลาสศิลปะ",
    ],
  },
  florist: {
    slug: "florist",
    brand: "Tara Florist",
    businessType: "ร้านดอกไม้",
    location: "สุขุมวิท 49",
    primary: "ร้านดอกไม้สุขุมวิท 49",
    keywords: [
      "ร้านดอกไม้สุขุมวิท 49",
      "ช่อดอกไม้ทองหล่อ",
      "ส่งดอกไม้ด่วนกรุงเทพ",
      "ดอกไม้วันเกิดสุขุมวิท",
      "เว็บไซต์ร้านดอกไม้",
      "รับทำเว็บร้านดอกไม้",
      "ตัวอย่างเว็บฟลอริสต์",
    ],
  },
  stone: {
    slug: "stone",
    brand: "Auspicious Stone",
    businessType: "ร้านหินมงคล",
    location: "กรุงเทพ",
    primary: "ร้านหินมงคลกรุงเทพ",
    keywords: [
      "ร้านหินมงคลกรุงเทพ",
      "หินเสริมดวง",
      "อัญมณีมงคล",
      "หินแท้คัดเกรด",
      "เว็บไซต์ร้านหินมงคล",
      "รับทำเว็บแกลเลอรี",
      "ตัวอย่างเว็บหินมงคล",
    ],
  },
  printing: {
    slug: "printing",
    brand: "PrintCraft",
    businessType: "โรงพิมพ์",
    location: "เจริญกรุง",
    primary: "โรงพิมพ์เจริญกรุง",
    keywords: [
      "โรงพิมพ์เจริญกรุง",
      "พิมพ์นามบัตรด่วน",
      "โรงพิมพ์ดิจิทัลกรุงเทพ",
      "ปั๊มฟอยล์การ์ด",
      "เว็บไซต์โรงพิมพ์",
      "รับทำเว็บโรงพิมพ์",
      "ตัวอย่างเว็บโรงพิมพ์",
    ],
  },
  phonerepair: {
    slug: "phonerepair",
    brand: "iFix Pro",
    businessType: "ซ่อมมือถือ",
    location: "กรุงเทพ",
    primary: "ซ่อมมือถือกรุงเทพ",
    keywords: [
      "ซ่อมมือถือกรุงเทพ",
      "เปลี่ยนจอไอโฟน",
      "เปลี่ยนแบตมือถือ",
      "ซ่อมมือถือด่วน",
      "เว็บไซต์ร้านซ่อมมือถือ",
      "รับทำเว็บร้านซ่อม",
      "ตัวอย่างเว็บซ่อมมือถือ",
    ],
  },
  laundry: {
    slug: "laundry",
    brand: "Clean & Care",
    businessType: "ซักอบรีด",
    location: "กรุงเทพ",
    primary: "ร้านซักอบรีดกรุงเทพ",
    keywords: [
      "ร้านซักอบรีดกรุงเทพ",
      "ซักแห้งชุดสูท",
      "สปาซักผ้า",
      "บริการรับส่งซักรีด",
      "เว็บไซต์ร้านซักรีด",
      "รับทำเว็บร้านซักอบรีด",
      "ตัวอย่างเว็บซักรีด",
    ],
  },
  pilates: {
    slug: "pilates",
    brand: "CoreFlow",
    businessType: "พิลาทิส",
    location: "กรุงเทพ",
    primary: "พิลาทิสกรุงเทพ",
    keywords: [
      "พิลาทิสกรุงเทพ",
      "Reformer Pilates",
      "สตูดิโอพิลาทิส",
      "โยคะกลุ่มเล็ก",
      "เว็บไซต์สตูดิโอพิลาทิส",
      "รับทำเว็บฟิตเนส",
      "ตัวอย่างเว็บพิลาทิส",
    ],
  },
  muaythaigym: {
    slug: "muaythaigym",
    brand: "Singha Muay Thai",
    businessType: "ค่ายมวยไทย",
    location: "กรุงเทพ",
    primary: "ค่ายมวยไทยกรุงเทพ",
    keywords: [
      "ค่ายมวยไทยกรุงเทพ",
      "เรียนมวยไทย",
      "ฟิตเนสมวยไทย",
      "Muay Thai gym Bangkok",
      "เว็บไซต์ค่ายมวย",
      "รับทำเว็บยิม",
      "ตัวอย่างเว็บมวยไทย",
    ],
  },
};

export function getDemoSeo(slug: string): DemoSeoProfile | null {
  return DEMO_SEO[canonicalDemoSlug(slug)] || null;
}

export function demoSeoTitle(profile: DemoSeoProfile): string {
  return `${profile.primary} | ตัวอย่างเว็บ Project ONE — PuchUp`;
}

export function demoSeoDescription(profile: DemoSeoProfile): string {
  const kw = profile.keywords.slice(0, 4).join(" · ");
  return (
    `ตัวอย่างเว็บ${profile.businessType}${profile.location} สไตล์ Project ONE — ` +
    `หน้าเดียว โหลดเร็ว ปิดการขายด้วย LINE/Google Maps · คีย์เวิร์ด: ${kw} · ` +
    `ไม่ใช่ร้านจริง เป็นเดโมรับทำเว็บธุรกิจท้องถิ่นโดย PuchUp`
  );
}

export function buildDemoMetadata(slug: string): Metadata {
  const profile = getDemoSeo(slug);
  const canonical = canonicalDemoSlug(slug);
  const path = `/ProjectONE/${canonical}/`;
  const url = new URL(path, site.url).toString();

  if (!profile) {
    return {
      title: "Project ONE Demo — PuchUp",
      alternates: { canonical: path },
    };
  }

  const title = demoSeoTitle(profile);
  const description = demoSeoDescription(profile);

  return {
    title,
    description,
    keywords: profile.keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "th_TH",
      url,
      siteName: "PuchUp",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    other: {
      "demo:product": "Project ONE",
      "demo:status": "sample-not-real-business",
    },
  };
}

/** JSON-LD: honest demo WebPage + offer CTA, keyword-rich for local buyers */
export function buildDemoJsonLd(slug: string): Record<string, unknown> | null {
  const profile = getDemoSeo(slug);
  if (!profile) return null;
  const canonical = canonicalDemoSlug(slug);
  const path = `/ProjectONE/${canonical}/`;
  const url = new URL(path, site.url).toString();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: demoSeoTitle(profile),
        description: demoSeoDescription(profile),
        inLanguage: "th-TH",
        isPartOf: { "@type": "WebSite", name: "PuchUp", url: site.url },
        about: {
          "@type": "Service",
          name: "Project ONE",
          provider: {
            "@type": "Organization",
            name: "PuchUp",
            url: site.url,
          },
          areaServed: "TH",
          serviceType: "รับทำเว็บไซต์ธุรกิจท้องถิ่นหน้าเดียว",
        },
        keywords: profile.keywords.join(", "),
        audience: {
          "@type": "Audience",
          audienceType: "เจ้าของธุรกิจท้องถิ่นที่ต้องการเว็บไซต์",
        },
      },
      {
        "@type": "Offer",
        name: `รับทำเว็บ${profile.businessType} สไตล์ Project ONE`,
        description: `สั่งทำหน้าเว็บแนวเดียวกับตัวอย่าง ${profile.primary}`,
        url: new URL("/contact/", site.url).toString(),
        category: profile.primary,
        seller: {
          "@type": "Organization",
          name: "PuchUp",
          url: site.url,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "PuchUp", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Project ONE",
            item: new URL("/ProjectONE/", site.url).toString(),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "ตัวอย่างธุรกิจ",
            item: new URL("/ProjectONE/demo/", site.url).toString(),
          },
          {
            "@type": "ListItem",
            position: 4,
            name: profile.primary,
            item: url,
          },
        ],
      },
    ],
  };
}
