import { getApprovedGlossary } from "./glossary";

export type SearchHit = {
  score: number;
  reasons: string[];
  /** direct = ตรงคำค้นจริง · related = ใกล้เคียง/ฟัซซี่ อ่อนกว่า */
  tier: "direct" | "related";
};

/** ตัดช่องว่างพิเศษ · ตัวพิมพ์เล็ก · รวมอักษรที่พิมพ์คล้ายกันเล็กน้อย */
export function normalizeSearchText(raw: string) {
  return raw
    .toLowerCase()
    .replace(/[่้๊๋์ฺ]/g, "") // วรรณยุกต์ไทย — ช่วยนนท์/นนต์ นิดหน่อยตอนเทียบ
    .replace(/\s+/g, " ")
    .trim();
}

function uniq(items: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of items) {
    const v = raw.trim();
    if (!v) continue;
    const key = normalizeSearchText(v);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(v.trim());
  }
  return out;
}

function levenshtein(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp = new Array(cols).fill(0).map((_, j) => j);
  for (let i = 1; i < rows; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j < cols; j++) {
      const tmp = dp[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost);
      prev = tmp;
    }
  }
  return dp[cols - 1];
}

function maxEditDistance(len: number) {
  if (len < 2) return 0;
  if (len < 6) return 1;
  if (len <= 12) return 2;
  return 0; // ไม่ fuzzy คำยาว
}

/** alias ที่ใช้ขยายค้นหา — ตัดหมวด/ประโยคยาว/คำสั้นเกินไป (กัน pe/pvc/สินค้าหลัก ลามทั้งแคตตาล็อก) */
function searchableAliases(canonical: string, aliases: string[]) {
  return uniq([canonical, ...aliases]).filter((raw) => {
    const n = normalizeSearchText(raw);
    if (n.length < 3) return false;
    if (raw.length > 36) return false; // ไม่เอา summary/bullet ตัดท่อน
    // หมวดกว้าง — ไม่ใช้เป็น seed/expansion
    if (
      n === "สินค้าหลัก" ||
      n === "องค์กร" ||
      n === "แบรนด" ||
      n.includes("ไฟฟ้าและออโตเมชัน")
    ) {
      return false;
    }
    return true;
  });
}

function seedHitsAlias(
  qNorm: string,
  seeds: string[],
  aliasNorm: string,
): boolean {
  if (!aliasNorm || aliasNorm.length < 3) return false;
  if (qNorm.includes(aliasNorm) || aliasNorm.includes(qNorm)) return true;
  return seeds.some((t) => {
    const tn = normalizeSearchText(t);
    if (tn.length < 3) return false;
    return tn === aliasNorm || (tn.length >= 4 && aliasNorm.includes(tn));
  });
}

/**
 * ขยายคำค้นด้วย glossary
 * — จับเฉพาะ canonical/alias ที่ชนคำค้นต้นทาง (ไม่ chain จากคำที่เพิ่งขยาย)
 * — ไม่ดึง category/keywords กว้าง เข้ามาในตระกูลค้นหา
 */
export function expandQueryTerms(query: string): {
  terms: string[];
  expansions: { from: string; to: string; canonical: string }[];
} {
  const q = query.trim();
  if (!q) return { terms: [], expansions: [] };

  const qNorm = normalizeSearchText(q);
  const seeds = uniq([q, ...q.split(/\s+/).filter((t) => t.length >= 2)]);
  const terms = [...seeds];
  const expansions: { from: string; to: string; canonical: string }[] = [];

  for (const g of getApprovedGlossary()) {
    const family = searchableAliases(g.canonical, g.aliases);
    const familyNorm = family.map((f) => ({
      raw: f,
      norm: normalizeSearchText(f),
    }));

    let hitFrom: string | null = null;
    for (const f of familyNorm) {
      // เทียบแค่ seeds ต้นทาง — ไม่เทียบคำที่ขยายแล้ว (กัน สินค้าหลัก → ทั้งร้าน)
      if (seedHitsAlias(qNorm, seeds, f.norm)) {
        hitFrom = f.raw;
        break;
      }
    }
    if (!hitFrom) continue;

    for (const f of family) {
      if (normalizeSearchText(f) === normalizeSearchText(hitFrom)) continue;
      terms.push(f);
      expansions.push({ from: hitFrom, to: f, canonical: g.canonical });
    }
  }

  return { terms: uniq(terms), expansions };
}

