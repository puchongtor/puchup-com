import StudioRedirectClient from "@/components/admin/StudioRedirectClient";

export function generateStaticParams() {
  return [{ tool: [] }];
}

/** Legacy path — admin lives at /admin */
export default function StudioRedirect() {
  return <StudioRedirectClient />;
}
