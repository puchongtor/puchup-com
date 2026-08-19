import { defineField, defineType } from "sanity";

export const menuOrServiceItem = defineType({
  name: "menuOrServiceItem",
  title: "Menu / Service item",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "ชื่อ",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "รายละเอียด",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "price",
      title: "ราคา",
      type: "string",
      description: "เช่น ฿120 หรือ เริ่มต้น ฿3,800 / คืน",
    }),
    defineField({
      name: "category",
      title: "หมวดหมู่",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "รูป",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "imageUrl",
      title: "Image URL (fallback)",
      type: "url",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "price", media: "image" },
  },
});
