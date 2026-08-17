import { defineField, defineType } from "sanity";

export const imagePrompt = defineType({
  name: "imagePrompt",
  title: "Image Prompt Slot",
  type: "object",
  fields: [
    defineField({
      name: "slotName",
      title: "Slot Name",
      type: "string",
      description: "Stable id used in the frontend, e.g. hero-main",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "promptText",
      title: "Prompt Text",
      type: "text",
      rows: 3,
      description: "Shown in the placeholder and copied via Copy Prompt",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "imageUpload",
      title: "Uploaded Image",
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
      name: "aspectRatio",
      title: "Aspect Ratio Hint",
      type: "string",
      options: {
        list: ["1:1", "4:3", "3:4", "16:9", "9:16"],
      },
      initialValue: "16:9",
    }),
  ],
  preview: {
    select: {
      title: "slotName",
      subtitle: "promptText",
      media: "imageUpload",
    },
  },
});
