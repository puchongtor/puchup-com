import { BRAND_CATALOG } from "@/lib/brand-catalog";
import { MAIN_PRODUCTS } from "@/lib/main-products";
import { SALE_BRAND } from "./brand";

export type GlossaryTerm = {
  canonical: string;
  category: string;
  aliases: string[];
  source: "website" | "import" | "manual" | "ai_suggested";
  status: "approved" | "pending" | "rejected";
  /** สำหรับค้นหา/จัดอันดับ */
  keywords: string[];
};

const EXTRA_ALIASES: Record<string, string[]> = {
  Marspak: ["มาร์สแพค", "mars pak", "เครื่องติดฉลาก"],
  "เครื่องพ่นน้ำแข็งแห้ง": [
    "dry ice",
    "dry ice blasting",
    "dryice",
    "ไดไอซ์",
    "ไดร์ไอซ์",
    "เครื่องพ่นไดไอซ์",
    "เครื่องพ่นไดร์ไอซ์",
    "ไอซ์ร็อกเก็ต",
    "น้ำแข็งแห้ง",
    "พ่นน้ำแข็งแห้ง",
  ],
  "ฟิล์มหด": ["shrink film", "พีวีซีหด", "พีอีหด", "PVC shrink", "PE shrink"],
  AIRTAC: ["แอร์แทค", "airtac"],
  Hinaka: ["ฮินากะ", "hinaka", "กระบอกนิว"],
  "Ice Rocket": ["icerocket", "ไอซ์ ร็อกเก็ต", "cold jet"],
  "IceTech Elite 20": ["elite 20", "elite20", "ไอซ์เทค"],
  "i3 MicroClean 2": ["microclean", "i3", "cold jet i3"],
};

function uniq(items: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of items) {
    const v = raw.trim();
    if (!v) continue;
    const key = v.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  return out;
}

function term(
  canonical: string,
  category: string,
  aliases: string[] = [],
): GlossaryTerm {
  const extras = EXTRA_ALIASES[canonical] || [];
  const allAliases = uniq([...aliases, ...extras]);
  return {
    canonical,
    category,
    aliases: allAliases,
    source: "website",
    status: "approved",
    keywords: uniq([
      canonical,
      ...allAliases,
      category,
      canonical.toLowerCase(),
    ]),
  };
}

/** สร้าง glossary จากแคตตาล็อก IndusTech demo (ไม่พึ่ง DB) */
export function buildWebsiteGlossary(): GlossaryTerm[] {
  const terms: GlossaryTerm[] = [];

  terms.push(
    term(SALE_BRAND.name, "องค์กร", [
      SALE_BRAND.legalName,
      "แอดวานซ์โปร",
      "advance pro",
    ]),
  );

  for (const product of MAIN_PRODUCTS) {
    terms.push(term(product.name, "สินค้าหลัก", [product.slug, product.summary.slice(0, 40)]));
  }

  for (const brand of BRAND_CATALOG) {
    terms.push(
      term(brand.name, brand.categoryTh || brand.category || "แบรนด์", [
        brand.slug,
        brand.focusKeyword,
        ...(brand.bullets || []).slice(0, 2),
      ]),
    );
  }

  // รวม canonical ซ้ำ — เก็บอันแรก แล้วรวม alias
  const byKey = new Map<string, GlossaryTerm>();
  for (const t of terms) {
    const key = t.canonical.toLowerCase();
    const prev = byKey.get(key);
    if (!prev) {
      byKey.set(key, t);
      continue;
    }
    prev.aliases = uniq([...prev.aliases, ...t.aliases]);
    prev.keywords = uniq([...prev.keywords, ...t.keywords]);
  }

  return [...byKey.values()].sort((a, b) =>
    a.canonical.localeCompare(b.canonical, "th"),
  );
}

let cached: GlossaryTerm[] | null = null;

