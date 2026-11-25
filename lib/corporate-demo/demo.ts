import { findNiche } from "./catalog";
import { demoHref } from "./collection";
import { buildingDetails } from "./details-building";
import { industryDetails } from "./details-industry";
import { pestControlDetails } from "./details-pest-control";
import { specialtyDetails } from "./details-specialties";
import type { CompanyDetails } from "./types";

export const companyDetails: Record<string, CompanyDetails> = {
  ...buildingDetails, ...industryDetails, ...specialtyDetails,
  "termite-and-pest-control": pestControlDetails,
};
export const companyMedia = "/images/demos/corporate/";

export function editorialImage(slug: string, article: string) {
  const asset = companyDetails[slug]?.asset;
  return asset ? `${companyMedia}editorial/${asset}-${article}.webp` : companyImage(slug, "work");
}

export function companyImage(slug: string, variant: "cover" | "work" = "cover") {
  const asset = companyDetails[slug]?.asset;
  if (asset) return `${companyMedia}${asset}-${variant}.webp`;
  if (slug === "crane-rental") return "/images/demos/crane-rental/mobile-crane.webp";
  return "/images/products/corporate/hero.jpg";
}

export function findCompany(slug: string) {
  const niche = findNiche(slug);
  const details = companyDetails[slug];
  if (!niche || !details) return;
  return { niche, details };
}

export const sectionKeys = ["services", "projects", "areas", "field-notes", "about", "process", "quote"] as const;
export type SectionKey = typeof sectionKeys[number];

export function demoPageHref(niche: string, ...path: string[]) {
  return demoHref(niche) + (path.length ? path.join("/") + "/" : "");
}

export function demoSections(company: CompanyDetails): Record<SectionKey, string> {
  return {
    services: "บริการ",
    projects: "กรณีศึกษา",
    areas: "พื้นที่ดูแลงาน",
    "field-notes": company.notebook,
    about: "รู้จักทีม",
    process: "ขั้นตอนทำงาน",
    quote: "ส่งบรีฟขอราคา",
  };
}

export function demoEntries(slug: string) {
  const company = findCompany(slug);
  if (!company) return;
  const { niche, details } = company;
  return {
    services: [...niche.services, ...details.services].map((title, index) => ({ slug: `service-${index + 1}`, title, example: details.projects[index] })),
    projects: details.projects.map(([title, location, story], index) => ({ slug: `project-${index + 1}`, title, location, story })),
    areas: details.areas.map((title, index) => ({ slug: `area-${index + 1}`, title })),
    "field-notes": details.articles.map(([title, body], index) => ({ slug: `note-${index + 1}`, title, body })),
  };
}

export const detailKeys = ["services", "projects", "areas", "field-notes"] as const;
export type DetailKey = typeof detailKeys[number];
