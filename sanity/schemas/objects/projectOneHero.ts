import { defineField, defineType } from "sanity";

export const projectOneHero = defineType({
  name: "projectOneHero",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "หัวข้อ",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "คำโปรย",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "รูปภาพ",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text",
        }),
      ],
    }),
    defineField({
      name: "imageUrl",
      title: "Image URL (fallback)",
      type: "url",
      description: "ใช้เมื่อยังไม่อัปโหลดไฟล์ใน Studio — เช่น Unsplash จากเทมเพลตเดิม",
    }),
  ],
});
