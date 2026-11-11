import { NextResponse } from "next/server";
import { getSaleSession } from "@/lib/sales-ai/auth";
import { listContactsForManager } from "@/lib/sales-ai/crm-contacts";
import { seesAllReports } from "@/lib/sales-ai/roles";
import {
  buildReportHaystack,
  normalizeSearchText,
  scoreSearchMatch,
} from "@/lib/sales-ai/search-match";
import type { VisitSummary } from "@/lib/sales-ai/types";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function summaryBits(summary: VisitSummary | null) {
  const contact0 = summary?.contacts?.[0];
  const product =
    [
      summary?.items?.[0]?.brand?.value,
      summary?.items?.[0]?.model?.value,
      summary?.items?.[0]?.part_number?.value,
    ]
      .filter(Boolean)
      .join(" ") ||
    summary?.items?.[0]?.description ||
    null;

  const extras: string[] = [];
  for (const c of summary?.contacts || []) {
    extras.push(c.name?.value || "", c.phone?.value || "", c.position?.value || "");
  }
  for (const item of summary?.items || []) {
    extras.push(
      item.brand?.value || "",
      item.model?.value || "",
      item.part_number?.value || "",
      item.description || "",
    );
  }
  for (const d of summary?.discussion || []) {
    extras.push(d.topic || "", d.detail || "");
  }
  extras.push(summary?.purpose?.value || "");

  return {
    contact: contact0?.name?.value || null,
    phone: contact0?.phone?.value || null,
    product,
    extras,
  };
}

/** GET ?q= — manager = ทั้งทีม · sales = เฉพาะของตัวเอง */
export async function GET(req: Request) {
  const session = await getSaleSession();
  if (!session) return bad("unauthorized", 401);

  const isManager = seesAllReports(session.role);
  if (!isManager && session.role !== "sales") return bad("forbidden", 403);

  const db = supabaseAdmin();
  if (!db) return bad("supabase_not_configured", 503);

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const limit = Math.min(
    Math.max(Number(url.searchParams.get("limit") || 40) || 40, 1),
    80,
  );

  const contacts = isManager
    ? await listContactsForManager(db, {
        q: q || undefined,
        limit: q ? 40 : 30,
      })
    : [];

  let visitQ = db
    .from("visits")
    .select("id,sales_id,company_name_text,status,confirmed_at,created_at")
    .in("status", ["confirmed", "pending_review", "processing"])
    .order("created_at", { ascending: false })
    .limit(q ? 260 : 40);

  if (!isManager) {
    visitQ = visitQ.eq("sales_id", session.id);
  }

  const { data: visits, error } = await visitQ;
  if (error) return bad(error.message, 500);

  const ids = (visits || []).map((v) => v.id);
  const summaries =
    ids.length === 0
      ? []
      : (
          await db
            .from("visit_summaries")
            .select("visit_id,data")
            .in("visit_id", ids)
            .eq("version", 1)
        ).data || [];
  const byVisit = new Map(
    summaries.map((s) => [s.visit_id, s.data as VisitSummary]),
  );

  const salesIds = [...new Set((visits || []).map((v) => v.sales_id))];
  const salesNameById = new Map<string, string>();
  if (salesIds.length) {
    const { data: people } = await db
      .from("profiles")
      .select("id,full_name,nickname,username")
      .in("id", salesIds);
    for (const p of people || []) {
      salesNameById.set(
        p.id,
        p.nickname || p.full_name || p.username || "Sale",
      );
    }
  }

  type Hit = {
    id: string;
    companyName: string;
    salesId: string;
    salesName: string;
    contact: string | null;
    phone: string | null;
    product: string | null;
    status: string;
    confirmedAt: string | null;
    createdAt: string;
    matchReasons: string[];
    matchScore: number;
    matchTier: "direct" | "related";
  };

  const scored: Hit[] = [];

  for (const v of visits || []) {
    const summary = byVisit.get(v.id) || null;
    const companyName =
      v.company_name_text || summary?.company?.name?.value || "ไม่ระบุ";
    const bits = summaryBits(summary);
    const hay = buildReportHaystack({
      companyName,
      contact: bits.contact,
      phone: bits.phone,
      product: bits.product,
      purpose: summary?.purpose?.value,
      extras: bits.extras,
    });

    let matchScore = 0;
    let matchReasons: string[] = [];
    let matchTier: "direct" | "related" = "direct";

    if (q) {
      const hit = scoreSearchMatch(q, hay, {
        company: companyName,
        contact: bits.contact || undefined,
        phone: bits.phone || undefined,
        product: bits.product || undefined,
      });
      if (hit.score <= 0) continue;
      matchScore = hit.score;
      matchReasons = hit.reasons;
      matchTier = hit.tier;
    }

    scored.push({
      id: v.id,
      companyName,
      salesId: v.sales_id,
      salesName: salesNameById.get(v.sales_id) || "Sale",
      contact: bits.contact,
      phone: bits.phone,
      product: bits.product,
      status: v.status,
      confirmedAt: v.confirmed_at,
      createdAt: v.created_at,
      matchReasons,
      matchScore,
      matchTier,
    });
  }

  const byScoreThenDate = (a: Hit, b: Hit) =>
    b.matchScore - a.matchScore ||
    (b.confirmedAt || b.createdAt).localeCompare(a.confirmedAt || a.createdAt);

  const sorted = q ? [...scored].sort(byScoreThenDate) : scored;
  const reportHits = q
    ? sorted.filter((h) => h.matchTier === "direct").slice(0, limit)
    : sorted.slice(0, limit);
  const relatedHits = q
    ? sorted
        .filter((h) => h.matchTier === "related")
        .slice(0, Math.min(20, limit))
    : [];

  // Manager contacts: smart-filter ด้วย score ถ้ามี q
  let ownContacts = contacts;
  if (isManager && q && contacts.length) {
    ownContacts = contacts
      .map((c) => {
        const hay = `${c.name} ${c.phone || ""} ${c.companyName} ${c.position || ""}`;
        const hit = scoreSearchMatch(q, hay, {
          company: c.companyName,
          contact: c.name,
          phone: c.phone || undefined,
        });
        return { c, hit };
      })
      .filter((x) => x.hit.score > 0)
      .sort((a, b) => b.hit.score - a.hit.score)
      .slice(0, 40)
      .map((x) => x.c);
  } else if (!isManager) {
    const map = new Map<
      string,
      {
        id: string;
        name: string;
        phone: string | null;
        position: string | null;
        companyId: string;
        companyName: string;
        createdAt: string;
      }
    >();
    for (const r of reportHits) {
      if (!r.contact && !r.phone) continue;
      const key = `${normalizeSearchText(r.contact || "")}|${r.phone || ""}|${normalizeSearchText(r.companyName)}`;
      if (map.has(key)) continue;
      map.set(key, {
        id: `own-${r.id}`,
        name: r.contact || "—",
        phone: r.phone,
        position: null,
        companyId: "",
        companyName: r.companyName,
        createdAt: r.confirmedAt || r.createdAt,
      });
    }
    ownContacts = [...map.values()].slice(0, 40);
  }

  return NextResponse.json({
    ok: true,
    q,
    scope: isManager ? "team" : "self",
    reports: reportHits,
    relatedReports: relatedHits,
    contacts: ownContacts,
  });
}
