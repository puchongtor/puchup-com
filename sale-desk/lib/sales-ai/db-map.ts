import type { SalesProfile, SalesRole, StoredVisitReport } from "./types";

export function toDbRole(role: SalesRole): "admin" | "manager" | "sales" {
  if (role === "admin") return "admin";
  if (role === "manager") return "manager";
  return "sales";
}

export function fromDbRole(role: string | null | undefined): SalesRole {
  if (role === "admin") return "admin";
  if (role === "manager" || role === "reports" || role === "owner") return "manager";
  return "sales";
}

export type DbProfileRow = {
  id: string;
  full_name: string;
  nickname: string | null;
  position: string | null;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  role: string;
  updated_at: string;
};

export function profileToDb(p: SalesProfile) {
  return {
    id: p.id,
    full_name: p.fullName,
    nickname: p.nickname || null,
    position: p.position || null,
    phone: p.phone || null,
    email: p.email || null,
    avatar_url:
      p.avatarDataUrl && p.avatarDataUrl.length < 1800 ? p.avatarDataUrl : null,
    role: toDbRole(p.role),
    status: "active",
    updated_at: p.updatedAt || new Date().toISOString(),
  };
}

export function profileFromDb(row: DbProfileRow, fallbackAvatar: string | null): SalesProfile {
  return {
    id: row.id,
    fullName: row.full_name,
    nickname: row.nickname || row.full_name,
    position: row.position || "เซลล์ภาคสนาม",
    phone: row.phone || "",
    email: row.email || "",
    avatarDataUrl: row.avatar_url || fallbackAvatar,
    role: fromDbRole(row.role),
    updatedAt: row.updated_at,
  };
}

export function reportToVisitRow(report: StoredVisitReport) {
  return {
    id: report.id,
    sales_id: report.salesId,
    company_name_text: report.companyName,
    status: report.status === "confirmed" ? "confirmed" : "pending_review",
    confirmed_at: report.confirmedAt,
    distance_km: report.summary.distance_km,
    created_at: report.createdAt,
  };
}

export function reportToSummaryRow(report: StoredVisitReport) {
  return {
    visit_id: report.id,
    version: 1,
    status: report.status === "confirmed" ? "confirmed" : "sales_edited",
    data: report.summary,
    field_sources: {},
    field_confidence: {},
    created_by: report.salesId,
  };
}
