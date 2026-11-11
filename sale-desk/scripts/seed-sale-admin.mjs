/**
 * Seed first Sale Admin: admin01
 * Usage: node scripts/seed-sale-admin.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { randomBytes, scryptSync } from "crypto";
import fs from "fs";

const USERNAME = process.env.SALE_ADMIN_USER || "admin01";
const PASSWORD = process.env.SALE_ADMIN_PASSWORD || "MasterPuch79";
const FULL_NAME = process.env.SALE_ADMIN_NAME || "Admin Your Company";

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

const { data: existing } = await db
  .from("profiles")
  .select("id,username,role")
  .ilike("username", USERNAME)
  .maybeSingle();

const row = {
  full_name: FULL_NAME,
  nickname: "Admin",
  username: USERNAME.toLowerCase(),
  password_hash: hashPassword(PASSWORD),
  role: "admin",
  position: "Admin ระบบ",
  status: "active",
  updated_at: new Date().toISOString(),
};

if (existing?.id) {
  const { error } = await db.from("profiles").update(row).eq("id", existing.id);
  if (error) {
    console.error("FAIL_UPDATE", error.message);
    process.exit(1);
  }
  console.log("UPDATED", USERNAME, existing.id);
} else {
  const { data, error } = await db.from("profiles").insert(row).select("id").single();
  if (error) {
    console.error("FAIL_INSERT", error.message);
    process.exit(1);
  }
  console.log("CREATED", USERNAME, data.id);
}
