import { defineField, defineType } from "sanity";

export const galleryImage = defineType({
  name: "galleryImage",
  title: "Gallery image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "รูปภาพบรรยากาศ",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "imageUrl",
      title: "Image URL (fallback)",
      type: "url",
    }),
    defineField({
      name: "alt",
      title: "คำอธิบายรูป",
      type: "string",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "alt", subtitle: "caption", media: "image" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Gallery image",
      subtitle,
      media,
    }),
  },
});
