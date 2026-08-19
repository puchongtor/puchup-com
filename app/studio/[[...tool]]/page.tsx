import StudioRedirectClient from "@/components/admin/StudioRedirectClient";

/** Legacy path — admin lives at /admin */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ tool: [] }];
}

export default function StudioRedirect() {
  return <StudioRedirectClient />;
}
