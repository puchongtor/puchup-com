import { salePublicPath, toSaleInternalPath } from "@/lib/sales-ai/paths";

export type SaleAppRole = "admin" | "manager" | "sales";

/** Manager = ผู้บริหาร (หัวหน้า/เจ้าของ) มาอ่านรายงาน — ยังไม่แยกทีม */
export const SALE_ROLE_LABEL: Record<SaleAppRole, string> = {
  admin: "Admin",
  manager: "ผู้บริหาร",
  sales: "Sale",
};

export const PILOT_MAX_SALES = 5;

/** Rest path only (no host): /admin | /manager | /home */
export function homePathForRole(role: SaleAppRole): string {
  if (role === "admin") return "/admin";
  if (role === "manager") return "/manager";
  return "/home";
}

/** Browser URL — pass Host so sale.* drops /sale prefix */
export function homeForRole(role: SaleAppRole, host?: string | null): string {
  return salePublicPath(homePathForRole(role), host);
}

export function normalizeSaleRole(raw: string | null | undefined): SaleAppRole {
  if (raw === "admin") return "admin";
  if (
    raw === "manager" ||
    raw === "reports" ||
    raw === "owner" ||
    raw === "รายงานบริษัท"
  ) {
    return "manager";
  }
  return "sales";
}

/** Admin = คุมระบบ · Manager = รายงาน + จัดการ Sale · Sale = ภาคสนาม */
export function canAccessPath(role: SaleAppRole, pathname: string): boolean {
  // รองรับทั้ง /sale/admin (localhost) และ /admin (sale.*)
  const path = toSaleInternalPath(pathname);

  if (path === "/sale" || path.startsWith("/sale/manifest")) return true;
  if (role === "admin") return path.startsWith("/sale");

  if (path.startsWith("/sale/admin")) return false;

  if (
    path.startsWith("/sale/manager") ||
    path.startsWith("/sale/reports") ||
    path.startsWith("/sale/owner") ||
    path.startsWith("/sale/accounts")
  ) {
    return role === "manager";
  }

  // ค้นหา + อ่านรายงาน: manager เห็นทั้งทีม · sale เห็นของตัวเอง (API กรอง)
  if (path.startsWith("/sale/search") || path.startsWith("/sale/report/")) {
    return role === "manager" || role === "sales";
  }

  if (path.startsWith("/sale/tasks") || path.startsWith("/sale/score")) {
    return role === "manager" || role === "sales";
  }

  if (path.startsWith("/sale/profile")) {
    return role === "sales" || role === "manager";
  }

  if (
    path.startsWith("/sale/home") ||
    path.startsWith("/sale/customers") ||
    path.startsWith("/sale/visit") ||
    path.startsWith("/sale/onboarding")
  ) {
    return role === "sales";
  }

  return false;
}

export function seesAllReports(role: SaleAppRole): boolean {
  return role === "admin" || role === "manager";
}
