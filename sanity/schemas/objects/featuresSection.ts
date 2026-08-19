import { defineArrayMember, defineField, defineType } from "sanity";

export const featuresSection = defineType({
  name: "featuresSection",
  title: "Features",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
    defineField({
      name: "items",
      title: "Features",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "featureItem",
          fields: [
            defineField({ name: "icon", title: "Icon / emoji", type: "string" }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Features", subtitle: "Features" }),
  },
});
