import { defineArrayMember, defineField, defineType } from "sanity";

export const brandDetails = defineType({
  name: "brandDetails",
  title: "Brand Details",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Store / Brand Name",
      type: "string",
      validation: (rule) => rule.required(),
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "theme",
      title: "Theme Colors",
      type: "object",
      fields: [
        defineField({
          name: "primary",
          title: "Primary",
          type: "string",
          description: "CSS color, e.g. #0d182c",
        }),
        defineField({
          name: "secondary",
          title: "Secondary",
          type: "string",
        }),
        defineField({
          name: "accent",
          title: "Accent",
          type: "string",
        }),
        defineField({
          name: "background",
          title: "Background",
          type: "string",
        }),
        defineField({
          name: "text",
          title: "Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "menuLinks",
      title: "Menu Links",
      type: "array",
      of: [defineArrayMember({ type: "navLink" })],
    }),
  ],
});
