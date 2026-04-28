import { defineField, defineType } from "sanity";

export const surftripPackageSection = defineType({
  name: "surftripPackageSection",
  title: "Surfcamp Package Section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
    defineField({
      name: "priceLabel",
      title: "Price Label",
      type: "string",
      validation: (rule) => rule.required(),
      description: "Examples: USD$1000 or Desde S/1800.",
    }),
    defineField({
      name: "priceSuffix",
      title: "Price Suffix",
      type: "string",
      initialValue: "Precio por persona",
    }),
    defineField({
      name: "depositNote",
      title: "Deposit Note",
      type: "string",
    }),
    defineField({
      name: "columns",
      title: "Package Columns",
      type: "array",
      of: [{ type: "surftripPackageColumn" }],
      validation: (rule) => rule.required().min(1).max(4),
    }),
    defineField({
      name: "addons",
      title: "Add-ons",
      type: "array",
      of: [{ type: "surftripPackageAddon" }],
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ctaHref",
      title: "CTA Link",
      type: "string",
      validation: (rule) => rule.required(),
      description: "Use routes, anchors, or full URLs.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "priceLabel",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Package section",
        subtitle: subtitle || "Price",
      };
    },
  },
});
