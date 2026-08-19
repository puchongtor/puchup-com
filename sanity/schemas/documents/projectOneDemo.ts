import { EarthGlobeIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Project ONE business demo — drives /ProjectONE/[slug] and Showroom live links.
 */
export const projectOneDemo = defineType({
  name: "projectOneDemo",
  title: "Project ONE Demo",
  type: "document",
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      description: "ต้องตรงกับ URL เช่น baankhaokhom → /ProjectONE/baankhaokhom/",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "businessType",
      title: "Business type",
      type: "string",
      options: {
        list: [
          { title: "ร้านอาหาร", value: "restaurant" },
          { title: "คลินิก / สุขภาพ", value: "health" },
          { title: "ที่พัก", value: "hotel" },
          { title: "สัตว์เลี้ยง", value: "pets" },
          { title: "ดอกไม้ / สวน", value: "plants" },
          { title: "ค้าปลีก", value: "retail" },
          { title: "อื่น ๆ", value: "other" },
        ],
      },
    }),
    defineField({
      name: "published",
      title: "แสดงใน Showroom (Live)",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "architectureStack",
      title: "Architecture stack (Showroom card)",
      type: "string",
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "projectOneHero",
    }),
    defineField({
      name: "menuOrServices",
      title: "เมนู / บริการ",
      type: "array",
      of: [defineArrayMember({ type: "menuOrServiceItem" })],
    }),
    defineField({
      name: "reviews",
      title: "รีวิว",
      type: "array",
      of: [defineArrayMember({ type: "reviewItem" })],
    }),
    defineField({
      name: "locationInfo",
      title: "ที่ตั้งและเวลาเปิดปิด",
      type: "locationInfo",
    }),
    defineField({
      name: "gallery",
      title: "แกลเลอรีบรรยากาศ",
      type: "array",
      of: [defineArrayMember({ type: "galleryImage" })],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
      published: "published",
      media: "hero.image",
    },
    prepare: ({ title, slug, published, media }) => ({
      title: title || "Untitled demo",
      subtitle: `${slug || "no-slug"}${published === false ? " · hidden" : " · live"}`,
      media,
    }),
  },
});
