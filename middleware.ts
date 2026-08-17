import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "puchup.com";

/** Hostnames that always serve the main app (no subdomain rewrite). */
const PASSTHROUGH_HOSTS = new Set([
  ROOT_DOMAIN,
  `www.${ROOT_DOMAIN}`,
  "localhost",
  "127.0.0.1",
]);

/**
 * Subdomain & route handling:
 * - Main: puchup.com, www, localhost → passthrough (incl. /projectone)
 * - Dynamic: [sub].puchup.com → rewrite to /sites/[sub]
 * - Excludes: static files, _next, api, /studio
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldSkip(pathname)) {
    return NextResponse.next();
  }

  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0]?.toLowerCase() || "";

  // Local subdomain testing: mellow.localhost:3000 → /sites/mellow
  const localSub = extractLocalSubdomain(hostname);
  if (localSub) {
    return rewriteToSite(request, localSub, pathname);
  }

  if (PASSTHROUGH_HOSTS.has(hostname) || isVercelPreview(hostname)) {
    // Case-normalize /projectone → /ProjectONE (folder name on disk)
    if (
      pathname === "/projectone" ||
      pathname === "/projectone/" ||
      pathname.startsWith("/projectone/")
    ) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.replace(/^\/projectone/i, "/ProjectONE");
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  const sub = extractRootSubdomain(hostname);
  if (sub) {
    return rewriteToSite(request, sub, pathname);
  }

  return NextResponse.next();
}

function shouldSkip(pathname: string): boolean {
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/studio") ||
    pathname.startsWith("/sites")
  ) {
    return true;
  }

  // Static files (favicon, images, etc.)
  if (pathname.includes(".") && !pathname.endsWith("/")) {
    return true;
  }

  return false;
}

function extractLocalSubdomain(hostname: string): string | null {
  // e.g. cafe.localhost
  if (!hostname.endsWith(".localhost")) return null;
  const sub = hostname.slice(0, -".localhost".length);
  if (!sub || sub === "www") return null;
  return sanitizeSubdomain(sub);
}

function extractRootSubdomain(hostname: string): string | null {
  // e.g. cafe.puchup.com → cafe
  const suffix = `.${ROOT_DOMAIN}`;
  if (!hostname.endsWith(suffix)) return null;
  const sub = hostname.slice(0, -suffix.length);
  if (!sub || sub.includes(".") || sub === "www") return null;
  return sanitizeSubdomain(sub);
}

function isVercelPreview(hostname: string): boolean {
  return hostname.endsWith(".vercel.app");
}

function sanitizeSubdomain(value: string): string | null {
  const cleaned = value.toLowerCase().trim();
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(cleaned)) return null;
  return cleaned;
}

function rewriteToSite(
  request: NextRequest,
  subdomain: string,
  pathname: string,
) {
  const url = request.nextUrl.clone();
  // Keep trailing path under the demo site if needed later; root → /sites/[sub]/
  const rest = pathname === "/" ? "" : pathname.replace(/\/$/, "");
  url.pathname = `/sites/${subdomain}${rest}/`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all paths except Next internals handled in shouldSkip as well.
     * Matcher cannot easily express all static cases, so we filter in code.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
