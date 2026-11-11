/** Public URL helpers for Sale app (sale.puchup.com = no /sale prefix; localhost = /sale/…) */

export function isSaleSubdomainHost(host?: string | null): boolean {
  const h = (host || "").split(":")[0]?.toLowerCase() ?? "";
  return (
    h === "sale.puchup.com" ||
    h === "sale.localhost" ||
    h.startsWith("sale.")
  );
}

/** Normalize to app rest path: "/home", "/manager", "/" */
export function toSaleRestPath(path: string): string {
  let p = path.trim() || "/";
  if (!p.startsWith("/")) p = `/${p}`;
  if (p === "/sale" || p === "/sale/") return "/";
  if (p.startsWith("/sale/")) p = p.slice("/sale".length) || "/";
  return p || "/";
}

/** Pathname จาก browser → รูปแบบในแอป (/sale/…) สำหรับเช็คสิทธิ์ */
export function toSaleInternalPath(pathname: string): string {
  const rest = toSaleRestPath(pathname);
  return rest === "/" ? "/sale" : `/sale${rest}`;
}

/**
 * Browser-facing Sale path.
 * sale.puchup.com → /manager
 * localhost → /sale/manager
 */
export function salePublicPath(path: string, host?: string | null): string {
  const rest = toSaleRestPath(path);
  if (isSaleSubdomainHost(host)) {
    return rest;
  }
  return rest === "/" ? "/sale" : `/sale${rest}`;
}

export function saleHref(path: string): string {
  return salePublicPath(path, null);
}

export function saleNavPath(path: string): string {
  const host = typeof window !== "undefined" ? window.location.host : null;
  return salePublicPath(path, host);
}
