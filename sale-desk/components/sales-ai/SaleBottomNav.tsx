"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Star, Users } from "lucide-react";
import { saleHref, toSaleInternalPath } from "@/lib/sales-ai/paths";

const items = [
  { path: "/home", match: "/sale/home", label: "หน้าหลัก", icon: Home },
  { path: "/customers", match: "/sale/customers", label: "ลูกค้า", icon: Users },
  { path: "/score", match: "/sale/score", label: "คะแนน", icon: Star },
] as const;

export function SaleBottomNav() {
  const raw = usePathname() || "/sale";
  const pathname = toSaleInternalPath(raw);
  if (
    pathname.startsWith("/sale/visit") ||
    pathname.startsWith("/sale/owner") ||
    pathname.startsWith("/sale/reports") ||
    pathname.startsWith("/sale/manager") ||
    pathname.startsWith("/sale/admin") ||
    pathname.startsWith("/sale/onboarding") ||
    pathname.startsWith("/sale/report") ||
    pathname.startsWith("/sale/profile") ||
    pathname === "/sale"
  ) {
    return null;
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t"
      style={{
        borderColor: "var(--sale-line)",
        background: "var(--sale-surface)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="mx-auto grid max-w-md grid-cols-3">
        {items.map((item) => {
          const active =
            item.match === "/sale/home"
              ? pathname === "/sale/home"
              : pathname.startsWith(item.match);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={saleHref(item.path)}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px]"
              style={{
                color: active ? "var(--sale-navy)" : "var(--sale-muted)",
                fontWeight: active ? 600 : 400,
              }}
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.25 : 1.75}
                aria-hidden
              />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
