import type { SupabaseClient } from "@supabase/supabase-js";

export function normalizeCompanyName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/บริษัท\s*/g, "")
    .trim();
}

export type UpsertContactInput = {
  companyName: string;
  contactName?: string | null;
  phone?: string | null;
  position?: string | null;
  visitId?: string | null;
};

/**
 * บันทึกบริษัท + ผู้ติดต่อตอนยืนยันสรุป
 * - บริษัทซ้ำ: ใช้แถวเดิม
 * - ผู้ติดต่อซ้ำชื่อ: เติมเบอร์เฉพาะเมื่อยังว่าง
 */
export async function upsertCompanyAndContact(
  db: SupabaseClient,
  input: UpsertContactInput,
): Promise<{ companyId: string | null; contactId: string | null; error?: string }> {
  const companyName = (input.companyName || "").trim();
  if (!companyName || companyName === "ยังไม่ระบุบริษัท" || companyName === "ลูกค้า") {
    return { companyId: null, contactId: null };
  }

  const nameNorm = normalizeCompanyName(companyName);
  if (!nameNorm) return { companyId: null, contactId: null };

  const { data: companyRow, error: cErr } = await db
    .from("companies")
    .upsert(
      { name: companyName.slice(0, 200), name_norm: nameNorm },
      { onConflict: "name_norm" },
    )
    .select("id")
    .single();

  if (cErr || !companyRow?.id) {
    return { companyId: null, contactId: null, error: cErr?.message || "company_upsert_failed" };
  }

  const companyId = companyRow.id as string;

  if (input.visitId) {
    await db.from("visits").update({ company_id: companyId }).eq("id", input.visitId);
  }

  const contactName = (input.contactName || "").trim();
  if (!contactName) return { companyId, contactId: null };

  const phone = (input.phone || "").trim() || null;
  const position = (input.position || "").trim() || null;

  const { data: existingList } = await db
    .from("contacts")
    .select("id,phone,position,name")
    .eq("company_id", companyId)
    .limit(40);

  const existing = (existingList || []).find(
    (c) => c.name.trim().toLowerCase() === contactName.toLowerCase(),
  );

  if (existing?.id) {
    const patch: Record<string, string | null> = {};
    if (phone && !existing.phone) patch.phone = phone.slice(0, 40);
    if (position && !existing.position) patch.position = position.slice(0, 80);
    if (Object.keys(patch).length > 0) {
      await db.from("contacts").update(patch).eq("id", existing.id);
    }
    return { companyId, contactId: existing.id };
  }

  const { data: created, error: nErr } = await db
    .from("contacts")
    .insert({
      company_id: companyId,
      name: contactName.slice(0, 120),
      phone: phone?.slice(0, 40) || null,
      position: position?.slice(0, 80) || null,
    })
    .select("id")
    .single();

  if (nErr) return { companyId, contactId: null, error: nErr.message };
  return { companyId, contactId: (created?.id as string) || null };
}

export type ContactDirectoryRow = {
  id: string;
  name: string;
  phone: string | null;
  position: string | null;
  companyId: string;
  companyName: string;
  createdAt: string;
};

export async function listContactsForManager(
  db: SupabaseClient,
  opts?: { q?: string; limit?: number },
): Promise<ContactDirectoryRow[]> {
  const limit = Math.min(Math.max(opts?.limit || 80, 1), 200);
  const needle = (opts?.q || "").trim().toLowerCase();

  const { data: contacts } = await db
    .from("contacts")
    .select("id,name,phone,position,company_id,created_at")
    .order("created_at", { ascending: false })
    .limit(limit * 2);

  const rows = contacts || [];
  if (!rows.length) return [];

  const companyIds = [...new Set(rows.map((c) => c.company_id))];
  const { data: companies } = await db
    .from("companies")
    .select("id,name")
    .in("id", companyIds);
  const nameById = new Map((companies || []).map((c) => [c.id, c.name as string]));

  const mapped: ContactDirectoryRow[] = rows.map((c) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    position: c.position,
    companyId: c.company_id,
    companyName: nameById.get(c.company_id) || "—",
    createdAt: c.created_at,
  }));

  const filtered = needle
    ? mapped.filter((c) => {
        const blob = `${c.name} ${c.phone || ""} ${c.companyName} ${c.position || ""}`.toLowerCase();
        return blob.includes(needle);
      })
    : mapped;

  return filtered.slice(0, limit);
}
