import { defineArrayMember, defineField, defineType } from "sanity";

export const demoShowcaseGrid = defineType({
  name: "demoShowcaseGrid",
  title: "Demo Showcase Grid",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "items",
      title: "Demo Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "demoItem",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "subtitle",
              title: "Subtitle",
              type: "string",
            }),
            defineField({
              name: "href",
              title: "Link (subdomain or path)",
              type: "string",
              description:
                "e.g. /sites/mellow or https://mellow.puchup.com",
            }),
            defineField({
              name: "image",
              title: "Cover Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "promptText",
              title: "Image Prompt (fallback)",
              type: "text",
              rows: 2,
              description:
                "Shown with Copy Prompt when no image is uploaded",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "subtitle", media: "image" },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading", items: "items" },
    prepare: ({ title, items }) => ({
      title: title || "Demo Showcase Grid",
      subtitle: `${items?.length ?? 0} demos`,
    }),
  },
});
