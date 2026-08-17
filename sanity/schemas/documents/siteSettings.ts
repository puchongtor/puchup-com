import { CogIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Singleton — global settings for puchup.com (logo, nav, footer, social, SEO).
 * Document id is fixed to `siteSettings` via Studio structure.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "mainNav",
      title: "Main Menu",
      type: "array",
      of: [defineArrayMember({ type: "navLink" })],
    }),
    defineField({
      name: "footerNav",
      title: "Footer Links",
      type: "array",
      of: [defineArrayMember({ type: "navLink" })],
    }),
    defineField({
      name: "footerText",
      title: "Footer Text",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [defineArrayMember({ type: "socialLink" })],
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
    }),
    defineField({
      name: "seo",
      title: "Default SEO",
      type: "seo",
    }),
  ],
  preview: {
    select: { title: "siteName", media: "logo" },
    prepare: ({ title, media }) => ({
      title: title || "Site Settings",
      subtitle: "Singleton",
      media,
    }),
  },
});
