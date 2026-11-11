/**
 * Seed pilot Sale accounts (max 5) + optional manager
 * Usage: node scripts/seed-sale-pilot.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { randomBytes, scryptSync } from "crypto";
import fs from "fs";

const PASSWORD = process.env.SALE_PILOT_PASSWORD || "Sale#2026";

/** IndusTech Parts / Your Company demo users */
const PILOT_SALES = [
  { username: "sale01", fullName: "สมชาย ภาคสนาม", nickname: "ชาย" },
  { username: "sale02", fullName: "วราภรณ์ เขตกลาง", nickname: "พร" },
  { username: "sale03", fullName: "กิตติพงศ์ อีสาน", nickname: "กิ๊ต" },
  { username: "sale04", fullName: "นภา เขตใต้", nickname: "นภา" },
  { username: "sale05", fullName: "ธีรพงษ์ ตะวันออก", nickname: "ธีร์" },
];

const MANAGERS = [
  { username: "manager01", fullName: "ผู้จัดการฝ่ายขาย IndusTech", nickname: "คุณแมน" },
  { username: "manager02", fullName: "หัวหน้าเขต IndusTech", nickname: "คุณเจี๊ยบ" },
];

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

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

async function upsertUser(user, role) {
  const row = {
    full_name: user.fullName,
    nickname: user.nickname,
    username: user.username.toLowerCase(),
    password_hash: hashPassword(PASSWORD),
    role,
    position: role === "manager" ? "ผู้บริหาร" : "เซลล์ภาคสนาม",
    status: "active",
    updated_at: new Date().toISOString(),
  };

  const { data: existing } = await db
    .from("profiles")
    .select("id")
    .ilike("username", user.username)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await db.from("profiles").update(row).eq("id", existing.id);
    if (error) throw new Error(error.message);
    console.log("UPDATED", user.username, role);
  } else {
    const { error } = await db.from("profiles").insert(row);
    if (error) throw new Error(error.message);
    console.log("CREATED", user.username, role);
  }
}

for (const m of MANAGERS) {
  await upsertUser(m, "manager");
}
for (const s of PILOT_SALES) {
  await upsertUser(s, "sales");
}
console.log("PASSWORD", PASSWORD);
