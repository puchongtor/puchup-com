import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";

const title = process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE || "PuchUp CMS";

/**
 * Standalone `sanity dev` serves at http://localhost:3333/
 * Use SANITY_STUDIO_BASE_PATH=/studio only when embedding NextStudio later.
 */
const basePath = process.env.SANITY_STUDIO_BASE_PATH || "/";

export default defineConfig({
  name: "puchup",
  title,
  projectId,
  dataset,
  basePath,
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
