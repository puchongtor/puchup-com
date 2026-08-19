import type { StructureResolver } from "sanity/structure";

const SITE_SETTINGS_ID = "siteSettings";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id(SITE_SETTINGS_ID)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId(SITE_SETTINGS_ID)
            .title("Site Settings"),
        ),
      S.divider(),
      S.documentTypeListItem("page").title("Pages"),
      S.documentTypeListItem("projectOneDemo").title("Project ONE Demos"),
      S.documentTypeListItem("demoSite").title("Demo Sites (subdomain)"),
    ]);
