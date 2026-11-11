export type DayPlanStop = {
  company: string;
  time: string | null;
  withWhom: string | null;
  meetWho: string | null;
  purpose: string | null;
};

export type SaleDayPlan = {
  id?: string;
  salesId: string;
  salesName?: string;
  dayKey: string;
  stops: DayPlanStop[];
  note: string | null;
  source: "coach" | "manual";
  updatedAt?: string;
};

export function bangkokDayKey(now = new Date()) {
  return now.toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
}

export function normalizeDayPlanStop(raw: unknown): DayPlanStop | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const company = String(o.company || o.companyName || "").trim();
  if (!company) return null;
  const blank = (v: unknown) => {
    const s = String(v ?? "").trim();
    return s || null;
  };
  return {
    company: company.slice(0, 120),
    time: blank(o.time)?.slice(0, 40) || null,
    withWhom: blank(o.withWhom ?? o.with)?.slice(0, 80) || null,
    meetWho: blank(o.meetWho ?? o.contact)?.slice(0, 80) || null,
    purpose: blank(o.purpose ?? o.goal)?.slice(0, 200) || null,
  };
}

export function normalizeDayPlanStops(raw: unknown): DayPlanStop[] {
  if (!Array.isArray(raw)) return [];
  const out: DayPlanStop[] = [];
  for (const item of raw.slice(0, 12)) {
    const stop = normalizeDayPlanStop(item);
    if (stop) out.push(stop);
  }
  return out;
}

function stopKey(company: string) {
  return company.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * รวมแผนรอบก่อนกับรอบใหม่ — แชทต่อเนื่องมักส่งแค่จุดใหม่
 * ถ้า upsert ทับทั้งก้อนจะเหลือจุดเดียว (ข้อมูลไม่ครบที่เลขาผู้จัดการ)
 */
export function mergeDayPlanStops(
  existing: DayPlanStop[],
  incoming: DayPlanStop[],
): DayPlanStop[] {
  if (!incoming.length) return existing.slice(0, 12);
  if (!existing.length) return incoming.slice(0, 12);

  const out = existing.map((s) => ({ ...s }));
  const indexByKey = new Map<string, number>();
  out.forEach((s, i) => indexByKey.set(stopKey(s.company), i));

  for (const stop of incoming) {
    const key = stopKey(stop.company);
    const idx = indexByKey.get(key);
    if (idx == null) {
      if (out.length >= 12) break;
      indexByKey.set(key, out.length);
      out.push({ ...stop });
      continue;
    }
    const prev = out[idx];
    out[idx] = {
      company: stop.company || prev.company,
      time: stop.time ?? prev.time,
      withWhom: stop.withWhom ?? prev.withWhom,
      meetWho: stop.meetWho ?? prev.meetWho,
      purpose: stop.purpose ?? prev.purpose,
    };
  }
  return out;
}

export function formatDayPlanStopsShort(stops: DayPlanStop[]) {
  if (!stops.length) return "ยังไม่มีจุด";
  return stops
    .map((s, i) => {
      const bits = [`${i + 1}) ${s.company}`];
      if (s.time) bits.push(s.time);
      if (s.purpose) bits.push(s.purpose);
      if (s.meetWho) bits.push(`เจอ ${s.meetWho}`);
      if (s.withWhom) bits.push(`ไปกับ ${s.withWhom}`);
      return bits.join(" · ");
    })
    .join(" | ");
}

export function formatDayPlanLine(plan: SaleDayPlan) {
  const name = plan.salesName || "Sale";
  if (!plan.stops.length) return `${name} ยังไม่มีกำหนดการวันนี้`;
  if (plan.stops.length === 1) {
    const s = plan.stops[0];
    const bits = [s.company];
    if (s.time) bits.push(s.time);
    if (s.purpose) bits.push(s.purpose);
    return `${name} วางแผนไป ${bits.join(" · ")}`;
  }
  return `${name} วางแผน ${plan.stops.length} จุด: ${formatDayPlanStopsShort(plan.stops)}`;
}
