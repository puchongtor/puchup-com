/**
 * White-label tenant config สำหรับ SaleDesk
 * Phase 1 ใช้กับเดโม Your Company
 * Phase 2 จะผูกกับแอปจริงหลัง extract จากต้นแบบ Advance (คนละแบรนด์)
 */

export type SaleDeskTenant = {
  id: string;
  name: string;
  legalName: string;
  productName: string;
  markLetter: string;
  accent: string;
  accentSoft: string;
  domain?: string;
};

export const yourCompanyTenant: SaleDeskTenant = {
  id: "your-company",
  name: "Your Company",
  legalName: "บริษัท อินดัสเทค พาร์ทส์ จำกัด",
  productName: "SaleDesk",
  markLetter: "YC",
  accent: "#0d182c",
  accentSoft: "#e8eef6",
  domain: "sale.puchup.com",
};

/** รายการ tenant ที่รองรับในโปรดักต์ (ขยายตอน Phase 2) */
export const saleDeskTenants: SaleDeskTenant[] = [yourCompanyTenant];

export function getSaleDeskTenant(id: string): SaleDeskTenant {
  return saleDeskTenants.find((t) => t.id === id) || yourCompanyTenant;
}
