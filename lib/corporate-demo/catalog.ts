import { buildingNiches } from "./catalog-building";
import { industryNiches } from "./catalog-industry";
import { specialtyNiches } from "./catalog-specialties";

export const corporateNiches = [...buildingNiches, ...industryNiches, ...specialtyNiches];

export function findNiche(slug: string) {
  return corporateNiches.find(niche => niche.slug === slug);
}
