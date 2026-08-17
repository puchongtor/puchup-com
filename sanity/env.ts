/**
 * Browser-safe env for Sanity Studio / sanity.config.ts.
 * Do NOT import `fs` here — this file is bundled for the browser by Vite.
 *
 * Values are injected at build time via `sanity.cli.ts` → vite.define
 * (NEXT_PUBLIC_* from `.env.local`).
 */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId = resolveProjectId(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
);

/** Root domain used for subdomain routing (e.g. puchup.com). */
export const rootDomain =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || "puchup.com";

function resolveProjectId(value: string | undefined): string {
  const id = (value || "").trim();
  if (!id || id === "placeholder") {
    console.warn(
      "[sanity] Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Check .env.local and restart `npm run sanity`.",
    );
    return "placeholder";
  }
  return id;
}
