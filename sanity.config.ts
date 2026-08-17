import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";

const title = process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE || "PuchUp CMS";

/** Public admin URL: https://puchup.com/admin */
const basePath = process.env.SANITY_STUDIO_BASE_PATH || "/admin";

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
