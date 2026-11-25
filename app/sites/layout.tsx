/** Isolated shell for demo / subdomain sites — no main marketing chrome. */
import { DemoDisclosureAssets } from "@/components/demos/DemoDisclosureAssets";

export const dynamic = "force-static";
export const revalidate = false;
export default function SitesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <><DemoDisclosureAssets />{children}</>;
}
