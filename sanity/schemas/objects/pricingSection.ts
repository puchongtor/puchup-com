import { defineArrayMember, defineField, defineType } from "sanity";

export const pricingSection = defineType({
  name: "pricingSection",
  title: "Pricing",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
    defineField({
      name: "plans",
      title: "Plans",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "pricingPlan",
          fields: [
            defineField({
              name: "name",
              title: "Plan name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "price", title: "Price", type: "string" }),
            defineField({ name: "blurb", title: "Short description", type: "text", rows: 2 }),
            defineField({
              name: "features",
              title: "Features",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
            defineField({ name: "ctaLabel", title: "CTA label", type: "string" }),
            defineField({ name: "ctaHref", title: "CTA URL", type: "string" }),
            defineField({
              name: "highlighted",
              title: "Highlight this plan",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: { select: { title: "name", subtitle: "price" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Pricing", subtitle: "Pricing" }),
  },
});
