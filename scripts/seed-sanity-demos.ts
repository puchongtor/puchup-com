/**
 * Seed Demo Sites into Sanity so editors can tweak HTML/prompts in Studio.
 *
 * Requires SANITY_API_TOKEN (Editor) in .env.local
 * Usage: npm run sanity:seed-demos
 */
import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { loadEnvFiles } from "../lib/imagen/load-env";

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

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

function loadHtml(name: string) {
  const file = path.join(process.cwd(), "content", "demos", name);
  if (!existsSync(file)) {
    throw new Error(`Missing ${file}`);
  }
  return readFileSync(file, "utf8");
}

const demos = [
  {
    _id: "demoSite-restaurant",
    _type: "demoSite" as const,
    title: "บ้านสวนไทย — Restaurant Demo",
    subdomain: { _type: "slug" as const, current: "restaurant" },
    published: true,
    brandDetails: {
      name: "บ้านสวนไทย",
      description:
        "เดโมร้านอาหารแนว Project ONE — หน้าเดียวครบเรื่องราว เมนู และจองโต๊ะ",
      theme: {
        primary: "#0D182C",
        accent: "#F0553C",
        background: "#FCFAF5",
        text: "#172033",
      },
      menuLinks: [
        { label: "Project ONE", href: "/ProjectONE/" },
        { label: "Demo Hub", href: "/ProjectONE/Demo/" },
      ],
    },
    codeEmbed: {
      title: "Restaurant One-Pager",
      html: loadHtml("restaurant.html"),
      fullPage: true,
      minHeight: 900,
    },
    imagePrompts: [
      {
        _key: "hero",
        slotName: "hero",
        promptText:
          "Traditional Thai restaurant courtyard with wooden tables and lush greenery, warm daylight, editorial travel photography",
        aspectRatio: "16:9",
      },
      {
        _key: "dish",
        slotName: "signature-dish",
        promptText:
          "Close-up of Thai green curry and jasmine rice on ceramic plate, natural window light, premium food photography",
        aspectRatio: "4:3",
      },
    ],
    seo: {
      metaTitle: "บ้านสวนไทย — Restaurant Demo | PuchUp",
      metaDescription: "เดโมร้านอาหารหน้าเดียว สไตล์ Project ONE โดย PuchUp",
    },
  },
  {
    _id: "demoSite-aeropulse",
    _type: "demoSite" as const,
    title: "AeroPulse — Bike Studio Demo",
    subdomain: { _type: "slug" as const, current: "aeropulse" },
    published: true,
    brandDetails: {
      name: "AeroPulse Bike Studio",
      description: "ระบบช่วยลูกค้าเลือกจักรยาน แทนการไล่ดูสเปกทีละคัน",
      theme: {
        primary: "#0D182C",
        accent: "#F0553C",
        background: "#FCFAF5",
        text: "#172033",
      },
      menuLinks: [
        { label: "Case Study", href: "/showcase/aeropulse/" },
        { label: "Project ONE", href: "/ProjectONE/" },
      ],
    },
    codeEmbed: {
      title: "AeroPulse Finder",
      html: loadHtml("aeropulse.html"),
      fullPage: true,
      minHeight: 900,
    },
    imagePrompts: [] as {
      _key: string;
      slotName: string;
      promptText: string;
      aspectRatio: string;
    }[],
    seo: {
      metaTitle: "AeroPulse Bike Studio | PuchUp Demo",
      metaDescription: "เดโมระบบช่วยเลือกจักรยาน — Smart Finder โดย PuchUp",
    },
  },
];

async function main() {
  for (const doc of demos) {
    const result = await client.createOrReplace(doc as Parameters<typeof client.createOrReplace>[0]);
    console.log(`Upserted ${result._id} → ${doc.subdomain.current}.puchup.com`);
  }

  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    siteName: "PuchUp",
    tagline: "สร้างระบบผู้ช่วยธุรกิจ",
    mainNav: [
      { label: "Project ONE", href: "/ProjectONE/" },
      { label: "Demo", href: "/ProjectONE/Demo/" },
      { label: "Build", href: "/build/" },
      { label: "Showcase", href: "/showcase/" },
      { label: "Products", href: "/products/" },
      { label: "How We Work", href: "/how-we-work/" },
      { label: "About", href: "/about/" },
    ],
    footerText: "PuchUp สร้างระบบที่ช่วยให้ธุรกิจทำงานได้ดีขึ้น",
    contactEmail: "hello@puchup.com",
    seo: {
      metaTitle: "PuchUp — สร้างระบบผู้ช่วยธุรกิจ",
      metaDescription:
        "PuchUp สร้างระบบผู้ช่วยธุรกิจ — เว็บไซต์และระบบดิจิทัลที่ช่วยให้ธุรกิจทำงานได้ดีขึ้น",
    },
  });
  console.log("Upserted siteSettings");

  await client.createOrReplace({
    _id: "page-projectone",
    _type: "page",
    title: "Project ONE",
    slug: { _type: "slug", current: "projectone" },
    sections: [
      {
        _type: "heroSection",
        _key: "hero",
        heading: "One Page. Full Business.",
        subheading:
          "เว็บไซต์หน้าเดียว ที่ทำให้ลูกค้ารู้จักธุรกิจ ตัดสินใจ และอยากมาที่ร้าน",
        ctas: [
          {
            label: "เปิดหน้า Prototype",
            href: "/ProjectONE/",
            style: "primary",
          },
          {
            label: "ดู Demo Hub",
            href: "/ProjectONE/Demo/",
            style: "secondary",
          },
        ],
      },
      {
        _type: "demoShowcaseGrid",
        _key: "demos",
        heading: "เดโมที่พร้อมลอง",
        intro: "เปิดดูเดโมย่อย — แก้ข้อความและโค้ดได้ใน Sanity Studio",
        items: [
          {
            _key: "aero",
            title: "AeroPulse",
            subtitle: "Bike Studio",
            href: "/sites/aeropulse/",
            promptText:
              "Modern bike studio showroom with city bikes, soft daylight, premium retail photography",
          },
          {
            _key: "rest",
            title: "บ้านสวนไทย",
            subtitle: "Restaurant",
            href: "/sites/restaurant/",
            promptText:
              "Traditional Thai restaurant courtyard with wooden tables and lush greenery, warm daylight",
          },
        ],
      },
    ],
    seo: {
      metaTitle: "Project ONE | PuchUp",
      metaDescription:
        "เว็บไซต์หน้าเดียว ที่ทำให้ลูกค้ารู้จักธุรกิจ ตัดสินใจ และอยากมาที่ร้าน",
    },
  });
  console.log("Upserted page-projectone");
  console.log("Done. Open Studio (npm run sanity) to edit.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
