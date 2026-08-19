/** Isolated shell for demo / subdomain sites — no main marketing chrome. */

export const dynamic = "force-static";
export const revalidate = false;
export default function SitesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
