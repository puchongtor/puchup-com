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
      title: "บ้านข้าวหอม — Restaurant Demo",
      subdomain: "restaurant",
      brandDetails: {
        name: "บ้านข้าวหอม",
        description:
          "อาหารบ้านๆ ที่ทำให้คิดถึงบ้าน — เดโมร้านอาหารไทยโฮมเมดแนว Project ONE",
        theme: {
          primary: "#1C1712",
          accent: "#D8A13B",
          background: "#FAF5E9",
          text: "#241C14",
        },
        menuLinks: [
          { label: "Project ONE", href: "/ProjectONE/" },
          { label: "Demo Hub", href: "/ProjectONE/Demo/" },
        ],
      },
      codeEmbed: {
        title: "บ้านข้าวหอม One-Pager",
        html,
        fullPage: true,
        minHeight: 900,
      },
      imagePrompts: [
        {
          slotName: "hero",
          promptText:
            "Subject: overhead flat-lay of a steaming bowl of Thai tom yum goong on a dark reclaimed-teak table. Lighting: warm low-key restaurant lighting. Aspect ratio: 16:9. Style: commercial editorial food photography.",
          aspectRatio: "16:9",
        },
        {
          slotName: "signature-dish",
          promptText:
            "Subject: close-up 45-degree angle of tom yum goong with visible river prawns and floating chili. Aspect ratio: 4:3. Style: commercial menu photography.",
          aspectRatio: "4:3",
        },
      ],
      seo: {
        metaTitle: "บ้านข้าวหอม — Restaurant Demo | PuchUp",
        metaDescription:
          "เดโมร้านอาหารไทยโฮมเมดหน้าเดียว สไตล์ Project ONE โดย PuchUp",
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
