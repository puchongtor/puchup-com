import { defineArrayMember, defineField, defineType } from "sanity";

export const ctaSection = defineType({
  name: "ctaSection",
  title: "CTA",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
    defineField({
      name: "ctas",
      title: "Buttons",
      type: "array",
      of: [defineArrayMember({ type: "ctaButton" })],
      validation: (rule) => rule.max(3),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "CTA", subtitle: "Call to action" }),
  },
});
