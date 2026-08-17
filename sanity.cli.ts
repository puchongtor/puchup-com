import "./sanity/load-env.server";
import { defineCliConfig } from "sanity/cli";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

function envDefine(keys: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of keys) {
    out[`process.env.${key}`] = JSON.stringify(process.env[key] ?? "");
  }
  return out;
}

export default defineCliConfig({
  api: { projectId, dataset },
  studioHost: "puchup",
  deployment: {
    autoUpdates: false,
  },
  /**
   * Vite only exposes SANITY_STUDIO_* by default.
   * Inject Next.js NEXT_PUBLIC_* so sanity.config.ts resolves the real projectId
   * (otherwise Studio falls back to "placeholder" and cannot connect).
   */
  vite: (config) => ({
    ...config,
    define: {
      ...config.define,
      ...envDefine([
        "NEXT_PUBLIC_SANITY_PROJECT_ID",
        "NEXT_PUBLIC_SANITY_DATASET",
        "NEXT_PUBLIC_SANITY_API_VERSION",
        "NEXT_PUBLIC_SANITY_PROJECT_TITLE",
        "NEXT_PUBLIC_ROOT_DOMAIN",
        "SANITY_STUDIO_BASE_PATH",
      ]),
    },
  }),
});
