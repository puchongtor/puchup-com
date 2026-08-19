import { defineField, defineType } from "sanity";

export const reviewItem = defineType({
  name: "reviewItem",
  title: "Review",
  type: "object",
  fields: [
    defineField({
      name: "rating",
      title: "คะแนน",
      type: "number",
      validation: (rule) => rule.min(1).max(5).precision(1),
      initialValue: 5,
    }),
    defineField({
      name: "quote",
      title: "ข้อความรีวิว",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "ชื่อผู้รีวิว",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "context",
      title: "บริบท (เช่น ย่าน / ประเภทบริการ)",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "author", subtitle: "quote" },
  },
});
