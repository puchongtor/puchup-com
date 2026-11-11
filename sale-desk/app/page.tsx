import { redirect } from "next/navigation";

/** Local root → /sale login (on sale.puchup.com, proxy rewrites / → /sale) */
export default function RootPage() {
  redirect("/sale");
}
