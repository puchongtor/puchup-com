import AdminStudio from "@/components/admin/AdminStudio";

/** Single static shell — do not walk /admin/* during static export. */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ tool: [] }];
}

export default function AdminStudioPage() {
  return <AdminStudio />;
}
