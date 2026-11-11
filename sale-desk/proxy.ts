import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

const SALE_SESSION_COOKIE = "pu_sale";
const AUTH_SECRET =
  process.env.AUTH_SECRET || "puchup-sale-dev-secret-change-before-go-live-2026";

function saleSecret() {
  return new TextEncoder().encode(`sale:${AUTH_SECRET}`);
}

function isSalePublicPath(pathname: string) {
  return (
    pathname === "/sale" ||
    pathname.startsWith("/sale/manifest") ||
    pathname === "/api/sale/auth/login"
  );
}

function isSaleHost(host: string) {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  return (
    h === "sale.puchup.com" ||
    h === "sale.localhost" ||
    h.startsWith("sale.")
  );
}

function isLocalDevHost(host: string) {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  return h === "localhost" || h === "127.0.0.1";
}

function rewriteSalePath(pathname: string) {
  if (
    pathname.startsWith("/sale") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/brand") ||
    pathname.startsWith("/favicon")
  ) {
    return null;
  }
  if (pathname === "/") return "/sale";
  return `/sale${pathname}`;
}

export async function proxy(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // sale.puchup.com → rewrite root to /sale/* (public URL has no /sale)
  if (isSaleHost(host)) {
    const target = rewriteSalePath(pathname);
    const effectivePath = target || pathname;

    if (
      effectivePath.startsWith("/sale") ||
      effectivePath.startsWith("/api/sale")
    ) {
      if (!isSalePublicPath(effectivePath)) {
        const saleToken = request.cookies.get(SALE_SESSION_COOKIE)?.value;
        if (!saleToken) {
          if (effectivePath.startsWith("/api/sale")) {
            return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
          }
          const url = request.nextUrl.clone();
          url.pathname = "/";
          return NextResponse.redirect(url);
        }
        try {
          await jwtVerify(saleToken, saleSecret());
        } catch {
          const response = effectivePath.startsWith("/api/sale")
            ? NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
            : NextResponse.redirect(new URL("/", request.url));
          response.cookies.delete(SALE_SESSION_COOKIE);
          return response;
        }
      }
    }

    if (target) {
      const url = request.nextUrl.clone();
      url.pathname = target;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // localhost: /sale + auth gate
  if (
    isLocalDevHost(host) &&
    (pathname.startsWith("/sale") || pathname.startsWith("/api/sale")) &&
    !isSalePublicPath(pathname)
  ) {
    const saleToken = request.cookies.get(SALE_SESSION_COOKIE)?.value;
    if (!saleToken) {
      if (pathname.startsWith("/api/sale")) {
        return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = "/sale";
      return NextResponse.redirect(url);
    }
    try {
      await jwtVerify(saleToken, saleSecret());
    } catch {
      const response = pathname.startsWith("/api/sale")
        ? NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
        : NextResponse.redirect(new URL("/sale", request.url));
      response.cookies.delete(SALE_SESSION_COOKIE);
      return response;
    }
  }

  return NextResponse.next();
}
