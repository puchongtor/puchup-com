import { DocumentIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Custom pages for puchup.com and /projectone with a block builder.
 */
export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-_/]/g, "")
            .slice(0, 96),
      },
      description:
        "Use `home` (or `index`) for the landing page `/`. Use `demo` for Showroom. Use `projectone` for /ProjectONE.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sections",
      title: "Page Builder Blocks",
      type: "array",
      of: [
        defineArrayMember({ type: "heroSection" }),
        defineArrayMember({ type: "featuresSection" }),
        defineArrayMember({ type: "pricingSection" }),
        defineArrayMember({ type: "ctaSection" }),
        defineArrayMember({
          type: "object",
          name: "richTextSection",
          title: "Rich Text Body",
          fields: [
            defineField({
              name: "heading",
              title: "Section Heading (optional)",
              type: "string",
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "richText",
            }),
          ],
          preview: {
            select: { title: "heading" },
            prepare: ({ title }) => ({
              title: title || "Rich Text Body",
              subtitle: "Rich Text",
            }),
          },
        }),
        defineArrayMember({ type: "demoShowcaseGrid" }),
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
});