function tokenizeHay(hay: string) {
  return hay
    .split(/[\s,./\\|()[\]{}«»"'`~!@#$%^&*+=:;?]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && t.length <= 12);
}

/**
 * ให้คะแนน haystack กับคำค้นที่ขยายแล้ว
 * exact/alias สูง · fuzzy เฉพาะโทเคนสั้น
 */
export function scoreSearchMatch(
  query: string,
  haystack: string,
  fieldHints?: {
    company?: string;
    contact?: string;
    phone?: string;
    product?: string;
  },
): SearchHit {
  const q = query.trim();
  if (!q) return { score: 0, reasons: [], tier: "related" };

  const qNorm = normalizeSearchText(q);
  const seeds = uniq([q, ...q.split(/\s+/).filter((t) => t.length >= 2)]);
  const seedNorms = new Set(seeds.map((t) => normalizeSearchText(t)).filter((t) => t.length >= 2));

  const { terms, expansions } = expandQueryTerms(q);
  const hay = normalizeSearchText(haystack);
  if (!hay) return { score: 0, reasons: [], tier: "related" };

  let score = 0;
  let directHits = 0;
  const reasons: string[] = [];
  const matchedTerms = new Set<string>();

  for (const term of terms) {
    const tNorm = normalizeSearchText(term);
    if (tNorm.length < 3) continue;
    if (!hay.includes(tNorm)) continue;
    const weight = tNorm.length >= 6 ? 12 : tNorm.length >= 4 ? 8 : 5;
    score += weight;
    matchedTerms.add(tNorm);
    if (seedNorms.has(tNorm) || qNorm.includes(tNorm) || tNorm.includes(qNorm)) {
      directHits += 1;
    }
  }

  // เหตุผลจาก glossary — เฉพาะเมื่อ hay เจอ alias ที่ขยายจากคำใน query จริง
  for (const ex of expansions) {
    const toN = normalizeSearchText(ex.to);
    const fromN = normalizeSearchText(ex.from);
    if (!hay.includes(toN)) continue;
    const fromInQuery =
      qNorm.includes(fromN) ||
      fromN.includes(qNorm) ||
      [...seedNorms].some((s) => s.includes(fromN) || fromN.includes(s));
    if (!fromInQuery) continue;
    reasons.push(`สินค้า (คำใกล้: ${ex.from} → ${ex.canonical})`);
    score += 4;
    directHits += 1;
    break;
  }

  // field hints สำหรับป้ายเหตุผล — นับ direct เฉพาะเมื่อ seed ต้นทางชนฟิลด์
  const company = normalizeSearchText(fieldHints?.company || "");
  const contact = normalizeSearchText(fieldHints?.contact || "");
  const phone = normalizeSearchText(fieldHints?.phone || "");
  const product = normalizeSearchText(fieldHints?.product || "");

  for (const seed of seedNorms) {
    if (seed.length < 2) continue;
    if (company && company.includes(seed)) {
      reasons.push("บริษัท");
      directHits += 1;
    }
    if (contact && contact.includes(seed)) {
      reasons.push("ชื่อผู้ติดต่อ");
      directHits += 1;
    }
    if (phone && phone.replace(/\D/g, "").includes(seed.replace(/\D/g, ""))) {
      reasons.push("เบอร์");
      directHits += 1;
    }
    if (product && product.includes(seed)) {
      reasons.push("สินค้า");
      directHits += 1;
    }
  }

  // Fuzzy เฉพาะโทเคนสั้นใน query (ชื่อ / รหัส) — ถือเป็น related
  let fuzzyHits = 0;
  const shortQueryTokens = q
    .split(/\s+/)
    .map((t) => normalizeSearchText(t))
    .filter((t) => t.length >= 2 && t.length <= 12);

  if (shortQueryTokens.length > 0) {
    const nameCandidates = [contact, contact.replace(/^คุณ/, "")]
      .map((s) => normalizeSearchText(s))
      .filter((s) => s.length >= 2 && s.length <= 12);
    const companyCandidates = [company].filter(
      (s) => s.length >= 2 && s.length <= 12,
    );
    const hayTokens = [
      ...tokenizeHay(hay),
      ...nameCandidates,
      ...companyCandidates,
    ];

    for (const qt of shortQueryTokens) {
      if (hay.includes(qt) || nameCandidates.some((n) => n.includes(qt))) continue;
      const maxDist = maxEditDistance(qt.length);
      if (maxDist <= 0) continue;
      let best: { token: string; dist: number } | null = null;
      for (const ht of hayTokens) {
        if (Math.abs(ht.length - qt.length) > maxDist) continue;
        const d = levenshtein(qt, ht);
        if (d > 0 && d <= maxDist && (!best || d < best.dist)) {
          best = { token: ht, dist: d };
        }
      }
      if (!best && contact.length >= qt.length) {
        const tail = contact.slice(-Math.min(contact.length, qt.length + 1));
        const d = levenshtein(qt, tail);
        if (d > 0 && d <= maxDist) best = { token: tail, dist: d };
      }
      if (best) {
        score += best.dist === 1 ? 6 : 3;
        fuzzyHits += 1;
        if (contact && (contact.includes(best.token) || best.token.length <= 12)) {
          reasons.push(`ใกล้เคียงชื่อ (${qt}≈${best.token})`);
        } else if (company && company.includes(best.token)) {
          reasons.push(`ใกล้เคียงบริษัท (${qt}≈${best.token})`);
        } else {
          reasons.push(`ใกล้เคียงคำ (${qt}≈${best.token})`);
        }
      }
    }
  }

  // expansion ที่ชน hay แต่ไม่ผ่าน seed แล้ว → ไม่ให้คะแนนจาก terms ที่เป็นแค่ญาติห่างๆ
  // (terms จาก glossary ที่ matched แล้วยังช่วยคะแนนได้ถ้า hay มีคำนั้น และถูกนับใน loop บน)

  if (score <= 0) return { score: 0, reasons: [], tier: "related" };

  // direct = ชนคำค้น/alias จริง · related = ฟัซซี่อย่างเดียวหรือคะแนนอ่อน
  const tier: "direct" | "related" =
    directHits > 0 && score >= 8 ? "direct" : "related";

  // ถ้ามีแค่ fuzzy อ่อนมาก ตัดทิ้ง
  if (tier === "related" && directHits === 0 && fuzzyHits === 0) {
    return { score: 0, reasons: [], tier: "related" };
  }
  if (tier === "related" && score < 6) {
    return { score: 0, reasons: [], tier: "related" };
  }

  return {
    score,
    reasons: [...new Set(reasons)].slice(0, 4),
    tier,
  };
}

/** สร้างข้อความค้นหาจากรายงาน */
export function buildReportHaystack(parts: {
  companyName?: string | null;
  contact?: string | null;
  phone?: string | null;
  product?: string | null;
  purpose?: string | null;
  extras?: string[];
}) {
  return [
    parts.companyName,
    parts.contact,
    parts.phone,
    parts.product,
    parts.purpose,
    ...(parts.extras || []),
  ]
    .filter(Boolean)
    .join(" ");
}