export function getApprovedGlossary(): GlossaryTerm[] {
  if (!cached) cached = buildWebsiteGlossary();
  return cached;
}

function scoreTerm(termItem: GlossaryTerm, hay: string): number {
  if (!hay) return 0;
  let score = 0;
  for (const kw of termItem.keywords) {
    const k = kw.toLowerCase();
    if (k.length < 2) continue;
    if (hay.includes(k)) score += k.length >= 4 ? 5 : 2;
  }
  // สินค้าหลัก / featured โบนัสเล็กน้อยตอนไม่มี query
  if (termItem.category === "สินค้าหลัก" || termItem.category === "องค์กร") {
    score += 1;
  }
  return score;
}

/** เลือกคำที่เกี่ยวกับข้อความเซลล์ + คำหลักบริษัท */
export function selectGlossaryForContext(opts?: {
  query?: string;
  limit?: number;
}): GlossaryTerm[] {
  const all = getApprovedGlossary();
  const limit = opts?.limit ?? 80;
  const hay = (opts?.query || "").toLowerCase();

  if (!hay.trim()) {
    const main = all.filter(
      (t) =>
        t.category === "สินค้าหลัก" ||
        t.category === "องค์กร" ||
        MAIN_PRODUCTS.some((p) => p.name === t.category),
    );
    // กระจายแบรนด์ตามหมวด (ไม่มี query) อย่างละไม่เกิน 4 ชื่อ
    const perCat = new Map<string, number>();
    const sample: GlossaryTerm[] = [];
    for (const t of all) {
      if (t.category === "สินค้าหลัก" || t.category === "องค์กร") continue;
      const n = perCat.get(t.category) || 0;
      if (n >= 4) continue;
      perCat.set(t.category, n + 1);
      sample.push(t);
    }
    return uniqByCanonical([...main, ...sample]).slice(0, limit);
  }

  const ranked = all
    .map((t) => ({ t, s: scoreTerm(t, hay) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.t.canonical.localeCompare(b.t.canonical, "th"))
    .map((x) => x.t);

  const mainAlways = all.filter(
    (t) => t.category === "สินค้าหลัก" || t.category === "องค์กร",
  );

  return uniqByCanonical([...mainAlways, ...ranked]).slice(0, limit);
}

function uniqByCanonical(items: GlossaryTerm[]) {
  const seen = new Set<string>();
  const out: GlossaryTerm[] = [];
  for (const t of items) {
    const k = t.canonical.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(t);
  }
  return out;
}

/** ข้อความสั้นๆ ใส่ใน prompt Claude */
export function formatGlossaryForPrompt(opts?: {
  query?: string;
  limit?: number;
}): string {
  const terms = selectGlossaryForContext(opts);
  const byCat = new Map<string, GlossaryTerm[]>();
  for (const t of terms) {
    const list = byCat.get(t.category) || [];
    list.push(t);
    byCat.set(t.category, list);
  }

  const lines: string[] = [
    `Meridian Parts product glossary. Use only for preferred spelling when a term matches. If the salesperson mentions a product/need not listed here, still record it as an opportunity for handoff — never refuse or say the company does not sell it.`,
  ];

  for (const [cat, list] of byCat) {
    const bits = list.map((t) => {
      const alias =
        t.aliases.length > 0 ? ` (alias: ${t.aliases.slice(0, 3).join(", ")})` : "";
      return `${t.canonical}${alias}`;
    });
    lines.push(`- ${cat}: ${bits.join("; ")}`);
  }

  const text = lines.join("\n");
  // กัน prompt ยาวเกิน
  return text.length > 6000 ? `${text.slice(0, 6000)}\n…` : text;
}

export function glossaryStats() {
  const all = getApprovedGlossary();
  const categories = new Set(all.map((t) => t.category));
  return {
    total: all.length,
    categories: categories.size,
    sources: { website: all.filter((t) => t.source === "website").length },
  };
}
