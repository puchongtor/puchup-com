import { readFileSync, existsSync } from "fs";
import path from "path";
import type { DemoSite } from "@/lib/sanity/types";

function loadDemoHtml(filename: string): string {
  const file = path.join(process.cwd(), "content", "demos", filename);
  if (!existsSync(file)) return "";
  return readFileSync(file, "utf8");
}

/**
 * Local fallbacks when Sanity has no published demoSite yet.
 * Maps subdomain → demo payload used by /sites/[site] and *.puchup.com.
 */
export function getLocalDemoSite(subdomain: string): DemoSite | null {
  const key = subdomain.toLowerCase();

  if (key === "restaurant") {
    const html = loadDemoHtml("restaurant.html");
    return {
      _id: "local-restaurant",
      title: "บ้านสวนไทย — Restaurant Demo",
      subdomain: "restaurant",
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
        html,
        fullPage: true,
        minHeight: 900,
      },
      imagePrompts: [
        {
          slotName: "hero",
          promptText:
            "Traditional Thai restaurant courtyard with wooden tables and lush greenery, warm daylight, editorial travel photography",
          aspectRatio: "16:9",
        },
        {
          slotName: "signature-dish",
          promptText:
            "Close-up of Thai green curry and jasmine rice on ceramic plate, natural window light, premium food photography",
          aspectRatio: "4:3",
        },
      ],
      seo: {
        metaTitle: "บ้านสวนไทย — Restaurant Demo | PuchUp",
        metaDescription:
          "เดโมร้านอาหารหน้าเดียว สไตล์ Project ONE โดย PuchUp",
      },
    };
  }

  if (key === "aeropulse") {
    const html = loadDemoHtml("aeropulse.html");
    return {
      _id: "local-aeropulse",
      title: "AeroPulse — Bike Studio Demo",
      subdomain: "aeropulse",
      brandDetails: {
        name: "AeroPulse Bike Studio",
        description:
          "ระบบช่วยลูกค้าเลือกจักรยาน แทนการไล่ดูสเปกทีละคัน",
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
        html,
        fullPage: true,
        minHeight: 900,
      },
      seo: {
        metaTitle: "AeroPulse Bike Studio | PuchUp Demo",
        metaDescription:
          "เดโมระบบช่วยเลือกจักรยาน — Smart Finder โดย PuchUp",
      },
    };
  }

  return null;
}

export const LOCAL_DEMO_SUBDOMAINS = ["restaurant", "aeropulse"] as const;
