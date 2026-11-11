import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { salePublicPath } from "@/lib/sales-ai/paths";

/** เดิม /reports → /manager */
export default async function ReportsRedirectPage() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  redirect(salePublicPath("/manager", host));
}
