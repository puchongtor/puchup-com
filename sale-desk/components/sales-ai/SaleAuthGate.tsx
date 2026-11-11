"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { saleNavPath } from "@/lib/sales-ai/paths";
import {
  canAccessPath,
  homeForRole,
  normalizeSaleRole,
  type SaleAppRole,
} from "@/lib/sales-ai/roles";

export function SaleAuthGate({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/sale";
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setAllowed(false);
    const isPublic =
      pathname === "/sale" ||
      pathname === "/" ||
      pathname.startsWith("/sale/manifest");

    (async () => {
      try {
        const res = await fetch("/api/sale/auth/me");
        const json = (await res.json()) as {
          ok?: boolean;
          user?: { role?: string };
          redirectTo?: string;
        };

        if (cancelled) return;

        if (!res.ok || !json.ok || !json.user) {
          if (isPublic) {
            setAllowed(true);
            return;
          }
          router.replace(saleNavPath("/"));
          return;
        }

        const role = normalizeSaleRole(json.user.role);
        if (isPublic) {
          router.replace(json.redirectTo || homeForRole(role, window.location.host));
          return;
        }

        if (!canAccessPath(role, pathname)) {
          router.replace(homeForRole(role as SaleAppRole, window.location.host));
          return;
        }
        setAllowed(true);
      } catch {
        if (!cancelled) {
          if (isPublic) setAllowed(true);
          else router.replace(saleNavPath("/"));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (!allowed) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm" style={{ color: "#64748b" }}>
        กำลังโหลด…
      </div>
    );
  }

  return <>{children}</>;
}
