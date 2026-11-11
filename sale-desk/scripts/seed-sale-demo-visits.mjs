/**
 * Demo visits: 5 sales × 5 days × 2 companies/day
 * Usage: node scripts/seed-sale-demo-visits.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import fs from "fs";

const COMPANIES = [
  "บจก. ไทยอุตสาหกรรมพลาสติก",
  "หจก. นครชัยเครื่องจักร",
  "บจก. สยามบรรจุภัณฑ์",
  "บจก. อีสานฟู้ดโปรเซส",
  "หจก. บางนาไฮดรอลิก",
  "บจก. ชลบุรีสายพานอุตสาหกรรม",
  "บจก. ระยองพาร์ทเซอร์วิส",
  "หจก. สมุทรปราการมอเตอร์",
  "บจก. อยุธยาฟู้ดแมชชีน",
  "บจก. ปทุมธานีคอนเวเยอร์",
];

const PURPOSES = [
  "เสนออะไหล่สายพาน",
  "ติดตามใบเสนอราคามอเตอร์",
  "ตรวจเนมเพลทเครื่อง",
  "คุยงบประมาณอะไหล่",
  "ส่งเอกสารสเปก",
  "เยี่ยมตามนัดซ่อมบำรุง",
  "แนะนำปั๊มไฮดรอลิก",
  "เก็บฟีดแบ็คส่งของช้า",
];

const env = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const { data: sales, error: sErr } = await db
  .from("profiles")
  .select("id,username,full_name,nickname")
  .eq("role", "sales")
  .neq("status", "closed")
  .order("username", { ascending: true })
  .limit(5);

if (sErr) throw new Error(sErr.message);
if (!sales?.length) throw new Error("no sales profiles — run seed-sale-pilot.mjs first");

// Clear previous demo visits (tagged in summary data)
const { data: oldSums } = await db
  .from("visit_summaries")
  .select("visit_id,data")
  .eq("version", 1);

const demoVisitIds = (oldSums || [])
  .filter((s) => s.data?.demo === true)
  .map((s) => s.visit_id);

if (demoVisitIds.length) {
  await db.from("visit_summaries").delete().in("visit_id", demoVisitIds);
  await db.from("visits").delete().in("id", demoVisitIds);
  console.log("CLEARED_DEMO", demoVisitIds.length);
}

function bangkokDayOffset(daysAgo) {
  const now = new Date();
  // noon Bangkok ≈ UTC+7
  const d = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysAgo, 5, 0, 0),
  );
  return d;
}

const visits = [];
const summaries = [];
let companyCursor = 0;

for (let day = 0; day < 5; day++) {
  const dayStart = bangkokDayOffset(4 - day); // oldest → newest across 5 days
  for (let si = 0; si < sales.length; si++) {
    const sale = sales[si];
    for (let v = 0; v < 2; v++) {
      const company = COMPANIES[companyCursor % COMPANIES.length];
      companyCursor += 1;
      const hour = 9 + v * 3 + (si % 2);
      const started = new Date(dayStart);
      started.setUTCHours(hour - 7, 15 + si * 3, 0, 0); // rough local morning/afternoon
      const confirmed = new Date(started.getTime() + 45 * 60 * 1000);
      const purpose = PURPOSES[(si + day + v) % PURPOSES.length];
      const id = randomUUID();
      const urgent = day === 4 && v === 0 && si === 0;

      visits.push({
        id,
        sales_id: sale.id,
        company_name_text: company,
        status: "confirmed",
        started_at: started.toISOString(),
        ended_at: confirmed.toISOString(),
        confirmed_at: confirmed.toISOString(),
        distance_km: 12 + ((si * 7 + day * 3 + v * 5) % 40),
        created_at: started.toISOString(),
      });

      summaries.push({
        visit_id: id,
        version: 1,
        status: "confirmed",
        data: {
          demo: true,
          company: {
            name: { value: company, confidence: 0.95, sources: [] },
            address: { value: null, confidence: 0, sources: [] },
            matched_company_id: null,
          },
          contacts: [
            {
              name: { value: `คุณประสาน ${company.slice(0, 8)}`, confidence: 0.8, sources: [] },
              position: { value: "จัดซื้อ", confidence: 0.7, sources: [] },
              phone: { value: `08${String(10000000 + si * 111 + day).slice(0, 8)}`, confidence: 0.7, sources: [] },
              line_id: { value: null, confidence: 0, sources: [] },
              email: { value: null, confidence: 0, sources: [] },
            },
          ],
          purpose: { value: purpose, confidence: 0.9, sources: [] },
          discussion: [
            {
              topic: purpose,
              detail: `${sale.nickname || sale.full_name} เข้าพบ${company} เรื่อง${purpose} ลูกค้าขอใบเสนอราคาและสเปกอะไหล่`,
              sources: [],
            },
          ],
          items: [
            {
              kind: "quote_request",
              description: purpose,
              brand: { value: "ไม่ระบุ", confidence: 0.4, sources: [] },
              model: { value: null, confidence: 0, sources: [] },
              part_number: { value: null, confidence: 0, sources: [] },
              qty: { value: 1, confidence: 0.5, sources: [] },
              urgency: urgent ? "urgent" : "normal",
              photo_event_ids: [],
            },
          ],
          decision: {
            decision_maker: { value: "หัวหน้าจัดซื้อ", confidence: 0.6, sources: [] },
            budget: { value: null, confidence: 0, sources: [] },
            timeline: { value: "ภายในสัปดาห์นี้", confidence: 0.7, sources: [] },
            competitor_mentioned: { value: null, confidence: 0, sources: [] },
          },
          sentiment: { level: urgent ? "concerned" : "neutral", complaints: [] },
          next_steps: [
            {
              title: "ส่งใบเสนอราคา",
              due_date: null,
              assignee: "sales",
              sources: [],
            },
          ],
          attachments: [],
          unresolved: [],
          distance_km: 12 + ((si * 7 + day * 3 + v * 5) % 40),
        },
        field_sources: {},
        field_confidence: {},
        created_by: sale.id,
        created_at: confirmed.toISOString(),
      });
    }
  }
}

const { error: vErr } = await db.from("visits").insert(visits);
if (vErr) throw new Error(vErr.message);
const { error: sSumErr } = await db.from("visit_summaries").insert(summaries);
if (sSumErr) throw new Error(sSumErr.message);

console.log("SALES", sales.map((s) => s.username).join(", "));
console.log("VISITS", visits.length);
console.log("DAYS", 5, "PER_DAY_PER_SALE", 2);
