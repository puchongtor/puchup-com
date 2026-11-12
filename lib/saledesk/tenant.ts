/**
 * White-label tenant — mirrors sale-desk Meridian Parts showcase brand
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

export const meridianTenant: SaleDeskTenant = {
  id: "meridian-parts",
  name: "Meridian Parts",
  legalName: "บริษัท เมอริเดียน พาร์ทส์ จำกัด",
  productName: "SaleDesk",
  markLetter: "M",
  accent: "#1b1c1e",
  accentSoft: "#f2f1ef",
  domain: "sale.puchup.com",
};

/** @deprecated alias — use meridianTenant */
export const yourCompanyTenant = meridianTenant;

export const saleDeskTenants: SaleDeskTenant[] = [meridianTenant];

export function getSaleDeskTenant(id: string): SaleDeskTenant {
  return saleDeskTenants.find((t) => t.id === id) || meridianTenant;
}
