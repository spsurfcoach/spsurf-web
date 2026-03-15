import { defineArrayMember, defineField, defineType } from "sanity";

export const surftrip = defineType({
  name: "surftrip",
  title: "Surftrip",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "level",
      title: "Level",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(320),
    }),
    defineField({
      name: "groupSize",
      title: "Group Size",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "hospedaje",
      title: "Hospedaje",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "duracion",
      title: "Duración",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "aeropuerto",
      title: "Aeropuerto",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cardImage",
      title: "Card Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "available",
      title: "Available Spots",
      type: "number",
      initialValue: 8,
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "capacity",
      title: "Total Capacity",
      type: "number",
      initialValue: 12,
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "contentBlocks",
      title: "Content Blocks",
      type: "array",
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({ type: "heroBlock" }),
        defineArrayMember({ type: "richTextBlock" }),
        defineArrayMember({ type: "imageBlock" }),
        defineArrayMember({ type: "galleryBlock" }),
        defineArrayMember({ type: "ctaBlock" }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "country",
      media: "cardImage",
      available: "available",
      capacity: "capacity",
    },
    prepare({ title, subtitle, media, available, capacity }) {
      return {
        title,
        subtitle: `${subtitle || "No country"} - ${available ?? 0}/${capacity ?? 0} cupos`,
        media,
      };
    },
  },
});
