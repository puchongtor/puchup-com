/** Client-safe Project ONE slug map (no Node fs). */

/** Store demo basename (no .html) → HTML filename in content/project-one/themes */
export const DEMO_THEME_FILES: Record<string, string> = {
  restaurant: "restaurant.html",
  cafe: "cafe.html",
  bakery: "bakery.html",
  customcake: "customcake.html",
  pizzeria: "pizzeria.html",
  dental: "dental.html",
  aesthetic: "aesthetic.html",
  "rebalance-physio": "rebalance-physio.html",
  optometry: "optometry.html",
  tcmclinic: "tcmclinic.html",
  hotel: "hotel.html",
  massagespa: "massagespa.html",
  petstore: "petstore.html",
  petcare: "petcare.html",
  airservice: "airservice.html",
  curtain: "curtain.html",
  autogarage: "autogarage.html",
  carwash: "carwash.html",
  windowtint: "windowtint.html",
  bicycle: "bicycle.html",
  accounting: "accounting.html",
  artstudio: "artstudio.html",
  florist: "florist.html",
  stone: "stone.html",
  printing: "printing.html",
  phonerepair: "phonerepair.html",
  laundry: "laundry.html",
  pilates: "pilates.html",
  muaythaigym: "muaythaigym.html",
};

/** Friendly / legacy aliases → canonical demo slug */
export const DEMO_SLUG_ALIASES: Record<string, string> = {
  baankhaokhom: "restaurant",
  "baan-khaokhom": "restaurant",
  baanfundee: "dental",
  "baan-fundee": "dental",
  "dental-clinic": "dental",
  "baan-bangkok": "hotel",
  "boutique-hotel": "hotel",
  "paw-and-co": "petstore",
  "pet-shop": "petstore",
  "petal-stem-florist": "florist",
  "flower-shop": "florist",
  "flour-bloom-bakery": "bakery",
  "sunday-yard-coffee": "cafe",
  "velo-union": "bicycle",
  "clearpath-accounting": "accounting",
  "stonebound-crystals": "stone",
  "lumina-aesthetic": "aesthetic",
  "balance-physio": "rebalance-physio",
  "still-water-spa": "massagespa",
  "frame-sight-optics": "optometry",
};

export const PROJECT_ONE_PAGES = {
  landing: "landing.html",
  demo: "demo.html",
  google: "google-business.html",
} as const;

export type ProjectOnePageKey = keyof typeof PROJECT_ONE_PAGES;

export function canonicalDemoSlug(slug: string): string {
  const key = slug.trim().toLowerCase();
  return DEMO_SLUG_ALIASES[key] || key;
}

export function allDemoSlugs(): string[] {
  return Object.keys(DEMO_THEME_FILES);
}

export function hasDemoTheme(slug: string): boolean {
  return Boolean(DEMO_THEME_FILES[canonicalDemoSlug(slug)]);
}
