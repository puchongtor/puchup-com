"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isSaleSubdomainHost } from "@/lib/sales-ai/paths";

/** บน sale.* ถ้าแถบที่อยู่ยังมี /sale ให้ตัดออกโดยไม่ reload */
export function SaleUrlCanon() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isSaleSubdomainHost(window.location.host)) return;

    const { pathname: urlPath, search, hash } = window.location;
    if (urlPath !== "/sale" && !urlPath.startsWith("/sale/")) return;

    const next = urlPath === "/sale" ? "/" : urlPath.slice("/sale".length) || "/";
    window.history.replaceState(window.history.state, "", `${next}${search}${hash}`);
  }, [pathname]);

  return null;
}
