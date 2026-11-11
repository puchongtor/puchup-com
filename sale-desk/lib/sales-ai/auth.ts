import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { SaleAppRole } from "./roles";
import { normalizeSaleRole } from "./roles";

export const SALE_SESSION_COOKIE = "pu_sale";

export type SaleSession = {
  id: string;
  username: string;
  fullName: string;
  role: SaleAppRole;
};

function secretBytes() {
  const secret =
    process.env.AUTH_SECRET ||
    "puchup-sale-dev-secret-change-before-go-live-2026";
  return new TextEncoder().encode(`sale:${secret}`);
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string | null | undefined): boolean {
  if (!stored || !stored.includes(":")) return false;
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;
  const actual = scryptSync(password, salt, 64).toString("hex");
  try {
    return timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export async function createSaleSessionToken(user: SaleSession) {
  return new SignJWT({
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretBytes());
}

export async function verifySaleSessionToken(token: string): Promise<SaleSession> {
  const { payload } = await jwtVerify(token, secretBytes());
  return {
    id: String(payload.id || payload.sub || ""),
    username: String(payload.username || ""),
    fullName: String(payload.fullName || ""),
    role: normalizeSaleRole(String(payload.role || "")),
  };
}

export async function getSaleSession(): Promise<SaleSession | null> {
  const jar = await cookies();
  const token = jar.get(SALE_SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const session = await verifySaleSessionToken(token);
    if (!session.id || !session.username) return null;
    return session;
  } catch {
    return null;
  }
}

export async function setSaleSessionCookie(user: SaleSession) {
  const token = await createSaleSessionToken(user);
  const jar = await cookies();
  jar.set(SALE_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSaleSessionCookie() {
  const jar = await cookies();
  jar.delete(SALE_SESSION_COOKIE);
}
