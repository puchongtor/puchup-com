import { EarthGlobeIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Demo storefront mapped to [sub].puchup.com via middleware rewrite → /sites/[site].
 */
export const demoSite = defineType({
  name: "demoSite",
  title: "Demo Site",
  type: "document",
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: "title",
      title: "Internal Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subdomain",
      title: "Subdomain",
      type: "slug",
      description:
        "Unique slug mapped to URL, e.g. `mellow` → mellow.puchup.com (and /sites/mellow)",
      options: {
        source: "title",
        maxLength: 64,
        isUnique: async (slug, context) => {
          const { document, getClient } = context;
          const client = getClient({ apiVersion: "2025-01-01" });
          const id = document?._id?.replace(/^drafts\./, "");
          const params = {
            draft: `drafts.${id}`,
            published: id,
            subdomain: slug,
          };
          const query = `!defined(*[
            _type == "demoSite" &&
            subdomain.current == $subdomain &&
            !(_id in [$draft, $published])
          ][0]._id)`;
          return client.fetch(query, params);
        },
      },
      validation: (rule) =>
        rule.required().custom((value) => {
          const current = value?.current;
          if (!current) return "Required";
          if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(current)) {
            return "Use lowercase letters, numbers, and hyphens only";
          }
          const reserved = ["www", "api", "studio", "app", "mail", "cdn"];
          if (reserved.includes(current)) {
            return `"${current}" is reserved`;
          }
          return true;
        }),
    }),
    defineField({
      name: "brandDetails",
      title: "Brand Details",
      type: "brandDetails",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "codeEmbed",
      title: "Code Embed",
      type: "codeEmbed",
      description:
        "Custom HTML/JS/CSS rendered in a sandboxed container on the demo page",
    }),
    defineField({
      name: "imagePrompts",
      title: "Image Prompts",
      type: "array",
      of: [defineArrayMember({ type: "imagePrompt" })],
    }),
    defineField({
      name: "body",
      title: "Additional Rich Text",
      type: "richText",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subdomain: "subdomain.current",
      media: "brandDetails.logo",
    },
    prepare: ({ title, subdomain, media }) => ({
      title: title || "Demo Site",
      subtitle: subdomain ? `${subdomain}.puchup.com` : "No subdomain",
      media,
    }),
  },
});
