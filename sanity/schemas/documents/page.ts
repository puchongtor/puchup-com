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
        "Use `projectone` for /projectone. Use `home` for the main landing page.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sections",
      title: "Page Sections (Block Builder)",
      type: "array",
      of: [
        defineArrayMember({ type: "heroSection" }),
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
