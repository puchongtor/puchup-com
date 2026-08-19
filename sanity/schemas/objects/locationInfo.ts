import { defineArrayMember, defineField, defineType } from "sanity";

export const locationInfo = defineType({
  name: "locationInfo",
  title: "Location",
  type: "object",
  fields: [
    defineField({
      name: "address",
      title: "ที่อยู่",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "hours",
      title: "เวลาเปิดปิด",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "openingHours",
          fields: [
            defineField({ name: "days", title: "วัน", type: "string" }),
            defineField({ name: "time", title: "เวลา", type: "string" }),
          ],
          preview: {
            select: { title: "days", subtitle: "time" },
          },
        }),
      ],
    }),
    defineField({
      name: "phone",
      title: "โทรศัพท์",
      type: "string",
    }),
    defineField({
      name: "mapsUrl",
      title: "ลิงก์ Google Maps",
      type: "url",
    }),
    defineField({
      name: "mapsEmbedUrl",
      title: "Google Maps embed URL",
      type: "url",
    }),
  ],
});
