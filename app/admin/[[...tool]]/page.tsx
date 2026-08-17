import AdminStudio from "@/components/admin/AdminStudio";

export function generateStaticParams() {
  return [{ tool: [] }];
}

export default function AdminStudioPage() {
  return <AdminStudio />;
}
