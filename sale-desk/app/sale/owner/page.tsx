import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { salePublicPath } from "@/lib/sales-ai/paths";

/** เดิมแดชบอร์ดเจ้าของ → Manager */
export default async function OwnerRedirectPage() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  redirect(salePublicPath("/manager", host));
}